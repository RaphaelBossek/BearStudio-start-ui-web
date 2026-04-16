---
title: 'Cdr Call'
---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Included by** | `{{> jobStatusDlg}}` | [Appointment Plan](02-appointments/appointment-plan.md) | Job status monitor for publishNext/export polling |
| include | **Included by** | `{{> closeMonth}}` | [Close Month Dialog](./close-month.md) | Month close/reopen shared dialog |

### Service Calls

| Service | Method | Parameters | Dialog / Context |
|---------|--------|------------|------------------|
| `CdrCallService` | `generateExport` | `[year, month, isCsv]` | Export XLS/CSV via jobStatusDlg |
| `CdrCallService` | `downloadExport` | `[jobId, filename]` | Download generated export file |
| `CdrCallService` | `resetCalls` | `[ids]` | Reset selected calls with confirmation |
| `CdrCallService` | `analyzeOpenCalls` | `[]` | Analyze open/unassigned calls |
| `CdrCallService` | `upload` | `[]` | Upload CDR CSV import |
| `CdrCallService` | `assignCalls` | `[null, null]` | Trigger call assignment from CdrCallAssignment |
| `UserInfoService` | `autocomplete` | `[query]` | User lookup in CdrCallAssignment detail form |
| `UserService` | `saveSetting` | `[key, value]` | Grid column settings persistence |

### Event Flows

| Type | Direction | Event | Linked Document | Condition |
|------|-----------|-------|-----------------|----------|
| event | **Outgoing** | `jobStatusDlg` polling | [Appointment Plan](02-appointments/appointment-plan.md) | Both modules use job status dialog for long-running jobs |
| event | **Incoming** | `jobStatusDlg` completion | [Appointment Plan](02-appointments/appointment-plan.md) | Reload grid after job completes |

---

> **Split origin:** Both [Appointment Plan](02-appointments/appointment-plan.md) and this file were extracted from `appointment-support/plan-cdr.md`. This file covers CdrCall + CdrCallAssignment modules; the sibling covers AppointmentPlan + Close Month Dialog.

> **Include context:** `jobStatusDlg` is shared between CdrCall and AppointmentPlan for monitoring export/assignment jobs. `closeMonth` partial is shared with AppointmentPlan for billing period management.

---

## 3. CdrCall Module

### 3.1 Overview

CDR (Call Detail Record) tracking for telephony calls. Displays a filterable grid of call records with year/month/day selectors at the top. Supports export (XLS and CSV), upload (CSV import), call reset, and analysis of open calls.

- **Service**: `CdrCallService`
- **CRUD Methods**: `get`, `getAll`, `save`, `delete` (via `Core.initCrud`)
- **Additional Methods**: `resetCalls`, `generateExport`, `downloadExport`, `analyzeOpenCalls`, `upload`
- **Deeplink config**: `fields: ["year", "month", "day"]`, `view: false`

### 3.2 Toolbar (Year/Month/Day Selectors)

Inline toolbar above grid (not in a filter panel):

| # | Element ID | Type | Default Value | Notes |
|---|-----------|------|---------------|-------|
| 1 | `#year` | `<input>` number | Current year (`new Date().getFullYear()`) | Width: 100px |
| 2 | `#month` | `<select>` | Current month (`new Date().getMonth()+1`) | Options: 1-12 (i18n `Month.*`) |
| 3 | `#day` | `<select>` | empty (all days) | Options: empty + 1-31 |

Changing any selector updates `$(document).data().globalFilter.filter` to `"YYYY-M-D"` format and triggers grid reload.

### 3.3 Grid Columns

