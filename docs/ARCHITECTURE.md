## Architecture Decisions

**Stack**: React 19 + TypeScript 6 + Vite 8

**State Management**: React hooks + useRef for repository instances

**Data Persistence**: Dexie IndexedDB (single database, projects + tasks tables)

**Routing/Navigation**: Client-side nav selection, conditional section rendering

**Responsive Breakpoint**: 768px (desktop sidebar vs mobile bottom tab bar)

**CSS Architecture**: CSS custom properties (variables) for theming (light/dark), utility classes in `:root`

**Test Strategy**: Vitest + Testing Library + jsdom; 19 tests (10 unit + 9 integration, with 3 pre-existing IndexedDB environment errors)

**Linting**: oxlint configured; minor useEffect deps warnings accepted

**Key Design Decisions**:
- Local-first / offline-first: All data in IndexedDB, no cloud backend
- One codebase for desktop + mobile (responsive CSS, shared components)
- Repository pattern over direct IndexedDB calls in components
- Dexie for minimal IndexedDB abstraction
- Tailwind-free CSS with custom properties for theming

**Component Patterns**:
- Sections (Tasks, Notes) share `DexieTaskRepository` instance
- Each section has add form + list pattern
- Nav items drive conditional rendering in App
- Bottom nav on mobile, sidebar on desktop (>768px)