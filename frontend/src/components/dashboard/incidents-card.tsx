import { memo } from "react";
import { Siren } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RelativeTime } from "@/components/dashboard/relative-time";
import type { IncidentEvent } from "@/lib/sensors";

type IncidentsCardProps = {
  events: IncidentEvent[];
};

const IncidentItem = memo(function IncidentItem({ event }: { event: IncidentEvent }) {
  return (
    <li className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50">
      <span className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-destructive" />
        {event.label}
      </span>
      <RelativeTime timestamp={event.timestamp} className="text-xs text-muted-foreground" />
    </li>
  );
});

export function IncidentsCard({ events }: IncidentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Siren className="size-4" />
          Últimos incidentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhum incidente registrado nesta sessão.
          </p>
        ) : (
          <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {events.map((event) => (
              <IncidentItem key={event.id} event={event} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
