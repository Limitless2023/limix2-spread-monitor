"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { BoardTab } from "@/components/board-tab"
import { HourlyTab } from "@/components/hourly-tab"
import { MediaTab } from "@/components/media-tab"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fmtNumber } from "@/lib/format"
import { loadLimix2Data } from "@/lib/load-data"
import { classificationOf, collectMediaItems, historyOf, isAnchorItem } from "@/lib/media"
import type { Limix2Data } from "@/lib/types"

const TAB_VALUES = ["board", "media", "hourly"] as const
type TabValue = (typeof TAB_VALUES)[number]

function isTabValue(value: string): value is TabValue {
  return (TAB_VALUES as readonly string[]).includes(value)
}

function subscribeHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange)
  window.addEventListener("popstate", onStoreChange)
  return () => {
    window.removeEventListener("hashchange", onStoreChange)
    window.removeEventListener("popstate", onStoreChange)
  }
}

function tabFromLocation(): TabValue {
  const hash = window.location.hash.replace(/^#/, "")
  return isTabValue(hash) ? hash : "board"
}

export function MonitorApp() {
  const [data, setData] = useState<Limix2Data | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const tab = useSyncExternalStore(subscribeHash, tabFromLocation, () => "board")

  useEffect(() => {
    let cancelled = false
    loadLimix2Data()
      .then((payload) => {
        if (cancelled) return
        if (!payload || !payload.latest) {
          setError("未加载到 data.js（window.LIMIX2_DATA）。请先运行采集脚本并写入 public/data.js。")
          setData(payload)
        } else {
          setData(payload)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "数据加载失败")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function onTabChange(value: string) {
    if (!isTabValue(value)) return
    const next = `#${value}`
    if (window.location.hash === next) return
    try {
      history.replaceState(null, "", next)
      window.dispatchEvent(new Event("hashchange"))
    } catch {
      window.location.hash = value
    }
  }

  const latest = data?.latest
  const arxiv = latest?.arxiv
  const counts = data?.counts || {}
  const allItems = data ? collectMediaItems(data) : []
  const mediaItems = allItems.filter((item) => !isAnchorItem(item))
  const seededN = latest?.seeded_count ?? counts.seeded ?? (data?.seeded || []).length
  const organicMediaN =
    latest?.organic_media_count ??
    counts.organic_media ??
    mediaItems.filter((item) => classificationOf(item) === "organic").length
  const snaps = data ? historyOf(data) : []

  return (
    <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-8 sm:px-6">
      <header className="space-y-3">
        <h1 className="font-heading text-2xl tracking-tight sm:text-3xl">LimiX-2 传播监测</h1>
        <p className="max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
          跟踪 <strong className="text-foreground">LimiX-2（400M）</strong> 开源后的小时级传播：区分
          <strong className="text-foreground">投放</strong>与
          <strong className="text-foreground">自发</strong>
          。请勿与旧版 <strong className="text-foreground">LimiX-2M</strong>（约 2M 参数）混淆。
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            更新（上海） {latest?.ts_shanghai || data?.generated_at_shanghai || "—"}
          </Badge>
          <Badge variant="outline">UTC {latest?.ts_utc || "—"}</Badge>
          <Badge variant="secondary" className="border-violet-500/40 bg-violet-500/15 text-violet-200">
            投放 {fmtNumber(seededN)}
          </Badge>
          <Badge variant="secondary" className="border-teal-500/40 bg-teal-500/15 text-teal-200">
            自发媒体 {fmtNumber(organicMediaN)}
          </Badge>
          <Badge variant="outline">arXiv {arxiv?.online ? "在线" : "未知"}</Badge>
          <Badge variant="outline">{latest?.x?.skipped ? "X 已跳过" : "X"}</Badge>
          <Badge variant="secondary" className="border-amber-500/40 bg-amber-500/15 text-amber-200">
            LimiX-2 ≠ LimiX-2M
          </Badge>
        </div>
      </header>

      <Separator className="my-6" />

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : error && !latest ? (
        <Alert variant="destructive">
          <AlertTitle>无法加载监测数据</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : data ? (
        <Tabs value={tab} onValueChange={onTabChange} className="gap-4">
          <TabsList variant="line" className="h-auto w-full max-w-full justify-start overflow-x-auto sm:max-w-md">
            <TabsTrigger value="board">看板</TabsTrigger>
            <TabsTrigger value="media">媒体列表</TabsTrigger>
            <TabsTrigger value="hourly">小时存档</TabsTrigger>
          </TabsList>
          <TabsContent value="board">
            <BoardTab data={data} />
          </TabsContent>
          <TabsContent value="media">
            <MediaTab data={data} />
          </TabsContent>
          <TabsContent value="hourly">
            <HourlyTab data={data} />
          </TabsContent>
        </Tabs>
      ) : null}

      <footer className="mt-auto pt-10 text-xs text-muted-foreground">
        数据生成于 {data?.generated_at_shanghai || "—"}（上海） / {data?.generated_at_utc || "—"} UTC
        · 快照数 {snaps.length} · GitHub stars 为整仓累计 · 缺失互动指标显示「未公开」
      </footer>
    </div>
  )
}
