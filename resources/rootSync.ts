import '../scripts/utils/dotenv'

import { fileURLToPath } from 'node:url'
import { styleText } from 'node:util'

/**
 * Reserved for future content → database sync (e.g. fragrances).
 * Error-code sync was removed; this script exits successfully so `pnpm sync` stays a stable no-op.
 */
async function sync(): Promise<void> {
  console.log(styleText('magenta', 'Starting sync to database...'))
  console.log(styleText('dim', 'Nothing to sync (no registered sync tasks).'))
  console.log(styleText('bold', styleText('green', 'Sync successful')))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  sync()
}
