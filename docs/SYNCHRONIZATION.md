# Synchronization, Backup and Data Transfer

## Purpose

This document defines how the Project Manager PWA will eventually keep data
consistent between desktop and mobile installations.

Synchronization is intentionally NOT part of the initial application architecture.

The application must first work correctly as a local-first application.

---

## 1. Fundamental Architecture

There is one application/codebase but potentially multiple local databases.

Conceptually:

```text
Linux PWA
   │
   └── Local Database


iPhone PWA
   │
   └── Local Database
```

These databases are independent.

Do not assume that browser storage is automatically shared between devices.

---

## 2. Initial Storage

The initial application should use:

* IndexedDB
* Dexie or equivalent abstraction
* Repository/data-access layer

The UI must not directly depend on IndexedDB APIs.

This allows the storage implementation to evolve later.

---

## 3. Local-First Requirement

The application must continue working without Internet connectivity.

Local operations should not depend on successful synchronization.

Examples:

* Create task → save locally
* Edit task → save locally
* Complete task → save locally
* Create note → save locally

Synchronization is a separate concern.

---

## 4. Data Identity

Every persistent entity should have a stable unique identifier.

Preferred approach:

```text
UUID
```

An entity should not receive a different ID simply because it was exported,
imported or synchronized.

Candidate entities:

* Projects
* Tasks
* Subtasks
* Tags
* Notes
* Time entries
* Settings where appropriate

---

## 5. Timestamps

Persistent entities should generally contain:

* `createdAt`
* `updatedAt`

Deletion should eventually be represented in a synchronization-safe way
rather than immediately destroying all evidence that an object existed.

A future synchronization design may use:

* `deletedAt`
* revision numbers
* operation IDs
* synchronization metadata

Do not add synchronization metadata until required.

---

## 6. Export

Export must eventually provide a complete representation of user data.

Preferred initial format:

```text
JSON
```

Example conceptual structure:

```json
{
  "formatVersion": 1,
  "exportedAt": "2026-01-01T12:00:00Z",
  "projects": [],
  "tasks": [],
  "notes": [],
  "tags": [],
  "timeEntries": []
}
```

The actual schema should be defined when export is implemented.

---

## 7. Import

Import must:

1. Validate the file.
2. Validate the format version.
3. Validate entity structure.
4. Detect malformed data.
5. Warn before destructive changes.
6. Preserve existing data unless replacement is explicitly requested.
7. Report errors clearly.

Never silently discard imported data.

---

## 8. Backup

A backup is a recoverable copy of the complete application dataset.

The backup mechanism should eventually support:

* Manual backup
* Restore
* Backup validation
* Version information
* Export timestamp

Backups should not depend exclusively on synchronization.

---

## 9. Initial Transfer Strategy

Before automatic synchronization exists, manual transfer may be used.

Example:

```text
Linux
  ↓
Export JSON
  ↓
Transfer file
  ↓
iPhone
  ↓
Import JSON
```

This is intentionally simple.

It also provides an early way to move data between devices without requiring a server.

---

## 10. Future Synchronization

Potential architectures may include:

### Option A — File-based synchronization

```text
Linux ─────┐
           │
       Sync location
           │
iPhone ────┘
```

Advantages:

* Potentially simple
* No application server
* User-controlled data

Disadvantages:

* Browser filesystem restrictions
* Mobile OS limitations
* Conflict handling
* Availability of shared storage

---

### Option B — Lightweight synchronization service

```text
Linux ─────┐
           │
           ▼
      Sync service
           │
           ▼
iPhone ────┘
```

The service should be minimal.

A full SaaS backend is not automatically justified.

---

### Option C — Remote database/API

A hosted database may eventually be considered.

Possible technologies should be evaluated based on actual requirements.

Do not introduce Supabase, Firebase or another hosted platform merely
because it provides synchronization.

---

## 11. Conflict Resolution

Conflict handling must be explicitly designed.

Example:

```text
Linux:
Task title = "Write article"

iPhone offline:
Task title = "Write PWA article"
```

Both devices may later synchronize.

Possible strategies include:

* Last-write-wins
* Timestamp-based resolution
* Revision-based resolution
* Manual conflict resolution

The selected strategy must be documented before implementation.

---

## 12. Deletions

Deletion is particularly important.

A device that has not synchronized yet must be able to learn that an object
was deleted elsewhere.

Therefore, automatic synchronization may require tombstones or equivalent
deletion records.

Do not permanently delete synchronization-critical information until the
synchronization model supports it.

---

## 13. Synchronization Safety

Synchronization must never silently overwrite significant user data.

Before implementing automatic synchronization:

* Define conflict behavior
* Define deletion behavior
* Define backup behavior
* Define recovery behavior
* Test interrupted synchronization
* Test offline edits
* Test simultaneous edits
* Test duplicate records
* Test corrupted synchronization data

---

## 14. Data Migration

The exported format should contain a version number.

Example:

```text
formatVersion: 1
```

If the data model changes:

```text
v1 → v2
v2 → v3
```

migration logic should be explicit.

Never assume old exports will always match the current database schema.

---

## 15. Recovery Principle

The user must always have a way to recover from synchronization problems.

Preferred recovery sequence:

```text
Backup
  ↓
Inspect problem
  ↓
Restore known-good data
  ↓
Retry synchronization
```

Automatic synchronization must never eliminate the ability to restore a
previous state.

---

## 16. Current Status

Synchronization is currently:

**NOT IMPLEMENTED.**

Current architecture:

```text
Desktop PWA
    ↓
Local IndexedDB


Mobile PWA
    ↓
Local IndexedDB
```

Current recommended data-transfer mechanism:

```text
Manual JSON export/import
```

Future synchronization architecture will be selected only after actual
application requirements are understood.

---

## 17. Related Documentation

* [ROADMAP.md](ROADMAP.md)
* [TASKS.md](TASKS.md)
* [ERRORLOG.md](ERRORLOG.md)
* [Desktop.md](Desktop.md)
* [Mobile.md](Mobile.md)
