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
  name: 'twitter',
  description: 'Unduh media Twitter/X',
  command: ['twitter', 'tw', 'x', 'xdl'],
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
    if (!url) return ctx.reply('usage: /twitter <url>')
    const res = await Velyn.get('/api/downloader/twitter', { apikey: 'velynone', url })
    const data = res?.data?.data
    if (!data || data.found === false) return ctx.reply('gagal mendapatkan data twitter')
    const author = [data.authorName || '', data.authorUsername ? `@${data.authorUsername}` : '']
      .filter(Boolean)
      .join(' ')
    const meta = [author, data.date ? new Date(data.date).toISOString().slice(0, 10) : '']
      .filter(Boolean)
      .join(' | ')
    const stats = [
      `likes:${data.likes ?? '-'}`,
      `replies:${data.replies ?? '-'}`,
      `retweets:${data.retweets ?? '-'}`,
    ].join(' ')
    const caption = [meta, stats].filter(Boolean).join(' • ').slice(0, 300)
    const media = Array.isArray(data.media)
      ? data.media.filter((m) => m && m.url && /^https?:\/\//.test(m.url))
      : []
    if (!media.length) return ctx.reply(JSON.stringify(res?.data ?? {}, null, 2).slice(0, 4000))
    const m = media[0]
    const isVid = (m.type || '').toLowerCase() === 'video' || /\.mp4(\?|$)/i.test(m.url)
    if (isVid) {
      try {
        await ctx.replyWithVideo({ url: m.url }, { caption: caption || undefined })
      } catch {
        await ctx.reply((caption ? caption + '\n' : '') + m.url)
      }
    } else {
      try {
        await ctx.replyWithPhoto({ url: m.url }, { caption: caption || undefined })
      } catch {
        await ctx.reply((caption ? caption + '\n' : '') + m.url)
      }
    }
  },
}
