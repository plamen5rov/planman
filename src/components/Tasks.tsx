import { useEffect, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import type { Task } from '../types/domain'

const repo = new DexieTaskRepository(db)

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
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

  const filtered = searchQuery
    ? tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : tasks

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
            {searchQuery ? 'No matching tasks.' : 'No tasks yet.'}
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