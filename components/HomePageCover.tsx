'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from 'ui'

import { BASE_PATH } from '~/lib/constants'

import { getCustomContent } from '../lib/custom-content/getCustomContent'

const HERO_BG = `${BASE_PATH}/img/fragrances-cartoon.png`

const HomePageCover = (props: { title: string }) => {
  const { homepageHeading } = getCustomContent(['homepage:heading'])

  return (
    <div className="relative z-10 w-full max-w-none overflow-hidden border-b border-default mb-16 md:mb-12 xl:mb-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background/70 dark:bg-background/60"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-8 text-center sm:pb-16 sm:pt-12 xl:pt-16">
        <div className="flex max-w-xl flex-col items-center gap-3">
          <h1 className="m-0 text-2xl text-foreground sm:text-3xl">
            {homepageHeading || props.title}
          </h1>
          <p className="m-0 text-foreground-light">
            A decant site for CFE Group members only.
          </p>
          <Link
            href="/shop/decants/overview"
            className={cn(
              'group inline-flex w-fit items-center justify-center gap-2 rounded-full border border-black px-3 py-1',
              'text-foreground-light text-sm transition-colors',
              'hover:border-brand-link hover:text-brand-link',
              'focus-visible:border-brand-link focus-visible:text-brand-link focus-visible:outline-none'
            )}
          >
            Explore the shop
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePageCover
