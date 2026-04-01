# Wireframe Creation Plan — Appointment Module

> **Status**: COMPLETED
> **Self-contained wireframe plan** — expanded for Batch 4 execution.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/appointments/`

## Prerequisites

1. All 3 analysis documents in `specs/analysis/appointments/` are complete and reviewed
2. Pencil MCP server is available and responsive
3. Data dictionary: `specs/analysis/planning/data-dictionary-planning.md`
4. Review the Pencil style guide for web-app design: `get_guidelines(topic="web-app")`
5. Reference template: `specs/wireframes/interfaces/dashboard/basisweb-wizard.pen` — study with `batch_get(readDepth:3)` on node QMGzX

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN)
- **Module overrides**: `messages.i18n.js`
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Findings from Analysis that Affect Wireframes

### Layout complexity

- **MonthTable calendar grid** — NOT a standard row-based table. Calendar grid: rows = days of month, columns = jobs/services, cells contain appointment entries with state-colored icons and nested sub-rows for assigned staff.
- **Appointment detail dialog** has 5 tabs and serves 4 entity types (APPOINTMENT, SHIFT, COUNCIL, TREATMENT) with type-driven field visibility.
- **12-state appointment state machine** with state-colored icons and action buttons that change per state.

### State-driven dynamic UI

- **13 appointment states** with distinct icon/color combinations in the MonthTable cells
- **12 assigned staff states** with their own icon/color set
- **State transition buttons** are dynamically shown/hidden based on current state via `ShiftLogic.getValidState()`
- **Tab visibility** changes based on appointment type and state

### Special components requiring detailed wireframing

| Component | Location | Wireframe notes |
|:---|:---|:---|
| MonthTable calendar grid | W1 | Day × Job grid with colored appointment cells, nested staff sub-rows |
| State-colored icons | W1, W2 | 13 states × icon + color mapping — show legend |
| DocFinder integration | W2 | Expert search panel embedded in Suggestions tab |
| Assignment collision modal | W3 | Table of overlapping appointments with state select per row |
| Location-Room cascade | W2 | Dependent dropdown: room locked until location selected |
| Template image URL | W2 | User profile images via `templatefield` pattern |

### Hardcoded German strings (15+ found)

Wireframes use English translations. Mark hardcoded strings with `[HARDCODED]`.

## Shadcn UI Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| MonthTable calendar grid | Custom `<Table>` grid | Not a DataTable — custom day×job grid with colored cells |
| Toolbar nav buttons | `@shadcn/button` group | Reload, Add, Edit, Export, Filter |
| Offcanvas filter panel | `@shadcn/sheet` (side="right") | Filter inputs for day, job, state |
| Day filter input | `@shadcn/input` type="number" | Filters grid rows by day |
| Job filter input | `@shadcn/input` type="text" | Filters grid columns by job name |
| State filter select | `@shadcn/select` | Populated from AppointmentState enum |
| Filter reset button | `@shadcn/button` variant="outline" | Clears all filters |
| Detail dialog (1200px) | `@shadcn/drawer` or `@shadcn/sheet` | 5-tab layout, side panel |
| Tab navigation | `@shadcn/tabs` | 5 tabs: Info, Referenced, Patients, Assigned, Suggestions |
| State select (read-only) | `@shadcn/select` disabled | Click opens state transition dialog |
| State transition dialog | `@shadcn/dialog` | Dynamic options from `getValidState()` |
| Date field | `@shadcn/input` with datepicker | Uses date-fns or Luxon formatting |
| Time fields | `@shadcn/input` type="time" | Start/end time inputs |
| Location autocomplete | `@shadcn/combobox` | `LocationService.autocomplete` |
| Room autocomplete | `@shadcn/combobox` | Dependent on location selection |
| Job autocomplete | `@shadcn/combobox` | Filtered by appointment type |
| Doctor autocomplete | `@shadcn/combobox` | `UserService.findDoctor` |
| Checkbox (expertOnly) | `@shadcn/checkbox` | Toggles field visibility |
| Textarea (comment) | `@shadcn/textarea` | Owner-only visibility |
| Assignment collision dialog | `@shadcn/alert-dialog` | Table of overlapping appointments |
| Assignment state select | `@shadcn/select` per row | ACCEPTED, RESERVED, AGREED, REJECTED, ABORTED, REMOVE |
| Assignment action buttons | `@shadcn/button` group | Accept, Reserve, Override, Reject, Abort, Reminder, History |
| Suggestion filter | `@shadcn/input` | Client-side filter on firstName/lastName |
| Profile images | `@shadcn/avatar` | Template URL `/get/UserService/getImage/{id}/profile.jpg` |
| Assignment history dialog | `@shadcn/dialog` (800px) | List of historical state changes |
| Referenced appointment dialog | `@shadcn/dialog` (800px) | Edit time/state/job/location for reference |
| Collection tables | `@shadcn/table` | Assigned, Referenced, Suggestions, Patient data |
| State badge | `@shadcn/badge` with custom colors | 13 appointment states + 12 assignment states |
| Export button | `@shadcn/button` | Downloads .xls for current month |
| Month/year navigation | `@shadcn/button` + `@shadcn/select` | MonthTable built-in navigation |

## Wireframe Inventory

### Phase 1: Core wireframes

| ID | Wireframe | Source doc(s) | Complexity | Status |Description |
|:---|:---|:---|:---|:---|:---|
| W1 | `appointment-list.pen` | 01 | High | Done | MonthTable calendar grid with toolbar, filter panel, state-colored cells |
| W2 | `appointment-details.pen` | 02 | High | Done | 5-tab detail dialog — Info tab with type-specific visibility, state machine actions |

### Phase 1a: Tab-specific detail wireframes (expanded from W2)

During execution, W2's 5-tab dialog required separate per-tab wireframes to capture the full complexity of each tab's content, sub-dialogs, and conditional visibility rules.

| ID | Wireframe | Source doc(s) | Complexity | Status | Description |
|:---|:---|:---|:---|:---|:---|
| W2a | `appointment-details-referenced.pen` | 02 | Medium | Done | Referenced (Patient Appointments) tab — location toolbar, table, edit sub-dialog. Cond: `expertOnly=true` |
| W2b | `appointment-details-patients.pen` | 02 | Medium | Done | Patients tab — add patient toolbar, patients table, treatments sub-table, Patient Data sub-dialog with attachments |
| W2c | `appointment-details-assigned.pen` | 02 | Medium | Done | Assigned (Expert Confirm) tab — doctor autocomplete, assignment table with 7 action buttons, state-dependent disable rules |
| W2d | `appointment-details-suggestions.pen` | 02 | Medium | Done | Suggestions (Add Expert) tab — text filter, suggestions table with preference icons, skills, Add button. Cond: state READY–LOCKEDIN |

### Phase 2: Supporting wireframes

| ID | Wireframe | Source doc(s) | Complexity | Status | Description |
|:---|:---|:---|:---|:---|:---|
| W3 | `appointment-assign-user.pen` | 03 | Low | Done | Collision resolution modal with assignments table |
| W4 | `appointment-state-legend.pen` | 01, 02 | Low | Done | Visual legend: 13 appointment states + 12 assignment states with colors |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/appointments/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **List registry**: `Shadcn_list_items_in_registries(["@shadcn"])` to verify component availability
5. **Design** using `batch_design()`:

### W1 — Appointment List (MonthTable)
- Frame width: **1440px** (full page view)
- Show month/year navigation bar at top with prev/next arrows
- Toolbar: Reload | Add | Edit (disabled) | — | Export | Filter buttons
- MonthTable grid: 7 sample day rows × 3–4 job columns
- Each cell: state-colored span with icon + appointment name
- Sub-rows: assigned staff with state icon + displayName
- Sub-rows: referenced appointments with time range + location
- Filter panel (right sheet): Day input, Job input, State select, Reset button
- Annotate: `data.state` → color class, `data.details.assigned[].state` → sub-row color
- Note annotation: MonthTable is NOT DataTables

### W2 — Appointment Details
- Frame width: **600px** (dialog/drawer)
- Header: location name, staff count, job code, weekday, date, time range, state display, comment
- Tab bar with 5 tabs and visibility annotations
- **Tab 1 (Info)**: Date*, Time start*, Time end*, Expert only checkbox [type: APPOINTMENT|TREATMENT], State (RO), Customer (RO), Location* [cond: !expertOnly], Room [cond: !expertOnly], Staff count*, Job*, Price type [type: SHIFT], Job support [type: COUNCIL], Min patients [type: SHIFT], Comment
- **Tab 2 (Referenced)**: Location autocomplete toolbar + delete button, table with time range, location, book number, job code, state badge, edit icon. [cond: expertOnly=true]
- **Tab 3 (Patients)**: Table with book number, jNumber, add/edit/remove buttons
- **Tab 4 (Assigned)**: Doctor autocomplete toolbar + delete button, table with avatar, role icon + name, phone, state + action buttons (accept/reserve/override/reject/abort/reminder/history)
- **Tab 5 (Suggestions)**: Text filter, table with avatar, name + preference icon, skills, phone, add button. [state: READY|STARTED|REOPENED|REQUESTED|LOCKEDIN]
- State transition sub-dialog: next state select, date [cond: STORNO], time [cond: STORNO], admin delete button
- Type-driven visibility annotations on all type-specific fields

### W2a — Appointment Details: Referenced Tab
- Frame width: **600px** (tab content panel)
- Visibility condition: `expertOnly=true`
- Toolbar: Location autocomplete + Delete button
- Table: Time range | Location | Book number | Job code | State badge (clickable)
- Sub-dialog (800px): Edit referenced appointment — time, state, job, location fields

### W2b — Appointment Details: Patients Tab
- Frame width: **600px** (tab content panel)
- Always visible
- Toolbar: Book number input + Add button
- Patients table: Title | Documentation-only flag | Closed date | Location | Edit/Remove/Sort actions
- Treatments sub-table below patients
- Sub-dialog: Patient Data Dialog with attachments management (add/view/delete)

### W2c — Appointment Details: Assigned Tab
- Frame width: **600px** (tab content panel)
- Always visible; toolbar only in READY–LOCKEDIN states
- Toolbar: Doctor autocomplete + Delete button
- Table rows: Avatar | Role icon (support/main/doctor) + Name + Message icon | Phone link | State badge | 7 action buttons (Accept, Reserve, Override, Reject, Abort, Send Reminder, History)
- State-dependent button disable rules annotated

### W2d — Appointment Details: Suggestions Tab
- Frame width: **600px** (tab content panel)
- Visibility: states READY, STARTED, REOPENED, REQUESTED, LOCKEDIN
- Text filter on firstName/lastName
- Table: Avatar | Role icon + Name + Preference icon (thumbs-up if wantFlag) | Skills (comma-separated) | Phone link | Add button

### W3 — Assign User (Collision Modal)
- Frame width: **600px** (dialog)
- Warning text: "The following appointments overlap..." [HARDCODED]
- Table: State select | Start [RO] | End [RO] | Date [RO] | Title [RO] | Location [RO]
- State options: Accept, Reserve, Override (→AGREED), Reject, Abort, Remove
- Save / Cancel footer

### W4 — Appointment State Legend
- Frame width: **600px** (reference card)
- **Section 1**: 13 appointment states — icon + color swatch + name + CSS class
- **Section 2**: 12 assignment states — icon + color swatch + name + CSS class
- Color annotations with hex values

6. **Validate** with `get_screenshot()`
7. **Export** to PNG in `specs/wireframes/appointments/`
8. **Embed screenshots** in `specs/wireframes/planning/workflows.md` — Done
9. **Log completion** in `specs/analysis/wireframes-index.md` — Done

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key |
| `[repeats]` | Collection row template |
| `[state: X]` | Shown only in state X |
| `[type: X]` | Shown only for type X |
| `[cond: expr]` | Conditional visibility logic |
| `[color: class]` | State-based color annotation |
| `[PERM: key]` | Permission-gated element |
| `data.field.path` | Datamodel binding |
| `@shadcn/component` | Target UI component |
