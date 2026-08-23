import { useEffect, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import { Checkbox } from './ui/Checkbox'
import { EmptyState } from './ui/EmptyState'
import { Button } from './ui/Button'
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

function formatDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Today({ onQuickAdd }: { onQuickAdd: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    repo.getAll()
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const overdue = tasks.filter(isOverdue)
  const todayTasks = tasks.filter(isToday)
  const upcoming = tasks.filter(isUpcoming)

  const handleToggle = async (task: Task) => {
    if (task.status === 'done') {
      await repo.update(task.id, { status: 'todo' })
    } else {
      await repo.complete(task.id)
    }
    setTasks(await repo.getAll())
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
  const dueCount = overdue.length + todayTasks.length

  if (loading) {
    return (
      <section>
        <div className="h1" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="skeleton" style={{ width: 120, height: 28, marginBottom: 'var(--space-sm)' }} />
          <div className="skeleton" style={{ width: 200, height: 18 }} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 44, marginBottom: 'var(--space-sm)' }} />
        ))}
      </section>
    )
  }

  return (
    <section>
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <p className="h1">{getGreeting()}</p>
        <p className="mono" style={{ marginTop: 'var(--space-xs)' }}>{dateStr}</p>
      </div>

      {dueCount > 0 && (
        <p className="caption" style={{ marginBottom: 'var(--space-lg)' }}>
          {overdue.length > 0 && <span className="text-danger">{overdue.length} overdue</span>}
          {overdue.length > 0 && todayTasks.length > 0 && ' \u00b7 '}
          {todayTasks.length > 0 && <span>{todayTasks.length} due today</span>}
        </p>
      )}

      {overdue.length > 0 && (
        <>
          <div className="section-label">Overdue</div>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            {overdue.map((task) => (
              <div key={task.id} className="task-row">
                <Checkbox checked={task.status === 'done'} onChange={() => handleToggle(task)} />
                <span className="task-row__title">{task.title}</span>
                {task.dueDate && <span className="task-row__meta">{formatDate(task.dueDate)}</span>}
              </div>
            ))}
          </div>
        </>
      )}

      {todayTasks.length > 0 && (
        <>
          <div className="section-label">Today</div>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            {todayTasks.map((task) => (
              <div key={task.id} className="task-row">
                <Checkbox checked={task.status === 'done'} onChange={() => handleToggle(task)} />
                <span className="task-row__title">{task.title}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <div className="section-label">Upcoming</div>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            {upcoming.slice(0, 5).map((task) => (
              <div key={task.id} className="task-row">
                <Checkbox checked={task.status === 'done'} onChange={() => handleToggle(task)} />
                <span className="task-row__title">{task.title}</span>
                {task.dueDate && <span className="task-row__meta">{formatDate(task.dueDate)}</span>}
              </div>
            ))}
          </div>
        </>
      )}

      {overdue.length === 0 && todayTasks.length === 0 && upcoming.length === 0 && (
        <EmptyState
          title="Clear day"
          description="No tasks due today. Add due dates to see them here."
          action={
            <Button variant="primary" size="sm" onClick={onQuickAdd}>
              Add a task
            </Button>
          }
        />
      )}
    </section>
  )
}
