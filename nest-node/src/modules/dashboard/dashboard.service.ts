import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { TelemetryService } from '../telemetry/telemetry.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly mqttService: MqttService,
    private readonly telemetryService: TelemetryService,
  ) {}

  getSnapshot() {
    this.logger.log('Gerando snapshot do dashboard');
    return {
      status: 'ok',
      message: 'Dados prontos para o dashboard',
      live: this.getLiveData(),
      history: this.getHistoricalData(),
    };
  }

  getLiveData() {
    this.logger.log('Retornando dados ao vivo do MQTT');
    return {
      source: 'mqtt',
      message: 'Conectado ao broker para visualização em tempo real',
    };
  }

  getHistoricalData() {
    this.logger.log('Retornando dados históricos da telemetry');
    return {
      source: 'telemetry',
      message: 'Histórico disponível para o dashboard',
    };
  }
}
