import { useEffect, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import type { Task } from '../types/domain'

const repo = new DexieTaskRepository(db)

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    repo.getAll()
      .then(setTasks)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!newTaskTitle.trim()) return
    try {
      await repo.create({ title: newTaskTitle })
      setNewTaskTitle('')
      const all = await repo.getAll()
      setTasks(all)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    }
  }

  if (loading) return <p className="caption">Loading...</p>
  if (error) return <p className="caption">{error}</p>

  return (
    <section>
      <h2 className="h2">Tasks</h2>
      <div className="card">
        {tasks.map((task) => (
          <div key={task.id} className="list-item">
            <span>{task.title}</span>
            <span className="caption">{task.status}</span>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="caption">No tasks yet.</p>
        )}
      </div>
      <div className="mt-md">
        <input
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={handleAdd} disabled={!newTaskTitle.trim()}>
          Add
        </button>
      </div>
    </section>
  )
}