---
title: 'Wireframe Plan Registry'
---

# Wireframe Plan Registry

> **Status**: COMPLETE — All wireframe plans consolidated as of 2026-04-05
> 
> This is the **single source of truth** for all wireframe planning information. Individual `wireframe-plan*.md` files have been consolidated into this registry and can be safely removed.

## Quick Reference

| Domain | .pen Files | PNG Exports | Location |
|:---|:---:|:---:|:---|
| Academy | 4 | 8+ | `specs/wireframes/academy/` |
| Accounting | 6 | 12+ | `specs/wireframes/accounting/` |
| Customer | 5 | 10+ | `specs/wireframes/customer/` |
| Interfaces | 1 (8 frames) | 9 | `specs/wireframes/interfaces/dashboard/` |
| Planning | 33 | 50+ | `specs/wireframes/planning/` |
| System | 20 | 35+ | `specs/wireframes/system/` |
| Treatment | 24 | 40+ | `specs/wireframes/treatment/` |
| User Management | 14 | 25+ | `specs/wireframes/user-management/` |
| **TOTAL** | **107** | **150+** | — |

---

## Design System Reference

### Color Variables

| Token | Value | Usage |
|:---|:---|:---|
| `$--bg` | `#FFFFFF` | Page and panel backgrounds |
| `$--fg` | `#0A0A0A` | Primary text |
| `$--fg-muted` | `#737373` | Muted/secondary text |
| `$--border` | `#E5E5E5` | Dividers, table borders, input strokes |
| `$--primary` | `#171717` | Primary buttons, active states |
| `$--primary-fg` | `#FAFAFA` | Text on primary background |
| `$--secondary` | `#F5F5F5` | Secondary backgrounds |
| `$--secondary-fg` | `#171717` | Text on secondary background |
| `$--input-border` | `#D4D4D4` | Input field strokes |
| `$--info-bg` | `#EFF6FF` | Info alert backgrounds |
| `$--info-fg` | `#1D4ED8` | Info alert text |
| `$--danger-bg` | `#FEF2F2` | Danger alert backgrounds |
| `$--destructive` | `#DC2626` | Destructive buttons, errors |
| `$--warning-bg` | `#FFFBEB` | Warning alert backgrounds |
| `$--warning` | `#F59E0B` | Warning text |
| `$--success-bg` | `#F0FDF4` | Success alert backgrounds |
| `$--success-fg` | `#166534` | Success text |
| `$--card` | `#FAFAFA` | Card backgrounds |
| `$--header-bg` | `#F98E33` | Module header backgrounds |
| `$--header-fg` | `#FFFFFF` | Header text |

### Typography

| Property | Value |
|:---|:---|
| Font Family | Inter |
| Font Sizes | 13px (labels), 14px (body), 16-20px (headings) |
| Font Weights | 400 (normal), 500 (medium), 600 (semibold), 700 (bold) |

### Component Conventions

| Component | Convention |
|:---|:---|
| Dialog | 600px width, cornerRadius 12, shadow effect, `$--bg` fill, `$--border` stroke |
| Drawer | 1100px width for complex forms, side="right" |
| Full Page | 1440px width for grid/list views |
| Header | padding [20,24], bottom border, Inter 20px bold, `$--header-bg` fill |
| Body | padding 24, vertical layout, gap 16 |
| Footer | top border, justify end, gap 12, Cancel (secondary) + primary button |
| Input | cornerRadius 8, padding [10,14], `$--input-border` stroke |
| Alert | cornerRadius 8, padding 16, contextual fill colors |

---

## Annotation Legend

