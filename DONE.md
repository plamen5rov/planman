# Changelog

Last updated: 2026-08-23

- [2026-08-23] Visual overhaul: Things 3 × Linear design system — Geist
  variable fonts, Phosphor icons, full CSS token system (light/dark),
  UI primitives (Button, IconButton, TextField, Select, Checkbox,
  EmptyState, Modal), restyled all views (files modified:
  package.json, package-lock.json, src/styles/app.css, src/main.tsx,
  src/App.tsx, src/components/ui/*, src/components/SidebarNav.tsx,
  src/components/BottomNav.tsx, src/components/Today.tsx,
  src/components/Projects.tsx, src/components/Tasks.tsx,
  src/components/QuickAdd.tsx, src/components/CommandPalette.tsx,
  src/components/navItems.ts, src/App.test.tsx, src/test/setup.ts)
- [2026-08-23] Project tagging for tasks: project selector on create
  and edit, project filter in task list, project badge on task rows,
  project selector in QuickAdd (files modified: src/components/Tasks.tsx,
  src/components/QuickAdd.tsx)
- [2026-08-23] Harden .gitignore (env/secret files, OS files) and add a
  standing rule to AGENTS.md: review/update .gitignore before every git
  add/push (files modified: .gitignore, AGENTS.md, DONE.md)
- [2026-08-23] Phase 0 app skeleton: Vite 8 + React 19 + TypeScript 6,
  oxlint, Vitest/jsdom/Testing Library smoke test, minimal app shell,
  verified lint/typecheck/test/build and dev server (files modified:
  package.json, package-lock.json, vite.config.ts, tsconfig*.json,
  .oxlintrc.json, .gitignore, .markdownlint-cli2.jsonc, index.html, src/,
  public/favicon.svg, docs/TASKS.md, docs/ROADMAP.md, AGENTS.md)
- [2026-08-23] Fix all 154 markdownlint errors: single H1 per file,
  heading hierarchy, 80-char prose wrapping, emphasis-as-heading; add
  markdownlint config (files modified: AGENTS.md, docs/ARCHITECTURE.md,
  docs/Desktop.md, docs/ERRORLOG.md, docs/Mobile.md, docs/ROADMAP.md,
  docs/SYNCHRONIZATION.md, docs/TASKS.md, .markdownlint-cli2.jsonc)
- [2026-08-23] Rewrite AGENTS.md from 454 to 71 lines as a compact
  briefing pointing to /docs for details (files modified: AGENTS.md)
- [2026-08-23] Phase 0 completed: all 10 roadmap checkboxes done, Phase 0
  exit criteria met ("The application launches, builds cleanly, and has a
  tidy foundation"); current phase advanced to Phase 1
- [2026-08-23] Data model for Phase 1: Project/Task entity types (UUID
  identity, createdAt/updatedAt), decided status models (task:
  todo/doing/done; project: active/on-hold/completed/archived), priority
  none/low/medium/high, entity factories and status-transition helper with
  unit tests (files modified: src/types/domain.ts, src/domain/entities.ts,
  docs/TASKS.md, docs/ROADMAP.md, AGENTS.md)
- [2026-08-23] Repository/data-access layer: ProjectRepository and
  TaskRepository interfaces plus Dexie-backed implementations (Dexie schema
  v1: planman DB, projects/tasks tables), CRUD + archive/complete,
  integration tests on fake-indexeddb (files modified:
  src/repositories/types.ts, src/db/database.ts,
  src/repositories/project-repository.ts, src/repositories/task-repository.ts,
  src/repositories/repositories.test.ts, docs/ERRORLOG.md, docs/TASKS.md,
  package.json, package-lock.json)
- [2026-08-23] Responsive layout foundation: desktop sidebar nav + mobile
  bottom tab bar (5 sections), section switching with aria-current, test
  cleanup in setup file, added @testing-library/user-event; Phase 0 exit
  criteria met, phase advanced to Phase 1 (files modified: src/App.tsx,
  src/components/navItems.ts, src/components/SidebarNav.tsx,
  src/components/BottomNav.tsx, src/styles/app.css, src/test/setup.ts,
  src/App.test.tsx, package.json, package-lock.json, docs/TASKS.md,
  docs/ROADMAP.md, AGENTS.md)
