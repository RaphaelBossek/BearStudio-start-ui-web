# Extracted Annotations from .pen Wireframes

**Date**: 2026-04-02
**Files with notes**: 71
**Total notes extracted**: 137

These annotations were previously embedded as `type:"note"` nodes inside wireframe `.pen` files.
They have been removed from the `.pen` files per the updated wireframing instructions.
Each note should be incorporated into the corresponding `workflows.md` file, next to the relevant wireframe screenshot.

---

## Academy

### `academy/support-video/support-ticket.pen`

**Annotations** (`1gCuc`)

[DataTable] 6-col grid → @shadcn/table DataTable pattern
Detail panel: 3 cascading selects [cascade: level 1 → level 2 → level 3]
Title [RO] [auto: concat(cat1.title, cat2.title, cat3.title)] — auto-generated
Queue [RO] — determined by category selection
Priority: VERYLOW 
- LOW 
- NORMAL 
- HIGH 
- CRITICAL
View dialog (800px): ticket metadata header + comment thread [repeats] + reply textarea
Body textarea for ticket description

---

### `academy/support-video/video-library.pen`

**Annotations** (`NRuoa`)

Card-based browsing layout (no DataTable)
Category cards grid: thumbnail, title, totalTime, watched indicator, View button
Video cards grid: thumbnail, title, duration, watched indicator, Play button
[hash: deep link] #CATEGORYID;SUBCATEGORY:VIDEOID:POSITION
[async: periodic submitWatchTime] track video watch progress
3 player variants: VIDEO (video.js), STREAM (iframe), PDF (embedded viewer)
goBack button returns to previous view

---

### `academy/support-video/video-management.pen`

**Annotations** (`d5BsQ`)

[DataTable] 7-col grid → @shadcn/table DataTable pattern
Detail panel: path, previewImage, title, lengthInSeconds, category combobox, description textarea
Two player dialog types:
[cond: video.type === VIDEO] video.js player 800px dialog
[cond: video.type === STREAM] iframe embed 1200px dialog
Watch button opens appropriate player based on video type

---

## Accounting

### `accounting/admin-job/job-configuration.pen`

**Annotations** (`StJjf`)

1200px @shadcn/dialog, 2-tab detail
Tab 1 (shown): Info + skills collection [nested: skill → rules]
Tab 2: Times/Pricing — type-conditional:
  [cond: type=SHIFT] 4-period × 6-tier pricing matrix with pricePoints sub-dialog
  [cond: type=APPOINTMENT] Hourly rates + rounding + storno config
  [cond: type=COUNCIL] Per-patient pricing + support hourly + rounding
Sub-dialogs: Price Point Dialog (dated price collection), Skill Select Dialog (autocomplete)
[cond: billing.enabled] Billing fields conditionally visible
8-col DataTable list view with filter panel (not shown in this frame)

---

### `accounting/config/accounting-config.pen`

**Annotations** (`R0GLt`)

5 config modules as @shadcn/tabs: Storno Groups, Price Lists, Products, Closed Months, Expert Work Monthly
Showing: Storno Groups tab with master list + detail panel with nested rules collection
[repeats] [nested: group → rules] Storno rules inline collection with add/delete
Price Lists: master list + nested prices collection, conditional fields by job type
Products: 8 fields with 2 enum selects
Closed Months: [batch: generated records] — 3 date milestones, no add/delete
Expert Work Monthly: [cond: role=ADMIN
-ACCOUNTING] year/month filter, [async: poll export status]

---

### `accounting/invoice-receiver/invoice-receiver.pen`

**Annotations** (`auvrQ`)

2-tab detail: Tab 1 Payment Contact (35 fields), Tab 2 Product Orders (flat-rate toggles + product collection)
[cond: customer↔location mutex] — selecting customer clears location and vice versa
[repeats] Product orders collection with add/delete/sort
[bulk: create invoices] Create Invoice + Create All Invoices actions
Filter panel: active toggle + max results (@shadcn/sheet)
[HARDCODED] Field labels need i18n keys

---

### `accounting/invoice/invoice-details.pen`

**Annotations** (`Ps89J`)

[multi-entity: invoice switch] ← Prev / Next → navigate between invoices without closing
1100px @shadcn/sheet drawer with positions collection inline editing
[calc: netPrice × amount + tax] Auto-recalculated totals
Dialogs: Print Preview (PDF), Email, Storno [cond: !invoice.storno], Create Invoice
[async: PDF generation] Print preview may be async
Attachments section (file upload) not shown — below positions

---

### `accounting/invoice/invoice-list.pen`

**Annotations** (`FUzih`)

[DataTable] 11-col grid → @shadcn/table DataTable pattern
12 toolbar actions — some row-selection-gated
Month/Year filter → @shadcn/select + @shadcn/input
[async: poll job status] Template Export + ZIP Download → jobStatusDlg
Row double-click → InvoiceDetails.open(view)
[HARDCODED] Column headers need i18n keys
Dialogs: Export Invoice (period), Template Export, Multi-Template Export, Job Status

---

### `accounting/worklog/worklog.pen`

**Annotations** (`fL94q`)

[DataTable] Monthly list → @shadcn/table DataTable pattern
[matrix: 7d×3shifts] Weekly assignments = 21 columns (expert × day × shift)
[HARDCODED] All column headers need i18n keys
Month/Year selector reused from Invoice List pattern
Toolbar: View/Edit open InvoiceDetails dialog cross-module
[async: poll job status] ZIP Download triggers background job with polling dialog

---

## Customer

### `customer/contact/contact-management.pen`

**note: AZ Filter** (`wXkeT`)

[custom: AZFilterBar] — Letter buttons A-Z + # (non-alpha).
Compact variant: A-D 
- E-H 
- I-L 
- M-P 
- Q-T 
- U-X 
- Y-Z#
Clicking a letter filters grid by last name initial.
Active letter highlighted with $--primary bg.

**note: Table** (`rC2AY`)

13-column DataTable: Display Name 
- First Name 
- Last Name 
- Type 
- Categories 
- Primary Email 
- Cellular Number 
- Company 
- Work Phone 
- Address 
- Zip Code 
- City 
- Country
Sorting: server-side on all columns
Pagination: server-side, 25 rows/page

