---
title: 'Dialogs System'
---

# Dashboard Dialogs — System

---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| split | **Sibling** | Same source: `dash/index.htmlm` (lines 624-896) | [Dialogs Planning](../../planning/dashboard/dialogs-planning.md) | Planning dialogs extracted from shared source |
| split | **Sibling** | Same source: `dash/index.htmlm` (lines 624-896) | [Dialogs Treatment](../../treatment/dashboard/dialogs-treatment.md) | Treatment dialogs extracted from shared source |
| split | **Sibling** | Same source: `dash/index.htmlm` (lines 624-896) | [Dialogs User Management](../../user-management/dashboard/dialogs-user-management.md) | User management dialogs extracted from shared source |

### Service Calls

| Type | Direction | Service | Method | Parameters | Dialog | Context |
|------|-----------|---------|--------|------------|--------|---------|
| service | (outbound) | `LoginNotificationService` | `accept` | `[]` | `#loginNotificationModal` | Accept login notification |
| service | (inbound) | `InfoService` | `getDashInfo` | `[]` | Dashboard load | Check for pending login notifications |

### Event Flows

| Type | Direction | Event | Handler | Context |
|------|-----------|-------|---------|---------|
| event | (inbound) | Dashboard load | Shows modal if `loginNotifications.length > 0` | `#loginNotificationModal` |

> **Include context:** This file's source `dash/index.htmlm` (lines 624-896) is shared with [Dialogs Planning](../../planning/dashboard/dialogs-planning.md), [Dialogs Treatment](../../treatment/dashboard/dialogs-treatment.md), and [Dialogs User Management](../../user-management/dashboard/dialogs-user-management.md). Each file documents different dialog sections extracted from the same source.

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
