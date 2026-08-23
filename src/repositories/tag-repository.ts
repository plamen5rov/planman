import { createTag } from '../domain/entities'
import type { Tag } from '../types/domain'
import type { PlanmanDatabase } from '../db/database'
import type { TagRepository } from './types'

export class DexieTagRepository implements TagRepository {
  private readonly db: PlanmanDatabase

  constructor(db: PlanmanDatabase) {
    this.db = db
  }

  async getAll(): Promise<Tag[]> {
    const tags = await this.db.tags.toArray()
    return tags.sort((a, b) => a.name.localeCompare(b.name))
  }

  async getById(id: string): Promise<Tag | undefined> {
    return this.db.tags.get(id)
  }

  async create(input: Parameters<TagRepository['create']>[0]) {
    const tag = createTag(input)
    await this.db.tags.add(tag)
    return tag
  }

  async update(
    id: string,
    patch: Partial<Omit<Tag, 'id' | 'createdAt'>>,
  ): Promise<Tag> {
    return this.db.transaction('rw', this.db.tags, async () => {
      const existing = await this.db.tags.get(id)
      if (!existing) {
        throw new Error(`Tag ${id} not found`)
      }
      const updated: Tag = {
        ...existing,
        ...patch,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      }
      await this.db.tags.put(updated)
      return updated
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.tags.delete(id)
  }
}