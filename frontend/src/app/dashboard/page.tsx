"use client";

import { useState } from "react";
import { IncidentsCard } from "@/components/dashboard/incidents-card";
import { LiveSensorsPanel } from "@/components/dashboard/live-sensors-panel";
import { ReadingsOverviewCard } from "@/components/dashboard/readings-overview-card";
import { StatsSummary } from "@/components/dashboard/stats-summary";
import { useMqttSensorStream } from "@/hooks/use-mqtt-sensor-stream";
import { SENSOR_META, TOPICS } from "@/lib/sensors";

export default function Dashboard() {
  const { values, events, totalReadings } = useMqttSensorStream();
  const [sessionStart] = useState(() => Date.now());

  const onlineCount = Object.keys(values).length;
  const onlinePercentage = Math.round((onlineCount / SENSOR_META.length) * 100);
  const gasReading = Number(values[TOPICS.gas]?.value ?? 0);
  const temperatureReading = Number(values[TOPICS.temperature]?.value ?? 0);

  return (
    <main className="p-4 sm:ml-14">
      <LiveSensorsPanel sensors={SENSOR_META} values={values} />

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">Dados históricos</h2>

        <StatsSummary
          onlineCount={onlineCount}
          totalSensors={SENSOR_META.length}
          totalReadings={totalReadings}
          incidentsCount={events.length}
          sessionStart={sessionStart}
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <ReadingsOverviewCard
            gasReading={gasReading}
            temperatureReading={temperatureReading}
            onlinePercentage={onlinePercentage}
          />
          <IncidentsCard events={events} />
        </div>
      </section>
    </main>
  );
}
