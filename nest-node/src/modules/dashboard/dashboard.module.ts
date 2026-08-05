import { Module } from '@nestjs/common';
import { MqttModule } from '../mqtt/mqtt.module';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [MqttModule, TelemetryModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
