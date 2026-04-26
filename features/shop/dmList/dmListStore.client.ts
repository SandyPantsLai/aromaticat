'use client'

import { DM_LIST_STORAGE_KEY, type DmListItem } from './types'
import { emptyDmList, readDmList, removeById, upsertItem, writeDmList } from './storage'

/**
 * In-memory list starts empty on both server and client. `rehydrateDmListFromStorage()` (from
 * `DmListProvider` useLayoutEffect) loads from `localStorage` only after the client hydrates, so
 * `useSyncExternalStore` + `getServerSnapshot` stay aligned with the SSR output (avoids mismatch).
 */
let items: DmListItem[] = emptyDmList as DmListItem[]
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

let didRehydrate = false

function normalizeForStore(next: DmListItem[]): DmListItem[] {
  return next.length > 0 ? next : (emptyDmList as DmListItem[])
}

function persist(next: DmListItem[]) {
  const n = normalizeForStore(next)
  if (n === items) {
    return
  }
  items = n
  writeDmList(n)
  emit()
}

/**
 * `DmListProvider` useLayoutEffect runs this before the browser’s first paint so `localStorage`
 * is merged in before the user can interact, without breaking SSR/CSR `useSyncExternalStore` match.
 */
export function rehydrateDmListFromStorage() {
  persist(readDmList())
  didRehydrate = true
}

/**
 * Re-read from `localStorage` (e.g. other tab / same-tab external write).
 */
export function loadDmListFromStorage() {
  rehydrateDmListFromStorage()
}

function ensureRehydratedBeforeMutate() {
  if (typeof window !== 'undefined' && !didRehydrate) {
    rehydrateDmListFromStorage()
  }
}

export function getDmListSnapshot() {
  return items
}

export function getDmListServerSnapshot() {
  return emptyDmList as DmListItem[]
}

export function subscribeDmList(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * @returns `wasInList` — `true` if a row with the same `id` was already in the in-memory list
 * before this upsert (the moment we decide “Added” vs “Already on your list” for the toast).
 */
export function addOrUpdateDmListItem(item: DmListItem): { wasInList: boolean } {
  ensureRehydratedBeforeMutate()
  const wasInList = items.some((i) => i.id === item.id)
  persist(upsertItem(items, item))
  return { wasInList }
}

export function removeDmListItem(id: string) {
  ensureRehydratedBeforeMutate()
  persist(removeById(items, id))
}

export function clearDmList() {
  ensureRehydratedBeforeMutate()
  persist([])
}

export { DM_LIST_STORAGE_KEY }
