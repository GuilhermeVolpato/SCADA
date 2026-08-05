import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  receiveReading(@Body() payload: CreateTelemetryDto) {
    return this.telemetryService.saveReading(payload);
  }
}
