'use client'

import { cn } from 'ui'

import { useGuide } from './Guide'

interface GuideHeaderProps {
  className?: string
}

export function GuideHeader({ className }: GuideHeaderProps) {
  const { meta } = useGuide()
  const tagline = meta?.family ?? meta?.subtitle
  const hasSubheading = Boolean(meta?.brand || meta?.line)

  return (
    <div className={className}>
      <h1 className="mb-0">{meta?.title || 'AromatiCat'}</h1>
      {meta?.brand && (
        <div className="mt-2 text-sm text-foreground-light">{meta.brand}</div>
      )}
      {meta?.line && (
        <div
          className={cn(
            'text-sm text-foreground-light',
            meta?.brand ? 'mt-1' : 'mt-2'
          )}
        >
          {meta.line}
        </div>
      )}
      {tagline && (
        <div
          className={cn(
            'not-prose text-sm text-foreground-light',
            hasSubheading ? 'mt-1' : 'mt-2'
          )}
        >
          {tagline}
        </div>
      )}
      <hr className="not-prose border-t-0 border-b my-8" />
    </div>
  )
}
