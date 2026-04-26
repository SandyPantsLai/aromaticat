'use client'

import { DM_LIST_STORAGE_KEY, type DmListItem } from './types'
import { readDmList, removeById, upsertItem, writeDmList } from './storage'

let items: DmListItem[] = []
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

export function addOrUpdateDmListItem(item: DmListItem) {
  persist(upsertItem(items, item))
}

export function removeDmListItem(id: string) {
  persist(removeById(items, id))
}

export function clearDmList() {
  persist([])
}

export { DM_LIST_STORAGE_KEY }
