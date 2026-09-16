"use client"

import { Card, CardContent } from "@/components/ui/card"
import { fmtDelta, fmtNumber } from "@/lib/format"

export function MetricCard({
  label,
  value,
  delta,
}: {
  label: string
  value: unknown
  delta?: unknown
}) {
  const d = fmtDelta(delta)
  const toneClass =
    d.tone === "up"
      ? "text-emerald-400"
      : d.tone === "down"
        ? "text-red-400"
        : "text-muted-foreground"

  return (
    <Card>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 font-heading text-2xl font-semibold tabular-nums tracking-tight">
          {fmtNumber(value)}
        </div>
        <div className={`mt-1 text-xs tabular-nums ${toneClass}`}>{d.text}</div>
      </CardContent>
    </Card>
  )
}
