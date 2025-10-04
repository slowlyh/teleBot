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
import { Markup } from 'telegraf'

export default {
  name: 'menu',
  description: 'Menampilkan daftar fitur',
  command: ['menu', 'help'],
  permissions: 'all',
  hidden: false,
  failed: 'Failed to execute %command: %error',
  wait: null,
  category: 'info',
  cooldown: 0,
  limit: false,
  usage: '$prefix$command',
  group: false,
  private: false,
  owner: false,
  handler: async ({ ctx, registry }) => {
    const groups = registry.listByCategory()
    const lines = []
    lines.push('◆ MENU')
    for (const cat of Object.keys(groups).sort()) {
      lines.push('')
      lines.push('▶ ' + cat.toUpperCase())
      for (const it of groups[cat].sort((a, b) => a.name.localeCompare(b.name))) {
        const cmd = it.commands.join(', ')
        lines.push('• ' + it.name + ' [' + cmd + ']')
      }
    }
    const caption = lines.slice(0, 40).join('\n')
    try {
      await ctx.replyWithPhoto(
        { url: 'https://files.catbox.moe/ma4al6.jpg' },
        {
          caption,
          ...Markup.inlineKeyboard([Markup.button.url('Repository', 'https://github.com/slowlyh')]),
        },
      )
    } catch {
      await ctx.reply(caption)
    }
    const rest = lines.slice(40).join('\n')
    if (rest.trim().length) await ctx.reply(rest)
  },
}
