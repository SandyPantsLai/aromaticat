import { type ComponentProps } from 'react'

import type { MenuIconKey } from '~/components/Navigation/Navigation.types'
import { IconPanel } from 'ui-patterns/IconPanel'
import MenuIconPicker from '~/components/Navigation/NavigationMenu/MenuIconPicker'

type IconPanelWithIconPickerProps = Omit<ComponentProps<typeof IconPanel>, 'icon'> & {
  icon: MenuIconKey
}

function IconPanelWithIconPicker({ icon, ...props }: IconPanelWithIconPickerProps) {
  return <IconPanel icon={<MenuIconPicker icon={icon} width={18} height={18} />} {...props} />
}

export { IconPanelWithIconPicker }