All wireframes use this standardized annotation system:

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key — string is hard-coded in legacy |
| `[repeats]` | Collection row template (inline add/delete/sort) |
| `[cond: expr]` | Dynamic visibility condition |
| `[async: poll Xms]` | Async operation / polling state |
| `[calc: formula]` | Auto-calculated / derived field |
| `[matrix: dims]` | Grid/matrix layout with specified dimensions |
| `[multi-entity: type]` | Multi-entity navigation within same view |
| `[bulk: action]` | Bulk operation affecting multiple records |
| `[batch: description]` | Batch-generated records (no manual CRUD) |
| `[nested: parent → child]` | Nested sub-collection within a collection |
| `[DataTable]` | Migrated from SlickerGrid to Shadcn DataTable pattern |
| `[cascade: A → B]` | Cascading dependency between fields |
| `[autofill: ServiceName]` | Auto-fill from service lookup |
| `[integration: lib]` | Third-party integration (FullCalendar, Leaflet, etc.) |
| `[custom: ComponentName]` | Custom component not from Shadcn registry |
| `[PERM: key]` | Permission-gated element |
| `[state: X]` | Shown only in state X |
| `[type: X]` | Shown only for type X |
| `[color: class]` | State-based color annotation |
| `[SIREN]` | Siren flash animation (incarceration) |
| `[embed: QM questionnaire]` | Embedded QM form |
| `[masked: location.booknumberMask]` | Dynamic input mask |
| `[autocomplete: Service.method]` | Autocomplete data source |
| `[filtered: job capabilities]` | Options filtered by job capability flags |
| `[default: value]` | Default/pre-selected value |
| `[dynamic-title: type→label]` | Dialog title changes based on type |
| `data.field.path` | Datamodel binding annotation |
| `@shadcn/component` | Target Shadcn UI component mapping |

---

## Domain: Academy

**Analysis Source**: `specs/analysis/academy/`  
**Wireframes Location**: `specs/wireframes/academy/support-video/`  
**Status**: ✅ Complete (4/4 wireframes)

### Wireframe Inventory

| ID | Wireframe | .pen File | Description | Complexity |
|:---|:---|:---|:---|:---|
| W1 | Support Ticket | `support-ticket.pen` | 6-col grid, cascading 3-level category selects, view modal (800px) with comment thread + reply | Medium |
| W2 | Video Management | `video-management.pen` | 7-col grid, category autocomplete, two player dialogs (video.js 800px + iframe 1200px) | Medium |
| W3 | Video Library | `video-library.pen` | Card-based browsing, hash deep linking, progress tracking, full-viewport players | Medium-High |
| W4 | Video Category | `video-category.pen` | 4-col grid, thumbnail upload + job collection, add video/stream dialog (two-column) | Medium-High |

### Shadcn Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| SlickerGrid | `@shadcn/table` + DataTable | All list views |
| Cascading selects (3-level) | 3× `@shadcn/select` chained | Support ticket category hierarchy |
| View modal | `@shadcn/dialog` (800px) | Ticket details + comment thread |
| Comment thread | `@shadcn/card` repeated | Each comment: dateCreated, subject, from, to, body |
| Video player (local) | video.js | Context menu disabled, no download |
| Video player (stream) | `<iframe>` | External embed |
| Card-based browsing | `@shadcn/card` grid | Video library |
| Chunked upload | Custom component | 3MB chunks, progress bar, pause/resume |
| Autocomplete inputs | `@shadcn/combobox` | Category, video, job autocompletes |

### Key Findings

- **Cascading Category Selects**: 3-level chained selects with auto-fill on final selection
- **Video Type Routing**: VIDEO → video.js, STREAM → iframe, PDF → window.open
- **Chunked Upload**: HugeUploader.js with 3MB chunks, pause/resume
- **Card-Based Browsing**: Only Academy view using cards instead of DataTable
- **Comment Thread**: Scrollable thread with reply textarea

---

## Domain: Accounting

**Analysis Source**: `specs/analysis/accounting/`  
**Wireframes Location**: `specs/wireframes/accounting/`  
**Status**: ✅ Complete (6/6 wireframes)

### Wireframe Inventory

