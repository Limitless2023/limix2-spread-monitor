"use client"

import { HourlyTable } from "@/components/hourly-table"
import { historyOf } from "@/lib/media"
import type { Limix2Data } from "@/lib/types"

export function HourlyTab({ data }: { data: Limix2Data }) {
  const history = historyOf(data)
  return (
    <div className="space-y-3">
      <h2 className="text-base font-medium">
        小时存档{" "}
        <span className="text-sm font-normal text-muted-foreground">
          共 {history.length} 条快照 · 新→旧
        </span>
      </h2>
      <HourlyTable history={history} />
    </div>
  )
}
