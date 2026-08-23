import type {
  CreateProjectInput,
  CreateSubtaskInput,
  CreateTagInput,
  CreateTaskInput,
} from '../domain/entities'
import type { Project, Subtask, Tag, Task } from '../types/domain'

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

export interface TagRepository {
  getAll(): Promise<Tag[]>
  getById(id: string): Promise<Tag | undefined>
  create(input: CreateTagInput): Promise<Tag>
  update(
    id: string,
    patch: Partial<Omit<Tag, 'id' | 'createdAt'>>,
  ): Promise<Tag>
  delete(id: string): Promise<void>
}

export interface SubtaskRepository {
  getByTaskId(taskId: string): Promise<Subtask[]>
  create(input: CreateSubtaskInput): Promise<Subtask>
  update(
    id: string,
    patch: Partial<Omit<Subtask, 'id' | 'createdAt'>>,
  ): Promise<Subtask>
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
