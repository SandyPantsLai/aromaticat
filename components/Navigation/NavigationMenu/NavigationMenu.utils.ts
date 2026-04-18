'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'

import { menuState } from '../../../hooks/useMenuState'

/** Strip hash/query from a path string (parity with supabase apps/docs). */
export function getPathWithoutHash(relativePath: string) {
  return new URL(relativePath, 'http://placeholder').pathname
}

export const getMenuId = (pathname: string | null) => {
  if (!pathname) return MenuId.Fragrance
  if (pathname.startsWith('/shop')) return MenuId.Shop
  if (pathname.startsWith('/blog')) return MenuId.Blog
  return MenuId.Fragrance
}

export const useCloseMenuOnRouteChange = () => {
  const pathname = usePathname()

  useEffect(() => {
    menuState.setMenuMobileOpen(false)
  }, [pathname])
}
