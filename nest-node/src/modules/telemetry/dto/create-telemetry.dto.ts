import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateTelemetryDto {
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}
