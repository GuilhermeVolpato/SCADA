"use client";

import { useEffect, useRef, useState } from "react";
import {
  createMqttStream,
  type MqttMessageEvent,
} from "@/app/api/microservices/mqtt/endpoints";
import {
  SECURITY_TOPICS,
  SENSOR_META,
  type IncidentEvent,
  type SensorValues,
} from "@/lib/sensors";

const MAX_INCIDENTS = 20;

export function useMqttSensorStream() {
  const [values, setValues] = useState<SensorValues>({});
  const [events, setEvents] = useState<IncidentEvent[]>([]);
  const [totalReadings, setTotalReadings] = useState(0);
  const lastSecurityValue = useRef<Record<string, string>>({});

  useEffect(() => {
    let eventSource: EventSource | undefined;

    try {
      eventSource = createMqttStream((event: MqttMessageEvent) => {
        setTotalReadings((count) => count + 1);

        if (SECURITY_TOPICS.has(event.topic)) {
          const previous = lastSecurityValue.current[event.topic];
          if (event.message === "1" && previous !== "1") {
            const meta = SENSOR_META.find((sensor) => sensor.topic === event.topic);
            setEvents((prev) =>
              [
                {
                  id: `${event.topic}-${Date.now()}`,
                  topic: event.topic,
                  label: meta?.label ?? event.topic,
                  timestamp: Date.now(),
                },
                ...prev,
              ].slice(0, MAX_INCIDENTS)
            );
          }
          lastSecurityValue.current[event.topic] = event.message;
        }

        setValues((prev) => ({
          ...prev,
          [event.topic]: { value: event.message, timestamp: Date.now() },
        }));
      });
    } catch (error) {
      console.error("Error creating MQTT stream:", error);
    }

    return () => eventSource?.close();
  }, []);

  return { values, events, totalReadings };
}
