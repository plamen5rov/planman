# Desktop Platform Specification

## Purpose

This document defines desktop-specific UX, behavior and testing for the
Project Manager PWA.

Primary target:

**Linux desktop.**

The desktop application is the same PWA/codebase as the mobile application.

---

## 1. Desktop Goals

The desktop experience should be:

* Fast
* Information-dense without being cluttered
* Keyboard-friendly
* Mouse-friendly
* Suitable for long working sessions
* Efficient for managing many tasks

---

## 2. Desktop Development Environment

Primary development environment:

```text
Linux
+
OpenCode
+
Vite development server
+
Chromium/Chrome
```

The desktop browser is the fastest feedback environment.

---

## 3. Desktop Development Loop

```text
OpenCode
   ↓
Edit code
   ↓
Vite hot reload
   ↓
Browser
   ↓
Test
   ↓
Feedback
```

Use this for rapid development.

---

## 4. Layout

Preferred conceptual structure:

```text
┌──────────────────────────────────────────────┐
│ Header / Search / Command Palette            │
├──────────────┬───────────────────────────────┤
│              │                               │
│ Navigation   │ Main content                  │
│              │                               │
│ Today        │                               │
│ Projects     │                               │
│ Tasks        │                               │
│ Calendar     │                               │
│ Notes        │                               │
│              │                               │
└──────────────┴───────────────────────────────┘
```

The final layout may evolve.

---

## 5. Navigation

Candidate desktop navigation:

* Today
* Projects
* Tasks
* Calendar
* Notes
* Reports
* Settings

---

## 6. Keyboard Support

Keyboard interaction is a first-class desktop feature.

Candidate shortcuts:

| Shortcut       | Action          |
| -------------- | --------------- |
| `N`            | New task        |
| `P`            | New project     |
| `/`            | Search          |
| `T`            | Today           |
| `Esc`          | Close dialog    |
| `Ctrl/Cmd + K` | Command palette |

Do not interfere with normal browser shortcuts without good reason.

---

## 7. Command Palette

Potential commands:

* Create task
* Create project
* Search
* Open Today
* Open Projects
* Open Tasks
* Start timer
* Stop timer
* Export
* Import
* Toggle theme
* Settings

---

## 8. Mouse Interaction

Desktop may support:

* Click
* Drag and drop
* Context menus
* Hover states
* Resizable panels

Important functionality must remain accessible without drag-and-drop.

---

## 9. Task Lists

Desktop may show:

* Status
* Priority
* Due date
* Project
* Tags
* Estimate
* Time spent

Do not overload the interface by default.

---

## 10. Responsive Behavior

Test at:

* Narrow desktop window
* Normal desktop window
* Large monitor

Avoid unnecessary fixed minimum widths.

---

## 11. Desktop PWA Testing

Test both:

### Browser

Normal Chromium/Chrome browser.

### Installed PWA

Install the application as a desktop PWA and verify:

* Launch
* Navigation
* Window sizing
* Persistence
* Updates
* Offline behavior
* Service-worker behavior

Do not assume browser behavior and installed-PWA behavior are identical.

---

## 12. Offline Testing

Test:

```text
Online
 ↓
Load application
 ↓
Disconnect network
 ↓
Refresh
 ↓
Verify application loads
 ↓
Modify data
 ↓
Verify local persistence
```

---

## 13. Performance

The application should remain responsive with a large number of tasks.

Avoid:

* Unnecessary DOM nodes
* Excessive React re-renders
* Large synchronous computations
* Blocking the main thread

Virtualization should only be introduced when actual data volumes justify it.

---

## 14. Accessibility

Support:

* Keyboard navigation
* Visible focus
* Semantic HTML
* Screen readers where practical
* Sufficient contrast

Never communicate important information using color alone.

---

## 15. Definition of Desktop Done

Where relevant, test:

* Chromium/Chrome
* Installed desktop PWA
* Narrow window
* Normal window
* Large window
* Keyboard
* Mouse
* Offline mode
* Refresh while offline
* Existing local data
