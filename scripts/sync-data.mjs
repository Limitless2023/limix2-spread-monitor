#!/usr/bin/env node
/**
 * 将采集器写入的 data.js 同步到 public/，并生成 data.json。
 * 兼容两种路径：仓库根目录 data.js，或 public/data.js。
 */
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const rootJs = path.join(root, "data.js")
const publicDir = path.join(root, "public")
const publicJs = path.join(publicDir, "data.js")
const publicJson = path.join(publicDir, "data.json")

function extract(js) {
  const trimmed = js.trim()
  const match = trimmed.match(/window\.LIMIX2_DATA\s*=\s*([\s\S]*)$/)
  const body = (match ? match[1] : trimmed).replace(/;+\s*$/, "")
  return Function(`"use strict"; return (${body})`)()
}

fs.mkdirSync(publicDir, { recursive: true })

let sourcePath = null
if (fs.existsSync(rootJs)) sourcePath = rootJs
else if (fs.existsSync(publicJs)) sourcePath = publicJs

if (!sourcePath) {
  console.warn("未找到 data.js；看板将显示空状态，直到采集器推送 public/data.js。")
  process.exit(0)
}

const source = fs.readFileSync(sourcePath, "utf8")
if (sourcePath !== publicJs) {
  fs.copyFileSync(sourcePath, publicJs)
}

const data = extract(source)
fs.writeFileSync(publicJson, `${JSON.stringify(data, null, 2)}\n`)
console.log(`已同步 ${path.relative(root, publicJs)} 与 ${path.relative(root, publicJson)}`)
