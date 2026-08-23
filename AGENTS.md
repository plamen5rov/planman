# AGENTS.md — Personal Project Manager PWA

## 1. Project Overview

This repository contains a personal Project Manager application designed
for daily use on:

* Linux desktop
* iPhone

The application is a Progressive Web App (PWA).

There must be:

* One codebase
* One Git repository
* One application
* One deployment

Desktop and mobile are different presentations of the same application, not
separate applications.

The primary goal is a fast, simple and reliable personal productivity tool.

It is NOT intended to become a Jira/Trello replacement or multi-user
enterprise system.

---

### 2. Core Principles

* Keep the application simple and personal.
* Prefer useful functionality over feature quantity.
* Avoid premature architecture.
* Prefer local-first/offline-first design.
* Never make user data difficult to export or recover.
* Desktop and mobile share the same core application and data model.
* Platform-specific behavior belongs in platform-specific UI/components/styles.
* Keep dependencies to a minimum.
* Favor maintainable solutions over clever ones.
* Do not introduce a backend unless a real requirement exists.
* Do not create separate desktop/mobile codebases.

---

### 3. Initial Technology

Preferred stack:

* TypeScript
* React
* Vite
* PWA support
* IndexedDB
* Dexie or equivalent lightweight IndexedDB abstraction

Do NOT introduce:

* Supabase
* Firebase
* Authentication
* Remote database
* Cloud backend

during the initial implementation unless explicitly requested or a
demonstrated requirement exists.

SQLite/WASM may be evaluated later if a real requirement justifies it.

---

### 4. Application Architecture

Maintain separation between:

1. UI/presentation
2. Application/business logic
3. Data access/repositories
4. PWA/offline infrastructure
5. Synchronization

React components should not contain database implementation details.

Persistent data should be accessed through a repository/data-access layer.

See:

