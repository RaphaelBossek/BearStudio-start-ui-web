---
title: 'Wireframe Plan Batch12'
---

# Wireframe Plan — Treatment Domain (Batch 12)

> **Batch 12**: Appointment Details Patient Tab, Medication, Patient Data, Treatment List & Category, Treatment Plan, Warning Management
> **Target directory**: `specs/wireframes/treatment/`
> **Analysis sources**: `specs/analysis/treatment/appointment-patient/`, `specs/analysis/treatment/medication/`, `specs/analysis/appointments/patient-data.md`, `specs/analysis/treatments/treatment-and-category.md`, `specs/analysis/treatments/treatment-plan.md`, `specs/analysis/administration/warning-management.md`, `specs/analysis/treatment/data-dictionary-treatment.md`

## Prerequisites

1. Analysis documents reviewed:
   - [`appointment-patient/appointment-details-patient.md`](./appointment-patient/appointment-details-patient.md) -- Patient tab within appointment details (patients collection, patient data dialog, treatments sub-collection, attachments)
   - [`medication/medication.md`](./medication/medication.md) -- Medication entity CRUD (14-column grid, flat detail form, MedicationUnit enum)
   - [`../appointments/patient-data.md`](../appointments/patient-data.md) -- PatientData standalone CRUD (6-column grid, detail with file attachments)
   - [`../../treatments/treatment-and-category.md`](../../treatments/treatment-and-category.md) -- Treatment MonthTable calendar + Treatment Category simple CRUD
   - [`../../treatments/treatment-plan.md`](../../treatments/treatment-plan.md) -- Treatment Plan (17-column grid, create dialog 1100px, edit dialog 1300px, positions collection, file attachments, 12-state machine)
   - [`../../administration/warning-management.md`](../../administration/warning-management.md) -- Warning/Allergy CRUD (6-column grid, 6-field detail dialog, WarningType enum)
   - [`data-dictionary-treatment.md`](./data-dictionary-treatment.md) -- Cross-referencing data dictionary for treatment domain
2. Data dictionary: [`data-dictionary-treatment.md`](./data-dictionary-treatment.md)
3. Pencil MCP server is available and responsive
4. Review guidelines: `get_guidelines(topic="web-app")`
5. Enumerate available Shadcn components: `get_project_registries()` then `list_items_in_registries(["@shadcn"])`

---

## Design System Reference

| Token | Value | Usage |
|:---|:---|:---|
| `$--bg` | `#FFFFFF` | Page and panel backgrounds |
| `$--fg` | `#0A0A0A` | Primary text |
| `$--border` | `#E5E5E5` | Dividers, table borders |
| `$--primary` | `#171717` | Primary buttons, active states |
| `$--input-border` | `#D4D4D4` | Input field strokes |
| `$--muted` | `#F5F5F5` | Muted backgrounds, disabled states |
| `$--destructive` | `#EF4444` | Delete buttons, error alerts |
| Font | Inter | All text |
| Font sizes | 13-20px | Labels (13px), body (14px), headings (16-20px) |
| Font weights | 400-700 | Normal (400), medium (500), semibold (600), bold (700) |
| Dialog | 600px width | Standard dialogs; cornerRadius 12, shadow, `$--bg` fill, `$--border` stroke |
| Drawer | 1100px width | Detail drawers for complex forms |
| Full page | 1440px width | Grid/list page frames |
| Input | cornerRadius 8 | padding 10,14; `$--input-border` stroke |
| Alert | cornerRadius 8 | padding 16; contextual fill colors |

---

## Shadcn UI Component Mapping

### Module 1: Appointment Details — Patient Tab

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| Patients collection (selectable table) | `@shadcn/table` (DataTable) | 7 columns; `data.patients` binding; `selectable` class |
| Patient Data Dialog (`patientDataDlg`) | `@shadcn/dialog` + form | 4 fields: bookNumber, jNumber, location autocomplete, closed date |
| Book number quick-add input | `@shadcn/input` + `@shadcn/button` (icon) | Inline add row with plus icon |
| Location autocomplete | `@shadcn/combobox` | `LocationService.autocomplete`; display=`name` |
| Closed date picker | `@shadcn/input` (type="date") or DatePicker | `data.closed` |
| Treatments sub-collection | `@shadcn/table` (DataTable) | 2 columns: title, edit action |
| Attachments file list | Custom table | Download link + transmit checkbox + comment + delete |
| File upload | `@shadcn/input` (type="file") | `PatientDataService.upload` |
| Transmit checkbox | `@shadcn/checkbox` | `attachments.attach` boolean flag |
| Comment input | `@shadcn/input` | `attachments.comment` free text |
| Edit/Remove/Sort actions | `@shadcn/button` (icon variants) | Row-level action buttons |
| onlyDocumentation boolean | `@shadcn/badge` or icon | Rendered as checkmark icon in grid |

### Module 2: Medication

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen, 14 cols) | `@shadcn/table` (DataTable) | 14 columns; all 80px uniform width |
| Detail dialog (flat layout) | `@shadcn/dialog` + form | 13 fields, single flat form (no tabs) |
| Quick filter (`quickFilter.mustache`) | `@shadcn/input` with search icon | Client-side text search |
| Unit select (2 options) | `@shadcn/select` | `PIECE`, `IE` (MedicationUnit enum) |
| Trafficability switch | `@shadcn/switch` | Boolean toggle for `data.trafficability` |
| Text inputs (10 fields) | `@shadcn/input` | name, targetGroup, usage, applicationArea, approvalStatus, producer, authorisationHolder, packageSize, amClassification, entryNumber |
| Action button (dead code) | -- | `someActionBtn` is dead code; do NOT carry forward |
| Add/Edit/Delete toolbar | `@shadcn/button` (variants) | Standard CRUD toolbar |

