import { useEffect, useMemo, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import type { Task, TaskStatus, TaskPriority } from '../types/domain'

const repo = new DexieTaskRepository(db)

const STATUS_OPTIONS: Array<{ value: TaskStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'doing', label: 'Doing' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: Array<{ value: TaskPriority | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Med' },
  { value: 'low', label: 'Low' },
  { value: 'none', label: 'None' },
]

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0, medium: 1, low: 2, none: 3,
}

const STATUS_ORDER: Record<TaskStatus, number> = {
  doing: 0, todo: 1, done: 2,
}

type SortKey = 'created' | 'priority' | 'status' | 'due'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'created', label: 'Created' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'due', label: 'Due date' },
]

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('created')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = () => repo.getAll().then(setTasks)

  useEffect(() => {
    reload()
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!newTaskTitle.trim()) return
    try {
      await repo.create({ title: newTaskTitle })
      setNewTaskTitle('')
      await reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    }
  }

  const handleToggle = async (task: Task) => {
    try {
      if (task.status === 'done') {
        await repo.update(task.id, { status: 'todo' })
      } else {
        await repo.complete(task.id)
      }
      await reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await repo.delete(id)
      await reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return
    try {
      await repo.update(id, { title: editTitle })
      setEditingId(null)
      await reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to rename')
    }
  }

  const cancelEdit = () => setEditingId(null)

  const filtered = useMemo(() => {
    const result = tasks.filter(t => {
      const matchesSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
    result.sort((a, b) => {
      switch (sortKey) {
        case 'priority': return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        case 'status': return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        case 'due': return (a.dueDate ?? 'z').localeCompare(b.dueDate ?? 'z')
        case 'created':
        default: return b.createdAt.localeCompare(a.createdAt)
      }
    })
    return result
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortKey])

  if (loading) return <p className="caption">Loading...</p>
  if (error) return <p className="caption">{error}</p>

  return (
    <section>
      <h2 className="h2">Tasks</h2>
      <input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
        className="mb-md"
      />
      <div className="mb-md" style={{ display: 'flex', gap: '8px' }}>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as TaskStatus | 'all')}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as TaskPriority | 'all')}
        >
          {PRIORITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="card">
        {filtered.map((task) => (
          <div key={task.id} className="list-item">
            <button
              type="button"
              onClick={() => handleToggle(task)}
              aria-label={task.status === 'done' ? 'Mark incomplete' : 'Mark complete'}
            >
              {task.status === 'done' ? '✓' : '○'}
            </button>
            {editingId === task.id ? (
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEdit(task.id)
                  if (e.key === 'Escape') cancelEdit()
                }}
                autoFocus
              />
            ) : (
              <span
                onDoubleClick={() => startEdit(task)}
                style={{ textDecoration: task.status === 'done' ? 'line-through' : undefined }}
              >
                {task.title}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleDelete(task.id)}
              aria-label="Delete task"
            >
              ×
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="caption">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'No matching tasks.'
              : 'No tasks yet.'}
          </p>
        )}
      </div>
      <div className="mt-md">
        <input
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
          placeholder="New task..."
        />
        <button onClick={handleAdd} disabled={!newTaskTitle.trim()}>
          Add
        </button>
      </div>
    </section>
  )
}