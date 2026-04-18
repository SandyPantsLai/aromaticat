// @vitest-environment jsdom

import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { expectHydrationClean } from './hydrationTestUtils'

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: false }),
}))

import Heading from './Heading'

describe('Heading hydration', () => {
  it('hydrates plain string children without mismatch', () => {
    expectHydrationClean(<Heading tag="h2">Welcome</Heading>)
  })

  it('hydrates when id is provided (stable anchor)', () => {
    expectHydrationClean(
      <Heading tag="h2" id="welcome">
        Welcome
      </Heading>
    )
  })

  it('hydrates array children like MDX can produce', () => {
    expectHydrationClean(<Heading tag="h2">{['Hello', ' ', 'World']}</Heading>)
  })
})
