import type { ReactElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { expect, vi } from 'vitest'

/**
 * Renders `ui` with `renderToString`, then hydrates the same tree with `hydrateRoot`.
 * Fails if React logs a hydration-related error during hydrate.
 */
export function expectHydrationClean(ui: ReactElement) {
  const hydrationErrors: string[] = []
  const spy = vi.spyOn(console, 'error').mockImplementation((first, ...rest) => {
    const parts = [first, ...rest].map((x) => {
      if (typeof x === 'string') return x
      if (x instanceof Error) return x.message
      return ''
    })
    const combined = parts.join(' ')
    if (
      /hydration|Hydration|did not match|Expected server HTML|There was an error while hydrating/i.test(
        combined
      )
    ) {
      hydrationErrors.push(combined)
    }
  })

  const container = document.createElement('div')
  document.body.appendChild(container)

  try {
    container.innerHTML = renderToString(ui)
    hydrateRoot(container, ui)
    expect(hydrationErrors, hydrationErrors.join('\n\n')).toEqual([])
  } finally {
    spy.mockRestore()
    container.remove()
  }
}
