import { Menu } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import { memo, useState } from 'react'
// End of third-party imports

import { isFeatureEnabled } from 'common/enabled-features'
import { DevToolbarTrigger } from 'dev-tools'
import { buttonVariants, cn } from 'ui'
import { getCustomContent } from '../../../lib/custom-content/getCustomContent'
import GlobalNavigationMenu from './GlobalNavigationMenu'

const GlobalMobileMenu = dynamic(() => import('./GlobalMobileMenu'))

const largeLogo = isFeatureEnabled('branding:large_logo')

const TopNavBar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav
        aria-label="top bar"
        className="w-full z-40 flex flex-col border-b backdrop-blur backdrop-filter bg bg-opacity-75"
      >
        <div className="w-full px-5 lg:pl-10 flex justify-between h-[var(--header-height)] gap-3">
          <div className="hidden lg:flex h-full items-center justify-center gap-2">
            <HeaderLogo />
            <GlobalNavigationMenu />
          </div>
          <div className="w-full grow lg:w-auto flex gap-3 justify-between lg:justify-end items-center h-full">
            <div className="lg:hidden">
              <HeaderLogo />
            </div>

            <div className="flex gap-2 items-center">
              <DevToolbarTrigger />
              <Link
                href="/shop"
                className={cn(
                  buttonVariants({ type: 'default', size: 'tiny' }),
                  'hidden sm:inline-flex border-default bg-surface-100/75 text-foreground-light rounded-md px-3 h-[30px] items-center text-sm no-underline'
                )}
              >
                Browse Shop
              </Link>
              <button
                title="Menu dropdown button"
                className={cn(
                  buttonVariants({ type: 'default' }),
                  'flex lg:hidden border-default bg-surface-100/75 text-foreground-light rounded-md min-w-[30px] w-[30px] h-[30px] data-[state=open]:bg-overlay-hover/30'
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={18} strokeWidth={1} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <GlobalMobileMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
    </>
  )
}

const HeaderLogo = memo(() => {
  const { navigationLogo } = getCustomContent(['navigation:logo'])

  return (
    <Link
      href="/"
      className={cn(
        buttonVariants({ type: 'default' }),
        'flex shrink-0 items-center w-fit !bg-transparent !border-none !shadow-none'
      )}
    >
      <Image
        className={cn('!m-0', largeLogo && 'h-[36px]')}
        src={navigationLogo?.light ?? '/aromaticat-long-logo.svg'}
        priority={true}
        loading="eager"
        width={navigationLogo?.width ?? 124}
        height={navigationLogo?.height ?? 24}
        alt="Aromaticat wordmark"
      />
    </Link>
  )
})

HeaderLogo.displayName = 'HeaderLogo'

TopNavBar.displayName = 'TopNavBar'

export default TopNavBar
