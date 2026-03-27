# Treatment Domain -- User Workflows

This document describes the user experience and decision flows for the Treatment domain: Questionnaire (QM) completion, Consultation Start (wizard + routing), Appointment Summarization, and Incarceration retrieval. All diagrams represent the journey from the user's perspective, not internal system architecture.

---

## Area 1: Consultation Start — Wizard Routing & Patient Selection

### Context

When a clinical staff member wants to start a new consultation for an active appointment, the system must determine the correct wizard path based on the appointment's location configuration. This is a 3-way routing decision that the user does not directly control — the system evaluates it automatically and presents the appropriate wizard.

**Who uses it:** Clinical staff members (nurses, therapists, doctors) working from the treatment dashboard within an active appointment.

**Entry point:** User clicks "Start Consultation" on an active appointment from the treatment dashboard.

**Exit points:** The wizard closes and hands off to the Consultation Details form, with the selected patient, book number, consultation type, and location pre-populated.

---

### 1.1 Consultation Start — Routing Flowchart

This diagram shows the 3-way routing decision and the full consultation wizard flow from the user's perspective.

```mermaid
flowchart TD
    A["Treatment Dashboard<br>(Active Appointment)"] -->|"Start Consultation"| B{"Does appointment<br>have a location?"}

    B -->|"No location"| C["Location Wizard<br>(Single-Step: Select Location)"]
    C -->|"User selects location → Next"| B

    B -->|"Location exists"| D{"Location type =<br>EXTERNAL_BASISWEB<br>AND state ≠ LOCKEDIN?"}

    D -->|"Yes"| E["BasisWeb Wizard<br>(6-step, see Batch 1)"]
    D -->|"No"| F["Consultation Wizard<br>Step 1: Select Patient"]

    F --> G{"Appointment has<br>patients list?"}
    G -->|"Yes"| H["Dropdown populated<br>with patient book numbers"]
    G -->|"No patients"| I["Step 2: Enter Book Number<br>(Manual Input)"]

    H -->|"User selects patient → Next"| J{"Selection<br>length > 3?"}
    J -->|"Yes"| K["Step 3: Select Consultation Type"]
    J -->|"No / Skip"| I

    I -->|"User enters book number → Next"| L{"Input<br>length > 3?"}
    L -->|"No"| M["Validation Error Alert:<br>Please enter valid book number"]
    M --> I
    L -->|"Yes"| K

    K -->|"Types filtered by job capabilities<br>+ location properties"| K
    K -->|"User selects type → Next"| N{"Type selected<br>(non-empty)?"}
    N -->|"No"| K
    N -->|"Yes"| O["Step 4: Summary & Confirm<br>(Expert, Location, Book Number, Type)"]

    O -->|"User confirms → Next"| P["ConsultationService.start()<br>Wizard Closes"]
    P --> EXIT_DETAIL["Consultation Details<br>(Pre-populated with<br>selected data)"]

    style A fill:#e8f4f8,stroke:#2c7bb6
    style C fill:#fff3cd,stroke:#856404
    style E fill:#e8f4f8,stroke:#2c7bb6
    style EXIT_DETAIL fill:#d4edda,stroke:#155724
    style M fill:#fce4ec,stroke:#c62828
```

**Key observations:**

- The 3-way routing is fully automatic: the user sees only the wizard path that applies to their appointment's configuration.
- The **Location Wizard** is a recursive entry point — once the user selects a location, the routing check repeats with the new location.
- The **BasisWeb Wizard** (Batch 1) is an entirely separate flow for external patient data retrieval; it is NOT part of this consultation wizard.
- The patient dropdown in Step 1 is pre-populated from the appointment's patient list. If the list is empty, the user skips directly to manual book number entry.
- **COUNCIL appointment type** has special behavior: selecting a patient auto-fills and locks the location from the patient's associated location data.

---

### 1.2 Consultation Wizard — State Diagram

This diagram models the wizard states and transitions as experienced by the user.

