import { Menu } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import { memo, useState } from 'react'
// End of third-party imports

import { isFeatureEnabled } from 'common/enabled-features'
import { CommandMenuTriggerInput } from 'ui-patterns'
import { buttonVariants, cn } from 'ui'
import { DmListTrigger } from '~/features/shop/dmList/DmListTrigger'
import { getCustomContent } from '../../../lib/custom-content/getCustomContent'
import GlobalNavigationMenu from './GlobalNavigationMenu'

const GlobalMobileMenu = dynamic(() => import('./GlobalMobileMenu'))

const largeLogo = isFeatureEnabled('branding:large_logo')

const searchPlaceholder = (
  <>
    Search
    <span className="hidden xl:inline opacity-70"></span>
  </>
)

const TopNavBar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav
        aria-label="top bar"
        className="w-full z-40 flex flex-col border-b backdrop-blur backdrop-filter bg bg-opacity-75"
      >
        <div className="w-full px-5 lg:pl-10 flex items-center h-[var(--header-height)] gap-3">
          {/* Desktop: logo, primary nav, then a visible search control */}
          <div className="hidden lg:flex h-full items-center gap-3 min-w-0 flex-1">
            <HeaderLogo />
            <GlobalNavigationMenu />
            <div className="min-w-[12rem] max-w-lg flex-1 pl-2">
              <CommandMenuTriggerInput className="w-full" placeholder={searchPlaceholder} />
            </div>
            <div className="shrink-0">
              <DmListTrigger />
            </div>
          </div>

          {/* Mobile: logo + search + hamburger menu */}
          <div className="flex w-full min-w-0 gap-3 justify-between lg:hidden items-center h-full">
            <HeaderLogo />
            <div className="flex gap-2 items-center shrink-0">
              <CommandMenuTriggerInput placeholder={searchPlaceholder} />
              <DmListTrigger />
              <button
                title="Menu dropdown button"
                className={cn(
                  buttonVariants({ type: 'default' }),
                  'flex border-default bg-surface-100/75 text-foreground-light rounded-md min-w-[30px] w-[30px] h-[30px] data-[state=open]:bg-overlay-hover/30'
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