### Module 3: Patient Data

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen, 6 cols) | `@shadcn/table` (DataTable) | 6 columns: id, appointmentId, bookNumber, jNumber, closed, attachments |
| Detail panel | `@shadcn/dialog` + form | 5 fields + file attachment collection |
| Book Number input | `@shadcn/input` | `data.bookNumber` with label prefix |
| jNumber input | `@shadcn/input` | `data.jNumber`; tooltip: "JNumber used to get the bookNumber" |
| Appointment ID input | `@shadcn/input` (type="number") | `data.appointmentId` |
| Closed date | `@shadcn/input` (type="date") or DatePicker | `data.closed` with calendar icon |
| File upload | `@shadcn/input` (type="file") | `PatientDataService.upload` |
| File list (attachments) | Custom table | Download link + delete action |
| Client-side search | `@shadcn/input` with search icon | Filters on appointmentId, bookNumber, jNumber |
| Add/Edit/Delete toolbar | `@shadcn/button` (variants) | Standard CRUD toolbar |

### Module 4: Treatment List & Category

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| MonthTable calendar grid | Custom `MonthTable` component | Dynamic: rows=days 1-31, columns=jobs; NOT a standard DataTable |
| MonthTable cell (treatment entry) | Custom cell renderer | State icon + name + report icons + assigned staff sub-rows |
| Filter offcanvas panel | `@shadcn/sheet` (side="right") | 3 filter fields + reset button |
| Filter: Day number | `@shadcn/input` (type="number") | `MonthTable.filterDay()` row-level filter |
| Filter: Job text | `@shadcn/input` | `MonthTable.filterCol()` column-level filter |
| Filter: State select (12 options) | `@shadcn/select` | 12 AppointmentState values |
| Filter: Reset button | `@shadcn/button` | Clears all filters |
| Location Reminder dialog | `@shadcn/dialog` + form | Start date + days count + static help text |
| Reminder start date | `@shadcn/input` (type="date") or DatePicker | Default: next Monday |
| Reminder days count | `@shadcn/input` (type="number") | Default: 7 |
| Reload/Edit/Export/Reminder toolbar | `@shadcn/button` (variants) | No Add/Delete buttons |
| Treatment Category grid (4 cols) | `@shadcn/table` (DataTable) | 4 columns: id, name, description, prio |
| Treatment Category modal | `@shadcn/dialog` + form | 3 fields: name, description, prio |
| Category Add/Edit/Delete toolbar | `@shadcn/button` (variants) | Standard CRUD toolbar |

### Module 5: Treatment Plan

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen, 17 cols) | `@shadcn/table` (DataTable) | 17 columns -- widest grid in codebase; state column with color-coded badges |
| TreatmentState badges (12 states) | `@shadcn/badge` | Color-coded: PREPARED, READY, STARTED, PROBATORIK, RUNNING, ENDING, CANCELED, CANCELED_CLOSED, CLOSED, STORNO, STORNO_CLOSED, PAUSED |
| Create dialog (1100px, 2-col) | `@shadcn/dialog` (xl) | Left col: 20 form fields; Right col: expert autocomplete + week calendar |
| Edit dialog (1300px, 3-col) | `@shadcn/dialog` (xl) | 3-column top row + full-width positions table + files |
| Expert Week Calendar | Custom `ExpertWeekCalendar` | 7-day grid (MO-SU) with hourly slots; bidirectional sync with day/hour selects |
| Job autocomplete (3 instances) | `@shadcn/combobox` | `JobService.autocompleteType`; filtered by `"APPOINTMENT"` or `"SHIFT"` |
| Room autocomplete | `@shadcn/combobox` | `RoomService.autocompleteAvailableRooms` |
| Location autocomplete | `@shadcn/combobox` | `LocationService.autocomplete` |
| Expert autocomplete | `@shadcn/combobox` | `UserService.findDoctor` |
| Day/Hour/Minute selects | `@shadcn/select` (x3) | Day: MO-SU; Hour: 1-24; Minutes: 00/15/30/45 |
| Positions collection (edit dialog) | `@shadcn/table` + `FieldArray` | Editable collection: date, timeStart, timeEnd, state (RO), forceReport, requireReport, report dates, delete/add |
| Position time inputs | `@shadcn/input` (type="time") or TimePicker | Linked start/end time (duration-preserving) |
| Position soft-delete | CSS strikethrough toggle | Rows with `appointmentId` use visual toggle, not removal |
| File attachments collection | Custom table | Download link + delete; `TreatmentService.upload` |
| Apply Plan dialog (220px) | `@shadcn/dialog` (sm) | Single date picker: "Generate until" date |
| Job status progress dialog | `@shadcn/dialog` + Progress | Async job tracking via `jobStatusDlg`; `[async: poll]` |
| Storno/Cancel confirm dialogs | `@shadcn/alert-dialog` | Confirmation before destructive state transitions |
| Client-side search | `@shadcn/input` with search icon | Filters: assigned, location, bookNumber, jNumber, day, job |
| Create/Edit/Delete/ApplyPlan/Export toolbar | `@shadcn/button` (variants) | 5 toolbar buttons; create/applyPlan hidden in history mode |

### Module 6: Warning / Allergy Management

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen, 6 cols) | `@shadcn/table` (DataTable) | 6 columns: id, name, type, entryRequirement, documentationRequirement, description |
| Detail dialog (create/edit) | `@shadcn/dialog` + form | 6 fields in 2-row layout |
| Name input | `@shadcn/input` | `data.name`; placeholder from i18n |
| Type select (4 options) | `@shadcn/select` | ALLERGY, CONSPICUOUS, INFECTION, OTHER (fixed spelling from legacy `CONSPICIOUS`) |
| Entry Requirement switch | `@shadcn/switch` | `data.entryRequirement` boolean |
| Documentation Requirement switch | `@shadcn/switch` | `data.documentationRequirement` boolean |
| Priority number input | `@shadcn/input` (type="number") | `data.priority` with input-group label prefix |
| Description textarea | `@shadcn/textarea` | `data.description`; full-width (col-md-12) |
| Warning Type formatter (grid) | `@shadcn/badge` | Color-coded enum badge; shared with consultation views |
| Boolean formatters (grid) | `@shadcn/badge` or icon | `Formatter.bool` for entryRequirement, documentationRequirement |
| Client-side search | `@shadcn/input` with search icon | Filters on name + type (i18n-resolved) |
| Add/Edit/Delete toolbar | `@shadcn/button` (variants) | Standard CRUD; `someActionBtn` is dead code -- omit |

