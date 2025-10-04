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

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import logger from '#lib/logger.js'
import DB from '#db/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PLUGINS_BASE = path.join(__dirname, '..')

export default {
  name: 'plugins',
  description: 'Kelola plugin',
  command: ['plugins'],
  permissions: 'all',
  hidden: false,
  failed: 'Failed to execute %command: %error',
  wait: null,
  category: 'Owner',
  cooldown: 2,
  limit: false,
  usage: '$prefix$command <add|del|get|list> [path/file.js]',
  group: false,
  private: false,
  owner: true,
  handler: async ({ ctx, args, registry }) => {
    const sub = (args[0] || '').toLowerCase()
    const store = DB.getCollection('plugins')

    if (!sub || sub === 'list') {
      const list = store.keys().sort()
      await ctx.reply(list.length ? list.join('\n') : 'no plugins')
      return
    }

    if (sub === 'add') {
      const rawPath = args[1] || ''
      if (!rawPath) return ctx.reply('format: /plugins add <path/file.js> (reply kode)')
      const rel = rawPath.endsWith('.js') ? rawPath : rawPath + '.js'
      const target = path.join(PLUGINS_BASE, rel)

      const reply = ctx.message.reply_to_message && (ctx.message.reply_to_message.text || ctx.message.reply_to_message.caption)
      if (!reply) return ctx.reply('reply kode plugin')

      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, reply)
      logger.info('plugin saved: ' + target)
      await registry.loadFile(target)
      store.set(rel, { path: target, at: Date.now() })
      await ctx.reply('added: ' + rel)
      return
    }

    if (sub === 'del') {
      const rawPath = args[1] || ''
      if (!rawPath) return ctx.reply('format: /plugins del <path/file.js>')
      const rel = rawPath.endsWith('.js') ? rawPath : rawPath + '.js'
      const target = path.join(PLUGINS_BASE, rel)
      try { await fs.promises.unlink(target) } catch {}
      registry.unloadByName(path.parse(rel).name)
      store.del(rel)
      await ctx.reply('deleted: ' + rel)
      return
    }

    if (sub === 'get') {
      const rawPath = args[1] || ''
      if (!rawPath) return ctx.reply('format: /plugins get <path/file.js>')
      const rel = rawPath.endsWith('.js') ? rawPath : rawPath + '.js'
      const target = path.join(PLUGINS_BASE, rel)
      if (!fs.existsSync(target)) return ctx.reply('not found')
      const txt = fs.readFileSync(target, 'utf-8')
      await ctx.reply(txt.slice(0, 4000))
      return
    }

    await ctx.reply('unknown subcommand')
  }
}
