'use client'

import React, { useEffect, useState, type ComponentProps } from 'react'

import Breadcrumbs from '~/components/Breadcrumbs'

/**
 * Renders breadcrumbs only after mount so SSR HTML matches the first client paint.
 * Avoids hydration mismatches from breakpoint-dependent breadcrumb UI.
 */
export default function BreadcrumbsDefer(props: ComponentProps<typeof Breadcrumbs>) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return null
  return <Breadcrumbs {...props} />
}