| ID | Wireframe | .pen File | Description | Complexity |
|:---|:---|:---|:---|:---|
| W1 | Invoice List | `invoice-list.pen` | Month/year filter, 11-col DataTable, 12 toolbar buttons, 4 export dialogs | High |
| W2 | Invoice Details | `invoice-details.pen` | 1100px drawer, 4-col header, positions table, print preview, email, storno dialogs | Very High |
| W3 | Worklog | `worklog.pen` | Month/year filter, 8-col DataTable + 21-col weekly matrix (expert × day × shift) | Medium |
| W4 | Invoice Receiver | `invoice-receiver.pen` | Filter panel, 2-tab detail (35 payment fields + product order table) | High |
| W5 | Job Configuration | `job-configuration.pen` | 8-col DataTable, 2-tab dialog (1200px), type-conditional pricing matrix | Very High |
| W6 | Accounting Config | `accounting-config.pen` | 5 config CRUDs as tabs: storno groups, price lists, products, closed months, expert work monthly | High |

### Shadcn Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| Month/Year selector | `@shadcn/select` + `@shadcn/input` | Invoice list, worklog filters |
| Detail drawer (1100px) | `@shadcn/sheet` or `@shadcn/dialog` | Invoice details |
| Inline collections | `@shadcn/table` inline editing | Positions, products, storno rules, prices, skills |
| Autocomplete inputs | `@shadcn/combobox` | Product, customer, location, skill lookups |
| Async polling dialog | `@shadcn/dialog` + progress | ZIP download, template export status |
| Print preview | `@shadcn/dialog` (full-width) | Invoice PDF preview |

### Key Findings

- **Month/Year Filter**: Reused across Invoice List, Worklog, Expert Work Monthly
- **Customer/Location Mutex**: Selecting one clears the other in Invoice Receiver
- **Type-Conditional Sections**: Job Config shows different pricing by type (SHIFT/APPOINTMENT/COUNCIL)
- **21-Column Matrix**: Worklog weekly assignments (7 days × 3 shifts)
- **35 Payment Fields**: Invoice Receiver exceptionally large form

---

## Domain: Customer

**Analysis Source**: `specs/analysis/customer/`  
**Wireframes Location**: `specs/wireframes/customer/`  
**Status**: ✅ Complete (5/5 wireframes)

### Wireframe Inventory

| ID | Wireframe | .pen File | Description | Complexity |
|:---|:---|:---|:---|:---|
| W1 | Customer List | `customer-list.pen` | 7-col grid, 3-tab detail (contact, address, admin-only billing) | Medium |
| W2 | Location Management | `location-management.pen` | 12-col grid, filter panel, 3-tab detail (~31 fields), Leaflet map | High |
| W3 | Contact Management | `contact-management.pen` | A-Z quick filter, 13-col grid, 4-tab detail, QR code, import dialog | Medium-High |
| W4 | Room Management | `room-management.pen` | 5-col grid, 3-tab detail, FullCalendar planning, equipment collection | High |
| W5 | Equipment Management | `equipment-management.pen` | 9-col grid, cascading Location→Room filters, 2-tab detail (status/comments) | Medium |

### Shadcn Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| A-Z Quick Filter | Custom component | Contact only: letter buttons + range groupings |
| Leaflet Map | `react-leaflet` | Location geocoding + reverse geocoding |
| FullCalendar | `@fullcalendar/react` | Room planning: month/week/day views |
| Cascading filters | Controlled `@shadcn/combobox` | Equipment: Location → Room dependency |
| QR code display | QR library | Contact detail |
| Tag-it multi-tag | Custom tag input | Contact categories |

### Key Findings

- **Conditional Visibility**: Location patientDataType controls SFTP/connection fields
- **Cascading Filters**: Equipment Location → Room dependency
- **A-Z Quick Filter**: Unique to Contact management
- **Map Integration**: Leaflet/Mapbox for location address Tab 2
- **Status-Change-Via-Comment**: Equipment Tab 2 pattern

---

## Domain: Interfaces

**Analysis Source**: `specs/analysis/interfaces/dashboard/`  
**Wireframes Location**: `specs/wireframes/interfaces/dashboard/`  
**Status**: ✅ Complete (8 frames in 1 file)

### Wireframe Inventory

