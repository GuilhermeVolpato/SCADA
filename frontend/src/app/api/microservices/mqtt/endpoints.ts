import api_mqtt from './api-config';

export type MqttMessageEvent = {
  topic: string;
  message: string;
};

export const createMqttStream = (
  onMessage: (event: MqttMessageEvent) => void,
  onError?: (error: Event) => void,
) => {
  const url = `${api_mqtt.defaults.baseURL}/dashboard/live/stream`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    const parsed: MqttMessageEvent = JSON.parse(event.data);
    onMessage(parsed);
  };

  eventSource.onerror = (error) => {
    console.log('Erro na conexão SSE com o MQTT:', error);
    onError?.(error);
  };

  return eventSource;
};