```mermaid
stateDiagram-v2
    [*] --> RoutingCheck: User clicks "Start Consultation"

    RoutingCheck: Routing Decision (automatic)
    LocationWizard: Location Wizard — Select Location
    SelectPatient: Step 1 — Select Patient from Dropdown
    EnterBookNumber: Step 2 — Enter Book Number Manually
    SelectType: Step 3 — Select Consultation Type
    ReviewSummary: Step 4 — Summary & Confirm

    RoutingCheck --> LocationWizard: No location on appointment
    RoutingCheck --> BasisWebWizard: EXTERNAL_BASISWEB location
    RoutingCheck --> SelectPatient: Standard location

    LocationWizard --> RoutingCheck: Location selected → re-check

    state BasisWebWizard <<choice>>
    BasisWebWizard --> [*]: (Handled by Batch 1 BasisWeb Wizard)

    SelectPatient --> SelectType: Valid patient selected (> 3 chars)
    SelectPatient --> EnterBookNumber: No patients / Skip / Invalid selection

    EnterBookNumber --> SelectType: Valid book number entered (> 3 chars)
    EnterBookNumber --> ValidationError: Input too short (≤ 3 chars)
    ValidationError --> EnterBookNumber: User corrects input

    SelectType --> ReviewSummary: Type selected
    SelectType --> SelectType: Empty selection → stays

    ReviewSummary --> [*]: User confirms → Consultation created

    state ValidationError <<choice>>
```

**State transition notes:**

- **RoutingCheck** is an automatic decision state — the user never sees it as a screen; they see the result (one of three wizard paths).
- **LocationWizard** loops back to RoutingCheck because the location selection may change the routing outcome.
- **SelectPatient** and **EnterBookNumber** are the two patient identification paths. They converge at **SelectType**.
- **SelectType** dynamically filters its options based on the user's job capabilities. Not all 7 consultation types are available to every user.
- **ReviewSummary** is the terminal confirmation state before the consultation is created.

---

### 1.3 Consultation Wizard — Sequence Diagram

This diagram shows the user-system interaction during the consultation wizard, including the routing decision.

```mermaid
sequenceDiagram
    actor User
    participant Dashboard as Treatment Dashboard
    participant Router as Routing Logic
    participant LocWizard as Location Wizard
    participant CWizard as Consultation Wizard
    participant Detail as Consultation Details

    Note over User, Dashboard: User has an active appointment

    User->>Dashboard: Clicks "Start Consultation"
    Dashboard->>Router: Evaluate appointment location

    alt No location on appointment
        Router->>LocWizard: Opens Location Wizard
        LocWizard-->>User: Shows location autocomplete field
        User->>LocWizard: Selects location → clicks Next
        LocWizard->>Router: Re-evaluate with selected location
    end

    alt Location is EXTERNAL_BASISWEB (and not LOCKEDIN)
        Router-->>User: Redirects to BasisWeb Wizard (separate flow)
        Note right of Router: See Batch 1 workflows
    else Standard location
        Router->>CWizard: Opens Consultation Wizard at Step 1
    end

    CWizard-->>User: Shows Step 1: patient dropdown (or skip to Step 2)

    alt Patients available in dropdown
        User->>CWizard: Selects patient → clicks Next
        alt Valid selection (> 3 chars)
            CWizard-->>User: Shows Step 3: consultation type select
        else Invalid / empty
            CWizard-->>User: Shows Step 2: manual book number input
        end
    else No patients on appointment
        CWizard-->>User: Shows Step 2: manual book number input
    end

    opt Step 2 shown
        User->>CWizard: Enters book number → clicks Next
        alt Input valid (> 3 chars)
            CWizard-->>User: Shows Step 3: consultation type select
        else Input too short
            CWizard-->>User: Shows validation error alert
            User->>CWizard: Corrects input → clicks Next
            CWizard-->>User: Shows Step 3: consultation type select
        end
    end

    Note right of CWizard: Type options filtered by:<br/>job.consultationStandard,<br/>job.consultationOnboarding,<br/>location.patientDataType, etc.

    User->>CWizard: Selects consultation type → clicks Next
    CWizard-->>User: Shows Step 4: summary (expert, location, book number, type)
    User->>CWizard: Reviews → clicks Next (confirm)

    CWizard->>Detail: Creates consultation → opens Consultation Details
    Detail-->>User: Pre-populated form with selected data
```

**Interaction highlights:**

