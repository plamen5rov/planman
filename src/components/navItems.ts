import { House, ListChecks, Folder } from '@phosphor-icons/react'
import type { ComponentType } from 'react'

export interface NavItem {
  id: string
  label: string
  icon: ComponentType<{ size?: number }>
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'today', label: 'Today', icon: House },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'tasks', label: 'Tasks', icon: ListChecks },
]
