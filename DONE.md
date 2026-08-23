# Changelog

Last updated: 2026-08-23

- [2026-08-23] Harden .gitignore (env/secret files, OS files) and add a
  standing rule to AGENTS.md: review/update .gitignore before every git
  add/push (files modified: .gitignore, AGENTS.md, DONE.md)

- [2026-08-23] Phase 0 app skeleton: Vite 8 + React 19 + TypeScript 6,
  oxlint, Vitest/jsdom/Testing Library smoke test, minimal app shell,
  verified lint/typecheck/test/build and dev server; markdownlint now
  ignores node_modules/dist/coverage (files modified: package.json,
  package-lock.json, vite.config.ts, tsconfig*.json, .oxlintrc.json,
  .gitignore, .markdownlint-cli2.jsonc, index.html, src/,
  public/favicon.svg, docs/TASKS.md, docs/ROADMAP.md, AGENTS.md, DONE.md)

- [2026-08-23] Fix all 154 markdownlint errors: single H1 per file, heading
  hierarchy, 80-char prose wrapping, emphasis-as-heading; add markdownlint
  config (files modified: AGENTS.md, docs/ARCHITECTURE.md, docs/Desktop.md,
  docs/ERRORLOG.md, docs/Mobile.md, docs/ROADMAP.md,
  docs/SYNCHRONIZATION.md, docs/TASKS.md, .markdownlint-cli2.jsonc)
- [2026-08-23] Rewrite AGENTS.md from 454 to 71 lines as a compact briefing
  pointing to /docs for details (files modified: AGENTS.md)
