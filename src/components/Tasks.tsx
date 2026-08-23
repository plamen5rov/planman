import { useEffect, useMemo, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { DexieTagRepository } from '../repositories/tag-repository'
import { DexieSubtaskRepository } from '../repositories/subtask-repository'
import { DexieProjectRepository } from '../repositories/project-repository'
import { db } from '../db/database'
import { Checkbox } from './ui/Checkbox'
import { Button } from './ui/Button'
import { TextField } from './ui/TextField'
import { Select } from './ui/Select'
import { IconButton } from './ui/IconButton'
import { EmptyState } from './ui/EmptyState'
import { Plus, Trash, CaretDown, CaretRight } from '@phosphor-icons/react'
import type { Subtask, Tag, Task, TaskStatus, TaskPriority, Project } from '../types/domain'

const taskRepo = new DexieTaskRepository(db)
const tagRepo = new DexieTagRepository(db)
const subtaskRepo = new DexieSubtaskRepository(db)
const projectRepo = new DexieProjectRepository(db)

const STATUS_OPTIONS: Array<{ value: TaskStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'doing', label: 'Doing' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: Array<{ value: TaskPriority | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Med' },
  { value: 'low', label: 'Low' },
  { value: 'none', label: 'None' },
]

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2, none: 3 }
const STATUS_ORDER: Record<TaskStatus, number> = { doing: 0, todo: 1, done: 2 }

type SortKey = 'created' | 'priority' | 'status' | 'due'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'created', label: 'Created' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'due', label: 'Due date' },
]

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [subtasksByTask, setSubtasksByTask] = useState<Map<string, Subtask[]>>(new Map())
  const [newTitle, setNewTitle] = useState('')
  const [newProjectId, setNewProjectId] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editProjectId, setEditProjectId] = useState<string>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newSubTitle, setNewSubTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('created')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const [t, tg, p] = await Promise.all([taskRepo.getAll(), tagRepo.getAll(), projectRepo.getAll()])
    setTasks(t)
    setTags(tg)
    setProjects(p)
    const subMap = new Map<string, Subtask[]>()
    await Promise.all(t.map(async (task) => {
      const subs = await subtaskRepo.getByTaskId(task.id)
      subMap.set(task.id, subs)
    }))
    setSubtasksByTask(subMap)
  }

  useEffect(() => { reload().finally(() => setLoading(false)) }, [])

  const tagMap = useMemo(() => {
    const m = new Map<string, Tag>()
    for (const t of tags) m.set(t.id, t)
    return m
  }, [tags])

  const projectMap = useMemo(() => {
    const m = new Map<string, Project>()
    for (const p of projects) m.set(p.id, p)
    return m
  }, [projects])

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    const input: { title: string; projectId?: string } = { title: newTitle }
    if (newProjectId) input.projectId = newProjectId
    await taskRepo.create(input)
    setNewTitle('')
    setNewProjectId('')
    await reload()
  }

  const handleToggle = async (task: Task) => {
    if (task.status === 'done') {
      await taskRepo.update(task.id, { status: 'todo' })
    } else {
      await taskRepo.complete(task.id)
    }
    await reload()
  }

  const handleDelete = async (id: string) => { await taskRepo.delete(id); await reload() }
  const startEdit = (task: Task) => { setEditingId(task.id); setEditTitle(task.title); setEditProjectId(task.projectId ?? '') }
  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return
    const patch: { title: string; projectId?: string | undefined } = { title: editTitle }
    patch.projectId = editProjectId || undefined
    await taskRepo.update(id, patch)
    setEditingId(null)
    await reload()
  }

  const handleAssignProject = async (task: Task, projectId: string) => {
    await taskRepo.update(task.id, { projectId: projectId || undefined })
    await reload()
  }

  const handleAddSubtask = async (taskId: string) => {
    if (!newSubTitle.trim()) return
    await subtaskRepo.create({ taskId, title: newSubTitle })
    setNewSubTitle('')
    await reload()
  }

  const handleToggleSub = async (sub: Subtask) => {
    await subtaskRepo.update(sub.id, { completed: !sub.completed })
    await reload()
  }

  const handleDeleteSub = async (id: string) => { await subtaskRepo.delete(id); await reload() }

  const filtered = useMemo(() => {
    const result = tasks.filter(t => {
      const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
      const matchProject = projectFilter === 'all' || (projectFilter === 'none' ? !t.projectId : t.projectId === projectFilter)
      const matchTag = tagFilter === 'all' || t.tagIds.includes(tagFilter)
      return matchSearch && matchStatus && matchPriority && matchProject && matchTag
    })
    result.sort((a, b) => {
      switch (sortKey) {
        case 'priority': return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        case 'status': return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        case 'due': return (a.dueDate ?? 'z').localeCompare(b.dueDate ?? 'z')
        default: return b.createdAt.localeCompare(a.createdAt)
      }
    })
    return result
  }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter, tagFilter, sortKey])

  if (loading) {
    return (
      <section>
        <div className="h2" style={{ marginBottom: 'var(--space-lg)' }}>Tasks</div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 44, marginBottom: 'var(--space-sm)' }} />
        ))}
      </section>
    )
  }

  return (
    <section>
      <div className="h2" style={{ marginBottom: 'var(--space-lg)' }}>Tasks</div>

      <div className="filter-bar">
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}>
          {PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="all">All projects</option>
          <option value="none">No project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        {tags.length > 0 && (
          <Select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="all">All tags</option>
            {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ? 'No matching tasks' : 'No tasks yet'}
          description={searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ? 'Try adjusting your filters.' : 'Create your first task to get started.'}
          action={!searchQuery && statusFilter === 'all' && priorityFilter === 'all' ? (
            <Button variant="primary" size="sm" onClick={() => setNewTitle('')}>
              <Plus size={16} /> New task
            </Button>
          ) : undefined}
        />
      ) : (
        <div className="card" style={{ padding: 'var(--space-sm)' }}>
          {filtered.map((task) => {
            const subs = subtasksByTask.get(task.id) ?? []
            const isExpanded = expandedId === task.id
            const project = task.projectId ? projectMap.get(task.projectId) : null
            return (
              <div key={task.id} style={{ marginBottom: 'var(--space-xs)' }}>
                <div className="task-row">
                  <Checkbox checked={task.status === 'done'} onChange={() => handleToggle(task)} />
                  {editingId === task.id ? (
                    <div className="flex-1" style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                      <TextField
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(task.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                        style={{ flex: 1 }}
                      />
                      <Select
                        value={editProjectId}
                        onChange={(e) => setEditProjectId(e.target.value)}
                      >
                        <option value="">No project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </Select>
                    </div>
                  ) : (
                    <span
                      className="task-row__title"
                      onDoubleClick={() => startEdit(task)}
                      style={{ textDecoration: task.status === 'done' ? 'line-through' : undefined }}
                    >
                      {task.title}
                    </span>
                  )}
                  {project && editingId !== task.id && (
                    <span
                      className="caption"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }}
                    >
                      <span className={`color-dot project-color--${project.color ?? 'blue'}`} />
                      {project.name}
                    </span>
                  )}
                  {task.tagIds.length > 0 && (
                    <span className="caption">
                      {task.tagIds.map(id => tagMap.get(id)?.name).filter(Boolean).join(', ')}
                    </span>
                  )}
                  {subs.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => setExpandedId(isExpanded ? null : task.id)}
                    >
                      {isExpanded ? <CaretDown size={14} /> : <CaretRight size={14} />}
                      {subs.filter(s => s.completed).length}/{subs.length}
                    </button>
                  )}
                  <IconButton label="Toggle subtasks" onClick={() => setExpandedId(isExpanded ? null : task.id)}>
                    <Plus size={16} />
                  </IconButton>
                  <IconButton label="Delete task" onClick={() => handleDelete(task.id)}>
                    <Trash size={16} />
                  </IconButton>
                </div>
                {isExpanded && (
                  <div style={{ paddingLeft: '46px', marginBottom: 'var(--space-sm)' }}>
                    <div style={{ padding: 'var(--space-xs) var(--space-md)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                      <span className="caption">Project:</span>
                      <Select
                        value={task.projectId ?? ''}
                        onChange={(e) => handleAssignProject(task, e.target.value)}
                      >
                        <option value="">None</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </Select>
                    </div>
                    {subs.map((sub) => (
                      <div key={sub.id} className="task-row">
                        <Checkbox checked={sub.completed} onChange={() => handleToggleSub(sub)} />
                        <span className="task-row__title" style={{ textDecoration: sub.completed ? 'line-through' : undefined }}>
                          {sub.title}
                        </span>
                        <IconButton label="Delete subtask" onClick={() => handleDeleteSub(sub.id)}>
                          <Trash size={14} />
                        </IconButton>
                      </div>
                    ))}
                    <div className="inline-add" style={{ padding: 'var(--space-xs) 0' }}>
                      <TextField
                        value={newSubTitle}
                        onChange={(e) => setNewSubTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubtask(task.id) }}
                        placeholder="New subtask..."
                      />
                      <Button size="sm" onClick={() => handleAddSubtask(task.id)} disabled={!newSubTitle.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="inline-add" style={{ marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
        <TextField
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          placeholder="New task..."
        />
        <Select value={newProjectId} onChange={(e) => setNewProjectId(e.target.value)}>
          <option value="">No project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
          <Plus size={16} /> Add
        </Button>
      </div>
    </section>
  )
}
