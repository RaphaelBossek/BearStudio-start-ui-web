# Wireframe Plan — Planning Dashboard

> **Self-contained wireframe plan** — expanded from stub for Batch 4 execution.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/planning/dashboard/`

## Prerequisites

1. All analysis documents in `specs/analysis/planning/dashboard/` are complete and reviewed:
   - `02-dashboard-selfservice.md` — self-service sections (context only, not wireframed here)
   - `04-dialogs-planning.md` — end shift, ad-hoc appointment, confirm/decline modals
   - `08-shift-dialog.md` — shift detail + request action dialog
   - `09-calendar-view.md` — FullCalendar weekly view with entity-type events
   - `10-week-view.md` — expert week availability grid
   - `11-month-view.md` — expert month availability grid + holiday dialog
2. Pencil MCP server is available and responsive
3. Data dictionary: `specs/analysis/planning/data-dictionary-planning.md`
4. Review the Pencil style guide for web-app design: `get_guidelines(topic="web-app")`
5. Reference template: `specs/wireframes/interfaces/dashboard/basisweb-wizard.pen` — study with `batch_get(readDepth:3)` on node QMGzX

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN)
- **Module overrides**: `dash/messages.i18n.js`, `appointment/messages.i18n.js`, `profile/messages.i18n.js`

## Findings from Analysis that Affect Wireframes

### Calendar View (W3)
- FullCalendar v4 weekly view with entity-type color coding
- 5 entity types: HOLIDAY, PUBLICHOLIDAY, BIRTHDAY, APPOINTMENT, SHIFT
- APPOINTMENT and SHIFT each have 18 possible state colors
- BIRTHDAY click opens sendMessage dialog; other click handlers disabled or missing
- HSP contrast algorithm for text color on colored backgrounds

### Expert Availability (W4)
- **Week grid**: hours × 7 days, tri-state slots (null/true/false), appointment overlay indicators with popovers
- **Month grid**: days × 6 slots (3 shift + 3 appointment), 4-row header with counters, month lock behavior
- Tri-state cycle: null (outline circle) → true (checkmark) → false (X)
- Bulk toggle: click column header toggles all cells in column, click hour/day label toggles all in row
- Holiday approval dialog embedded in month view

### Shift Dialog (W8)
- Card header with shift name/location/date/customer
- 200px Leaflet map with location marker
- Actions table: jobId, dateStart, dateEnd, request button
- Request action sub-dialog: date/time fields, job title, internal contact with message + phone

### Ad-Hoc Appointment (W10)
- Permission-gated: `APPOINTMENT_ADHOC`
- Location autocomplete, type select (APPOINTMENT/SHIFT/COUNCIL), job autocomplete filtered by type
- Double booking collision handling with force retry

### End Shift (W13a)
- Simple dialog: confirmation text, start/end time inputs
- Called when ending an active shift appointment

## Shadcn UI Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| FullCalendar weekly view | `@fullcalendar/react` v6 + Tailwind | timeGridWeek, custom event rendering |
| Calendar event rendering | Custom `eventContent` prop | Lucide icons + state-colored backgrounds |
| Week grid (hours × days) | Custom `@shadcn/table` | Tri-state cells, sticky header |
| Month grid (days × slots) | Custom `@shadcn/table` | 4-row header, counter badges, month lock |
| Tri-state toggle | Custom component | Circle → Check → X icon cycle |
| Appointment popovers | `@shadcn/popover` or `@shadcn/tooltip` | Time range + title + state label |
| Shift dialog (600px) | `@shadcn/dialog` | Card header + map + actions table |
| Leaflet map | `react-leaflet` or static map | 200px height, location marker |
| Actions table | `@shadcn/table` | Job, start, end, request button per row |
| Request action dialog | `@shadcn/dialog` | Date/time fields, job, internal contact |
| Send message action | `@shadcn/button` with icon | Opens notification compose |
| Phone link | `<a href="tel:">` with icon | Native dialer link |
| Ad-hoc appointment dialog | `@shadcn/dialog` | 3 fields: location, type, job |
| Location autocomplete | `@shadcn/combobox` | `LocationService.autocomplete` |
| Type select | `@shadcn/select` | APPOINTMENT, SHIFT, COUNCIL options |
| Job autocomplete (filtered) | `@shadcn/combobox` | Filtered by selected type |
| End shift dialog | `@shadcn/alert-dialog` | Confirmation + time adjustment |
| Time inputs | `@shadcn/input` type="time" | Start/end with clock icons |
| Confirm/decline modals | `@shadcn/alert-dialog` | List of selected appointments |
| Counter badges | `@shadcn/badge` | cur/max format in header cells |
| Month locked alert | `@shadcn/alert` variant="destructive" | Banner when month is blocked |
| Holiday dialog | `@shadcn/dialog` | Date range picker, confirmation text |
| Date pickers | `@shadcn/date-picker` (Popover + Calendar) | European format dd.mm.yyyy |
| Year/month navigation | `@shadcn/input` type="number" + `@shadcn/select` | Month grid header controls |
| Save/reload toolbar | `@shadcn/button` group | Save, Holiday, Reload actions |
| Week type select | `@shadcn/select` | Currently only TREATMENT option |
| State color badges | `@shadcn/badge` with custom styles | HSP contrast for text color |

## Wireframe Inventory

| # | ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|:---|
| 1 | W3 | `calendar.pen` | 09 | Medium | FullCalendar weekly view with sample events per entity type, state-to-color legend, toolbar |
| 2 | W4 | `expert-availability.pen` | 10, 11 | High | Two frames: (a) week grid — hours × 7 days, tri-state slots, appointment popovers; (b) month grid — days × 6 slots, 4-row header with counters, month lock, holiday dialog |
| 3 | W8 | `shift-dialog.pen` | 08 | Medium | Two frames: (a) shift detail — card header, map, actions table; (b) request action — date/time, job, internal contact |
| 4 | W10 | `adhoc-appointment.pen` | 04 | Low | Single dialog: location autocomplete, type select, job autocomplete. [PERM: APPOINTMENT_ADHOC] |
| 5 | W13a | `end-shift.pen` | 04 | Low | End shift frame: confirmation text, start/end time inputs |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/planning/dashboard/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **List registry**: `Shadcn_list_items_in_registries(["@shadcn"])` to verify component availability
5. **Design** using `batch_design()`:

### W3 — Calendar View
- Frame width: **1440px** (full page view)
- FullCalendar timeGridWeek layout: 7 day columns with time slots
- Sample events colored by entity type:
  - HOLIDAY: blue (#2a67aa) with `island-tropical` icon
  - PUBLICHOLIDAY: blue (#2a67aa) with `calendar-times` icon
  - BIRTHDAY: light blue (#cce5ff) with `birthday-cake` icon
  - APPOINTMENT: various state colors with `hourglass` icon (show 3-4 different states)
  - SHIFT: various state colors with `business-time` icon
- Calendar toolbar: "Week" button | Title (date range) | Navigation arrows
- Side legend card: entity type icons + sample colors
- Note annotation: BIRTHDAY click → send message dialog; APPOINTMENT click → not wired in legacy

### W4 — Expert Availability (2 frames)

**Frame A — Week Grid** (1440px)
- Sticky navbar: Save | Reload buttons
- Sticky header row: Week type select (TREATMENT) | Mon | Tue | Wed | Thu | Fri | Sat | Sun
- Body rows: one per hour (8:00–20:00), 7 day columns
- Each cell: tri-state icon (circle/check/X) + appointment indicator overlays
- Appointment indicators: type icon (user-md/user-injured/user-friends) with state color
- Popover annotation: "@08:00-12:00 Dr. Smith Confirmed"
- Note: click column header → toggle all in column; click hour label → toggle all in row

**Frame B — Month Grid** (1440px)
- Sticky navbar: Save | Holiday | Reload buttons
- Month locked alert banner (destructive, hidden by default)
- 4-row header:
  - Row 1: Year input | — | "Shift" (colspan 3) | "Appointment" (colspan 3)
  - Row 2: Month select | — | Morning | Afternoon | Night | Morning | Afternoon | Treatment
  - Row 3: "Max services" (rowspan 2) | "Weekday" | cur/max badges × 5 columns | —
  - Row 4: (rowspan cont.) | "Weekend" | cur/max badges × 3 + "Max before/after" (colspan 2) | —
- Body rows: one per day (1–31), columns: day number | weekday name | 6 dayslot cells
- Each dayslot: tri-state toggle (left 49%) + appointment indicators (right 49%)
- Holiday dialog overlay: date range picker, confirmation text

### W8 — Shift Dialog (2 frames)

**Frame A — Shift Detail** (600px dialog)
- Card header: shift name, location name, start date, (customer name)
- Map area: 200px height, location marker, zoom 20
- Actions table: Job ID | Start Date | End Date | Request button
- Note: Request button opens Frame B

**Frame B — Request Action** (600px dialog)
- Row 1: Date [RO] | Start time [RO] | End time [RO]
- Row 2: Job title [RO] | Internal contact (displayName + message icon + phone link)
- Note annotation: OK callback → ActionService.apply, shows success message

### W10 — Ad-Hoc Appointment (600px dialog)
- Title: "Create Ad-hoc Appointment"
- Location autocomplete* (compass icon)
- Type select* (briefcase icon): Appointment | Shift | Council
- Job autocomplete* (graduation-cap icon): filtered by type, enabled after type selected
- [PERM: APPOINTMENT_ADHOC] annotation
- Note: double booking → confirm dialog → retry with force=true
- Save / Cancel footer

### W13a — End Shift (600px dialog)
- Title: "Shift" (with business-time icon)
- Confirmation text: "Should the operation really be ended?"
- Instruction text (muted): "Please correct the times..."
- Row: Start time* (play icon) | End time* (stop icon)
- Save / Cancel footer

6. **Validate** with `get_screenshot()`
7. **Export** to PNG in `specs/wireframes/planning/dashboard/`
8. **Embed screenshots** in `specs/wireframes/planning/workflows.md`
9. **Log completion** in `specs/analysis/wireframes-index.md`

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
