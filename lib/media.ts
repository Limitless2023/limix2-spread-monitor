import type { Engagement, Limix2Data, MediaItem, Snapshot } from "@/lib/types"

const ANCHOR_CHANNELS = new Set([
  "github",
  "hugging face",
  "huggingface",
  "hf",
  "arxiv",
])

const ANCHOR_HOSTS = ["github.com", "huggingface.co", "arxiv.org"]

export function isAnchorItem(item: MediaItem | null | undefined): boolean {
  if (!item) return false
  if (item.is_anchor === true) return true
  const channel = String(item.channel || "").trim().toLowerCase()
  if (ANCHOR_CHANNELS.has(channel)) return true
  const url = String(item.url || "").toLowerCase()
  return ANCHOR_HOSTS.some((host) => url.includes(host))
}

export function classificationOf(item: MediaItem): "seeded" | "organic" {
  const raw = String(item.source_type || item.classification || "").toLowerCase()
  if (raw === "seeded" || raw === "投放") return "seeded"
  if (raw === "organic" || raw === "自发") return "organic"
  const fallback = item._cls
  if (fallback === "seeded" || fallback === "organic") return fallback
  return "organic"
}

export function publishOf(item: MediaItem): string | null {
  const value = item.publish_time || item.published_hint || item.publish_time_note
  return value ? String(value) : null
}

export function engagementOf(item: MediaItem): Engagement {
  const raw = item.engagement
  if (!raw || typeof raw !== "object") return {}
  return raw
}

export function engagementValue(
  engagement: Engagement,
  key: "views" | "likes" | "shares" | "comments"
): number | null | undefined {
  if (key === "shares") {
    const shares = engagement.shares
    if (shares !== null && shares !== undefined) return shares
    return engagement.reposts
  }
  return engagement[key]
}

export function organicMediaCount(snap: Snapshot): number | null {
  if (snap.organic_media_count != null) return snap.organic_media_count
  if (Array.isArray(snap.organic) && snap.organic.length) {
    return snap.organic.filter((item) => !isAnchorItem(item)).length
  }
  return null
}

export function historyOf(data: Limix2Data): Snapshot[] {
  return data.history?.length ? data.history : data.snapshots || []
}

export function collectMediaItems(data: Limix2Data): MediaItem[] {
  const byUrl = new Map<string, MediaItem>()

  function add(item: MediaItem | undefined, cls: "seeded" | "organic") {
    if (!item) return
    const url = (item.url || "").trim()
    const key = url || `id:${item.id || item.title || Math.random().toString(36)}`
    const copy: MediaItem = { ...item, _cls: cls }
    if (!copy.source_type) copy.source_type = cls

    const prev = byUrl.get(key)
    if (!prev) {
      byUrl.set(key, copy)
      return
    }

    const merged: MediaItem = { ...prev, ...copy }
    if (prev.first_seen && (!copy.first_seen || String(prev.first_seen) < String(copy.first_seen))) {
      merged.first_seen = prev.first_seen
    }
    if (prev.last_seen && copy.last_seen && String(prev.last_seen) > String(copy.last_seen)) {
      merged.last_seen = prev.last_seen
    }
    if (!merged.engagement || Object.keys(merged.engagement).length === 0) {
      merged.engagement = prev.engagement || copy.engagement
    }
    if (prev._cls === "seeded" || prev.source_type === "seeded") {
      merged._cls = "seeded"
      merged.source_type = "seeded"
    }
    byUrl.set(key, merged)
  }

  for (const item of data.seeded || []) add(item, "seeded")
  for (const item of data.organic || []) add(item, "organic")
  const latest = data.latest || {}
  for (const item of latest.seeded || []) add(item, "seeded")
  for (const item of latest.organic || []) add(item, "organic")
  for (const item of latest.organic_new || []) add(item, "organic")

  return Array.from(byUrl.values())
}
