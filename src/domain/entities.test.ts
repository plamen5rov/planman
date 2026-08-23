import { describe, expect, it } from 'vitest'
import { changeTaskStatus, createProject, createTask } from './entities.ts'

describe('createProject', () => {
  it('creates an active project with identity and timestamps', () => {
    const before = new Date().toISOString()
    const project = createProject({ name: 'Home renovation' })

    expect(project.name).toBe('Home renovation')
    expect(project.status).toBe('active')
    expect(project.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )
    expect(project.createdAt >= before).toBe(true)
    expect(project.updatedAt).toBe(project.createdAt)
  })

  it('keeps optional fields absent when not provided', () => {
    const project = createProject({ name: 'Minimal' })
    expect('description' in project).toBe(false)
    expect('color' in project).toBe(false)
    expect('icon' in project).toBe(false)
  })

  it('rejects an empty name', () => {
    expect(() => createProject({ name: '   ' })).toThrow()
  })
})

describe('createTask', () => {
  it('creates a todo task with none priority by default', () => {
    const task = createTask({ title: 'Buy milk' })

    expect(task.title).toBe('Buy milk')
    expect(task.status).toBe('todo')
    expect(task.priority).toBe('none')
    expect(task.order).toBe(0)
    expect('projectId' in task).toBe(false)
    expect('dueDate' in task).toBe(false)
    expect('completedAt' in task).toBe(false)
  })

  it('rejects an empty title', () => {
    expect(() => createTask({ title: '' })).toThrow()
  })
})

describe('changeTaskStatus', () => {
  it('sets completedAt when a task becomes done and keeps existing value', () => {
    const task = createTask({ title: 'A' })
    const done = changeTaskStatus(task, 'done')

    expect(done.status).toBe('done')
    expect(done.completedAt).toBeDefined()

    const redone = changeTaskStatus(done, 'doing')
    const doneAgain = changeTaskStatus(redone, 'done')
    expect(doneAgain.completedAt).toBe(done.completedAt)
  })

  it('clears completedAt when a done task is reopened', () => {
    const done = changeTaskStatus(createTask({ title: 'A' }), 'done')
    const reopened = changeTaskStatus(done, 'todo')

    expect(reopened.status).toBe('todo')
    expect('completedAt' in reopened).toBe(false)
  })
})
