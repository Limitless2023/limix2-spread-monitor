# LimiX-2 传播监测

小时级监测 **LimiX-2（400M，2026-09-16 开源）** 的投放与自发传播。勿与旧版 **LimiX-2M** 混淆。

本仓库是面向 Vercel 的 **Next.js（App Router）+ shadcn/ui** 看板。数据在运行时从公开文件读取，采集机更新 `data.js` 后无需改前端代码。

## 页面

| Tab | 说明 |
|-----|------|
| **看板** | 指标卡片 + GitHub stars/forks、HF likes/downloads、投放/自发数量的小时趋势 |
| **媒体列表** | 媒体稿与官方锚点（GitHub / Hugging Face / arXiv）分表；含投放/自发与互动列 |
| **小时存档** | `history`（或 `snapshots`）小时快照表，新→旧 |

## 目录

| 路径 | 说明 |
|------|------|
| `app/` | Next.js App Router 页面 |
| `components/` | 看板 UI（shadcn/ui + 业务组件） |
| `public/data.js` | 运行时数据，导出 `window.LIMIX2_DATA`（采集器主产物） |
| `public/data.json` | 同内容 JSON；由 `npm run sync-data` 从 `data.js` 生成 |
| `data.js` | 兼容旧采集路径：根目录写入后，构建会复制到 `public/` |
| `scripts/sync-data.mjs` | 同步 `data.js` → `public/data.js` + `public/data.json` |
| `scripts/collect_snapshot.py` | （采集仓库）一键采集并刷新看板数据；本仓库仅托管看板 |

采集侧（另一台机器 / box）仍可维护 `config.json`、`seeded.json`、`organic.json`、`snapshots/`、`baselines/latest.json`。

## 运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

生产构建：

```bash
npm run build
npm start
```

公开部署见 `DEPLOY.md`（GitHub + Vercel）。

## 数据加载

前端**不会**把监测数据打进 JS bundle。页面加载后依次尝试：

1. `/data.js` → `window.LIMIX2_DATA`（与现有采集器兼容）
2. `/data.json`（回退）

因此采集机只需覆盖 `public/data.js`（或仓库根目录 `data.js`）再 push。构建脚本会把根目录 `data.js` 同步到 `public/`。

`data.js` / `data.json` 的 Cache-Control 为 60 秒（见 `vercel.json`）。

## 采集字段（兼容现有 data.js）

顶层对象 `window.LIMIX2_DATA`：

| 字段 | 说明 |
|------|------|
| `generated_at_utc` / `generated_at_shanghai` | 数据生成时间 |
| `warnings` | 看板警示文案 |
| `latest` | 最新小时快照 |
| `history` / `snapshots` | 小时存档（优先 `history`） |
| `seeded` / `organic` | 投放 / 自发条目列表 |
| `counts` | `{ seeded, organic, organic_media, organic_anchor }` |

快照（`latest` / `history[]`）沿用现有字段：`ts_utc`、`ts_shanghai`、`github`（stars/forks/watchers/open_issues）、`hf`（likes/downloads）、`arxiv`、`x`、`seeded_count`、`organic_count`、`organic_media_count`、`organic_anchor_count`、`seeded`、`organic`、`organic_new`、`deltas`、`notes`。

媒体条目常用字段：`id`、`channel`、`title`、`url`、`source_type` / `classification`（`seeded` 投放 / `organic` 自发）、`publish_time` / `published_hint` / `publish_time_note`、`first_seen`、`last_seen`、`status`、`is_anchor`。

### 互动（engagement）

每条媒体**可以**带互动对象（数字或 `null`）。**未采集到时必须为 `null` / 省略，禁止编造。**

```js
engagement: {
  views: null,     // 阅读量
  likes: null,     // 点赞
  shares: null,    // 转发 / 分享；亦接受 reposts
  comments: null,  // 评论
}
```

看板展示规则：

- 数字（含 `0`）按原值显示
- `null`、缺字段、`engagement: {}` → **未公开**

GitHub / Hugging Face / arXiv 按渠道或 URL 归入「官方锚点」，其余为「媒体稿」。

## 指标说明

- **GitHub** `limix-ldm-ai/LimiX`：stars/forks 等为**整仓累计**，不是 LimiX-2 单独计数。
- **HF** `stable-ai/LimiX-2`：likes / downloads（尽力抓取）。
- **arXiv** `2609.17488`：是否在线；引用数默认不虚构。
- **X**：无 MCP/额度则跳过。
- **投放 vs 自发**：`seeded.json` 为投放；其余发现写入 `organic.json`。
- 缺失字段表示未能获取，**从不编造数字**。
