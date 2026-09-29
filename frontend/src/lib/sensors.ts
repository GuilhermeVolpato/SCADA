import { Droplets, Flame, Move, Thermometer, Wind, type LucideIcon } from "lucide-react";

export type SensorMeta = {
  topic: string;
  label: string;
  icon: LucideIcon;
};

export type SensorReading = {
  value: string;
  timestamp: number;
};

export type SensorValues = Record<string, SensorReading>;

export type IncidentEvent = {
  id: string;
  topic: string;
  label: string;
  timestamp: number;
};

export const TOPICS = {
  fire: "miniscada/seguranca/fogo",
  gas: "miniscada/ambiente/gas",
  temperature: "miniscada/ambiente/temperatura",
  humidity: "miniscada/ambiente/umidade",
  motion: "miniscada/seguranca/movimento",
} as const;

export const SENSOR_META: SensorMeta[] = [
  { topic: TOPICS.fire, label: "Fogo", icon: Flame },
  { topic: TOPICS.gas, label: "Gás", icon: Wind },
  { topic: TOPICS.temperature, label: "Temperatura", icon: Thermometer },
  { topic: TOPICS.humidity, label: "Umidade", icon: Droplets },
  { topic: TOPICS.motion, label: "Movimento", icon: Move },
];

export const SECURITY_TOPICS = new Set<string>([TOPICS.fire, TOPICS.motion]);

export function isSensorAlarmActive(
  sensor: Pick<SensorMeta, "topic">,
  reading?: SensorReading
) {
  return SECURITY_TOPICS.has(sensor.topic) && reading?.value === "1";
}
