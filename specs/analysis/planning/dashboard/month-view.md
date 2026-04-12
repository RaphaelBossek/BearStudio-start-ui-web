---
title: 'Month View'
---

# 11 - Expert Month View & Holiday Approval Dialog

## Page Navigation Diagram

```
monthView.htmlm
  |
  |-- [Save] button (saveExpertDaysMenuBtn)
  |       triggers "saveMonth" on table, then reloads after 500ms
  |
  |-- [Holiday] button (setHolidayMenuBtn, icon: umbrella-beach)
  |       opens #holidayApprovalDetails dialog
  |       |
  |       v
  |   holidayApprovalDetails dialog
  |       |-- on OK: ExpertDaysService.setHoliday(-1, start, until)
  |       |-- then reloads month table
  |
  |-- [Reload] button (reloadExpertDaysMenuBtn, icon: sync)
  |       triggers "load" on table
  |
  |-- Month table (#expertdaysMonthTable)
  |       data-service="InfoService", data-method="getMonth"
  |       rows = days of month, columns = shift/appointment slots
  |       |
  |       |-- on doneLoading: applies month lock logic
  |       |-- each dayslot cell: tri-state toggle + appointment popover indicators
```

---

## 1. HTMLM Header (Template Includes)

| Field                | Method     | Template Path                              |
|----------------------|------------|--------------------------------------------|
| `actionDetailsView`  | `template` | `../dash/actionDetailsView.html`           |
| `appointmentDetails` | `template` | `../appointment/details.html`              |
| `siteloader`         | `template` | `../_include/siteloader.mustache`          |
| `navBar`             | `template` | `../_include/navbar.mustache`              |
| `sendMessage`        | `template` | `../notification/sendMessage.mustache`     |

### Nav Variable Configuration

| Property  | Value   |
|-----------|---------|
| `filter`  | `false` |

### Nav Buttons

| Button Name      | ID                          | Icon              |
|------------------|-----------------------------|--------------------|
| `action.save`    | `saveExpertDaysMenuBtn`     | `save`             |
| `holiday`        | `setHolidayMenuBtn`         | `umbrella-beach`   |
| `action.reload`  | `reloadExpertDaysMenuBtn`   | `sync`             |

### Script Includes

| Path                              | Purpose                    |
|-----------------------------------|----------------------------|
| `/dash/messages.i18n.js`          | Dashboard i18n messages    |
| `/appointment/messages.i18n.js`   | Appointment i18n messages  |
| `/profile/messages.i18n.js`       | Profile i18n messages      |
| `/profile/expertDays.js`          | Expert days shared logic   |
| `/dash/monthView.js`             | Month view controller      |

---

## 2. Page Layout

### Sticky Navbar

The navbar is rendered at the top inside a sticky container (`position: sticky; top: 0px`).

### Month Locked Alert

| Element ID     | Type            | CSS Class          | Default State |
|----------------|-----------------|---------------------|---------------|
| `#monthLocked` | `<div>` alert   | `alert alert-danger` | `display:none` |

Displays the text: "This month is already in planning and blocked..." when the month is locked.

---

## 3. Month Table (`#expertdaysMonthTable`)

### Table Attributes

| Attribute        | Value                                      |
|------------------|--------------------------------------------|
| `id`             | `expertdaysMonthTable`                     |
| `class`          | `table table-bordered justify-content-center siteLoader` |
| `data-service`   | `InfoService`                              |
| `data-method`    | `getMonth`                                 |

### Sticky Header

The `<thead>` uses `position: sticky; top: 50px; background: white;` so it stays visible below the navbar when scrolling.

---

### 3.1. Header Row 1 — Year Input & Category Headers

| Column(s)    | Content                                                             |
|--------------|---------------------------------------------------------------------|
| Cols 1-2     | `<input type="number" id="expertdaysYear" value="2022">` (width: 200px, class: `number form-control`) |
| Cols 3-5     | "Shift" (colspan=3, centered)                                       |
| Cols 6-8     | "Appointment" (colspan=3, centered)                                 |

### 3.2. Header Row 2 — Month Select & Slot Column Headers