| ID | Frame | Step | Content | Complexity |
|:---|:---|:---|:---|:---|
| W6-1 | `step-1-start` | bww-start | Consultation type select + JNumber search + results table + info alerts | High |
| W6-2 | `step-2-notavailable` | bww-notavailable | Book number input + danger + warning alerts | Low |
| W6-3a | `step-3-getting` | bww-getting | JNumber + UUID labels + spinner | Low |
| W6-3b | `step-3-error` | bww-getting (error) | Error message + support mailto + Error button | Low |
| W6-4 | `step-4-pin` | bww-pin | PIN input with key icon + JNumber/UUID labels | Low |
| W6-5a | `step-5-loading` | bww-loading | JNumber + UUID labels + spinner | Low |
| W6-5b | `step-5-error` | bww-loading (error) | Error message + Retry button | Low |
| W6-6 | `step-6-success` | bww-success | Summary read-only fields + disabled type select | Low |

### Shadcn Component Mapping

| Wizard Element | Shadcn Component | Notes |
|:---|:---|:---|
| Modal container | `@shadcn/dialog` | 600px width, `bg-color-basisWebData` header |
| Consultation type dropdown | `@shadcn/select` | Dynamic option hiding per step |
| JNumber results table | `@shadcn/table` | Selectable rows with radio behavior |
| Info/warning/danger alerts | `@shadcn/alert` | Step 1 info, step 2 warning + danger |
| Spinner | `Loader2` (lucide-react) | Steps 3 and 5 |

### Key Findings

- **State-Driven Dynamic UI**: 6 condition rules for consultation type visibility
- **Button Visibility Matrix**: Next button hidden in polling states (3, 5)
- **Async Polling**: Step 3 polls at 500ms until `status.end=true`
- **Dynamic Option Hiding**: Consultation type options filtered by job capabilities

---

## Domain: Planning

**Analysis Source**: `specs/analysis/planning/`  
**Wireframes Location**: `specs/wireframes/planning/`  
**Status**: ✅ Complete (33 wireframes across 6 subdomains)

### Appointment Subdomain (8 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Appointment List | `appointment-list.pen` | MonthTable calendar grid, toolbar, filter panel |
| W2 | Appointment Details | `appointment-details.pen` | 5-tab dialog (1200px), Info tab with type-specific visibility |
| W2a | Referenced Tab | `appointment-details-referenced.pen` | Location toolbar, table, edit sub-dialog |
| W2b | Patients Tab | `appointment-details-patients.pen` | Patients table, treatments sub-table, Patient Data dialog |
| W2c | Assigned Tab | `appointment-details-assigned.pen` | Doctor autocomplete, assignment table with 7 action buttons |
| W2d | Suggestions Tab | `appointment-details-suggestions.pen` | Text filter, suggestions table with preference icons |
| W3 | Assign User | `appointment-assign-user.pen` | Collision modal with state select per row |
| W4 | State Legend | `appointment-state-legend.pen` | 13 appointment states + 12 assignment states with colors |

### Appointment-Admin Subdomain (8 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Inline Consultation | `inline-consultation.pen` | Embedded consultation editor |
| W2 | Calculation | `calculation.pen` | Price breakdown, service rules, manual overrides |
| W3 | QM | `qm.pen` | Questionnaire ratings, 3 scales |
| W4 | Export | `export.pen` | Format select, filters, async polling |
| W5 | Email | `email.pen` | Invoice email composition, attachments |
| W6 | Print Preview | `print-preview.pen` | Invoice template preview |
| W7 | Job Status | `job-status.pen` | Async job polling dialog |
| W8 | State Legend | `state-legend.pen` | Invoice state legend |

### Appointment-Support Subdomain (5 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | CDR Call List | `cdr-call-list.pen` | 16-col grid, year/month/day toolbar, 7 status badges |
| W2 | CDR Call Detail | `cdr-call-detail.pen` | 24 fields in 4 sections, status transitions |
| W3 | CDR Assignment | `cdr-assignment-crud.pen` | Simple CRUD grid + modal detail |
| W4 | Close Month | `close-month.pen` | Month summary, export prefix, async polling |
| W5 | CDR Status Legend | `cdr-status-legend.pen` | 7 CDR call statuses with colors |

