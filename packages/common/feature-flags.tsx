'use client'

import { FlagValues } from 'flags/react'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

import { getFlags as getDefaultConfigCatFlags } from './configcat'

export type FeatureFlagContextType = {
  configcat: { [key: string]: boolean | number | string | null }
}

export const FeatureFlagContext = createContext<FeatureFlagContextType>({
  configcat: {},
})

function getCookies() {
  const pairs = document.cookie.split(';')
  let cookies: Record<string, string> = {}
  for (var i = 0; i < pairs.length; i++) {
    var [t_key, value] = pairs[i].split('=')
    const key = t_key.trim()

    cookies[key] = unescape(value)
  }
  return cookies
}

export const FeatureFlagProvider = ({
  enabled = true,
  getConfigCatFlags,
  children,
}: PropsWithChildren<{
  /** `true` loads ConfigCat flags; `{ cc: false }` disables ConfigCat while keeping the provider mounted */
  enabled?: boolean | { cc: boolean }
  /** Custom fetcher for ConfigCat flags if passing in custom attributes */
  getConfigCatFlags?: (
    userEmail?: string
  ) => Promise<{ settingKey: string; settingValue: boolean | number | string | null | undefined }[]>
}>) => {
  const [store, setStore] = useState<FeatureFlagContextType>({
    configcat: {},
  })

  useEffect(() => {
    let mounted = true

    async function processFlags() {
      if (!enabled) return

      const loadCCFlags = enabled === true || (typeof enabled === 'object' && enabled.cc)

      let flagStore: FeatureFlagContextType = { configcat: {} }

      const flagValues = loadCCFlags
        ? typeof getConfigCatFlags === 'function'
          ? await getConfigCatFlags(undefined)
          : await getDefaultConfigCatFlags(undefined)
        : []

      const isLocalDev = process.env.NODE_ENV === 'development'

      const safeParse = (value: string | undefined): Record<string, boolean | number | string> => {
        if (!value) return {}
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      }

      if (flagValues.length > 0) {
        let overridesCookieValue: Record<string, boolean | number | string> = {}

        try {
          const cookies = getCookies()
          const vercelOverrides = safeParse(cookies['vercel-flag-overrides'])
          const ccOverrides = isLocalDev ? safeParse(cookies['x-cc-flag-overrides']) : {}

          overridesCookieValue = {
            ...vercelOverrides,
            ...ccOverrides,
          }
        } catch {}

        flagValues.forEach((item) => {
          flagStore['configcat'][item.settingKey] =
            overridesCookieValue[item.settingKey] ??
            (item.settingValue === null ? null : (item.settingValue ?? false))
        })
      }

      if (mounted) {
        setStore(flagStore)
      }
    }

    processFlags()

    return () => {
      mounted = false
    }
  }, [enabled, getConfigCatFlags])

  return (
    <FeatureFlagContext.Provider value={store}>
      <FlagValues values={store.configcat} />
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlags = () => {
  return useContext(FeatureFlagContext)
}

const isObjectEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0
}

export function useFlag<T = boolean>(name: string) {
  const flagStore = useFeatureFlags()
  const store = flagStore.configcat

  if (isObjectEmpty(store)) {
    return false
  }

  if (store[name] === undefined) {
    console.error(`Flag key "${name}" does not exist in ConfigCat flag store`)
    return false
  }

  return store[name] as T
}