**note: Categories** (`Qh48H`)

Multi-tag widget (tag-it). Users type category names; tags appear inline.
[custom: TagInput] — custom component, not in Shadcn registry.
ContactService.getCategories provides autocomplete.
Max 7 tags allowed.

**note: QR Code** (`C8us3`)

Generates vCard-compatible QR code from contact data.
[integration: qrcode.react]
Generate button creates QR; displayed as image.

**note: Address autofill** (`VgMWE`)

Address tabs: Zip Code field triggers [autofill: ZipCodeService] ->
City, State, Country auto-populated.
data.homeAddress 
- data.homeZipCode 
- data.homeCity 
- data.homeState 
- data.homeCountry
data.workAddress 
- data.workZipCode 
- data.workCity 
- data.workState 
- data.workCountry

**note: Custom fields** (`dsmG0`)

4 custom text fields (free text) + notes textarea.
data.custom1 
- data.custom2 
- data.custom3 
- data.custom4 
- data.notes

**note: Import** (`tcudU`)

File upload + force-update checkbox.
@shadcn/input[type=file] + @shadcn/checkbox
When checked, matching contacts (by email) are overwritten.

**note: Company autocomplete** (`AxHZn`)

Company field uses CompanyService.autocomplete.
@shadcn/combobox with async search.
Display: company.displayName

---

### `customer/customer-core/customer-list.pen`

**note1** (`YZIu0`)

W1: Customer List — 7-col grid + 3-tab detail dialog
• Tab 1: Contact (name*, email, webpage, uid, iban, bank, bic, representative, phones)
• Tab 2: Address (street, zip [autofill: ZipCodeService] → city/state/country)
• Tab 3: Billing [cond: role == ADMIN] — price list + discount collections [repeats]
• No filter panel — simple list
• Detail dialog: 900px @shadcn/sheet
• Grid: CustomerService.getAll
• [HARDCODED] 'Bank' column header, 'Abrechnung' tab title, 'Start' discount header

---

### `customer/customer-core/location-management.pen`

**note1** (`MrTvG`)

12-column DataTable: Name 
- Customer 
- Type 
- Address 
- Phone 
- Fax 
- patientDataType (icon) 
- patientDataAccess (badge) 
- Available 
- contactPerson 
- Email 
- Actions
Formatters: patientDataType shows icons, patientDataAccess shows colored status badge
Sorting: server-side on all columns 
- Pagination: server-side, 25 rows/page
---

[cond: patientDataType == PRECONFIGURED] — When INTERNAL_SECUREBOX or INTERNAL_VCCLOUD, Host/User/Password fields HIDDEN.
data.patientDataType (enum select) 
- data.patientDataAccess (status badge)
---

Show when patientDataType != INTERNAL_SECUREBOX/INTERNAL_VCCLOUD
---

Dynamic collection: Username 
- Server 
- Port 
- Actions
[repeats] row template
---

Fields: IBAN, BIC, Bank Name, Medical Contact (Doctor)
data.iban 
- data.bic 
- data.bankName 
- data.medicalContact
---

Address: Street, Zip [autofill: ZipCodeService] -> City, State, Country auto-filled
Building field
Leaflet/Mapbox [integration: Leaflet/Mapbox]
Lat/Lng [async: reverseGeocode]
---

Read-only rooms list. Managed from Room Management (W4).
Columns: Name 
- Number 
- Available 
- Description

---

### `customer/equipment/equipment-management.pen`

**note1** (`8En03`)

9-column DataTable: Inventory # 
- Name 
- Serial 
- Manufacturer 
- Location 
- Room 
- Status (badge) 
- Active 
- Actions
Status formatter: colored badge per EquipmentStatus enum
Sorting: server-side 
- Pagination: server-side, 25 rows/page

**note2** (`wzpKK`)

[cascade: location -> room]
Room select is disabled until Location is selected.
Changing Location resets Room selection.
Clearing Location disables Room again.

**note3** (`9P5z0`)

15 equipment fields in 3-column layout.
Cascading: Location -> Room (same as filter panel).
Status is [RO] on Tab 1 — only changeable via Tab 2.
Product field filtered by EQUIPMENT type.

**note4** (`6FYd1`)

Status change via comment: select new status + enter comment (min 4 chars) + submit.
Creates timestamped audit trail entry.
Controls disabled until equipment saved at least once.
Allowed transitions: see 5a state diagram in workflows.md

---

### `customer/room/room-management.pen`

**note1** (`tYPiz`)

Client-side search: instant filtering as user types. No server call.

**note2** (`GlE6K`)

5-column DataTable: Name 
- Number 
- Location 
- Available 
- Description
Client-side search: filters instantly on Name, Number, Location
Pagination: client-side

**note3** (`xcLNF`)

[integration: @fullcalendar/react] — Month/Week/Day views.
Availability slots = colored blocks from room plans (foreground events).
Appointments = background events with state-based coloring.
Plan sidebar lists plans with Add/Edit/Delete.

**note4** (`fEnXK`)

Equipment association via autocomplete search.
Added equipment appears in collection table with Remove action.
@shadcn/combobox + @shadcn/table

**note5** (`5PrGg`)

Room Plan sub-dialog: opens on top of room form.
Weekday toggles (Mon-Sun), time pickers, date range.
Empty 'until' date = open-ended plan.

---

## Planning

### `planning/appointment-admin/calculation.pen`

**note: EK Table** (`iUwOv`)

EK (Purchase) Table — 8 columns:
Physician (displayName + employeeType) 
- Location (.name) 
-
Patients (actualPatients) 
- Time/Patient (timePerPatient, human time) 
-
Time (payableWorkTime) 
- Payable Patients 
- EUR (payValue) 
- Total (payValueTotal)
Footer: data.ekValueTotal (currency format)
@service: AdminService.calcAppointment(appointmentId)

**note: VK Table** (`OMOn2`)

VK (Sale) Table — 5 columns:
Location (.name) 
- Time (billableWorkTime) 
-
Patients (billablePatients) 
- EUR (billValue) 
- Total (billValueTotal)
Footer: data.vkValueTotal (currency format)
View-only dialog — no edit capability

---

### `planning/appointment-admin/email-dialog.pen`

