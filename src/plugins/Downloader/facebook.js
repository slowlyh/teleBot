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
  name: 'facebook',
  description: 'Unduh video Facebook',
  command: ['facebook', 'fb'],
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
    if (!url) return ctx.reply('usage: /facebook <url>')
    const res = await Velyn.get('/api/downloader/facebook', { apikey: 'velynone', url })
    const dl = res?.data?.data?.downloadUrl
    if (dl && /^https?:\/\//.test(dl)) {
      try {
        await ctx.replyWithVideo({ url: dl })
      } catch {
        await ctx.reply(dl)
      }
    } else {
      await ctx.reply(JSON.stringify(res?.data ?? {}, null, 2).slice(0, 4000))
    }
  },
}
