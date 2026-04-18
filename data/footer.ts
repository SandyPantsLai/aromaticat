import { CheckCircle, FlaskConical, LifeBuoy } from 'lucide-react'
import { PrivacySettings } from 'ui-patterns/PrivacySettings'

export const primaryLinks = [
  {
    featherIcon: LifeBuoy,
    text: 'Need some help?',
    ctaLabel: 'Contact support',
    url: 'https://supabase.com/support',
  },
  {
    featherIcon: FlaskConical,
    text: 'Latest product updates?',
    ctaLabel: 'See Changelog',
    url: 'https://supabase.com/changelog',
  },
  {
    featherIcon: CheckCircle,
    text: "Something's not right?",
    ctaLabel: 'Check system status',
    url: 'https://status.supabase.com/',
  },
]

export const secondaryLinks = [
  { title: 'Open Source', url: 'https://supabase.com/open-source' },
  { title: 'Privacy Settings', component: PrivacySettings },
]
