# 04 - Dashboard Dialogs — Planning

> **Split from**: `dash/04-dashboard-dialogs.md`
> **Sections extracted here**: Dialog 2 (endShiftDlg), Dialog 6 (adHocAppointment), Dialog 9 (appointmentsConfirmModal), Dialog 10 (appointmentsDeclineModal)
> **Other domains received**: Treatment (`04-dialogs-treatment.md` — Dialogs 3, 5, 7, 8), User Management (`04-dialogs-user-management.md` — Dialog 1), System (`04-dialogs-system.md` — Dialog 4)

> Source: `dash/index.htmlm` (lines 624-896), `dash/dash.js`

---

## 2. endShiftDlg (`#endShiftDlg`)

**End shift dialog** - Confirms ending a shift with adjustable start/end times.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-business-time` |
| `data-color` | `bg-color-appointment` |
| `title` | `{{i18n.shift}}` |
| `data-target` | _(none - default)_ |
| `data-width` | _(none - default)_ |
| `data-crudbuttons` | _(none - default true)_ |

### Form Elements

| Name | Type | Classes | Required | Read-only | Notes |
|------|------|---------|----------|-----------|-------|
| `data.timeStart` | `input[type=time]` | `form-control mandatory time suggestType` | Yes | No | Clockpicker; icon `far fa-play`; title `{{i18n.action.dateStart}}` |
| `data.timeEnd` | `input[type=time]` | `form-control mandatory time` | Yes | No | Clockpicker; icon `far fa-stop`; title `{{i18n.action.dateEnd}}` |

**Layout**: `row > col-md-3 + col-md-3`

**Static text**:
- `<p>{{i18n.operation.ended.text}}</p>` (confirmation question)
- `<p class="text-muted">{{i18n.correct.the.time.text}}</p>` (instruction)
- Hidden `<button>` (form submit suppression)

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `Dialog.init("#endShiftDlg")` | Standard init |
| `.endAppointment` click (when `ap.shift` is truthy) | Opens this dialog with `{id, timeStart, timeEnd, qm: null}` |
| Dialog save callback | Calls `AppointmentService.done(id, timeStart, timeEnd, qm)`, triggers reload; on error re-opens dialog |

### Permissions

None (visible when user has an active shift).

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `shift` | Schicht | Shift | Dialog title |
| `operation.ended.text` | Soll die Operation wirklich beendet werden?... | Should the operation really be ended?... | Confirmation text |
| `action.dateStart` | Startdatum | Start Date | Time input group title |
| `action.dateEnd` | Enddatum | End Date | Time input group title |
| `correct.the.time.text` | Bitte korrigieren Sie die Zeiten... | Please correct the times... | Instruction text |

---

## 6. adHocAppointment (`#adHocAppointment`)

**Ad-hoc appointment creation dialog** - Creates an unscheduled appointment with location, type, and job selection.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-calendar-plus` |
| `data-color` | `bg-color-staff` |
| `title` | `{{i18n.dash.adHocAppointmentCreate}}` |
| `data-target` | `secondary` |
| `data-width` | _(none - default)_ |
| `data-crudbuttons` | _(none - default true)_ |

### Form Elements

| Name | Type | Classes | Required | Read-only | Notes |
|------|------|---------|----------|-----------|-------|
| `data.location` | `input` (autocomplete) | `form-control object mandatory autoselect` | Yes | No | `data-service="LocationService"` `data-method="autocomplete"` `data-display="name"` `data-append="adHocAppointment"`; icon `far fa-compass`; placeholder `{{i18n.location}}` |
| `data.type` | `select` | `form-select mandatory` | Yes | No | `id="adHocType"` `data-key="id"`; icon `far fa-briefcase-medical` |
| `data.job` | `input` (autocomplete) | `form-control object mandatory autoselect jobselect` | Yes | No | `data-service="JobService"` `data-method="adHocAutocompleteType"` `data-display="code"` `data-filter='"APPOINTMENT"'` `data-minlength="0"` `autocomplete="off"` `id="adHocJob"`; icon `fa fa-graduation-cap` |

All input groups use `input-group-sm`.

### Type Select Options

| Value | Label |
|-------|-------|
| `APPOINTMENT` | `{{i18n.appointment}}` |
| `SHIFT` | `{{i18n.shift}}` |
| `COUNCIL` | `{{i18n.council}}` |

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `Dialog.init("#adHocAppointment")` | Standard init |
| `#adHocType` change | Enables/disables `#adHocJob`; sets `data().filter` to selected type value |
| `#adHocAppointmentCreateMenuBtn` click | Opens dialog with empty data `{}`; save callback calls `AppointmentService.createAdHoc(ap, false)` |
| Save callback - `double.booking` error | Shows `confirm(i18n.dialog_duplicateContinue)`, if accepted retries with force=`true` |
| Save callback - success with `data.state === "READY"` | Calls `AppointmentDetails.open(data.id)` (admin-created appointment) |