---

## Wireframe Inventory

| ID | Wireframe | Analysis Source | Target `.pen` | Complexity | Description |
|:---|:---|:---|:---|:---|:---|
| W20 | Appointment Patient Tab | appointment-patient/appointment-details-patient.md | `appointment-details-patient.pen` | Medium | Patient tab content (1000px panel width). Top: book number quick-add input + plus button. Patients collection: 7-column selectable table (title, onlyDocumentation icon, closed datetime, location.name, edit icon, remove icon, sort arrows). Below table: Treatments sub-collection: 2-column table (title, edit icon). |
| W20b | Patient Data Dialog | appointment-patient/appointment-details-patient.md | `appointment-details-patient.pen` | Low | Dialog (600px). 4 fields: bookNumber `@shadcn/input`, jNumber `@shadcn/input`, location `@shadcn/combobox` `[autocomplete: LocationService.autocomplete]` `[cond: .council class]`, closed `@shadcn/input[date]`. |
| W20c | Patient Attachments | appointment-patient/appointment-details-patient.md | `appointment-details-patient.pen` | Low | Sub-section within patient data dialog. File upload button + attachments table: 4 columns (file name as download link, transmit `@shadcn/checkbox`, comment `@shadcn/input`, delete `@shadcn/button` icon). Upload via `PatientDataService.upload`. |
| W21 | Medication List + Detail | medication/medication.md | `medication.pen` | Low-Medium | Full-page (1440px) grid with 14 columns (id 80px, entryNumber 80px, name 80px, unit 80px, targetGroup 80px, usage 80px, applicationArea 80px, approvalStatus 80px, trafficability 80px `Formatter.bool`, producer 80px, authorisationHolder 80px, activeIngredients 80px, packageSize 80px, amClassification 80px). Quick filter in toolbar. Detail dialog (600px): 13 fields in flat layout -- ID `[RO]`, entryNumber `@shadcn/input[number]`, name `@shadcn/input`, unit `@shadcn/select` [PIECE/IE], targetGroup `@shadcn/input`, usage `@shadcn/input`, applicationArea `@shadcn/input`, approvalStatus `@shadcn/input`, trafficability `@shadcn/switch`, producer `@shadcn/input`, authorisationHolder `@shadcn/input`, packageSize `@shadcn/input`, amClassification `@shadcn/input`. |
| W22 | Patient Data List + Detail | appointments/patient-data.md | `patient-data.pen` | Low | Full-page (1440px) grid with 6 columns (id 40px, appointmentId 80px, bookNumber 100px, jNumber 80px, closed 100px `Formatter.dateTime`, attachments 80px). Client-side search on appointmentId, bookNumber, jNumber. Detail dialog (600px): 5 fields -- bookNumber `@shadcn/input`, jNumber `@shadcn/input`, appointmentId `@shadcn/input[number]`, closed `@shadcn/input[date]`, attachments file collection (upload button + download link list + delete per file). |
| W23 | Treatment MonthTable | treatments/treatment-and-category.md | `treatment-and-category.pen` | Medium | Full-page (1440px) MonthTable calendar grid. Rows: days 1-31. Columns: dynamically loaded job/service names. Cells: state-colored treatment name + report status icon + assigned staff sub-rows. Toolbar: Reload, Edit (disabled), Export XLS, Location Reminder, Filter toggle. No Add/Delete buttons. |
| W23b | Treatment Filter Panel | treatments/treatment-and-category.md | `treatment-and-category.pen` | Low | Right-side `@shadcn/sheet`: filterDay `@shadcn/input[number]` (placeholder "Tag" `[HARDCODED]`), filterJob `@shadcn/input`, filterState `@shadcn/select` (12 AppointmentState options), Reset `@shadcn/button`. |
| W23c | Location Reminder Dialog | treatments/treatment-and-category.md | `treatment-and-category.pen` | Low | Dialog (600px). Static text paragraph, start date `@shadcn/input[date]` `*` (default: next Monday), days `@shadcn/input[number]` `*` (default: 7), help text paragraph (muted). Confirm triggers `AppointmentService.sendAppointmentReminderLocations`. |
| W23d | Treatment Category List + Detail | treatments/treatment-and-category.md | `treatment-and-category.pen` | Low | Full-page (1440px) grid with 4 columns (id 80px, name 80px, description 80px, prio 80px). Standard Add/Edit/Delete toolbar. Detail dialog (600px): 3 fields -- name `@shadcn/input`, description `@shadcn/input`, prio `@shadcn/input[number]`. Simplest CRUD in batch. |
| W24 | Treatment Plan List | treatments/treatment-plan.md | `treatment-plan.pen` | High | Full-page (1440px) grid with 17 columns (id 40px, externalUuid 80px, assigned 140px `Formatter.name`, location 180px `Formatter.name`, bookNumber 80px, dateStart 80px `Formatter.dateTime`, day 80px `Formatter.weekday`, startTime 80px, jNumber 80px, job 180px `Formatter.name`, state 180px `i18n.treatmentStateFormatter` with `@shadcn/badge`, archived 80px `Formatter.bool`, closed 100px `Formatter.dateTime`, countTotal 100px, countFinished 130px, countPlanned 110px, comment 310px). Client-side search. Toolbar: Add, Edit (disabled), Delete (disabled), --- spacer ---, Apply Plan, Export. History mode hides Add + Apply Plan. |
| W24b | Treatment Plan Create Dialog | treatments/treatment-plan.md | `treatment-plan.pen` | Very High | Dialog (1100px, 2-column layout). **Left column** (col-4, 20 fields): job `@shadcn/combobox` `[autocomplete: JobService.autocompleteType "APPOINTMENT"]` `*`, room `@shadcn/combobox` `[autocomplete: RoomService.autocompleteAvailableRooms]`, location `@shadcn/combobox` `[autocomplete: LocationService.autocomplete]` `*`, bookNumber `@shadcn/input`, jNumber `@shadcn/input`, countPlanned `@shadcn/input[number]` `*` (default: 65), dateInitial `@shadcn/input[number]` `*` (default: 5), day `@shadcn/select` [MO-SU], hour `@shadcn/select` [1-24], minutes `@shadcn/select` [00/15/30/45], comment `@shadcn/textarea`, jobReportProbatorik `@shadcn/combobox` `[autocomplete: JobService.autocompleteType "SHIFT"]` `*`, reportingPath `@shadcn/input`, jobReport `@shadcn/combobox` `[autocomplete: JobService.autocompleteType "SHIFT"]` `*`, reportCountInitial `@shadcn/input[number]` `*` (default: 5), reportCountRhytm `@shadcn/input[number]` `*` (default: 20), dateStart `@shadcn/input[date]`, dateAcceptedPTLeitung `@shadcn/input[date]`, dateAcceptedPT `@shadcn/input[date]`, dateAcceptedLocation `@shadcn/input[date]`. **Right column** (col-8): expert `@shadcn/combobox` `[autocomplete: UserService.findDoctor]` + `ExpertWeekCalendar` (7-day grid MO-SU with hourly slots; bidirectional sync with day/hour selects; 3 slot states: available/unavailable/unknown). Dialog buttons: Save (standard), Start `@shadcn/button` (confirm: start treatment + create appointments). Minute warning when minutes != 00. |
| W24c | Treatment Plan Edit Dialog | treatments/treatment-plan.md | `treatment-plan.pen` | Very High | Dialog (1300px, 3-column top + full-width bottom). **Column 1** (read-only info, 9 fields): assigned.displayName `[RO]`, jNumber `[RO]`, bookNumber `[RO]`, location.name `[RO]`, customer.name `[RO]`, dateAcceptedPTLeitung `[RO]`, dateAcceptedPT `[RO]`, dateAcceptedLocation `[RO]`, dateStart `[RO]`. **Column 2** (editable scheduling, 5 fields): room `@shadcn/combobox`, day `@shadcn/select`, hour `@shadcn/select`, minutes `@shadcn/select`, comment `@shadcn/textarea`. **Column 3** (counts + report config, 10 fields): countFinished/countPlanned `[RO]` display, countPlanned `@shadcn/input[number]`, jobReportProbatorik `@shadcn/combobox`, reportCountInitial `@shadcn/input[number]`, reportCountRhytm `@shadcn/input[number]`, jobReport `@shadcn/combobox`, dateLastAppointment `@shadcn/input[date]`, closed `@shadcn/input[date]`, reportingPath `@shadcn/input` + Test button, archived `@shadcn/switch`. **Bottom: Positions collection** (`FieldArray`): columns -- #, date `@shadcn/input[date]` `*`, timeStart (TimePicker) `*`, timeEnd (TimePicker) `*`, state `[RO]` (color-coded badge), forceReport `@shadcn/checkbox`, requireReport `[RO]`, report.dateStart `[RO]`, report.dateEnd `[RO]`, delete/add actions. Soft-delete for existing positions (CSS strikethrough). **Bottom: File attachments**: download link + delete; upload via `TreatmentService.upload`. Dialog buttons: Save, Storno `@shadcn/alert-dialog`, Cancel/End `@shadcn/alert-dialog`, Close. |
| W24d | Apply Plan Dialog | treatments/treatment-plan.md | `treatment-plan.pen` | Low | Dialog (300px). Description text + single date picker `@shadcn/input[date]` ("Generate until"). Submit calls `TreatmentService.publishNext(date)` which returns `jobId` -> opens job status progress dialog. |
| W25 | Warning List + Detail | administration/warning-management.md | `warning-management.pen` | Low | Full-page (1440px) grid with 6 columns (id auto, name 180px, type 180px `@shadcn/badge` via `Formatter.warningType`, entryRequirement 180px `Formatter.bool`, documentationRequirement 180px `Formatter.bool`, description 180px). Client-side search on name + type. Detail dialog (600px): 6 fields -- name `@shadcn/input` (col-6), type `@shadcn/select` `*` [ALLERGY/CONSPICUOUS/INFECTION/OTHER] (col-6), entryRequirement `@shadcn/switch` (col-4), documentationRequirement `@shadcn/switch` (col-4), priority `@shadcn/input[number]` (col-3), description `@shadcn/textarea` (col-12 full-width). |

