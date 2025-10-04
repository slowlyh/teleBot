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
import 'dotenv/config'

const parseIds = (s) =>
  s
    ? s
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    : []
const config = {
  token: process.env.BOT_TOKEN || '',
  owners: parseIds(process.env.OWNER_IDS),
  prefix: process.env.BOT_PREFIX || '/',
  tz: process.env.TZ || 'Asia/Jakarta',
}
export default config
