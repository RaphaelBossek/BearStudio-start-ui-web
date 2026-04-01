# 04 - Dashboard Dialogs — Treatment

> **Split from**: `dash/dashboard-dialogs.md`
> **Sections extracted here**: Dialog 3 (endAppointmentDlg), Dialog 5 (summarizeAppointmentDlg), Dialog 7 (consultationIncarcerationCheck), Dialog 8 (consultationIncarceration)
> **Other domains received**: Planning (`04-dialogs-planning.md` — Dialogs 2, 6, 9, 10), User Management (`04-dialogs-user-management.md` — Dialog 1), System (`04-dialogs-system.md` — Dialog 4)

> Source: `dash/index.htmlm` (lines 624-896), `dash/dash.js`

---

## 3. endAppointmentDlg (`#endAppointmentDlg`)

**End appointment dialog** - Confirms ending an appointment with adjustable times and QM questionnaire.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-business-time` |
| `data-color` | `bg-color-appointment` |
| `title` | `{{i18n.appointment}}` |
| `data-target` | _(none - default)_ |
| `data-width` | `900` |
| `data-crudbuttons` | _(none - default true)_ |

### Form Elements

| Name | Type | Classes | Required | Read-only | Notes |
|------|------|---------|----------|-----------|-------|
| `data.timeStart` | `input[type=time]` | `form-control mandatory time suggestType` | Yes | No | Clockpicker; icon `far fa-play`; title `{{i18n.action.dateStart}}` |
| `data.timeEnd` | `input[type=time]` | `form-control mandatory time` | Yes | No | Clockpicker; icon `far fa-stop`; title `{{i18n.action.dateEnd}}` |

**Layout**: `row > col-md-3 + col-md-3`

**Static text**:
- `<p>{{i18n.operation.ended.text}}</p>`
- `<p class="text-muted">{{i18n.correct.the.time.text}}</p>`

### Included Sub-templates

| Template | Notes |
|----------|-------|
| `{{> detailQuestionaire}}` | QM questionnaire partial (quality management questions) |

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `Dialog.init("#endAppointmentDlg")` | Standard init |
| `.endAppointment` click (when `ap.shift` is falsy) | Opens this dialog with `{id, timeStart, timeEnd, qm: null}`; applies `filterQm()` |
| Dialog save callback | Calls `AppointmentService.done(id, timeStart, timeEnd, qm)`, triggers reload; on error re-opens dialog with previous `qm` data |

### Permissions

None (visible when user has an active appointment).

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `appointment` | Termin | Appointment | Dialog title |
| `operation.ended.text` | Soll die Operation wirklich beendet werden?... | Should the operation really be ended?... | Confirmation text |
| `action.dateStart` | Startdatum | Start Date | Time input title |
| `action.dateEnd` | Enddatum | End Date | Time input title |
| `correct.the.time.text` | Bitte korrigieren Sie die Zeiten... | Please correct the times... | Instruction text |

---

## 5. summarizeAppointmentDlg (`#summarizeAppointmentDlg`)

**Appointment summary dialog** - Detailed summary form with adjusted times, communication type, further treatment counters, and QM questionnaire. Used for external-location appointments.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-business-time` |
| `data-color` | `bg-color-appointment` |
| `title` | `{{i18n.appointment}}` |
| `data-titleAPPOINTMENT` | `{{i18n.appointment}}` |
| `data-titleSHIFT` | `{{i18n.shift}}` |
| `data-titleCOUNCIL` | `{{i18n.shift}}` |
| `data-target` | _(none - default)_ |
| `data-width` | `1000` |
| `data-crudbuttons` | _(none - default true)_ |

### Display Fields (read-only spans)

| Field Path | Notes |
|-----------|-------|
| `data.appointment.weekday` | Day of week |
| `data.appointment.date` | Date |
| `data.appointment.timeStart` | Original start time |
| `data.appointment.timeEnd` | Original end time |
| `data.appointment.location.name` | Location name |

**Layout row 1**: `col-md-4` (display) + `col-md-3` (adjusted start) + `col-md-3` (adjusted end) + `col-md-2` (comm type)

### Form Elements

| Name | Type | Classes | Required | Read-only | Notes |
|------|------|---------|----------|-----------|-------|
| `data.summary.adjustedStart` | `input[type=time]` | `form-control time mandatory` | Yes | No | Clockpicker; label `{{i18n.action.dateStartTime}}` |
| `data.summary.adjustedUntil` | `input[type=time]` | `form-control time mandatory` | Yes | No | Clockpicker; label "Ende" (HARDCODED) |
| `data.summary.communicationType` | `select` | `form-select mandatory` | Yes | No | Options: VIDEO, VCGO (default), PHONE (default), EMAIL (default) |
| `data.summary.referral` | `input` | `form-control number` | No | No | Label `{{i18n.FurtherTreatment.REFERRAL}}` |
| `data.summary.ifRequired` | `input` | `form-control number` | No | No | Label "WV" (HARDCODED) |
| `data.summary.followUp` | `input` | `form-control number` | No | No | Label `{{i18n.FurtherTreatment.FOLLOW_UP}}` |
| `data.summary.referralOther` | `input` | `form-control number` | No | No | Label "Uberweisung" (HARDCODED) |

**Layout row 2** (class `summary`): `col-md-2` (label) + `col-md-2` (referral) + `col-md-2` (WV) + `col-md-2` (followUp) + `col-md-2` (referralOther) + `col-md-2` (total)

**Computed field**: `#summaryTotal` displays `data.summary.total` - dynamically recalculated from all `.summary input` values.

