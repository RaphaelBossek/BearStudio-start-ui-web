Analyse an existing implementation of a legacy web UI to create a comprehensive implementation plan of a modern UI with React and Shadcn.

# Execution process

This plan is executed in three phases per module directory:

## Phase A: Markdown analysis (Layer 2 + 3)

1. **Inventory** the target directory — list all `.htmlm`, `.html`, `.mustache`, `.js`, `.css` files
2. **Read HTMLM headers** to extract template includes, permissions, dynamic options, variables
3. **Identify pages vs dialogs** — HTMLM files are page entry points; HTML/mustache files are dialogs/partials
4. **Decompose into documents** — one analysis document per logical page or dialog group, sized to avoid exceeding agent context windows (~50K tokens of source per agent). For large pages like `index.htmlm`, split into sub-documents by permission boundary (e.g. `isStandard`, `isAdmin`, `selfService`)
5. **Write analysis documents in parallel** — launch one agent per document with:
   - The specific source files to read (with line ranges for large files)
   - Relevant translation keys pre-extracted from `ApplicationResources_en.properties`
   - The analysis rules from this plan
   - The output file path and format template
6. **Write a README.md index** listing all documents, file inventory, permission map, option sources, and cross-references

## Phase B: Consolidation — COMPLETED (2026-03-22)

All consolidation findings are now recorded inline in this document (see "Phase A+B Findings" section below). The steps performed were:

1. Cross-referenced analysis documents with the PRD (`specs/PRD.md`) to identify gaps
2. Updated the wireframe plan with all new dialogs and pages discovered during analysis
3. Flagged hardcoded strings, dead code, and legacy bugs (see findings section)
4. Incorporated all findings in this plan as agentic memory for future runs
5. All 47 legacy modules analyzed across 5 batches — no further analysis needed

## Phase C: Wireframe & Workflow Documentation (Layer 1)

This phase has been externalized. 

→ Please refer to **`specs/planning/create-wireframes.md`** for the comprehensive plan and execution steps for AI coding agents to create wireframes (.pen files) and workflow descriptions (Mermaid diagrams) based on these analysis documents.

## Lessons learned from the `/dash` module analysis

These findings should inform future module analyses:

### Agent sizing
- Large pages (e.g. `index.htmlm` at 900 lines with 15+ dialogs) must be split into 3–4 sub-documents by permission boundary or functional area
- Small dialogs (e.g. template CRUD, shift dialog) can be handled by a single agent each
- Provide pre-extracted translations in the agent prompt — agents cannot efficiently grep large property files

### Patterns discovered beyond the examples below
- **`class="status"` with `data-field`** — renders boolean field as tri-state icon (check/question/minus) without using the standard statusTrue/statusFalse/statusNull spans. Found in the consultations table (doc 01)
- **`class="collection selectable"` with `data-multi="true"`** — multi-select collection with checkbox per row and bulk actions. Found in the confirmation queue (doc 02)
- **`class="setObj"` with `data-field`** — object binding on a container element, where child fields resolve relative to the bound object. Found in actionDetailsView (doc 08)
- **`data-prefix` on `<a>` or `<img>` elements** — runtime prefix prepended to a field value to construct URLs (e.g. `data-prefix="tel:"` for phone links, `data-prefix="/get/MOTDService/attachment/"` for images). Found in docs 01, 03, 08
- **`data-postfix` on `<img>` elements** — runtime suffix appended to a field value for image URLs. Found in MOTD cards (doc 01)
- **`data-append` on autocomplete inputs** — specifies an element ID to append autocomplete results to. Found in ad-hoc appointment (doc 04)
- **`data-filter` on autocomplete inputs** — dynamic filter value that changes based on other field selections (e.g. job type). Found in ad-hoc appointment (doc 04)
- **`data-key` on select elements** — specifies which property of the selected option object to use as the value. Found in ad-hoc appointment (doc 04)
- **`data-minlength="0"` on autocomplete inputs** — triggers suggestions on focus without typing. Found in ad-hoc appointment (doc 04)
- **`class="page"` with `data-next="false"`** — wizard step where the next button is programmatically hidden (loading/async steps). Found in BasisWeb wizard (doc 06)
- **`class="suggestType"` on time inputs** — suggests time values based on appointment type. Found in end shift dialog (doc 04)
- **Nested collections** — collections within collections (e.g. `calls.list` containing `list.parties`). Each level uses a separate `data-field` and jsForm prefix. Found in active calls (doc 03)
- **`class="clockpicker"` on `<div>` wrapper** — time picker widget around a time input. Found in end shift/appointment dialogs (doc 04)
- **`data-titleTYPE` attributes** — dynamic dialog title based on entity type (e.g. `data-titleAPPOINTMENT`, `data-titleSHIFT`). Found in summarize dialog (doc 04)
- **jsForm with `{prefix: "name"}`** — sub-forms with isolated data scope. Found in active calls (doc 03) and available actions (doc 02)
- **Fire-and-forget save** — `trigger("saveMonth")` then `setTimeout(reload, 500)` instead of awaiting completion. Found in week/month views (docs 10, 11). Flag for modern implementation to use proper async await.

### Hardcoded strings inventory
- The `/dash` module contains **33+ hardcoded German strings** across 11 documents
- Most are in `confirm()` dialogs, button labels, card headers, and tooltip titles
- Each analysis document includes a translation table with HARDCODED entries marked
- These need i18n keys created in the modern implementation

### External dependencies
- **`expertWeek.js` / `expertDays.js`** — loaded from `/profile/` directory, contain the core grid interaction logic for week/month views. Must be analyzed separately when the `/profile` module is analyzed
- **`ConsultationDetails` object** — defined in `/consultation/details.js`, referenced extensively from dashboard for opening consultation editors. Central to the dialog navigation graph
- **`AppointmentDetails` object** — defined in `/appointment/details.js`, used for opening appointment editors
- **`Dialog` object** — framework-level dialog manager (open, close, init). Part of corinis:webCore
- **`Core.conn.execute()`** — framework RPC call pattern. All server communication uses this
- **`jsForm`** — framework form binding library (fill, getData, get, collections). Part of corinis:webCore

### Dead/commented-out code
- Calendar view: ACTION and SHIFT click handlers are commented out (doc 09)
- Month view: counter input fields are commented out, replaced with span-based display (doc 11)
- Dashboard: therapy card section is commented out (doc 01)

### Bugs found in legacy code
- Consultation template filter has a duplicated condition — `name.startsWith(value) || name.startsWith(value)` (doc 07)
- Book number mask sentinel string `"book number mask"` used as a magic value meaning "no mask" (doc 05)

## Lessons learned from the `/consultation`, `/appointment`, `/questionaire` module analyses

### Agent sizing (confirmed)
- `/consultation` (5945 lines) split into 8 sub-documents worked well — each agent completed in 2-5 minutes
- `/appointment` (2052 lines) split into 3 sub-documents was appropriate
- `/questionaire` (675 lines) split into 2 sub-documents was sufficient
- Pre-extracting translations into agent prompts remains essential for accuracy

### New patterns discovered

- **MonthTable calendar grid** — `/appointment` uses a calendar-style day × job grid (not DataTables). Rows = days of month, columns = jobs/services, cells = colored appointment entries with nested staff sub-rows. This is a custom framework component loaded from `_lib/scripts/monthTable.js`.
- **`conditionize2` jQuery plugin** — Used in consultation details and questionnaire for client-side field visibility based on other field values. The HTML attributes `data-cond-*` control show/hide logic. Needs replacement with React state-driven conditional rendering.
- **`class="siren-on"` / `class="siren-off"`** — CSS-only animation (blue-to-red flash) used in incarceration form for critical alert fields. Purely CSS-driven, no JS toggling.
- **`class="templatefield"` with `data-template`** — Dynamic URL construction using `[[cur.field]]` placeholders. Used for user profile images in appointment details.
- **`class="radioNext"`** — Radio button group rendered inline after the question label. Used in questionnaire ratings (1-6 school-grade scale).
- **`class="allowHiding"`** — Rows that can be programmatically toggled visible/hidden. Used in questionnaire for equipment ratings.
- **`class="requireDocumentation"`** — CSS class that triggers mandatory comment when a poor rating (5-6) is given.
- **Multi-type dialogs** — Appointment details serves 4 entity types via `data-titleTYPE` attributes for dynamic titles and CSS classes for type-specific field visibility.
- **ShiftLogic state machine** — Defined in `messages.i18n.js`, provides `getValidState()` for state transition validation. 12 appointment states + 12 assignment states.
- **Nested collections** — Prescription collection contains inner `activeIngredients` collection with its own repeater. Dosage grid switches between single text (STANDARD) and 4-column (LIMITED/LONGTERM) based on prescription type.

### Cross-module shared components
- `detailQM.html` is included in 3 places: questionnaire list, questionnaire details, and consultation details (QM tab)
- `details.html` (consultation) + `details.html` (appointment) + `assignUser.html` are all included in the dashboard
- The `view.mustache` read-only template is shared between viewDetails and reviewDetails dialogs

### Hardcoded strings inventory (expanded)
- `/consultation`: **60+ hardcoded German strings** across 8 documents
- `/appointment`: **15+ hardcoded German strings** across 3 documents
- `/questionaire`: **3 hardcoded strings** (2 English, 1 German)
- Combined total across all analyzed modules: **110+ hardcoded strings** needing i18n keys

### Bugs found in new modules
- `view.i18n.js` line 349: `currentState` formatted using `preexistingState` formatter (consultation doc 07)
- Dialog-closes-before-save-completes race condition in consultation `details.js` (doc 08)
- Empty `dateSignedOff` restriction block — dead code (doc 08)
- Missing `.catch()` on save promises — unhandled rejections (doc 08)
- XSS risk: error messages displayed via `.html()` without sanitization (doc 08)
- Questionnaire `ratingRisk` commented-out row has unclosed `<span>` tag and wrong CSS class (doc 01)
- AGREED/Override label mismatch in appointment assignment state options (doc 03)

### Spelling inconsistencies to normalize
- Legacy uses `questionaire` (one 'n') — normalize to `questionnaire` in modern codebase
- Legacy uses `nerologyDescription` (missing 'u') — normalize to `neurologyDescription`
- Legacy uses `tabaccoUsage` — normalize to `tobaccoUsage`

### Translation gaps discovered
- Multiple `rating.*` scale labels (probability, risk) have German only, no English
- `Suitability.*` enum values have no English translations
- Several `Questionaire.date*` keys are German only
- `consultation.review` has no English translation

## Lessons learned from the `/notification`, `/profile`, `/_include` module analyses

### Agent sizing (confirmed continued)
- `/notification` (535 lines) as a single document worked well — completed in ~2.5 minutes
- `/profile` (3384 lines) split into 4 sub-documents was appropriate — the profile form (1014 lines) was the largest single analysis
- `/_include` (1233 lines) split into 2 sub-documents was sufficient

### New patterns discovered

- **QuickFilter (A-Z)** — `quickFilter.mustache` provides alphabetical filtering with two modes: individual letters (A-Z) and grouped ranges (A-D, E-H, etc.). Driven by `quickFilterData` variable from HTMLM header. Maps to Shadcn ToggleGroup.
- **Skill checkbox rendering** — Skills are rendered as checkbox groups from `SkillService.getMain/Extra/Additional/Language` using a complex HTMLM options config with `style: "CHECKBOX"`, `surroundCss`, `inputCss`, `labelCss`, `fieldName`, and `surroundData` properties. The generated HTML is not a simple `<select>` but a list of `<div class="form-check">` elements.
- **TOTP 2FA onboarding** — Login flow includes QR code display for authenticator app setup, with a custom single-digit 6-input TOTP field that supports paste and auto-submit.
- **html2canvas screen capture** — Bug report uses `html2canvas` for automatic screenshot, then provides a canvas annotation overlay with draw-rectangle + freehand-pencil + color-picker tools.
- **Notification polling** — `customOverride.js` polls for new notifications every 30 seconds, updating a badge count in the UI. Maps to React Query with `refetchInterval`.
- **Session timeout** — `customOverride.js` monitors session validity and redirects to login on expiry.
- **Entity color palette** — `categories.css` defines 14 entity type colors + 11 appointment state colors + 12 treatment state colors + 10 generic scheduling states, each with icon variants. This is the central visual identity system.
- **Expert availability tri-state** — Month grid uses null→true→false→null cycle; week grid uses null→true→null. Both define a global `cycleState()` function, creating a collision.

### Cross-module shared component map (complete)

