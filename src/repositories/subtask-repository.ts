import { createSubtask } from '../domain/entities'
import type { Subtask } from '../types/domain'
import type { PlanmanDatabase } from '../db/database'
import type { SubtaskRepository } from './types'

export class DexieSubtaskRepository implements SubtaskRepository {
  private readonly db: PlanmanDatabase

  constructor(db: PlanmanDatabase) {
    this.db = db
  }

  async getByTaskId(taskId: string): Promise<Subtask[]> {
    const subtasks = await this.db.subtasks
      .where('taskId').equals(taskId).toArray()
    return subtasks.sort((a, b) => a.order - b.order)
  }

  async create(input: Parameters<SubtaskRepository['create']>[0]) {
    const subtask = createSubtask(input)
    await this.db.subtasks.add(subtask)
    return subtask
  }

  async update(
    id: string,
    patch: Partial<Omit<Subtask, 'id' | 'createdAt'>>,
  ): Promise<Subtask> {
    return this.db.transaction('rw', this.db.subtasks, async () => {
      const existing = await this.db.subtasks.get(id)
      if (!existing) {
        throw new Error(`Subtask ${id} not found`)
      }
      const updated: Subtask = {
        ...existing,
        ...patch,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      }
      await this.db.subtasks.put(updated)
      return updated
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.subtasks.delete(id)
  }
}