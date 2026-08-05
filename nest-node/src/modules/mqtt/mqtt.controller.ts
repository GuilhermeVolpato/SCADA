import { Controller, Get, Inject, Param } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  constructor(@Inject(MqttService) private readonly mqttService: MqttService) {}

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'mqtt' };
  }

  @Get('subscribe/:topic')
  subscribe(@Param('topic') topic: string) {
    this.mqttService.subscribe(topic);
    return { subscribed: true, topic };
  }

  @Get('latest')
  getLatestMessages() {
    return this.mqttService.getLatestMessages();
  }

  @Get('latest/:topic')
  getLatestMessage(@Param('topic') topic: string) {
    return this.mqttService.getLatestMessage(topic);
  }
}
