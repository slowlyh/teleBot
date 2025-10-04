/**
 * Copyright © 2025 [ slowlyh ]
 *
 * All rights reserved. This source code is the property of [ ChatGPT ].
 * Unauthorized copying, distribution, modification, or use of this file,
 * via any medium, is strictly prohibited without prior written permission.
 *
 * This software is protected under international copyright laws.
 *
 * Contact: [ hyuuoffc@gmail.com ]
 * GitHub: https://github.com/slowlyh
 * Official: https://hyuu.tech
 */
import { spawn } from 'child_process'
import { promises as fs, existsSync, mkdirSync } from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import boxen from 'boxen'
import config from '#config/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = __dirname
const tmpDir = path.join(projectRoot, 'tmp')
const pluginsDir = path.join(projectRoot, 'src', 'plugins')
const packageJsonPath = path.join(projectRoot, 'package.json')
const mainScript = path.join(projectRoot, 'src', 'index.js')

let childProcess = null
let isRunning = false
let isManualStop = false

function fmtBytes(n) {
  const u = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let v = n
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(1)} ${u[i]}`
}

async function getFileSystemStats(folderPath) {
  let folders = 0
  let filesCount = 0
  try {
    const items = await fs.readdir(folderPath)
    for (const item of items) {
      const fullPath = path.join(folderPath, item)
      const stat = await fs.stat(fullPath)
      if (stat.isDirectory()) {
        folders++
        const sub = await getFileSystemStats(fullPath)
        folders += sub.folders
        filesCount += sub.files
      } else {
        filesCount++
      }
    }
  } catch {}
  return { folders, files: filesCount }
}

async function readPackageMeta() {
  try {
    const raw = await fs.readFile(packageJsonPath, 'utf-8')
    const pkg = JSON.parse(raw)
    return {
      name: pkg.name || '-',
      version: pkg.version || '-',
      description: pkg.description || '-',
      author: pkg.author || '-',
    }
  } catch {
    return { name: '-', version: '-', description: '-', author: '-' }
  }
}

function short(val, max = 48) {
  const s = String(val ?? '')
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

async function showGreet() {
  console.log('Hi, Welcome User TeleBot.')
  console.log(
    'Gunakan secara bertanggung jawab. Dilarang spam, phishing, atau aktivitas melanggar hukum.\n',
  )
}

async function showDashboard() {
  const pkg = await readPackageMeta()
  const stats = await getFileSystemStats(pluginsDir)
  const totalMem = fmtBytes(os.totalmem())
  const usedMem = fmtBytes(os.totalmem() - os.freemem())
  const ownersStr = (config.owners || []).join(', ') || '-'

  const rows = [
    ['App', short(pkg.name, 30)],
    ['Version', pkg.version],
    ['Node', process.version],
    ['Platform', `${os.platform()} ${os.release()} (${os.arch()})`],
    ['Memory', `${usedMem}/${totalMem}`],
    ['Uptime', `${Math.round(os.uptime() / 60)}m`],
    ['Prefix', config.prefix],
    ['Owners', short(ownersStr, 30)],
    ['Token', config.token ? 'set' : 'not-set'],
    ['Plugins', `${stats.files} files / ${stats.folders} dirs`],
  ]

  const keyW = 10
  const body = rows.map(([k, v]) => `${k.padEnd(keyW)}: ${v}`).join('\n')
  const bx = boxen(body, {
    padding: { top: 0, right: 1, bottom: 0, left: 1 },
    margin: { top: 0, right: 1, bottom: 1, left: 1 },
    borderStyle: 'single',
    title: 'Bot Dashboard',
    titleAlignment: 'center',
  })
  console.log(bx)
}

function start(scriptFile) {
  if (isRunning) return
  isRunning = true
  const args = [scriptFile, ...process.argv.slice(2)]
  childProcess = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
  childProcess.on('message', (message) => {
    if (message === 'reset') {
      childProcess.kill()
      isRunning = false
      start(scriptFile)
    } else if (message === 'stop') {
      isManualStop = true
      childProcess.kill()
    } else if (message === 'uptime') {
      childProcess.send(process.uptime())
    }
  })
  childProcess.on('exit', (code, signal) => {
    isRunning = false
    if (isManualStop) {
      isManualStop = false
      return
    }
    setTimeout(() => start(scriptFile), 5000)
  })
}

if (!existsSync(tmpDir)) {
  mkdirSync(tmpDir)
}
await showGreet()
await showDashboard()
start(mainScript)
