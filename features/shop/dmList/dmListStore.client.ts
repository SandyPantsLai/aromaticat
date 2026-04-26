'use client'

import { DM_LIST_STORAGE_KEY, type DmListItem } from './types'
import { readDmList, removeById, upsertItem, writeDmList } from './storage'

/**
 * Eagerly mirror `localStorage` on the client as soon as this module loads, so
 * `getDmListSnapshot()` is never briefly empty while the tab already has a saved list. That
 * avoids a false "first add" where `rehydrate` in `useLayoutEffect` has not run yet. SSR keeps `[]`.
 */
let items: DmListItem[] = typeof window === 'undefined' ? [] : readDmList()
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

/**
 * Call once on the client after first paint to load from `localStorage` (avoids SSR/client hydration mismatch).
 */
export function rehydrateDmListFromStorage() {
  items = readDmList()
  emit()
}

/**
 * Re-read from `localStorage` (e.g. other tab / same-tab external write).
 */
export function loadDmListFromStorage() {
  items = readDmList()
  emit()
}

export function getDmListSnapshot() {
  return items
}

const SERVER_EMPTY: DmListItem[] = []

export function getDmListServerSnapshot() {
  return SERVER_EMPTY
}

export function subscribeDmList(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function persist(next: DmListItem[]) {
  items = next
  writeDmList(next)
  emit()
}

/**
 * @returns `wasInList` — `true` if a row with the same `id` was already in the in-memory list
 * before this upsert (the moment we decide “Added” vs “Already on your list” for the toast).
 */
export function addOrUpdateDmListItem(item: DmListItem): { wasInList: boolean } {
  const wasInList = items.some((i) => i.id === item.id)
  persist(upsertItem(items, item))
  return { wasInList }
}

export function removeDmListItem(id: string) {
  persist(removeById(items, id))
}

export function clearDmList() {
  persist([])
}

export { DM_LIST_STORAGE_KEY }