### Council Subdomain (3 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Council List | `council-list.pen` | MonthTable grid (jobType=COUNCIL), toolbar, filter panel |
| W2 | Council Plan Detail | `council-plan-detail.pen` | Plan template: doctor collection, scheduling multiplier |
| W3 | Apply Plan | `apply-plan.pen` | Month select, generate button, async status |

### Dashboard Subdomain (5 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W3 | Calendar | `calendar.pen` | FullCalendar weekly view with entity-type events |
| W4 | Expert Availability | `expert-availability.pen` | Week grid + Month grid, tri-state toggles |
| W5 | Shift Dialog | `shift-dialog.pen` | Shift detail + Request action sub-dialog |
| W6 | Ad-Hoc Appointment | `adhoc-appointment.pen` | Location autocomplete, type select, job autocomplete |
| W7 | End Shift | `end-shift.pen` | Confirmation text, start/end time inputs |

### Shift Subdomain (4 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Shift List | `shift-list.pen` | MonthTable grid (jobType=SHIFT), toolbar, filter panel |
| W2 | Shift Plan Detail | `shift-plan-detail.pen` | 10-col grid, expert collection, price type matrix |
| W3 | Apply Plan | `apply-plan.pen` | Month select, generate button, async polling |
| W4 | State Legend | `state-legend.pen` | 12 shift states with colors |

---

## Domain: System

**Analysis Source**: `specs/analysis/system/`  
**Wireframes Location**: `specs/wireframes/system/`  
**Status**: ✅ Complete (20 wireframes across 7 subdomains)

### Includes Subdomain (6 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Navbar | `navbar.pen` | Dynamic nav bar with buttons, role gating |
| W2 | Loading States | `loading-states.pen` | Preloader, siteloader, job status modal |
| W3 | Quick Filter | `quick-filter.pen` | A-Z filter bar: full + short modes |
| W4 | Login | `login.pen` | Credentials form, TOTP 2FA step, password reset |
| W5 | Bug Report | `bug-report.pen` | Screen capture with annotation tools |
| W6 | Color Palette | `color-palette.pen` | 14 entity colors + state mappings |

### Shell Subdomain (3 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W7 | App Shell Layout | `app-shell-layout.pen` | Full shell (1440px): sidebar, top bar, maintenance toast |
| W8 | Global Navigation | `global-navigation.pen` | Sidebar: expanded (240px) + collapsed (64px) states |
| W9 | User Menu | `user-menu.pen` | User dropdown: display name, role, settings, logout |

### Notification Subdomain (3 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Notification List | `notification-list.pen` | Inbox with year/month toolbar, inline message detail |
| W2 | Notification Compose | `notification-compose.pen` | Single recipient + bulk variants |
| W3 | Send Message | `send-message.pen` | Dashboard quick compose |

### Admin CRUDs Subdomain (Batch 11, 4 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W15 | MOTD/Template | `motd-template.pen` | MOTD list + detail, template editor, preview dialog |
| W16 | CDR Call | `cdr-call.pen` | CDR call list/detail, assignment, export job polling |
| W18 | System Config | `system-config.pen` | 4 tabs: location type, exclusion criteria, support category, login notification |
| W19 | Templates/Files | `templates-files.pen` | 3 tabs: export template, notification template, user file |

### Dashboard Subdomain (3 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Dashboard Standard | `dashboard-standard.pen` | Self-service panel, active calls, birthdays |
| W2 | Dashboard Admin | `dashboard-admin.pen` | Management panels, ad-hoc button |
| W3 | Login Notification | `login-notification.pen` | Login notification modal |

---

## Domain: Treatment

**Analysis Source**: `specs/analysis/treatment/`  
**Wireframes Location**: `specs/wireframes/treatment/`  
**Status**: ✅ Complete (24 wireframes across 4 subdomains)

