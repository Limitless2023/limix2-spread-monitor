# LimiX-2 传播监测看板 · 部署说明（GitHub + Vercel）

本仓库是 **Next.js（App Router）** 站点，使用 shadcn/ui。监测数据在运行时读取 `public/data.js`（`window.LIMIX2_DATA`）或 `public/data.json`，不打进前端包。

## Vercel（推荐）

1. 将本仓库推到 GitHub。
2. 打开 [Vercel](https://vercel.com) → Add New Project → Import 该仓库。
3. Framework Preset 选 **Next.js**（一般会自动识别）。
   - Root Directory：`.`
   - Build Command：`npm run build`（会先执行 `sync-data`，把根目录 `data.js` 复制到 `public/`）
   - Output：默认即可（不要选 Other / 纯静态）
4. Deploy。之后每次 commit + push（含采集器只更新 `data.js`）会触发重新部署。

`vercel.json` 为 `/data.js`、`/data.json` 设置了 60 秒缓存。

## 与 box 上采集的衔接

- 数据权威源在 box：`.../limix2-monitor/`（`snapshots/`、`baselines/latest.json`、`seeded.json`、`organic.json`）。
- 每小时运行：`python3 scripts/collect_snapshot.py`，刷新看板用的 `data.js`。
- 同步到本仓库时写入以下任一路径即可：
  - **推荐** `public/data.js`（直接被站点托管）
  - 或仓库根目录 `data.js`（兼容旧流程；`npm run build` / `sync-data` 会复制到 `public/` 并生成 `data.json`）
- **不要**把含内部备注/密钥的文件推上去；采集在 box 本地完成即可。勿在 Vercel 配置监测用的私密 token。

采集器输出字段需与现有 `data.js` 兼容；媒体互动请使用 `engagement: { views, likes, shares, comments }`，缺失时用 `null`，不要编造阅读量/点赞等数字。

## 本地预览

```bash
npm install
npm run dev
```

若需静态导出（非 Vercel 场景），可在 `next.config.ts` 增加 `output: "export"` 后执行 `npm run build`，产物在 `out/`。Vercel 上无需静态导出。

## 注意

- `data.js` 暴露的是公开传播指标，推送前请确认可公开。
- GitHub stars 为整仓累计，看板内已有中文警示。
- 旧版纯静态 `index.html` 已由 Next.js 页面替代；不要再把 Framework 设为 Other。
