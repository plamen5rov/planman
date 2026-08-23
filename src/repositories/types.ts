import type {
  CreateProjectInput,
  CreateTaskInput,
} from '../domain/entities'
import type { Project, Task } from '../types/domain'

export interface ProjectRepository {
  getAll(): Promise<Project[]>
  getById(id: string): Promise<Project | undefined>
  create(input: CreateProjectInput): Promise<Project>
  update(
    id: string,
    patch: Partial<Omit<Project, 'id' | 'createdAt'>>,
  ): Promise<Project>
  archive(id: string): Promise<Project>
  delete(id: string): Promise<void>
}

export interface TaskRepository {
  getAll(): Promise<Task[]>
  getById(id: string): Promise<Task | undefined>
  create(input: CreateTaskInput): Promise<Task>
  update(
    id: string,
    patch: Partial<Omit<Task, 'id' | 'createdAt'>>,
  ): Promise<Task>
  complete(id: string): Promise<Task>
  delete(id: string): Promise<void>
}
