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
import chokidar from 'chokidar'
import { pathToFileURL } from 'url'
import logger from '#lib/logger'

export class Registry {
  constructor(dir) {
    this.dir = dir
    this.map = new Map()
    this.categories = new Map()
    this.watcher = null
  }
  walk(dir) {
    const out = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) out.push(...this.walk(full))
      else if (full.endsWith('.js')) out.push(full)
    }
    return out
  }
  async loadAll() {
    const files = this.walk(this.dir)
    for (const f of files) await this.loadFile(f)
    logger.info('plugins loaded: ' + this.map.size)
  }
  unloadByName(name) {
    const meta = this.map.get(name)
    if (!meta) return false
    this.map.delete(name)
    const cat = meta.category || 'General'
    if (this.categories.has(cat)) {
      this.categories.set(
        cat,
        this.categories.get(cat).filter((x) => x.name !== name),
      )
      if (this.categories.get(cat).length === 0) this.categories.delete(cat)
    }
    return true
  }
  async loadFile(file) {
    try {
      const href = pathToFileURL(file).href + `?t=${Date.now()}`
      const mod = await import(href)
      const exp = mod.default || mod
      if (!exp || !exp.name) return
      const commands = Array.isArray(exp.commands)
        ? exp.commands
        : Array.isArray(exp.command)
          ? exp.command
          : []
      if (!Array.isArray(commands) || !commands.length) return
      const meta = {
        name: exp.name,
        description: exp.description || '',
        commands,
        permissions: exp.permissions || 'all',
        hidden: Boolean(exp.hidden),
        failed: exp.failed || 'Failed to execute %command: %error',
        wait: exp.wait === undefined ? null : exp.wait,
        category: exp.category || 'General',
        cooldown: Number.isFinite(exp.cooldown) ? exp.cooldown : 0,
        limit: exp.limit || false,
        usage: exp.usage || '',
        group: Boolean(exp.group),
        private: Boolean(exp.private),
        owner: Boolean(exp.owner),
        file,
        handler: exp.handler,
      }
      if (typeof meta.handler !== 'function') return
      this.map.set(meta.name, meta)
      if (!this.categories.has(meta.category)) this.categories.set(meta.category, [])
      const list = this.categories.get(meta.category)
      if (!list.find((x) => x.name === meta.name))
        list.push({ name: meta.name, commands: meta.commands })
      logger.info('loaded ' + meta.name)
    } catch (e) {
      logger.error('failed load ' + file, e)
    }
  }
  watch() {
    if (this.watcher) return
    this.watcher = chokidar.watch(this.dir, { ignoreInitial: true })
    this.watcher.on('add', async (f) => {
      await this.loadFile(f)
    })
    this.watcher.on('change', async (f) => {
      const item = [...this.map.values()].find((x) => x.file === f)
      if (item) this.unloadByName(item.name)
      await this.loadFile(f)
      logger.info('reloaded ' + f)
    })
    this.watcher.on('unlink', (f) => {
      const item = [...this.map.values()].find((x) => x.file === f)
      if (item) this.unloadByName(item.name)
    })
    logger.info('watching ' + this.dir)
  }
  resolve(cmd) {
    const byCmd = [...this.map.values()].find((x) => x.commands.includes(cmd))
    return byCmd || this.map.get(cmd)
  }
  listByCategory() {
    const obj = {}
    for (const [c, items] of this.categories)
      obj[c] = items.map((x) => ({ name: x.name, commands: x.commands }))
    return obj
  }
}
