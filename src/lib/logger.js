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
import { Colors, colorize } from '#lib/colors'

const log = (type, message, error = null) => {
  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  let color
  switch ((type || '').toString().toUpperCase()) {
    case 'INFO':
      color = Colors.Bright
      break
    case 'WARN':
      color = Colors.FgRed
      break
    case 'ERROR':
      color = Colors.BgRed
      break
    case 'DEBUG':
      color = Colors.FgGray
      break
    default:
      color = Colors.FgGray
      break
  }
  let output = colorize(color, `[${timestamp} WIB] [BOT ${type.toUpperCase()}] ${message}`)
  if (error instanceof Error) {
    output += `\n${colorize(Colors.FgRed, 'Error: ' + error.message)}`
    if (error.stack) {
      output += `\n${colorize(Colors.FgGray, 'Stack: ' + error.stack)}`
    }
  } else if (error) {
    try {
      output += `\nAdditional Info: ${JSON.stringify(error, null, 2)}`
    } catch {}
  }
  console.log(output)
}
export const print = async (m, store) => {
  if (!m || m.messageTimestamp === undefined || m.messageTimestamp === null) {
    log('DEBUG', 'Skipping print due to missing message timestamp.')
    return
  }
  try {
    const timestamp = new Date(m.messageTimestamp).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
    })
    let chatName = 'Private Chat'
    if (m.isGroup) {
      if (m.metadata) {
        chatName = m.metadata.subject || `Group: ${m.from}`
      } else if (store) {
        const metadata = store.getGroupMetadata && store.getGroupMetadata(m.from)
        if (metadata) chatName = metadata.subject || `Group: ${m.from}`
      }
    }
    console.log(colorize(Colors.FgWhite, '----- Incoming Message -----'))
    console.log(
      colorize(
        Colors.FgWhite,
        `[${timestamp} WIB] [${chatName}] From: ${m.pushName} (${(m.sender || '').split('@')[0] || '-'})`,
      ),
    )
    console.log(colorize(Colors.FgWhite, `[Type]: ${m.type}`))
    const body = m.body || ''
    console.log(
      colorize(
        Colors.FgWhite,
        `[Body]: ${body ? body.substring(0, 100) + (body.length > 100 ? '...' : '') : '[Non-text message]'} `,
      ),
    )
    if (m.isCommand) {
      console.log(colorize(Colors.FgWhite, `[Command]: ${m.prefix}${m.command}`))
    }
    console.log(colorize(Colors.FgWhite, '----------------------------'))
  } catch (error) {
    log('ERROR', 'Failed to print message', error)
  }
}

const logger = {
  info: (m) => log('INFO', m),
  warn: (m) => log('WARN', m),
  error: (m, e) => log('ERROR', m, e),
  debug: (m) => log('DEBUG', m),
}

export default logger