| Component | Source | Used by |
|:---|:---|:---|
| `navbar.mustache` | `/_include/` | All HTMLM pages |
| `siteloader.mustache` | `/_include/` | All HTMLM pages |
| `preloader.mustache` | `/_include/` | Dashboard |
| `quickFilter.mustache` | `/_include/` | Staff list |
| `jobStatusDlg.html` | `/_include/` | Consultation, Staff |
| `details.html` (consultation) | `/consultation/` | Consultation list, Dashboard |
| `details.html` (appointment) | `/appointment/` | Appointment list, Dashboard |
| `assignUser.html` | `/appointment/` | Appointment list, Dashboard, Staff |
| `detailQM.html` | `/questionaire/` | Questionnaire list, Questionnaire detail, Consultation detail |
| `sendMessage.mustache` | `/notification/` | Dashboard |
| `userProfile.mustache` | `/profile/` | Personal profile, Staff detail |
| `docFinder.html` | `/profile/` | Appointment list, Dashboard |
| `expertDays.js` | `/profile/` | Dashboard month view |
| `expertWeek.js` | `/profile/` | Dashboard week view |
| `categories.css` | `/_include/` | All modules (entity colors) |
| `customOverride.js` | `/_include/` | All pages (notifications, session) |

### Bugs found in new modules
- `notify.js` references undefined `message` variable (includes doc 01)
- Sunday naming bug: week grid HTML uses `slotsSu` but server uses `slotsSo` — silent data loss (profile doc 04)
- Fire-and-forget save with no error handling in expert availability (profile doc 04)
- Global `cycleState()` function collision between expertDays.js and expertWeek.js (profile doc 04)
- Async role check gap: availability grid interactive before role check completes (profile doc 04)
- Misspelled "Akutelles Passwort" should be "Aktuelles Passwort" (profile doc 03)
- DocFinder has TS/JS source duplicate (profile doc 03)
- "Recipent" typo in English notification translation (notification doc 01)

### Hardcoded strings (expanded)
- `/notification`: ~5 hardcoded strings
- `/profile`: ~30+ hardcoded strings across 4 documents
- `/_include`: ~12 hardcoded strings (especially in login.js, jobStatusDlg.html)
- **Grand total across all modules: ~160+ hardcoded strings** needing i18n keys

### External dependencies discovered
- `/admin/password.mustache` — Referenced by staff.htmlm (different from profile passwordDlg)
- `/onboarding/form.html` — Referenced by staff.htmlm
- `/warning/messages.i18n.js` — Referenced by viewDetails.html and reviewDetails.html
- `_lib/scripts/monthTable.js` — Custom calendar grid used by appointment list
- `_lib/scripts/quickFilter.js` — Quick filter logic
- `_lib/scripts/highlightSearch.js` — Search result highlighting
- `_lib/3rdparty/marked.min.js` — Markdown rendering
- `_lib/3rdparty/jquery.conditionize2.min.js` — Conditional field visibility
- SignaturePad library — Canvas signature capture
- html2canvas library — Screenshot for bug reports

# Documentation strategy: Three-layer visualization

Each analysed page/dialog is documented with three complementary layers:

## Layer 1: Wireframe (Pencil .pen file) — "What does it look like?"

Create a Pencil wireframe for each dialog, page, or view. The wireframe captures:
- Spatial layout and grouping of form elements
- Relative sizing and column structure (derived from `col-md-*` ratios)
- Visual hierarchy (titles, sections, nested blocks)
- Component types (inputs, selects, buttons, tables, calendars, maps)
- Read-only vs editable areas
- Permission-gated sections (annotated with dashed borders and permission label)
- Status badges and color-coded elements

**File convention**: `specs/wireframes/{domain}/{subdomain}/{page-or-dialog-name}.pen` (mirrors `specs/analysis/` structure)

**Annotation rules for wireframes**:
- Label each form element with its `name="data.*"` datamodel path
- Mark required fields with a `*` suffix
- Mark read-only fields with a lock icon or `[RO]` label
- Annotate permission-gated regions with `[PERM: PERMISSION_NAME]`
- Show collection/repeater areas as a single row with a `[repeats]` annotation
- Use placeholder text from `{{i18n.*}}` references (resolved to English)

## Layer 2: Mermaid diagrams — "How does it behave?"

Create Mermaid diagrams for behavioral and structural aspects that wireframes cannot convey.

### Wizard / multi-step flow diagrams

For each wizard, create a **flowchart** showing step progression, validation gates, and branching:

~~~mermaid
flowchart LR
    Step1["Step 1: Patient selection"]
    Step2["Step 2: Consultation type"]
    Step3a["Step 3a: Standard form"]
    Step3b["Step 3b: Expert form"]
    Summary["Summary & confirm"]

    Step1 -->|next| Step2
    Step2 -->|type = STANDARD| Step3a
    Step2 -->|type = EXPERT| Step3b
    Step3a -->|next| Summary
    Step3b -->|next| Summary
    Summary -->|save| Done(("Saved"))
    Summary -->|back| Step2
~~~

### Permission / authority gating diagrams

For pages with complex permission logic, create a **flowchart** showing which UI regions are visible per role:

~~~mermaid
flowchart TD
    Page["Dashboard page"]
    Page --> NavBar["Navigation bar"]
    Page --> Content["Main content"]

    NavBar --> |"canAdHoc"| AdHocBtn["Ad-hoc appointment button"]
    NavBar --> |"canManage"| ManageMenu["Management menu"]

    Content --> Calendar["Calendar view"]
    Content --> |"isExpert"| ExpertDays["Expert days panel"]
    Content --> |"NOT isExpert"| StaffQueue["Staff queue panel"]
~~~

### Dialog / navigation flow diagrams

For pages with multiple dialogs that open from each other, create a **flowchart** showing the navigation graph:

~~~mermaid
flowchart TD
    Dash["Dashboard"]
    Dash -->|"click appointment"| ApptDlg["Appointment detail dialog"]
    Dash -->|"click + button"| ConsWiz["Consultation wizard"]
    Dash -->|"click shift"| ShiftDlg["Shift dialog"]

    ApptDlg -->|"open consultation"| ConsDlg["Consultation detail dialog"]
    ApptDlg -->|"openSearchDlg action"| SearchDlg["Search dialog"]

    ConsDlg -->|"createConsulationTemplate action"| TplDlg["Template dialog"]
~~~

### State machine diagrams

For entities with state-based behavior (appointments, consultations), create a **state diagram** showing transitions and their visual representation:

~~~mermaid
stateDiagram-v2
    [*] --> REQUESTED : create
    REQUESTED --> CONFIRMED : confirm
    REQUESTED --> CANCELLED : cancel
    CONFIRMED --> LOCKEDIN : lock in
    CONFIRMED --> CANCELLED : cancel
    LOCKEDIN --> COMPLETED : complete
    LOCKEDIN --> CANCELLED : cancel

    note right of REQUESTED : bg-warning (yellow)
    note right of CONFIRMED : bg-info (blue)
    note right of LOCKEDIN : bg-primary (dark blue)
    note right of COMPLETED : bg-success (green)
    note right of CANCELLED : bg-danger (red)
~~~

### Datamodel mapping diagrams

For complex pages, create a **class diagram** showing which UI sections map to which parts of the datamodel:

~~~mermaid
classDiagram
    class ConsultationDetailsDlg {
        data.bookNumber : input [RO]
        data.body.gender : select
        data.type : select
        data.start : date
        data.until : date
    }
    class TreatmentSection {
        data.treatment.diagnosis.comment : textarea
        data.treatment.medication : textarea
    }
    class AppointmentCollection {
        data.appointments[] : repeater
        appointments.date : field date
        appointments.state : field
    }
    ConsultationDetailsDlg --> TreatmentSection
    ConsultationDetailsDlg --> AppointmentCollection
~~~

**File convention**: Mermaid diagrams are embedded inline in the analysis output markdown for each page/dialog.

## Layer 3: Markdown specification tables — "What exactly do I implement?"

The detailed element-by-element specification as defined in the "Documentation of the results" section below. This is the primary reference for the coding agent.

## How the three layers work together

| Question the coding agent has           | Layer to consult               |
| :-------------------------------------- | :----------------------------- |
| What components do I need and where?    | Wireframe (.pen)               |
| What is the user flow / step sequence?  | Mermaid flowchart              |
| Which sections are role-dependent?      | Mermaid permission diagram     |
| What are the possible entity states?    | Mermaid state diagram          |
| How do dialogs connect to each other?   | Mermaid navigation diagram     |
| Which datamodel fields map where?       | Mermaid class diagram + tables |
| Exact field types, options, validation? | Markdown spec tables           |
| Translations for each label?            | Markdown translation table     |

# Details about the environment

- Details about the database architecture are in @specs/mongodb-mapping/README.md
- Text reference for the translation can be found in:
    - German: ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources.properties
    - English: ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources_en.properties
    - Framework translations (button.*, dialog.*, label.*) are in BaseResources_de.properties (German) and BaseResources.properties (English) inside the **corinis:webCore JAR**. These are not directly accessible as filesystem files — extract from the JAR or reference framework documentation for exact values.
- Legacy source code: ~/src/vc/videoclinic-prod/web/src/main/webapp/
- Analysis output: specs/analysis/{module}/
- Wireframe output: specs/wireframes/{domain}/{subdomain}/ (mirrors analysis structure; includes .pen, PNGs, workflows.md)

## Completed analyses (all 47 modules)

### Batch 0 — Initial Modules (2026-03-21)

| Module | Directory | Analysis Path | Documents | Status |
|:---|:---|:---|:---|:---|
| Dashboard | `/dash` | `specs/analysis/dash/` | 11 + README + wireframe plan | Complete |
| Consultation | `/consultation` | `specs/analysis/consultation/` | 8 + README + wireframe plan | Complete |
| Appointment | `/appointment` | `specs/analysis/appointment/` | 3 + README + wireframe plan | Complete |
| Questionnaire | `/questionaire` | `specs/analysis/questionaire/` | 2 + README + wireframe plan | Complete |
| Notification | `/notification` | `specs/analysis/notification/` | 1 + README + wireframe plan | Complete |
| Profile | `/profile` | `specs/analysis/profile/` | 4 + README + wireframe plan | Complete |
| Includes | `/_include` | `specs/analysis/includes/` | 2 + README + wireframe plan | Complete |

### Batch 1 — Core Admin & Billing (2026-03-22)

| Module | Directory | Analysis Path | Documents | Status |
|:---|:---|:---|:---|:---|
| Admin | `/admin` | `specs/analysis/admin/` | 6 + README | Complete |
| Customer | `/customer` | `specs/analysis/customer/` | 2 + README | Complete |
| Invoice | `/invoice` | `specs/analysis/invoice/` | 2 + README | Complete |
| Onboarding | `/onboarding` | `specs/analysis/onboarding/` | 1 + README | Complete |

### Batch 2 — Core Patient Care (2026-03-22)

| Module | Directory | Analysis Path | Documents | Status |
|:---|:---|:---|:---|:---|
| Treatment + TreatmentCategory | `/treatment` + `/treatmentCategory` | `specs/analysis/treatment/` | 1 (combined) + README | Complete |
| TreatmentPlan | `/treatmentPlan` | `specs/analysis/treatment/` | 1 + shared README | Complete |
| Shift + ShiftPlan | `/shift` + `/shiftPlan` | `specs/analysis/shift/` | 1 (combined) + README | Complete |
| Warning | `/warning` | `specs/analysis/warning/` | 1 + README | Complete |

### Batch 3 — Entity CRUDs, Council, Appointment Admin (2026-03-22)

| Module | Directory | Analysis Path | Documents | Status |
|:---|:---|:---|:---|:---|
| Room | `/room` | `specs/analysis/entity-cruds/` | 1 (combined) + README | Complete |
| Equipment | `/equipment` | `specs/analysis/entity-cruds/` | (shared doc) | Complete |
| Contact | `/contact` | `specs/analysis/entity-cruds/` | (shared doc) | Complete |
| Medication | `/medication` | `specs/analysis/entity-cruds/` | (shared doc) | Complete |
| Patient Data | `/patientData` | `specs/analysis/entity-cruds/` | (shared doc) | Complete |
| Council + CouncilPlan | `/council` + `/councilPlan` | `specs/analysis/council/` | 1 + README | Complete |
| Appointment Admin | `/appointmentAdmin` | `specs/analysis/appointment-admin/` | 1 + README | Complete |