### Communication Type Options

| Value | Label |
|-------|-------|
| _(empty)_ | `{{i18n.CommunicationType}}` (placeholder) |
| `VIDEO` | `{{i18n.CommunicationType.video}}` |
| `VCGO` | `{{i18n.CommunicationType.vcgo}}` |
| `PHONE` | `{{i18n.CommunicationType.phone}}` |
| `EMAIL` | `{{i18n.CommunicationType.email}}` |

> Note: VCGO, PHONE, and EMAIL options all have `selected` attribute in HTML (likely a bug; only one should be default).

### Included Sub-templates

| Template | Notes |
|----------|-------|
| `{{> detailQuestionaire}}` | QM questionnaire partial |

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `Dialog.init("#summarizeAppointmentDlg", {saveMethod})` | Custom save: shows `confirm()` with total count, then calls `AppointmentService.summarize(data)`, triggers reload, closes dialog |
| `dialogopen` event | Reads `data.appointment.type`, adjusts title icon (`fa-user-md` or `fa-user-injured` for SHIFT) and title text from `data-title{TYPE}` attributes |
| `.summary input` change | Recalculates total from all `.summary input` numeric values, writes to `#summaryTotal` |
| `.summarize` button click (in appointment list) | Applies `filterQm()`, opens dialog with `{appointment: pojo.appointment}` |

### Permissions

Visible when appointment has `control` active, is not a shift, and location has `patientDataType === "EXTERNAL"`.

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `appointment` | Termin | Appointment | Dialog title (for APPOINTMENT type) |
| `shift` | Schicht | Shift | Dialog title (for SHIFT/COUNCIL type) |
| `action.dateStartTime` | Startzeit | Start time | Adjusted start label |
| _(hardcoded)_ | Ende | End | HARDCODED adjusted end label |
| `CommunicationType` | Verbindungsart | Connection type | Select placeholder |
| `CommunicationType.video` | Video | Video | |
| `CommunicationType.vcgo` | VC to Go | VC to Go | |
| `CommunicationType.phone` | Telefon | Phone | |
| `CommunicationType.email` | E-Mail | E-Mail | |
| `consultation.furtherTreatment` | Weiterbehandlung | Further treatment | Row label |
| `FurtherTreatment.REFERRAL` | Krankenhauseinweisung | Hospital admission | |
| _(hardcoded)_ | WV | WV | HARDCODED abbreviation (Wiedervorstellung = re-presentation) |
| `FurtherTreatment.FOLLOW_UP` | Folgetermin | Follow-up appointment | |
| _(hardcoded)_ | Uberweisung | Referral | HARDCODED label |
| _(hardcoded)_ | Summe | Total | HARDCODED label prefix |
| _(hardcoded in JS)_ | Hiermit bestatigen Sie die Richtigkeit der eingegebenen Daten (...Behandlungen). Ein nachtragliche Anderung ist nur durch die Videoclinic Administration moglich. | Hereby you confirm the correctness of the entered data (... treatments). A subsequent change is only possible through Videoclinic administration. | HARDCODED confirm() text in dash.js |

---

## 7. consultationIncarcerationCheck (`#consultationIncarcerationCheck`)

**Book number + code check dialog** - Initial verification step before retrieving incarceration consultation data.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-user-hard-hat` |
| `data-color` | `bg-color-appointment` |
| `title` | `{{i18n.dashboard.patient.query.dialog.title}}` |
| `data-target` | `modal` |
| `data-width` | _(none - default)_ |
| `data-crudbuttons` | _(none - default true)_ |

### Form Elements

| Name | Type | Classes | Required | Read-only | Notes |
|------|------|---------|----------|-----------|-------|
| `data.bookNumber` | `input` | `form-control mandatory` | Yes | No | Icon `far fa-user-injured`; placeholder `{{i18n.consultation.booknumber}}` |
| `data.code` | `input` | `form-control mandatory` | Yes | No | Icon `far fa-key`; placeholder `{{i18n.consultation.code}}` |

Layout: single `input-group input-group-sm` with both fields inline.

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `Dialog.init("#consultationIncarcerationCheck")` | Standard init |
| `#retrieveConsultationMenuBtn` click | Opens dialog with empty data; save callback calls `ConsultationService.checkCustomer(bookNumber, code)`, then opens `#consultationIncarceration` with result |

### Permissions

