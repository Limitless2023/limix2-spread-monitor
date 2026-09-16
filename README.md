# LimiX-2 传播监测

小时级监测 **LimiX-2（400M，2026-09-16 开源）** 的投放与自发传播。勿与旧版 **LimiX-2M** 混淆。

## 目录

| 路径 | 说明 |
|------|------|
| `config.json` | 锚点、关键词、排除词 |
| `seeded.json` | 投放/己方内容登记 |
| `organic.json` | 自发发现（按 URL 去重） |
| `snapshots/YYYY-MM-DD/HHMM.json` | 每小时快照 |
| `baselines/latest.json` | 最新快照 |
| `dashboard/` | 本地/可部署静态看板 |
| `scripts/collect_snapshot.py` | 一键采集并刷新 `dashboard/data.js` |

## 运行

```bash
python3 scripts/collect_snapshot.py
```

打开看板：浏览器打开 `dashboard/index.html`（`file://` 即可，依赖同目录 `data.js`）。

公开部署见 `DEPLOY.md`（GitHub + Vercel）。

## 指标说明

- **GitHub** `limix-ldm-ai/LimiX`：stars/forks 等为**整仓累计**，不是 LimiX-2 单独计数。
- **HF** `stable-ai/LimiX-2`：likes / downloads（尽力抓取）。
- **arXiv** `2609.17488`：是否在线；引用数默认不虚构。
- **X**：无 MCP/额度则跳过。
- **投放 vs 自发**：`seeded.json` 为投放；其余发现写入 `organic.json`。
- 缺失字段表示未能获取，**从不编造数字**。
