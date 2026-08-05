import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient, IClientOptions } from 'mqtt';
import { appendLog } from '../../common/logger';
import { SENSORS } from './sensors';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: MqttClient | null = null;
  private readonly latestMessages = new Map<string, unknown>();

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('mqtt.host', 'localhost');
    const port = this.configService.get<number>('mqtt.port', 1883);
    const username = this.configService.get<string>('mqtt.username', '');
    const password = this.configService.get<string>('mqtt.password', '');
    const clientId = this.configService.get<string>('mqtt.clientId', 'nest-scada-client');

    const protocol = port === 8883 ? 'mqtts' : 'mqtt';
    const brokerUrl = `${protocol}://${host}:${port}`;
    console.log(`Conectando ao broker MQTT em ${brokerUrl} com clientId ${clientId}...`);
    const options: IClientOptions = {
      clientId,
      clean: true,
      protocolVersion: 4,
      reconnectPeriod: 5000,
    };

    if (username) {
      options.username = username;
    }

    if (password) {
      options.password = password;
    }

    this.client = connect(brokerUrl, options);
    console.log(`Tentando conectar ao broker MQTT em ${brokerUrl}...`);
    this.client.on('connect', () => {
      appendLog(`Conectado ao broker MQTT em ${brokerUrl}`);
      const topics = SENSORS.map((sensor) => sensor.topic);

      this.client?.subscribe(topics, (error) => {
        if (!error) {
          console.log(`Inscrições feitas para ${topics.length} tópicos`);
          appendLog(`Inscrições feitas para ${topics.length} tópicos`);
        } else {
          console.error(`Falha ao se inscrever nos tópicos: ${error.message}`);
          appendLog(`Falha ao se inscrever nos tópicos: ${error.message}`);
        }
      });
    });

    this.client.on('message', (topic, payload) => {
      const message = payload.toString();
      this.latestMessages.set(topic, message);
      appendLog(`Mensagem recebida em ${topic}: ${message}`);
    });

    this.client.on('error', (error) => {
      appendLog(`Erro de conexão MQTT: ${error.message}`);
    });
  }

  onModuleDestroy() {
    this.client?.end(true);
  }

  subscribe(topic: string) {
    if (!this.client?.connected) {
      appendLog(`Cliente não conectado; não foi possível assinar ${topic}`);
      return;
    }

    this.client.subscribe(topic, (error) => {
      if (!error) {
        appendLog(`Inscrito no tópico: ${topic}`);
      } else {
        appendLog(`Falha ao se inscrever em ${topic}: ${error.message}`);
      }
    });
  }

  publish(topic: string, payload: unknown) {
    if (!this.client?.connected) {
      appendLog(`Cliente não conectado; não foi possível publicar em ${topic}`);
      return;
    }

    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    this.client.publish(topic, message);
    appendLog(`Publicando em ${topic}: ${message}`);
  }

  getLatestMessages() {
    return Object.fromEntries(this.latestMessages.entries());
  }

  getLatestMessage(topic: string) {
    return this.latestMessages.get(topic) ?? null;
  }
}
