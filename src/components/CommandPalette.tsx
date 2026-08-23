import { useEffect, useRef, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import { Modal } from './ui/Modal'
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
    { id: 'today', label: 'Go to Today', shortcut: '1 / T', action: () => { onNavigate('today'); onClose() } },
    { id: 'projects', label: 'Go to Projects', shortcut: '2 / P', action: () => { onNavigate('projects'); onClose() } },
    { id: 'tasks', label: 'Go to Tasks', shortcut: '3 / S', action: () => { onNavigate('tasks'); onClose() } },
    { id: 'new-task', label: 'New task', shortcut: 'N / Ctrl+N', action: () => { onNavigate('tasks'); onClose() } },
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

  return (
    <Modal open={open} onClose={onClose}>
      <input
        ref={inputRef}
        className="palette-input"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Escape') onClose()
          if (e.key === 'Enter' && filtered.length > 0) filtered[0]!.action()
        }}
        placeholder="Type a command..."
      />
      <div style={{ maxHeight: 300, overflowY: 'auto', padding: 'var(--space-sm)' }}>
        {filtered.map((cmd) => (
          <button
            key={cmd.id}
            type="button"
            className="palette-item"
            onClick={cmd.action}
          >
            <span>{cmd.label}</span>
            {cmd.shortcut && <span className="palette-item__shortcut">{cmd.shortcut}</span>}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="caption" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>No commands found.</p>
        )}
      </div>
    </Modal>
  )
}