**Total wireframes**: 16 frames across 6 `.pen` files

---

## Wireframe File Layout

### File 1: `specs/wireframes/treatment/appointment-patient/appointment-details-patient.pen`

| Frame | Content |
|:---|:---|
| `patient-tab` | Patient tab panel (1000px) with quick-add input, patients table (7 cols), treatments sub-table (2 cols) |
| `patient-data-dialog` | Patient data dialog (600px) with 4 fields |
| `patient-attachments` | Attachments sub-section: upload + file table (4 cols) |

### File 2: `specs/wireframes/treatment/medication/medication.pen`

| Frame | Content |
|:---|:---|
| `medication-list` | Full-page grid (1440px) with 14 columns + quick filter + CRUD toolbar |
| `medication-detail` | Detail dialog (600px) with 13 fields in flat layout |

### File 3: `specs/wireframes/treatment/patient-data/patient-data.pen`

| Frame | Content |
|:---|:---|
| `patient-data-list` | Full-page grid (1440px) with 6 columns + client-side search + CRUD toolbar |
| `patient-data-detail` | Detail dialog (600px) with 5 fields + file attachment collection |

### File 4: `specs/wireframes/treatment/treatment-core/treatment-and-category.pen`

| Frame | Content |
|:---|:---|
| `treatment-monthtable` | Full-page (1440px) MonthTable calendar grid + toolbar (Reload, Edit, Export, Reminder, Filter) |
| `treatment-filter` | Right-side sheet with 3 filter fields + reset |
| `location-reminder-dialog` | Location reminder dialog (600px) with start date + days |
| `category-list` | Full-page grid (1440px) with 4 columns + CRUD toolbar |
| `category-detail` | Detail dialog (600px) with 3 fields |

### File 5: `specs/wireframes/treatment/treatment-core/treatment-plan.pen`