| # | Field | Display Name | Sortable | Width | Formatter | Notes |
|---|-------|-------------|----------|-------|-----------|-------|
| 1 | `id` | `i18n.label.id` | Yes | 80 | (none) | |
| 2 | `type` | "Status" (HARDCODED) | Yes | 110 | `i18n.CdrStatusFormatter` | Custom function (see 3.4) |
| 3 | `user` | `i18n.label.expert` | Yes | 120 | (none) | Plain text |
| 4 | `location` | `i18n.label.place` | Yes | 120 | (none) | Plain text |
| 5 | `dateStart` | `i18n.action.dateStart` | Yes | 100 | `Formatter.dateTime` | |
| 6 | `dateConnect` | `i18n.label.connected` | Yes | 100 | `Formatter.dateTime` | |
| 7 | `dateDisconnect` | `i18n.label.ended` | Yes | 100 | `Formatter.dateTime` | |
| 8 | `duration` | `i18n.label.duration` | Yes | 80 | `Formatter.humanTime` | |
| 9 | `callingNumber` | `i18n.label.caller` | Yes | 150 | (none) | |
| 10 | `calledNumber` | `i18n.label.receiver` | Yes | 150 | (none) | |
| 11 | `callingUser` | "callingUser" (HARDCODED) | Yes | 150 | (none) | |
| 12 | `finalUserId` | `i18n.label.final.user` | Yes | 150 | (none) | |
| 13 | `finalNumber` | `i18n.label.final.num` | Yes | 100 | (none) | |
| 14 | `conversationId` | "conversationId" (HARDCODED) | Yes | 80 | (none) | |
| 15 | `assignmentId` | `i18n.label.assigned` | Yes | 50 | (none) | |
| 16 | `pkId` | "pkId" (HARDCODED) | Yes | 180 | (none) | |

### 3.4 CdrStatusFormatter (Custom Formatter)

Inline formatter function defined in `messages.i18n.js`:

| Enum Value | German Display | English Translation |
|------------|---------------|---------------------|
| `INVALID_UNKNOWN` | "Unbekannt" (HARDCODED) | Unknown |
| `INVALID_MISSING_EXPERT` | "Kein Experte" (HARDCODED) | No Expert |
| `INVALID_MISSING_LOCATION` | "Kein Ort" (HARDCODED) | No Location |
| `DIRECT` | "Verbunden" (HARDCODED) | Connected |
| `INVALID_SHORT` | "Ignoriert (zu kurz)" (HARDCODED) | Ignored (too short) |
| `FORWARDED` | "Weiterleitung" (HARDCODED) | Forwarded |
| `CONFERENCE` | "Konferenz" (HARDCODED) | Conference |

### 3.5 Detail Form Elements

