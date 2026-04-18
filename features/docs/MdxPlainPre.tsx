import type { DetailedHTMLProps, HTMLAttributes } from 'react'

import { cn } from 'ui'

/**
 * Sync MDX `pre` renderer — plain preformatted text without Shiki/twoslash.
 * Used when authored guides avoid fenced code blocks.
 */
export function MdxPlainPre(
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) {
  const { children, className, ...rest } = props
  return (
    <pre
      className={cn(
        'mb-6 overflow-x-auto rounded-md border border-default bg-surface-100 p-4 text-sm leading-relaxed font-mono text-foreground',
        className
      )}
      {...rest}
    >
      {children}
    </pre>
  )
}
