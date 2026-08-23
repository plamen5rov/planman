# AGENTS.md — Personal Project Manager PWA

Agent briefing for this repo. Details live in `/docs`; this file is only the
non-obvious, must-not-forget context.

## Current state

- Phase 0 — Project Foundation. No source code, build system, or tests exist
  yet.
- The repo currently contains only planning docs and
  `.markdownlint-cli2.jsonc`.
- Next task: initialize the project repository / app skeleton.

See [TASKS.md](docs/TASKS.md) and [ROADMAP.md](docs/ROADMAP.md).

## What this project is

A single, local-first personal project/task manager PWA for:

- Linux desktop
- iPhone (primary real device: iPhone 15 Pro Max)

Desktop and mobile are the same application, not separate codebases.

## Hard constraints

- Local-first / offline-first. Core features must work without a network.
- No cloud backend, auth, Supabase, or Firebase unless a real requirement
  emerges and is explicitly approved.
- One codebase, one repo, one deployment.
- React + TypeScript + Vite stack
  (see [ARCHITECTURE.md](docs/ARCHITECTURE.md)).
- Data access through a repository layer; no IndexedDB calls inside React
  components.
- Use Dexie or an equivalent lightweight IndexedDB abstraction.

## Authoritative docs

| Topic                           | File                                          |
| ------------------------------- | --------------------------------------------- |
| Phases and exit criteria        | [ROADMAP.md](docs/ROADMAP.md)                 |
| Current work / next task        | [TASKS.md](docs/TASKS.md)                     |
| Architecture & folder structure | [ARCHITECTURE.md](docs/ARCHITECTURE.md)       |
| Desktop UX / testing            | [Desktop.md](docs/Desktop.md)                 |
| Mobile UX / testing             | [Mobile.md](docs/Mobile.md)                   |
| Sync, export, import, backup    | [SYNCHRONIZATION.md](docs/SYNCHRONIZATION.md) |
| Errors & lessons learned        | [ERRORLOG.md](docs/ERRORLOG.md)               |

## Workflow reminders

1. Before a substantial change, read [TASKS.md](docs/TASKS.md),
   [ROADMAP.md](docs/ROADMAP.md), and [ERRORLOG.md](docs/ERRORLOG.md).
2. Implement the smallest useful version of the current phase.
3. Mobile-sensitive changes (layout, navigation, forms, touch, PWA, offline,
   storage) should be tested on a real iPhone when possible. When impossible,
   state clearly what was tested.
4. Update docs when decisions change. Do not duplicate detailed specs in
   AGENTS.md.
5. Record significant bugs / failed approaches in
   [ERRORLOG.md](docs/ERRORLOG.md).

## Markup hygiene

- Run `npx markdownlint-cli2 "**/*.md"` before finishing a doc change.
- Config is in `.markdownlint-cli2.jsonc`.

## When source code arrives

Once `package.json`, Vite, tests, etc. are added, update this file with exact
developer commands and verification order. Do not leave guessed commands
here.