### Batch 4 — Appointment Support, Support+Video, Utility (2026-03-22)

| Module | Directory | Analysis Path | Documents | Status |
|:---|:---|:---|:---|:---|
| Appointment Plan | `/appointmentPlan` | `specs/analysis/appointment-support/` | 1 (combined) + README | Complete |
| CDR Call | `/CdrCall` | `specs/analysis/appointment-support/` | (shared doc) | Complete |
| CDR Call Assignment | `/CdrCallAssignment` | `specs/analysis/appointment-support/` | (shared doc) | Complete |
| Support Ticket | `/supportTicket` | `specs/analysis/support-video/` | 1 (combined) + README | Complete |
| Video | `/video` | `specs/analysis/support-video/` | (shared doc) | Complete |
| Video Library | `/videoLibrary` | `specs/analysis/support-video/` | (shared doc) | Complete |
| Video Category | `/videoCategory` | `specs/analysis/support-video/` | (shared doc) | Complete |
| Worklog | `/worklog` | `specs/analysis/utility/` | 1 (combined) + README | Complete |
| Export Template | `/exportTemplate` | `specs/analysis/utility/` | (shared doc) | Complete |
| Notification Template | `/notificationTemplate` | `specs/analysis/utility/` | (shared doc) | Complete |
| User File | `/userFile` | `specs/analysis/utility/` | (shared doc) | Complete |
| User Video History | `/userVideoHistory` | `specs/analysis/utility/` | (shared doc) | Complete |
| Invoice Receiver | `/invoiceReceiver` | `specs/analysis/utility/` | (shared doc) | Complete |

### Batch 5 — Config CRUDs (2026-03-22)

| Module | Directory | Analysis Path | Documents | Status |
|:---|:---|:---|:---|:---|
| Location Type | `/locationType` | `specs/analysis/config-cruds/` | 1 (combined) + README | Complete |
| Exclusion Criteria | `/exclusionCriteria` | `specs/analysis/config-cruds/` | (shared doc) | Complete |
| Storno Group | `/stornoGroup` | `specs/analysis/config-cruds/` | (shared doc) | Complete |
| Support Category | `/supportCategory` | `specs/analysis/config-cruds/` | (shared doc) | Complete |
| Job Price List | `/jobPriceList` | `specs/analysis/config-cruds/` | (shared doc) | Complete |
| Product | `/product` | `specs/analysis/config-cruds/` | (shared doc) | Complete |
| Closed Month | `/closedMonth` | `specs/analysis/config-cruds/` | (shared doc) | Complete |
| Expert Work Monthly | `/expertWorkMonthly` | `specs/analysis/config-cruds/` | (shared doc) | Complete |
| Login Notification | `/loginNotification` | `specs/analysis/config-cruds/` | (shared doc) | Complete |

## Phase A Summary

- **Total legacy directories:** ~50
- **Analyzed:** 47 modules (all legacy directories with UI code)
- **Unanalyzed:** 0 (framework `_lib` excluded — shared utilities only)
- **Framework (not analyzed):** `/_lib/scripts/` — monthTable, quickFilter, highlightSearch, gridTable (142 files, 95,562 lines of shared JS/CSS/3rd-party libs)
- **Total analysis documents:** 26
- **Total wireframes identified:** 102
- **Total hardcoded strings:** ~446+
- **Total spelling inconsistencies:** 10
- **Next step:** Phase C — Wireframe Creation (see "Phase C Execution Plan" section below)

---

## Phase A+B Findings

> All findings below were consolidated from analysis of all 47 legacy modules (Batches 0-5, completed 2026-03-22).

### Architecture Note: Treatment, Shift, and Council are Filtered Appointment Views

Treatment, Shift, and Council list views are **not independent modules** — they are filtered views of the Appointment module, each filtering by `jobType` (TREATMENT, SHIFT, COUNCIL respectively). They embed the same `details.html`, `assignUser.html`, and `docFinder.html` from `/appointment/`. This has major implications for the modern implementation: a single shared Appointment list component with a `jobType` filter prop can serve all four views.

---

### PRD Cross-Reference

#### Features WITH Analysis Coverage

| PRD Feature | Status | Analysis Module | Coverage |
|:---|:---|:---|:---|
| Consultation Scheduling | Done | consultation | Full (8 docs) |
| Service Management | Done | consultation | Full |
| Skill Management | Done | profile | Full (skills collections + filtering) |
| Expert Profiles | Done | profile | Full (60+ field shared form) |
| Treatment Table View | Done | appointment | Full (multi-type detail dialog) |
| General Performance | Planned | dash | Partial (UI-level only) |
| Security Headers | Planned | includes | Partial (customOverride.js) |
| Expert Week View | Planned | dash + profile | Full for week; month view not in PRD |
| Appointment Table View | Planned | appointment | Full (MonthTable + 13 states) |
| User Management Table | Planned | profile | Full (10-column staff grid) |
| Shift Plan Table View | Planned | appointment | Full (12-state shift machine) |
| Consultation Details | In Progress | consultation | Full (8 docs, 7 types, 6-state machine) |
| User Administration | Planned | admin | Full (user CRUD, QuickFilter, profile embed, 2FA) |
| Job/Service Configuration | Planned | admin | Full (tabbed detail, price matrices, skill rules) |
| MOTD Management | Planned | admin | Full (markdown, image upload, priority styling) |
| System Configuration | Planned | admin | Full (5 tabs: BasisWeb, Cache, Data, Cleanup, Training) |
| Group/Role Management | Planned | admin | Full (tree widget + rights multiselect) |
| TOTP 2FA Onboarding | Planned | admin | Full (QR + 6-digit input, 3 states) |
| Customer Management | Planned | customer | Full (list + 3-tab detail, admin-gated billing) |
| Location Management | Planned | customer | Full (12-col grid, Leaflet map, SIP accounts) |
| Invoice Management | Planned | invoice | Full (month/year filter, 12 toolbar actions, export) |
| Invoice Details | Planned | invoice | Full (positions, tax calc, print, email, storno) |
| Onboarding Flow | Planned | onboarding | Full (3 list variants, shared step checklist) |
| Treatment List View | Planned | treatment + appointment | Full (filtered appointment view, jobType=TREATMENT) |
| Treatment Category | Planned | treatmentCategory | Full (simple CRUD) |
| Treatment Plan Management | Planned | treatmentPlan | Full (17-col grid, 12-state machine, dual dialogs) |
| Shift List View | Planned | shift + appointment | Full (filtered appointment view, jobType=SHIFT) |
| Shift Plan Management | Planned | shiftPlan | Full (10-col grid, expert collection, apply plan) |
| Warning/Allergy Management | Planned | warning | Full (simple CRUD, 4 types) |
| Room Management | Planned | entity-cruds | Full (FullCalendar, room plans, equipment assignment) |
| Equipment Management | Planned | entity-cruds | Full (cascading filter, status enum, 2 tabs) |
| Contact Management | Planned | entity-cruds | Full (A-Z QuickFilter, 4 tabs, QR code, import) |
| Medication Management | Planned | entity-cruds | Full (flat form, 14 fields) |
| Patient Data | Planned | entity-cruds | Full (file attachments) |
| Council List View | Planned | council + appointment | Full (filtered appointment view, jobType=COUNCIL) |
| Council Plan Management | Planned | council | Full (plan templates, apply plan) |
| Appointment Admin/Billing | Planned | appointment-admin | Full (10 dialogs, 34 service calls, 4 exports) |
| Appointment Plan | Planned | appointment-support | Full (collision detection, closeMonth shared) |
| CDR Call Tracking | Planned | appointment-support | Full (16 cols, year/month/day toolbar, 7 statuses) |
| CDR Call Assignment | Planned | appointment-support | Full (assignment CRUD) |
| Support Ticket | Planned | support-video | Full (cascading categories, comment thread) |
| Video Management | Planned | support-video | Full (two player types) |
| Video Library | Planned | support-video | Full (card browsing, hash deep linking, progress tracking) |
| Video Category | Planned | support-video | Full (chunked upload, stream management) |
| Invoice Receiver | Planned | utility | Full (product orders, dynamic totals, invoice creation) |
| Worklog | Planned | utility | Full (monthly list + weekly 21-col matrix) |
| Export Template | Planned | utility | Full (file upload, filename placeholders) |
| Notification Template | Planned | utility | Full (Markdown preview) |
| User File | Planned | utility | Full (10 file types) |
| User Video History | Planned | utility | Full (video.js player, watch time tracking) |
| Expert Work Monthly | Planned | config-cruds | Full (role-based visibility, bulk email, ZIP export) |
| Job Price List | Planned | config-cruds | Full (conditional fields by job type, nested prices) |
| Config CRUDs (7 modules) | Planned | config-cruds | Full (locationType, exclusionCriteria, stornoGroup, supportCategory, product, closedMonth, loginNotification) |

#### Features WITHOUT Analysis Coverage

| PRD Feature | Status | Gap |
|:---|:---|:---|
| Database Optimization | In Progress | Backend concern, no UI analysis needed |
| Rate Limiting | In Progress | Backend concern, no UI analysis needed |
| Error Tracking | In Progress | Partial in includes (job status polling only) |

#### Analyzed Functionality NOT in PRD

| Module | Functionality | Recommendation |
|:---|:---|:---|
| Questionnaire | QM rating system (3 scales, conditional visibility) | Add to PRD as Planned |
| Notification | Internal messaging (Markdown, bulk admin, folders) | Add to PRD as Planned |
| Includes | Login flow + TOTP 2FA + password reset | Add to PRD as Planned |
| Includes | In-app bug reporting (screen capture + annotation) | Add to PRD as Planned |
| Profile | Expert month view availability (tri-state grid) | Expand "Expert Week View" PRD entry |
| Profile | Signature capture (canvas, base64 PNG) | Add to PRD as Planned |
| Dashboard | Self-service scheduling (available/queued/waiting) | Add to PRD as Planned |
| Dashboard | Admin panels (active calls, birthdays, doctor info) | Add to PRD as Planned |
| Dashboard | BasisWeb wizard + consultation template CRUD | Add to PRD as Planned |
| Appointment | 12-state machine + assignment collision resolution | Add to PRD as Planned |
| Consultation | ICD-10 + medication search dialogs | Add to PRD as Planned |
| Admin | Skill CRUD (4 types, certified/active flags) | Add to PRD as Planned |
| Admin | Work Hour templates (code, hours, priority) | Add to PRD as Planned |
| Admin | Template editor (markdown + template, stub) | Add to PRD as Planned |
| Admin | CSV data import (staff + customer lists) | Add to PRD as Planned |
| Admin | System config operations (BasisWeb sync, cache, cleanup) | Add to PRD as Planned |
| Customer | Billing management (price lists, discounts) | Add to PRD as Planned |
| Customer | Location SIP accounts + connection testing | Add to PRD as Planned |
| Customer | Customer user management (role assignment, skills) | Add to PRD as Planned |
| Invoice | xRechnung (XML invoice) export | Add to PRD as Planned |
| Invoice | Invoice storno (credit note) workflow | Add to PRD as Planned |
| Invoice | Worklog download + multi-template export | Add to PRD as Planned |
| Onboarding | Step checklist with file upload + date tracking | Add to PRD as Planned |
| Treatment | MonthTable view of therapy appointments with reminder | Expand existing Treatment entry |
| TreatmentPlan | 12-state therapy plan lifecycle with expert week calendar | Add to PRD as Planned |
| TreatmentPlan | Appointment position collection with soft-delete | Add to PRD as Planned |
| TreatmentPlan | Apply Plan — async appointment generation from templates | Add to PRD as Planned |
| ShiftPlan | Recurring shift templates with preferred experts | Add to PRD as Planned |
| ShiftPlan | Apply Plan — async shift generation + close month summary | Add to PRD as Planned |
| ShiftPlan | Price type auto-suggestion (weekday/night/weekend matrix) | Add to PRD as Planned |

---

### Cross-Module Shared Component Map

#### Highest-Reuse Components

