'use client'

import ReactMarkdown from 'react-markdown'

import { guideHeadingMarkdownComponents } from '~/features/docs/guideHeadingMarkdown'
import { useGuide } from './Guide'

interface GuideHeaderProps {
  className?: string
}

export function GuideHeader({ className }: GuideHeaderProps) {
  const { meta } = useGuide()
  const tagline = meta?.family ?? meta?.subtitle

  return (
    <div className={className}>
      <h1 className="mb-0">
        <ReactMarkdown components={guideHeadingMarkdownComponents}>
          {meta?.title || 'Supabase Docs'}
        </ReactMarkdown>
      </h1>
      {meta?.brand && (
        <div className="mt-2 text-sm text-foreground-light">
          <ReactMarkdown components={guideHeadingMarkdownComponents}>{meta.brand}</ReactMarkdown>
        </div>
      )}
      {tagline && (
        <h2 className="mt-3 text-xl text-foreground-light">
          <ReactMarkdown components={guideHeadingMarkdownComponents}>{tagline}</ReactMarkdown>
        </h2>
      )}
      <hr className="not-prose border-t-0 border-b my-8" />
    </div>
  )
}
