import type { LucideIcon } from 'lucide-react'
import { BookOpen, Home, ShoppingBag, Sparkles } from 'lucide-react'

import type { MenuIconKey } from '../Navigation.types'

const MENU_ICONS = {
  home: Home,
  shop: ShoppingBag,
  fragrance: Sparkles,
  blog: BookOpen,
} satisfies Record<MenuIconKey, LucideIcon>

type MenuIconPickerProps = {
  icon: MenuIconKey
  width?: number
  height?: number
  className?: string
}

function renderMenuIcon(
  menuKey: MenuIconKey,
  width: number,
  height: number,
  className: string | undefined
) {
  const Icon = MENU_ICONS[menuKey]
  return <Icon width={width} height={height} className={className} />
}

export default function MenuIconPicker({
  icon,
  width = 16,
  height = 16,
  className,
}: MenuIconPickerProps) {
  return renderMenuIcon(icon, width, height, className)
}