| # | Field Name | Type | CSS Classes | Placeholder/Title | Notes |
|---|-----------|------|-------------|-------------------|-------|
| 1 | `data.id` | `<input>` number | `form-control number` | `i18n.label.id` | Also has label + `<span class="field">` display |
| 2 | `data.assignmentId` | `<input>` number | `form-control number` | "assignmentId" (HARDCODED) | Title: "which assignment is this call" (HARDCODED) |
| 3 | `data.pkId` | `<input>` number | `form-control number` | "pkId" (HARDCODED) | Title shows UUID example |
| 4 | `data.dateConnect` | `<input>` date | `form-control date` | "dateConnect" (HARDCODED) | |
| 5 | `data.dateDisconnect` | `<input>` date | `form-control date` | "dateDisconnect" (HARDCODED) | |
| 6 | `data.duration` | `<input>` number | `form-control number` | "duration" (HARDCODED) | Title: "190 - Call Duration in ms" (HARDCODED) |
| 7 | `data.callingNumber` | `<input>` text | `form-control` | "callingNumber" (HARDCODED) | Title: "600602 - Number is calling" (HARDCODED) |
| 8 | `data.callingUri` | `<input>` text | `form-control` | "callingUri" (HARDCODED) | Title: "600602@videoclinic.de" (HARDCODED) |
| 9 | `data.callingUser` | `<input>` text | `form-control` | "callingUser" (HARDCODED) | Title: "600602 / VCOfficeDX" (HARDCODED) |
| 10 | `data.finalUserId` | `<input>` text | `form-control` | "finalUserId" (HARDCODED) | |
| 11 | `data.originalCalledUri` | `<input>` text | `form-control` | "originalCalledUri" (HARDCODED) | Title: "Number is called" (HARDCODED) |
| 12 | `data.finalNumber` | `<input>` text | `form-control` | "finalNumber" (HARDCODED) | Title: "Number is called" (HARDCODED) |
| 13 | `data.lastRedirect` | `<input>` text | `form-control` | "lastRedirect" (HARDCODED) | |
| 14 | `data.joinOnBehalf` | `<input>` number | `form-control number` | "joinOnBehalf" (HARDCODED) | Title: "Forwarded or Conference joinOnBehalfOf > 0" (HARDCODED) |
| 15 | `data.destConversationId` | `<input>` text | `form-control` | "destConversationId" (HARDCODED) | Title: "33594123" (HARDCODED) |
| 16 | `data.originalNumber` | `<input>` text | `form-control` | "originalNumber" (HARDCODED) | Title: "Number is called" (HARDCODED) |
| 17 | `data.destDevice` | `<input>` text | `form-control` | "destDevice" (HARDCODED) | |
| 18 | `data.origDevice` | `<input>` text | `form-control` | "origDevice" (HARDCODED) | |
| 19 | `data.dateStart` | `<input>` date | `form-control date` | `i18n.action.dateStart` | |
| 20 | `data.ideo` | `<input>` checkbox | `form-check-input boolean` | "ideo" (HARDCODED) | Switch style |
| 21 | `data.controllerInfo` | `<input>` text | `form-control` | "controllerInfo" (HARDCODED) | |
| 22 | `data.conversationId` | `<input>` number | `form-control number` | "conversationId" (HARDCODED) | |
| 23 | `data.huntPilot` | `<input>` text | `form-control` | "huntPilot" (HARDCODED) | |
| 24 | `data.destCause` | `<input>` number | `form-control number` | "destCause" (HARDCODED) | |

### 3.6 Client-Side Search

Filters grid rows by: `id` (as string), `user`, `location`, `callingNumber`, `originalNumber`, `finalNumber`.

### 3.7 Click Actions (Nav Buttons)

| Action ID | Icon | Name / i18n Key | English | Notes |
|-----------|------|-----------------|---------|-------|
| `exportMenuBtn` | `download` | `action.export` | Export | Generates XLS export via `generateExport(year, month, false)` |
| `exportCSVMenuBtn` | `download` | "Export CSV" (HARDCODED) | Export CSV | Generates CSV export via `generateExport(year, month, true)` |
| `resetMenuBtn` | `eraser` | "Reset Calls" (HARDCODED) | Reset Calls | Initially disabled. Resets selected calls. Confirm dialog (HARDCODED DE): "Zuordnung dieser N Anrufe wird resettet und neu analysiert!" |
| `uploadRecordsBtn` | `lock-alt` | "Upload" (HARDCODED) | Upload | Upload CDR CSV. Title (HARDCODED): "Upload CDR - CSV" |
| `analyzeRecordsBtn` | `lock-alt` | "Analyze Open" (HARDCODED) | Analyze Open | Calls `analyzeOpenCalls()` |

### 3.8 Export Flow

1. User clicks export button (XLS or CSV)
2. Calls `CdrCallService.generateExport(year, month, isCsv)` -- returns job ID
3. Opens `jobStatusDlg` with download URL: `../get/CdrCallService/downloadExport/{jobId}/{filename}`
4. Filename pattern: `CDR-Export-{year}_{month}.xls` or `.csv`

### 3.9 Reset Calls Flow

1. User selects rows, clicks Reset
2. Confirm dialog (HARDCODED German): "Zuordnung dieser {N} Anrufe wird resettet und neu analysiert!"
3. Calls `CdrCallService.resetCalls(ids)` -- returns job ID
4. Opens `jobStatusDlg`, on completion triggers grid reload

---

