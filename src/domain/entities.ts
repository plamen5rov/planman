import type {
  Project,
  Subtask,
  Tag,
  Task,
  TaskPriority,
  TaskStatus,
} from '../types/domain'

function nowIso(): string {
  return new Date().toISOString()
}

function requireText(value: string, field: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new Error(`${field} must not be empty`)
  }
  return trimmed
}

export interface CreateProjectInput {
  name: string
  description?: string
  color?: string
  icon?: string
}

export function createProject(input: CreateProjectInput): Project {
  const now = nowIso()
  return {
    id: crypto.randomUUID(),
    name: requireText(input.name, 'Project name'),
    status: 'active',
    createdAt: now,
    updatedAt: now,
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.color !== undefined && { color: input.color }),
    ...(input.icon !== undefined && { icon: input.icon }),
  }
}

export interface CreateTaskInput {
  title: string
  description?: string
  projectId?: string
  priority?: TaskPriority
  dueDate?: string
  order?: number
  tagIds?: string[]
}

export function createTask(input: CreateTaskInput): Task {
  const now = nowIso()
  return {
    id: crypto.randomUUID(),
    title: requireText(input.title, 'Task title'),
    status: 'todo',
    priority: input.priority ?? 'none',
    order: input.order ?? 0,
    tagIds: input.tagIds ?? [],
    createdAt: now,
    updatedAt: now,
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.projectId !== undefined && { projectId: input.projectId }),
    ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
  }
}

export interface CreateTagInput {
  name: string
  color?: string
}

export function createTag(input: CreateTagInput): Tag {
  const now = nowIso()
  return {
    id: crypto.randomUUID(),
    name: requireText(input.name, 'Tag name'),
    createdAt: now,
    updatedAt: now,
    ...(input.color !== undefined && { color: input.color }),
  }
}

export interface CreateSubtaskInput {
  taskId: string
  title: string
  order?: number
}

export function createSubtask(input: CreateSubtaskInput): Subtask {
  const now = nowIso()
  return {
    id: crypto.randomUUID(),
    taskId: input.taskId,
    title: requireText(input.title, 'Subtask title'),
    completed: false,
    order: input.order ?? 0,
    createdAt: now,
    updatedAt: now,
  }
}

export function changeTaskStatus(task: Task, status: TaskStatus): Task {
  const updatedAt = nowIso()
  if (status === 'done') {
    return {
      ...task,
      status,
      completedAt: task.completedAt ?? nowIso(),
      updatedAt,
    }
  }
  const { completedAt: _cleared, ...rest } = task
  return { ...rest, status, updatedAt }
}
