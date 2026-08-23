import { NAV_ITEMS } from './navItems'

interface SidebarNavProps {
  activeId: string
  onSelect: (id: string) => void
}

export function SidebarNav({ activeId, onSelect }: SidebarNavProps) {
  return (
    <nav className="sidebar-nav" aria-label="Primary">
      <ul>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={item.id === activeId ? 'page' : undefined}
                onClick={() => onSelect(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
