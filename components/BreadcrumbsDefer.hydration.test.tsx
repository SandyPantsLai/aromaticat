// @vitest-environment jsdom

import React from 'react'
import { describe, it, vi } from 'vitest'

import BreadcrumbsDefer from '~/components/BreadcrumbsDefer'
import { expectHydrationClean } from '~/packages/ui/src/components/CustomHTMLElements/hydrationTestUtils'

vi.mock('next/navigation', () => ({
  usePathname: () => '/shop/decants/northern',
}))

describe('BreadcrumbsDefer hydration', () => {
  it('hydrates the deferred shell without mismatch (null then client subtree)', () => {
    expectHydrationClean(<BreadcrumbsDefer className="mb-2" />)
  })
})