| Component | Source | Used By |
|:---|:---|:---|
| `consultationDetails` dialog (778 lines) | `/consultation/details.html` | Dashboard, Appointment, Consultation list |
| `detailQM.html` (360 lines) | `/questionaire/detailQM.html` | Questionnaire, Consultation (QM tab), Dashboard |
| `appointmentDetails` dialog (635 lines) | `/appointment/details.html` | Dashboard, Appointment list, Consultation |
| `userProfile.mustache` (1014 lines) | `/profile/userProfile.mustache` | Personal profile, Staff detail |
| `view.mustache` (777 lines) | `/consultation/view.mustache` | viewDetails, reviewDetails |
| `assignUserDlg` | `/appointment/assignUser.html` | Dashboard, Appointment, Staff |
| `navbar.mustache` | `/_include/navbar.mustache` | All modules |
| `categories.css` | `/_include/categories.css` | All modules (entity colors) |
| `customOverride.js` | `/_include/customOverride.js` | All pages (notifications, session) |
| `jobStatusDlg.html` | `/_include/jobStatusDlg.html` | Invoice (async export polling) |
| `onboarding/form.html` | `/onboarding/form.html` | Onboarding list views, Profile (staff.htmlm) |
| `admin/password.mustache` | `/admin/password.mustache` | Admin user mgmt, Customer user mgmt |
| `_lib/scripts/gridTable.js` | `/_lib/scripts/gridTable.js` | Onboarding (all 3 views) |
| `zipCodeLookup.js` | `/customer/zipCodeLookup.js` | Customer index, Location management |

#### Module Coupling

- **Dashboard** <-> tightly coupled to -> **Consultation** + **Appointment** (embeds their detail dialogs)
- **Consultation** <- embeds -> **Questionnaire** (QM tab)
- **Appointment** <- uses -> **Profile** (docFinder expert search)
- **Admin** <- embeds -> **Profile** (userProfile.mustache, passwordDlg.html)
- **Customer** <- embeds -> **Profile** (userProfile.mustache) + **Admin** (password.mustache)
- **Invoice** <- uses -> **Includes** (jobStatusDlg for async export polling)
- **Onboarding** <- shared form -> **Profile** (form.html embedded in staff.htmlm)
- **Treatment** <- filtered view of -> **Appointment** (embeds details.html, assignUser.html, docFinder.html)
- **TreatmentPlan** <- embeds -> **Consultation** (viewDetails.html) + **Profile** (expertWeek.js)
- **Shift** <- filtered view of -> **Appointment** (embeds details.html, assignUser.html, docFinder.html)
- **ShiftPlan** <- uses -> **Profile** (docFinder.html) + **AppointmentPlan** (closeMonth.html)
- **Warning** <- referenced by -> **Consultation** (viewDetails, reviewDetails import messages.i18n.js)
- **All modules** <- depend on -> **Includes** (navbar, siteloader, categories.css, customOverride.js)

---

### Hardcoded Strings Inventory

| Module | Count | Top Problem Areas |
|:---|---:|:---|
| Admin | ~90+ | Sysconfig tabs (40+), TOTP (18+), job config (14), user mgmt (8) |
| Consultation | 60+ | Dialog steps, collections, tab content |
| Dashboard | 33+ | Wizards, confirm() dialogs, section headers, unit suffixes |
| Invoice | ~27+ | Detail dialog, print template, email dialog, export dialogs |
| Profile | 26+ | Form labels, password dialog, action tooltips |
| Appointment | 15+ | Confirmation prompts, filter placeholders |
| Customer | ~15 | Location tabs, password dialog, grid headers |
| Includes | ~12 | Login form, password labels, bug report UI |
| Appointment Admin | ~30+ | Inline consultation, calculation, export dialogs |
| Appointment Support | ~30+ | CdrCall status labels, closeMonth prompts |
| Treatment/Plan | ~18+ | Confirm dialogs, table headers, warning text, filter labels |
| Config CRUDs | ~17 | Expert work monthly headers, job price list placeholders |
| Council | ~16 | Doctor role labels, tooltips, dialog headers |
| Utility | ~15+ | Worklog matrix, invoice receiver, template help text |
| Entity CRUDs | ~12 | Room calendar, equipment status, contact import |
| Support+Video | ~10 | Video player labels, category management |
| Shift/Plan | 8 | Grid header "Start", confirm dialogs, export prefix |
| Notification | ~5 | Compose dialog labels |
| Questionnaire | 3 | Header, button, toggle labels |
| Onboarding | 1 | Upload success message |
| Warning | 0 | (all i18n-keyed, but EN translations echo raw enum keys) |
| **GRAND TOTAL** | **~446+** | — |

---

### Bugs Found in Legacy Code

#### Critical (Data Loss / Broken Functionality)

| Module | Bug | Impact |
|:---|:---|:---|
| Profile | Sunday naming: HTML `slotsSu` vs server `slotsSo` | Silent data loss on Sunday saves |
| Consultation | Dialog closes before save completes (race condition) | Data loss on rapid close |
| Profile | Fire-and-forget save with no error handling | Data may not persist |
| Includes | `notify.js` references undefined `message` variable | Browser notifications broken |
| Consultation | `view.i18n.js` line 349: `currentState` uses wrong formatter | Wrong state display |

#### Medium

| Module | Bug | Impact |
|:---|:---|:---|
| Profile | Global `cycleState()` collision between expertDays/expertWeek | Undefined behavior |
| Profile | Async role check gap (grid interactive before check) | Permission bypass window |
| Consultation | Missing `.catch()` on save promises | Unhandled rejections |
| Consultation | XSS risk: error messages via `.html()` without sanitization | Security vulnerability |
| Appointment | AGREED/Override label mismatch | Wrong label displayed |
| Consultation | Duplicate condition in template filter | Logic bug |
| Profile | docFinder.ts/docFinder.js source duplicate | Tech debt |

#### Low / Cosmetic

| Module | Bug |
|:---|:---|
| Profile | "Akutelles" -> "Aktuelles" (German misspelling) |
| Notification | "Recipent" -> "Recipient" (English misspelling) |
| Questionnaire | Commented-out `ratingRisk` row has unclosed `<span>` |
| Consultation | Book number mask sentinel string `"book number mask"` as magic value |
| Admin (Job) | `pricePerConsulation` -> `pricePerConsultation` (datamodel field typo) |
| Customer | Phone field naming inconsistency: `data.phone` maps to cellular but grid says "workphone" |

#### Dead References / Anomalies

| Module | Issue | Impact |
|:---|:---|:---|
| Admin (Import) | `#importType` referenced in JS but missing from HTML | Import type selection broken |
| Admin (Sysconfig) | `#clearFileCache` handler defined, no button | Dead code |
| Admin (Sysconfig) | `#refreshAuth` referenced but not present | Dead code |
| Admin (Group) | `Groups.roles` static mapping appears unused | Dead code |
| Admin (TOTP) | `totpmessages.i18n.js` is empty | All TOTP text hardcoded |
| Admin (TOTP) | Two hidden detail dialogs defined but never triggered by JS | Dead HTML |
| Admin (Template) | Template editor has no service binding | Stub/prototype only |
| Onboarding | `line.find("")` — empty selector in JS | Incomplete code |
| Onboarding | `monthTable.css` loaded but `gridTable.js` used | Possible dead import |
| Onboarding | `messages.i18n.js` is empty | All i18n from other modules |
| TreatmentPlan | State icons commented out with `XXXXXXXXXXXX` placeholders | Dead code |
| TreatmentPlan | `Treatment.Appointments = Termine` in EN translations | German value in English file |
| Warning | `someActionBtn` in toolbar has no handler | Dead code placeholder |
| Warning | Priority field in detail but missing from grid | Inconsistency |
| Warning | EN translations echo raw enum keys (e.g., "ALLERGY") | Localization gap |
| Council | `schedulingMulitplier` field name typo | Datamodel |
| SupportTicket | `comment.lenth` property typo | JS bug |
| CdrCallAssignment | `$grid` referenced outside closure scope | Potential JS error |
| Worklog | Multiple grid columns bound to same `type` field | Grid bug |
| AppointmentAdmin | Most complex module: 34 service calls, 10 dialogs | Needs decomposition into 8 sub-features |

---

### Dead / Commented-Out Code

| Module | Location | Dead Code |
|:---|:---|:---|
| Dashboard | Calendar view | ACTION and SHIFT click handlers commented out |
| Dashboard | Month view | Counter input fields commented out (replaced with spans) |
| Dashboard | Therapy card section | Commented out |
| Consultation | details.js | `consultationSubmit` variable never used |
| Consultation | details.js | `pages` property never used |
| Consultation | details.js | `handleSpecialFields` is a no-op |
| Consultation | details.js | Empty `dateSignedOff` restriction block |
| Consultation | details.js | ONBOARDING_SHORT logic commented out |
| Consultation | detailDataTreatment.html | `medicationTaken` section commented out |
| Questionnaire | index.htmlm | `ratingRisk` row commented out (with syntax errors) |

---

### Spelling Inconsistencies to Normalize

| Legacy Spelling | Correction | Scope |
|:---|:---|:---|
| `questionaire` | `questionnaire` | Directory, files, i18n keys, CSS |
| `nerologyDescription` | `neurologyDescription` | Data model field |
| `tabaccoUsage` | `tobaccoUsage` | Data model field |
| `conspicious` | `conspicuous` | Warning service method name |
| `Akutelles` | `Aktuelles` | German password label |
| `Recipent` | `Recipient` | English notification translation |
| `pricePerConsulation` | `pricePerConsultation` | Job datamodel field |
| `saveTreatement` | `saveTreatment` | Event name in treatmentPlan HTML + JS |
| `schedulingMulitplier` | `schedulingMultiplier` | CouncilPlan datamodel field |
| `comment.lenth` | `comment.length` | SupportTicket JS property access |

---

### Translation Gaps

#### Missing English Translations (DE-only keys)

| Key Pattern | Count | Module |
|:---|---:|:---|
| `rating.wahrsch.*` (probability scale) | 6 | Questionnaire |
| `rating.risk.*` (risk scale) | 6 | Questionnaire |
| `Suitability.*` enum values | ~5 | Questionnaire |
| `Questionaire.date*` fields | 3 | Questionnaire |
| `consultation.review` | 1 | Consultation |

#### Framework Translations (in corinis:webCore JAR)

Base button/dialog/label translations are bundled in the framework JAR and not directly accessible. The modern implementation needs its own copies of: `button.save`, `button.cancel`, `button.delete`, `dialog.confirm`, `label.required`, etc.

---

### Wireframe Inventory

| Module | Wireframes | Complexity | Notes |
|:---|---:|:---|:---|
| Dashboard | 15 | Very High | Nested collections, state variants, 4 phases |
| Consultation | 10 | Very High | 11 tabs, 7 types, 100+ fields |
| Admin | 9 | Medium-High | Job config (price matrices), sysconfig (5 tabs), TOTP, tree widget |
| Profile | 7 | Very High | 1014-line form, expert search, grids |
| Includes | 6 | Low-Medium | Shared components, login flow, references |
| Entity CRUDs | 6 | Medium-High | Room FullCalendar, Equipment 2-tab, Contact 4-tab+QR |
| Utility | 6 | Medium | InvoiceReceiver complex, worklog matrix, Markdown preview |
| Appointment Admin | 5 | Very High | 10 dialogs, inline consultations, QM, calculation |
| Treatment | 5 | Medium-High | MonthTable, 12-state machine, dual dialogs, expert week calendar |
| Appointment | 4 | High | MonthTable grid, 12-state machine |
| Invoice | 4 | Medium-High | Positions collection, tax calc, print, email |
| Support+Video | 4 | Medium | Ticket comments, video players, card browsing, chunked upload |
| Customer | 3 | Medium | Tabbed details, Leaflet map, billing collections |
| Notification | 3 | Low-Medium | List/compose UI |
| Config CRUDs | 3 | Low-Medium | ExpertWorkMonthly complex, rest simple |
| Appointment Support | 3 | Medium | Plan+closeMonth, CdrCall toolbar, CdrCallAssignment |
| Onboarding | 2 | Low-Medium | Dynamic grid, step checklist dialog |
| Questionnaire | 2 | Medium | 24-column grid, radio scales |
| Shift | 2 | Medium | MonthTable, plan detail with expert collection |
| Council | 2 | Medium | MonthTable + plan detail (like shift) |
| Warning | 1 | Low | Standard grid + modal detail |
| **TOTAL** | **102** | — | — |

---

### Phase C Execution Plan — SUPERSEDED

> **Note:** The original Phase C wireframe priority order below is superseded by the Phase D data dictionary work (see below). Wireframe creation must wait until the data dictionary for each domain is complete, to ensure correct component type selection.

**Original wireframe count:** 102 total across all modules. The wireframe inventory per module remains valid but execution is now gated on Phase D completion per domain.

---

## Phase D: Data Dictionary & Analysis Restructuring (2026-03-22)

### Purpose

