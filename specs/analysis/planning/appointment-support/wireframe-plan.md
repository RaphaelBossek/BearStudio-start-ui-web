# Wireframe Creation Plan — Planning Domain: Appointment Support Module

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/planning/appointment-support/`

## Prerequisites

1. Analysis document in `specs/analysis/planning/appointment-support/` is complete:
   - `01-appointment-plan.md` — Appointment plan, CDR call tracking, CDR call assignment
2. Pencil MCP server is available and responsive
3. Review completed wireframes: `specs/wireframes/planning/appointment/` for appointment patterns
4. Data dictionary: `specs/analysis/planning/data-dictionary-planning.md`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN)
- **Module overrides**: `messages.i18n.js` in `/appointmentPlan/`, `/CdrCall/`, `/CdrCallAssignment/`
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Findings from Analysis that Affect Wireframes

### Architecture Note

- **Three sub-modules**: Appointment Plan, CDR Call, CDR Call Assignment
- **Appointment Plan** — Collision detection, close month shared with Shift/Council
- **CDR Call** — Call detail records tracking with 16 columns, year/month/day toolbar
- **CDR Call Assignment** — Assignment CRUD for call tracking

### Layout complexity

- **CDR Call list** — 16-column grid with year/month/day navigation toolbar
- **7 call statuses** — Color-coded status badges
- **Close month dialog** — Shared with Shift/Council plans
- **Assignment CRUD** — Simple grid + modal detail

### State-driven dynamic UI

- **CDR call status workflow** — 7 statuses with transitions
- **Collision detection** — Plan generation checks for overlapping appointments
- **Close month** — Async summary with export prefix

### Special components requiring detailed wireframing

| Component | Location | Wireframe notes |
|:---|:---|:---|
| CDR Call grid | CDR Call list | 16-col grid, year/month/day toolbar, 7 status badges |
| CDR Call detail | CDR Call | Call detail form, status transition |
| Assignment grid | CDR Call Assignment | Simple CRUD grid |
| Assignment dialog | CDR Call Assignment | Call assignment form |
| Close month dialog | Close month | Month summary, export prefix, async polling |

### Hardcoded German strings (~30+ found)

Wireframes should use **English translations**. Mark hardcoded strings with `[HARDCODED]`.

## Shadcn UI Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| CDR Call grid | `@shadcn/table` | 16-column responsive table |
| Year/month/day toolbar | `@shadcn/button` + `@shadcn/select` | Date navigation |
| Status badge | `@shadcn/badge` | 7 statuses with colors |
| CDR Call detail | `@shadcn/dialog` (800px) | Call detail form |
| Assignment grid | `@shadcn/table` | Simple CRUD table |
| Assignment dialog | `@shadcn/dialog` (600px) | Assignment form |
| Close month dialog | `@shadcn/dialog` (600px) | Month summary, async polling |
| Export prefix | `@shadcn/input` | Filename prefix input |

## Wireframe Inventory

### Phase 1: Core wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `cdr-call-list.pen` | 01 | High | 16-col grid, year/month/day toolbar, 7 status badges |
| W2 | `cdr-call-detail.pen` | 01 | Medium | Call detail form, status transitions |
| W3 | `cdr-assignment-crud.pen` | 01 | Low | Assignment grid + modal detail |

### Phase 2: Supporting wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W4 | `close-month-dialog.pen` | 01 | Low | Month summary, export prefix, async polling |
| W5 | `cdr-status-legend.pen` | 01 | Low | 7 CDR call statuses with colors |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/planning/appointment-support/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **Design** using `batch_design()`:
   - W1: 16-column grid with responsive design considerations
   - W2: Call detail form with status workflow
   - W3: Simple CRUD pattern
   - W4: Async polling dialog
   - W5: Status legend card
5. **Validate** with `get_screenshot()`
6. **Export** to PNG: `export_nodes()` to `specs/wireframes/planning/appointment-support/`
7. **Embed screenshots** in `specs/wireframes/planning/workflows.md`
8. **Log completion** in `specs/analysis/wireframes-index.md`

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key |
| `[status: X]` | Status-driven visibility |
| `[async]` | Async operation |
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
