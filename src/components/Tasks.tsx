import { useEffect, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import type { Task } from '../types/domain'

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const repo = new DexieTaskRepository(db)

  useEffect(() => {
    repo.getAll().then(setTasks)
  }, [])

  const handleAdd = async () => {
    if (!newTaskTitle.trim()) return
    await repo.create({ title: newTaskTitle })
    setNewTaskTitle('')
    repo.getAll().then(setTasks)
  }

  return (
    <section>
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span>
            <span>{task.status}</span>
          </li>
        ))}
      </ul>
      <div>
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