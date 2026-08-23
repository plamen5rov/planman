import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { SidebarNav } from './components/SidebarNav'
import { NAV_ITEMS } from './components/navItems'
import { Projects } from './components/Projects'
import { Tasks } from './components/Tasks'

function App() {
  const [activeId, setActiveId] = useState(NAV_ITEMS[0]!.id)
  const active = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0]!

  const section = active.id === 'projects'
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
    </div>
  )
}

export default App
