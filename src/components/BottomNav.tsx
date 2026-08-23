import { NAV_ITEMS } from './navItems'

interface BottomNavProps {
  activeId: string
  onSelect: (id: string) => void
}

export function BottomNav({ activeId, onSelect }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
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
                <Icon size={20} />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