### Consultation Subdomain (10 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Consultation List | `consultation-list.pen` | Grid, toolbar, filter panel, export template dialog |
| W2 | Details Header | `consultation-details-header.pen` | Dialog scaffold: header row, 11-tab bar, content area |
| W3 | Standard Form | `consultation-details-standard.pen` | 7 blocks, 6 collections (incl. nested prescriptions) |
| W4 | Onboarding Form | `consultation-details-onboarding.pen` | 50 elements, annotate short-form differences |
| W5 | Incarceration Form | `consultation-details-incarceration.pen` | 51 elements, 6 blocks, siren annotations |
| W6 | Treatment/Warning | `consultation-details-treatment-warning.pen` | Treatment textareas + warning category CRUD |
| W7 | View Template | `consultation-view.pen` | Read-only view with 8 sections |
| W8 | Review Dialog | `consultation-review.pen` | 2-column, markdown editor, review buttons |
| W9 | ICD-10 Search | `consultation-icd10-search.pen` | Search modal with results list |
| W10 | Export Template | `consultation-export-template.pen` | Export template modal with filters |

### Dashboard Subdomain (6 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W5 | Consultation Wizard | `consultation-wizard.pen` | 4 steps: patient select, book number, type select, success |
| W7 | Location Wizard | `consultation-location-wizard.pen` | Single-step: location autocomplete |
| W9 | Consultation Template | `consultation-template.pen` | Template list panel + create dialog |
| W11 | Summarize Appointment | `summarize-appointment.pen` | 1000px dialog, QM questionnaire embed |
| W12 | Incarceration Dialogs | `incarceration-dialogs.pen` | Check dialog + retrieval dialog |
| W13b | End Appointment | `end-appointment.pen` | Confirmation text, time inputs, QM embed |

### Questionnaire Subdomain (2 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Questionnaire List | `questionnaire-list.pen` | 24-col grid (subset shown), inline detail |
| W2 | Questionnaire Detail | `questionnaire-detail.pen` | 12 rating questions, conditional equipment section |

### Batch 12 Subdomain (6 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Appointment Patient | `appointment-details-patient.pen` | Patient sections within appointment details |
| W2 | Medication | `medication.pen` | Medication list, prescribe/edit dialog, history |
| W3 | Patient Data | `patient-data.pen` | Patient data overview, edit forms |
| W4 | Treatment/Category | `treatment-and-category.pen` | Treatment list, category management, CRUD |
| W5 | Treatment Plan | `treatment-plan.pen` | Treatment plan list, plan detail/editor |
| W6 | Warning Management | `warning-management.pen` | Warning list, create/edit dialog, severity |

---

## Domain: User Management

**Analysis Source**: `specs/analysis/user-management/`  
**Wireframes Location**: `specs/wireframes/user-management/`  
**Status**: ✅ Complete (14 wireframes across 6 subdomains)

### Profile Subdomain (7 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W1 | Profile Form | `profile-form.pen` | 8 tabs (4 employee + 4 admin), 60+ fields |
| W2 | Staff List | `profile-staff-list.pen` | A-Z quickFilter, 10-col grid, inline detail |
| W3 | Expert Search | `profile-expert-search.pen` | Job autocomplete, skills/exclusion collections |
| W4 | Assignment Dialog | `profile-assignment-dialog.pen` | Year/month filter, appointment list, accept/reject |
| W5 | Password Dialog | `profile-password-dialog.pen` | 3 password fields, strength meter, validation rules |
| W6 | Signature Pad | `profile-signature-pad.pen` | HTML5 canvas, Sign + Clear buttons |
| W7 | Expert Availability | `profile-expert-availability.pen` | Month grid (31×6) + Week grid (24×7) |

### Dashboard Subdomain (1 wireframe)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W14 | User Stats | `user-stats.pen` | Date picker, stats collection table |

### Batch 13 Subdomain (6 wireframes)