None explicitly on dialog (menu button visibility may be controlled elsewhere).

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `dashboard.patient.query.dialog.title` | Gewahrsamkeit - Abruf Arztliche Untersuchung | Reservation - Retrieval Medical examination | Dialog title |
| `consultation.booknumber` | Buchnummer | Book number | Placeholder |
| `consultation.code` | Code | Code | Placeholder |

---

## 8. consultationIncarceration (`#consultationIncarceration`)

**Full incarceration retrieval form** - Displays verified book number/code (read-only), previous retrieval warning, and address form for the target person.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-user-hard-hat` |
| `data-color` | `bg-color-appointment` |
| `title` | "Gewahrsamkeit - Abruf Arztliche Untersuchung" (HARDCODED) |
| `data-target` | `modal` |
| `data-width` | _(none - default)_ |
| `data-crudbuttons` | _(none - default true)_ |

### Form Elements

| Name | Type | Classes | Required | Read-only | Notes |
|------|------|---------|----------|-----------|-------|
| `data.bookNumber` | `input` | `form-control readonly` | No | Yes | `readonly="readonly"`; icon `far fa-user-injured` |
| `data.code` | `input` | `form-control readonly` | No | Yes | `readonly="readonly"`; icon `far fa-key` |
| `data.target.name` | `input` | `form-control mandatory` | Yes | No | Placeholder `{{i18n.contact.firstName}} {{i18n.contact.lastName}}` |
| `data.target.address` | `input` | `form-control mandatory` | Yes | No | Placeholder `{{i18n.contact.street}}` |
| `data.target.address2` | `input` | `form-control` | No | No | Placeholder `{{i18n.contact.street2}}` |
| `data.target.zip` | `input` | `form-control searchZipCode mandatory` | Yes | No | Placeholder `{{i18n.contact.zipcode}}`; has `searchZipCode` class for auto-lookup |
| `data.target.state` | `input` | `form-control` | No | No | Placeholder `{{i18n.contact.state}}` |
| `data.target.city` | `input` | `form-control mandatory` | Yes | No | Placeholder `{{i18n.contact.city}}` |
| `data.target.country` | `input` | `form-control` | No | No | Placeholder `{{i18n.contact.country}}` |
| `data.target.addressInfo` | `textarea` | `form-control` | No | No | Placeholder "Zusatztext Adresse" (HARDCODED) |

### Conditional UI

| Element | Condition |
|---------|-----------|
| `#previousRetrieval` (`alert alert-danger`) | Shown if `data.dateRetrieved` is truthy; contains `data.dateRetrieved` as `dateTime` field. Text: "Dieser Datensatz wurde bereits am {date} abgefragt!" (HARDCODED) |

### Commented-out Buttonset

The HTML contains a commented-out `<div class="buttonset">` with:
- "Abrufen / Drucken" button (`data-event="downloadConsultationIcarceration"`)
- Cancel button (`data-event="cancel"`)

These are NOT active; dialog uses standard Dialog CRUD buttons instead.

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `Dialog.init("#consultationIncarceration")` | Standard init |
| `dialogopen` event | Checks `data.dateRetrieved`; shows/hides `#previousRetrieval` alert accordingly |
| Save callback (from `#consultationIncarcerationCheck` flow) | Calls `ConsultationService.prepareCustomer(bookNumber, code, target)`, then opens `#jobStatusDlg` with download link to PDF: `../get/ConsultationService/retrieve/{id}/{name}.pdf` |

### Permissions

None explicitly on dialog.

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| _(hardcoded)_ | Gewahrsamkeit - Abruf Arztliche Untersuchung | Custody - Retrieval Medical Examination | HARDCODED dialog title |
| _(hardcoded)_ | Dieser Datensatz wurde bereits am ... abgefragt! | This record was already retrieved on ...! | HARDCODED warning text |
| `contact.firstName` | Vorname | First Name | Placeholder part |
| `contact.lastName` | Nachname | Last Name | Placeholder part |
| `contact.street` | Strasse | Street | Placeholder |
| `contact.street2` | Adresszusatz | Street 2 | Placeholder |
| `contact.zipcode` | PLZ | Zip code | Placeholder |
| `contact.state` | Bundesland | State | Placeholder |
| `contact.city` | Stadt | City | Placeholder |
| `contact.country` | Land | Country | Placeholder |
| _(hardcoded)_ | Zusatztext Adresse | Additional address text | HARDCODED textarea placeholder |

---

## Summary: Treatment Dialog Patterns

### Service Calls

| Dialog | Service | Method | Parameters |
|--------|---------|--------|------------|
| `#endAppointmentDlg` | `AppointmentService` | `done` | `[id, timeStart, timeEnd, qm]` |
| `#summarizeAppointmentDlg` | `AppointmentService` | `summarize` | `[data]` |
| `#consultationIncarcerationCheck` | `ConsultationService` | `checkCustomer` | `[bookNumber, code]` |
| `#consultationIncarceration` | `ConsultationService` | `prepareCustomer` | `[bookNumber, code, target]` |

### Included Sub-templates

| Template | Used In |
|----------|---------|
| `{{> detailQuestionaire}}` | `#endAppointmentDlg`, `#summarizeAppointmentDlg` |
