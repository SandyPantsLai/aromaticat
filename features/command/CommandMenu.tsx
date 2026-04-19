'use client'

import { useEffect, useRef } from 'react'

import {
  CommandHeader,
  CommandInput,
  CommandList,
  CommandMenu,
  useCommandMenuOpen,
  useSetPage,
} from 'ui-patterns/CommandMenu'
import { useDocsSearchCommands } from 'ui-patterns/CommandMenu/prepackaged/DocsSearch'

const DOCS_SEARCH_PAGE = 'Search'

/** When the palette opens from the nav search control, go straight to FTS search (no command list). */
function OpenDocsSearchWhenMenuOpens() {
  const open = useCommandMenuOpen()
  const setPage = useSetPage()
  const prevOpen = useRef(false)

  useEffect(() => {
    if (open && !prevOpen.current) {
      setPage(DOCS_SEARCH_PAGE, false)
    }
    prevOpen.current = open
  }, [open, setPage])

  return null
}

const DocsCommandMenu = () => {
  useDocsSearchCommands({
    modify: (command) => ({ ...command, forceMount: true }),
    options: { forceMountSection: true },
  })

  return (
    <CommandMenu>
      <OpenDocsSearchWhenMenuOpens />
      <CommandHeader>
        <CommandInput />
      </CommandHeader>
      <CommandList />
    </CommandMenu>
  )
}

export { DocsCommandMenu as default }