- The routing decision is invisible to the user — they click one button and the system determines the path.
- Step 3 (type selection) is the critical filtering point: the available options depend on the user's job entity and the appointment's location properties. This means two users with different jobs may see different type options for the same appointment.
- The wizard accumulates state across steps (`appointment`, `location`, `job`, `booknumber`, `type`) and submits everything at once in Step 4.
- After submission, the wizard closes and `ConsultationDetails.open(data)` is called, seamlessly transitioning the user to the full consultation form.

---

## Area 2: Appointment Summarization & End Appointment

### Context

When a clinical staff member finishes working on an appointment, they use one of two dialogs depending on the appointment context:

- **Summarize Appointment** — used for external-location appointments. A comprehensive dialog capturing adjusted times, communication type, further treatment counters, and a QM questionnaire.
- **End Appointment** — used for standard (non-shift) appointments. A simpler dialog confirming end with adjusted times and a QM questionnaire.

Both dialogs embed the same QM questionnaire form, making quality management data collection an integral part of the appointment closure flow.

**Who uses it:** Clinical staff members completing an appointment.

**Entry point:** User clicks "Summarize" or "End Appointment" on an active appointment from the treatment dashboard.

**Exit points:** Dashboard refreshes with the appointment marked as completed, or dialog re-opens on error.

---

### 2.1 Summarize / End Appointment — Flowchart

```mermaid
flowchart TD
    A["Treatment Dashboard<br>(Active Appointment)"] --> B{"Appointment Context?"}

    B -->|"External location<br>(EXTERNAL patientDataType)<br>+ control active<br>+ not shift"| C["Summarize Dialog<br>(1000px, dynamic title)"]
    B -->|"Standard appointment<br>(non-shift)"| D["End Appointment Dialog<br>(900px)"]

    C --> C1["Display: Weekday, Date,<br>Original Times, Location"]
    C1 --> C2["Edit: Adjusted Start/End Times,<br>Communication Type"]
    C2 --> C3["Edit: Further Treatment Counters<br>(Referral, WV, Follow-up, Other)<br>+ Live Total"]
    C3 --> C4["Fill: QM Questionnaire<br>(Rating Scales + Comment)"]
    C4 -->|"Save"| C5{"Confirm:<br>'You confirm correctness<br>of {total} treatments'"}
    C5 -->|"Yes"| C6["AppointmentService.summarize()<br>Dialog Closes"]
    C5 -->|"No"| C4
    C6 --> EXIT_REFRESH["Dashboard Refreshes<br>(Appointment Completed)"]

    D --> D1["Display: Confirmation Text<br>'Should the operation be ended?'"]
    D1 --> D2["Edit: Adjusted Start/End Times"]
    D2 --> D3["Fill: QM Questionnaire<br>(Rating Scales + Comment)"]
    D3 -->|"Save"| D4["AppointmentService.done()<br>Dialog Closes"]
    D4 --> EXIT_REFRESH

    D4 -->|"Error"| D5["Dialog Re-opens<br>with Previous QM Data Preserved"]
    D5 --> D2

    style A fill:#e8f4f8,stroke:#2c7bb6
    style EXIT_REFRESH fill:#d4edda,stroke:#155724
    style C5 fill:#fff3cd,stroke:#856404
    style D5 fill:#fce4ec,stroke:#c62828
```

**Key observations:**

- The **Summarize** dialog has a dynamic title that changes based on appointment type: "Appointment" for APPOINTMENT, "Shift" for SHIFT or COUNCIL.
- The further treatment counters (referral, WV, follow-up, referral-other) have a **live computed total** that updates as the user types. This total is shown in the confirmation prompt.
- The confirmation prompt for Summarize includes a HARDCODED German legal text about data correctness and administrative-only subsequent changes.
- The **End Appointment** dialog preserves QM data across error-retry cycles — if the save fails, the dialog reopens with the user's previously entered questionnaire data intact.
- Both dialogs apply `filterQm()` before displaying the QM section, which adjusts visible rating questions based on job type and consultation context.

---

### 2.2 QM Questionnaire Completion — State Diagram

This diagram models the QM questionnaire sub-flow that is embedded in both the Summarize and End Appointment dialogs.

