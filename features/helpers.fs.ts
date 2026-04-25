import { watch, type FSWatcher } from 'node:fs'
import { stat } from 'node:fs/promises'

import type { OrPromise } from '~/features/helpers.types'
import { IS_DEV } from '~/lib/constants'

/**
 * In dev, Next's HMR re-evaluates this module repeatedly. We track watchers on `globalThis`
 * keyed by `(watchDirectory, callsite hash)` so a re-evaluation closes the previous watcher
 * instead of stacking handles.
 */
const WATCHER_REGISTRY_KEY = '__cacheFullProcessWatchers__'
type WatcherRegistry = Map<string, FSWatcher>

function getWatcherRegistry(): WatcherRegistry {
  const g = globalThis as typeof globalThis & {
    [WATCHER_REGISTRY_KEY]?: WatcherRegistry
  }
  if (!g[WATCHER_REGISTRY_KEY]) {
    g[WATCHER_REGISTRY_KEY] = new Map()
  }
  return g[WATCHER_REGISTRY_KEY]
}

let watcherSeq = 0

/**
 * Caches a function for the length of the server process.
 *
 * - Stores `Promise<Output>` so concurrent callers on a cold key share a single in-flight call.
 * - Failed calls are evicted, so the next caller retries instead of getting a poisoned cache.
 * - In DEV, watches `watchDirectory` to bust entries on edit. Watchers are tracked on
 *   `globalThis` so HMR replaces (rather than stacks) them.
 */
export const cache_fullProcess_withDevCacheBust = <Args extends unknown[], Output>(
  /**
   * The function whose results to cache
   */
  fn: (...args: Args) => OrPromise<Output>,
  /**
   * The directory to watch for edits
   */
  watchDirectory: string,
  /**
   * A function that generates the cache key to bust, given the changed
   * filename (relative to the watch directory)
   */
  genCacheKeyFromFilename: (filename: string) => string
) => {
  const _cache = new Map<string, Promise<Output>>()

  if (IS_DEV) {
    const registry = getWatcherRegistry()
    const watcherKey = `${watchDirectory}#${++watcherSeq}`
    registry.get(watcherKey)?.close()
    const watcher = watch(watchDirectory, { recursive: true }, (_, filename) => {
      if (!filename) return
      const cacheKey = genCacheKeyFromFilename(filename)
      _cache.delete(cacheKey)
    })
    registry.set(watcherKey, watcher)
  }

  return (...args: Args): Promise<Output> => {
    const cacheKey = makeCacheKey(args)
    let pending = _cache.get(cacheKey)
    if (!pending) {
      pending = Promise.resolve()
        .then(() => fn(...args))
        .catch((err) => {
          _cache.delete(cacheKey)
          throw err
        })
      _cache.set(cacheKey, pending)
    }
    return pending
  }
}

/**
 * Default cache-key serializer. Falls back to `String(args)` if the args contain
 * values that `JSON.stringify` cannot handle (circular refs, `BigInt`, etc.).
 */
function makeCacheKey(args: readonly unknown[]): string {
  try {
    return JSON.stringify(args)
  } catch {
    return args.map((a) => String(a)).join('\u0001')
  }
}

/**
 * Returns `true` only when `fullPath` exists. Other errors (permission, IO) propagate
 * so callers don't silently treat broken filesystems as "missing file".
 */
export const existsFile = async (fullPath: string) => {
  try {
    await stat(fullPath)
    return true
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return false
    }
    throw err
  }
}
