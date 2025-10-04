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
  name: 'pinterest',
  description: 'Unduh media Pinterest',
  command: ['pinterest', 'pin', 'pindl'],
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
    if (!url) return ctx.reply('usage: /pinterest <url>')
    const res = await Velyn.get('/api/downloader/pinterest', { apikey: 'velynone', url })
    const data = res?.data?.data
    if (!data) return ctx.reply('gagal mendapatkan data pinterest')
    const cap = (data.title || 'pinterest').slice(0, 200)
    const video = data.url
    const thumb = data.thumbnail
    if (video && /^https?:\/\//.test(video)) {
      try {
        await ctx.replyWithVideo({ url: video }, { caption: cap || undefined })
      } catch {
        await ctx.reply((cap ? cap + '\n' : '') + video)
      }
      return
    }
    if (thumb && /^https?:\/\//.test(thumb)) {
      try {
        await ctx.replyWithPhoto({ url: thumb }, { caption: cap || undefined })
      } catch {
        await ctx.reply((cap ? cap + '\n' : '') + thumb)
      }
      return
    }
    await ctx.reply(JSON.stringify(res?.data ?? {}, null, 2).slice(0, 4000))
  },
}
