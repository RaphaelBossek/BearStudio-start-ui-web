---
title: 'Appointment Plan'
---

# Appointment Support Modules: AppointmentPlan, CdrCall, CdrCallAssignment

> **Source**: `~/src/vc/videoclinic-prod/web/src/main/webapp/`
> **Modules analyzed**: `appointmentPlan/` (5 files, ~206 lines template + 125 lines JS + 4 lines i18n), `CdrCall/` (3 files, ~237 lines template + 175 lines JS + 18 lines i18n), `CdrCallAssignment/` (3 files, ~110 lines template + 60 lines JS + 1 line i18n)
> **Date**: 2026-03-22

---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Includes** | `{{> closeMonth}}` | [Close Month Dialog](../../appointment-support/close-month.md) | Shared month close/reopen dialog |
| include | **Included by** | `{{> closeMonth}}` | [Shift Plan](../../shift/shift-and-plan.md) | Shift plan also uses the same closeMonth partial |
| include | **Includes** | `{{> jobStatusDlg}}` | [Cdr Call List](../../appointment-support/cdr-call.md) | Job status monitor for publishNext/export polling |

### Service Calls

| Service | Method | Parameters | Dialog / Context |
|---------|--------|------------|------------------|
| `PlanCollisionService` | `getDoctorAppointmentCollision` | `[data]` | `#detailDlg` - collision warning on save |
| `JobService` | `autocompleteType` | `[query, filter]` | `#detailDlg` - job area autocomplete (filter: APPOINTMENT) |
| `UserService` | `findDoctor` | `[query]` | `#detailDlg` - doctor autocomplete |
| `LocationService` | `autocomplete` | `[query]` | `#detailDlg` - location autocomplete |
| `ClosedMonthService` | `closeForExpert` | `[year, month]` | `#closeMonthDlg` - close month for experts |
| `AppointmentPlanService` | `publishNext` | `[date]` | `#selectNextDlg` - generate appointments from plan |
| `AppointmentPlanService` | `finishStatus` | `[id]` | `#jobStatusDlg` - poll job completion |
| `UserService` | `saveSetting` | `[key, value]` | Grid column settings persistence |

### Event Flows

| Type | Direction | Event | Linked Document | Condition |
|------|-----------|-------|-----------------|----------|
| event | **Incoming** | `publishNext` job done | [Shift Plan](../../shift/shift-and-plan.md) | Shift plan uses same `publishNext` + jobStatus pattern |

---

## 1. AppointmentPlan Module

### 1.1 Overview

Manages recurring appointment plan templates. Each plan defines a weekly/monthly schedule slot (day of week, time range, doctor, location, job area). Plans are used to auto-generate concrete appointments via `publishNext`. The module also hosts the shared **Close Month** dialog.

- **Service**: `AppointmentPlanService`
- **CRUD Methods**: `get`, `getAll`, `save`, `delete` (via `Core.initCrud`)
- **Additional Services**: `PlanCollisionService.getDoctorAppointmentCollision`, `JobService.autocompleteType`, `UserService.findDoctor`, `LocationService.autocomplete`

### 1.2 Grid Columns

| # | Field | Display Name | Sortable | Width | Formatter | Notes |
|---|-------|-------------|----------|-------|-----------|-------|
| 1 | `id` | "id" | Yes | 40 | (none) | |
| 2 | `job` | `i18n.appointmentPlan.area` | Yes | 220 | `Formatter.code` | Displays job code |
| 3 | `day` | `i18n.calendar.day` | Yes | 80 | `Formatter.weekday` | Weekday enum |
| 4 | `scheduling` | "Plan" (HARDCODED) | Yes | 90 | `options` (enum dropdown) | Uses `WeekScheduling` enum options |
| 5 | `timeStart` | "Start" (HARDCODED) | Yes | 60 | `Formatter.onlyTime` | |
| 6 | `timeEnd` | `i18n.appointmentPlan.end` | Yes | 60 | `Formatter.onlyTime` | |
| 7 | `doctor` | `i18n.user.doctor` | Yes | 180 | `Formatter.name` | Doctor display name |
| 8 | `location` | `i18n.location` | Yes | 150 | `Formatter.name` | Location name |
| 9 | `location` | `i18n.appointmentPlan.customer` | Yes | 380 | `Formatter.locationCustomer` | Same field, different formatter; `data-id="customer"` |
| 10 | `endDate` | `i18n.appointmentPlan.endDate` | Yes | 80 | `Formatter.date` | |

### 1.3 Detail Form Elements

