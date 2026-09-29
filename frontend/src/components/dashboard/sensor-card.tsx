import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isSensorAlarmActive, type SensorMeta, type SensorReading } from "@/lib/sensors";

type SensorCardProps = {
  sensor: SensorMeta;
  reading?: SensorReading;
};

export const SensorCard = memo(function SensorCard({ sensor, reading }: SensorCardProps) {
  const isActive = isSensorAlarmActive(sensor, reading);
  const Icon = sensor.icon;

  return (
    <Card className="w-44 shrink-0 snap-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
          <Icon className="size-3.5" />
          ESP32 - {sensor.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className={cn("text-3xl font-semibold", isActive && "text-destructive")}>
          {reading?.value ?? "-"}
        </span>
      </CardContent>
    </Card>
  );
});
