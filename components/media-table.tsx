"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fmtEngagement, fmtTime } from "@/lib/format"
import {
  classificationOf,
  engagementOf,
  engagementValue,
  publishOf,
} from "@/lib/media"
import type { MediaItem } from "@/lib/types"

function ClassBadge({ item }: { item: MediaItem }) {
  const cls = classificationOf(item)
  if (cls === "seeded") {
    return (
      <Badge variant="secondary" className="border-violet-500/40 bg-violet-500/15 text-violet-200">
        投放
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="border-teal-500/40 bg-teal-500/15 text-teal-200">
      自发
    </Badge>
  )
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = status || "—"
  if (s === "online") {
    return (
      <Badge variant="secondary" className="border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
        {s}
      </Badge>
    )
  }
  if (s === "fetch_failed" || s === "missing_url") {
    return <Badge variant="destructive">{s}</Badge>
  }
  return <Badge variant="outline">{s}</Badge>
}

function EngCell({ value }: { value: unknown }) {
  const text = fmtEngagement(value)
  return (
    <span className={text === "未公开" ? "text-muted-foreground" : "tabular-nums"}>
      {text}
    </span>
  )
}

export function MediaTable({ items }: { items: MediaItem[] }) {
  if (!items.length) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground">暂无记录</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>渠道</TableHead>
              <TableHead>标题</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>首次发现</TableHead>
              <TableHead>最近见到</TableHead>
              <TableHead>发布时间</TableHead>
              <TableHead>阅读量</TableHead>
              <TableHead>点赞</TableHead>
              <TableHead>转发</TableHead>
              <TableHead>评论</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => {
              const engagement = engagementOf(item)
              const url = item.url || ""
              return (
                <TableRow key={item.id || url || String(idx)}>
                  <TableCell>{item.channel || "—"}</TableCell>
                  <TableCell className="max-w-[260px] whitespace-normal">
                    {item.title || "—"}
                  </TableCell>
                  <TableCell className="max-w-[240px]">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={url}
                        className="block truncate text-primary underline-offset-4 hover:underline"
                      >
                        {url}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <ClassBadge item={item} />
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {fmtTime(item.first_seen)}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {fmtTime(item.last_seen)}
                  </TableCell>
                  <TableCell className="max-w-[180px] whitespace-normal tabular-nums text-muted-foreground">
                    {fmtTime(publishOf(item))}
                  </TableCell>
                  <TableCell>
                    <EngCell value={engagementValue(engagement, "views")} />
                  </TableCell>
                  <TableCell>
                    <EngCell value={engagementValue(engagement, "likes")} />
                  </TableCell>
                  <TableCell>
                    <EngCell value={engagementValue(engagement, "shares")} />
                  </TableCell>
                  <TableCell>
                    <EngCell value={engagementValue(engagement, "comments")} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
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
