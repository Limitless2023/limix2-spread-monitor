export function fmtNumber(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("zh-CN")
  }
  return String(value)
}

/** 互动数字：缺失 / null 显示「未公开」，0 为真实值。 */
export function fmtEngagement(value: unknown): string {
  if (value === null || value === undefined || value === "") return "未公开"
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("zh-CN")
  }
  return "未公开"
}

export function fmtTime(value: unknown): string {
  if (!value) return "—"
  const s = String(value)
  if (s.includes("T") && (s.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(s))) {
    const d = new Date(s)
    if (!Number.isNaN(d.getTime())) {
      const sh = new Date(d.getTime() + 8 * 3600 * 1000)
      const p = (n: number) => String(n).padStart(2, "0")
      return `${sh.getUTCFullYear()}-${p(sh.getUTCMonth() + 1)}-${p(sh.getUTCDate())} ${p(sh.getUTCHours())}:${p(sh.getUTCMinutes())}`
    }
  }
  return s
}

export function fmtDelta(delta: unknown): { text: string; tone: "up" | "down" | "flat" } {
  if (delta === null || delta === undefined || delta === "") {
    return { text: "较上小时 —", tone: "flat" }
  }
  const n = typeof delta === "number" ? delta : Number(delta)
  if (!Number.isFinite(n)) return { text: "较上小时 —", tone: "flat" }
  const sign = n > 0 ? "+" : ""
  return {
    text: `较上小时 ${sign}${n}`,
    tone: n > 0 ? "up" : n < 0 ? "down" : "flat",
  }
}

export function chartTick(tsShanghai?: string): string {
  if (!tsShanghai) return ""
  return tsShanghai.length > 5 ? tsShanghai.slice(5) : tsShanghai
}
