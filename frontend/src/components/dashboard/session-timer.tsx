"use client";

import { useNow } from "@/hooks/use-now";
import { formatElapsed } from "@/lib/format";

type SessionTimerProps = {
  startedAt: number;
};

export function SessionTimer({ startedAt }: SessionTimerProps) {
  const now = useNow();
  return <>{formatElapsed((now - startedAt) / 1000)}</>;
}
