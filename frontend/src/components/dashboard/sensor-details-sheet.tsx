import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SensorDetailRow } from "@/components/dashboard/sensor-detail-row";
import type { SensorMeta, SensorValues } from "@/lib/sensors";

type SensorDetailsSheetProps = {
  sensors: SensorMeta[];
  values: SensorValues;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SensorDetailsSheet({
  sensors,
  values,
  open,
  onOpenChange,
}: SensorDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="sm">
            Expandir
            <Maximize2 className="size-3.5" />
          </Button>
        }
      />
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Sensores em tempo real</SheetTitle>
          <SheetDescription>
            Última leitura de cada sensor conectado à planta.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 overflow-y-auto px-4 pb-4">
          {sensors.map((sensor) => (
            <SensorDetailRow key={sensor.topic} sensor={sensor} reading={values[sensor.topic]} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
