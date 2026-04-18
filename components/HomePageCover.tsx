'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from 'ui'

import { getCustomContent } from '../lib/custom-content/getCustomContent'
import DocsCoverLogo from './DocsCoverLogo'

const HomePageCover = (props: { title: string }) => {
  const { homepageHeading } = getCustomContent(['homepage:heading'])

  return (
    <div className="relative z-10 w-full bg-alternative border-b max-w-none mb-16 md:mb-12 xl:mb-0">
      <div className="max-w-7xl px-5 mx-auto py-8 sm:pb-16 sm:pt-12 xl:pt-16 flex flex-col xl:flex-row justify-between gap-12 xl:gap-12">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center w-full max-w-xl xl:max-w-[33rem]">
          <DocsCoverLogo aria-hidden="true" />
          <div className="flex flex-col gap-3">
            <h1 className="m-0 text-2xl sm:text-3xl text-foreground">
              {homepageHeading || props.title}
            </h1>
            <p className="m-0 text-foreground-light">
              Fragrance-focused documentation: materials, accords, and how we write scent guides on
              this site.
            </p>
            <Link
              href="/fragrance-notes"
              className={cn(
                'group w-fit rounded-full border px-3 py-1 flex gap-2 items-center',
                'text-foreground-light text-sm hover:border-brand hover:text-brand-link',
                'focus-visible:text-brand-link transition-colors'
              )}
            >
              Read the fragrance overview
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePageCover
