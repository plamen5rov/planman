# Mobile Platform Specification

## Purpose

This document defines mobile-specific UX, behavior and testing for the
Project Manager PWA.

Primary target:

**iPhone 15 Pro Max.**

The mobile application is the same PWA/codebase as the desktop application.

There must NOT be a separate iOS codebase.

---

## 1. Mobile Goals

The mobile experience should be:

* Fast
* Simple
* Touch-friendly
* Readable
* Comfortable for one-handed use
* Useful offline
* Optimized for quick task capture and review

---

## 2. Mobile Is a First-Class Platform

Mobile must not be treated as a final polishing step.

Core functionality should be designed and tested on both:

* Linux desktop
* iPhone

The UI does not need to be identical.

The underlying functionality should remain equivalent.

---

## 3. Development Testing Levels

Mobile development uses three levels of testing.

### Level 1 — Desktop Browser Emulation

Use Chrome/Chromium DevTools on Linux.

Shortcut:

```text
Ctrl + Shift + M
```

Use device emulation for rapid iteration.

Useful for:

* Responsive layout
* Breakpoints
* Component sizing
* Navigation
* Basic mobile UI

Do NOT consider emulation equivalent to a real iPhone.

---

### Level 2 — Real iPhone Development Testing

The iPhone should connect to the same local network as the Linux development machine.

Start Vite so it is accessible on the LAN:

```bash
npm run dev -- --host 0.0.0.0
```

Vite should provide a network URL similar to:

```text
http://192.168.1.xxx:5173/
```

Open that URL in iPhone Safari.

This is the preferred rapid real-device testing method.

#### Development loop

```text
OpenCode
   ↓
Edit code
   ↓
Vite updates
   ↓
Open/refresh iPhone Safari
   ↓
Test
   ↓
Give feedback
   ↓
OpenCode fixes
```

---

### Level 3 — HTTPS PWA Testing

Some PWA/browser capabilities require a secure context.

Use an HTTPS preview/deployment to test:

* PWA installation
* Home Screen behavior
* Service worker
* Offline application loading
* Cache behavior
* PWA updates
* Notifications if implemented
* Other secure-context functionality

The HTTPS version should be treated as the final PWA testing environment.

---

## 4. Safari Testing

Test the application in normal Safari before installing it.

Check:

* Navigation
* Task creation
* Forms
* Scrolling
* Search
* Keyboard behavior
* Touch interaction
* Storage
* Offline behavior

---

## 5. Installed PWA Testing

After the PWA is deployed through HTTPS:

1. Open the application in Safari.
2. Add it to the Home Screen.
3. Launch it from the Home Screen.
4. Verify standalone behavior.
5. Test navigation.
6. Test task creation/editing.
7. Test offline behavior.
8. Test updating the application.

Do not assume Safari behavior and installed-PWA behavior are identical.

---

## 6. Mobile Navigation

Candidate structure:

```text id="f5u4xk"
Today
Projects
Tasks
More
```

Calendar, Notes, Reports and Settings may be placed under More.

The final navigation should be based on actual usage.

---

## 7. Touch Targets

Interactive elements should be comfortably tappable.

Avoid:

* Tiny controls
* Crowded buttons
* Hover-only functionality
* Important actions requiring precise tapping

Do not rely on color alone.

---

## 8. Today View

Today should be the primary mobile workspace.

Prioritize:

1. Overdue tasks
2. Today's tasks
3. Important tasks
4. Upcoming tasks

Avoid overwhelming the user with information.

---

## 9. Quick Add

Task creation should require minimal interaction.

Preferred flow:

```text
Tap +
   ↓
Enter task
   ↓
Save
```

Optional fields should not obstruct basic creation.

---

## 10. Task Details

Potential fields:

* Title
* Description
* Project
* Status
* Priority
* Due date
* Tags
* Subtasks
* Notes
* Time tracking

Do not display everything simultaneously if it harms usability.

---

## 11. Gestures

Potential gestures:

* Swipe to complete
* Swipe to reveal actions
* Long press for contextual actions

Gestures must not be the only way to perform important operations.

Every important gesture-driven action must have a visible alternative.

---

## 12. Forms and Keyboard

Forms must account for the iPhone software keyboard.

Test:

* Keyboard opening
* Keyboard closing
* Focus movement
* Inputs near bottom of screen
* Long text fields
* Date inputs
* Select controls

Important controls must not become inaccessible behind the keyboard.

---

## 13. Safe Areas

The application must account for modern iPhone safe areas.

Pay particular attention to:

* Bottom navigation
* Floating action buttons
* Full-screen dialogs
* Landscape mode
* Keyboard interactions

Do not place important controls directly against screen edges.

---

## 14. Portrait and Landscape

Primary orientation:

**Portrait.**

Landscape must still remain usable.

Do not allow:

* Clipped content
* Unusable navigation
* Horizontal overflow
* Hidden controls

---

## 15. Offline Testing

Test at least:

### Scenario A

```text
Online
 ↓
Open application
 ↓
Disconnect network
 ↓
Continue using application
```

### Scenario B

```text
Offline
 ↓
Open application
 ↓
Create task
 ↓
Edit task
 ↓
Complete task
```

### Scenario C

```text
Offline
 ↓
Make changes
 ↓
Reconnect
 ↓
Verify data remains intact
```

Synchronization is handled separately.

---

## 16. Mobile Performance

Test on the actual iPhone.

Do not assume desktop performance represents mobile performance.

Watch for:

* Large JavaScript bundles
* Slow initial load
* Excessive rendering
* Large task lists
* Expensive animations
* Memory-heavy components

---

## 17. Data Persistence

Verify that data survives:

* Page refresh
* Closing Safari
* Reopening Safari
* Closing the installed PWA
* Reopening the installed PWA

Do not assume service-worker caching means application data is persistent.

---

## 18. Update Testing

When a new version is deployed:

* Open existing installed PWA
* Verify the new version becomes available
* Verify user data remains intact
* Verify no unexpected stale UI remains
* Verify service-worker update behavior

Never solve cache-update problems by deleting user data.

---

## 19. Real Device Test Record

When useful, record significant mobile testing here:

```text
Date:
Device: iPhone 15 Pro Max
iOS:
Browser/PWA:
Build/version:
Feature tested:
Result:
Notes:
```

Do not record personal/private information.

---

## 20. Definition of Mobile Done

A mobile feature is considered complete when appropriate testing has been
performed on:

* Desktop responsive emulation
* Real iPhone Safari
* Installed iPhone PWA where PWA behavior is relevant

If real-device testing has not been performed, explicitly state that it
remains pending.
