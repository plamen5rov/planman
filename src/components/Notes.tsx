import { useEffect, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'
import type { Task } from '../types/domain'

export function Notes() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const repo = new DexieTaskRepository(db)

  useEffect(() => {
    repo.getAll().then(setTasks)
  }, [])

  const handleAdd = async () => {
    if (!newNoteTitle.trim()) return
    await repo.create({ title: newNoteTitle })
    setNewNoteTitle('')
    repo.getAll().then(setTasks)
  }

  return (
    <section>
      <h2>Notes</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span>
          </li>
        ))}
      </ul>
      <div>
        <input
          value={newNoteTitle}
          onChange={e => setNewNoteTitle(e.target.value)}
          placeholder="New note..."
        />
        <button onClick={handleAdd} disabled={!newNoteTitle.trim()}>
          Add
        </button>
      </div>
    </section>
  )
}