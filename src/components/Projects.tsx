import { useEffect, useState } from 'react'
import { DexieProjectRepository } from '../repositories/project-repository'
import { db } from '../db/database'
import type { Project } from '../types/domain'

const repo = new DexieProjectRepository(db)

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    repo.getAll()
      .then(setProjects)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!newProjectName.trim()) return
    try {
      await repo.create({ name: newProjectName })
      setNewProjectName('')
      const all = await repo.getAll()
      setProjects(all)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    }
  }

  if (loading) return <p className="caption">Loading...</p>
  if (error) return <p className="caption">{error}</p>

  return (
    <section>
      <h2 className="h2">Projects</h2>
      <div className="card">
        {projects.map((project) => (
          <div key={project.id} className="list-item">
            <span>{project.name}</span>
            <span className="caption">{project.status}</span>
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
          placeholder="New project..."
        />
        <button onClick={handleAdd} disabled={!newProjectName.trim()}>
          Add
        </button>
      </div>
    </section>
  )
}