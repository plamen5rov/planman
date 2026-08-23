export interface Entity {
  id: string
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'todo' | 'doing' | 'done'

export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'archived'

export type TaskPriority = 'none' | 'low' | 'medium' | 'high'

export interface Project extends Entity {
  name: string
  description?: string
  status: ProjectStatus
  color?: string
  icon?: string
}

export interface Tag extends Entity {
  name: string
  color?: string
}

export interface Task extends Entity {
  title: string
  description?: string
  projectId?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  completedAt?: string
  order: number
  tagIds: string[]
}
