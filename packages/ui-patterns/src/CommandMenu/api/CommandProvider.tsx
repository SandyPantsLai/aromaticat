'use client'

import { useConstant } from 'common'
import { useRouter as useLegacyRouter } from 'next/compat/router'
import { useCallback, useEffect, useMemo, type PropsWithChildren } from 'react'

import { CommandContext } from '../internal/Context'
import { initCommandsState } from '../internal/state/commandsState'
import { initPagesState } from '../internal/state/pagesState'
import { initQueryState } from '../internal/state/queryState'
import { initViewState } from '../internal/state/viewState'
import type { CommandMenuTelemetryCallback } from './hooks/useCommandMenuTelemetry'
import { CommandMenuTelemetryContext } from './hooks/useCommandMenuTelemetryContext'
import { CrossCompatRouterContext } from './hooks/useCrossCompatRouter'
import { useResetCommandMenu, useSetCommandMenuOpen } from './hooks/viewHooks'

const CommandProviderInternal = ({ children }: PropsWithChildren) => {
  const combinedState = useConstant(() => ({
    commandsState: initCommandsState(),
    pagesState: initPagesState(),
    queryState: initQueryState(),
    viewState: initViewState(),
  }))

  return <CommandContext.Provider value={combinedState}>{children}</CommandContext.Provider>
}

function CloseOnNavigation({ children }: PropsWithChildren) {
  const setIsOpen = useSetCommandMenuOpen()
  const resetCommandMenu = useResetCommandMenu()

  const legacyRouter = useLegacyRouter()
  const isUsingLegacyRouting = !!legacyRouter

  const completeNavigation = useCallback(() => {
    setIsOpen(false)
    resetCommandMenu()
  }, [resetCommandMenu, setIsOpen])

  const ctx = useMemo(
    () => ({
      onPendingEnd: new Set([completeNavigation]),
    }),
    [completeNavigation]
  )

  useEffect(() => {
    if (!isUsingLegacyRouting) return

    legacyRouter.events.on('routeChangeComplete', completeNavigation)
    return () => legacyRouter.events.off('routeChangeComplete', completeNavigation)
  }, [isUsingLegacyRouting, legacyRouter])

  return (
    <CrossCompatRouterContext.Provider value={ctx}>{children}</CrossCompatRouterContext.Provider>
  )
}

interface CommandProviderProps extends PropsWithChildren {
  /**
   * The app where the command menu is being used
   */
  app?: 'studio' | 'docs' | 'www'
  /**
   * Optional callback to send telemetry events
   */
  onTelemetry?: CommandMenuTelemetryCallback
}

const CommandProvider = ({ children, app, onTelemetry }: CommandProviderProps) => (
  <CommandProviderInternal>
    <CommandMenuTelemetryContext.Provider value={{ app: app ?? 'studio', onTelemetry }}>
      <CloseOnNavigation>{children}</CloseOnNavigation>
    </CommandMenuTelemetryContext.Provider>
  </CommandProviderInternal>
)

export { CommandProvider }