| Frame | Content |
|:---|:---|
| `treatment-plan-list` | Full-page grid (1440px) with 17 columns + 5-button toolbar + client-side search |
| `treatment-plan-create` | Create dialog (1100px) with 2-column layout: 20 fields left + expert week calendar right |
| `treatment-plan-edit` | Edit dialog (1300px) with 3-column top + positions collection + file attachments bottom |
| `treatment-plan-apply` | Apply plan dialog (300px) with date picker |

### File 6: `specs/wireframes/treatment/warning/warning-management.pen`

| Frame | Content |
|:---|:---|
| `warning-list` | Full-page grid (1440px) with 6 columns + search + CRUD toolbar |
| `warning-detail` | Detail dialog (600px) with 6 fields |

---

## Annotation Legend

> **Note**: Annotations are documented here for reference. Do NOT embed this legend inside `.pen` files. Instead, embed it in `specs/wireframes/treatment/workflows.md`.

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key -- string is hard-coded in legacy |
| `[cond: expr]` | Conditional visibility (e.g., `[cond: .council]` = only for council-class locations) |
| `[async: poll Xms]` | Polling/async loading state |
| `[markdown]` | Field uses markdown editing/rendering |
| `[autocomplete: Service.method]` | Autocomplete data source |
| `[repeats]` | Collection row template |
| `[sortable]` | Drag-sortable list |
| `[soft-delete]` | Row uses CSS strikethrough toggle instead of removal |
| `data.field.path` | Data model binding |
| `@shadcn/component` | Target Shadcn UI component |

---

## Enum Reference

### TreatmentState (12 values)

| Value | Color | Description |
|:---|:---|:---|
| `PREPARED` | `$--muted` (gray) | Treatment created, not yet ready |
| `READY` | `#3B82F6` (blue) | Ready for scheduling |
| `STARTED` | `#22C55E` (green) | Treatment has been started |
| `PROBATORIK` | `#06B6D4` (cyan) | Probatory/trial phase |
| `RUNNING` | `#10B981` (emerald) | Full treatment in progress |
| `ENDING` | `#F59E0B` (amber) | Approaching end of treatment |
| `CANCELED` | `#EF4444` (red) | Canceled by doctor |
| `CANCELED_CLOSED` | `#991B1B` (red-900) | Cancellation finalized |
| `CLOSED` | `#6B7280` (gray-500) | Treatment completed |
| `STORNO` | `#F97316` (orange) | Reversed/storno |
| `STORNO_CLOSED` | `#9A3412` (orange-900) | Storno finalized |
| `PAUSED` | `#8B5CF6` (violet) | Treatment paused |

### AppointmentState (12 values -- Treatment MonthTable filter)

| Value | Color |
|:---|:---|
| `READY` | blue |
| `STARTED` | green |
| `REQUESTED` | cyan |
| `LOCKEDIN` | indigo |
| `ACTIVE` | emerald |
| `REOPENED` | amber |
| `DONE` | teal |
| `CLOSED` | gray |
| `STORNO` | orange |
| `RESCHEDULED` | violet |
| `CANCELED` | red |
| `ARCHIVED` | gray-400 |

### MedicationUnit (2 values)

| Value | i18n Key | Description |
|:---|:---|:---|
| `PIECE` | `MedicationUnit.PIECE` | Piece (count unit) |
| `IE` | `MedicationUnit.IE` | International Unit (Internationale Einheit) |

### WarningType (4 values)

| Value | Color | Description |
|:---|:---|:---|
| `ALLERGY` | `#EF4444` (red) | Allergy |
| `CONSPICUOUS` | `#F59E0B` (amber) | Conspicuous behavior (normalized from legacy `CONSPICIOUS`) |
| `INFECTION` | `#F97316` (orange) | Infection risk |
| `OTHER` | `$--muted` (gray) | Other warning type |

---

## Execution Steps

### Phase 1: Setup (once per batch)

1. **Get guidelines**: `pencil_get_guidelines(category="guide", name="web-app")`
2. **List registry**: `Shadcn_list_items_in_registries(["@shadcn"])` -- enumerate available components
3. **Review reference wireframes**: Study existing treatment wireframes for consistency:
   - `specs/wireframes/treatment/consultation/consultation-list.pen` -- list + filter pattern
   - `specs/wireframes/treatment/consultation/consultation-details-standard.pen` -- complex detail layout
   - `specs/wireframes/treatment/dashboard/consultation-wizard.pen` -- multi-step dialog pattern

### Phase 2: Module 1 -- Appointment Details Patient Tab (`appointment-details-patient.pen`)

**Step 2.1**: Read analysis documents:
- `appointment-patient/appointment-details-patient.md` (patient tab CRUD, patient data dialog, attachments)
- `data-dictionary-treatment.md` Sections on patient data dialog

**Step 2.2**: Create `specs/wireframes/treatment/appointment-patient/appointment-details-patient.pen`:
```
pencil_open_document("specs/wireframes/treatment/appointment-patient/appointment-details-patient.pen")
```

**Step 2.3**: Design W20 -- Patient Tab:
- **Panel frame** (1000px): Panel within appointment details drawer
  - Top: Book number input (200px) + Add button (plus icon)
  - Patients table: 7 columns
    - title (200px), onlyDocumentation (80px, icon), closed (120px, `Formatter.dateTime`), location.name (150px), edit icon (40px), remove icon (40px), sort arrows (60px)
  - Below: "Treatments" label + 2-column table
    - title (300px), edit icon (40px)

**Step 2.4**: Design W20b -- Patient Data Dialog:
- Dialog (600px): 4 fields in 2-row layout
  - Row 1: bookNumber `@shadcn/input` (col-6), jNumber `@shadcn/input` (col-6)
  - Row 2: location `@shadcn/combobox` `[autocomplete: LocationService.autocomplete]` (col-6), closed `@shadcn/input[date]` (col-6)

**Step 2.5**: Design W20c -- Attachments Sub-Section:
- Upload button + file table: 4 columns
  - file.name (200px, download link), attach `@shadcn/checkbox` (60px), comment `@shadcn/input` (200px), delete icon (40px)

**Step 2.6**: Validate + Export:
```
pencil_get_screenshot(nodeId="patient-tab")
pencil_get_screenshot(nodeId="patient-data-dialog")
pencil_get_screenshot(nodeId="patient-attachments")
pencil_export_nodes(outputDir="specs/wireframes/treatment/appointment-patient/", nodeIds=[...], format="png")
```

### Phase 3: Module 2 -- Medication (`medication.pen`)

**Step 3.1**: Read analysis documents:
- `medication/medication.md` (grid columns, detail form, MedicationUnit enum)

**Step 3.2**: Create `specs/wireframes/treatment/medication/medication.pen`:
```
pencil_open_document("specs/wireframes/treatment/medication/medication.pen")
```

**Step 3.3**: Design W21 -- Medication List + Detail:
- **List frame** (1440px): CRUD toolbar (Add, Edit, Delete) + Quick filter input + DataTable with 14 columns
  - All columns 80px: id, entryNumber, name, unit, targetGroup, usage, applicationArea, approvalStatus, trafficability (`Formatter.bool`), producer, authorisationHolder, activeIngredients, packageSize, amClassification
- **Detail dialog** (600px): 13 fields in flat layout (no tabs, no sections)
  - Row 1: ID `[RO]` (col-2), entryNumber (col-2), name (col-4), unit `@shadcn/select` [PIECE/IE] (col-4)
  - Row 2: targetGroup (col-4), usage (col-4), applicationArea (col-4)
  - Row 3: approvalStatus (col-4), trafficability `@shadcn/switch` (col-4), producer (col-4)
  - Row 4: authorisationHolder (col-4), packageSize (col-4), amClassification (col-4)

**Step 3.4**: Validate + Export

### Phase 4: Module 3 -- Patient Data (`patient-data.pen`)

**Step 4.1**: Read analysis: `../appointments/patient-data.md` (Section 5: PatientData)

**Step 4.2**: Create `specs/wireframes/treatment/patient-data/patient-data.pen`:
```
pencil_open_document("specs/wireframes/treatment/patient-data/patient-data.pen")
```

**Step 4.3**: Design W22 -- Patient Data List + Detail:
- **List frame** (1440px): CRUD toolbar (Add, Edit, Delete) + search input + DataTable with 6 columns
  - id (40px), appointmentId (80px), bookNumber (100px), jNumber (80px), closed (100px, `Formatter.dateTime`), attachments (80px)
- **Detail dialog** (600px): 5 fields + file attachment collection
  - Row 1: bookNumber `@shadcn/input` (col-6), jNumber `@shadcn/input` (col-6)
  - Row 2: appointmentId `@shadcn/input[number]` (col-6), closed `@shadcn/input[date]` (col-6)
  - Row 3: Attachments section -- file upload button, file list table (name link + delete icon)

**Step 4.4**: Validate + Export

### Phase 5: Module 4 -- Treatment List & Category (`treatment-and-category.pen`)

**Step 5.1**: Read analysis: `../../treatments/treatment-and-category.md` (Part 1: Treatment List, Part 2: Treatment Category)

**Step 5.2**: Create `specs/wireframes/treatment/treatment-core/treatment-and-category.pen`:
```
pencil_open_document("specs/wireframes/treatment/treatment-core/treatment-and-category.pen")
```

**Step 5.3**: Design W23 -- Treatment MonthTable:
- **Full-page** (1440px): Custom MonthTable calendar grid
  - Toolbar: Reload `@shadcn/button`, Edit `@shadcn/button` (disabled), --- spacer ---, Export XLS `@shadcn/button`, Location Reminder `@shadcn/button`, Filter toggle `@shadcn/button`
  - Calendar layout: left column = day numbers (1-31), top row = dynamic job column headers
  - Sample cells: state-colored treatment name + report icon (fa-file-check/fa-file-alt) + assigned staff sub-rows

**Step 5.4**: Design W23b -- Filter Panel:
- Sheet (side="right"): header "Filter" with filter icon
  - filterDay `@shadcn/input[number]` (placeholder "Tag" `[HARDCODED]`)
  - filterJob `@shadcn/input` (placeholder from i18n.jobId)
  - filterState `@shadcn/select` (12 AppointmentState options)
  - Reset `@shadcn/button`

**Step 5.5**: Design W23c -- Location Reminder Dialog:
- Dialog (600px): treatment.reminder.text1 paragraph, start date `@shadcn/input[date]` `*` (default: next Monday), days `@shadcn/input[number]` `*` (default: 7), treatment.reminder.text2 paragraph (muted help text)

**Step 5.6**: Design W23d -- Treatment Category List + Detail:
- **List frame** (1440px): CRUD toolbar (Add, Edit, Delete) + DataTable with 4 columns
  - id (80px), name (80px), description (80px), prio (80px)
- **Detail dialog** (600px): 3 fields in single row
  - name `@shadcn/input` (col-3), description `@shadcn/input` (col-3), prio `@shadcn/input[number]` (col-3)

**Step 5.7**: Validate + Export

### Phase 6: Module 5 -- Treatment Plan (`treatment-plan.pen`)

**Step 6.1**: Read analysis: `../../treatments/treatment-plan.md` (all sections: grid, create dialog, edit dialog, apply plan, TreatmentState)

**Step 6.2**: Create `specs/wireframes/treatment/treatment-core/treatment-plan.pen`:
```
pencil_open_document("specs/wireframes/treatment/treatment-core/treatment-plan.pen")
```

**Step 6.3**: Design W24 -- Treatment Plan List:
- **Full-page** (1440px): DataTable with 17 columns
  - id (40px), externalUuid (80px), assigned (140px, `Formatter.name`), location (180px, `Formatter.name`), bookNumber (80px), dateStart (80px, `Formatter.dateTime`), day (80px, `Formatter.weekday`), startTime (80px), jNumber (80px), job (180px, `Formatter.name`), state (180px, `@shadcn/badge` with TreatmentState colors), archived (80px, `Formatter.bool`), closed (100px, `Formatter.dateTime`), countTotal (100px), countFinished (130px), countPlanned (110px), comment (310px)
- Toolbar: createTreatmentBtn, editTreatmentBtn (disabled), deleteMenuBtn (disabled), --- spacer ---, createNextBtn (Apply Plan), downloadTherapyButton (Export)
- Client-side search input

