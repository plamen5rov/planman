import type { ReactNode } from 'react'
import { ListChecks } from '@phosphor-icons/react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {icon ?? <ListChecks size={48} />}
      </div>
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__desc">{description}</p>
      {action}
    </div>
  )
}
