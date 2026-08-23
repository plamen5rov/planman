import { useEffect, useState } from 'react'
import { DexieProjectRepository } from '../repositories/project-repository'
import { db } from '../db/database'
import type { Project } from '../types/domain'

const repo = new DexieProjectRepository(db)

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = () => repo.getAll().then(setProjects)

  useEffect(() => {
    reload()
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!newProjectName.trim()) return
    try {
      await repo.create({ name: newProjectName })
      setNewProjectName('')
      await reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await repo.archive(id)
      await reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to archive')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await repo.delete(id)
      await reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  const startEdit = (project: Project) => {
    setEditingId(project.id)
    setEditName(project.name)
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    try {
      await repo.update(id, { name: editName })
      setEditingId(null)
      await reload()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to rename')
    }
  }

  const cancelEdit = () => setEditingId(null)

  if (loading) return <p className="caption">Loading...</p>
  if (error) return <p className="caption">{error}</p>

  return (
    <section>
      <h2 className="h2">Projects</h2>
      <div className="card">
        {projects.map((project) => (
          <div key={project.id} className="list-item">
            {editingId === project.id ? (
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={() => saveEdit(project.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEdit(project.id)
                  if (e.key === 'Escape') cancelEdit()
                }}
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => startEdit(project)}>{project.name}</span>
            )}
            <span className="caption">{project.status}</span>
            <button
              type="button"
              onClick={() => handleArchive(project.id)}
              aria-label="Archive project"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => handleDelete(project.id)}
              aria-label="Delete project"
            >
              ×
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="caption">No projects yet.</p>
        )}
      </div>
      <div className="mt-md">
        <input
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
          placeholder="New project..."
        />
        <button onClick={handleAdd} disabled={!newProjectName.trim()}>
          Add
        </button>
      </div>
    </section>
  )
}