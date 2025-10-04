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
  name: 'ping',
  description: 'Ping dan uptime',
  command: ['ping', 'uptime'],
  permissions: 'all',
  hidden: false,
  failed: 'Failed to execute %command: %error',
  wait: null,
  category: 'info',
  cooldown: 3,
  limit: false,
  usage: '$prefix$command',
  group: false,
  private: false,
  owner: false,
  handler: async ({ ctx, command }) => {
    const start = Date.now()
    const m = await ctx.reply('ping...')
    const latency = Date.now() - start
    const up = Math.floor(process.uptime())
    const h = String(Math.floor(up / 3600)).padStart(2, '0')
    const mi = String(Math.floor((up % 3600) / 60)).padStart(2, '0')
    const s = String(Math.floor(up % 60)).padStart(2, '0')
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      m.message_id,
      undefined,
      `latency ${latency}ms\nuptime ${h}:${mi}:${s}`,
    )
  },
}
