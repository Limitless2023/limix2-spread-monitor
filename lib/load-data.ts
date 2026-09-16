import type { Limix2Data } from "@/lib/types"

function looksLikeData(value: unknown): value is Limix2Data {
  if (!value || typeof value !== "object") return false
  const rec = value as Limix2Data
  return Boolean(rec.latest || rec.history || rec.snapshots || rec.seeded || rec.organic)
}

async function fetchJson(url: string): Promise<Limix2Data | null> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null
    const json: unknown = await res.json()
    return looksLikeData(json) ? json : null
  } catch {
    return null
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`无法加载 ${src}`))
    document.head.appendChild(script)
  })
}

/**
 * 运行时读取公开数据，采集机只需覆盖 public/data.js（或根目录 data.js，构建时同步）。
 * 优先 data.js（采集器主产物），data.json 作为回退。
 */
export async function loadLimix2Data(): Promise<Limix2Data | null> {
  if (typeof window !== "undefined" && looksLikeData(window.LIMIX2_DATA)) {
    return window.LIMIX2_DATA
  }

  try {
    await loadScript("/data.js")
    if (looksLikeData(window.LIMIX2_DATA)) return window.LIMIX2_DATA
  } catch {
    // fall through to JSON
  }

  return fetchJson("/data.json")
}
