import { type ReactNode } from 'react'
import { cn } from 'ui'

import BreadcrumbsDefer from '~/components/BreadcrumbsDefer'

interface GuideArticleProps {
  children: ReactNode
  className?: string
}

export function GuideArticle({ children, className }: GuideArticleProps) {
  return (
    <>
      <BreadcrumbsDefer className="mb-2" />
      <article
        // Used to get headings for the table of contents
        id="sb-docs-guide-main-article"
        className={cn('prose max-w-none', className)}
      >
        {children}
      </article>
    </>
  )
}
