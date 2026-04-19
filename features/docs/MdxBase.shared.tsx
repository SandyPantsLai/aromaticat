import { ArrowDown, Check, X } from 'lucide-react'
import Link from 'next/link'
import { Badge, Button } from 'ui'
import { Admonition, type AdmonitionProps } from 'ui-patterns/admonition'
import { GlassPanel } from 'ui-patterns/GlassPanel'
import { IconPanel } from 'ui-patterns/IconPanel'
import SqlToRest from 'ui-patterns/SqlToRest'
import { Heading } from 'ui/src/components/CustomHTMLElements'
import { AppleSecretGenerator } from '~/components/AppleSecretGenerator'
import AuthProviders from '~/components/AuthProviders'
import { AuthSmsProviderConfig } from '~/components/AuthSmsProviderConfig'
import { CostWarning } from '~/components/AuthSmsProviderConfig/AuthSmsProviderConfig.Warnings'
import ButtonCard from '~/components/ButtonCard'
import { Extensions } from '~/components/Extensions'
import { DecantFacts } from '~/components/DecantFacts'
import { FragranceCost } from '~/components/FragranceCost'
import { FragranceImage } from '~/components/FragranceImage'
import { FragranceNotes } from '~/components/FragranceNotes'
import Image, { type ImageProps } from '~/components/Image'
import { JwtGenerator, JwtGeneratorSimple } from '~/components/JwtGenerator'
import { MetricsStackCards } from '~/components/MetricsStackCards'
import { NavData } from '~/components/NavData'
import { Price } from '~/components/Price'
import { ProjectConfigVariables } from '~/components/ProjectConfigVariables'
import { RealtimeLimitsEstimator } from '~/components/RealtimeLimitsEstimator'
import { ComputeDiskLimitsTable } from '~/components/ComputeDiskLimitsTable'
import { RegionsList, SmartRegionsList } from '~/components/RegionsList'
import { SharedData } from '~/components/SharedData'
import { Accordion, AccordionItem } from '~/features/ui/Accordion'
import { MdxPlainPre } from '~/features/docs/MdxPlainPre'
import InfoTooltip from '~/features/ui/InfoTooltip'
import { ShowUntil } from '~/features/ui/ShowUntil'
import { TabPanel, Tabs } from '~/features/ui/Tabs'

// Wrap Admonition for Docs-specific styling (within MDX prose, requires a margin-bottom)
const AdmonitionWithMargin = (props: AdmonitionProps) => {
  return <Admonition {...props} className="mb-8" />
}

const components = {
  Accordion,
  AccordionItem,
  Admonition: AdmonitionWithMargin,
  AuthSmsProviderConfig,
  AppleSecretGenerator,
  AuthProviders,
  Badge,
  Button,
  ButtonCard,
  ComputeDiskLimitsTable,
  CostWarning,
  DecantFacts,
  Extensions,
  FragranceCost,
  FragranceImage,
  FragranceNotes,
  GlassPanel,
  IconArrowDown: ArrowDown,
  IconCheck: Check,
  IconPanel,
  IconX: X,
  Image: (props: ImageProps) => <Image className="rounded-md w-full" {...props} />,
  JwtGenerator,
  JwtGeneratorSimple,
  Link,
  MetricsStackCards,
  NavData,
  ProjectConfigVariables,
  RealtimeLimitsEstimator,
  RegionsList,
  SmartRegionsList,
  SharedData,
  ShowUntil,
  SqlToRest,
  Tabs,
  TabPanel,
  InfoTooltip,
  h2: (props: any) => (
    <Heading tag="h2" {...props}>
      {props.children}
    </Heading>
  ),
  h3: (props: any) => (
    <Heading tag="h3" {...props}>
      {props.children}
    </Heading>
  ),
  h4: (props: any) => (
    <Heading tag="h4" {...props}>
      {props.children}
    </Heading>
  ),
  pre: MdxPlainPre,
  Price,
}

export { components }