| Column(s)    | Content                                                             |
|--------------|---------------------------------------------------------------------|
| Cols 1-2     | `<select id="expertdaysMonth">` with options value 1-12 (January through December), width: 200px, class: `form-select` |
| Col 3        | "Morning" — class: `slotchange clickable`, data-slot: `morning`     |
| Col 4        | "Afternoon" — class: `slotchange clickable`, data-slot: `afternoon` |
| Col 5        | "Night" — class: `slotchange clickable`, data-slot: `night`         |
| Col 6        | "Morning" — class: `slotchange clickable`, data-slot: `morningAppointment` |
| Col 7        | "Afternoon" — class: `slotchange clickable`, data-slot: `afternoonAppointment` |
| Col 8        | "Treatment" — class: `slotchange clickable`, data-slot: `treatmentAppointment` |

All 6 slot column headers have classes `slotchange clickable`, meaning clicking a column header toggles the entire column for all days.

### 3.3. Header Row 3 — Weekday Counters

| Column(s) | Content                                                                              |
|------------|--------------------------------------------------------------------------------------|
| Col 1      | "Maximum number of services" (rowspan=2, right-aligned, vertically centered)         |
| Col 2      | "Weekday" (right-aligned, vertically centered)                                       |
| Col 3      | Counter badge: `curWeekDayMorning` / `maxWeekDayMorning`                             |
| Col 4      | Counter badge: `curWeekDayAfternoon` / `maxWeekDayAfternoon`                         |
| Col 5      | Counter badge: `curWeekDayNight` / `maxWeekDayNight`                                 |
| Col 6      | Counter badge: `curWeekDayAppointmentMorning` / `maxWeekDayAppointmentMorning`       |
| Col 7      | Counter badge: `curWeekDayAppointmentAfternoon` / `maxWeekDayAppointmentAfternoon`   |
| Col 8      | Empty (treatment column — ignored for weekday counters)                               |

Each counter is displayed as `<span id="cur..."></span>/<span id="max..."></span>` inside an `input-group-text` span. Format: `current/maximum`.

### 3.4. Header Row 4 — Weekend Counters

| Column(s) | Content                                                                              |
|------------|--------------------------------------------------------------------------------------|
| Col 1      | _(part of rowspan from Row 3)_                                                       |
| Col 2      | "Weekend" (right-aligned, vertically centered)                                       |
| Col 3      | Counter badge: `curWeekEndMorning` / `maxWeekEndMorning`                             |
| Col 4      | Counter badge: `curWeekEndAfternoon` / `maxWeekEndAfternoon`                         |
| Col 5      | Counter badge: `curWeekEndNight` / `maxWeekEndNight`                                 |
| Cols 6-7   | "Max. Number before/after" (colspan=2, centered, top-aligned)                        |
| Col 8      | Empty                                                                                |

### Counter Summary Table

| Counter ID                            | Row     | Slot Column           |
|---------------------------------------|---------|-----------------------|
| `curWeekDayMorning` / `maxWeekDayMorning`                 | Weekday | Morning (Shift)       |
| `curWeekDayAfternoon` / `maxWeekDayAfternoon`             | Weekday | Afternoon (Shift)     |
| `curWeekDayNight` / `maxWeekDayNight`                     | Weekday | Night (Shift)         |
| `curWeekDayAppointmentMorning` / `maxWeekDayAppointmentMorning` | Weekday | Morning (Appointment) |
| `curWeekDayAppointmentAfternoon` / `maxWeekDayAppointmentAfternoon` | Weekday | Afternoon (Appointment) |
| `curWeekEndMorning` / `maxWeekEndMorning`                 | Weekend | Morning (Shift)       |
| `curWeekEndAfternoon` / `maxWeekEndAfternoon`             | Weekend | Afternoon (Shift)     |
| `curWeekEndNight` / `maxWeekEndNight`                     | Weekend | Night (Shift)         |

Note: Weekend appointment morning/afternoon counters are **not present** — replaced by the "Max. Number before/after" label. Treatment column has no counters in either row.

---

### 3.5. Body Row Template (Repeated per Day)

Each row represents one day of the month with 8 columns:

| # | CSS Class    | Content                                     | `data-slot`              |
|---|--------------|---------------------------------------------|--------------------------|
| 1 | `day clickable`       | Day number                           | —                        |
| 2 | `dayOfWeek clickable` | Day of week name                     | —                        |
| 3 | `dayslot`    | Tri-state toggle + appointment indicators    | `morning`                |
| 4 | `dayslot`    | Tri-state toggle + appointment indicators    | `afternoon`              |
| 5 | `dayslot`    | Tri-state toggle + appointment indicators    | `night`                  |
| 6 | `dayslot`    | Tri-state toggle + appointment indicators    | `morningAppointment`     |
| 7 | `dayslot`    | Tri-state toggle + appointment indicators    | `afternoonAppointment`   |
| 8 | `dayslot`    | Tri-state toggle + appointment indicators    | `treatmentAppointment`   |

### 3.6. Dayslot Cell Structure

Each dayslot `<td>` contains two child elements side by side (each 49% width):

```
<td class="dayslot" data-slot="...">
  <div class="changeday">              <!-- 49% width, inline-block -->
    <span class="statusNull"><i class="fal fa-circle"></i></span>
    <span class="statusTrue"><i class="fa fa-check"></i></span>
    <span class="statusFalse"><i class="fa fa-times"></i></span>
  </div>
  <span class="ap">                    <!-- 49% width, text-align center -->
    <!-- appointment indicator icons injected here by JS -->
  </span>
</td>
```

### Tri-State Status Icons

| State   | CSS Class      | Icon                | Meaning           |
|---------|----------------|---------------------|--------------------|
| Null    | `statusNull`   | `fal fa-circle`     | Unset / no preference |
| True    | `statusTrue`   | `fa fa-check`       | Available          |
| False   | `statusFalse`  | `fa fa-times`       | Not available      |

Only one of the three status spans is visible at a time (toggled by the shared expertDays.js logic, same pattern as weekView).

---

## 4. Month View JavaScript Behavior (`monthView.js`)

### Initialization

- Guard: `Core.hasLoaded("monthViewLoaded")` prevents double-init.
- Calls `initGenericLoader()` for siteLoader-based table data loading.
- Triggers initial load: `$("#expertdaysMonthTable").trigger("load")`.

### Navbar Button Handlers

| Button                    | Action                                                              |
|---------------------------|---------------------------------------------------------------------|
| `#saveExpertDaysMenuBtn`  | Triggers `"saveMonth"` on table, then triggers `"load"` after 500ms delay |
| `#reloadExpertDaysMenuBtn`| Triggers `"load"` on table                                         |
| `#setHolidayMenuBtn`      | Opens holiday dialog (see Section 5)                                |

### Keyboard Prevention

All `.dayslot`, `.dayOfWeek`, and `.day` cells have `keydown`, `paste`, and `drop` events prevented — no direct keyboard input allowed. Interaction is click-only (tri-state cycling).

### Fill Day Data (`fillDayData`)

Stored on `$("#expertdaysMonthTable").data().fillDayData`. Called per row during data population.

**Logic:**
1. Clears any existing `.assigned` elements from the row.
2. If `data.appointments` is absent, returns early.
3. Filters appointments to those matching `info.day`.
4. For each matching appointment:
   - Determines the target slot name from `ap.time.toLowerCase()`:
     - If `ap.type !== "SHIFT"` (i.e., COUNCIL or APPOINTMENT), appends `"Appointment"` suffix to slot name.
     - If `ap.type === "SHIFT"`, uses the raw time slot name.
   - Finds the matching `<td class="dayslot" data-slot="...">` in the current row.
   - Selects an icon based on appointment type (see table below).
   - Gets state color via `i18n.assignedStateIcons(ap.state)`.
   - Computes time strings from `ap.start` and `ap.end` using `Core.asDateTime()` and Luxon's `toISOTime()`, formatted as `HH:MM`.
   - Creates a popover-enabled `<span class="assigned">` with content: `@HH:MM-HH:MM title state_label`.
   - Appends the icon element to the `.ap` span in the dayslot cell.
   - Initializes a Bootstrap Popover on each icon element (trigger: hover/focus).

### Appointment Type Icons