```mermaid
stateDiagram-v2
    [*] --> FilterApplied: Dialog opens with appointment context

    FilterApplied: QM Form Filtered<br>(filterQm applied)
    GeneralRatings: General Ratings Visible<br>(Room, Video, Communication, etc.)
    EquipmentRatings: Equipment Ratings Section<br>(Dermatoscope, Otoscope, etc.)
    ReferralQuestion: Referral Probability Question
    BooleanQuestions: Yes/No Questions<br>(Translator, Reporting)
    CommentRequired: Comment Becomes Mandatory<br>(min 3 chars)
    FormComplete: All Required Ratings Filled

    FilterApplied --> GeneralRatings: Always visible ratings shown
    FilterApplied --> EquipmentHidden: Job is "psych" type
    FilterApplied --> EquipmentCheck: Job is NOT "psych" type

    state EquipmentHidden <<choice>>
    state EquipmentCheck <<choice>>

    EquipmentCheck --> EquipmentRatings: Equipment has saved values > 0
    EquipmentCheck --> EquipmentCollapsed: No saved equipment values

    EquipmentCollapsed: Equipment Section Hidden<br>(can be manually expanded)
    EquipmentCollapsed --> EquipmentRatings: User expands equipment section

    GeneralRatings --> BooleanQuestions: Ratings selected

    EquipmentRatings --> CommentCheck: Any equipment rating = 5 or 6

    state CommentCheck <<choice>>
    CommentCheck --> CommentRequired: Yes — poor equipment rating
    CommentCheck --> BooleanQuestions: No — all ratings acceptable

    CommentRequired --> BooleanQuestions: Comment entered (≥ 3 chars)

    FilterApplied --> ReferralHidden: Consultation type = EXTERNAL
    FilterApplied --> ReferralQuestion: Type ≠ EXTERNAL AND job ≠ "psych"

    state ReferralHidden <<choice>>

    ReferralQuestion --> BooleanQuestions: Rating selected

    BooleanQuestions --> FormComplete: All required fields filled
    FormComplete --> [*]: Parent dialog submit
```

**State transition notes:**

- **FilterApplied** runs automatically when the dialog opens. It evaluates job type and consultation type to determine which questions are visible.
- **Equipment ratings** are hidden by default and only auto-expand when they have saved values > 0. For psych-type jobs, they are permanently hidden.
- The **referral probability question** is hidden under two conditions: EXTERNAL consultation type OR psych job type (it carries both `qmphysical` and `qmexternal` CSS classes).
- **Comment mandatory trigger** is dynamic: rating any equipment item at 5 ("poor") or 6 ("inadequate") immediately makes the feedback textarea required with a minimum of 3 characters.

---

## Area 3: Incarceration Consultation Retrieval

### Context

The incarceration retrieval flow allows staff to look up and retrieve medical examination data for incarcerated individuals. It is a two-step process: first verify the book number and code, then fill in the target person's address for document delivery.

**Who uses it:** Clinical staff with access to the "Retrieve Consultation" menu item on the treatment dashboard.

**Entry point:** User clicks "Retrieve Consultation" (`#retrieveConsultationMenuBtn`) on the treatment dashboard.

**Exit points:** A PDF document is generated and available for download via the Job Status dialog.

---

### 3.1 Incarceration Retrieval — Flowchart

```mermaid
flowchart TD
    A["Treatment Dashboard"] -->|"Click 'Retrieve Consultation'"| B["Step 1: Check Dialog<br>(Book Number + Code)"]

    B -->|"User enters book number + code<br>→ Save"| C{"ConsultationService<br>.checkCustomer()"}

    C -->|"Valid — customer found"| D["Step 2: Retrieval Dialog<br>(Address Form)"]
    C -->|"Invalid — error"| E["Error Message<br>(Dialog stays open)"]
    E --> B

    D --> D1["Read-only:<br>Book Number + Code"]
    D1 --> D2{"Previous retrieval<br>exists?"}
    D2 -->|"Yes"| D3["Warning Alert:<br>'This record was already<br>retrieved on {date}!'"]
    D2 -->|"No"| D4["Address Form Clean"]
    D3 --> D5["User fills address form:<br>Name*, Street*, Street2,<br>Zip*+State+City*, Country,<br>Additional Text"]
    D4 --> D5

    D5 -->|"Save"| F["ConsultationService<br>.prepareCustomer()"]
    F --> G["Job Status Dialog<br>(PDF Download Link)"]

    style A fill:#e8f4f8,stroke:#2c7bb6
    style G fill:#d4edda,stroke:#155724
    style E fill:#fce4ec,stroke:#c62828
    style D3 fill:#fff3cd,stroke:#856404
```