| # | Field Name | Type | CSS Classes | Mandatory | Notes |
|---|-----------|------|-------------|-----------|-------|
| 1 | `data.day` | `<select>` | `mandatory form-control` | Yes | Options: MO, TU, WE, TH, FR, SA, SU, HO (i18n `WeekDay.*`) |
| 2 | `data.job` | `<input>` autocomplete | `form-control object mandatory autoselect` | Yes | Service: `JobService.autocompleteType`, filter: `"APPOINTMENT"`, display: `code` |
| 3 | `data.lastDate` | `<input>` date | `form-control date mandatory` | Yes | Title (DE): "Ab dem Tag nach diesem wird nach dem Wochentag gesucht" (HARDCODED). Placeholder: `i18n.appointment.start` |
| 4 | `data.endDate` | `<input>` date | `form-control date` | No | Placeholder: `i18n.appointmentPlan.end` |
| 5 | `data.start` | `<input>` time | `form-control mandatory time` | Yes | Start time (clockpicker) |
| 6 | `data.end` | `<input>` time | `form-control mandatory time` | Yes | End time (clockpicker) |
| 7 | `data.schedulingMulitplier` | `<input>` number | `form-control mandatory number` | Yes | NOTE: typo "Mulitplier" in original |
| 8 | `data.scheduling` | `<select>` | `form-select mandatory` | Yes | Options: WEEKLY, FIRSTOFMONTH, XOFMONTH, LASTOFMONTH (i18n `WeekScheduling.*`) |
| 9 | `data.nextStart` | display-only `<i class="field date">` | (read-only field) | N/A | Shows next computed start date |
| 10 | `data.doctor` | `<input>` autocomplete | `form-control object autoselect` | No | Service: `UserService.findDoctor`, display: `displayName`. Has clear button. |
| 11 | `data.expertOnly` | `<input>` checkbox | `boolean` | No | Label: `i18n.appointment.expertOnly`. When checked, hides and clears location field. |
| 12 | `data.location` | `<input>` autocomplete | `form-control object mandatory autoselect` | Yes (conditional) | Service: `LocationService.autocomplete`, display: `name`. Hidden when expertOnly is checked. |
| 13 | `data.comment` | `<textarea>` | `form-control` | No | Placeholder: `i18n.label.comment` |
| 14 | `#collisionPlan` | `<span>` display area | (read-only) | N/A | Shows collision warnings from `PlanCollisionService` |

**Default values on create**: `scheduling: "WEEKLY"`, `lastDate: new Date()`, `minPatients: 1`

### 1.4 Filter Panel (Offcanvas)

| # | Field Name | Type | Notes |
|---|-----------|------|-------|
| 1 | `data.endDate[0]` | `<input>` date (array index 0) | Range start for endDate filter |
| 2 | `data.endDate[1]` | `<input>` date (array index 1) | Range end for endDate filter |
| 3 | `data.job` | `<input>` autocomplete | Service: `JobService.autocomplete`, display: `code` |
| 4 | maxResults | `<select>` | Options: 100 (default), 150, 200, 300, 500, >500 (-1) |

### 1.5 Client-Side Search

Filters grid rows by: `job.code`, `i18n.day[item.day]` (localized weekday), `doctor.displayName`.

### 1.6 Collision Detection

On detail dialog `ok` event, calls `PlanCollisionService.getDoctorAppointmentCollision(data)`. If a collision is found, displays: `i18n.planned_appointment_collision + " " + collision.location.name + " " + collision.day + " " + collision.start + " - " + collision.end`. Cleared on `cancel`.

### 1.7 Select Next Dialog (Publish Plan)

- **Dialog ID**: `#selectNextDlg`
- **Title**: `i18n.end.date`
- **Icon**: `fas fa-calendar-week`, color: `bg-color-shift`
- **Content**: Text `i18n.appointment` + `i18n.appointmentPlan.generateUntil` + ":"
- **Field**: `data.date` (date input)
- **Action**: Calls `AppointmentPlanService.publishNext(date)`, then opens `jobStatusDlg` with returned jobId
- **On job done**: Calls `AppointmentPlanService.finishStatus(id)`

### 1.8 Click Actions (Nav Buttons)

| Action ID | Icon | i18n Name Key | English | Notes |
|-----------|------|--------------|---------|-------|
| `addMenuBtn` | `plus-square` | `action.add` | Add | Standard CRUD |
| `editMenuBtn` | `pencil` | `action.change` | Change | Initially disabled |
| `deleteMenuBtn` | `trash` | `action.delete` | Delete | Initially disabled |
| `createNextBtn` | `calendar-week` | `action.applyPlan` | Apply Plan / Create Next | Opens `#selectNextDlg`, triggers `publishNext` |
| `closeMonthButton` | `calendar-exclamation` | `action.monthSummary` | Month Summary | Opens shared `#closeMonthDlg` |

---

## 2. Close Month Dialog (SHARED COMPONENT)

### 2.1 Overview