**Step 6.4**: Design W24b -- Create Treatment Dialog:
- Dialog (1100px, 2-column):
  - **Left column** (col-4): 20 form fields arranged vertically
    - Group 1 "Location & Patient": job autocomplete `*`, room autocomplete, location autocomplete `*`, bookNumber, jNumber
    - Group 2 "Scheduling": countPlanned `*` (default: 65), dateInitial `*` (default: 5), day select [MO-SU], hour select [1-24], minutes select [00/15/30/45]
    - Group 3 "Details": comment textarea
    - Group 4 "Report Config": jobReportProbatorik autocomplete `*`, reportingPath, jobReport autocomplete `*`, reportCountInitial `*` (default: 5), reportCountRhytm `*` (default: 20)
    - Group 5 "Dates": dateStart, dateAcceptedPTLeitung, dateAcceptedPT, dateAcceptedLocation
  - **Right column** (col-8): expert autocomplete + ExpertWeekCalendar
    - Expert autocomplete: `UserService.findDoctor`
    - Week calendar: 7-day grid (MO-SU) with hourly slot rows; 3 states per cell (available/unavailable/unknown); click syncs day/hour dropdowns; visual warning when slot unavailable
  - Dialog buttons: Save, Start (with confirmation)

**Step 6.5**: Design W24c -- Edit Treatment Dialog:
- Dialog (1300px, 3-column top + full-width bottom):
  - **Column 1** (col-4, read-only): assigned `[RO]`, jNumber `[RO]`, bookNumber `[RO]`, location `[RO]`, customer `[RO]`, 3 acceptance dates `[RO]`, dateStart `[RO]`
  - **Column 2** (col-4, editable): room autocomplete, day select, hour select, minutes select, comment textarea
  - **Column 3** (col-4, counts/config): countFinished/countPlanned display `[RO]`, countPlanned editable, jobReportProbatorik autocomplete, reportCountInitial, reportCountRhytm, jobReport autocomplete, dateLastAppointment, closed, reportingPath + Test button, archived switch
  - **Full-width bottom -- Positions table** (`FieldArray`):
    - Header: # | Date | Start | End | Status | Report | Required | Report Start | Report End | Actions
    - Each row: index span, date `@shadcn/input[date]` `*`, timeStart (TimePicker) `*`, timeEnd (TimePicker) `*`, state badge `[RO]`, forceReport `@shadcn/checkbox`, requireReport `[RO]`, report dates `[RO]`, delete + show-report action icons
    - Add button in header, soft-delete pattern for existing rows
  - **Full-width bottom -- File attachments**: download links + delete per file + upload button
  - Dialog buttons: Save, Storno (alert-dialog confirm), Cancel/End (alert-dialog confirm), Close

**Step 6.6**: Design W24d -- Apply Plan Dialog:
- Dialog (300px): description text, date picker `@shadcn/input[date]` ("Generate until"), Submit button -> calls `publishNext(date)` -> triggers job status dialog

**Step 6.7**: Validate + Export

### Phase 7: Module 6 -- Warning Management (`warning-management.pen`)

**Step 7.1**: Read analysis: `../../administration/warning-management.md` (all sections)

**Step 7.2**: Create `specs/wireframes/treatment/warning/warning-management.pen`:
```
pencil_open_document("specs/wireframes/treatment/warning/warning-management.pen")
```

**Step 7.3**: Design W25 -- Warning List + Detail:
- **List frame** (1440px): CRUD toolbar (Add, Edit, Delete) + search input + DataTable with 6 columns
  - id (auto), name (180px), type (180px, `@shadcn/badge` warningType formatter), entryRequirement (180px, `Formatter.bool`), documentationRequirement (180px, `Formatter.bool`), description (180px)
- **Detail dialog** (600px): 6 fields in 2-row layout
  - Row 1: name `@shadcn/input` (col-6), type `@shadcn/select` `*` [ALLERGY/CONSPICUOUS/INFECTION/OTHER] (col-6)
  - Row 2: entryRequirement `@shadcn/switch` (col-4), documentationRequirement `@shadcn/switch` (col-4), priority `@shadcn/input[number]` (col-3)
  - Row 3: description `@shadcn/textarea` (col-12)

**Step 7.4**: Validate + Export

### Phase 8: Documentation

1. **Embed screenshots** in `specs/wireframes/treatment/workflows.md`:
   - Add new sections for Appointment Patient Tab, Medication, Patient Data, Treatment List & Category, Treatment Plan, Warning Management
   - Include annotation legend (from this plan)
2. **Update wireframe registry** `specs/analysis/wireframe-plan-registry.md`:
   - Add rows for treatment/appointment-patient, treatment/medication, treatment/patient-data, treatment/treatment-core, treatment/warning
3. **Update README** `specs/analysis/treatment/README.md`:
   - Add wireframe plan reference for each subdomain

---

## Dependency Notes

### Appointment Details Patient Tab -- Appointment Integration
- The Patient tab is rendered within the shared Appointment Details drawer (also used by Treatment list and Shift list). The wireframe should show it as a panel component, not a standalone page.
- The `patientDataDlg` location field has conditional mandatory behavior tied to `jobSupport` checkbox (`.council` CSS class). Annotate this with `[cond: .council]`.
- Patient attachments use `PatientDataService.upload` and share the file upload pattern with the standalone PatientData module and Treatment Plan.

### Medication -- Standalone Reference Data
- Medication is a standalone reference data module with no cross-module dependencies.
- The `activeIngredients` field has a typo in the legacy codebase (`activeIngedients`); the i18n key is correctly spelled. Use the correct spelling in the rebuild.
- The `someActionBtn` is dead code -- do NOT include in wireframe.

### Patient Data -- Appointment/Consultation Integration
- PatientData references `appointmentId` and uses shared i18n keys from the consultation and invoiceLine modules (`consultation.booknumber`, `invoiceLine.appointmentId`).
- The file attachment pattern is shared with Appointment Details Patient Tab and Treatment Plan.

