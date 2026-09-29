import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    // usar mqtt service para obter dados em tempo real
    this.logger.log('Retornando dados em tempo real do mqtt');
    const latestMessages = this.mqttService.getLatestMessages();
    return {
      source: 'mqtt',
      message: 'Conectado ao broker para visualização em tempo real',
      data: latestMessages,
    };
  }

  getLiveDataStream(): Observable<MessageEvent> {
    this.logger.log('Retornando stream de dados em tempo real do mqtt');
    return this.mqttService.messages.pipe(map((event) => ({ data: event })));
  }

  getHistoricalData() {
    this.logger.log('Retornando dados históricos da telemetry');
    return {
      source: 'telemetry',
      message: 'Histórico disponível para o dashboard',
    };
  }
}