Before creating wireframes (Phase C), build a **data dictionary** per business domain that:
1. Catalogs every UI element type → abstract data type (e.g. `<textarea>` → `bigstring`, `<select>` with enum → `enum:ConsultationType`, `<input type="date">` → `date`, clockpicker → `time`, autocomplete → `reference:Entity`)
2. Maps every UI field (`data.*` path) → exact MongoDB collection.field (using `specs/mongodb-mapping/` as reference)
3. Documents German→English naming per field (from `ApplicationResources.properties` DE/EN + hardcoded strings)
4. Flags fields that have **no database counterpart** (workflow-only fields like "send message to role group") with a note about the backend action they trigger

This ensures wireframes use the correct component types and that the data flow from UI→DB is fully documented.

### Analysis Directory Restructuring

The current `specs/analysis/` directory structure is organized by legacy module. It must be reorganized by **business domain** to align with `specs/mongodb-mapping/` categories. This restructuring happens as part of Phase D.

#### MongoDB Mapping Changes (2026-03-22)

The following entities were moved in `specs/mongodb-mapping/`:
- **Room**: `planning.md` → `customer.md`
- **Equipment, EquipmentGroup, LocationRoomsDto**: `treatment.md` → `customer.md`

These moves affect the domain assignment of the corresponding analysis documents.

#### Business Domain Mapping

| Business Domain | Current Analysis Dirs | MongoDB Mapping File(s) | Data Dictionary File |
|:---|:---|:---|:---|
| **Treatment** | `consultation`, `treatment`, `warning`, `questionnaire` + split parts from `dash`, `entity-cruds`, `appointment` | `treatment.md`, `external-data.md` | `data-dictionary-treatment.md` |
| **Planning** | `appointment` (scheduling parts), `appointment-support` (AppointmentPlan), `shift`, `council` + split parts from `dash` | `planning.md` | `data-dictionary-planning.md` |
| **User Management** | `profile`, `onboarding` + split parts from `admin` (user mgmt, TOTP, group, skill) | `user-management.md`, `capabilities.md` | `data-dictionary-user-management.md` |
| **Customer** | `customer`, + split parts from `entity-cruds` (room, equipment, contact) | `customer.md` | `data-dictionary-customer.md` |
| **Accounting** | `invoice`, `appointment-admin` + split parts from `utility` (worklog, invoiceReceiver), `config-cruds` (jobPriceList, product, closedMonth, stornoGroup, expertWorkMonthly), `admin` (job config, workHour) | `accounting.md` | `data-dictionary-accounting.md` |
| **System** | `includes`, `notification` + split parts from `admin` (landing, sysconfig, import, MOTD, template), `utility` (exportTemplate, notificationTemplate, userFile), `config-cruds` (locationType, exclusionCriteria, supportCategory, loginNotification), `dash` (main, admin panels, login notification modal), `appointment-support` (CdrCall, CdrCallAssignment) | `system.md`, `news.md`, `external-data.md` | `data-dictionary-system.md` |
| **Academy** | `support-video` + split parts from `utility` (userVideoHistory) | `academy.md` | `data-dictionary-academy.md` |
| **Interfaces** | split from `dash` (BasisWeb wizard) | `interfaces.md` | `data-dictionary-interfaces.md` |

#### Files Requiring Physical Splitting

These multi-domain files must be split into separate smaller .md files per domain:

| Original File | Domains | Split Into |
|:---|:---|:---|
| `entity-cruds/01-room-equipment-contact-medication-patientdata.md` | Customer (room, equipment, contact), Treatment (medication, patientData) | `customer/room/01-room.md`, `customer/equipment/01-equipment.md`, `customer/contact/01-contact.md`, `treatment/medication/01-medication.md`, `treatment/patient-data/01-patient-data.md` |
| `config-cruds/01-config-cruds.md` | Accounting (jobPriceList, product, closedMonth, stornoGroup, expertWorkMonthly), System (locationType, exclusionCriteria, supportCategory, loginNotification) | `accounting/config/01-accounting-config.md`, `system/config/01-system-config.md` |
| `utility/01-worklog-templates-files.md` | Accounting (worklog, invoiceReceiver), System (exportTemplate, notificationTemplate, userFile), Academy (userVideoHistory) | `accounting/worklog/01-worklog.md`, `accounting/invoice-receiver/01-invoice-receiver.md`, `system/templates-files/01-templates-files.md`, `academy/video-history/01-user-video-history.md` |
| `admin/04-simple-cruds.md` | User Management (skill), System (MOTD, template), Accounting (workHour) | `user-management/admin-skill/04-skill.md`, `system/admin-cruds/04-motd-template.md`, `accounting/admin-workhour/04-workhour.md` |
| `admin/05-sysadmin-views.md` | System (sysconfig, import), User Management (group mgmt) | `system/admin-system/05-sysconfig-import.md`, `user-management/admin-group/05-group-management.md` |
| `dash/04-dashboard-dialogs.md` | Planning (endShiftDlg, adHocAppointment, appointmentsConfirmModal, appointmentsDeclineModal), Treatment (endAppointmentDlg, summarizeAppointmentDlg, consultationIncarcerationCheck, consultationIncarceration), User Management (userStatsDetails), System (loginNotificationModal) | Split into 4 domain-specific dialog files |
| `appointment/02-appointment-details.md` | Planning (state transitions, user assignment, collision handling), Treatment (patient data CRUD, file uploads) | `planning/appointment/02-appointment-details-scheduling.md`, `treatment/appointment-patient/02-appointment-details-patient.md` |

#### Dashboard Documents Domain Assignment (Decided)

| Doc | Content | Assigned Domain | Reasoning |
|:---|:---|:---|:---|
| `01-dashboard-main.md` | Main layout: MOTD cards, stats, scheduling overview | **System** | App shell / landing page |
| `02-dashboard-selfservice.md` | Self-service scheduling (available/queued/waiting) | **Planning** | Scheduling actions |
| `03-dashboard-admin.md` | Admin panels: active calls, birthdays, doctor info | **System** | Admin overview panels |
| `04-dashboard-dialogs.md` | 10 inline dialogs | **Split across 4 domains** | See splitting table above |
| `05-consultation-wizard.md` | Create new consultations wizard | **Treatment** | Consultation creation |
| `06-basisweb-wizard.md` | BasisWeb patient import wizard | **Interfaces** | External system integration |
| `07-consultation-template.md` | Consultation template CRUD | **Treatment** | Consultation data management |
| `08-shift-dialog.md` | Shift scheduling dialog | **Planning** | Shift lifecycle |
| `09-calendar-view.md` | Calendar day view | **Planning** | Scheduling visualization |
| `10-week-view.md` | Week view | **Planning** | Scheduling visualization |
| `11-month-view.md` | Month view | **Planning** | Scheduling visualization |
| `wireframe-plan.md` | Wireframe inventory for all dash components | **Split by domain** | Each domain gets its wireframe entries |

#### Dashboard Dialog Assignment Detail (from doc 04)

| # | Dialog ID | Service Call | Assigned Domain | Reasoning |
|:---|:---|:---|:---|:---|
| 1 | `#userStatsDetails` | `InfoService.getNumbers` | **User Management** | Expert/employee stats per department |
| 2 | `#endShiftDlg` | `AppointmentService.done` | **Planning** | Pure scheduling — time adjustment only, no clinical data |
| 3 | `#endAppointmentDlg` | `AppointmentService.done` + QM | **Treatment** | Captures treatment quality (QM questionnaire) |
| 4 | `#loginNotificationModal` | `LoginNotificationService.accept` | **System** | Login flow infrastructure |
| 5 | `#summarizeAppointmentDlg` | `AppointmentService.summarize` + QM | **Treatment** | Captures treatment outcome (further treatment counters, communication type, QM) |
| 6 | `#adHocAppointment` | `AppointmentService.createAdHoc` | **Planning** | Pure scheduling — create appointment slot |
| 7 | `#consultationIncarcerationCheck` | `ConsultationService.checkCustomer` | **Treatment** | Consultation/incarceration workflow |
| 8 | `#consultationIncarceration` | `ConsultationService.prepareCustomer` | **Treatment** | Consultation/incarceration workflow |
| 9 | `#appointmentsConfirmModal` | `AppointmentService.agreeAll` | **Planning** | Bulk-accept appointment assignments |
| 10 | `#appointmentsDeclineModal` | `AppointmentService.disagreeAll` | **Planning** | Bulk-decline appointment assignments |

#### Appointment Details Split (doc 02)

`appointment/02-appointment-details.md` contains both scheduling and treatment concerns. Split into:
- **Planning** (`02-appointment-details-scheduling.md`): State transition dialog (`#appointmentStateDlg`), user assignment (autocomplete, suggestions, accept/reject/reserve/override/abort), assignment history, referenced appointments, collision handling
- **Treatment** (`02-appointment-details-patient.md`): Patient data CRUD (add/edit/remove patient), patient file uploads/downloads, patient data attachments

#### Wireframe Plan Splitting

Each existing `wireframe-plan.md` that spans multiple domains must be split into domain-specific wireframe plans. The original wireframe IDs are preserved for traceability.

#### Old Directory Cleanup

After restructuring, all old analysis directories are **deleted entirely**. No redirect files or archives — the git history preserves the originals.

### Target Directory Structure

