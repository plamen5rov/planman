import type { CreateProjectInput } from '../domain/entities'
import { createProject } from '../domain/entities'
import type { PlanmanDatabase } from '../db/database'
import type { Project } from '../types/domain'
import type { ProjectRepository } from './types'

export class DexieProjectRepository implements ProjectRepository {
  private readonly db: PlanmanDatabase

  constructor(db: PlanmanDatabase) {
    this.db = db
  }

  async getAll(): Promise<Project[]> {
    const projects = await this.db.projects.toArray()
    return projects.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }

  async getById(id: string): Promise<Project | undefined> {
    return this.db.projects.get(id)
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const project = createProject(input)
    await this.db.projects.add(project)
    return project
  }

  async update(
    id: string,
    patch: Partial<Omit<Project, 'id' | 'createdAt'>>,
  ): Promise<Project> {
    return this.db.transaction('rw', this.db.projects, async () => {
      const existing = await this.db.projects.get(id)
      if (!existing) {
        throw new Error(`Project ${id} not found`)
      }
      const updated: Project = {
        ...existing,
        ...patch,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      }
      await this.db.projects.put(updated)
      return updated
    })
  }

  async archive(id: string): Promise<Project> {
    return this.update(id, { status: 'archived' })
  }

  async delete(id: string): Promise<void> {
    await this.db.projects.delete(id)
  }
}
