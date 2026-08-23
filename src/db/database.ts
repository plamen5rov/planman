import Dexie, { type EntityTable } from 'dexie'
import type { Project, Task } from '../types/domain'

export class PlanmanDatabase extends Dexie {
  projects!: EntityTable<Project, 'id'>
  tasks!: EntityTable<Task, 'id'>

  constructor() {
    super('planman')
    this.version(1).stores({
      projects: 'id, status, updatedAt',
      tasks: 'id, projectId, status, dueDate, order',
    })
  }
}

export const db = new PlanmanDatabase()
