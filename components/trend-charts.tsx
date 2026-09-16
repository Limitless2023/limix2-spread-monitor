"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { chartTick, fmtNumber } from "@/lib/format"
import { organicMediaCount } from "@/lib/media"
import type { Snapshot } from "@/lib/types"

const COLORS = {
  stars: "#60a5fa",
  forks: "#fbbf24",
  likes: "#c4b5fd",
  downloads: "#2dd4bf",
  seeded: "#a78bfa",
  organic: "#5eead4",
  newOrganic: "#34d399",
}

type Series = { key: string; name: string; color: string }

function toChartRows(history: Snapshot[]) {
  return history.map((snap) => {
    const mediaN = organicMediaCount(snap)
    return {
      label: chartTick(snap.ts_shanghai),
      stars: snap.github?.stars ?? null,
      forks: snap.github?.forks ?? null,
      likes: snap.hf?.likes ?? null,
      downloads: snap.hf?.downloads ?? null,
      seeded: snap.seeded_count ?? null,
      organic: mediaN == null ? (snap.organic_count ?? null) : mediaN,
      newOrganic: Array.isArray(snap.organic_new) ? snap.organic_new.length : null,
    }
  })
}

function TrendCard({
  title,
  data,
  series,
  dualAxis = false,
}: {
  title: string
  data: ReturnType<typeof toChartRows>
  series: Series[]
  dualAxis?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              暂无趋势数据
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: dualAxis ? 8 : 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  minTickGap={24}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  allowDecimals={false}
                  domain={["auto", "auto"]}
                />
                {dualAxis ? (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    allowDecimals={false}
                    domain={["auto", "auto"]}
                  />
                ) : null}
                <ChartTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [fmtNumber(value), String(name)]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {series.map((s, i) => (
                  <Line
                    key={s.key}
                    yAxisId={dualAxis && i === 1 ? "right" : "left"}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={{ r: 2.5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function TrendCharts({ history }: { history: Snapshot[] }) {
  const data = toChartRows(history)
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <TrendCard
        title="GitHub Stars / Forks（整仓累计）"
        data={data}
        dualAxis
        series={[
          { key: "stars", name: "Stars", color: COLORS.stars },
          { key: "forks", name: "Forks", color: COLORS.forks },
        ]}
      />
      <TrendCard
        title="Hugging Face Likes / Downloads"
        data={data}
        dualAxis
        series={[
          { key: "likes", name: "Likes", color: COLORS.likes },
          { key: "downloads", name: "Downloads", color: COLORS.downloads },
        ]}
      />
      <TrendCard
        title="投放数 / 自发媒体数"
        data={data}
        series={[
          { key: "seeded", name: "投放", color: COLORS.seeded },
          { key: "organic", name: "自发媒体", color: COLORS.organic },
        ]}
      />
      <TrendCard
        title="本小时新增自发"
        data={data}
        series={[{ key: "newOrganic", name: "新增自发", color: COLORS.newOrganic }]}
      />
    </div>
  )
}
