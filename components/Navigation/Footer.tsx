import Link from 'next/link'
import { Button, cn, IconDiscord, IconGitHubSolid, IconTwitterX, IconYoutubeSolid } from 'ui'
import { primaryLinks, secondaryLinks } from '~/data/footer'
import { LayoutMainContent } from '~/layouts/DefaultLayout'

const Footer = ({ className }: { className?: string }) => (
  <LayoutMainContent className={cn('pt-0', className)}>
    <footer role="contentinfo" aria-label="footer">
      <div className="mt-16">
        <ul className="flex flex-col gap-2">
          {primaryLinks.map(({ url, featherIcon: Icon, text, ctaLabel }) => (
            <li key={url} className="flex items-center gap-1 text-xs text-foreground-lighter">
              {Icon && <Icon aria-hidden="true" size={16} strokeWidth={1} />}
              <p>{text}</p>
              <Link
                href={url}
                className="text-brand-link hover:underline"
                target="_blank"
                rel="noreferrer noopener"
              >
                {ctaLabel}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <hr className="border-default my-6"></hr>
      <div className="flex gap-4 items-center justify-between">
        <div className="flex flex-col lg:flex-row gap-3 ">
          <Link href="https://supabase.com/" className="text-xs text-foreground-lighter">
            &copy; AromatiCat 2026
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://parfumo.com"
            className="text-foreground-muted hover:text-foreground transition"
          >
            <span className="sr-only">Parfumo</span>
            <IconTwitterX size={14} />
          </a>

          <a
            href="https://fragrantica.com"
            className="text-foreground-muted hover:text-foreground transition"
          >
            <span className="sr-only">Fragantica</span>
            <IconGitHubSolid size={14} />
          </a>

          <a
            href="https://basenotes.com/"
            className="text-foreground-muted hover:text-foreground transition"
          >
            <span className="sr-only">Basenotes</span>
            <IconDiscord size={14} />
          </a>
        </div>
      </div>
    </footer>
  </LayoutMainContent>
)

export default Footer
