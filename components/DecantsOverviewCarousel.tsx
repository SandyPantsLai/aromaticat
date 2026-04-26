'use client'

import type { ReactNode } from 'react'
import { cn } from 'ui'
import { Row } from 'ui-patterns/Row'

/**
 * Horizontal decant tiles with chevron stepping when more cards fit than the viewport column budget.
 * Uses {@link Row} from `ui-patterns` (transform-based carousel, keyboard and horizontal wheel).
 */
export function DecantsOverviewCarousel({
  children,
  className,
  maxColumns = 3,
  minWidth = 272,
  gap = 24,
  showArrows = true,
}: {
  children: ReactNode
  className?: string
  maxColumns?: number
  minWidth?: number
  gap?: number
  showArrows?: boolean
}) {
  return (
    <div className={cn('relative w-full sm:px-10', className)}>
      <Row maxColumns={maxColumns} minWidth={minWidth} gap={gap} showArrows={showArrows}>
        {children}
      </Row>
    </div>
  )
}
