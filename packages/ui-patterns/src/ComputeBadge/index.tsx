import { components } from 'api-types'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from 'ui'

interface ComputeBadgeProps extends HTMLAttributes<HTMLDivElement> {
  infraComputeSize:
    | components['schemas']['ProjectDetailResponse']['infra_compute_size']
    | '>16XL'
    | undefined
  icon?: ReactNode
}