**Source file**: `appointmentPlan/closeMonth.html` + `appointmentPlan/closeMonth.js`

This is a **shared dialog** included via Mustache template by:
- `appointmentPlan/index.htmlm` (via `{{> closeMonth}}`)
- `shiftPlan/index.htmlm` (via `{{> closeMonth}}`, same template path `../appointmentPlan/closeMonth.html`)
- `appointmentAdmin/index.htmlm` has a separate close-month implementation (different button ID `closeMonthBtn`, different logic)

### 2.2 Dialog Properties

| Property | Value |
|----------|-------|
| Dialog ID | `#closeMonthDlg` |
| Title | `i18n.month.summary.title` |
| Width | 220 |
| Icon | `fas fa-calendar-exclamation` |
| Target | `modal` |
| Color | `bg-color-appointment` |

### 2.3 Form Elements

| # | Field Name | Type | CSS Classes | Notes |
|---|-----------|------|-------------|-------|
| 1 | `data.year` | `<input>` number | `form-control number` | Label/placeholder: `i18n.year` |
| 2 | `data.month` | `<select>` | `form-select number` | Options: empty + 1-12 (i18n `Month.JAN` through `Month.DEC`) |

### 2.4 Prompt Text

**HARDCODED German**: "Welches Monat soll fur Experten geschlossen werden?" (Which month should be closed for experts?)

**English translation**: "Which month should be closed for experts?"

### 2.5 Backend Call

`ClosedMonthService.closeForExpert(year, month)` -- on success shows `alert("Done")` (HARDCODED).

### 2.6 Trigger Button

Both `appointmentPlan` and `shiftPlan` use the same button ID `closeMonthButton` with icon `calendar-exclamation`. The JS binds `$("#closeMonthButton").on("click", ...)`.

### 2.7 Rebuild Notes

- Must be extracted as a standalone reusable dialog component in the new UI
- The hardcoded German prompt needs an i18n key
- The `alert("Done")` should become a toast notification
- Button ID coupling (`closeMonthButton`) must be replaced with proper React props/callbacks

---

## Translation Table (AppointmentPlan + Close Month)

### i18n Key References (Used in Templates)

| Text Reference | Context | German (Inferred) | English | Notes |
|---------------|---------|-------------------|---------|-------|
| `i18n.appointmentPlan` | Detail dialog title | Terminplan | Appointment Plan | |
| `i18n.appointmentPlan.area` | Grid column | Bereich | Area | |
| `i18n.appointmentPlan.end` | Grid column + form | Ende | End | |
| `i18n.appointmentPlan.endDate` | Grid column | Enddatum | End Date | |
| `i18n.appointmentPlan.customer` | Grid column | Kunde | Customer | |
| `i18n.appointmentPlan.generateUntil` | Select-next dialog | generieren bis | generate until | |
| `i18n.appointmentPlan.collision` | Collision warning | Kollision mit geplantem Termin | Planned appointment collision | From `messages.i18n.js` |
| `i18n.calendar.day` | Grid column | Tag | Day | |
| `i18n.user.doctor` | Grid column | Arzt | Doctor | |
| `i18n.location` | Grid column | Ort | Location | |
| `i18n.appointment` | Select-next dialog | Termin | Appointment | |
| `i18n.appointment.start` | Form placeholder | Beginn | Start | |
| `i18n.appointment.location` | Form placeholder | Standort | Location | |
| `i18n.appointment.expertOnly` | Checkbox label | Nur Experte | Expert Only | |
| `i18n.User.Expert` | Doctor placeholder | Experte | Expert | |
| `i18n.end.date` | Dialog title | Enddatum | End Date | |
| `i18n.label.comment` | Textarea placeholder | Kommentar | Comment | |
| `i18n.action.add` | Nav button | Hinzufugen | Add | |
| `i18n.action.change` | Nav button | Bearbeiten | Change | |
| `i18n.action.delete` | Nav button | Loschen | Delete | |
| `i18n.action.applyPlan` | Nav button | Plan anwenden | Apply Plan | |
| `i18n.action.monthSummary` | Nav button | Monatszusammenfassung | Month Summary | |
| `i18n.month.summary.title` | CloseMonth dialog | Monatsabschluss | Month Summary | |
| `i18n.year` | CloseMonth dialog | Jahr | Year | |
| `i18n.month` | CloseMonth dialog | Monat | Month | |
| `i18n.button.apply` | Filter panel | Anwenden | Apply | |
| `i18n.button.reset` | Filter panel | Zurucksetzen | Reset | |
| `i18n.filter.results` | Filter select | Ergebnisse | Results | |
| `i18n.jobId` | Filter placeholder | Auftrag | Job ID | |
| `i18n.WeekDay.MO` | Form select | Montag | Monday | |
| `i18n.WeekDay.TU` | Form select | Dienstag | Tuesday | |
| `i18n.WeekDay.WE` | Form select | Mittwoch | Wednesday | |
| `i18n.WeekDay.TH` | Form select | Donnerstag | Thursday | |
| `i18n.WeekDay.FR` | Form select | Freitag | Friday | |
| `i18n.WeekDay.SA` | Form select | Samstag | Saturday | |
| `i18n.WeekDay.SU` | Form select | Sonntag | Sunday | |
| `i18n.WeekDay.HO` | Form select | Feiertag | Holiday | |
| `i18n.WeekScheduling.WEEKLY` | Form select | Wochentlich | Weekly | |
| `i18n.WeekScheduling.FIRSTOFMONTH` | Form select | Erster im Monat | First of Month | |
| `i18n.WeekScheduling.XOFMONTH` | Form select | X. im Monat | X of Month | |
| `i18n.WeekScheduling.LASTOFMONTH` | Form select | Letzter im Monat | Last of Month | |
| `i18n.Month.JAN`-`i18n.Month.DEC` | Month selects | Januar-Dezember | January-December | Used by CloseMonth |

