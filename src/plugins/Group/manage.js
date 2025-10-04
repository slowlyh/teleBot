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
  name: 'group',
  description: 'Kelola grup',
  command: ['settitle', 'setdesc', 'pin', 'unpin'],
  permissions: 'all',
  hidden: false,
  failed: 'Failed to execute %command: %error',
  wait: null,
  category: 'group',
  cooldown: 2,
  limit: false,
  usage: '$prefix$command <args>',
  group: true,
  private: false,
  owner: false,
  handler: async ({ ctx, command, args }) => {
    const chat = ctx.chat
    if (chat.type !== 'supergroup' && chat.type !== 'group') return ctx.reply('hanya di grup')
    if (command === 'settitle') {
      const title = args.join(' ').trim()
      if (!title) return ctx.reply('judul?')
      await ctx.telegram.setChatTitle(chat.id, title)
      return ctx.reply('ok')
    }
    if (command === 'setdesc') {
      const d = args.join(' ').trim()
      if (!d) return ctx.reply('deskripsi?')
      await ctx.telegram.setChatDescription(chat.id, d)
      return ctx.reply('ok')
    }
    if (command === 'pin') {
      const msg = ctx.message.reply_to_message
      if (!msg) return ctx.reply('reply pesan')
      await ctx.telegram.pinChatMessage(chat.id, msg.message_id, { disable_notification: true })
      return ctx.reply('ok')
    }
    if (command === 'unpin') {
      await ctx.telegram.unpinAllChatMessages(chat.id)
      return ctx.reply('ok')
    }
  },
}
