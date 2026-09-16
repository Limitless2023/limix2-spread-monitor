# LimiX-2 传播监测看板 · 部署说明（GitHub + Vercel）

本仓库/目录内的 `dashboard/` 是**纯静态站点**（`index.html` + `data.js`），无构建步骤、无密钥。

## 推荐方式 A：只部署 dashboard 目录

1. 在 GitHub 新建空仓库（例如 `limix2-monitor-dashboard`）。
2. 将本机 `dashboard/` 下文件推到该仓库根目录：
   - `index.html`
   - `data.js`（由采集脚本每小时生成）
   - `vercel.json`
3. 打开 [Vercel](https://vercel.com) → Add New Project → Import 该 GitHub 仓库。
4. **Root Directory** 留空（`.`），Framework Preset 选 **Other**，无需 Build Command / Output。
5. Deploy。之后每次把更新后的 `data.js`（及可选的 `index.html`）commit + push，Vercel 会自动重新部署。

## 方式 B：把整个 limix2-monitor 当仓库

1. 将整个 `limix2-monitor/` 推到 GitHub。
2. Vercel Import 时设置 **Root Directory = `dashboard`**。
3. 使用 `dashboard/vercel.json`；根目录的 `vercel.json` 可忽略或删除以免混淆。

## 与 box 上采集的衔接

- 数据权威源在 box：`.../limix2-monitor/`（`snapshots/`、`baselines/latest.json`、`seeded.json`、`organic.json`）。
- 每小时运行：`python3 scripts/collect_snapshot.py`，会刷新 `dashboard/data.js`。
- 若要公开看板：将最新 `dashboard/data.js`（以及 UI 变更）同步到部署用 GitHub 仓库再 push。**不要**把含内部备注/密钥的文件推上去；本脚手架默认无密钥。

## 注意

- `data.js` 暴露的是公开传播指标，推送前请确认可公开。
- GitHub stars 为整仓累计，看板内已有中文警示。
- 勿在 Vercel/GitHub 中配置本监测所需的私密 token；采集在 box 本地完成即可。