**Key observations:**

- This is a strictly sequential two-step flow: the check dialog must succeed before the retrieval dialog opens.
- The retrieval dialog shows the verified book number and code as **read-only** fields, preventing accidental modification after verification.
- The **previous retrieval warning** is a dangerous-red alert that appears when the same record has been retrieved before, including the exact date. This is a safeguard against duplicate retrievals.
- The zip code field has a `searchZipCode` class that triggers auto-lookup for state and city, reducing manual data entry.
- The final output is a PDF document available through the standard Job Status dialog (async generation pattern).

---

### 3.2 Incarceration Retrieval — Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Dashboard as Treatment Dashboard
    participant CheckDlg as Check Dialog
    participant RetrievalDlg as Retrieval Dialog
    participant JobStatus as Job Status Dialog

    User->>Dashboard: Clicks "Retrieve Consultation"
    Dashboard->>CheckDlg: Opens check dialog (empty form)

    CheckDlg-->>User: Shows book number + code inputs (both mandatory)
    User->>CheckDlg: Enters book number + code → Save

    alt Customer found
        CheckDlg->>RetrievalDlg: Opens retrieval dialog with verified data
        RetrievalDlg-->>User: Shows read-only book number + code

        alt Previous retrieval exists
            RetrievalDlg-->>User: Shows danger alert with previous retrieval date
        end

        RetrievalDlg-->>User: Shows address form (name, street, zip, city, etc.)
        User->>RetrievalDlg: Fills address form → Save
        RetrievalDlg->>JobStatus: prepareCustomer() → PDF generation started
        JobStatus-->>User: Shows download link for generated PDF
    else Customer not found / invalid
        CheckDlg-->>User: Shows error message
        User->>CheckDlg: Corrects inputs → Save (retry)
    end
```

---

## Area 4: Consultation Template Management

### Context

Consultation templates allow clinical staff to save and reuse pre-configured consultation structures. Templates are managed through a list panel accessible from the treatment dashboard, with options to create, edit, and delete templates.

**Who uses it:** Clinical staff (experts) who frequently create similar consultation types.

**Entry point:** User clicks the "Templates" button on the treatment dashboard.

**Exit points:** User opens a template in Consultation Details (for editing), or closes the template panel.

---

### 4.1 Consultation Template — Flowchart

```mermaid
flowchart TD
    A["Treatment Dashboard"] -->|"Click Templates button"| B["Template List Panel<br>(400px side panel)"]

    B --> B1["Toolbar: Text Filter<br>+ Create Button"]
    B1 --> C["Table: Template Name,<br>Description, Edit, Remove"]

    C -->|"Type in filter"| D["Client-side prefix filter<br>(names starting with input)"]
    D --> C

    C -->|"Click Edit on row"| E["Load Template Data"]
    E --> F["ConsultationDetails.open()<br>(template mode = true)"]

    C -->|"Click Remove on row"| G{"Confirm:<br>'Delete this template?'"}
    G -->|"Yes"| H["Template Removed<br>(List Refreshes)"]
    G -->|"No"| C

    B1 -->|"Click Create"| I["Create Dialog (Modal)<br>Name* + Description"]
    I -->|"Save"| J["Template Created<br>(List Refreshes)"]
    J --> F

    style A fill:#e8f4f8,stroke:#2c7bb6
    style F fill:#d4edda,stroke:#155724
    style H fill:#fff3cd,stroke:#856404
    style G fill:#fce4ec,stroke:#c62828
