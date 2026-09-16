"use client"

import { MediaTable } from "@/components/media-table"
import { classificationOf, collectMediaItems, isAnchorItem } from "@/lib/media"
import type { Limix2Data } from "@/lib/types"

export function MediaTab({ data }: { data: Limix2Data }) {
  const allItems = collectMediaItems(data)
  const mediaItems = allItems.filter((item) => !isAnchorItem(item))
  const anchorItems = allItems.filter((item) => isAnchorItem(item))
  const seededN = mediaItems.filter((item) => classificationOf(item) === "seeded").length
  const organicN = mediaItems.filter((item) => classificationOf(item) === "organic").length

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-medium">
          <span className="size-2 rounded-full bg-teal-400" />
          媒体稿
          <span className="text-sm font-normal text-muted-foreground">
            共 {mediaItems.length} 条（投放 {seededN} / 自发 {organicN}）
          </span>
        </h2>
        <MediaTable items={mediaItems} />
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-medium">
          <span className="size-2 rounded-full bg-slate-400" />
          官方锚点
          <span className="text-sm font-normal text-muted-foreground">
            GitHub / Hugging Face / arXiv · {anchorItems.length} 条
          </span>
        </h2>
        <MediaTable items={anchorItems} />
      </section>
    </div>
  )
}
