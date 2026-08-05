"use client";

import { useEffect, useState } from "react";
import { SENSORS } from "../server/mqtt";

type SensorReading = {
  value: string;
  timestamp: number;
};

type SensorValues = Record<string, SensorReading>;


export default function Dashboard() {
  const [values, setValues] = useState<SensorValues>({});

  useEffect(() => {
    const fetchValues = async () => {
      const res = await fetch("/api/sensors");
      const data = await res.json();
      setValues(data);
    };

    fetchValues();
    const interval = setInterval(fetchValues, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-4">
        {SENSORS.map((sensor) => {
          const reading = values[sensor.topic];
          return (
            <div key={sensor.topic} className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold">{sensor.label}</h2>
              <p className="text-2xl">{reading?.value ?? "--"}</p>
              {reading && (
                <p className="text-xs text-gray-500">
                  {new Date(reading.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
