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
  name: 'tiktok',
  description: 'Unduh video TikTok',
  command: ['tiktok', 'tt'],
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
    if (!url) return ctx.reply('usage: /tiktok <url>')
    const res = await Velyn.get('/api/downloader/tiktok', { apikey: 'velynone', url })
    const data = res?.data?.data
    if (!data) return ctx.reply('gagal mendapatkan data tiktok')
    const cap = (data.title || 'tiktok').slice(0, 200)
    const video = data.no_watermark || data.watermark || data.origin_cover || data.cover
    if (video && /^https?:\/\//.test(video)) {
      try {
        await ctx.replyWithVideo({ url: video }, { caption: cap })
      } catch {
        await ctx.reply((cap ? cap + '\n' : '') + video)
      }
    } else {
      await ctx.reply(JSON.stringify(res?.data ?? {}, null, 2).slice(0, 4000))
    }
  },
}
