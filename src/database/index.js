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
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
const fileOf = (n) => path.join(DATA_DIR, `${n}.json`)
const read = (n) => {
  const f = fileOf(n)
  if (!fs.existsSync(f)) return {}
  try {
    const raw = fs.readFileSync(f, 'utf-8')
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}
const write = (n, d) => {
  const f = fileOf(n)
  fs.writeFileSync(f, JSON.stringify(d, null, 2))
}
const getCollection = (n) => ({
  all() {
    return read(n)
  },
  get(k, d = null) {
    const o = read(n)
    return o[k] ?? d
  },
  set(k, v) {
    const o = read(n)
    o[k] = v
    write(n, o)
    return true
  },
  del(k) {
    const o = read(n)
    delete o[k]
    write(n, o)
    return true
  },
  keys() {
    return Object.keys(read(n))
  },
  clear() {
    write(n, {})
    return true
  },
})
export default { getCollection, read, write }
