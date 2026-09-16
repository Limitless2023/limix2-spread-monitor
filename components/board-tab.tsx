"use client"

import { AlertTriangle } from "lucide-react"

import { MetricCard } from "@/components/metric-card"
import { TrendCharts } from "@/components/trend-charts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import {
  classificationOf,
  collectMediaItems,
  historyOf,
  isAnchorItem,
} from "@/lib/media"
import type { Limix2Data } from "@/lib/types"

export function BoardTab({ data }: { data: Limix2Data }) {
  const latest = data.latest || {}
  const deltas = latest.deltas || {}
  const github = latest.github || {}
  const hf = latest.hf || {}
  const counts = data.counts || {}
  const history = historyOf(data)
  const allItems = collectMediaItems(data)
  const mediaItems = allItems.filter((item) => !isAnchorItem(item))
  const seededN = latest.seeded_count ?? counts.seeded ?? (data.seeded || []).length
  const organicMediaN =
    latest.organic_media_count ??
    counts.organic_media ??
    mediaItems.filter((item) => classificationOf(item) === "organic").length

  const warnings = [...(data.warnings || [])]
  if (github.warning) warnings.push(github.warning)

  const notes = latest.notes || []

  return (
    <div className="space-y-6">
      {warnings.length > 0 && (
        <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-50">
          <AlertTriangle />
          <AlertTitle>采集说明</AlertTitle>
          <AlertDescription className="text-amber-100/85">
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="GitHub Stars（整仓）" value={github.stars} delta={deltas.github?.stars} />
        <MetricCard label="GitHub Forks（整仓）" value={github.forks} delta={deltas.github?.forks} />
        <MetricCard label="HF Likes" value={hf.likes} delta={deltas.hf?.likes} />
        <MetricCard label="HF Downloads" value={hf.downloads} delta={deltas.hf?.downloads} />
        <MetricCard label="Watchers" value={github.watchers} delta={deltas.github?.watchers} />
        <MetricCard label="Open Issues" value={github.open_issues} delta={deltas.github?.open_issues} />
        <MetricCard label="投放条目" value={seededN} delta={deltas.seeded_count} />
        <MetricCard label="自发媒体" value={organicMediaN} delta={deltas.organic_count} />
      </div>

      <div>
        <h2 className="mb-3 text-base font-medium">小时级趋势</h2>
        <TrendCharts history={history} />
      </div>

      <div>
        <h2 className="mb-3 text-base font-medium">本小时备注</h2>
        <Card>
          <CardContent>
            {notes.length ? (
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">无</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
