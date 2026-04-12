---
title: 'Dialogs User Management'
---

# Dashboard Dialogs — User Management

---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| split | **Sibling** | Same source: `dash/index.htmlm` | [Dialogs Planning](../../planning/dashboard/dialogs-planning.md) | Shared source for dashboard dialogs |
| split | **Sibling** | Same source: `dash/index.htmlm` | [Dialogs Treatment](../../treatment/dashboard/dialogs-treatment.md) | Shared source for dashboard dialogs |
| split | **Sibling** | Same source: `dash/index.htmlm` | [Dialogs System](../../system/dashboard/dialogs-system.md) | Shared source for dashboard dialogs |

### Service Calls

| Type | Direction | Service | Method | Parameters | Dialog | Context |
|------|-----------|---------|--------|------------|--------|---------|
| service | **Outgoing** | `InfoService` | `getNumbers` | `[dateValue]` | `#userStatsDetails` | Fetch employee availability counts |

### Event Flows

| Type | Direction | Event | Linked Document | Condition |
|------|-----------|-------|-----------------|----------|
| event | **Outgoing** | `#employeeDateInput` change | [Dialogs Planning](../planning/dashboard/dialogs-planning.md) | Triggers `InfoService.getNumbers(dateValue)` |

> **Include context:** This file and [Dialogs Planning](../planning/dashboard/dialogs-planning.md), [Dialogs Treatment](../treatment/dashboard/dialogs-treatment.md), and [Dialogs System](../system/dashboard/dialogs-system.md) are siblings split from the same `dash/index.htmlm` source (lines 624-896). Each file documents a distinct set of dialogs from that shared source.

---

## 1. userStatsDetails (`#userStatsDetails`)

**Employee stats dialog** - Displays staff availability/booking counts per department for a selected date.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-user-tie` |
| `data-color` | `bg-color-staff` |
| `title` | `{{i18n.employee.dialogtitle}}` |
| `data-target` | _(none - default)_ |
| `data-width` | _(none - default)_ |
| `data-crudbuttons` | _(none - default true)_ |

### Form Elements

| Name | Type | Classes | Required | Read-only | Notes |
|------|------|---------|----------|-----------|-------|
| `data.ts` | `input` | `date form-control` | No | No | Date picker; `id="employeeDateInput"` |

### Collections / Repeaters

| Container | `data-field` | Class | Template Fields |
|-----------|-------------|-------|-----------------|
| `<tbody>` | `data.count` | `collection` | `count.department.description`, `count.available`, `count.booked` |

**Table headers** (icon-based):
- Column 1: _(empty - department name)_
- Column 2: `far fa-calendar` (title="Verfugbar" = Available)
- Column 3: `far fa-briefcase` (title="Gebucht" = Booked)
- Column 4: `far fa-island-tropical` (title="Urlaub" = Holiday) -- note: no matching data field rendered in `<tbody>` row

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `#employeeDateDialogDate` change | Opens dialog with empty `ts`, copies date value to `#employeeDateInput` |
| `#employeeDateInput` change | Calls `InfoService.getNumbers(dateValue)`, fills `#userStatsDetails` with response |
| `Dialog.init` | Initialized with empty options `{}` |

### Permissions

None (visible to all dashboard users).

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `employee.dialogtitle` | Experten | Experts | Dialog title |
| _(hardcoded)_ | Verfugbar | Available | Table header icon title (HARDCODED in `title` attr) |
| _(hardcoded)_ | Gebucht | Booked | Table header icon title (HARDCODED in `title` attr) |
| _(hardcoded)_ | Urlaub | Holiday | Table header icon title (HARDCODED in `title` attr) |

---

## Summary: User Management Dialog Patterns

### Service Calls

| Dialog | Service | Method | Parameters |
|--------|---------|--------|------------|
| `#userStatsDetails` | `InfoService` | `getNumbers` | `[dateValue]` |
