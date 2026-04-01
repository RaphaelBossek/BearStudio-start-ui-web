# Wireframe Creation Plan — Planning Domain: Shift Module

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/shifts/`

## Prerequisites

1. Analysis document in `specs/analysis/shifts/` is complete:
   - `01-shift-and-plan.md` — Shift list view and shift plan management
2. Pencil MCP server is available and responsive
3. Review completed MonthTable wireframes: `specs/wireframes/appointments/appointment-list.pen`
4. Data dictionary: `specs/analysis/planning/data-dictionary-planning.md`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN)
- **Module overrides**: `messages.i18n.js` in `/shift/` directory
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Findings from Analysis that Affect Wireframes

### Architecture Note

- **Shift is a filtered Appointment view** — shifts are appointments with `jobType=SHIFT`
- Embeds same dialogs as Appointment: `details.html`, `assignUser.html`, `docFinder.html`
- Shift Plan is a separate collection-based management system with recurring templates

### Layout complexity

- **MonthTable calendar grid** — Same pattern as Appointment list, filtered by jobType=SHIFT
- **Shift plan detail dialog** — 10-column grid with expert collection, preferred expert flags
- **Apply Plan dialog** — Async appointment generation with close month summary

### State-driven dynamic UI

- **12-state shift state machine** (subset of appointment states)
- **Price type auto-suggestion** — weekday/night/weekend matrix controls price type field
- **Expert collection** — preferred experts with priority ordering

### Special components requiring detailed wireframing

| Component | Location | Wireframe notes |
|:---|:---|:---|
| MonthTable shift grid | Shift list | Day × shift grid, state-colored cells, nested staff sub-rows |
| Shift plan detail | Plan dialog | 10-col grid: code, name, start, end, experts[], price type, active flag |
| Expert collection | Plan detail | Repeater: expert autocomplete, priority, preferred flag |
| Apply Plan dialog | Plan toolbar | Month select, generate button, async job status polling |
| Close month summary | Close month | Export prefix, month range, generated shift count |

### Hardcoded German strings (8 found)

Wireframes should use **English translations**. Mark hardcoded strings with `[HARDCODED]`.

## Shadcn UI Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| MonthTable grid | Custom `<Table>` grid | Same as Appointment list, jobType=SHIFT filter |
| Toolbar buttons | `@shadcn/button` group | Reload, Add, Edit, Export, Filter, Apply Plan |
| Filter panel | `@shadcn/sheet` (side="right") | Day, shift code, state filters |
| Shift detail dialog | `@shadcn/drawer` (600px) | Same as Appointment details, 5 tabs |
| Shift plan dialog | `@shadcn/dialog` (1200px) | 10-column grid, expert collection |
| Expert autocomplete | `@shadcn/combobox` | `UserService.findExperts` |
| Price type select | `@shadcn/select` | Auto-suggested from matrix |
| Plan export | `@shadcn/button` | Downloads .xls for current plan |
| Apply Plan button | `@shadcn/button` | Triggers async generation |
| Job status dialog | `@shadcn/dialog` | Polling indicator, progress, cancel button |

## Wireframe Inventory

### Phase 1: Core wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `shift-list.pen` | 01 | High | MonthTable grid filtered by jobType=SHIFT, toolbar, filter panel |
| W2 | `shift-plan-detail.pen` | 01 | Medium | Plan template: 10-col grid, expert collection, price type matrix |
| W3 | `apply-plan-dialog.pen` | 01 | Low | Month select, generate button, async status polling |

### Phase 2: Reference wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W4 | `shift-state-legend.pen` | 01 | Low | Visual legend: 12 shift states with colors (subset of appointment legend) |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/shifts/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **Design** using `batch_design()`:
   - W1: Reuse Appointment list pattern, update annotations for shift-specific fields
   - W2: 10-column grid with expert collection repeater
   - W3: Simple dialog with month select and async polling indicator
   - W4: Color legend card with 12 shift states
5. **Validate** with `get_screenshot()`
6. **Export** to PNG: `export_nodes()` to `specs/wireframes/shifts/`
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
| `[jobType: SHIFT]` | Filtered by job type |
| `[PERM: key]` | Permission-gated element |
| `data.field.path` | Datamodel binding |
| `@shadcn/component` | Target UI component |

## Completion Tracking

| Wireframe ID | Status | Date Completed | PNG Exported |
|:---|:---|:---|:---|
| W1 | Done | 2026-03-31 | Yes |
| W2 | Done | 2026-03-31 | Yes |
| W3 | Done | 2026-03-31 | Yes |
| W4 | Done | 2026-03-31 | Yes |