| ID | Wireframe | .pen File | Description |
|:---|:---|:---|:---|
| W26 | Admin User Mgmt | `user-management.pen` | 9-col grid, A-Z QuickFilter, 15+ field detail panel |
| W27 | TOTP Security | `totp-security.pen` | 3 states: No Token, Pending (QR), Active |
| W28 | Group Management | `group-management.pen` | Tree + detail card, rights multiselect |
| W29 | Skill Management | `skill.pen` | 5-col grid, 5-field dialog |
| W30 | Onboarding Flow | `onboarding-flow.pen` | Dynamic resource/row grid, steps dialog |
| W31 | User Video History | `user-video-history.pen` | 8-col grid, 5-field dialog (orphan) |
| W32 | Work Hour Templates | `workhour.pen` | 4-col grid, 4-field dialog (simplest CRUD) |

---

## Enum References

### Appointment States (13 values)

| State | Color | CSS Class |
|:---|:---|:---|
| OPEN | Green | `state-open` |
| STARTED | Blue | `state-started` |
| REOPENED | Cyan | `state-reopened` |
| REQUESTED | Purple | `state-requested` |
| LOCKEDIN | Indigo | `state-lockedin` |
| CONFIRMED | Green | `state-confirmed` |
| AGREED | Amber | `state-agreed` |
| RESERVED | Yellow | `state-reserved` |
| STORNO | Red | `state-storno` |
| CANCELLED | Gray | `state-cancelled` |
| NO_SHOW | Orange | `state-noshow` |
| COMPLETED | Teal | `state-completed` |
| ARCHIVED | Slate | `state-archived` |

### Consultation Types (7 values)

| Type | Description |
|:---|:---|
| STANDARD | Standard consultation |
| EXPERT | Expert consultation |
| ONBOARDING | Onboarding consultation |
| SHORT | Short consultation |
| INCARCERATION | Incarceration consultation |
| TREATMENT | Treatment consultation |
| WARNING | Warning consultation |

### Role (7 values — User Management)

| Value | Description |
|:---|:---|
| REGISTERED | Registered user (basic) |
| STANDARD | Standard user |
| KUNDE | Customer |
| ADMIN_KUNDE | Customer admin |
| LEITER_INTERN | Internal lead |
| ADMIN_INTERN | Internal admin |
| ADMIN | Super admin |

### EmployeeState (5 values)

| Value | Color | Description |
|:---|:---|:---|
| UNCONFIRMED | Gray | Pending confirmation |
| ACTIVE | Green | Active employee |
| SICK | Amber | On sick leave |
| HOLIDAY | Blue | On holiday |
| INACTIVE | Red | Inactive |

### CDR Status (7 values)

| Value | Color | Description |
|:---|:---|:---|
| INVALID_UNKNOWN | Gray | Unknown/invalid |
| DIRECT | Green | Direct call |
| FORWARDED | Blue | Forwarded call |
| FROM_TRANSFER | Violet | Transferred from |
| TO_TRANSFER | Purple | Transferred to |
| FROM_FORWARD | Cyan | Forwarded from |
| TO_FORWARD | Sky | Forwarded to |

---

## Related Documents

- **Central Index**: `specs/analysis/wireframes-index.md` — Completed wireframe inventory with PNG exports
- **Creation Guide**: `specs/planning/create-wireframes.md` — Master guide for wireframe creation process (Pencil MCP usage, save conventions, annotation rules)
- **Workflow Docs**: `specs/wireframes/{domain}/workflows.md` — Embedded screenshots + Mermaid diagrams per domain
- **Analysis Plan**: `specs/planning/analyse-ui-elements.md` — Phase A+B findings, hardcoded strings, bugs
- **Translations**: `specs/planning/translations/lookup-{domain}.csv` — German to English translation lookup

---

## Completion Statistics

| Metric | Count |
|:---|:---:|
| Total wireframe plan files (consolidated) | 1 |
| Original wireframe plan files (removable) | 22 |
| Total wireframes completed | 107 `.pen` files |
| Total PNG exports | 150+ `.png` files |
| Completion rate | ~89% |

