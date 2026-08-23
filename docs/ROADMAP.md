# Project Roadmap

## Purpose

This document defines the development phases of the Personal Project Manager PWA.

The roadmap is intentionally incremental.

Do not implement future-phase functionality merely because it appears here.

---

## Phase 0 — Project Foundation

### Goal

Establish a clean development environment.

#### Tasks

* [x] Initialize Git repository
* [x] Initialize TypeScript + React + Vite
* [x] Establish project structure
* [x] Create AGENTS.md
* [x] Create `/docs`
* [x] Establish coding conventions
* [x] Establish testing
* [x] Establish development/build commands
* [x] Create initial application shell
* [x] Create responsive layout foundation

#### Exit criteria

The application starts, builds successfully and has a clean foundation.

---

## Phase 1 — Core Project Management

### Goal

Create a useful local personal task/project manager.

#### Projects

* [x] Create
* [x] Edit
* [x] Archive
* [x] Delete
* [ ] Description
* [x] Status
* [ ] Color/icon

#### Tasks

* [x] Create
* [x] Edit
* [x] Delete
* [x] Complete
* [x] Reopen
* [ ] Assign to project
* [ ] Description
* [x] Status
* [ ] Priority
* [ ] Due date
* [ ] Ordering

#### Persistence

* [ ] IndexedDB
* [ ] Dexie/repository layer
* [ ] Application settings

#### Exit criteria

The application works as a basic personal task manager without a network connection.

---

## Phase 2 — Daily Productivity

### Goal

Make the application useful every day.

* [x] Today view
* [x] Overdue tasks
* [x] Today's tasks
* [x] Upcoming tasks
* [x] Search
* [x] Filtering
* [ ] Sorting
* [ ] Tags
* [ ] Subtasks
* [ ] Quick task creation
* [ ] Keyboard shortcuts
* [ ] Command palette

#### Exit criteria

Daily task management feels fast and practical.

---

## Phase 3 — Responsive Desktop/Mobile UX

### Goal

Create polished experiences for both target platforms.

#### Desktop

See [Desktop.md](Desktop.md).

* [ ] Desktop navigation
* [ ] Keyboard interaction
* [ ] Command palette
* [ ] Mouse interaction
* [ ] Desktop layouts
* [ ] Desktop PWA testing

#### Mobile

See [Mobile.md](Mobile.md).

* [ ] Mobile navigation
* [ ] Touch controls
* [ ] Mobile task creation
* [ ] iPhone-safe layouts
* [ ] Real iPhone testing

#### Exit criteria

Core functionality works comfortably on both Linux desktop and iPhone.

---

## Phase 4 — PWA

### Goal

Turn the web application into a proper installable PWA.

* [ ] Manifest
* [ ] Icons
* [ ] Standalone display
* [ ] Service worker
* [ ] Offline application shell
* [ ] Cache/update strategy
* [ ] Linux PWA installation testing
* [ ] iPhone Home Screen installation testing
* [ ] Offline PWA testing
* [ ] Reinstallation/update testing

#### Testing

Use:

1. Desktop browser
2. Chrome/Chromium mobile emulation
3. Real iPhone Safari
4. Installed iPhone PWA
5. HTTPS preview/deployment

#### Exit criteria

The application works as an installed PWA on the primary target platforms.

---

## Phase 5 — Data Safety

### Goal

Make user data portable and recoverable.

* [ ] Export
* [ ] Import
* [ ] Backup
* [ ] Restore
* [ ] Format versioning
* [ ] Import validation
* [ ] Backup integrity checks
* [ ] Safe migrations

#### Exit criteria

The complete dataset can be exported, backed up and restored.

---

## Phase 6 — Notes and Knowledge

* [ ] Project notes
* [ ] Standalone notes
* [ ] Markdown
* [ ] Note search
* [ ] Links between notes/tasks/projects
* [ ] Attachments

---

## Phase 7 — Time Management

* [ ] Time estimates
* [ ] Timer
* [ ] Manual time entries
* [ ] Daily statistics
* [ ] Weekly statistics
* [ ] Project statistics
* [ ] Reports

---

## Phase 8 — Synchronization

See [SYNCHRONIZATION.md](SYNCHRONIZATION.md).

* [ ] Define sync data model
* [ ] Define conflict strategy
* [ ] Define sync protocol
* [ ] Evaluate file-based synchronization
* [ ] Evaluate lightweight remote synchronization
* [ ] Implement selected solution
* [ ] Test offline changes
* [ ] Test conflicts
* [ ] Test recovery

Do not introduce a cloud backend until requirements justify it.

---

## Phase 9 — Advanced Productivity

Potential features:

* [ ] Recurring tasks
* [ ] Calendar integration
* [ ] Project templates
* [ ] Task dependencies
* [ ] Custom views
* [ ] Advanced statistics
* [ ] Bulk operations
* [ ] External imports

These are not committed features.

---

## Phase 10 — Optional AI

AI remains optional.

Potential features:

* [ ] Task decomposition
* [ ] Project summaries
* [ ] Weekly planning
* [ ] Task prioritization
* [ ] Natural-language task creation
* [ ] Project health summaries

AI must never become a core dependency.

---

## Explicitly Out of Scope

Unless requirements change:

* Team collaboration
* Multi-user accounts
* Enterprise permissions
* Billing
* SaaS architecture
* Chat
* Microservices
* Complex Gantt functionality
* Separate native desktop application
* Separate native iOS application

---

## Roadmap Rules

1. Work primarily on the current phase.
2. Do not implement future features speculatively.
3. Test completed functionality.
4. Update TASKS.md.
5. Record significant failures in ERRORLOG.md.
6. Update architecture documentation when foundational decisions change.
7. Keep the application usable after every major phase.
