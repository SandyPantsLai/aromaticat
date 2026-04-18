'use strict'

/** Minimal stub; real `node:url` is only used from pg-parser's Node-only branch. */
module.exports = {
  fileURLToPath() {
    return ''
  },
  pathToFileURL(p) {
    return { href: String(p) }
  },
}