## 4. CdrCallAssignment Module

### 4.1 Overview

Manages the assignment of CDR calls to users/locations/appointments/consultations. Simpler module with basic CRUD and an "Assign" action.

- **Service**: `CdrCallAssignmentService`
- **CRUD Methods**: `get`, `getAll`, `save`, `delete` (via `Core.initCrud`)
- **Additional Service calls**: `CdrCallService.assignCalls(null, null)` (from the Assign button)

### 4.2 Grid Columns

| # | Field | Display Name | Sortable | Width | Formatter | Notes |
|---|-------|-------------|----------|-------|-----------|-------|
| 1 | `id` | `i18n.label.id` | Yes | 80 | (none) | |
| 2 | `confidence` | "confidence" (HARDCODED) | Yes | 80 | (none) | |
| 3 | `start` | `i18n.Start` | Yes | 120 | `Formatter.dateTime` | |
| 4 | `until` | "until" (HARDCODED) | Yes | 120 | `Formatter.dateTime` | |
| 5 | `duration` | "duration" (HARDCODED) | Yes | 80 | `Formatter.humanTime` | |
| 6 | `user` | `i18n.User` | Yes | 180 | `Formatter.name` | |
| 7 | `locationId` | "locationId" (HARDCODED) | Yes | 60 | (none) | |
| 8 | `location` | "location" (HARDCODED) | Yes | 180 | (none) | |
| 9 | `appointmentId` | "appointmentId" (HARDCODED) | Yes | 80 | (none) | |
| 10 | `consultationId` | "consultationId" (HARDCODED) | Yes | 80 | (none) | |
| 11 | `conferenceId` | "Conference" (HARDCODED) | Yes | 80 | (none) | |

### 4.3 Detail Form Elements

| # | Field Name | Type | CSS Classes | Placeholder/Label | Notes |
|---|-----------|------|-------------|-------------------|-------|
| 1 | `data.id` | `<input>` number | `form-control number` | `i18n.label.id` (label in input-group-text) | |
| 2 | `data.user` | `<input>` autocomplete | `form-control object autoselect` | `i18n.User` (label in input-group-text) | Service: `UserInfoService.autocomplete`, title: "expert" (HARDCODED) |
| 3 | `data.confidence` | `<input>` number | `form-control number` | "confidence" (HARDCODED) | |
| 4 | `data.start` | `<input>` date | `form-control date` | `i18n.Start` | |
| 5 | `data.until` | `<input>` date | `form-control date` | "until" (HARDCODED) | |
| 6 | `data.duration` | `<input>` number | `form-control number` | "duration" (HARDCODED) | |
| 7 | `data.appointmentId` | `<input>` number | `form-control number` | "appointmentId" (HARDCODED) | |
| 8 | `data.consultationId` | `<input>` number | `form-control number` | "consultationId" (HARDCODED) | |
| 9 | `data.locationId` | `<input>` number | `form-control number` | "locationId" (HARDCODED) | Title: "location" |
| 10 | `data.location` | `<input>` text | `form-control` | "location" (HARDCODED) | |

### 4.4 Click Actions (Nav Buttons)

| Action ID | Icon | Name / i18n Key | English | Notes |
|-----------|------|-----------------|---------|-------|
| `addMenuBtn` | `plus-square` | `action.add` | Add | Standard CRUD |
| `editMenuBtn` | `pencil` | `action.change` | Change | Initially disabled |
| `deleteMenuBtn` | `trash` | `action.delete` | Delete | Initially disabled |
| `assignCalls` | `stamp` | "Assign" (HARDCODED) | Assign | Calls `CdrCallService.assignCalls(null, null)`, opens `jobStatusDlg`, then reloads grid |

### 4.5 Bug Note

In `closeMonth.js` line 56, `$grid` is referenced outside its closure scope in the `assignCalls` click handler. This would cause a ReferenceError in the original code unless `$grid` leaks to a wider scope.

---

## 5. Cross-Module References