```
specs/analysis/
├── data-dictionary-index.md              ← Central summary + links to all domain dictionaries
│
├── treatment/                            ← Core medical data
│   ├── README.md
│   ├── data-dictionary-treatment.md
│   ├── consultation/                     ← From: specs/analysis/consultation/
│   │   ├── 01-consultation-list.md
│   │   ├── 02-consultation-details-header.md
│   │   ├── 03-consultation-details-standard.md
│   │   ├── 04-consultation-details-onboarding.md
│   │   ├── 05-consultation-details-incarceration.md
│   │   ├── 06-consultation-details-treatment-warning.md
│   │   ├── 07-consultation-view-review.md
│   │   ├── 08-consultation-details-js.md
│   │   └── wireframe-plan.md
│   ├── warning/                          ← From: specs/analysis/warning/
│   │   └── 01-warning-management.md
│   ├── questionnaire/                    ← From: specs/analysis/questionnaire/
│   │   ├── 01-questionnaire-list.md
│   │   ├── 02-questionnaire-detail.md
│   │   └── wireframe-plan.md
│   ├── treatment-core/                   ← From: specs/analysis/treatment/
│   │   ├── 01-treatment-and-category.md
│   │   └── 02-treatment-plan.md
│   ├── medication/                       ← Split from: entity-cruds/01-*
│   │   └── 01-medication.md
│   ├── patient-data/                     ← Split from: entity-cruds/01-*
│   │   └── 01-patient-data.md
│   ├── appointment-patient/              ← Split from: appointment/02-*
│   │   └── 02-appointment-details-patient.md
│   └── dashboard/                        ← Split from: dash/
│       ├── 05-consultation-wizard.md
│       ├── 07-consultation-template.md
│       ├── 04-dialogs-treatment.md       ← Dialogs 3,5,7,8 from dash/04
│       └── wireframe-plan-treatment.md
│
├── planning/                             ← Scheduling & appointments
│   ├── README.md
│   ├── data-dictionary-planning.md
│   ├── appointment/                      ← From: specs/analysis/appointment/
│   │   ├── 01-appointment-list.md
│   │   ├── 02-appointment-details-scheduling.md  ← Split from: 02-appointment-details.md
│   │   ├── 03-appointment-assign-user.md
│   │   └── wireframe-plan.md
│   ├── shift/                            ← From: specs/analysis/shift/
│   │   └── 01-shift-and-plan.md
│   ├── council/                          ← From: specs/analysis/council/
│   │   └── 01-council-and-plan.md
│   ├── appointment-support/              ← From: specs/analysis/appointment-support/ (AppointmentPlan only)
│   │   └── 01-appointment-plan.md
│   ├── appointment-admin/                ← From: specs/analysis/appointment-admin/
│   │   └── 01-appointment-admin.md
│   └── dashboard/                        ← Split from: dash/
│       ├── 02-dashboard-selfservice.md
│       ├── 08-shift-dialog.md
│       ├── 09-calendar-view.md
│       ├── 10-week-view.md
│       ├── 11-month-view.md
│       ├── 04-dialogs-planning.md        ← Dialogs 2,6,9,10 from dash/04
│       └── wireframe-plan-planning.md
│
├── user-management/                      ← Users, profiles, auth
│   ├── README.md
│   ├── data-dictionary-user-management.md
│   ├── profile/                          ← From: specs/analysis/profile/
│   │   ├── 01-profile-form.md
│   │   ├── 02-profile-staff.md
│   │   ├── 03-profile-dialogs.md
│   │   ├── 04-profile-expert-availability.md
│   │   └── wireframe-plan.md
│   ├── onboarding/                       ← From: specs/analysis/onboarding/
│   │   └── 01-onboarding-flow.md
│   ├── admin-user/                       ← Split from: admin/
│   │   ├── 02-user-management.md
│   │   └── 06-totp-onboarding.md
│   ├── admin-group/                      ← Split from: admin/05-*
│   │   └── 05-group-management.md
│   ├── admin-skill/                      ← Split from: admin/04-*
│   │   └── 04-skill.md
│   └── dashboard/                        ← Split from: dash/04
│       └── 04-dialogs-user-management.md ← Dialog 1 from dash/04
│
├── customer/                             ← Customers, locations, contacts, rooms, equipment
│   ├── README.md
│   ├── data-dictionary-customer.md
│   ├── customer-core/                    ← From: specs/analysis/customer/
│   │   ├── 01-customer-list-detail.md
│   │   └── 02-location-and-users.md
│   ├── contact/                          ← Split from: entity-cruds/01-*
│   │   └── 01-contact.md
│   ├── room/                             ← Split from: entity-cruds/01-*
│   │   └── 01-room.md
│   └── equipment/                        ← Split from: entity-cruds/01-*
│       └── 01-equipment.md
│
├── accounting/                           ← Invoices, billing, pricing
│   ├── README.md
│   ├── data-dictionary-accounting.md
│   ├── invoice/                          ← From: specs/analysis/invoice/
│   │   ├── 01-invoice-list.md
│   │   └── 02-invoice-details.md
│   ├── worklog/                          ← Split from: utility/01-*
│   │   └── 01-worklog.md
│   ├── invoice-receiver/                 ← Split from: utility/01-*
│   │   └── 01-invoice-receiver.md
│   ├── config/                           ← Split from: config-cruds/01-*
│   │   └── 01-accounting-config.md       ← jobPriceList, product, closedMonth, stornoGroup, expertWorkMonthly
│   ├── admin-job/                        ← Split from: admin/03-*
│   │   └── 03-job-configuration.md
│   └── admin-workhour/                   ← Split from: admin/04-*
│       └── 04-workhour.md
│
├── system/                               ← System config, notifications, shared infra
│   ├── README.md
│   ├── data-dictionary-system.md
│   ├── includes/                         ← From: specs/analysis/includes/
│   │   ├── 01-includes-shared-components.md
│   │   ├── 02-includes-customization.md
│   │   └── wireframe-plan.md
│   ├── notification/                     ← From: specs/analysis/notification/
│   │   ├── 01-notification.md
│   │   └── wireframe-plan.md
│   ├── admin-system/                     ← Split from: admin/
│   │   ├── 01-admin-landing.md
│   │   └── 05-sysconfig-import.md
│   ├── admin-cruds/                      ← Split from: admin/04-*
│   │   └── 04-motd-template.md           ← MOTD + Template editor
│   ├── templates-files/                  ← Split from: utility/01-*
│   │   └── 01-templates-files.md         ← exportTemplate, notificationTemplate, userFile
│   ├── config/                           ← Split from: config-cruds/01-*
│   │   └── 01-system-config.md           ← locationType, exclusionCriteria, supportCategory, loginNotification
│   ├── cdr-call/                         ← Split from: appointment-support/01-*
│   │   └── 01-cdr-call.md               ← CdrCall + CdrCallAssignment
│   └── dashboard/                        ← Split from: dash/
│       ├── 01-dashboard-main.md
│       ├── 03-dashboard-admin.md
│       └── 04-dialogs-system.md          ← Dialog 4 from dash/04
│
├── academy/                              ← Training, videos, support
│   ├── README.md
│   ├── data-dictionary-academy.md
│   ├── support-video/                    ← From: specs/analysis/support-video/
│   │   └── 01-support-and-video.md
│   └── video-history/                    ← Split from: utility/01-*
│       └── 01-user-video-history.md
│
└── interfaces/                           ← External system integration
    ├── README.md
    ├── data-dictionary-interfaces.md
    └── dashboard/                        ← Split from: dash/
        └── 06-basisweb-wizard.md
```

### Execution Priority Order

Data dictionary creation follows this priority (core complex modules first):

| Tier | Domain | Complexity | Key Modules |
|:---|:---|:---|:---|
| **Tier 1** | Treatment | Very High | Consultation (8 docs, 7 types, 100+ fields), treatment plans, prescriptions, warnings, QM |
| **Tier 1** | Planning | Very High | Appointments (12-state machine), shifts, councils, calendar views, MonthTable |
| **Tier 2** | User Management | High | Profile (60+ fields), staff management, TOTP 2FA, skills, groups |
| **Tier 2** | Accounting | High | Invoices, job config (price matrices), worklog, billing |
| **Tier 3** | Customer | Medium | Customer CRUD, locations (Leaflet map, SIP), rooms (FullCalendar), equipment, contacts |
| **Tier 3** | System | Medium | Sysconfig, notifications, shared components, login flow, CdrCall |
| **Tier 3** | Academy | Low-Medium | Support tickets, video management, video library |
| **Tier 3** | Interfaces | Low | BasisWeb wizard only |

### Execution Steps Per Domain

For each domain (in priority order):

1. **Restructure**: Move/split analysis files into the new domain directory
2. **Write README.md**: New consolidated README for the domain
3. **Build data dictionary**: For each UI block in the domain's analysis docs:
   a. Extract every form element with its UI type → abstract data type
   b. Map every `data.*` path to the exact MongoDB `collection.field` using `specs/mongodb-mapping/`
   c. Flag fields with no DB counterpart (workflow-only) and document the backend action
   d. Document German label → English label (from ApplicationResources DE/EN)
   e. Note hardcoded strings needing i18n keys
4. **Write `data-dictionary-{domain}.md`**: Organized by logical UI blocks
5. **Update `data-dictionary-index.md`**: Add domain summary and link
6. **Update wireframe plans**: Split existing wireframe-plan.md files by domain; gate wireframe execution on data dictionary completion

### Revised Phase Sequence

| Phase | Status | Description |
|:---|:---|:---|
| **Phase A** | COMPLETED (2026-03-22) | Markdown analysis of all 47 legacy modules |
| **Phase B** | COMPLETED (2026-03-22) | Consolidation and PRD cross-reference |
| **Phase D** | COMPLETED (2026-03-22) | Data dictionary + analysis restructuring by business domain |
| **Phase C** | BLOCKED on Phase D | Wireframe creation (gated per domain on Phase D completion) |

### Phase D Output Format

#### Central document: `data-dictionary-index.md`

Contains:
- Overview table linking to all domain data dictionaries
- Common UI element type → abstract data type mapping (shared across all domains)
- Common enum types used across multiple domains
- Cross-domain field references (e.g. `ConsultationDoctor` snapshot used in Treatment + Planning)

#### Per-domain document: `data-dictionary-{domain}.md`

