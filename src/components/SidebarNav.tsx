import { NAV_ITEMS } from './navItems'

interface SidebarNavProps {
  activeId: string
  onSelect: (id: string) => void
}

export function SidebarNav({ activeId, onSelect }: SidebarNavProps) {
  return (
    <nav className="sidebar-nav" aria-label="Primary">
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-current={item.id === activeId ? 'page' : undefined}
              onClick={() => onSelect(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
