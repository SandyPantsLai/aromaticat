'use client'

import { cn } from 'ui'

import { useGuide } from './Guide'

interface GuideHeaderProps {
  className?: string
}

export function GuideHeader({ className }: GuideHeaderProps) {
  const { meta } = useGuide()
  const tagline = meta?.family ?? meta?.subtitle

  return (
    <div className={className}>
      <h1 className="mb-0">{meta?.title || 'Supabase Docs'}</h1>
      {meta?.brand && (
        <div className="mt-2 text-sm text-foreground-light">{meta.brand}</div>
      )}
      {tagline && (
        <div
          className={cn(
            'not-prose text-sm text-foreground-light',
            meta?.brand ? 'mt-1' : 'mt-2'
          )}
        >
          {tagline}
        </div>
      )}
      <hr className="not-prose border-t-0 border-b my-8" />
    </div>
  )
}