### 5.1 Shared Components

| Component | Source Path | Used By | Notes |
|-----------|-----------|---------|-------|
| `closeMonth.html` + `closeMonth.js` | `appointmentPlan/closeMonth.html` | `appointmentPlan`, `shiftPlan` | Shared via Mustache template inclusion. Both modules use button ID `closeMonthButton`. |
| `jobStatusDlg` | `_include/jobStatusDlg.html` | `appointmentPlan`, `CdrCall` | Long-running job status monitor with polling |
| `docFinder` | `profile/docFinder.html` | `appointmentPlan` | Doctor finder dialog (included but commented out in detail form) |
| `navbar.mustache` | `_include/navbar.mustache` | All three modules | Standard navbar |

### 5.2 Service Dependencies

| Calling Module | External Service | Method | Purpose |
|---------------|-----------------|--------|---------|
| CdrCall | `CdrCallService` | `generateExport`, `downloadExport`, `resetCalls`, `analyzeOpenCalls`, `upload` | Export, reset, analyze, upload |
| CdrCallAssignment | `CdrCallService` | `assignCalls` | Trigger call assignment process |
| CdrCallAssignment | `UserInfoService` | `autocomplete` | User autocomplete |
| All | `UserService` | `saveSetting` | Persist grid column settings |

### 5.3 Enum Dependencies

| Enum | Java Class | Used By | Values |
|------|-----------|---------|--------|
| CdrStatus (implicit) | N/A | CdrCall grid | INVALID_UNKNOWN, INVALID_MISSING_EXPERT, INVALID_MISSING_LOCATION, DIRECT, INVALID_SHORT, FORWARDED, CONFERENCE |

---

## 6. Translation Table (CdrCall + CdrCallAssignment)

### 6.1 i18n Key References (Used in Templates)

| Text Reference | Context | German (Inferred) | English | Notes |
|---------------|---------|-------------------|---------|-------|
| `i18n.label.id` | Grid/form | ID | ID | |
| `i18n.label.expert` | CdrCall grid | Experte | Expert | |
| `i18n.label.place` | CdrCall grid | Ort | Place | |
| `i18n.label.connected` | CdrCall grid | Verbunden | Connected | |
| `i18n.label.ended` | CdrCall grid | Beendet | Ended | |
| `i18n.label.duration` | CdrCall grid | Dauer | Duration | |
| `i18n.label.caller` | CdrCall grid | Anrufer | Caller | |
| `i18n.label.receiver` | CdrCall grid | Empfanger | Receiver | |
| `i18n.label.final.user` | CdrCall grid | Endbenutzer | Final User | |
| `i18n.label.final.num` | CdrCall grid | Endnummer | Final Number | |
| `i18n.label.assigned` | CdrCall grid | Zugeordnet | Assigned | |
| `i18n.action.dateStart` | CdrCall grid/form | Startdatum | Date Start | |
| `i18n.action.add` | Nav button | Hinzufugen | Add | |
| `i18n.action.change` | Nav button | Bearbeiten | Change | |
| `i18n.action.delete` | Nav button | Loschen | Delete | |
| `i18n.action.export` | Nav button | Exportieren | Export | |
| `i18n.CdrCall` | Detail title | CDR Anruf | CDR Call | |
| `i18n.CdrCallAssignment` | Detail title | CDR Zuordnung | CDR Call Assignment | |
| `i18n.Start` | CdrCallAssignment grid | Start | Start | |
| `i18n.User` | CdrCallAssignment grid/form | Benutzer | User | |
| `i18n.null_name` | messages.i18n.js | (null) | (null) | From `$[null.name]` server-side key |
| `i18n.Month.JAN`-`i18n.Month.DEC` | Month selects | Januar-Dezember | January-December | Used by CdrCall |

### 6.2 Hardcoded Strings (Need i18n Keys)