**note: Submit Dialog** (`fs6ls`)

Consultation Submit Dialog — confirms transmit action.
@service: ConsultationService.submit(consultationId, submitType)
4 submit types: Standard per Setting, Backup, Email, Download
Read-only fields: Patient Data Type, Patient Data Access
Conditional: Previous Result shown if prior transmission exists
Opens from consultation toolbar 'Submit' button

---

### `planning/appointment-admin/export-dialog.pen`

**note: Export Template** (`fsLe0`)

Template Export Dialog — 6 fields:
Year * 
- Month * (prefilled from toolbar) 
-
Export Template * (@shadcn/combobox, filter: APPOINTMENT,
CUSTOMER_SALE, EXPERT_BILLING, INVOICE_RECEIVER_SALE) 
-
Customer (optional autocomplete) 
- Location (optional) 
- User (optional)
@service: WorkExportService.startExport(templateId, data)
→ Opens Job Status Dialog with async polling

---

### `planning/appointment-admin/inline-consultation.pen`

**note: Grid Columns** (`m6WYK`)

13-column DataTable: ID 
- Date 
- From 
- Until 
- Location 
- Job 
- Physician 
- Type 
- State 
- Payment 
- Cancel 
- Count 
- Period
Payment color-coding: FULL=green, VK/EK=yellow, IGNORE=red
Sorting: server-side on all columns
Pagination: server-side, 100 rows/page
Search: client-side on assignedDisplayName, location.name, date, timeStart, timeEnd, id

**note: Time Columns** (`pBO2n`)

3-column time management:
1. Expert Times — reported by the assigned expert
2. Logging Times — from CDR call logs + phone icon for CDR assignment
3. Verified Times — admin-verified final times
Apply button copies Logging → Verified
Use Planned Times copies plan schedule → Verified
[cond: STORNO/CANCELED] hides active times, shows storno time field

**note: Consultation Toolbar** (`s6ALJ`)

11 consultation toolbar buttons:
Edit 
- QM 
- Transmit 
- Download 
- Copy 
- Upload 
- Logs 
- Delete 
- Doctor Select 
- Add (+) 
- Move
Doctor Select dropdown populated from data.appointment.assigned[]
where state in (AGREED, ADDED, ACCEPTED)
Add prefills: location, state=VERIFIED, communicationType=VIDEO,
contact/start from appointment time, end = start + 30min

**note: Consultation Table** (`9P741`)

13 inline-editable columns:
# 
- Dr icon 
- Patient (jNumber + bookNumber) 
- Location 
-
Contact [editable time] 
- Start [editable time] 
- End [editable time] 
-
Submit Date [RO] 
- Further Treatment [editable select] 
-
Payment icon (FULL=check, VK=cash, EK=doctor, IGNORE=ban) 
-
Comm Type [editable select] 
- Attachments count 
- Comment icon
data.consultations[] — inline time pickers for Contact/Start/End

**note: Summary Statistics** (`Gl6dw`)

Summary row shows: Patients (minPatients), Referral, Follow-up (WV),
Transfer, Unknown counts from data.summary.*
[cond: type=APPOINTMENT] shows QM comment textarea
Appointment comment textarea always visible

---

### `planning/appointment-admin/job-status.pen`

**note: Job Status** (`jlpwQ`)

Job Status Dialog — async job polling progress.
Shared template _include/jobStatusDlg.html
Polls WorkExportService.getStatus every 2s
Progress bar shows step N of M
When complete: download link appears
If queued: shows async queue navigation link
Cancel button only — job auto-completes

---

### `planning/appointment-admin/print-preview.pen`

**note: Print Preview** (`AtknN`)

Print Preview Dialog — shows invoice template preview.
@service: server-side template rendering via ExportService
Opens browser print dialog on 'Print' click
Preview area renders server-generated invoice HTML/PDF

---

### `planning/appointment-admin/qm-dialog.pen`

**note: QM Dialog** (`3bt9r`)

View-only QM questionnaire dialog
@service: QuestionaireService.getByAppointment(id)
or QuestionaireService.getByConsultation(id)
12 rating fields (1-6 scales) + equipment flags
+ translator/reporting Yes/No flags
All fields read-only — no editing capability
Error state: 'Data Not Found' alert if QM missing

---

### `planning/appointment-admin/state-legend.pen`

**note: State Legend** (`LToZX`)

State & Payment Legend — visual reference card.
Colors from appointmentStateFormatter + paymentType color mapping
12 appointment states across 2 rows
4 payment types in single row
Read-only reference dialog, Close button only

---

### `planning/appointment-support/cdr-assignment-crud.pen`

**note: CDR Assignment CRUD** (`nt3`)

@service: CdrCallAssignmentService.guessByAppointment(id)
.reassign(callId, appointmentId, consultationId)
Consultation dropdown: existing consultations + 'Create' option
On 'Create': AdminService.createCdrConsultation(appointmentId, callId)

---

### `planning/appointment-support/cdr-call-detail.pen`

**note: CDR Call Detail** (`nt2`)

@service: CdrCallService.get(id) / .save(id, data)
Status transitions: NEW→ACKNOWLEDGED→IN_PROGRESS→COMPLETED→ARCHIVED
Alternate: →ESCALATED→COMPLETED, →CANCELED
All fields except Status are read-only in ARCHIVED/CANCELED state

---

### `planning/appointment-support/cdr-call-list.pen`

**nt** (`75PXU`)

16-column DataTable: ID 
- Date 
- Time 
- Duration 
- Caller 
- Callee 
- Direction 
- Status 
- Assignment 
- Location 
- Job 
- Expert 
- Customer 
- Phone Numbers 
- Notes 
- Actions

7 statuses: NEW(blue), ACKNOWLEDGED(cyan), IN_PROGRESS(yellow), COMPLETED(green), ESCALATED(orange), ARCHIVED(gray), CANCELED(red)

Year/Month/Day filter auto-triggers on change

---

### `planning/appointment-support/cdr-status-legend.pen`

**note: CDR Status Legend** (`nt5`)

7 CDR call statuses with color-coded badges
Status drives available actions in detail dialog
ARCHIVED and CANCELED are terminal (read-only) states

---

### `planning/appointment-support/close-month.pen`

**note: Close Month** (`nt4`)

