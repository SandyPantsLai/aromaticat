'use client'

import { ClipboardList } from 'lucide-react'
import { buttonVariants, cn } from 'ui'

import { useDmList } from './dmListContext'

/**
 * Button to open the list sheet. Safe to render more than once (e.g. desktop + mobile).
 */
export function DmListTrigger() {
  const { items, setOpen } = useDmList()

  return (
    <button
      type="button"
      title="Open your list (screenshot to order)"
      onClick={() => setOpen(true)}
      className={cn(
        buttonVariants({ type: 'default' }),
        'relative flex h-[30px] w-[30px] min-w-[30px] shrink-0 items-center justify-center rounded-md border border-default',
        'bg-surface-100/75 p-0 text-foreground-light hover:bg-overlay-hover/20'
      )}
      aria-label={`Open your list, ${items.length} items`}
    >
      <ClipboardList size={18} strokeWidth={1.5} aria-hidden />
      {items.length > 0 ? (
        <span
          className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 select-none items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-foreground"
          translate="no"
          aria-hidden
        >
          {items.length > 9 ? '9+' : items.length}
        </span>
      ) : null}
    </button>
  )
}