* [ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

### 5. Local-First Requirement

The application must remain useful without Internet connectivity.

Users should be able to:

* Open the application
* View projects and tasks
* Create and edit tasks
* Complete tasks
* Add notes
* Modify project information

while offline.

Synchronization must never be required for basic application functionality.

See:

* [SYNCHRONIZATION.md](docs/SYNCHRONIZATION.md)

---

### 6. Main Domain Concepts

The initial domain model revolves around:

* Projects
* Tasks
* Subtasks
* Tags
* Notes
* Due dates
* Priorities
* Statuses
* Time entries
* Application settings

Do not implement every concept immediately.

Follow the current roadmap phase.

---

### 7. PWA Architecture

The application is one web application that can run:

* In a desktop browser
* As an installed desktop PWA
* In mobile Safari
* As an installed iPhone Home Screen PWA

PWA functionality may include:

* Web App Manifest
* Application icons
* Standalone display
* Service worker
* Offline application shell
* Appropriate caching
* Installability
* Platform-specific capabilities where useful

PWA implementation must not create a second codebase.

---

### 8. Desktop

Desktop-specific requirements are documented in:

* [Desktop.md](docs/Desktop.md)

Desktop should emphasize:

* Keyboard interaction
* Mouse interaction
* Information density
* Large-screen layouts
* Command palette
* Efficient task management

---

### 9. Mobile

Mobile-specific requirements are documented in:

* [Mobile.md](docs/Mobile.md)

The primary real-device mobile test target is:

**iPhone 15 Pro Max.**

Mobile must be treated as a first-class platform.

Do not simply shrink the desktop UI.

---

### 10. Mobile Development and Testing

Mobile testing is part of normal development.

Use three levels of mobile testing:

#### Level 1 — Browser emulation

Use Chromium/Chrome device emulation on Linux for rapid UI iteration.

This is useful for:

* Responsive layouts
* Breakpoints
* Basic mobile navigation
* Component sizing

It is NOT a replacement for real-device testing.

#### Level 2 — Real iPhone development testing

Expose the Vite development server on the local network.

Typical command:

```bash
npm run dev -- --host 0.0.0.0
```

Open the resulting LAN URL from Safari on the iPhone.

The Linux computer and iPhone must normally be connected to the same local network.

This is the primary rapid real-device testing workflow.

#### Level 3 — HTTPS installed PWA testing

Use an HTTPS deployment/preview to test:

* PWA installation
* Home Screen behavior
* Service worker
* Offline application loading
* PWA caching
* PWA-specific behavior

Do not consider PWA functionality complete based solely on desktop browser testing.

---

### 11. Mobile Testing Rule

Whenever a change affects:

* Layout
* Navigation
* Forms
* Touch interaction
* Responsive CSS
* PWA behavior
* Offline behavior
* Storage
* Mobile-specific components

the developer should consider testing it on the real iPhone.

When real-device testing is unavailable, clearly distinguish:

* Tested on desktop/emulation
* Tested on real iPhone
* Not yet tested

Do not claim real-device compatibility without testing it.

---

### 12. UX Direction

Optimize for very fast interaction.

Important principles:

* Minimal clicks/taps
* Clear visual hierarchy
* Excellent search
* Quick task creation
* Keyboard-friendly desktop operation
* Touch-friendly mobile operation
* Responsive layouts
* No unnecessary dialogs
* No horizontal scrolling on mobile
* Destructive operations require confirmation

The "Today" view should eventually become the primary daily workspace.

---

### 13. Data Safety

User data is important.

Provide a path toward:

* Export
* Import
* Backup
* Restore

Do not introduce irreversible database migrations without considering existing data.

See:

* [SYNCHRONIZATION.md](docs/SYNCHRONIZATION.md)

---

### 14. Synchronization

Desktop and mobile will eventually contain separate local copies of the user's data.

Synchronization must be designed explicitly.

Do not introduce a cloud backend merely to provide synchronization.

Manual export/import is the initial data-transfer mechanism.

See:

* [SYNCHRONIZATION.md](docs/SYNCHRONIZATION.md)

---

### 15. Development Workflow

Before implementing a substantial feature:

1. Check the current roadmap.
2. Check TASKS.md.
3. Check relevant platform documentation.
4. Check ERRORLOG.md for previous problems.
5. Understand the existing architecture.
6. Implement the smallest useful version.
7. Test it.
8. Update documentation where necessary.

See:

* [ROADMAP.md](docs/ROADMAP.md)
* [TASKS.md](docs/TASKS.md)
* [ERRORLOG.md](docs/ERRORLOG.md)

---

### 16. Error Tracking

Record significant bugs, failed approaches, architectural mistakes and
solutions in:

* [ERRORLOG.md](docs/ERRORLOG.md)

Before attempting to solve a recurring or unusual problem, check ERRORLOG.md.

---

### 17. Documentation Hierarchy

The following files are authoritative for their areas:

* [ROADMAP.md](docs/ROADMAP.md) — project phases
* [Desktop.md](docs/Desktop.md) — desktop UX/testing
* [Mobile.md](docs/Mobile.md) — mobile UX/testing
* [ERRORLOG.md](docs/ERRORLOG.md) — known problems
* [TASKS.md](docs/TASKS.md) — current work
* [SYNCHRONIZATION.md](docs/SYNCHRONIZATION.md) — sync and data transfer
* [ARCHITECTURE.md](docs/ARCHITECTURE.md) — technical architecture

Do not duplicate detailed specifications unnecessarily.

---

### 18. Scope Control

Initially out of scope:

* Team collaboration
* Multi-user accounts
* Roles/permissions
* Billing
* Enterprise functionality
* Chat
* Complex Gantt functionality
* Microservices
* AI agents as a core dependency
* Separate native desktop application
* Separate native iOS application

Advanced functionality may be introduced later if justified.

---

### 19. AI-Assisted Development

This project is intentionally developed using AI-assisted/vibe coding.

Therefore:

* Make architecture explicit.
* Keep components reasonably small.
* Keep business logic separate from UI.
* Avoid unnecessary abstraction.
* Do not silently introduce major dependencies.
* Do not rewrite working architecture unnecessarily.
* Inspect existing code before modifying it.
* Check documentation before making architectural decisions.
* Update documentation when decisions change.

---

### 20. Definition of Done

A feature is not complete merely because it works on Linux.

Where applicable, verify:

* Desktop browser
* Installed desktop PWA
* Mobile browser
* Installed iPhone PWA
* Responsive layout
* Offline behavior
* Data persistence
* Error handling
* Existing data compatibility
* Relevant tests

For mobile-sensitive changes, real iPhone testing is preferred.

---

### 21. Current Project Documentation

Start with:

1. [ROADMAP.md](docs/ROADMAP.md)
2. [TASKS.md](docs/TASKS.md)
3. [ERRORLOG.md](docs/ERRORLOG.md)

Then consult the relevant architecture/platform document.

---

### 22. Important Rule

When requirements conflict, prioritize:

1. User data safety
2. Correctness
3. Simplicity
4. Offline usability
5. Real-world desktop/mobile usability
6. Performance
7. Additional features
