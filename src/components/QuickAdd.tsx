import { useState } from 'react'
import { DexieTaskRepository } from '../repositories/task-repository'
import { db } from '../db/database'

const repo = new DexieTaskRepository(db)

interface QuickAddProps {
  open: boolean
  onClose: () => void
}

export function QuickAdd({ open, onClose }: QuickAddProps) {
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const handleClose = () => {
    setTitle('')
    onClose()
  }

  const save = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      await repo.create({ title })
      handleClose()
    } catch {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '15vh', background: 'rgba(0,0,0,0.3)',
      }}
      onClick={handleClose}
    >
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <h3 className="h3">Quick add task</h3>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save() }}
          placeholder="Task title..."
          autoFocus
          style={{ width: '100%', marginBottom: 12 }}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={handleClose}>Cancel</button>
          <button type="button" onClick={save} disabled={!title.trim() || saving}>
            {saving ? 'Saving...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}