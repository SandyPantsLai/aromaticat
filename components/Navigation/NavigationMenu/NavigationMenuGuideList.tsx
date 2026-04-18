'use client'

import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { type NavMenuSection } from '../Navigation.types'
import * as NavItems from './NavigationMenu.constants'
import { getShopSidebarNav } from './shopSidebarNav'
import NavigationMenuGuideListItems from './NavigationMenuGuideListItems'

export function NavigationMenuGuideList({
  id,
}: {
  id: string
  additionalNavItems?: Record<string, Partial<NavMenuSection>[]>
}) {
  const pathname = usePathname()

  const menu =
    id === 'shop' ? getShopSidebarNav(pathname) : NavItems[id as keyof typeof NavItems]

  return (
    <NavigationMenuGuideListWrapper id={id}>
      <NavigationMenuGuideListItems menu={menu} id={id} />
    </NavigationMenuGuideListWrapper>
  )
}

/**
 * Plain wrapper — not Radix `Accordion.Root`. Upstream uses a root accordion with
 * `value={firstLevelRoute}`; that can mismatch SSR vs client `usePathname()` and the
 * children here are not `Accordion.Item`s anyway, which risks hydration errors.
 */
export function NavigationMenuGuideListWrapper({
  id,
  children,
}: PropsWithChildren<{
  id: string
}>) {
  return (
    <div
      key={id}
      className="transition-all duration-150 ease-out opacity-100 ml-0 delay-150 w-full"
    >
      {children}
    </div>
  )
}
