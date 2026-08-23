# Error Log

## Purpose

Record significant errors, bugs, failed approaches and architectural
mistakes so that they are not repeatedly rediscovered.

This document is part of the development memory of the project.

OpenCode should consult this document before attempting to solve recurring
or unusual problems.

---

## Rules

When recording an error:

1. Give it a unique ID.
2. Record the date.
3. Describe the symptom.
4. Explain the cause if known.
5. Record the solution/workaround.
6. Record what should be avoided in the future.
7. Keep entries concise.
8. Do not record trivial transient errors unless they reveal an important lesson.

---

## Entry Format

```text
## ERR-001 — Short description

Date:
Status: Open / Resolved / Workaround

### Symptom

What happened?

### Cause

Why did it happen?

### Solution

What fixed it?

### Prevention

What should be done differently in the future?

### Related Files

Relevant files, components or documentation.
```

---

## Errors

<!-- New entries go below this line. -->

### ERR-001 — Example Entry

Date: YYYY-MM-DD
Status: Example / Remove

#### Symptom

Example error description.

#### Cause

Example cause.

#### Solution

Example solution.

#### Prevention

Example prevention.

#### Related Files

Example files.

---

### ERR-002 — Constructor parameter properties rejected by tsconfig

Date: 2026-08-23
Status: Resolved

#### Symptom

`tsc -b` failed with TS1294 in classes written as
`constructor(private readonly db: PlanmanDatabase)`.

#### Cause

The Vite react-ts template enables `erasableSyntaxOnly`, which forbids
TypeScript-only syntax that requires transform output, including constructor
parameter properties.

#### Solution

Declare the field explicitly and assign it inside the constructor body.

#### Prevention

Avoid parameter properties, enums, namespaces and other non-erasable
syntax in this repository.

#### Related Files

src/repositories/project-repository.ts,
src/repositories/task-repository.ts, tsconfig.app.json

---

## Important Lessons

This section may contain short, general lessons extracted from individual errors.

Keep detailed incident information in the individual error entries.

<!-- Add lessons here as the project evolves. -->
