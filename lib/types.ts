export type Engagement = {
  views?: number | null
  likes?: number | null
  shares?: number | null
  reposts?: number | null
  comments?: number | null
}

export type MediaItem = {
  id?: string
  title?: string | null
  channel?: string | null
  url?: string | null
  owner?: string | null
  status?: string | null
  source_type?: string | null
  classification?: string | null
  is_anchor?: boolean
  notes?: string | null
  lang?: string | null
  first_seen?: string | null
  last_seen?: string | null
  publish_time?: string | null
  published_hint?: string | null
  publish_time_note?: string | null
  engagement?: Engagement | null
  _cls?: "seeded" | "organic"
  fetch_ok?: boolean
  fetch?: {
    ok?: boolean
    method?: string
    fetched_at_utc?: string
  }
  [key: string]: unknown
}

export type GithubMetrics = {
  url?: string
  stars?: number | null
  forks?: number | null
  watchers?: number | null
  open_issues?: number | null
  open_prs?: number | null
  source?: string
  error?: string | null
  warning?: string | null
}

export type HfMetrics = {
  repo_id?: string
  url?: string
  likes?: number | null
  downloads?: number | null
  downloads_all_time?: number | null
  discussions?: number | null
  source?: string
  error?: string | null
}

export type ArxivMetrics = {
  id?: string
  url?: string
  online?: boolean | null
  title?: string | null
  published?: string | null
  citation_count?: number | null
  citation_note?: string | null
  source?: string
  error?: string | null
}

export type Snapshot = {
  ts_utc?: string
  ts_shanghai?: string
  github?: GithubMetrics
  hf?: HfMetrics
  arxiv?: ArxivMetrics
  x?: { skipped?: boolean; reason?: string }
  seeded_count?: number | null
  organic_count?: number | null
  organic_media_count?: number | null
  organic_anchor_count?: number | null
  seeded?: MediaItem[]
  organic?: MediaItem[]
  organic_new?: MediaItem[]
  deltas?: {
    has_previous?: boolean
    prev_ts_utc?: string
    prev_ts_shanghai?: string
    github?: Partial<GithubMetrics>
    hf?: Partial<HfMetrics>
    seeded_count?: number | null
    organic_count?: number | null
    organic_new_count?: number | null
  }
  notes?: string[]
}

export type Limix2Data = {
  generated_at_utc?: string
  generated_at_shanghai?: string
  project?: string
  warnings?: string[]
  latest?: Snapshot
  snapshots?: Snapshot[]
  history?: Snapshot[]
  seeded?: MediaItem[]
  organic?: MediaItem[]
  counts?: {
    seeded?: number
    organic?: number
    organic_media?: number
    organic_anchor?: number
  }
}

declare global {
  interface Window {
    LIMIX2_DATA?: Limix2Data
  }
}

export {}
