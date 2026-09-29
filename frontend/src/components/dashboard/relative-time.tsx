"use client";

import { useNow } from "@/hooks/use-now";
import { formatRelativeTime } from "@/lib/format";

type RelativeTimeProps = {
  timestamp?: number;
  fallback?: string;
  className?: string;
};

export function RelativeTime({
  timestamp,
  fallback = "sem dados",
  className,
}: RelativeTimeProps) {
  const now = useNow();

  return (
    <span className={className}>
      {timestamp ? formatRelativeTime(timestamp, now) : fallback}
    </span>
  );
}
