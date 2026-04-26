'use client'

import { Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge, Button, buttonVariants, cn } from 'ui'

import { formatCadFromCents } from '~/components/fragrance/format'

import { useDmList } from './dmListContext'
import { breakdownListMoney } from './money'
import type { DmListItem } from './types'

const BACKDROP_Z = 200
const PANEL_Z = 201

function isExternal(href: string) {
  return /^https?:\/\//i.test(href)
}

function ItemRow({ item, onRemove }: { item: DmListItem; onRemove: (id: string) => void }) {
  return (
    <li className="flex gap-2 border-b border-default py-3 pr-1 text-sm text-foreground last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="m-0 font-medium line-clamp-2">
          <TypeBadge t={item.type} /> {formatTitle(item)}
        </div>
        <p className="m-0 mt-0.5 text-foreground-lighter" translate="no">
          {formatSubline(item)}
        </p>
        {getHref(item) != null && getHref(item) !== '' ? (
          <p className="m-0 mt-1">
            {isExternal(getHref(item) ?? '') ? (
              <a
                href={getHref(item) ?? undefined}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-brand-600 hover:underline brand-link"
              >
                View on site
              </a>
            ) : (
              <Link
                href={getHref(item) ?? '/'}
                className="text-sm text-brand-600 hover:underline brand-link"
              >
                View on site
              </Link>
            )}
          </p>
        ) : null}
      </div>
      <Button
        type="outline"
        className="h-8 w-8 shrink-0 p-0"
        title="Remove from list"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">Remove from list</span>
      </Button>
    </li>
  )
}

function TypeBadge({ t }: { t: DmListItem['type'] }) {
  const short = t === 'decant' ? 'Decant' : t === 'bottle' ? 'Bottle' : 'C&R'
  return (
    <Badge variant="secondary" className="align-middle text-[10px] font-medium uppercase">
      {short}
    </Badge>
  )
}

function getHref(item: DmListItem): string | null {
  if (item.type === 'decant') return item.href
  if (item.type === 'bottle' && item.href) return item.href
  return null
}

function formatTitle(item: DmListItem): string {
  if (item.type === 'catchAndRelease') {
    return `${item.brand} — ${item.name}`.trim()
  }
  return [item.brand, item.name].filter(Boolean).join(' — ').trim() || item.name
}

function formatSubline(item: DmListItem): string {
  if (item.type === 'decant') {
    if (item.sizeMl != null) {
      return `${item.lineTotalLabel} = ${item.sizeMl} ml × ${item.rateLabel}`
    }
    return item.priceLabel ?? item.rateLabel ?? '—'
  }
  if (item.type === 'bottle') {
    return [item.cost, `${item.condition} · ${item.remainingMl} / ${item.bottleSizeMl} ml`]
      .filter(Boolean)
      .join(' · ')
  }
  return [item.cost, `${item.comments} · ${item.remainingMl} / ${item.bottleSizeMl} ml`]
    .filter((s) => s && String(s).length > 0)
    .join(' · ')
}

/**
 * Body-portaled slide-over (avoids shared Sheet/Radix stacking and flex height quirks on desktop).
 */
export function DmListSheetPanel() {
  const { items, remove, clear, isOpen, setOpen } = useDmList()
  const [mounted, setMounted] = useState(false)
  const money = useMemo(() => breakdownListMoney(items), [items])

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, setOpen])

  useLayoutEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 flex justify-end"
      style={{ zIndex: BACKDROP_Z }}
      role="presentation"
    >
      <button
        type="button"
        className="h-full min-h-0 min-w-0 grow cursor-default border-0 bg-alternative/80 p-0 backdrop-blur-sm"
        aria-label="Close list"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'flex h-dvh w-full min-w-0 max-w-md shrink-0 flex-col border-l border-default bg-surface-100 text-foreground shadow-2xl sm:max-w-lg',
          'animate-in duration-200 slide-in-from-right'
        )}
        style={{ zIndex: PANEL_Z }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dm-list-title"
        aria-describedby="dm-list-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 space-y-1 border-b border-default bg-surface-100 px-5 py-4 pr-10 text-left">
          <h2 id="dm-list-title" className="m-0 text-lg font-semibold text-foreground">
            Your list
          </h2>
          <p id="dm-list-desc" className="m-0 text-sm text-foreground">
            This site has no checkout. Add items here, then take a screenshot of the list and
            message Sandy Pants to order.
          </p>
        </div>

        <div
          className="min-h-0 flex-1 scroll-py-1 overflow-y-auto overflow-x-hidden overscroll-contain px-0 py-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.length === 0 ? (
            <p className="m-0 px-5 py-6 text-sm text-foreground-lighter">Nothing in your list yet.</p>
          ) : (
            <ol className="m-0 list-none px-5 py-1">
              {items.map((it) => (
                <ItemRow key={it.id} item={it} onRemove={remove} />
              ))}
            </ol>
          )}
        </div>

        {items.length > 0 && (money.knownLineCount > 0 || money.unknownLineCount > 0) ? (
          <div
            className="shrink-0 space-y-1.5 border-t border-default bg-surface-100 px-4 py-2.5 text-right text-sm text-foreground"
            role="status"
            aria-label="List subtotals"
          >
            {money.knownLineCount > 0 ? (
              <>
                {money.subtotalCents > 0 ? (
                  <p className="m-0 space-y-0.5 text-foreground-lighter" translate="no">
                    {money.decantCents > 0 ? (
                      <span className="block">Decants: {formatCadFromCents(money.decantCents)}</span>
                    ) : null}
                    {money.bottleCents > 0 ? (
                      <span className="block">Bottles: {formatCadFromCents(money.bottleCents)}</span>
                    ) : null}
                    {money.cnrCents > 0 ? (
                      <span className="block">
                        Catch &amp; Release: {formatCadFromCents(money.cnrCents)}
                      </span>
                    ) : null}
                  </p>
                ) : null}
                <p className="m-0 font-semibold" translate="no">
                  Total (est.): {formatCadFromCents(money.subtotalCents)} CAD
                </p>
              </>
            ) : null}
            {money.unknownLineCount > 0 ? (
              <p className="m-0 text-left text-xs text-foreground-lighter" translate="no">
                Not in total: {money.unknownLineCount} line{money.unknownLineCount > 1 ? 's' : ''} with
                no parseable $ in the row (bottle or C&amp;R), or no $/ml rate to compute a decant line
                price.
              </p>
            ) : null}
          </div>
        ) : null}

        {items.length > 0 ? (
          <div className="shrink-0 border-t border-default bg-surface-100 p-3">
            <div className="flex justify-end">
              <Button type="default" onClick={clear} className="w-full sm:w-auto">
                Clear List
              </Button>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          className={cn(
            buttonVariants({ type: 'default' }),
            'absolute right-3 top-3 z-10 h-8 w-8 p-0 text-foreground-muted hover:text-foreground',
            'rounded-md border-0 bg-transparent shadow-none ring-offset-background',
            'hover:bg-overlay/30 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'
          )}
          onClick={() => setOpen(false)}
          title="Close"
        >
          <X className="h-4 w-4" aria-hidden />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>,
    document.body
  )
}