```

**Key observations:**

- The template list is a **side panel** (400px, secondary target), not a modal dialog. It coexists with the main dashboard view.
- The text filter is **client-side only** using prefix matching (`name.toLowerCase().startsWith(value)`). No server-side search is needed.
- Both **Create** and **Edit** actions end by opening Consultation Details in template mode. The difference is that Create first saves a blank template, while Edit loads an existing one.
- The **Remove** action requires explicit confirmation before deletion. After removal, the list refreshes automatically.

---

## Interdependencies Summary

| Factor | Affects | How |
|---|---|---|
| **Appointment location** | Wizard routing | Determines which of the 3 wizard paths the user enters (Location Wizard, BasisWeb Wizard, Consultation Wizard) |
| **Location patientDataType** | Wizard routing + type filtering | `EXTERNAL_BASISWEB` routes to BasisWeb; `EXTERNAL` enables EXTERNAL consultation type |
| **Appointment state** | BasisWeb routing | `LOCKEDIN` state bypasses BasisWeb wizard even for EXTERNAL_BASISWEB locations |
| **Appointment patients list** | Step 1 behavior | Non-empty list shows patient dropdown; empty list skips to manual book number |
| **Job capability flags** | Step 3 type options | `consultationStandard`, `consultationOnboarding`, `consultationIncarceration`, etc. control which types appear |
| **Job defaultConsultation** | Step 3 pre-selection | Sets the initially selected consultation type |
| **Location booknumberMask** | Step 2 input mask | Dynamic input mask applied to the book number field |
| **COUNCIL appointment type** | Step 1 special behavior | Patient selection auto-fills and locks location field |
| **Appointment type** | Summarize dialog title | APPOINTMENT → "Appointment", SHIFT/COUNCIL → "Shift" |
| **External location + control active** | Summarize vs End | External locations with active control show Summarize; others show End Appointment |
| **Job remoteCode (psych)** | QM visibility | Hides equipment ratings and referral question for psychiatric jobs |
| **Consultation type (EXTERNAL)** | QM referral question | Hides the referral probability question |
| **Equipment rating values (5-6)** | Comment requirement | Poor equipment ratings trigger mandatory feedback textarea |
| **Saved QM equipment values** | Equipment section visibility | Ratings > 0 auto-expand the equipment section |
| **Previous retrieval date** | Incarceration warning | Shows danger alert when the record was already retrieved |
| **Zip code auto-lookup** | Address form | Auto-fills state and city after zip code entry |
| **QM questionnaire embed** | Summarize + End dialogs | Both dialogs include the same QM form; `filterQm()` adjusts it based on context |
| **Template mode flag** | Consultation Details behavior | Templates open Consultation Details with `template=true`, enabling template-specific fields |

---

## Wireframe Screenshots

### Area 1: Consultation Start — Wizard & Location

#### W7: Location Wizard (Single-Step)
![Location Wizard](dashboard/consultation-location-wizard.png)

#### W5: Consultation Wizard — Step 1 (Patient Select)
![Consultation Wizard Step 1](dashboard/consultation-wizard-step1.png)

#### W5: Consultation Wizard — Step 2 (Book Number)
![Consultation Wizard Step 2](dashboard/consultation-wizard-step2.png)

#### W5: Consultation Wizard — Step 3 (Consultation Type)
![Consultation Wizard Step 3](dashboard/consultation-wizard-step3.png)

#### W5: Consultation Wizard — Step 4 (Summary & Confirm)
![Consultation Wizard Step 4](dashboard/consultation-wizard-step4.png)

---

### Area 2: Appointment Summarization & End

#### W11: Summarize Appointment (1000px)
![Summarize Appointment](dashboard/summarize-appointment.png)

#### W13b: End Appointment (900px)
![End Appointment](dashboard/end-appointment.png)

---

### Area 3: Incarceration Retrieval

#### W12-A: Incarceration Check Dialog
![Incarceration Check](dashboard/incarceration-check.png)

#### W12-B: Incarceration Retrieval Dialog
![Incarceration Retrieval](dashboard/incarceration-retrieval.png)

---

### Area 4: Consultation Template Management

#### W9-A: Template List Panel (400px)
![Template List](dashboard/consultation-template-list.png)

#### W9-B: Create Template Dialog
![Template Create](dashboard/consultation-template-create.png)

---

### Questionnaire Module

#### W1: Questionnaire List (1440px Full Page)
![Questionnaire List](questionnaire/questionnaire-list.png)

#### W2: Questionnaire Detail (800px Form)
![Questionnaire Detail](questionnaire/questionnaire-detail.png)
