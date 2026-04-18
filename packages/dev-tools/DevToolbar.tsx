'use client'

import { useFeatureFlags } from 'common'
import { Flag } from 'lucide-react'
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  Badge,
  Button,
  Input_Shadcn_ as Input,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Switch,
  cn,
} from 'ui'

import { useDevToolbar } from './DevToolbarContext'
import {
  CC_ORIGINALS_KEY,
  deleteCookie,
  getCookie,
  parseOverrideValue,
  readOriginals,
  safeJsonParse,
  setCookie,
  valuesAreEqual,
  writeOriginals,
} from './utils'

const IS_LOCAL_DEV = process.env.NODE_ENV === 'development'

function FlagCard({
  flagName,
  currentValue,
  originalValue,
  isOverridden,
  onToggle,
}: {
  flagName: string
  currentValue: unknown
  originalValue: unknown
  isOverridden: boolean
  onToggle: (value: unknown) => void
}) {
  const valueType = typeof originalValue
  const isNull = originalValue === null
  const inputProps = {
    value: String(currentValue),
    onChange: (event: ChangeEvent<HTMLInputElement>) => onToggle(event.target.value),
    className: 'w-32',
  }

  return (
    <div className={cn('border rounded-md p-3', isOverridden && 'border-warning bg-warning/5')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-mono text-sm truncate">{flagName}</span>
          {isOverridden && (
            <Badge variant="warning" className="shrink-0">
              Overridden
            </Badge>
          )}
          {isNull && (
            <Badge variant="secondary" className="shrink-0">
              null
            </Badge>
          )}
        </div>

        {isNull ? (
          <Input value="null" disabled className="w-32 opacity-50" />
        ) : valueType === 'boolean' ? (
          <Switch
            checked={currentValue as boolean}
            onCheckedChange={(checked) => onToggle(checked)}
          />
        ) : valueType === 'number' ? (
          <Input type="number" {...inputProps} />
        ) : (
          <Input {...inputProps} />
        )}
      </div>

      {isOverridden && (
        <div className="mt-2 text-xs text-foreground-muted">
          Original:{' '}
          <code className="bg-surface-200 px-1 rounded">{JSON.stringify(originalValue)}</code>
        </div>
      )}
    </div>
  )
}

export function DevToolbar() {
  const { isEnabled, isOpen, setIsOpen } = useDevToolbar()
  const { configcat: configcatFlags } = useFeatureFlags()
  const [ccFlagOverrides, setCcFlagOverrides] = useState<Record<string, unknown>>({})
  const [ccFlagOriginals, setCcFlagOriginals] = useState<Record<string, unknown>>({})

  const loadOverrides = useCallback(
    (cookieName: string, label: string, setter: (value: Record<string, unknown>) => void) => {
      const parsed = safeJsonParse<Record<string, unknown>>(getCookie(cookieName), {}, label)
      if (Object.keys(parsed).length > 0) {
        setter(parsed)
      }
    },
    []
  )

  const saveOverrides = useCallback(
    (
      cookieName: string,
      overrides: Record<string, unknown>,
      setter: (value: Record<string, unknown>) => void
    ) => {
      setter(overrides)
      if (Object.keys(overrides).length > 0) {
        setCookie(cookieName, JSON.stringify(overrides), '/')
      } else {
        deleteCookie(cookieName)
      }
    },
    []
  )

  const updateOriginals = useCallback(
    (storageKey: string, setter: Dispatch<SetStateAction<Record<string, unknown>>>) =>
      (updater: (prev: Record<string, unknown>) => Record<string, unknown>) => {
        setter((prev) => {
          const next = updater(prev)
          writeOriginals(storageKey, next)
          return next
        })
      },
    []
  )

  useEffect(() => {
    loadOverrides('x-cc-flag-overrides', 'ConfigCat flag overrides', setCcFlagOverrides)
  }, [loadOverrides])

  useEffect(() => {
    setCcFlagOriginals(readOriginals(CC_ORIGINALS_KEY))
  }, [])

  const updateCcOriginals = updateOriginals(CC_ORIGINALS_KEY, setCcFlagOriginals)

  const toggleCcFlagOverride = (flagName: string, value: unknown) => {
    const originalValue = ccFlagOriginals[flagName] ?? configcatFlags[flagName]
    const parsedValue = parseOverrideValue(value, originalValue)
    if (valuesAreEqual(parsedValue, originalValue)) {
      const newOverrides = { ...ccFlagOverrides }
      delete newOverrides[flagName]
      saveOverrides('x-cc-flag-overrides', newOverrides, setCcFlagOverrides)
      return
    }

    updateCcOriginals((prev) =>
      flagName in prev ? prev : { ...prev, [flagName]: configcatFlags[flagName] }
    )
    const newOverrides = { ...ccFlagOverrides, [flagName]: parsedValue }
    saveOverrides('x-cc-flag-overrides', newOverrides, setCcFlagOverrides)
  }

  const clearAllOverrides = () => {
    setCcFlagOverrides({})
    setCcFlagOriginals({})
    deleteCookie('x-cc-flag-overrides')
    writeOriginals(CC_ORIGINALS_KEY, {})
    window.location.reload()
  }

  const ccOverrideCount = Object.keys(ccFlagOverrides).length

  if (!IS_LOCAL_DEV || !isEnabled) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="bottom"
        size="lg"
        className="flex flex-col p-0 gap-0 overflow-hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <div className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-brand-500" />
            <SheetTitle className="text-lg font-semibold">Dev tools</SheetTitle>
            <Badge variant="secondary">Local Only</Badge>
          </div>
          <SheetDescription className="sr-only">
            Override ConfigCat feature flags for local development
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-6 pt-4">
          {ccOverrideCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-md mb-4 shrink-0">
              <span className="text-sm text-warning">
                {ccOverrideCount} ConfigCat flag(s) overridden
              </span>
              <Button type="outline" onClick={clearAllOverrides}>
                Clear & Reload
              </Button>
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto pb-6">
            <div className="space-y-4">
              {Object.keys(configcatFlags).length === 0 ? (
                <div className="text-center text-foreground-muted py-8">
                  No ConfigCat feature flags loaded yet.
                </div>
              ) : (
                Object.entries(configcatFlags).map(([flagName, flagValue]) => (
                  <FlagCard
                    key={flagName}
                    flagName={flagName}
                    currentValue={
                      ccFlagOverrides[flagName] ?? ccFlagOriginals[flagName] ?? flagValue
                    }
                    originalValue={ccFlagOriginals[flagName] ?? flagValue}
                    isOverridden={flagName in ccFlagOverrides}
                    onToggle={(value) => toggleCcFlagOverride(flagName, value)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
