'use client'

import { createContext, useContext } from 'react'

import type { DmListItem } from './types'

export type DmListContextValue = {
  items: DmListItem[]
  add: (item: DmListItem) => void
  remove: (id: string) => void
  clear: () => void
  isOpen: boolean
  setOpen: (open: boolean) => void
}

export const DmListContext = createContext<DmListContextValue | null>(null)

export function useDmList() {
  const ctx = useContext(DmListContext)
  if (ctx == null) throw new Error('useDmList must be used within DmListProvider')
  return ctx
}

export function useDmListOptional() {
  return useContext(DmListContext)
}
