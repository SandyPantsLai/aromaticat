'use strict'

/**
 * Browser-bundle stub for `node:module`.
 * @supabase/pg-parser only uses `createRequire` in the Node branch (`h === true`);
 * webpack still resolves `import("node:module")` for the client graph.
 */
module.exports = {
  createRequire() {
    return function stubRequire() {
      throw new Error('createRequire is not available in the browser bundle')
    }
  },
}
