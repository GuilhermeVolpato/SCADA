"use client";

import { useState } from "react";
import { LiveIndicator } from "@/components/dashboard/live-indicator";
import { SensorCarousel } from "@/components/dashboard/sensor-carousel";
import { SensorDetailsSheet } from "@/components/dashboard/sensor-details-sheet";
import type { SensorMeta, SensorValues } from "@/lib/sensors";

type LiveSensorsPanelProps = {
  sensors: SensorMeta[];
  values: SensorValues;
};

export function LiveSensorsPanel({ sensors, values }: LiveSensorsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="rounded-2xl border p-4">
      <div className="mb-4 flex items-center justify-between">
        <LiveIndicator />
        <SensorDetailsSheet
          sensors={sensors}
          values={values}
          open={expanded}
          onOpenChange={setExpanded}
        />
      </div>

      <SensorCarousel sensors={sensors} values={values} />
    </section>
  );
}
