import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { PlanmanDatabase } from '../db/database'
import { DexieProjectRepository } from './project-repository'
import { DexieTaskRepository } from './task-repository'

describe('DexieProjectRepository', () => {
  let repo: DexieProjectRepository

  beforeEach(async () => {
    const db = new PlanmanDatabase()
    await Promise.all([db.projects.clear(), db.tasks.clear()])
    repo = new DexieProjectRepository(db)
  })

  it('creates, reads and lists projects', async () => {
    const created = await repo.create({ name: 'Home renovation' })
    await repo.create({ name: 'Learn piano' })

    const byId = await repo.getById(created.id)
    expect(byId?.name).toBe('Home renovation')

    const all = await repo.getAll()
    expect(all.map((p) => p.name)).toEqual(['Home renovation', 'Learn piano'])
  })

  it('updates a project and bumps updatedAt', async () => {
    const created = await repo.create({ name: 'Before' })

    const updated = await repo.update(created.id, {
      name: 'After',
      description: 'Updated',
    })
    expect(updated.name).toBe('After')
    expect(updated.updatedAt >= created.createdAt).toBe(true)

    expect(await repo.getById(created.id)).toMatchObject({ name: 'After' })
  })

  it('archives a project', async () => {
    const created = await repo.create({ name: 'Old thing' })
    const archived = await repo.archive(created.id)
    expect(archived.status).toBe('archived')
  })

  it('deletes a project', async () => {
    const created = await repo.create({ name: 'Temp' })
    await repo.delete(created.id)
    expect(await repo.getById(created.id)).toBeUndefined()
  })

  it('rejects updates for missing projects', async () => {
    await expect(repo.update('nope', { name: 'X' })).rejects.toThrow(
      /not found/,
    )
  })
})

describe('DexieTaskRepository', () => {
  let repo: DexieTaskRepository

  beforeEach(async () => {
    const db = new PlanmanDatabase()
    await db.tasks.clear()
    repo = new DexieTaskRepository(db)
  })

  it('creates, reads, completes and deletes tasks', async () => {
    const created = await repo.create({
      title: 'Buy milk',
      priority: 'high',
      order: 2,
    })
    expect(await repo.getById(created.id)).toMatchObject({
      title: 'Buy milk',
      status: 'todo',
    })

    const completed = await repo.complete(created.id)
    expect(completed.status).toBe('done')
    expect(completed.completedAt).toBeDefined()

    await repo.delete(created.id)
    expect(await repo.getById(created.id)).toBeUndefined()
  })

  it('lists tasks ordered by order then creation time', async () => {
    await repo.create({ title: 'B', order: 1 })
    await repo.create({ title: 'A', order: 0 })
    const later = await repo.create({ title: 'C', order: 1 })

    const all = await repo.getAll()
    expect(all.map((t) => t.title)).toEqual(['A', 'B', 'C'])
    expect(later.order).toBe(1)
  })

  it('assigns a task to a project via update', async () => {
    const task = await repo.create({ title: 'T' })
    const updated = await repo.update(task.id, { projectId: 'p-1' })
    expect(updated.projectId).toBe('p-1')
  })

  it('rejects completion of missing tasks', async () => {
    await expect(repo.complete('missing')).rejects.toThrow(/not found/)
  })
})