| `ap.type`  | Icon Class         | Meaning              |
|------------|--------------------|----------------------|
| `SHIFT`    | `fa-user-injured`  | Shift assignment     |
| `COUNCIL`  | `fa-user-friends`  | Council appointment  |
| _(default)_| `fa-user-md`       | Standard appointment |

### Appointment Slot Routing

| `ap.type` | `ap.time` (lowercase) | Target `data-slot`         |
|-----------|-----------------------|----------------------------|
| `SHIFT`   | `morning`             | `morning`                  |
| `SHIFT`   | `afternoon`           | `afternoon`                |
| `SHIFT`   | `night`               | `night`                    |
| Non-SHIFT | `morning`             | `morningAppointment`       |
| Non-SHIFT | `afternoon`           | `afternoonAppointment`     |
| Non-SHIFT | `treatment`           | `treatmentAppointment`     |

### Popover Content Format

```
@{startTime}-{endTime} {title} {state_label}
```

Example: `@08:00-12:00 Dr. Smith Confirmed`

---

## 5. Month Lock Behavior (`doneLoading` handler)

Triggered after table data load completes. Reads `data.locked` from the table's pojo.

### When `data.locked === true`

| Action                                                        |
|---------------------------------------------------------------|
| Shows `#monthLocked` alert (danger banner)                    |
| Finds all `td.clickable` and `td.dayslot` cells              |
| Adds CSS class `read-only`                                    |
| Sets `pointer-events: none` (disables all click interaction)  |
| Sets `contenteditable="false"`                                |
| Sets `opacity: 0.25` (visual dimming)                         |

### When `data.locked === false`

| Action                                                        |
|---------------------------------------------------------------|
| Hides `#monthLocked` alert                                    |
| Removes CSS class `read-only`                                 |
| Restores `pointer-events: auto`                               |
| Restores `contenteditable="true"`                             |
| Restores `opacity: 1`                                         |

---

## 6. Holiday Approval Dialog (`#holidayApprovalDetails`)

### Visualization Attributes

| Attribute    | Value                          |
|--------------|--------------------------------|
| `data-icon`  | `far fa-island-tropical`       |
| `data-color` | `bg-color-staff`               |
| `title`      | `{{i18n.holiday.request}}` ("Report absence") |
| Default state| `display: none`                |

### Dialog Layout

```
Row (Bootstrap grid):
  col-sm-6: Description text — "Mark the following days as absence/holiday:"
  col-sm-3: Start date input
  col-sm-3: End date input
Bold alert text: "I am not available for assignments during this period!"
```

### Form Fields

| Field           | Name          | CSS Classes                    | Placeholder          | Type      |
|-----------------|---------------|--------------------------------|----------------------|-----------|
| Start date      | `data.start`  | `form-control mandatory date`  | "Start"              | Date (jQuery datepicker) |
| End date        | `data.until`  | `form-control mandatory date`  | "End"                | Date (jQuery datepicker) |

### Datepicker Configuration

| Property       | Value                                                                                     |
|----------------|-------------------------------------------------------------------------------------------|
| `defaultDate`  | Derived from current month table context: `new Date(year, month-1, 1)` from pojo.month (format: YYYYMM as integer, e.g., 202203) |
| `dateFormat`   | `dd.mm.yy` (European format: day.month.year)                                              |
| Lifecycle      | `.datepicker("destroy")` called before re-initialization on each dialog open              |

### Save Behavior

On dialog OK callback:
1. Calls `ExpertDaysService.setHoliday(-1, data.start, data.until)` — the `-1` parameter indicates the current user (self-service).
2. On success, triggers `"load"` on `#expertdaysMonthTable` to refresh data.

---

## 7. Special Components

### siteLoader

Generic data loading mechanism initialized via `initGenericLoader()`. Binds to tables with `data-service` and `data-method` attributes. Responds to `"load"` and `"saveMonth"` trigger events. Emits `"doneLoading"` when data fetch completes.

### jQuery Datepicker

Used in the holiday dialog for date range selection. Configured with European date format (`dd.mm.yy`). Default date is derived from the currently displayed month/year in the table.

### Bootstrap Popover

