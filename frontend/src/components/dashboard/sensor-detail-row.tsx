import { memo } from "react";
import { RelativeTime } from "@/components/dashboard/relative-time";
import { cn } from "@/lib/utils";
import { isSensorAlarmActive, type SensorMeta, type SensorReading } from "@/lib/sensors";

type SensorDetailRowProps = {
  sensor: SensorMeta;
  reading?: SensorReading;
};

export const SensorDetailRow = memo(function SensorDetailRow({
  sensor,
  reading,
}: SensorDetailRowProps) {
  const isActive = isSensorAlarmActive(sensor, reading);
  const Icon = sensor.icon;

  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-full bg-muted",
            isActive && "bg-destructive/10 text-destructive"
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{sensor.label}</span>
          <span className="text-xs text-muted-foreground">{sensor.topic}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={cn("text-lg font-semibold", isActive && "text-destructive")}>
          {reading?.value ?? "-"}
        </span>
        <RelativeTime timestamp={reading?.timestamp} className="text-xs text-muted-foreground" />
      </div>
    </div>
  );
});
