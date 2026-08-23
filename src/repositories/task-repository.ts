import { createTask } from '../domain/entities'
import { changeTaskStatus } from '../domain/entities'
import type { Task } from '../types/domain'
import type { PlanmanDatabase } from '../db/database'
import type { TaskRepository } from './types'

export class DexieTaskRepository implements TaskRepository {
  private readonly db: PlanmanDatabase

  constructor(db: PlanmanDatabase) {
    this.db = db
  }

  async getAll(): Promise<Task[]> {
    const tasks = await this.db.tasks.toArray()
    return tasks.sort(
      (a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt),
    )
  }

  async getById(id: string): Promise<Task | undefined> {
    return this.db.tasks.get(id)
  }

  async create(input: Parameters<TaskRepository['create']>[0]) {
    const task = createTask(input)
    await this.db.tasks.add(task)
    return task
  }

  async update(
    id: string,
    patch: Partial<Omit<Task, 'id' | 'createdAt'>>,
  ): Promise<Task> {
    return this.db.transaction('rw', this.db.tasks, async () => {
      const existing = await this.db.tasks.get(id)
      if (!existing) {
        throw new Error(`Task ${id} not found`)
      }
      const updated: Task = {
        ...existing,
        ...patch,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      }
      await this.db.tasks.put(updated)
      return updated
    }
    )
  }

  async complete(id: string): Promise<Task> {
    return this.db.transaction('rw', this.db.tasks, async () => {
      const existing = await this.db.tasks.get(id)
      if (!existing) {
        throw new Error(`Task ${id} not found`)
      }
      const completed = changeTaskStatus(existing, 'done')
      await this.db.tasks.put(completed)
      return completed
    }
    )
  }

  async delete(id: string): Promise<void> {
    await this.db.tasks.delete(id)
  }
}