import { useEffect, useState } from 'react'
import { DexieProjectRepository } from '../repositories/project-repository'
import { db } from '../db/database'
import { Button } from './ui/Button'
import { TextField } from './ui/TextField'
import { EmptyState } from './ui/EmptyState'
import { IconButton } from './ui/IconButton'
import { Plus, Archive, Trash } from '@phosphor-icons/react'
import type { Project } from '../types/domain'

const repo = new DexieProjectRepository(db)

const PROJECT_COLORS = ['blue', 'green', 'orange', 'purple', 'red', 'yellow', 'pink', 'teal']

function colorForProject(id: string): string {
  let hash = 0
  for (const ch of id) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0
  return PROJECT_COLORS[Math.abs(hash) % PROJECT_COLORS.length]!
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = () => repo.getAll().then(setProjects)

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!newName.trim()) return
    await repo.create({ name: newName })
    setNewName('')
    await reload()
  }

  const handleArchive = async (id: string) => { await repo.archive(id); await reload() }
  const handleDelete = async (id: string) => { await repo.delete(id); await reload() }
  const startEdit = (p: Project) => { setEditingId(p.id); setEditName(p.name) }
  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    await repo.update(id, { name: editName })
    setEditingId(null)
    await reload()
  }

  if (loading) {
    return (
      <section>
        <div className="h2" style={{ marginBottom: 'var(--space-lg)' }}>Projects</div>
        {[1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 44, marginBottom: 'var(--space-sm)' }} />
        ))}
      </section>
    )
  }

  return (
    <section>
      <div className="h2" style={{ marginBottom: 'var(--space-lg)' }}>Projects</div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to organize related tasks."
          action={
            <Button variant="primary" size="sm" onClick={() => setNewName('')}>
              New project
            </Button>
          }
        />
      ) : (
        <div className="card" style={{ padding: 'var(--space-sm)' }}>
          {projects.map((project) => (
            <div key={project.id} className="list-item">
              <div className={`color-dot project-color--${colorForProject(project.id)}`} />
              {editingId === project.id ? (
                <TextField
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => saveEdit(project.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(project.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className="flex-1"
                  onDoubleClick={() => startEdit(project)}
                  style={{ fontSize: 'var(--font-size-sm)', cursor: 'default' }}
                >
                  {project.name}
                </span>
              )}
              <span className="caption">{project.status}</span>
              <IconButton label="Archive project" onClick={() => handleArchive(project.id)}>
                <Archive size={16} />
              </IconButton>
              <IconButton label="Delete project" onClick={() => handleDelete(project.id)}>
                <Trash size={16} />
              </IconButton>
            </div>
          ))}
        </div>
      )}

      <div className="inline-add" style={{ marginTop: 'var(--space-md)' }}>
        <TextField
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
          placeholder="New project..."
        />
        <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newName.trim()}>
          <Plus size={16} /> Add
        </Button>
      </div>
    </section>
  )
}
