import { useEffect, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { CommandPalette } from './components/CommandPalette'
import { SidebarNav } from './components/SidebarNav'
import { NAV_ITEMS } from './components/navItems'
import { Projects } from './components/Projects'
import { QuickAdd } from './components/QuickAdd'
import { Tasks } from './components/Tasks'
import { Today } from './components/Today'

function App() {
  const [activeId, setActiveId] = useState(NAV_ITEMS[0]!.id)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const active = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0]!

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setQuickAddOpen(true)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(true)
      }
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = document.activeElement
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
        const num = parseInt(e.key, 10)
        if (num >= 1 && num <= NAV_ITEMS.length) {
          setActiveId(NAV_ITEMS[num - 1]!.id)
          return
        }
        if (e.key === 'n' || e.key === 'N') {
          setQuickAddOpen(true)
          return
        }
        if (e.key === 't' || e.key === 'T') {
          setActiveId('today')
          return
        }
        if (e.key === 'p' || e.key === 'P') {
          setActiveId('projects')
          return
        }
        if (e.key === 's' || e.key === 'S') {
          setActiveId('tasks')
          return
        }
      }
      if (e.key === 'Escape') {
        setQuickAddOpen(false)
        setCmdOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const section = active.id === 'today'
    ? <Today />
    : active.id === 'projects'
    ? <Projects />
    : active.id === 'tasks'
    ? <Tasks />
    : <p>This section is not implemented yet.</p>

  return (
    <div className="app">
      <header className="app-header">
        <h1>Planman</h1>
      </header>
      <div className="app-body">
        <SidebarNav activeId={activeId} onSelect={setActiveId} />
        <main className="app-main">
          <h2>{active.label}</h2>
          {section}
        </main>
      </div>
      <BottomNav activeId={activeId} onSelect={setActiveId} />
      <QuickAdd open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={setActiveId}
      />
    </div>
  )
}

export default App