import axios from "axios";


const Config = {
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const api_mqtt = axios.create(Config);

api_mqtt.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api_mqtt.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // handle unauthorized error, e.g., redirect to login page
      console.error("Unauthorized access - redirecting to login.");
      // window.location.href = "/login"; // Uncomment this line to enable redirection
    }
    return Promise.reject(error);
  }
);



export default api_mqtt;