### Treatment List & Category -- Shared Appointment Infrastructure
- The Treatment list is a filtered view of the Appointment system (`jobType="TREATMENT"`). It shares `AppointmentService`, `AppointmentDetails`, and all appointment state/assignment logic.
- MonthTable is a shared component also used by Appointment list and Shift list. The wireframe should reference this as a reusable component.
- Treatment Category is fully standalone with no cross-module dependencies.

### Treatment Plan -- Most Complex Module
- Treatment Plan is the most complex module in this batch (and arguably the codebase). It features:
  - The widest grid (17 columns)
  - Two distinct dialog flows (create vs. edit based on `dateStarted` state)
  - An embedded expert week calendar with bidirectional sync
  - Appointment positions collection with soft-delete pattern
  - File attachments with upload
  - Async operations with progress tracking (start, save, storno, cancel, publishNext)
  - 12-state machine with color-coded badges
- The Expert Week Calendar is loaded from `profile/expertWeek.js` and is a shared component (also used by other scheduling flows). Design it as a reusable component.
- Apply Plan (`publishNext`) generates future appointments and tracks progress via the shared `jobStatusDlg` pattern.

### Warning Management -- Consultation Integration
- The `Formatter.warningType` and `i18n.warningType()` functions from Warning Management are imported by consultation review and view details. In the rebuild, expose a shared `WarningTypeBadge` component.
- The legacy spelling `CONSPICIOUS` should be normalized to `CONSPICUOUS` in the new codebase. If reading legacy database values, add a mapping layer.

---

## Hardcoded Strings Inventory

| Module | String | Location | i18n Key Needed |
|:---|:---|:---|:---|
| Medication | `"entryNumber"` | Detail form label | `medication.entryNumber` |
| Medication | `"Action"` | Dead code nav button | -- (omit from rebuild) |
| Patient Data | `"jNumber"` | Grid column + form labels | `patientData.jNumber` |
| Patient Data | `"Datei"` | File table header | `label.file` |
| Patient Data | `"Datei hochladen"` | Upload dialog title | `action.uploadFile` |
| Patient Data | `"JNumber used to get the bookNumber"` | Tooltip | `patientData.jNumber.tooltip` |
| Patient Data | `"for what appointment is the data"` | Tooltip | `patientData.appointmentId.tooltip` |
| Treatment List | `"Tag"` | Filter day placeholder | `label.day` |
| Treatment List | `"Filter"` | Filter panel header | `label.filter` |
| Treatment List | `"Gesendet: "` | Reminder success alert | `treatment.reminder.sent` |
| Treatment List | `"Termine-Therapie-"` | Export filename prefix | N/A (backend) |
| Treatment Plan | `"Therapie starten?"` | Start confirm dialog | `treatment.confirmStart` |
| Treatment Plan | `"Wirklich stornieren?"` | Storno confirm dialog | `treatment.confirmStorno` |
| Treatment Plan | `"Wirklich durch Arzt abbrechen?"` | Cancel confirm dialog | `treatment.confirmCancel` |
| Treatment Plan | `"Datum"` / `"Start"` / `"Ende"` / `"Status"` / `"Bericht"` | Positions table headers | Standard i18n labels |
| Treatment Plan | `"Datei"` / `"Datei hochladen"` | Files table header + upload | `label.file` / `action.uploadFile` |
| Treatment Plan | `"Storno"` / `"Beenden/Abbruch"` | Dialog button labels | `action.storno` / `action.cancelEnd` |
| Treatment Plan | `"Erfolg!"` | Test connection alert | `action.success` |
| Treatment Plan | `"verpflichtent"` (typo) | Force report tooltip | `treatment.forceReport` |
| Treatment Plan | `"Behandelnder Arzt"` | Expert title attribute | `label.treatingDoctor` |
| Treatment Plan | `"Stellen Sie sicher..."` | Minute warning text | `treatment.minuteWarning` |
| Treatment Plan | `"jNumber"` | Column + labels | `patientData.jNumber` |
| Treatment Plan | `"Export"` | Nav button | `action.export` |
| Treatment Plan | `"Es werden fuer die Ausgewaehlten..."` | Apply plan description | `treatment.applyPlan.description` |
| Warning Mgmt | `"Action"` | Dead code nav button | -- (omit from rebuild) |

---

## Shared Patterns

All 6 modules follow established UI patterns:

| Pattern | Used By | Shadcn Components |
|:---|:---|:---|
| Grid + CRUD toolbar | Medication, Patient Data, Treatment Category, Treatment Plan, Warning | `@shadcn/table` (DataTable) + `@shadcn/button` |
| Grid + Detail dialog | Medication, Patient Data, Treatment Category, Warning | `@shadcn/dialog` + form |
| Grid + Detail dialog (XL) | Treatment Plan (create 1100px, edit 1300px) | `@shadcn/dialog` (xl) |
| MonthTable calendar | Treatment List | Custom `MonthTable` component |
| Panel within drawer | Appointment Patient Tab | Panel content within `@shadcn/drawer` |
| Client-side search | All except Treatment List (which uses MonthTable filters) | `@shadcn/input` with search icon |
| File upload + collection | Appointment Patient, Patient Data, Treatment Plan | `@shadcn/input[file]` + custom table |
| Filter panel (Sheet) | Treatment List | `@shadcn/sheet` (side="right") |
| State badges | Treatment Plan (12 states), Warning (4 types) | `@shadcn/badge` with color variants |
| Confirm dialogs | Treatment Plan (storno, cancel) | `@shadcn/alert-dialog` |
| Async job tracking | Treatment Plan (apply plan) | `@shadcn/dialog` + progress indicator |
| Autocomplete / Combobox | Appointment Patient, Treatment Plan | `@shadcn/combobox` |

---

## Wireframe Count Summary

| `.pen` File | Frames | Wireframe IDs |
|:---|:---|:---|
| `appointment-details-patient.pen` | 3 | W20, W20b, W20c |
| `medication.pen` | 2 | W21 |
| `patient-data.pen` | 2 | W22 |
| `treatment-and-category.pen` | 5 | W23, W23b, W23c, W23d |
| `treatment-plan.pen` | 4 | W24, W24b, W24c, W24d |
| `warning-management.pen` | 2 | W25 |
| **Total** | **18 frames** | **16 wireframe IDs** |
