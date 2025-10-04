# TeleBot

TeleBot is a bot based on Telegraf.js
 with a modular plugin architecture, auto-reload, and support for a local JSON database.
It is designed to be flexible, easy to develop, and safe to use on Node.js v20+.

---

## Key Features

- Plugin Architecture
Each feature is placed in the src/plugins folder with categories (Info, Group, Downloader, Owner, etc.).
Plugins will auto-reload whenever a file change is detected.

- Plugin Manager System
The owner can add, delete, view, and retrieve plugins directly using the /plugins command.

- Local JSON Database
Stores plugin data and additional configurations in src/database/data.

---

## Struktur Path

```
teleBot/
 main.js                 # Entry point
 package.json
 .env.example            # Example environment config
 src/
     index.js            # Bot runner
     config/             # Configuration bot
     core/               # Registry & handler
     lib/                # Logger, API client, utilities
     database/           # JSON database
     plugins/            # Features
         Info/           # Menu, Ping
         Group/          # Group manager
         Downloader/     # TikTok, FB, IG, Twitter, Pinterest
         Owner/          # Plugin manager
```

---

## Example Plugin

Example plugin `src/plugins/Info/ping.js`:

```js
export default {
  name: 'ping',
  description: 'Ping dan uptime',
  command: ['ping','uptime'],
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
  handler: async ({ ctx }) => {
    const start = Date.now()
    const m = await ctx.reply('ping...')
    const latency = Date.now() - start
    const up = Math.floor(process.uptime())
    const h = String(Math.floor(up/3600)).padStart(2,'0')
    const mi = String(Math.floor((up%3600)/60)).padStart(2,'0')
    const s = String(Math.floor(up%60)).padStart(2,'0')
    await ctx.telegram.editMessageText(ctx.chat.id, m.message_id, undefined, `latency ${latency}ms\nuptime ${h}:${mi}:${s}`)
  }
}
```

---

## Configuration

Copy `.env.example` to `.env` then fill in:

```env
BOT_TOKEN=your_telegram_bot_token
OWNER_IDS=123456789,987654321
BOT_PREFIX=/
TZ=Asia/Jakarta
```

---

## How to Run

```bash
npm install
npm start
```

## Contributing
Fork, create a feature branch, run lint, open a pull request with a clear description.
