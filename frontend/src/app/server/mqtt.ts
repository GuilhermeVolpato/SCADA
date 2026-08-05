import mqtt, { MqttClient } from "mqtt";

export type SensorReading = {
  value: string;
  timestamp: number;
};

const latestValues = new Map<string, SensorReading>();

let client: MqttClient | null = null;

export const SENSORS = [
  { topic: "miniscada/ambiente/gas", label: "Gás" },
  { topic: "miniscada/ambiente/temperatura", label: "Temperatura" },
  { topic: "miniscada/ambiente/umidade", label: "Umidade" },
  { topic: "miniscada/seguranca/fogo", label: "Fogo" },
  { topic: "miniscada/seguranca/movimento", label: "Movimento" },
];

function connectToMQTT(): MqttClient {
  const mqttServer = process.env.SECRET_MQTT_SERVER ?? "";
  const mqttPort = parseInt(process.env.SECRET_MQTT_PORT ?? "8883", 10);
  const mqttUsername = process.env.SECRET_SSID_MQTT ?? "";
  const mqttPassword = process.env.SECRET_PASS_MQTT ?? "";
  const mqttWebSocketPort = parseInt(process.env.SECRET_MQTT_WEBSOCKET_PORT ?? "8884", 10);

  const newClient = mqtt.connect({
    host: mqttServer,
    port: mqttWebSocketPort,
    protocol: "mqtts",
    username: mqttUsername,
    password: mqttPassword,
  });

  newClient.on("connect", () => {
    console.log("Conectado ao broker HiveMQ");
    newClient.subscribe("miniscada/#");
  });

  newClient.on("message", (topic, payload) => {
    latestValues.set(topic, { value: payload.toString(), timestamp: Date.now() });
  });

  newClient.on("error", (err) => {
    console.error("Erro na conexão MQTT:", err);
  });

  return newClient;
}

export function getMqttClient(): MqttClient {
  if (!client) {
    client = connectToMQTT();
  }
  return client;
}

export function getLatestSensorValues(): Record<string, SensorReading> {
  getMqttClient();
  return Object.fromEntries(latestValues);
}
