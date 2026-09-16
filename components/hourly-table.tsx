"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fmtNumber } from "@/lib/format"
import { organicMediaCount } from "@/lib/media"
import type { Snapshot } from "@/lib/types"

export function HourlyTable({ history }: { history: Snapshot[] }) {
  if (!history.length) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">暂无小时存档</p>
        </CardContent>
      </Card>
    )
  }

  const rows = [...history].reverse()

  return (
    <Card>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>上海时间</TableHead>
              <TableHead>GH★</TableHead>
              <TableHead>fork</TableHead>
              <TableHead>HF likes</TableHead>
              <TableHead>HF downloads</TableHead>
              <TableHead>投放数</TableHead>
              <TableHead>自发媒体数</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((snap, idx) => {
              const mediaN = organicMediaCount(snap)
              const notes = (snap.notes || []).join("；") || "—"
              return (
                <TableRow key={snap.ts_utc || snap.ts_shanghai || String(idx)}>
                  <TableCell className="tabular-nums whitespace-nowrap">
                    {snap.ts_shanghai || "—"}
                  </TableCell>
                  <TableCell className="tabular-nums">{fmtNumber(snap.github?.stars)}</TableCell>
                  <TableCell className="tabular-nums">{fmtNumber(snap.github?.forks)}</TableCell>
                  <TableCell className="tabular-nums">{fmtNumber(snap.hf?.likes)}</TableCell>
                  <TableCell className="tabular-nums">
                    {fmtNumber(snap.hf?.downloads)}
                  </TableCell>
                  <TableCell className="tabular-nums">{fmtNumber(snap.seeded_count)}</TableCell>
                  <TableCell className="tabular-nums">
                    {mediaN == null ? "—" : fmtNumber(mediaN)}
                  </TableCell>
                  <TableCell className="max-w-[420px] whitespace-normal text-muted-foreground">
                    {notes}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
