import { memo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  icon: LucideIcon;
  value: ReactNode;
  label: string;
};

export const StatCard = memo(function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <Icon className="size-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xl font-semibold">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
});
