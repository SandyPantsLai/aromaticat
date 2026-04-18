'use client'

import Link from 'next/link'
import { Github, Home, LifeBuoy, Menu } from 'lucide-react'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  buttonVariants,
  cn,
} from 'ui'

/** Quick links (parity with supabase apps/docs top-nav menu; tune URLs for your deployment). */
const TOP_NAV_LINKS = [
  {
    label: 'Home',
    href: '/' as const,
    Icon: Home,
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    otherProps: { target: '_blank', rel: 'noreferrer noopener' } as const,
    Icon: Github,
  },
  {
    label: 'Support',
    href: '/blog' as const,
    Icon: LifeBuoy,
  },
]

export function TopNavDropdown() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="flex">
        <button
          title="Menu dropdown button"
          className={cn(
            buttonVariants({ type: 'default' }),
            'text-foreground-light border-default w-[30px] min-w-[30px] h-[30px] data-[state=open]:bg-overlay-hover/30 hover:border-strong data-[state=open]:border-stronger hover:!bg-overlay-hover/50 bg-transparent'
          )}
        >
          <Menu size={18} strokeWidth={1} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-52">
        {TOP_NAV_LINKS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            {...('otherProps' in item && item.otherProps ? item.otherProps : {})}
          >
            <DropdownMenuItem className="space-x-2" onClick={() => {}}>
              <item.Icon className="w-4 h-4 text-foreground-lighter shrink-0" strokeWidth={1.5} />
              <p>{item.label}</p>
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
