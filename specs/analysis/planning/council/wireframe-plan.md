# Wireframe Creation Plan — Planning Domain: Council Module

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/planning/council/`

## Prerequisites

1. Analysis document in `specs/analysis/planning/council/` is complete:
   - `01-council-and-plan.md` — Council list view and council plan management
2. Pencil MCP server is available and responsive
3. Review completed MonthTable wireframes: `specs/wireframes/planning/appointment/appointment-list.pen`
4. Data dictionary: `specs/analysis/planning/data-dictionary-planning.md`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN)
- **Module overrides**: `messages.i18n.js` in `/council/` directory
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Findings from Analysis that Affect Wireframes

### Architecture Note

- **Council is a filtered Appointment view** — councils are appointments with `jobType=COUNCIL`
- Embeds same dialogs as Appointment: `details.html`, `assignUser.html`, `docFinder.html`
- Council Plan is a template-based management system with doctor role assignments

### Layout complexity

- **MonthTable calendar grid** — Same pattern as Appointment list, filtered by jobType=COUNCIL
- **Council plan detail dialog** — Plan templates with doctor role assignments, scheduling multiplier
- **Apply Plan dialog** — Async appointment generation from templates

### State-driven dynamic UI

- **Council appointment states** — Subset of appointment states
- **Doctor role assignment** — Plan defines which doctors are assigned to council sessions
- **Scheduling multiplier** — Field name typo in datamodel (`schedulingMulitplier`)

### Special components requiring detailed wireframing

| Component | Location | Wireframe notes |
|:---|:---|:---|
| MonthTable council grid | Council list | Day × council grid, state-colored cells, doctor assignments |
| Council plan detail | Plan dialog | Plan template: name, doctor collection, scheduling multiplier |
| Doctor collection | Plan detail | Repeater: doctor autocomplete, role assignment |
| Apply Plan dialog | Plan toolbar | Month select, generate button, async status |

### Hardcoded German strings (~16 found)

Wireframes should use **English translations**. Mark hardcoded strings with `[HARDCODED]`.

## Shadcn UI Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| MonthTable grid | Custom `<Table>` grid | Same as Appointment list, jobType=COUNCIL filter |
| Toolbar buttons | `@shadcn/button` group | Reload, Add, Edit, Export, Filter, Apply Plan |
| Filter panel | `@shadcn/sheet` (side="right") | Day, council code, state filters |
| Council detail dialog | `@shadcn/drawer` (600px) | Same as Appointment details, 5 tabs |
| Council plan dialog | `@shadcn/dialog` (1000px) | Plan template with doctor collection |
| Doctor autocomplete | `@shadcn/combobox` | `UserService.findDoctors` |
| Role assignment | `@shadcn/select` | Doctor role in council |
| Apply Plan button | `@shadcn/button` | Triggers async generation |

## Wireframe Inventory

### Phase 1: Core wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `council-list.pen` | 01 | High | MonthTable grid filtered by jobType=COUNCIL, toolbar, filter panel |
| W2 | `council-plan-detail.pen` | 01 | Medium | Plan template: doctor collection, scheduling multiplier |
| W3 | `council-apply-plan.pen` | 01 | Low | Month select, generate button, async status polling |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/planning/council/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **Design** using `batch_design()`:
   - W1: Reuse Appointment list pattern, update annotations for council-specific fields
   - W2: Plan template with doctor collection repeater
   - W3: Simple dialog with async polling indicator
5. **Validate** with `get_screenshot()`
6. **Export** to PNG: `export_nodes()` to `specs/wireframes/planning/council/`
7. **Embed screenshots** in `specs/wireframes/planning/workflows.md`
8. **Log completion** in `specs/analysis/wireframes-index.md`

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key |
| `[repeats]` | Collection row template |
| `[jobType: COUNCIL]` | Filtered by job type |
| `data.field.path` | Datamodel binding |
| `@shadcn/component` | Target UI component |

## Completion Tracking

| Wireframe ID | Status | Date Completed | PNG Exported |
|:---|:---|:---|:---|
| W1 | Done | 2026-03-31 | Yes |
| W2 | Done | 2026-03-31 | Yes |
| W3 | Done | 2026-03-31 | Yes |
