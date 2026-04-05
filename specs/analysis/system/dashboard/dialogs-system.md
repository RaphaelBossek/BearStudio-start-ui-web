---
title: 'Dialogs System'
---

# 04 - Dashboard Dialogs — System

> **Split from**: `dash/dashboard-dialogs.md`
> **Sections extracted here**: Dialog 4 (loginNotificationModal)
> **Other domains received**: Treatment (`04-dialogs-treatment.md` — Dialogs 3, 5, 7, 8), Planning (`04-dialogs-planning.md` — Dialogs 2, 6, 9, 10), User Management (`04-dialogs-user-management.md` — Dialog 1)

> Source: `dash/index.htmlm` (lines 624-896), `dash/dash.js`

---

## 4. loginNotificationModal (`#loginNotificationModal`)

**Login notification modal** - Bootstrap 5 static-backdrop modal displaying important news (markdown-rendered). User must accept or decline (logout).

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `class` | `modal fade` |
| `data-bs-backdrop` | `static` |
| Dialog size | `modal-xl` |
| `data-icon` | _(none - Bootstrap modal, not Dialog system)_ |
| `data-color` | _(none)_ |
| `data-target` | _(none - native Bootstrap modal)_ |

### Form Elements

None (content is dynamically injected markdown).

### Structure

- **Header**: `<h1 class="modal-title fs-5">` with hardcoded text "Wichtige Neuigkeiten"
- **Body**: `<p>` container - dynamically filled with `marked(notificationText)` from `data.loginNotifications[].content`
- **Footer**: Two buttons

### Buttons

| ID | Classes | Text | Action |
|----|---------|------|--------|
| `#declineLoginNotifications` | `btn btn-secondary` | `{{i18n.button.cancel}}` | Redirects to `/logout` |
| `#acceptLoginNotifications` | `btn btn-primary` | Akzeptieren | Calls `LoginNotificationService.accept()`, hides modal |

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| Dashboard load (after `InfoService.getDashInfo`) | If `data.loginNotifications.length > 0`, concatenates all `.content` with `---` separator, renders via `marked()`, shows modal |
| `#acceptLoginNotifications` click | `LoginNotificationService.accept()` then hides modal |
| `#declineLoginNotifications` click | `location.href = "/logout"` |

### Permissions

None (shown to any user with pending login notifications).

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| _(hardcoded)_ | Wichtige Neuigkeiten | Important News | HARDCODED modal title |
| `button.cancel` | Abbrechen | Cancel | Decline button text |
| _(hardcoded)_ | Akzeptieren | Accept | HARDCODED accept button text |

---

## Summary: System Dialog Patterns

### Service Calls

| Dialog | Service | Method | Parameters |
|--------|---------|--------|------------|
| `#loginNotificationModal` | `LoginNotificationService` | `accept` | `[]` |