### Hardcoded Strings (Need i18n Keys)

| String | Language | Location | Suggested Key |
|--------|----------|----------|---------------|
| "Plan" | EN | appointmentPlan grid col | `appointmentPlan.scheduling` |
| "Start" | EN | appointmentPlan grid col | `appointmentPlan.timeStart` |
| "Welches Monat soll fur Experten geschlossen werden?" | DE | closeMonth.html | `closeMonth.prompt` |
| "Done" | EN | closeMonth.js alert | `closeMonth.success` |
| "Ab dem Tag nach diesem wird nach dem Wochentag gesucht" | DE | appointmentPlan detail title attr | `appointmentPlan.lastDate.tooltip` |
| "Filter" | EN | appointmentPlan offcanvas title | `filter.title` |

### Enum Dependencies

| Enum | Java Class | Used By | Values |
|------|-----------|---------|--------|
| `WeekScheduling` | `de.videoclinic.model.types.WeekScheduling` | AppointmentPlan grid + detail | WEEKLY, FIRSTOFMONTH, XOFMONTH, LASTOFMONTH |
| WeekDay (implicit) | N/A | AppointmentPlan detail | MO, TU, WE, TH, FR, SA, SU, HO |

---

## Rebuild Considerations (AppointmentPlan)

- **expertOnly toggle** conditionally shows/hides location field and toggles its mandatory status -- implement with React conditional rendering and dynamic Zod validation
- **Collision detection** fires on dialog "ok" before save -- implement as async validation or confirmation step
- **schedulingMulitplier** field has a typo in the original; decide whether to preserve for API compatibility or fix
- **nextStart** is a read-only computed field displayed inline -- derive from backend or compute client-side
- **publishNext** is a long-running job with status polling via `jobStatusDlg`

## Rebuild Considerations (Close Month Dialog)

- Must be a standalone reusable component (used by appointmentPlan and shiftPlan)
- Replace `alert("Done")` with toast notification
- Replace hardcoded German prompt with i18n key
- Accept callback prop for flexibility (different modules may need different post-close behavior)

---

## Cross-Module References (AppointmentPlan)

### Shared Components

| Component | Source Path | Used By | Notes |
|-----------|-----------|---------|-------|
| `closeMonth.html` + `closeMonth.js` | `appointmentPlan/closeMonth.html` | `appointmentPlan`, `shiftPlan` | Shared via Mustache template inclusion. Both modules use button ID `closeMonthButton`. |
| `jobStatusDlg` | `_include/jobStatusDlg.html` | `appointmentPlan`, `CdrCall` | Long-running job status monitor with polling |
| `docFinder` | `profile/docFinder.html` | `appointmentPlan` | Doctor finder dialog (included but commented out in detail form) |
| `navbar.mustache` | `_include/navbar.mustache` | All three modules | Standard navbar |

### Service Dependencies

| Calling Module | External Service | Method | Purpose |
|---------------|-----------------|--------|---------|
| AppointmentPlan | `PlanCollisionService` | `getDoctorAppointmentCollision` | Detect scheduling conflicts |
| AppointmentPlan | `JobService` | `autocompleteType` | Job area autocomplete (filter: APPOINTMENT) |
| AppointmentPlan | `UserService` | `findDoctor` | Doctor autocomplete |
| AppointmentPlan | `LocationService` | `autocomplete` | Location autocomplete |
| AppointmentPlan | `ClosedMonthService` | `closeForExpert` | Close month for experts (via shared dialog) |
| All | `UserService` | `saveSetting` | Persist grid column settings |
