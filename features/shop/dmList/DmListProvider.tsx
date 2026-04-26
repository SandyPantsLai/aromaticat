'use client'

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from 'react'
import { toast } from 'sonner'

import { DM_LIST_STORAGE_KEY, type DmListItem } from './types'
import { DmListContext } from './dmListContext'
import { DmListSheetPanel } from './DmListSheetPanel'
import {
  addOrUpdateDmListItem,
  clearDmList,
  getDmListServerSnapshot,
  getDmListSnapshot,
  loadDmListFromStorage,
  rehydrateDmListFromStorage,
  removeDmListItem,
  subscribeDmList,
} from './dmListStore.client'

export { useDmList, useDmListOptional } from './dmListContext'

/** Suppress a second add with the same id in the same burst (e.g. double `onClick`), which would wrongly toast "Already…" after a real "Added…". */
const DEDUPE_SAME_ID_MS = 150

export function DmListProvider({ children }: PropsWithChildren) {
  const lastAddById = useRef(new Map<string, number>())

  const items = useSyncExternalStore(
    subscribeDmList,
    getDmListSnapshot,
    getDmListServerSnapshot
  )
  const [isOpen, setIsOpen] = useState(false)

  useLayoutEffect(() => {
    rehydrateDmListFromStorage()
  }, [])

  useLayoutEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === DM_LIST_STORAGE_KEY) loadDmListFromStorage()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((item: DmListItem) => {
    const now = Date.now()
    const last = lastAddById.current.get(item.id) ?? 0
    if (now - last < DEDUPE_SAME_ID_MS) {
      return
    }
    lastAddById.current.set(item.id, now)

    const { wasInList } = addOrUpdateDmListItem(item)
    if (wasInList) {
      toast('Already on your list')
    } else {
      toast('Added to your list')
    }
  }, [])

  const remove = useCallback((id: string) => {
    removeDmListItem(id)
  }, [])

  const clear = useCallback(() => {
    clearDmList()
    toast('List cleared')
  }, [])

  const value = useMemo(
    () => ({ items, add, remove, clear, isOpen, setOpen: setIsOpen }),
    [add, clear, isOpen, items, remove]
  )

  return (
    <DmListContext.Provider value={value}>
      {children}
      <DmListSheetPanel />
    </DmListContext.Provider>
  )
}
