import { useEffect, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import type { Task } from '../types/domain'

const repo = new DexieTaskRepository(db)

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function isOverdue(task: Task): boolean {
  return !!task.dueDate && task.dueDate < today() && task.status !== 'done'
}

function isToday(task: Task): boolean {
  return task.dueDate === today() && task.status !== 'done'
}

function isUpcoming(task: Task): boolean {
  return !!task.dueDate && task.dueDate > today() && task.status !== 'done'
}

export function Today() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    repo.getAll()
      .then(setTasks)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const overdue = tasks.filter(isOverdue)
  const todayTasks = tasks.filter(isToday)
  const upcoming = tasks.filter(isUpcoming)

  if (loading) return <p className="caption">Loading...</p>
  if (error) return <p className="caption">{error}</p>

  return (
    <section>
      <h2 className="h2">Today</h2>
      {overdue.length > 0 && (
        <div className="card">
          <h3 className="h3">Overdue</h3>
          {overdue.map((task) => (
            <div key={task.id} className="list-item">
              <span>{task.title}</span>
              <span className="caption">{task.dueDate}</span>
            </div>
          ))}
        </div>
      )}
      {todayTasks.length > 0 && (
        <div className="card">
          <h3 className="h3">Today</h3>
          {todayTasks.map((task) => (
            <div key={task.id} className="list-item">
              <span>{task.title}</span>
            </div>
          ))}
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="card">
          <h3 className="h3">Upcoming</h3>
          {upcoming.map((task) => (
            <div key={task.id} className="list-item">
              <span>{task.title}</span>
              <span className="caption">{task.dueDate}</span>
            </div>
          ))}
        </div>
      )}
      {overdue.length === 0 && todayTasks.length === 0 && upcoming.length === 0 && (
        <p className="caption">No tasks for today. Add due dates to tasks to see them here.</p>
      )}
    </section>
  )
}