Shared dialog: used by Appointment Admin, Appointment Plan, Shift Plan
@service: ClosedMonthService.closeForExpert(year, month)
Toggle: if month already closed, button changes to 'Open Month'
and calls ClosedMonthService.openForExpert(year, month)

---

### `planning/appointment/appointment-assign-user.pen`

**State Options** (`y0jBx`)

State select options per row: ACCEPTED, RESERVED, AGREED (label: Override), REJECTED, ABORTED, REMOVE. Dialog only shown when getDuplicateEvents returns > 1 result.

---

### `planning/appointment/appointment-details-assigned.pen`

**note1** (`KPEFM`)

Assignment State Machine — Button Disable Rules:

ACCEPTED → disable: accept
REJECTED → disable: reject, abort
RESERVED → disable: reserve
ABORTED → disable: accept, reserve
CANCELED → disable: abort, accept, reserve
AGREED → disable: override, accept, reserve
DOUBLE_BOOKED → disable: reserve
DISAGREED → disable: accept, reject, abort, reserve

Role Icon Logic:
support=true → blue shield (Support)
support=false → green shield (Main)
support=null → stethoscope (Doctor)

**note2** (`JsF7O`)

Collision Handling (addUser):

On doctor autocomplete insert → AppointmentService.addUser(appointmentId, userId, false)

Error codes:
• double.booking → confirm(longMessage + proceed anyway?)
• expert.not.available → confirm(longMessage + proceed anyway?)
• expert.unavailable → confirm(longMessage + inactiveReason + proceed anyway?)

If user confirms → re-call with force=true.
If duplicates > 1 → opens W3 collision dialog.

Toolbar only visible in states: READY, STARTED, REOPENED, REQUESTED, LOCKEDIN.

---

### `planning/appointment/appointment-details-patients.pen`

**note1** (`ShFJs`)

Always visible (no state condition).

Add patient: PatientDataService.save({appointmentId, bookNumber}) → inserts row.
Edit icon → opens patientDataDlg (secondary dialog).
Remove icon → confirm → PatientDataService.remove([id]).
Sort arrows reorder patient rows.

Treatments table: data.treatments collection shown below patients.

---

### `planning/appointment/appointment-details-referenced.pen`

**note1** (`iSn0b`)

[cond: expertOnly=true] — This tab only visible when Expert Only checkbox is checked on Info tab.

State badge click → opens appointmentStateDlg (state transition dialog).
Edit icon → opens referencedAppointmentDialog (secondary, 800px).
Delete button enabled only when a row is selected.

On location autocomplete change → AppointmentService.createReference → opens referencedAppointmentDialog.

---

### `planning/appointment/appointment-details-suggestions.pen`

**note1** (`nOk6r`)

[state: READY
-STARTED
-REOPENED
-REQUESTED
-LOCKEDIN] — Tab only visible in these states.

Data source: AppointmentService.getSuggestions(appointmentId, 20)
Separate jsForm prefix: 'suggestion' (not 'data')
Collection path: suggestion.result

Duplicate filtering: suggestions already in actionAssigned collection are hidden.
Caching: suggestions cached in $detail.data().suggestions, cleared on dialog open or unsaved changes.

Add button (.userAdd) → AppointmentService.addUser(appointmentId, userId, false)
→ inserts into Assigned tab, removes from Suggestions.

Preference icons:
• wantFlag=true → thumbs-up (green)
• wantFlag=false/null → circle (gray)

Skills: nested collection result.employeeProfile.skills → comma-separated skills.skill.code

---

### `planning/appointment/appointment-details.pen`

**Tab Visibility Note** (`uns0l`)

Tab visibility: Info=always, Referenced=[expertOnly=true], Patients=always, Assigned=always, Suggestions=[state: READY
-STARTED
-REOPENED
-REQUESTED
-LOCKEDIN]. Employee actions toolbar same as Suggestions.

**Type Visibility Note** (`rZoVs`)

Type-driven fields: APPOINTMENT/TREATMENT → expertOnly, location, room. SHIFT → priceType (auto-suggest from date+time), minPatients. COUNCIL → jobSupport checkbox. Job filter changes by type.

**State Machine Note** (`OF4rE`)

State transition dialog: shows valid next states from ShiftLogic.getValidState(). STORNO adds date+time fields. Admin sees Delete button. 12 states total: READY→STARTED→REQUESTED→LOCKEDIN→ACTIVE→DONE→CLOSED→ARCHIVED (+ STORNO, CANCELED, RESCHEDULED, REOPEN).

**Assigned Tab Note** (`0yYm0`)

Assigned tab: doctor autocomplete + delete. Per-row actions: Accept, Reserve, Override (→AGREED), Reject, Abort, Send Reminder, History. Collision handling via assignAppointment() → W3 dialog if duplicates > 1.

---

### `planning/appointment/appointment-list.pen`

**Grid Structure Note** (`ey7Ze`)

MonthTable: rows = days of month (1–31), columns = jobs/services from AppointmentService. Cells contain state-colored appointment entries with nested sub-rows for assigned staff. NOT a standard DataTables table.

**Cell Rendering Note** (`eVMvr`)

Each cell: <span class='ap-{state}'> with state icon + name. Sub-rows: assigned staff with assignedState color + displayName. Missing staff shown as '--- (Missing)' with octagon icon. Referenced appointments show time range + location.

**Filter Panel Note** (`Tt6bf`)

Filter Panel (@shadcn/sheet, side='right'): filterDay (number input, filters rows), filterJob (text input, filters columns), filterState (select from AppointmentState enum, filters cells), Reset button. Opens via Filter toolbar button.

**Actions Note** (`4KWqT`)

Cell click → opens detail dialog (W2). Add → creates READY appointment with defaults. Edit → disabled until selection. Export → downloads .xls for current month. Reload → triggers reloadGrid event.

---

### `planning/council/apply-plan.pen`

**note** (`otADn`)

@service: CouncilPlanService.publishNext(date) -> jobId
Polls CouncilPlanService.getStatus(jobId)
On complete: CouncilPlanService.finishStatus(jobId)
Same async pattern as Shift Plan and Appointment Plan

---

### `planning/council/council-list.pen`

**note1** (`uzdiQ`)

