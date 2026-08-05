import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(private readonly mqttService: MqttService) {}

  saveReading(payload: CreateTelemetryDto) {
    this.logger.log(`Persistindo leitura: ${JSON.stringify(payload)}`);
    this.mqttService.publish('scada/telemetry', payload);
    return { received: true, payload };
  }
}
