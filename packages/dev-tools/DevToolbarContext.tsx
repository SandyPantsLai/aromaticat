'use client'

import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { DevTelemetryToolbarContextType } from './types'

const IS_LOCAL_DEV = process.env.NODE_ENV === 'development'
const STORAGE_KEY = 'dev-telemetry-toolbar-enabled'

declare global {
  interface Window {
    devTelemetry?: () => void
  }
}

const DevToolbarContext = createContext<DevTelemetryToolbarContextType | null>(null)

interface DevToolbarProviderProps {
  children: ReactNode
}

export function DevToolbarProvider({ children }: DevToolbarProviderProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const dismissToolbar = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setIsEnabled(false)
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!IS_LOCAL_DEV) return

    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {}
    if (stored === 'true') {
      setIsEnabled(true)
    }

    window.devTelemetry = () => {
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch {}
      setIsEnabled(true)
    }

    return () => {
      delete window.devTelemetry
    }
  }, [])

  if (!IS_LOCAL_DEV) {
    return <>{children}</>
  }

  return (
    <DevToolbarContext.Provider
      value={{
        isEnabled,
        isOpen,
        setIsOpen,
        dismissToolbar,
      }}
    >
      {children}
    </DevToolbarContext.Provider>
  )
}

export function useDevToolbar() {
  const context = useContext(DevToolbarContext)
  if (!context) {
    return {
      isEnabled: false,
      isOpen: false,
      setIsOpen: () => {},
      dismissToolbar: () => {},
    }
  }
  return context
}
