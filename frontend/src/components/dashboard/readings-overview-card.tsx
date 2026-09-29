import { Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReadingsOverviewCardProps = {
  gasReading: number;
  temperatureReading: number;
  onlinePercentage: number;
};

type ReadingBarProps = {
  value: number;
  label: string;
  unit?: string;
  barClassName: string;
};

function ReadingBar({ value, label, unit = "", barClassName }: ReadingBarProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
      <span className="text-xs font-medium">
        {value || 0}
        {unit}
      </span>
      <div
        className={cn("w-10 rounded-t-md transition-all duration-500", barClassName)}
        style={{ height: `${Math.min(100, Math.max(4, value))}%` }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function ReadingsOverviewCard({
  gasReading,
  temperatureReading,
  onlinePercentage,
}: ReadingsOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Gauge className="size-4" />
          Leituras atuais
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-36 items-end gap-6 px-6">
        <ReadingBar value={gasReading} label="Gás" barClassName="bg-primary" />
        <ReadingBar
          value={temperatureReading}
          label="Temp."
          unit="°"
          barClassName="bg-primary/50"
        />
        <div
          className="flex size-20 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(var(--color-primary) ${onlinePercentage}%, var(--color-muted) 0)`,
          }}
        >
          <div className="flex size-15 items-center justify-center rounded-full bg-card text-xs font-semibold">
            {onlinePercentage}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
