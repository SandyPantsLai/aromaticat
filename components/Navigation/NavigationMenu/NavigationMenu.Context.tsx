'use client'

import { createContext, useContext } from 'react'

interface ContextProps {
  activeRefItem: string | undefined
  setActiveRefItem: (x: string) => void
}

interface Provider extends ContextProps {
  children?: React.ReactNode
}

const NavMenuContext = createContext<ContextProps | null>(null)

export const NavigationMenuContextProvider = (props: Provider) => {
  const { activeRefItem, setActiveRefItem } = props

  const value = {
    activeRefItem,
    setActiveRefItem,
  }

  return <NavMenuContext.Provider value={value}>{props.children}</NavMenuContext.Provider>
}

export const useNavigationMenuContext = () => {
  const context = useContext(NavMenuContext)
  if (context === null) {
    throw new Error(
      'useNavigationMenuContext must be used within a NavigationMenuContextProvider.'
    )
  }
  return context
}