| String | Language | Location | Suggested Key |
|--------|----------|----------|---------------|
| "Status" | EN | CdrCall grid col | `cdrCall.status` |
| "callingUser" | EN | CdrCall grid col | `cdrCall.callingUser` |
| "conversationId" | EN | CdrCall grid col | `cdrCall.conversationId` |
| "pkId" | EN | CdrCall grid col | `cdrCall.pkId` |
| "confidence" | EN | CdrCallAssignment grid col | `cdrCallAssignment.confidence` |
| "until" | EN | CdrCallAssignment grid col | `cdrCallAssignment.until` |
| "duration" | EN | CdrCallAssignment grid col | `cdrCallAssignment.duration` |
| "locationId" | EN | CdrCallAssignment grid col | `cdrCallAssignment.locationId` |
| "location" | EN | CdrCallAssignment grid col | `cdrCallAssignment.location` |
| "appointmentId" | EN | CdrCallAssignment grid col | `cdrCallAssignment.appointmentId` |
| "consultationId" | EN | CdrCallAssignment grid col | `cdrCallAssignment.consultationId` |
| "Conference" | EN | CdrCallAssignment grid col | `cdrCallAssignment.conferenceId` |
| "Export CSV" | EN | CdrCall nav button | `action.exportCsv` |
| "Reset Calls" | EN | CdrCall nav button | `action.resetCalls` |
| "Upload" | EN | CdrCall nav button | `action.upload` |
| "Analyze Open" | EN | CdrCall nav button | `action.analyzeOpen` |
| "Assign" | EN | CdrCallAssignment nav button | `action.assign` |
| "Zuordnung dieser N Anrufe wird resettet und neu analysiert!" | DE | CdrCall reset confirm | `cdrCall.resetConfirm` |
| "Upload CDR - CSV" | EN | CdrCall upload dialog | `cdrCall.uploadTitle` |
| "Reassigning..." | EN | CdrCall jobStatus title | `cdrCall.reassigning` |
| "Analyzing..." | EN | CdrCall jobStatus title | `cdrCall.analyzing` |
| "Assigning..." | EN | CdrCallAssignment jobStatus title | `cdrCallAssignment.assigning` |
| "CDR Export" | EN | CdrCall jobStatus title | `cdrCall.exportTitle` |
| "ideo" | EN | CdrCall checkbox label | `cdrCall.video` |

### 6.3 CdrStatus Enum Labels (All HARDCODED in CdrStatusFormatter)

| Enum Value | German (Current) | English | Suggested Key |
|------------|-----------------|---------|---------------|
| `INVALID_UNKNOWN` | Unbekannt | Unknown | `cdrStatus.invalidUnknown` |
| `INVALID_MISSING_EXPERT` | Kein Experte | No Expert | `cdrStatus.invalidMissingExpert` |
| `INVALID_MISSING_LOCATION` | Kein Ort | No Location | `cdrStatus.invalidMissingLocation` |
| `DIRECT` | Verbunden | Connected | `cdrStatus.direct` |
| `INVALID_SHORT` | Ignoriert (zu kurz) | Ignored (too short) | `cdrStatus.invalidShort` |
| `FORWARDED` | Weiterleitung | Forwarded | `cdrStatus.forwarded` |
| `CONFERENCE` | Konferenz | Conference | `cdrStatus.conference` |

---

## 7. Rebuild Considerations

### 7.1 CdrCall

- Extremely field-heavy detail form (24 fields) -- consider grouping into sections or making some read-only
- Most detail field placeholders are hardcoded English technical names -- all need proper i18n
- Year/Month/Day toolbar drives a global filter that also affects deeplinks
- Export generates downloadable files via job status polling
- Upload uses a generic upload trigger (`$(document).trigger("doUpload", ...)`)

### 7.2 CdrCallAssignment

- Simplest of the three modules
- "Assign" button calls `CdrCallService` (not `CdrCallAssignmentService`) -- cross-service dependency
- Has a bug: `$grid` referenced outside its closure in the `assignCalls` handler
