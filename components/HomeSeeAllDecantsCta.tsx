import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from 'ui'

/**
 * Full-viewport-width strip below home carousels: one primary CTA to the decants overview.
 */
export function HomeSeeAllDecantsCta() {
  return (
    <section
      className={cn(
        'not-prose -mx-[calc((100vw-100%)/2)] w-[100vw] max-w-[100vw]',
        'bg-brand-link text-white'
      )}
      aria-label="Browse all decants"
    >
      <Link
        href="/shop/decants/overview"
        className={cn(
          'flex w-full items-center justify-center gap-2 px-5 py-10 text-center text-xl font-semibold tracking-tight',
          'no-underline transition-[filter,opacity] hover:brightness-110 sm:py-14 sm:text-2xl',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--brand-link))]'
        )}
      >
        See All Decants
        <ChevronRight
          className="size-6 shrink-0 opacity-90 sm:size-7"
          strokeWidth={2}
          aria-hidden
        />
      </Link>
    </section>
  )
}
