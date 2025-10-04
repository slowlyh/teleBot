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
export default {
  name: 'instagram',
  description: 'Unduh media Instagram',
  command: ['instagram', 'ig', 'igdl'],
  permissions: 'all',
  hidden: false,
  failed: 'Failed to execute %command: %error',
  wait: null,
  category: 'downloader',
  cooldown: 2,
  limit: false,
  usage: '$prefix$command <url>',
  group: false,
  private: false,
  owner: false,
  handler: async ({ ctx, args, Velyn }) => {
    const url = (args[0] || '').trim()
    if (!url) return ctx.reply('usage: /instagram <url>')
    const res = await Velyn.get('/api/downloader/instagram', { apikey: 'velynone', url })
    const data = res?.data?.data
    if (!data) return ctx.reply('gagal mendapatkan data instagram')
    const urls = Array.isArray(data.url) ? data.url.filter((u) => /^https?:\/\//.test(u)) : []
    const meta = data.metadata || {}
    const cap = [meta.caption || '', meta.username ? `@${meta.username}` : '']
      .filter(Boolean)
      .join(' | ')
      .slice(0, 250)
    if (!urls.length) return ctx.reply(JSON.stringify(res?.data ?? {}, null, 2).slice(0, 4000))
    const isVideo = Boolean(meta.isVideo) || urls[0].includes('.mp4')
    if (isVideo) {
      try {
        await ctx.replyWithVideo({ url: urls[0] }, { caption: cap || undefined })
      } catch {
        await ctx.reply((cap ? cap + '\n' : '') + urls[0])
      }
    } else {
      for (let i = 0; i < Math.min(10, urls.length); i++) {
        const u = urls[i]
        try {
          await ctx.replyWithPhoto({ url: u }, { caption: i === 0 && cap ? cap : undefined })
        } catch {
          await ctx.reply((i === 0 && cap ? cap + '\n' : '') + u)
        }
      }
    }
  },
}
