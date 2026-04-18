'use client'

import { type NavMenuSection } from '../Navigation.types'
import * as NavItems from './NavigationMenu.constants'
import NavigationMenuGuideListItems from './NavigationMenuGuideListItems'
import { PropsWithChildren } from 'react'

const NavigationMenuGuideList = ({
  id,
}: {
  id: string
  additionalNavItems?: Record<string, Partial<NavMenuSection>[]>
}) => {
  // eslint-disable-next-line import/namespace -- dynamic access, can't lint properly
  const menu = NavItems[id]

  return (
    <NavigationMenuGuideListWrapper id={id}>
      <NavigationMenuGuideListItems menu={menu} id={id} />
    </NavigationMenuGuideListWrapper>
  )
}

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

export default NavigationMenuGuideList