10-column CRUD grid: council plan templates
Default on create: count=2, scheduling=WEEKLY
No Close Month button (unlike Shift Plan)
jobSupport column is council-specific
Doctors column shows preferred doctor collection
schedulingMulitplier has typo in legacy datamodel (kept as-is)

---

### `planning/council/council-plan-detail.pen`

**note** (`LFrb1`)

15 fields + preferred doctor collection with role assignments
Similar to Shift Plan but: no price type auto-suggestion,
jobSupport checkbox is council-specific,
doctor roles replace expert priority ordering
@service: CouncilPlanService.get/save/delete

---

### `planning/dashboard/calendar.pen`

**Calendar Note** (`og8oV`)

@fullcalendar/react v6 timeGridWeek. 5 entity types (HOLIDAY, PUBLICHOLIDAY, BIRTHDAY, APPOINTMENT, SHIFT) with 18 state colors each for APPOINTMENT/SHIFT. HSP contrast for text. BIRTHDAY click → sendMessage; other clicks disabled/missing in legacy.

---

### `planning/dashboard/end-shift.pen`

**Behavior Note** (`7D4RV`)

Save callback: AppointmentService.done(id, timeStart, timeEnd, qm). On error → dialog re-opens for correction. On success → page reloads. Triggered when .endAppointment clicked and ap.shift is truthy.

---

### `planning/dashboard/expert-availability.pen`

**Week View Note** (`Lhdre`)

Click column header → toggle all in column. Click hour label → toggle all in row. Appointment indicators overlay as colored type icons with popovers (@HH:MM-HH:MM title state). Week type select currently only TREATMENT.

**Month Grid Note** (`cnanW`)

4-row header: Row 1 (year + Shift/Appointment categories), Row 2 (month select + 6 slot labels), Row 3 (weekday counters cur/max per slot), Row 4 (weekend counters + 'Max before/after'). Each day row: day number, weekday name, 6 dayslot cells with tri-state + appointment indicator.

**Month Lock + Holiday Note** (`EOR0W`)

Month lock: data.locked=true → red alert banner, all cells dimmed (opacity 0.25), pointer-events: none. Holiday button → dialog with date range picker (start/end), calls ExpertDaysService.setHoliday(-1, start, until). Slot routing: SHIFT type → morning/afternoon/night; non-SHIFT → morningAppointment/afternoonAppointment/treatmentAppointment.

---

### `planning/shift/apply-plan.pen`

**note1** (`5YzX9`)

@service: ShiftPlanService.publishNext(date) -> jobId
Opens Job Status dialog with polling:
ShiftPlanService.getStatus(jobId)
On complete: ShiftPlanService.finishStatus(jobId)
Shared pattern with Appointment Plan and Council Plan

---

### `planning/shift/shift-list.pen`

**note1** (`v2nru`)

