import { Activity, Clock, Radio, Siren } from "lucide-react";
import { SessionTimer } from "@/components/dashboard/session-timer";
import { StatCard } from "@/components/dashboard/stat-card";

type StatsSummaryProps = {
  onlineCount: number;
  totalSensors: number;
  totalReadings: number;
  incidentsCount: number;
  sessionStart: number;
};

export function StatsSummary({
  onlineCount,
  totalSensors,
  totalReadings,
  incidentsCount,
  sessionStart,
}: StatsSummaryProps) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard icon={Radio} value={`${onlineCount}/${totalSensors}`} label="Sensores online" />
      <StatCard icon={Activity} value={totalReadings} label="Leituras na sessão" />
      <StatCard icon={Siren} value={incidentsCount} label="Incidentes" />
      <StatCard icon={Clock} value={<SessionTimer startedAt={sessionStart} />} label="Tempo de sessão" />
    </div>
  );
}
