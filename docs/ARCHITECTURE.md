# Architecture

## Purpose

This document describes the technical architecture of the Personal Project
Manager PWA.

---

## 1. Core Principle

There is ONE application.

```text
                ONE CODEBASE
                     │
          ┌──────────┴──────────┐
          │                     │
       Desktop                Mobile
          │                     │
        PWA                    PWA
```

There must not be separate desktop and mobile applications.

---

## 2. High-Level Architecture

Initial architecture:

```text
┌─────────────────────────────┐
│          React UI           │
├─────────────────────────────┤
│ Application / Business Logic│
├─────────────────────────────┤
│ Repository / Data Layer     │
├─────────────────────────────┤
│ Dexie                       │
├─────────────────────────────┤
│ IndexedDB                   │
└─────────────────────────────┘
```

Future synchronization may extend this:

```text
                 Repository
                     │
              ┌──────┴──────┐
              │             │
          Local DB      Sync Layer
                            │
                            ▼
                       Remote Data
```

---

## 3. Frontend

Initial technology:

* React
* TypeScript
* Vite

React components should primarily handle:

* Presentation
* User interaction
* UI state

Business rules should remain outside presentation components where practical.

---

## 4. Data Access

Use:

```text
UI
 ↓
Application Service
 ↓
Repository
 ↓
Database
```

Avoid direct database calls from React components.

The repository layer allows the storage technology to change later.

---

## 5. Initial Database

Use:

**IndexedDB.**

Recommended abstraction:

**Dexie.**

Reasons:

* Browser-native
* Persistent
* Structured
* Suitable for offline use
* Works on desktop browsers
* Works on iPhone browsers
* Does not require a server

Do not introduce Supabase or another hosted database initially.

SQLite/WASM is a possible future option but is not currently required.

---

## 6. PWA Architecture

Conceptually:

```text
Web Application
+
Web App Manifest
+
Service Worker
+
Local Storage
```

The application must distinguish between:

### Application caching

Makes application resources available offline.

### Data persistence

Stores projects, tasks and other user data locally.

Both are required for a robust offline-first application.

---

## 7. Development Environments

### Desktop

```text
Linux
 ↓
Vite
 ↓
localhost
 ↓
Chromium/Chrome
```

### iPhone development

```text
Linux
 ↓
Vite --host 0.0.0.0
 ↓
LAN address
 ↓
iPhone Safari
```

### PWA testing

```text
Build/deploy
 ↓
HTTPS
 ↓
Safari
 ↓
Add to Home Screen
 ↓
Installed PWA
```

---

## 8. Mobile Development Does Not Require a Second Build

The same source code is used for:

```text
Linux browser
Linux installed PWA
iPhone Safari
iPhone installed PWA
```

Platform-specific behavior should be handled through:

* Responsive CSS
* Shared components
* Feature detection
* Platform-specific components where genuinely necessary

---

## 9. Repository Layer

Conceptual interfaces:

```text
ProjectRepository
- getAll()
- getById()
- create()
- update()
- archive()
- delete()

TaskRepository
- getAll()
- getById()
- create()
- update()
- complete()
- delete()
```

The exact interfaces should evolve with the domain model.

---

## 10. Domain Entities

Initial candidates:

* Project
* Task
* Subtask
* Tag
* Note
* TimeEntry
* Settings

Do not create unnecessary abstractions before the domain requires them.

---

## 11. Entity Identity

Persistent entities should use stable unique IDs.

Preferred:

```text
UUID
```

IDs must remain stable across:

* Editing
* Export
* Import
* Backup
* Future synchronization

---

## 12. Timestamps

Mutable persistent entities should generally include:

```text
createdAt
updatedAt
```

Future synchronization may add:

```text
deletedAt
revision
sync metadata
```

Do not add synchronization fields prematurely.

---

## 13. Application State

Separate:

### Persistent state

* Projects
* Tasks
* Notes
* Settings

### UI state

* Selected project
* Search query
* Current filters
* Open dialogs
* Temporary form state

Do not persist temporary UI state unless useful.

---

## 14. Offline Architecture

Offline support has two independent components:

### PWA availability

The application itself can load without a network.

### Local data

User data is available and editable without a network.

A service worker alone is not sufficient.

---

## 15. Mobile Testing Architecture

Mobile development has three levels:

```text
1. Desktop device emulation
        ↓
2. Real iPhone Safari
        ↓
3. Installed HTTPS PWA
```

Each level tests different things.

Do not skip real-device testing for mobile-sensitive functionality.

---

## 16. LAN Development

The Vite development server should be capable of being exposed to the local network.

Typical command:

```bash
npm run dev -- --host 0.0.0.0
```

The iPhone can then access the development server using the Linux machine's
LAN IP.

The exact IP must not be hard-coded into the application.

---

## 17. HTTPS

HTTPS should be used for final PWA testing.

Secure-context-dependent functionality should not be considered fully tested
using ordinary HTTP LAN development.

Development HTTP and production/preview HTTPS serve different purposes.

---

## 18. Synchronization Boundary

Synchronization belongs below the application UI.

The application should work correctly without synchronization.

Future architecture:

```text
UI
 ↓
Application Logic
 ↓
Repository
 ├── Local Storage
 └── Synchronization
```

See:

* [SYNCHRONIZATION.md](SYNCHRONIZATION.md)

---

## 19. Export/Import

Export/import should operate through the repository/data layer rather than
directly manipulating UI state.

The exported format must be versioned.

Example:

```json
{
  "formatVersion": 1,
  "exportedAt": "...",
  "projects": [],
  "tasks": [],
  "notes": []
}
```

---

## 20. Suggested Folder Structure

```text
project-root/
├── src/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── services/
│   ├── repositories/
│   ├── db/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── styles/
│
├── public/
│   └── icons/
│
├── docs/
│   ├── ROADMAP.md
│   ├── Desktop.md
│   ├── Mobile.md
│   ├── ERRORLOG.md
│   ├── TASKS.md
│   ├── SYNCHRONIZATION.md
│   └── ARCHITECTURE.md
│
├── AGENTS.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Directories should only be created when needed.

---

## 21. Testing

Test at multiple levels:

### Unit

Business logic and utilities.

### Component

Important UI behavior.

### Integration

Database/repository behavior.

### End-to-end

Critical user workflows.

Important workflows include:

* Create task
* Edit task
* Complete task
* Create project
* Persistence
* Export/import
* Offline operation
* PWA startup

---

## 22. Architecture Change Rules

Before changing foundational technology:

1. Identify the actual problem.
2. Check existing documentation.
3. Check ERRORLOG.md.
4. Consider desktop consequences.
5. Consider iPhone consequences.
6. Consider offline behavior.
7. Consider existing user data.
8. Consider export/import.
9. Document the decision.

Do not replace working technology merely because another technology is fashionable.

---

## 23. Current Architecture

Current intended architecture:

```text
React
 ↓
Application Logic
 ↓
Repository Layer
 ↓
Dexie
 ↓
IndexedDB
```

Current synchronization:

**Not implemented.**

Current data-transfer mechanism:

**Manual JSON export/import.**

Current remote backend:

**None.**

Current primary mobile test device:

**iPhone 15 Pro Max.**

---

## 24. Related Documentation

* [ROADMAP.md](ROADMAP.md)
* [Desktop.md](Desktop.md)
* [Mobile.md](Mobile.md)
* [TASKS.md](TASKS.md)
* [ERRORLOG.md](ERRORLOG.md)
* [SYNCHRONIZATION.md](SYNCHRONIZATION.md)
