import { Badge } from "@/components/ui/badge";

export function LiveIndicator() {
  return (
    <Badge variant="destructive" className="gap-1.5">
      <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
      AO VIVO
    </Badge>
  );
}
