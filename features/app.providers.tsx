import SiteLayout from '~/layouts/SiteLayout'
import { FeatureFlagProvider, IS_PLATFORM, ThemeProvider } from 'common'
import { DevToolbar, DevToolbarProvider } from 'dev-tools'
import type { PropsWithChildren } from 'react'
import { TooltipProvider } from 'ui'

import { QueryClientProvider } from './data/queryClient.client'
import { Toaster } from './toaster'
import { ScrollRestoration } from './ui/helpers.scroll.client'
import { ThemeSandbox } from './ui/theme.client'

/**
 * Global providers that wrap the entire app
 */
function GlobalProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider>
      <FeatureFlagProvider enabled={IS_PLATFORM}>
        <DevToolbarProvider>
          <ScrollRestoration />
          <ThemeProvider>
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-col">
                <SiteLayout>
                  {children}
                </SiteLayout>
                <ThemeSandbox />
              </div>
              <Toaster />
              <DevToolbar />
            </TooltipProvider>
          </ThemeProvider>
        </DevToolbarProvider>
      </FeatureFlagProvider>
    </QueryClientProvider>
  )
}

export { GlobalProviders }