### Permissions

| Guard | Permission Key |
|-------|---------------|
| `{{#canAdHoc}}...{{/canAdHoc}}` | `APPOINTMENT_ADHOC` |

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `dash.adHocAppointmentCreate` | Ad-hoc Termin erstellen | Create Ad-hoc appointment | Dialog title |
| `location` | Standort | Location | Placeholder |
| `appointment` | Termin | Appointment | Type option |
| `shift` | Schicht | Shift | Type option |
| `council` | Konsilium | Council | Type option |
| `dialog_duplicateContinue` | _(i18n key)_ | _(i18n key)_ | Confirm on double booking (JS `i18n.dialog_duplicateContinue`) |

---

## 9. appointmentsConfirmModal (`#appointmentsConfirmModal`)

**Confirmation list modal** - Shows a list of selected appointments and asks the user to confirm accepting them all.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-calendar-plus` |
| `data-color` | `bg-color-appointment` |
| `title` | `{{i18n.appointment.agreeAppointments}}` |
| `data-target` | `modal` |
| `data-width` | _(none - default)_ |
| `data-crudbuttons` | _(none - default true)_ |

### Form Elements

None (display-only list).

### Collections / Repeaters

| Container | `data-field` | Class | Template Fields |
|-----------|-------------|-------|-----------------|
| `<ul id="appointmentsConfirmList">` | `data.items` | `collection list-group mb-3 small` | `items.text` |

Each `<li class="list-group-item">` displays a `<span class="field">items.text</span>`.

The `items` array is constructed in JS from selected rows: `"{date} {timeStart} - {timeEnd} -- {expertTitle} / {locationName}"`.

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `Dialog.init("#appointmentsConfirmModal")` | Standard init |
| `#acceptAppointments` click | Gets all selected rows from `#queuedActionList .selected`, builds `items` list, opens dialog |
| Dialog save callback | Shows loader, calls `AppointmentService.agreeAll(agreeIds)`, reloads page |

### Permissions

None explicitly (button visibility controlled by queued action list presence).

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `appointment.agreeAppointments` | Sind Sie sicher, dass Sie alle ausgewahlten Termine annehmen mochten? | Are you sure you want to accept all selected appointments? | Dialog title/question |

---

## 10. appointmentsDeclineModal (`#appointmentsDeclineModal`)

**Decline list modal** - Shows a list of selected appointments and asks the user to confirm declining them all.

### Visualization Attributes

| Attribute | Value |
|-----------|-------|
| `data-icon` | `far fa-calendar-plus` |
| `data-color` | `bg-color-appointment` |
| `title` | `{{i18n.appointment.disagreeAppointments}}` |
| `data-target` | `modal` |
| `data-width` | _(none - default)_ |
| `data-crudbuttons` | _(none - default true)_ |

### Form Elements

None (display-only list).

### Collections / Repeaters

| Container | `data-field` | Class | Template Fields |
|-----------|-------------|-------|-----------------|
| `<ul id="appointmentsDeclineList">` | `data.items` | `collection list-group mb-3 small` | `items.text` |

Each `<li class="list-group-item">` displays a `<span class="field">items.text</span>`.

### Click Actions / Event Handlers (dash.js)

| Trigger | Action |
|---------|--------|
| `#disagreeAppointments` click | Gets all selected rows from `#queuedActionList .selected`, builds `items` list, opens dialog |
| Dialog save callback | Shows loader, calls `AppointmentService.disagreeAll(disagreeIds)`, reloads page |

### Permissions

None explicitly (button visibility controlled by queued action list presence).

### Translation Table

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `appointment.disagreeAppointments` | Sind Sie sicher, dass Sie alle ausgewahlten Termine ablehnen mochten? | Are you sure you want to decline all selected appointments? | Dialog title/question |

---

## Summary: Planning Dialog Patterns

### Service Calls

| Dialog | Service | Method | Parameters |
|--------|---------|--------|------------|
| `#endShiftDlg` | `AppointmentService` | `done` | `[id, timeStart, timeEnd, qm]` |
| `#adHocAppointment` | `AppointmentService` | `createAdHoc` | `[ap, force]` |
| `#appointmentsConfirmModal` | `AppointmentService` | `agreeAll` | `[ids]` |
| `#appointmentsDeclineModal` | `AppointmentService` | `disagreeAll` | `[ids]` |
