---
title: 'Wireframe Plan'
---

# Wireframe Creation Plan — Planning Domain: Dashboard Module

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/planning/dashboard/`

## Prerequisites

1. All analysis documents in `specs/analysis/planning/dashboard/` are complete and reviewed:
   - `02-dashboard-selfservice.md` — Standard dashboard with self-service scheduling
   - `04-dialogs-planning.md` — Planning dialogs overview
   - `08-shift-dialog.md` — Shift detail and request dialogs
   - `09-calendar-view.md` — Calendar view with action/shift handling
   - `10-week-view.md` — Expert week availability grid
   - `11-month-view.md` — Expert month availability grid
2. Pencil MCP server is available and responsive
3. Review the Pencil style guide for web-app design: `get_guidelines(topic="web-app")`
4. Reference completed wireframes: `specs/wireframes/appointments/` for MonthTable patterns

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN)
- **Module overrides**: `messages.i18n.js` in `/dash/` directory
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Findings from Analysis that Affect Wireframes

### Layout complexity

- **Dashboard has two variants**: Standard (self-service) and Admin (management panels). Need separate wireframes.
- **Calendar view** uses FullCalendar library with custom action/shift click handlers (some commented out).
- **Week/Month views** embed expert availability grids from `/profile/expertDays.js` and `expertWeek.js`.
- **Multiple dialogs**: Shift detail, shift request, ad-hoc appointment, end shift, incarceration check/retrieval, summarize appointment, consultation wizard.

### State-driven dynamic UI

- **Self-service scheduling** has 3 states: available, queued, waiting — each with different action buttons.
- **Shift dialog** has 2 modes: detail view (existing shift) and request mode (new shift).
- **Expert availability** grids have different state cycles: month (null→true→false→null), week (null→true→null).

### Special components requiring detailed wireframing

| Component | Location | Wireframe notes |
|:---|:---|:---|
| Self-service scheduling panel | Standard dashboard | 3-state toggle, available/queued/waiting lists |
| Calendar view | Calendar page | FullCalendar grid, action/shift click handlers |
| Expert week grid | Week view | Day × expert grid, tri-state toggle |
| Expert month grid | Month view | Month × expert grid, tri-state toggle |
| Shift detail dialog | Shift dialog | Time range, comment, state badge |
| Shift request dialog | Shift dialog | Role select, time range, reason |
| Ad-hoc appointment wizard | Ad-hoc dialog | Multi-step: patient, type, datetime, confirm |
| End shift dialog | End shift | Time picker, comment, state transition |
| Incarceration dialogs | Incarceration | Check dialog + retrieval dialog with siren |
| Summarize appointment | Summarize | Appointment summary with state transition |
| Consultation wizard | Consultation | 4-step wizard with template selection |

### Hardcoded German strings (33+ found in dashboard module)

Wireframes should use **English translations** for all labels. Mark hardcoded strings with `[HARDCODED]`.

## Shadcn UI Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| Dashboard layout | `div` with CSS grid | 3-column layout: nav, main, panels |
| Self-service panel | `@shadcn/card` | Available/queued/waiting sections |
| State toggle | `@shadcn/toggle-group` | 3-state: available/queued/waiting |
| Calendar view | Custom FullCalendar wrapper | Not shadcn — external library |
| Week/Month grid | Custom grid table | Day × expert or month × expert |
| Availability toggle | `@shadcn/checkbox` or custom | Tri-state: null/true/false |
| Shift dialog | `@shadcn/dialog` (800px) | 2-column layout, time inputs |
| Shift request | `@shadcn/dialog` (600px) | Role select, time range, textarea |
| Ad-hoc wizard | `@shadcn/dialog` (800px) | 4-step wizard with progress |
| End shift dialog | `@shadcn/dialog` (600px) | Time picker, comment, state select |
| Incarceration dialog | `@shadcn/alert-dialog` | Warning text, siren animation |
| Summarize dialog | `@shadcn/dialog` (700px) | Summary table, state transition |
| Consultation wizard | `@shadcn/dialog` (900px) | 4-step with template autocomplete |
| Patient autocomplete | `@shadcn/combobox` | Book number search |
| Consultation type select | `@shadcn/select` | Standard/Expert/Onboarding/etc. |
| Datetime picker | `@shadcn/input` with picker | Start/end datetime |
| Template autocomplete | `@shadcn/combobox` | Consultation template search |

## Wireframe Inventory

### Phase 1: Dashboard layouts

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `dashboard-standard.pen` | 02 | High | Standard dashboard: self-service panel, active calls, birthdays, doctor info |
| W2 | `dashboard-admin.pen` | 02 | High | Admin dashboard: management panels, ad-hoc button, consultation template CRUD |
| W3 | `calendar-view.pen` | 09 | Medium | FullCalendar grid with action/shift click handlers |

### Phase 2: Expert availability grids

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W4 | `expert-week-grid.pen` | 10 | Medium | Week view: day × expert grid, tri-state toggle, legend |
| W5 | `expert-month-grid.pen` | 11 | Medium | Month view: month × expert grid, tri-state toggle, cycle function |

### Phase 3: Dialogs

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W6 | `shift-dialog-detail.pen` | 08 | Medium | Shift detail: time range, comment, state, edit actions |
| W7 | `shift-request.pen` | 08 | Low-Medium | Shift request: role select, time range, reason textarea |
| W8 | `adhoc-appointment-wizard.pen` | 04 | High | 4-step wizard: patient, type, datetime, confirm |
| W9 | `end-shift-dialog.pen` | 04 | Low | End shift: time picker, comment, state transition |
| W10 | `incarceration-check.pen` | 04 | Low | Incarceration check: warning text, confirm button |
| W11 | `incarceration-retrieval.pen` | 04 | Low | Incarceration retrieval: siren fields, date inputs |
| W12 | `summarize-appointment.pen` | 04 | Medium | Appointment summary: table, state transition select |
| W13 | `consultation-wizard.pen` | 04 | High | 4-step consultation: type, template, datetime, confirm |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/planning/dashboard/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **Design** using `batch_design()`:
   - Create frame with appropriate dimensions (desktop 1440px width for dashboards, dialog widths as specified)
   - Add section headings, form elements, buttons per the spec tables
   - Annotate datamodel paths, permissions, conditions
   - Mark `[HARDCODED]` strings, `[RO]` read-only fields, `*` required fields
   - Mark `[SIREN]` for siren animation fields
   - Show collection rows with `[repeats]` annotation
   - Mark state-driven visibility with `[state: X]`
5. **Validate** with `get_screenshot()`
6. **Export** to PNG: `export_nodes()` to `specs/wireframes/planning/dashboard/`
7. **Embed screenshots** in `specs/wireframes/planning/workflows.md`
8. **Log completion** in `specs/analysis/wireframes-index.md`

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key |
| `[repeats]` | Collection row template |
| `[state: X]` | Shown only in state X |
| `[cond: expr]` | Conditional visibility logic |
| `[PERM: key]` | Permission-gated element |
| `data.field.path` | Datamodel binding |
| `@shadcn/component` | Target UI component |

## Completion Tracking

| Wireframe ID | Status | Date Completed | PNG Exported |
|:---|:---|:---|:---|
| W1 | Pending | — | No |
| W2 | Pending | — | No |
| W3 | Pending | — | No |
| W4 | Pending | — | No |
| W5 | Pending | — | No |
| W6 | Pending | — | No |
| W7 | Pending | — | No |
| W8 | Pending | — | No |
| W9 | Pending | — | No |
| W10 | Pending | — | No |
| W11 | Pending | — | No |
| W12 | Pending | — | No |
| W13 | Pending | — | No |