Contains per logical UI block:
- Block name and source analysis doc reference
- Field inventory table:

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Book number | Buchnummer | `data.bookNumber` | `consultationData.bookNumber` | [treatment.md#consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | `string` | `text` (masked) | — | Yes | No | Mask from `location.booknumberMask` |
| Gender | Geschlecht | `data.body.gender` | `consultationData.body.gender` | [treatment.md#consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | `enum:Gender` | `select` | FEMALE, MALE, OTHER | Yes | No | `internalOnly` visibility |
| Diagnosis comment | Diagnoskommentar | `data.treatment.diagnosis.comment` | `consultationData.treatment.diagnosis.comment` | [treatment.md#consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | `bigstring` | `textarea` | — | No | No | — |
| Doctor | Arzt | `data.doctor` | `consultationData.doctor` (DBRef→`user`) | [treatment.md#consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) + [user-management.md#expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `reference:user` | `autocomplete` | `UserService.autocomplete` | No | No | Display: `displayName` |
| Send reminder | Erinnerung senden | — | — (no DB field) | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.sendReminder` |

The **DB Mapping Reference** column links to the exact section in `specs/mongodb-mapping/{file}.md` where the collection and field are defined. For DBRef references, link both the source collection and the referenced collection. For workflow-only fields (no DB counterpart), use `—`.

---

### Phase D Batch Execution Plan (for AI Agent)

> **Context for a new session**: This section contains everything an AI agent needs to execute Phase D from scratch. Read `specs/draft/plan-analyse-ui-elements.md` (this file) and the referenced source files. Do NOT start automatically — wait for the user to confirm which batch to execute.

#### Prerequisites

Before starting any batch:
1. Read this entire plan document to understand the Phase D purpose, domain mapping, and output format
2. Read `specs/mongodb-mapping/README.md` for the database entity overview
3. Verify the current state of `specs/analysis/` to confirm which restructuring has already been done

#### Batch D1: Restructure Analysis Directory

**Goal**: Move and split all analysis files into the new business domain directory structure.

**Steps**:
1. Create all 8 domain directories under `specs/analysis/` (treatment, planning, user-management, customer, accounting, system, academy, interfaces) with their subdirectories as defined in "Target Directory Structure" above
2. **Move whole files** — files that belong entirely to one domain (e.g., `consultation/*.md` → `treatment/consultation/`)
3. **Split multi-domain files** — read each file listed in "Files Requiring Physical Splitting", extract the relevant sections, and write them to the correct domain subdirectories. Preserve all original content; do not summarize or rewrite. Add a header note to each split file indicating: original source file, which sections were extracted, and which other domains received the remaining sections
4. **Split wireframe plans** — extract wireframe entries from `dash/wireframe-plan.md` into domain-specific wireframe plans, preserving original wireframe IDs
5. **Write domain READMEs** — for each domain, write a new README.md listing all analysis documents, their origin, and a brief scope description
6. **Delete old directories** — remove all original analysis directories after verifying all content has been moved
7. **Verify** — list the new directory structure and confirm all files are in place

**Validation**: Count total .md files before and after restructuring (excluding READMEs). The count of analysis content must be preserved (content split across domains counts as multiple files but the total information must be equal).

#### Batch D2: Data Dictionary — Treatment (Tier 1)

**Goal**: Build `specs/analysis/treatment/data-dictionary-treatment.md`

**Input files** (read all):
- `specs/analysis/treatment/consultation/01-consultation-list.md` through `08-consultation-details-js.md`
- `specs/analysis/treatment/warning/01-warning-management.md`
- `specs/analysis/treatment/questionnaire/01-questionnaire-list.md`, `02-questionnaire-detail.md`
- `specs/analysis/treatment/treatment-core/01-treatment-and-category.md`, `02-treatment-plan.md`
- `specs/analysis/treatment/medication/01-medication.md`
- `specs/analysis/treatment/patient-data/01-patient-data.md`
- `specs/analysis/treatment/appointment-patient/02-appointment-details-patient.md`
- `specs/analysis/treatment/dashboard/05-consultation-wizard.md`, `07-consultation-template.md`, `04-dialogs-treatment.md`

**MongoDB mapping files** (for field→DB mapping):
- `specs/mongodb-mapping/treatment.md` (consultationData, consultation, treatment, treatmentCategory, patient, patientData, patientAlerts, serviceQm, questionaire, equipment, equipmentGroup, locationRoomsDto)
- `specs/mongodb-mapping/external-data.md` (icd10, medication)

**Translation files** (for DE→EN naming):
- `~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources.properties` (DE)
- `~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources_en.properties` (EN)

**Steps**:
1. For each analysis document, extract every form element, grid column, collection field, filter field, and dialog field
2. For each extracted field, look up the `data.*` path in the mongodb-mapping files to find the exact `collection.field` and its chapter anchor link
3. Classify the UI element type → abstract data type
4. Look up German and English labels from the translation files
5. Flag workflow-only fields (no DB match) with the backend action they trigger
6. Write the data dictionary organized by logical UI blocks (consultation list, consultation details header, standard form, onboarding form, etc.)
7. Update `specs/analysis/data-dictionary-index.md` with the Treatment entry

#### Batch D3: Data Dictionary — Planning (Tier 1)

**Goal**: Build `specs/analysis/planning/data-dictionary-planning.md`

**Input files**: All files under `specs/analysis/planning/` (appointment, shift, council, appointment-support, appointment-admin, dashboard)

**MongoDB mapping files**:
- `specs/mongodb-mapping/planning.md` (appointmentPlan, expertWeek, expertDays, appointment, appointmentAssignment, appointmentAssignmentHistory, shiftPlan, holiday)

**Steps**: Same as Batch D2, adapted for Planning domain.

#### Batch D4: Data Dictionary — User Management (Tier 2)

**Goal**: Build `specs/analysis/user-management/data-dictionary-user-management.md`

**Input files**: All files under `specs/analysis/user-management/` (profile, onboarding, admin-user, admin-group, admin-skill, dashboard)

**MongoDB mapping files**:
- `specs/mongodb-mapping/user-management.md` (user, group, accessRight, userFile, persistentSession, onboardingHistory, onboardingStep, loginNotification)
- `specs/mongodb-mapping/capabilities.md` (skill)

**Steps**: Same as Batch D2, adapted for User Management domain.

#### Batch D5: Data Dictionary — Accounting (Tier 2)

**Goal**: Build `specs/analysis/accounting/data-dictionary-accounting.md`

**Input files**: All files under `specs/analysis/accounting/` (invoice, worklog, invoice-receiver, config, admin-job, admin-workhour, appointment-admin)

**MongoDB mapping files**:
- `specs/mongodb-mapping/accounting.md` (invoice, invoiceComponent, invoiceReceiver, expertWorkMonthly, jobId, jobPriceList, product, cashRegister, closedMonth, stornoGroup, workHour)

**Steps**: Same as Batch D2, adapted for Accounting domain.

#### Batch D6: Data Dictionary — Customer (Tier 3)

**Goal**: Build `specs/analysis/customer/data-dictionary-customer.md`

**Input files**: All files under `specs/analysis/customer/` (customer-core, contact, room, equipment)

**MongoDB mapping files**:
- `specs/mongodb-mapping/customer.md` (customer, location, locationType, site, room, locationRoomsDto, equipmentGroup, equipment)

**Steps**: Same as Batch D2, adapted for Customer domain.

#### Batch D7: Data Dictionary — System (Tier 3)

**Goal**: Build `specs/analysis/system/data-dictionary-system.md`

**Input files**: All files under `specs/analysis/system/` (includes, notification, admin-system, admin-cruds, templates-files, config, cdr-call, dashboard)

**MongoDB mapping files**:
- `specs/mongodb-mapping/system.md` (log, asyncJobQueue, exportTemplate, supportCategory, uploadFile, sequenceEntity, videoclinicSystem, cacheState)
- `specs/mongodb-mapping/news.md` (notification, notificationTemplate, messageOfTheDay)
- `specs/mongodb-mapping/external-data.md` (cDRCall, cDRCallAssignment)

**Steps**: Same as Batch D2, adapted for System domain.

#### Batch D8: Data Dictionary — Academy + Interfaces (Tier 3)

**Goal**: Build `specs/analysis/academy/data-dictionary-academy.md` and `specs/analysis/interfaces/data-dictionary-interfaces.md`

**Input files**:
- Academy: `specs/analysis/academy/support-video/01-support-and-video.md`, `academy/video-history/01-user-video-history.md`
- Interfaces: `specs/analysis/interfaces/dashboard/06-basisweb-wizard.md`

**MongoDB mapping files**:
- `specs/mongodb-mapping/academy.md` (video, userVideoHistory, videoCategory)
- `specs/mongodb-mapping/interfaces.md` (basisWebData, basisWebAppointment)

**Steps**: Same as Batch D2, adapted for both domains. These are small enough to combine into one batch.

#### Batch D9: Central Index + Finalization

**Goal**: Finalize `specs/analysis/data-dictionary-index.md` and verify completeness.

**Steps**:
1. Write the central index document with:
   - Overview table linking to all 8 domain data dictionaries
   - Common UI element type → abstract data type mapping table
   - Common enum types shared across domains (ConsultationType, AppointmentState, Gender, etc.)
   - Cross-domain field references (ConsultationDoctor, PlanUser, ConsultationJob snapshots etc. — reference `specs/mongodb-mapping/README.md` "Shared Sub-Entities Reference" section)
2. Cross-validate: for each domain dictionary, verify every MongoDB path actually exists in the referenced mongodb-mapping file
3. Generate a summary count: total fields per domain, total workflow-only fields, total hardcoded strings
4. Update this plan document (`specs/draft/plan-analyse-ui-elements.md`) to mark Phase D as COMPLETED

---

# Example 1: Form block with title and inputs

Analyse the files as follows:

```
<h6>{{i18n.consultation.treatment.diagnosis}}</h6>
<div class="row mt-2 mb-4">
	<div class="col-md-12">
		<strong>{{i18n.Treatment.diagnosisComment}}</strong>
		<textarea class="form-control mb-1" placeholder="{{i18n.Treatment.diagnosisComment}}" name="data.treatment.diagnosis.comment"></textarea>
	</div>
</div>
```

The `<h6>` tag is a **title** of a block of the next rows, that are coded with `class="row"` attribute. The `<strong>` element with a **{{i18n.*}}** is a **text reference** to a translation directory and corresponds to a **name** of the following element, in this case a `<textarea>` as **type of the UI element**.

The name attribute of the `<textarea>` element is a reference to the database backend **datamodel**.

# Example 2: Detail dialog with actions and visualization

The following structure can be analysed as follows:

```
<div class="detail" id="consultationDetailsDlg" data-target="primary" data-width="1500" data-crudbuttons="false" data-icon="fa fa-heartbeat" data-color="bg-color-consultation" title="{{i18n.consultation}}" style="display:none">
	<div class="container">
		<div class="row notemplate">
			<div class="col-md-3">
				<div class="input-group input-group-sm">
					<span class="input-group-text"><i class="far fa-user-injured"></i></span>
					<input class="form-control" disabled="disabled" name="data.bookNumber" placeholder="{{i18n.consultation.booknumber}}"/>
					<span class="input-group-text"><i id="openSearchDlg" class="action far fa-copy" title="Existierende Behandlung kopieren"></i></span>
					<span class="input-group-text"><i id="createConsulationTemplate" class="action far fa-books-medical" title="Als Vorlage speichern"></i></span>
				</div>
			</div>
			<div class="col-md-2 internalOnly">
				<div class="input-group input-group-sm" title="{{i18n.user.gender}}">
					<select class="form-select required" name="data.body.gender">
						<option value="">{{i18n.user.gender}}</option>
						<option value="FEMALE">{{i18n.Gender.FEMALE}}</option>
						<option value="MALE">{{i18n.Gender.MALE}}</option>
						<option value="OTHER">{{i18n.Gender.OTHER}}</option>
					</select>
				</div>
			</div>
        </div>
    </div>
</div>
```

The `<div>` element with the attribute `class="detail"` uses the `id` attribute as a reference to a datamodel. In this case `id="consultationDetailsDlg"` is the reference to the 'consultation' datamodel in the database backend. The `title` attribute is the title of the block. The `<div>` is followed by another `<div class="container">` representing the block.

**Visualization attributes** on `class="detail"` elements describe how the dialog is presented:

| Attribute          | Purpose                                                                 |
| :----------------- | :---------------------------------------------------------------------- |
| `data-target`      | Target area where the dialog opens (`primary`, `modal`, etc.)           |
| `data-crudbuttons` | Whether standard CRUD buttons (save/delete) are shown (`true`/`false`)  |
| `data-icon`        | FontAwesome icon class displayed in the dialog header                   |
| `data-color`       | Background color class for the dialog header (e.g. `bg-color-consultation`) |

The `<span class="input-group-text"><i class="far fa-user-injured"></i></span>` uses the `fa-user-injured` **symbol** from the FontAwesome icon library. In this case we can use the attribute `placeholder` of the next element, in this case `<input>`, as **text reference**.

The `<i id="openSearchDlg" class="action far fa-copy" title="Existierende Behandlung kopieren">` is due to `class="action"` a **click action** that references the `openSearchDlg` function, uses the tooltip with the attribute `title` but with a missing translation because it's not coded as `{{i18n.*}}` text reference. In this case extract the title text of the element and add it to the list with the note for the text reference as **HARDCODED** and translate it into English.

The element `<option value="">{{i18n.user.gender}}</option>` is not an option for the `<select>` element because its `value` attribute is empty. In this case the text of it is the text reference / name of the `<select>` element.

# Example 3: Field display elements

The following structure can be analysed as follows:

```
<div id="roomDetailDialog" data-icon="fa fa-building"	data-color="bg-color-room" title="{{i18n.room}}" style="display: none">
    <div class="container">
	    <div class="row">
		<div class="col-md-4 field">data.name</div>
		<div class="col-md-1 field">data.number</div>
		<div class="col-md-7 field">data.description</div>
	    </div>
    </div>
</div>
```

An element with `class="field"` uses the text content as a reference to the datamodel, in this case `data.name`. The value will be rendered at runtime accordingly.

## Field type modifiers

The `field` class can have additional type modifiers that affect how the value is displayed:

| Class              | Rendering behavior                          |
| :----------------- | :------------------------------------------ |
| `field`            | Plain text value                            |
| `field date`       | Formatted as date (locale-dependent)        |
| `field time`       | Formatted as time                           |
| `field dateTime`   | Formatted as date and time                  |
| `field decimal`    | Formatted as decimal number                 |
| `field number`     | Formatted as integer number                 |

# Example 4: Collection / repeater binding

```
<tbody class="collection" data-field="data.appointments" id="appointmentList">
    <tr>
        <td><span class="field">appointments.date</span></td>
        <td><span class="field">appointments.state</span></td>
        <td><button class="btn btn-primary open">Open</button></td>
    </tr>
</tbody>
```

An element with `class="collection"` and `data-field="data.arrayName"` is a **repeater**. The single child row/element serves as a **template** that is duplicated for each item in the array. Inside the template, `class="field"` elements reference fields relative to the array item (e.g. `appointments.date`).

Document each collection as a separate sub-section listing the repeated fields and any row-level actions.

# Example 5: Wizard / multi-step pages

```
<div id="consultationWizard">
    <div class="page" id="step1">
        <h6>{{i18n.wizard.step1.title}}</h6>
        <!-- form fields for step 1 -->
    </div>
    <div class="page" id="step2">
        <h6>{{i18n.wizard.step2.title}}</h6>
        <!-- form fields for step 2 -->
    </div>
    <div class="buttonset">
        <button data-event="back">{{i18n.back}}</button>
        <button data-event="next">{{i18n.next}}</button>
        <button data-event="save">{{i18n.save}}</button>
    </div>
</div>
```

A wizard is a sequence of `class="page"` divs inside a parent container. Only one page is visible at a time. The `<div class="buttonset">` contains navigation buttons with `data-event` attributes that trigger step transitions. Each page should be documented as a separate block with its own form elements.

# Example 6: Permission / authority gating

## In HTMLM header metadata

```
{"field":"canAdHoc", "method":"authority","params":["ADHOC_APPOINTMENT"]},
```

This sets the boolean `canAdHoc` based on whether the user has the `ADHOC_APPOINTMENT` permission.

## In template body

```
{{#canAdHoc}}
    <button id="adHocAppointmentCreateMenuBtn">...</button>
{{/canAdHoc}}
```

This is a conditional block rendered only if the user has the corresponding permission. Document which elements or entire sections are gated behind permissions using the **Permissions** section in the output.

## Inverted conditions

```
{{^isExpert}}
    <!-- shown only when user is NOT an expert -->
{{/isExpert}}
```

The `{{^variable}}` syntax is the inverted condition (rendered when the variable is false/absent).

# Example 7: Server-populated options and autocomplete

## Dynamic dropdown options

### From enums (simple form)

```
{"field":"consultationTypes", "method":"options","params":["ConsultationType","consultationType","i18n"]},
```

This populates the `consultationTypes` variable with options from the `ConsultationType` enum, using `consultationType` as the value field and `i18n` for translated labels. Document these as dropdowns with **Options: dynamic (EnumName)**.

### From service methods (advanced form)

```
{
    "field": "jobsShift", "method": "options",
    "params": [{ "service": "JobService", "method": "getAvailableShift", "style": "OPTION",
        "value": "id", "content": "code", "data": "pojo"}]
},
```

This calls `JobService.getAvailableShift()` to populate options. The `style: "OPTION"` renders as `<option>` elements, `value` specifies the value property, `content` specifies the display text, and `data: "pojo"` attaches the full object to each option's jQuery data. Document as **Options: dynamic (ServiceName.method)**.

## Autocomplete / object lookup inputs

```
<input class="form-control object mandatory autoselect"
       name="data.expert"
       data-service="ExpertService"
       data-method="findAll"
       data-display="name"
       placeholder="{{i18n.expert}}"/>
```

An input with `class="object autoselect"` is an **autocomplete field** that calls `data-service` / `data-method` to fetch suggestions and displays the `data-display` field. Document the type as **autocomplete** with the service reference.

# Example 8: Required and read-only states

## Required fields

```
<input class="form-control mandatory" name="data.name"/>
<select class="form-select mandatory" name="data.type">
```

The `mandatory` class marks a field as **required**. Document this in the "Required" column.

## Read-only / disabled fields

```
<input class="form-control" disabled="disabled" name="data.bookNumber"/>
<div class="readonly">...</div>
<div class="read-only">...</div>
```

Fields with `disabled="disabled"`, `class="readonly"`, or `class="read-only"` are **read-only**. Document this in the "Read-only" column. Note: the legacy code uses both `readonly` and `read-only` inconsistently — treat both as the same.

# Example 9: Status and color visualization

## Status icons

```
<span class="statusTrue bg-success"><i class="fa fa-check"></i></span>
<span class="statusFalse bg-danger"><i class="fa fa-times"></i></span>
<span class="statusNull bg-secondary"><i class="fa fa-question"></i></span>
```

Status values are rendered as colored icon badges. The pattern maps boolean/null states to visual indicators:

| Class         | Color       | Icon           | Meaning     |
| :------------ | :---------- | :------------- | :---------- |
| `statusTrue`  | `bg-success` (green) | `fa-check`     | Confirmed / active  |
| `statusFalse` | `bg-danger` (red)    | `fa-times`     | Denied / inactive   |
| `statusNull`  | `bg-secondary` (gray)| `fa-question`  | Unknown / pending   |

## Color-coded entity types

Entities use specific background color classes for consistent visual identity:

| Color class               | Entity          |
| :------------------------ | :-------------- |
| `bg-color-appointment`    | Appointment     |
| `bg-color-shift`          | Shift           |
| `bg-color-staff`          | Staff           |
| `bg-color-basisWebData`   | Basis-Web data  |
| `bg-color-consultation`   | Consultation    |
| `bg-color-room`           | Room            |

## Priority-based styling

```javascript
switch(pojo.priority) {
    case "LOW": $card.addClass("bg-secondary text-white");
    case "HIGH": $card.addClass("bg-warning");
    case "URGENT": $card.addClass("text-white bg-danger");
}
```

Cards/elements can be styled by priority level. Document any priority-based visual differentiation.

## State-based colors (calendar events, appointments)

Calendar events and appointment elements compute their background color from a state/type lookup:
```javascript
obj.backgroundColor = CalendarUtils.states[type][state.toLowerCase()]
obj.textColor = CalendarUtils.lightOrDark(obj.backgroundColor)
```

Document the state-to-color mappings when analyzing calendar or appointment views.

# Example 10: Unescaped HTML in translations

```
{{{i18n.someKey}}}
```

Triple-mustache `{{{ }}}` renders unescaped HTML (unlike double-mustache `{{ }}` which escapes). This means the translation value contains HTML markup. Document these with a note **"contains HTML"** in the translation table.

# Example 11: Special UI components

## Calendar (FullCalendar)

Files using FullCalendar display appointments/events in day, week, or month views. Document:
- Event properties mapped from the datamodel (title, start, end, color, state)
- Event click/select handlers
- Custom event rendering (icons, status badges in event titles)
- Toolbar actions (navigation, view switching, filters)

## Map (Leaflet)

The shift dialog (`shiftDlg.mustache` / `shiftDlg.js`) embeds a Leaflet map. Document:
- Map data bindings (latitude, longitude fields)
- Marker behavior
- When the map is shown (which dialog/context)

## Popovers and tooltips

```
data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="..."
```

Elements with Bootstrap popover attributes show rich hover content. Document the content template and trigger context.

## Input masking

```javascript
$input.mask(location.booknumberMask)
```

Some inputs use dynamic masks (e.g. book number format). Document the mask pattern source and the affected field.

## Markdown rendering

MOTD (Message of the Day) content is rendered from Markdown using the `marked` library. Document any fields that expect Markdown input.

# Example 12: Status fields via data-field attribute

```
<td class="status" data-field="baseCompleted" title="{{i18n.consultation.base}}"></td>
<td class="status" data-field="dataComplete" title="{{i18n.consultation.medical}}"></td>
```

Elements with `class="status"` and a `data-field` attribute render a boolean/null value from the row's pojo as a status icon. The rendering logic is typically in the JavaScript `postAddCollection` handler:

```javascript
if(pojo[$(this).data().field] === true) {
    $(this).append('<i class="fa fa-check text-success"></i>');
} else {
    $(this).append('<i class="fa fa-question text-danger"></i>');
}
```

Document as field-display with type `status-icon` in the collection fields table.

# Example 13: Multi-select collections with bulk actions

```
<tbody class="collection selectable" data-field="data.queuedActions" data-multi="true" id="queuedActionList">
    <tr class="actionItem">
        <td><input type="checkbox" class="row-select" /></td>
        <td><!-- fields --></td>
    </tr>
</tbody>
```

A collection with `class="selectable"` and `data-multi="true"` supports multi-row selection. Rows toggle a `selected` CSS class. Combined with checkbox inputs and bulk action buttons (accept/decline), this creates a batch operation UI.

Document the select-all button, the bulk action buttons, and the confirmation modal flow.

# Example 14: Nested collections

```
<ul class="list-group list-group-flush collection" data-field="calls.list">
    <li class="list-group-item">
        <strong><span class="field datetime">list.started</span></strong>
        <ul class="collection" data-field="list.parties">
            <li>
                <span class="field">parties.number</span>
                <span class="field">parties.description</span>
            </li>
        </ul>
    </li>
</ul>
```

Collections can be nested. The outer collection binds to `calls.list` and the inner collection binds to `list.parties` (relative to each outer item). When a separate jsForm prefix is used (e.g. `{prefix: "calls"}`), the outer data source is isolated from the main form.

Document nested collections as sub-sections within the parent collection.

# Example 15: Object binding with setObj

```
<div class="form-group col-md-4 field setObj" data-field="data.internalContact">
    <label>{{i18n.action.internalContact}}</label>
    <i class="fa fa-comment-dots action sendUserMessage"></i>
    <span class="field">data.internalContact.displayName</span>
    <a href="data.internalContact.cellularNumber" class="field" data-prefix="tel:">
        <i class="fa fa-phone"></i><span class="field">data.internalContact.cellularNumber</span>
    </a>
</div>
```

An element with `class="setObj"` and `data-field` binds an entire object from the datamodel. Child `class="field"` elements resolve their paths relative to the parent form, not the setObj container. The `data-prefix="tel:"` on the `<a>` element prepends the prefix to the field value at runtime to construct a phone link.

Document the object binding, the prefix behavior, and any actions (like `sendUserMessage`) on the container.

# Example 16: Dynamic URL construction on images

```
<img src="motd.id" class="field card-img" data-prefix="/get/MOTDService/attachment/" data-postfix="/motd.jpg">
```

Images with `class="field"` construct their `src` from: `data-prefix` + field value + `data-postfix`. Document the service URL pattern and the field used as the image identifier.

# Example 17: Conditional button visibility from JavaScript

Not all UI state is expressed in mustache templates. Some buttons are shown/hidden in `postAddCollection` handlers based on pojo properties:

```javascript
if(appointment.state === "LOCKEDIN") {
    $(".startAppointment", line).show();
    $(".newPatient", line).hide();
} else if(pojo.control) {
    $(".newPatient", line).show();
    $(".endAppointment", line).show();
}
```

Document these as **state-driven visibility** in the form elements table's Condition/Permission column, e.g. `state=LOCKEDIN`, `pojo.control=true`.

# Source of the legacy design: HTMLM

The files with the HTMLM extension are mustache templating engine files. At the beginning of these files there is an HTML comment block defining fields with different methods:

## Template includes

```
{"field":"navBar", "method":"template","params":["../_include/navbar.mustache"]},
```

The `field` can be found as `{{>navBar}}` in the file and is replaced by the referenced template file.

## Authority / permission checks

```
{"field":"canAdHoc", "method":"authority","params":["ADHOC_APPOINTMENT"]},
```

Sets a boolean variable based on user permissions. Used in `{{#canAdHoc}}...{{/canAdHoc}}` conditional blocks.

## Variable initialization

```
{"field":"locationName", "method":"variable","params":["session","locationName"]},
```

Initializes a variable from the session or other server-side context. Available as `{{locationName}}` in the template.

## Dynamic option lists

```
{"field":"consultationTypes", "method":"options","params":["ConsultationType","consultationType","i18n"]},
```

Generates an option list from a server-side enum or service. The params define: source enum/entity, value field, and label strategy.

## Conditional blocks

```
{{#canAdHoc}}
...
{{/canAdHoc}}
```

This is an `if` block in the template that is rendered only if `canAdHoc` is true.

```
{{^isExpert}}
...
{{/isExpert}}
```

This is a negated `if` block rendered only when the variable is false or absent.

# Documentation of the results for an AI coding agent

For each analysed page or dialog, produce the following output:

1. **Wireframe**: Create `specs/wireframes/{domain}/{subdomain}/{name}.pen` using Pencil MCP tools. Export PNGs to the same directory.
2. **Workflows & Screenshots**: Create `specs/wireframes/{domain}/{subdomain}/workflows.md` with user-oriented Mermaid diagrams and embedded wireframe screenshots. See `specs/planning/create-wireframes.md` for conventions.
3. **Specification tables**: The detailed tables below

```
# Block: **title**

Visualization: icon: **icon**, color: **color-class**, CRUD buttons: **yes/no**

## Wireframe

→ See `specs/wireframes/{domain}/{subdomain}/{name}.pen`
→ Screenshots and workflows: `specs/wireframes/{domain}/{subdomain}/workflows.md`

## Behavior diagrams

(user-oriented Mermaid diagrams go in workflows.md, not here)

## Form elements

| Text-Reference / Name | Symbol | Datamodel | Type of UI element | Options | Placeholder | Default value | Required | Read-only | Condition/Permission |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **{{i18n.*}}** | **symbol** | **datamodel** | **type** | - **option 1**<br> - **option 2** | **placeholder** | **default** | yes/no | yes/no | **permission or condition** |

Types of UI elements: `text`, `textarea`, `select`, `checkbox`, `radio`, `date`, `time`, `number`, `decimal`, `autocomplete`, `hidden`, `masked-input`, `field-display`, `field-display date`, `field-display time`, `field-display dateTime`, `field-display decimal`

## Collections / Repeaters

### Collection: **name** (data-field: `data.arrayName`)

| Field | Type | Datamodel |
| :--- | :--- | :--- |
| **field name** | **display type** | **array.fieldPath** |

#### Row actions

| Action type | Action | Title |
| :--- | :--- | :--- |
| click | **action id** | **title / tooltip** |

## Click actions

Actions triggered by clicking on elements with `class="action"`.

| Action ID | Symbol | Title (i18n or HARDCODED) | English translation |
| :--- | :--- | :--- | :--- |
| **action id** | **fa-icon** | **title** | **english** |

## Data-event actions

Actions triggered via buttons with `data-event` attributes (wizard navigation, dialog buttons, toolbar actions).

| Event name | Label | Position/Context |
| :--- | :--- | :--- |
| **eventName** | **button label** | **where it appears (buttonset, toolbar, etc.)** |

## Wizard steps

| Step | Page ID | Title | Description |
| :--- | :--- | :--- | :--- |
| 1 | **pageId** | **{{i18n.*}}** | **summary of step content** |

## Permissions

| Permission / Condition | Scope | Description |
| :--- | :--- | :--- |
| **PERMISSION_NAME** or **{{#condition}}** | **what is gated** | **visible to whom / when** |

## Special components

| Component type | Context | Data bindings | Notes |
| :--- | :--- | :--- | :--- |
| **calendar / map / popover / markdown / input-mask** | **where it appears** | **datamodel fields** | **configuration details** |

## Status visualization

| State/Value | Icon | Color | Meaning |
| :--- | :--- | :--- | :--- |
| **state** | **icon** | **color** | **meaning** |

## Naming and translation

| Text-Reference | German | English | Notes |
| :--- | :--- | :--- | :--- |
| **{{i18n.*}}** | Value from ApplicationResources.properties | Value from ApplicationResources_en.properties | **HARDCODED / contains HTML** |
```