10-column CRUD grid: shift plan templates
NOT the MonthTable calendar (that's specs/wireframes/planning/appointment/)
Preferred Doctors: ordered collection with priority
Price Type auto-suggested from weekday+time matrix:
MO-FR <18=WEEKDAY, >=18=WEEKNIGHT
SA/SU/HO <18=WEEKENDDAY, >=18=WEEKENDNIGHT
Scheduling types: WEEKLY, FIRSTOFMONTH, XOFMONTH, LASTOFMONTH

---

### `planning/shift/shift-plan-detail.pen`

**note1** (`P81W9`)

15 form fields + preferred expert ordered collection
Price type auto-suggested on weekday+time change
Expert collection: sortable, with priority ordering
@service: ShiftPlanService.get/save/delete
Collision detection on save: PlanCollisionService.getDoctorAppointmentCollision

---

### `planning/shift/state-legend.pen`

**note1** (`rke1F`)

12 shift states = subset of appointment states
Shift uses same state machine as Appointment
Colors match appointmentStateFormatter in messages.i18n.js

---

## System

### `system/dashboard/dashboard-admin.pen`

**adminAnnot** (`0lo8X`)

[ADMIN] role requirement — all panels on this page are admin-only

**annot2** (`Jaixh`)

[HARDCODED] German strings: 'Active Calls', card headers. All panels require [ADMIN] role.

---

### `system/dashboard/dashboard-standard.pen`

**motdAnnot** (`wJHME`)

[markdown] body, priority-based styling, optional image positioning (LEFT/TOP/BOTTOM/BACK)

**apptAnnot** (`O8joj`)

Button visibility depends on state + control + shift + location flags

**consAnnot** (`tWtQT`)

Status columns: ✓=complete (green), ?=pending (red), —=N/A (gray)

**treatAnnot** (`gnIDV`)

Hidden when empty

---

### `system/dashboard/login-notification.pen`

**n1Annot** (`uyPVV`)

[markdown] rendered body content

**sepAnnot** (`oV0ti`)

Multiple notifications joined with '---' separators

**cancelAnnot** (`3crhW`)

Cancel → logout

**mainAnnot** (`GhHAB`)

Non-dismissible Bootstrap modal (data-bs-backdrop=static). Shown after login if pending notifications exist. Decline (Cancel) → immediate logout. Blocks ALL dashboard interaction until resolved.

---

### `system/notification/notification-list.pen`

**adminNote** (`pMIIb`)

[ADMIN] Bulk Message button visible only to admins

**tableNote** (`yQHAR`)

Selectable rows, [repeats], data from NotificationService.list

**detailNote** (`LTJjj`)

Detail expands inline below selected row, not a separate route

---

### `system/notification/send-message.pen`

**annotation** (`8melY`)

Dashboard-included quick compose. Can be pre-filled from context (e.g., birthday card: subject='Happy Birthday', message=greeting template). Focus goes to textarea if recipient pre-filled, otherwise to recipient input.

---

### `system/shell/app-shell-layout.pen`

**?** (`annotation`)

W7: App Shell Layout

Components:
• Sidebar: 240px (@shadcn/Sidebar)
• Top bar: 48px height
• User menu: @shadcn/DropdownMenu

Data bindings:
• user.displayName
• i18n.application.version

Permission gates:
• [PERM: USERS_CREATE] on role switch

**sidebarNote** (`turSx`)

Sidebar Component

@shadcn/Sidebar
240px expanded, 64px collapsed
Sitemap-driven navigation items

---

### `system/shell/global-navigation.pen`

**?** (`nav-annotation`)

W8: Global Navigation

Expanded State (240px):
• Logo area (64px height)
• Sitemap-driven menu items
• Color-coded: bg-color per module
• Active state highlight
• Accordion submenus

Collapsed State (64px):
• Icons only
• Hover tooltips
• Logo icon variant

Sitemap iteration renders nav items
Lucide icons per module

**expandedNote** (`3Xnut`)

Expanded Sidebar (240px)

@shadcn/Sidebar
Sitemap-driven iteration
bg-color per module
Active state highlight

**collapsedNote** (`BcZdq`)

Collapsed Sidebar (64px)

Icons only
Hover tooltips for labels

---

### `system/shell/user-menu.pen`

**?** (`menu-annotation`)

W9: User Menu

@shadcn/DropdownMenu

Menu Items:
1. Settings → profile.html
2. Security → userSecurity.html
3. Role Switch → Opens dialog [PERM: USERS_CREATE]
4. Bug Report → Opens dialog
5. Logout → logout endpoint

Data bindings:
• user.displayName
• role (current user role)
• i18n translation keys

Hardcoded German roles:
• Neu Registriert → role.REGISTERED
• Standard → role.STANDARD

---

## Treatment

### `treatment/consultation/consultation-details-header.pen`

**?** (`Cie35`)

Tab visibility controlled by data.type:
• EXTERNAL: Patient + Submit only
• STANDARD: Patient + Standard + Warning + QM(shift) + Submit
• ONBOARDING: Patient + Onboarding + Rx(if additionalPrescription) + Warning + QM(shift) + Submit
• ONBOARDING_SHORT: Patient + OnboardShort + QM(shift) + Submit
• INCARCERATION: Patient + Incarceration + Standard(partial) + QM(shift) + Submit
• TREATMENT: Patient + Treatment + Submit
• DOCUMENT: Patient + Document + QM(shift) + Submit

Tab status icons: check = complete, ? = incomplete, spinner = loading
Fields only editable when state = OPEN
Header: bookNumber [RO], gender/birthday [internalOnly], date/start [mandatory]

---

### `treatment/consultation/consultation-details-incarceration.pen`

**note1** (`plVuf`)

W5 – consultation-details-incarceration.pen
Incarceration form with 6 blocks, 51 fields total.
Note: cross-model bindings to onboarding data exist (physical findings, etc.).

**note2** (`mgnC7`)

[SIREN] Animated siren icon next to incarceration type select

**note3** (`kGXeJ`)

Values: INCARCERATION 
- LIABILITY

**note4** (`KKZFc`)

Stadium values: NONE, STAGE_1 (Euphoria), STAGE_2 (Excitement), STAGE_3 (Confusion), STAGE_4 (Stupor), STAGE_5 (Coma)

---

### `treatment/consultation/consultation-details-onboarding.pen`

**note1** (`87wt7`)

W4 – consultation-details-onboarding.pen
Full onboarding form with ~50 fields split into 2 major rows.
Row 1: Medical History & Examination
Row 2: Evaluation
Note: ONBOARDING_SHORT is a strict subset — only generalState, weightState + evaluation section.

**note2** (`oke1Y`)

[conditionize2: OTHER shows textarea]
When 'OTHER' is selected, show additional textarea below.

**note3** (`PTOhE`)

Each infectious disease: UNKNOWN / SURE / EXCLUDED

**note4** (`TLeje`)

ONBOARDING_SHORT note:
ONBOARDING_SHORT is a strict subset of this form.
It only includes:
- generalState (from Row 1 States section)
- weightState (from Row 1 States section)
- Entire Evaluation section (Row 2)
All other fields in Row 1 (family history, physical findings, organ systems, etc.) are hidden for ONBOARDING_SHORT.

---

### `treatment/consultation/consultation-details-standard.pen`

**note1** (`BCovq`)

W3 – consultation-details-standard.pen
Shows 7 card-sections for type=STANDARD.
All sections except Diagnosis & Prescription are hidden when [incarceration-hide] is active.
Each section is a card with header + body.

**note2** (`d75j2`)

Repeater: each row has type enum + documentation textarea.
Type enum values (11): CURRENT_COMPLAINTS, PREVIOUS_ILLNESSES, OPERATIONS, ACCIDENTS, ALLERGIES, FAMILY_HISTORY, SOCIAL_HISTORY, SUBSTANCE_USE, MEDICATION_HISTORY, IMMUNIZATIONS, OTHER

**note3** (`kknbu`)

Repeater: type enum + documentation textarea.
Type enum (10): GENERAL_STATE, SKIN, HEAD_NECK, CARDIOVASCULAR, RESPIRATORY, GASTROINTESTINAL, MUSCULOSKELETAL, NEUROLOGICAL, PSYCHOLOGICAL, OTHER

**note4** (`v3qYp`)

Repeater: each row = a diagnosis entry.
Fields: localization select (L/R/B/UNKNOWN), diagnosticLevel (V/Z/G), title [RO], ICD-10 inclusion/exclusion rendered, comment, ICD-10 search button.
ICD-10 search opens W9 modal.

**note5** (`iKDxf`)

MOST COMPLEX section.
Each prescription row: product select OR custom entry, packaging enum, nested activeIngredients repeater (name, amount, description), dosage amount, prescription type (STANDARD/LIMITED/LONGTERM), conditional dosage grid (morning/noon/evening/night for LIMITED/LONGTERM), start/end dates, initial dosage given checkbox, allow substitute checkbox.
[incarceration-hide]

---

### `treatment/consultation/consultation-details-treatment-warning.pen`

**note1** (`7Nt93`)

W6 – consultation-details-treatment-warning.pen
Two sections:
1. Treatment Form: 15 textareas in sections. No required fields.
2. Warning Form: 4 category selects + warning collection with conditionize2.

**note2** (`AzdV1`)

[conditionize2: noWarnings=true hides warningCollection]

---

### `treatment/consultation/consultation-export-template.pen`

**note1** (`iv5q6`)

W10 – consultation-export-template.pen
Export template modal (600px wide).
Fields: Year, Month, Template (required, filter=CONSULTATION), Customer, Location, Expert/Doctor autocomplete.
Buttons: Export + Cancel.

---

### `treatment/consultation/consultation-icd10-search.pen`

**note1** (`nAmpr`)

W9 – consultation-icd10-search.pen
ICD-10 search modal dialog (600px wide).
Search input at top, results list with code/title/inclusions/exclusions, select button per result.

---

### `treatment/consultation/consultation-list.pen`

**note1** (`sfVus`)

Toolbar buttons:
• View — opens edit dialog (OPEN) or view dialog (other states)
• Review — [PERM: CONSULTATION_REPORTING 
- CONSULTATION_ADMIN]
• Delete — [PERM: ADMIN only]
• Download — PDF generation, guards on baseCompleted
• Export — XLS by year/month
• Template Export — opens export template dialog

Filter panel (offcanvas right):
• Date range (from/to)
• State select (6 states: CREATED→VERIFIED)
• Doctor autocomplete
• Max results select

Grid columns: date, start, end, bookNumber [HARDCODED: "Patient"], location, type, state, doctor, requireReporting, reportingDocumentation

Data binding: ConsultationService.getAll(filter, 100)

---

### `treatment/consultation/consultation-review.pen`

**note1** (`KxMM6`)

W8 – consultation-review.pen
Review dialog with 75%/25% split.
Left (75%): read-only consultation view (abbreviated)
Right (25%): review sidebar with expert name, report end date, markdown editor (70vh, mandatory), 4 buttons.
3-step workflow: no reporting → editing → verified.

**note2** (`6D2FV`)

3-step workflow:
1. No Reporting — review not started, Start Review button active
2. Editing — review in progress, Save/Download active
3. Verified — review submitted, all buttons disabled

markdown editor is mandatory for submission.

**note3** (`8TNtn`)

Height: 70vh (approx 500px in wireframe).
Markdown editor with toolbar (bold, italic, list, heading).
Mandatory for Submit Review.

---

### `treatment/consultation/consultation-view.pen`

**note1** (`afvpf`)

W7 – consultation-view.pen
Read-only view dialog showing type-conditional content.
Type-specific sections:
- STANDARD → tabStandard + tabWarning
- ONBOARDING → tabPatientData + tabOnboarding
- INCARCERATION → tabIncarcerationData
- TREATMENT → tabTreatment
- DOCUMENT → tabDocumentation
Buttons: OK (close), Download (PDF)

**note2** (`yl5HD`)

Sections shown depend on consultation type:
- STANDARD → tabStandard + tabWarning
- ONBOARDING → tabPatientData + tabOnboarding
- INCARCERATION → tabIncarcerationData
- TREATMENT → tabTreatment
- DOCUMENT → tabDocumentation

---

### `treatment/questionnaire/questionnaire-list.pen`

**Grid Note** (`ioKKP`)

24 total columns — showing representative subset. Horizontal scroll for overflow. Column widths/order saved per user via settings API. Max 100 records displayed.

---

## User-Management

### `user-management/dashboard/user-stats.pen`

**usnote** (`i8ax0`)

User Stats Dialog (W14):
- Date input triggers InfoService.getNumbers(date)
- Collection: department.description, available, booked
- Holiday column: header icon exists but NO data field in row template (known gap)
- [HARDCODED] column header titles: Verfugbar, Gebucht, Urlaub
- No permission gating (all dashboard users)
@shadcn/dialog + @shadcn/table

---

### `user-management/new.pen`

**note1** (`gCUsa`)

Tab visibility:
- Tabs 1-4 (white bg): ALL users (EMPLOYEE authority)
- Tabs 5-8 (orange bg): ADMIN only
Form shared between personal profile and staff list detail
@shadcn/tabs with icon+label items

**note2** (`wJAtt`)

Additional fields not shown:
- On-call number, Email 2, Notification checkbox
- [PERM: ADMIN] Notification exclusions: 20 NotificationEvent checkboxes in 4-col grid

Field annotations: * = required, data.path = binding
All inputs @shadcn/input, selects @shadcn/select
Dates use @shadcn/calendar + @shadcn/popover DatePicker pattern

**note3** (`uAkOM`)

Additional admin-only fields not shown:
- Qualification Level (select: ONBOARDING
-ROOKIE
-AMATEUR
-PROFI)
- Experience: Addiction Medicine (5-level select)
- Focus: Shift/Appointment/Therapy (3-level + none selects)
- Current Income (number)
All fields use @shadcn/select or @shadcn/input

**snote** (`pFHO0`)

Staff List features:
- A-Z quick filter on username field, with text search
- 10-column grid: firstName, lastName, state, shift, appointment, therapy, lastReminder, 2FA (lock icon), enabled (lightbulb)
- Row selection enables: Edit, Onboarding, Assignments, Password, Invoice buttons
- Always enabled: Add, Export, Expert Search
- Row double-click opens inline detail panel (shared profile form)
- Right-side filter panel (@shadcn/sheet): name, email, job autocomplete, skill autocomplete
- Data source: UserService.getExperts with client-side search on firstName/lastName/email

**esnote** (`fu6ug`)

Expert Search features:
- Job autocomplete filter (JobService)
- Active toggle (default: true)
- Skills collection: insert via autocomplete, delete chips, AND-logic client-side filter
- Exclusion Criteria collection: same pattern, hides matching rows
- Results: name, skills (nested), exclusion criteria (nested), qualification level (disabled select)
- Deep-link icon to appointment.html#id if expert has appointment

**anote** (`D74bP`)

Assignment Dialog:
- Year/Month filter pre-filled with current-1 month
- AppointmentService.getByUser(userId, year, month)
- Accept: confirm 'Accept user?' -> adjustUser(id, AGREED)
- Reject: confirm 'Reject user?' -> adjustUser(id, REJECTED)
- Export downloads .xls for user/period
- Nested: additionalAssignments displayName per row
@shadcn/dialog + @shadcn/alert-dialog for confirms

**snote** (`cfzdt`)

Signature Pad:
- Uses SignaturePad library (signature_pad.umd.min.js)
- High-DPI canvas: devicePixelRatio scaling
- Config: transparent bg, max stroke 1.5
- Sign: toDataURL() -> UserService.updateSignature(userId, base64)
- Clear: signaturePad.clear() + resizeCanvas()
- Included by personal.htmlm AND staff.htmlm
@shadcn/dialog + react-signature-canvas

**mnote** (`bCPdl`)

Month Grid (Expert Days):
- 31 rows (days) x 6 slot columns (3 shift + 2 appointment + 1 treatment)
- Tri-state cells: null (circle) -> true (green check) -> false (red X) -> null
- Click interactions: cell (single slot), day# (equalize 6 slots), weekday name (copy to same weekday), column header (equalize column)
- Weekend rows highlighted yellow, public holidays marked
- Summary rows show current/max counts for weekday/weekend
- Appointment overlay icons (shift/council/appointment) with popovers
- Month can be locked by planning (non-ADMIN users see disabled grid + alert)
- ExpertDaysService.get/save

**wnote** (`hKePp`)

Week Grid (Expert Week):
- 24 rows (hours 01:00-24:00) x 7 day columns (Mon-Sun)
- Binary state cells: null (X, no color) -> true (green check) -> null
- Click interactions: cell (single slot), hour label (equalize 7 slots), column header (equalize column)
- Type selector: only TREATMENT currently
- Locked cells checked via .locked CSS class
- Known bug: slotsSo (server) vs slotsSu (UI) naming mismatch for Sunday
- ExpertWeekService.getUser/save

**usnote** (`i8ax0`)

User Stats Dialog (W14):
- Date input triggers InfoService.getNumbers(date)
- Collection: department.description, available, booked
- Holiday column: header icon exists but NO data field in row template (known gap)
- [HARDCODED] column header titles: Verfugbar, Gebucht, Urlaub
- No permission gating (all dashboard users)
@shadcn/dialog + @shadcn/table

---

### `user-management/profile/profile-assignment-dialog.pen`

**anote** (`D74bP`)

Assignment Dialog:
- Year/Month filter pre-filled with current-1 month
- AppointmentService.getByUser(userId, year, month)
- Accept: confirm 'Accept user?' -> adjustUser(id, AGREED)
- Reject: confirm 'Reject user?' -> adjustUser(id, REJECTED)
- Export downloads .xls for user/period
- Nested: additionalAssignments displayName per row
@shadcn/dialog + @shadcn/alert-dialog for confirms

---

### `user-management/profile/profile-expert-availability.pen`

**mnote** (`bCPdl`)

Month Grid (Expert Days):
- 31 rows (days) x 6 slot columns (3 shift + 2 appointment + 1 treatment)
- Tri-state cells: null (circle) -> true (green check) -> false (red X) -> null
- Click interactions: cell (single slot), day# (equalize 6 slots), weekday name (copy to same weekday), column header (equalize column)
- Weekend rows highlighted yellow, public holidays marked
- Summary rows show current/max counts for weekday/weekend
- Appointment overlay icons (shift/council/appointment) with popovers
- Month can be locked by planning (non-ADMIN users see disabled grid + alert)
- ExpertDaysService.get/save

**wnote** (`hKePp`)

Week Grid (Expert Week):
- 24 rows (hours 01:00-24:00) x 7 day columns (Mon-Sun)
- Binary state cells: null (X, no color) -> true (green check) -> null
- Click interactions: cell (single slot), hour label (equalize 7 slots), column header (equalize column)
- Type selector: only TREATMENT currently
- Locked cells checked via .locked CSS class
- Known bug: slotsSo (server) vs slotsSu (UI) naming mismatch for Sunday
- ExpertWeekService.getUser/save

---

### `user-management/profile/profile-expert-search.pen`

**esnote** (`fu6ug`)

Expert Search features:
- Job autocomplete filter (JobService)
- Active toggle (default: true)
- Skills collection: insert via autocomplete, delete chips, AND-logic client-side filter
- Exclusion Criteria collection: same pattern, hides matching rows
- Results: name, skills (nested), exclusion criteria (nested), qualification level (disabled select)
- Deep-link icon to appointment.html#id if expert has appointment

---

### `user-management/profile/profile-form.pen`

**note1** (`gCUsa`)

Tab visibility:
- Tabs 1-4 (white bg): ALL users (EMPLOYEE authority)
- Tabs 5-8 (orange bg): ADMIN only
Form shared between personal profile and staff list detail
@shadcn/tabs with icon+label items

**note2** (`wJAtt`)

Additional fields not shown:
- On-call number, Email 2, Notification checkbox
- [PERM: ADMIN] Notification exclusions: 20 NotificationEvent checkboxes in 4-col grid

Field annotations: * = required, data.path = binding
All inputs @shadcn/input, selects @shadcn/select
Dates use @shadcn/calendar + @shadcn/popover DatePicker pattern

**note3** (`uAkOM`)

Additional admin-only fields not shown:
- Qualification Level (select: ONBOARDING
-ROOKIE
-AMATEUR
-PROFI)
- Experience: Addiction Medicine (5-level select)
- Focus: Shift/Appointment/Therapy (3-level + none selects)
- Current Income (number)
All fields use @shadcn/select or @shadcn/input

---

### `user-management/profile/profile-signature-pad.pen`

**snote** (`cfzdt`)

Signature Pad:
- Uses SignaturePad library (signature_pad.umd.min.js)
- High-DPI canvas: devicePixelRatio scaling
- Config: transparent bg, max stroke 1.5
- Sign: toDataURL() -> UserService.updateSignature(userId, base64)
- Clear: signaturePad.clear() + resizeCanvas()
- Included by personal.htmlm AND staff.htmlm
@shadcn/dialog + react-signature-canvas

---

### `user-management/profile/profile-staff-list.pen`

**snote** (`pFHO0`)

Staff List features:
- A-Z quick filter on username field, with text search
- 10-column grid: firstName, lastName, state, shift, appointment, therapy, lastReminder, 2FA (lock icon), enabled (lightbulb)
- Row selection enables: Edit, Onboarding, Assignments, Password, Invoice buttons
- Always enabled: Add, Export, Expert Search
- Row double-click opens inline detail panel (shared profile form)
- Right-side filter panel (@shadcn/sheet): name, email, job autocomplete, skill autocomplete
- Data source: UserService.getExperts with client-side search on firstName/lastName/email

---

