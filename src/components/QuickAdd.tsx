import { useEffect, useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { DexieProjectRepository } from '../repositories/project-repository'
import { db } from '../db/database'
import { Modal } from './ui/Modal'
import { TextField } from './ui/TextField'
import { Button } from './ui/Button'
import { Select } from './ui/Select'
import type { Project } from '../types/domain'

const taskRepo = new DexieTaskRepository(db)
const projectRepo = new DexieProjectRepository(db)

interface QuickAddProps {
  open: boolean
  onClose: () => void
  onSaved?: () => void
}

export function QuickAdd({ open, onClose, onSaved }: QuickAddProps) {
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      projectRepo.getAll().then(setProjects)
    }
  }, [open])

  const handleClose = () => { setTitle(''); setProjectId(''); onClose() }

  const save = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      await taskRepo.create({ title, projectId: projectId || undefined })
      handleClose()
      onSaved?.()
    } catch {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <h3 className="h3" style={{ marginBottom: 'var(--space-lg)' }}>Quick add task</h3>
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save() }}
        placeholder="Task title..."
        autoFocus
      />
      {projects.length > 0 && (
        <div style={{ marginTop: 'var(--space-md)' }}>
          <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">No project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </div>
      )}
      <div className="flex gap-sm" style={{ marginTop: 'var(--space-lg)', justifyContent: 'flex-end' }}>
        <Button size="sm" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={save} disabled={!title.trim() || saving}>
          {saving ? 'Saving...' : 'Add'}
        </Button>
      </div>
    </Modal>
  )
}