Used on appointment indicator icons within dayslot cells. Trigger: `hover focus`. Content displays time range, title, and state label.

### jsForm Integration

The table uses jsForm for data binding:
- `$("#expertdaysMonthTable").jsForm("get").data().pojo` — retrieves the current data model.
- `pojo.month` — integer encoding of current month (format: YYYYMM, e.g., 202203 for March 2022).
- `pojo.locked` — boolean indicating whether the month is locked for editing.

---

## 8. CSS Rules (Inline)

| Selector       | Property          | Value           | Purpose                                  |
|----------------|-------------------|-----------------|------------------------------------------|
| `.changeday`   | `width`           | `49%`           | Left half of dayslot cell for tri-state  |
| `.changeday`   | `display`         | `inline-block`  | Side-by-side layout with `.ap`           |
| `.dayslot .ap` | `width`           | `49%`           | Right half of dayslot cell for appointments |
| `.dayslot .ap` | `text-align`      | `center`        | Center appointment icons                 |

---

## 9. Translation Table

| i18n Key                          | English Translation                                            |
|-----------------------------------|----------------------------------------------------------------|
| `shift`                           | Shift                                                          |
| `appointment`                     | Appointment                                                    |
| `Treatment`                       | Treatment                                                      |
| `ExpertDays.morning`              | Morning                                                        |
| `ExpertDays.afternoon`            | Afternoon                                                      |
| `ExpertDays.night`                | Night                                                          |
| `ExpertDays.weekday`              | Weekday                                                        |
| `ExpertDays.weekend`              | Weekend                                                        |
| `Month.JAN`                       | January                                                        |
| `Month.FEB`                       | February                                                       |
| `Month.MAR`                       | March                                                          |
| `Month.APR`                       | April                                                          |
| `Month.MAY`                       | May                                                            |
| `Month.JUN`                       | June                                                           |
| `Month.JUL`                       | July                                                           |
| `Month.AUG`                       | August                                                         |
| `Month.SEP`                       | September                                                      |
| `Month.OCT`                       | October                                                        |
| `Month.NOV`                       | November                                                       |
| `Month.DEC`                       | December                                                       |
| `monthView.numberOfServices`      | Maximum number of services                                     |
| `monthView.maxNumberBeforeAfter`  | Max. Number before/after                                       |
| `monthClose.alert`                | This month is already in planning and blocked...               |
| `holiday.request`                 | Report absence                                                 |
| `holiday.pick.dates`              | Mark the following days as absence/holiday:                    |
| `holiday.start`                   | Start                                                          |
| `holiday.until`                   | End                                                            |
| `holiday.alert`                   | I am not available for assignments during this period!         |
| `action.save`                     | Save                                                           |
| `action.reload`                   | Reload                                                         |
| `action_state_{state}`            | _(dynamic state label, resolved via `i18n["action_state_" + ap.state]`)_ |

---

## 10. Data Flow Summary

```
Page Load
  |
  v
initGenericLoader() -- binds siteLoader to #expertdaysMonthTable
  |
  v
trigger("load") --> InfoService.getMonth(year, month)
  |
  v
Table populated: rows = days, fillDayData() called per row
  |
  v
doneLoading event --> check data.locked --> enable/disable cells
  |
  v
User interactions:
  - Click dayslot .changeday  --> cycle tri-state (null -> true -> false -> null)
  - Click .day / .dayOfWeek   --> row-level interaction (same as weekView)
  - Click column header (.slotchange) --> toggle entire column
  - Click [Save]              --> saveMonth trigger, then reload
  - Click [Holiday]           --> open holiday dialog
  - Click [Reload]            --> reload data
```

---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Includes** | `{{> appointmentDetails}}` | [Appointment Details Scheduling](../../planning/appointment/appointment-details-scheduling.md) | Appointment detail view in month dashboard |
| include | **Includes** | `{{> shiftDlg}}` | [Shift Dialog](shift-dialog.md) | Shift detail dialog in month dashboard |
| script | **Loads** | `/profile/expertDays.js` | [Profile Expert Availability](../../user-management/profile/profile-expert-availability.md) | Month-level expert availability grid logic for `#expertdaysMonthTable` |
