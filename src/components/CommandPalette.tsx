import { useEffect, useRef, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import type { Task } from '../types/domain'

const taskRepo = new DexieTaskRepository(db)

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onNavigate: (section: string) => void
}

interface Command {
  id: string
  label: string
  shortcut?: string
  action: () => void
}

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      inputRef.current?.focus()
      taskRepo.getAll().then(setTasks).catch(() => {})
    }
  }, [open])

  const commands: Command[] = [
    { id: 'today', label: 'Go to Today', shortcut: '1', action: () => { onNavigate('today'); onClose() } },
    { id: 'projects', label: 'Go to Projects', shortcut: '2', action: () => { onNavigate('projects'); onClose() } },
    { id: 'tasks', label: 'Go to Tasks', shortcut: '3', action: () => { onNavigate('tasks'); onClose() } },
    { id: 'calendar', label: 'Go to Calendar', shortcut: '4', action: () => { onNavigate('calendar'); onClose() } },
  ]

  const taskCommands: Command[] = tasks.slice(0, 10).map(t => ({
    id: `task-${t.id}`,
    label: t.title,
    action: () => { onNavigate('tasks'); onClose() },
  }))

  const all = [...commands, ...taskCommands]
  const filtered = query
    ? all.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : all

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '15vh', background: 'rgba(0,0,0,0.3)',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'Enter' && filtered.length > 0) filtered[0]!.action()
          }}
          placeholder="Type a command..."
          style={{ width: '100%', marginBottom: 12 }}
        />
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              onClick={cmd.action}
              style={{
                display: 'flex', width: '100%', justifyContent: 'space-between',
                padding: '8px 12px', border: 0, background: 'transparent',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span>{cmd.label}</span>
              {cmd.shortcut && <span className="caption">{cmd.shortcut}</span>}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="caption">No commands found.</p>
          )}
        </div>
      </div>
    </div>
  )
}