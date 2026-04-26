'use client'

import {
  useCallback,
  useLayoutEffect,
  useMemo,
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

export function DmListProvider({ children }: PropsWithChildren) {
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
    const wasPresent = getDmListSnapshot().some((i) => i.id === item.id)
    addOrUpdateDmListItem(item)
    if (wasPresent) toast('Already on your list')
    else toast('Added to your list')
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
