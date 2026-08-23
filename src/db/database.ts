import Dexie, { type EntityTable } from 'dexie'
import type { Project, Tag, Task } from '../types/domain'

export class PlanmanDatabase extends Dexie {
  projects!: EntityTable<Project, 'id'>
  tasks!: EntityTable<Task, 'id'>
  tags!: EntityTable<Tag, 'id'>

  constructor() {
    super('planman')
    this.version(1).stores({
      projects: 'id, status, updatedAt',
      tasks: 'id, projectId, status, dueDate, order',
    })
    this.version(2).stores({
      tags: 'id, name',
      tasks: 'id, projectId, status, dueDate, order, *tagIds',
    })
  }
}

export const db = new PlanmanDatabase()
