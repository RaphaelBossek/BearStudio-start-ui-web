# Consultation Module — Workflows & Interdependencies

> **Domain:** Treatment > Consultation  
> **Complexity:** Very High — 778-line dialog, 11 tabs, 7 consultation types, 6 states  
> **Reference analysis:** `specs/analysis/treatment/consultation/` (8 documents)  
> **Wireframe plan:** `specs/analysis/treatment/consultation/wireframe-plan.md`

---

## 1. Consultation Lifecycle State Machine

**Who:** Treating doctor (primary), Admin (reopen), Reviewing physician (verify)  
**Entry point:** Consultation created via wizard (Batch 3) or list page  
**Exit points:** VERIFIED (final) or CLOSED (pending review)

The consultation passes through 6 states. Only the **OPEN** state allows field editing. The state machine controls which toolbar buttons are active, whether the form is editable, and which actions are available.

```mermaid
stateDiagram-v2
    direction LR

    [*] --> CREATED : Wizard creates consultation
    CREATED --> OPEN : Doctor opens for editing

    OPEN --> TRANSMITTED : Doctor finalizes (submit)
    note right of OPEN
        ONLY state where
        form fields are editable
    end note

    TRANSMITTED --> REPORTED : System processes
    REPORTED --> CLOSED : Reporting complete

    CLOSED --> OPEN : Admin reopens
    CLOSED --> VERIFIED : Reviewer verifies

    VERIFIED --> [*]

    state OPEN {
        direction TB
        [*] --> Editing
        Editing --> Saving : Save / Save & Close
        Saving --> Editing : Continue editing
        Editing --> Finalizing : Finalize button
        Finalizing --> SubmitCheck : Validate completeness
        SubmitCheck --> SubmitSuccess : All checks pass
        SubmitCheck --> SubmitError : Validation fails
        SubmitError --> Editing : Fix & retry
    }
```

### State-Based UI Behavior Matrix

| State | Fields Editable | Save Button | Submit Visible | Finalize Visible | QM Tab Editable | Reopen Button | Download |
|:------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| CREATED | No | No | No | No | Yes | No | No |
| **OPEN** | **Yes** | **Yes** | **Yes** | **Conditional** | Yes | No | Yes |
| TRANSMITTED | No | No | No | No | Yes | No | Yes |
| REPORTED | No | No | No | No | Yes | No | Yes |
| CLOSED | No | No | No | No | No | **Yes** (Admin) | Yes |
| VERIFIED | No | No | No | No | Yes | No | Yes |

**Finalize condition:** `state !== CLOSED && type !== EXTERNAL && !archived && baseComplete && dataComplete && warningComplete`

---

## 2. Consultation User Journey — End-to-End Flow

**Who:** Doctor / Clinical staff  
**Entry point:** Consultation list page (nav menu)  
**Exit points:** PDF download, verified consultation, closed consultation

```mermaid
flowchart TD
    Start([Doctor opens Consultation module]) --> List[Consultation List Page]

    List --> Filter{Apply filters?}
    Filter -->|Yes| FilterPanel[Date range, Status,<br/>Doctor, Location filters]
    FilterPanel --> List
    Filter -->|No| SelectRow{Select a row}

    SelectRow --> ActionChoice{Choose action}

    ActionChoice -->|View| ViewBtn[View button]
    ViewBtn --> StateCheck{Consultation state?}
    StateCheck -->|OPEN| EditDialog[Edit Details Dialog<br/>11 tabs, editable fields]
    StateCheck -->|Other states| ViewDialog[View Details Dialog<br/>Read-only, 8 sections]

    ActionChoice -->|Review| ReviewBtn[Review button<br/>CONSULTATION_REPORTING<br/>or CONSULTATION_ADMIN]
    ReviewBtn --> ReviewDialog[Review Dialog<br/>75% view + 25% editor]

    ActionChoice -->|Delete| DeleteBtn[Delete button<br/>ADMIN only]
    DeleteBtn --> ConfirmDelete{Confirm?}
    ConfirmDelete -->|Yes| Deleted([Row removed])
    ConfirmDelete -->|No| List

    ActionChoice -->|Download PDF| DownloadBtn[Download PDF]
    DownloadBtn --> PDF([PDF opened in browser])

    ActionChoice -->|Export XLS| ExportBtn[Export XLS<br/>Year/Month filter]
    ExportBtn --> XLS([Excel file downloaded])

    ActionChoice -->|Template Export| TemplateBtn[Template Export dialog]
    TemplateBtn --> TemplateModal[Year, Month, Template,<br/>Customer, Location, Expert]
    TemplateModal --> ExportResult([Custom export generated])

    EditDialog --> TypeSelect{Consultation type?}
    TypeSelect -->|STANDARD| StdTabs[Patient + Standard +<br/>Warning + QM + Submit]
    TypeSelect -->|ONBOARDING| OnbTabs[Patient + Onboarding +<br/>Rx + Warning + QM + Submit]
    TypeSelect -->|ONBOARDING_SHORT| ShortTabs[Patient + OnboardShort +<br/>QM + Submit]
    TypeSelect -->|INCARCERATION| IncTabs[Patient + Incarceration +<br/>Standard + QM + Submit]
    TypeSelect -->|TREATMENT| TreatTabs[Patient + Treatment +<br/>Submit]
    TypeSelect -->|DOCUMENT| DocTabs[Patient + Document +<br/>QM + Submit]
    TypeSelect -->|EXTERNAL| ExtTabs[Patient + Submit]

    StdTabs --> FillForm[Fill required fields<br/>across visible tabs]
    OnbTabs --> FillForm
    ShortTabs --> FillForm
    IncTabs --> FillForm
    TreatTabs --> FillForm
    DocTabs --> FillForm
    ExtTabs --> FillForm

    FillForm --> SaveChoice{Save action}
    SaveChoice -->|Save| SaveOnly[Save without closing]
    SaveOnly --> FillForm
    SaveChoice -->|Save & Close| SaveClose[Save + close + reload list]
    SaveClose --> List
    SaveChoice -->|Finalize| FinalizeCheck{All complete?}
    FinalizeCheck -->|Yes| SubmitOK[Submit consultation]
    FinalizeCheck -->|No| MissingFields[Tab icons show<br/>incomplete markers]
    MissingFields --> FillForm

    SubmitOK --> SubmitResult{Success?}
    SubmitResult -->|Yes| Transmitted([State → TRANSMITTED<br/>PDF generated])
    SubmitResult -->|No| ErrorModal[Error modal:<br/>Retry / Backup / Download]
    ErrorModal -->|Retry| SubmitOK
    ErrorModal -->|Backup| BackupSave([Local backup saved])
    ErrorModal -->|Download| PDF

    ReviewDialog --> ReviewState{Review exists?}
    ReviewState -->|No| StartReview[Start Review button]
    StartReview --> ReviewEdit[Markdown editor active]
    ReviewState -->|Yes| ReviewEdit
    ReviewEdit --> ReviewSave[Save Review]
    ReviewSave --> ReviewEdit
    ReviewEdit --> ReviewSubmit[Submit Review]
    ReviewSubmit --> Verified([State → VERIFIED])

    style Transmitted fill:#d4edda,stroke:#155724
    style Verified fill:#d4edda,stroke:#155724
    style Deleted fill:#f8d7da,stroke:#721c24
    style ErrorModal fill:#fff3cd,stroke:#856404
    style MissingFields fill:#fff3cd,stroke:#856404
    style PDF fill:#cce5ff,stroke:#004085
    style XLS fill:#cce5ff,stroke:#004085
    style BackupSave fill:#fff3cd,stroke:#856404
```

---

## 3. Type-to-Tab Visibility Matrix

**Who:** System (automatic based on `data.type` selection)  
**Entry point:** Doctor selects consultation type in Patient Data tab  
**Key observation:** Changing the type dynamically shows/hides tabs. 7 types control 11 possible tabs.

```mermaid
flowchart LR
    subgraph TypeSelection["Consultation Type Selection"]
        EXTERNAL["EXTERNAL"]
        DOCUMENT["DOCUMENT"]
        STANDARD["STANDARD"]
        INCARCERATION["INCARCERATION"]
        ONBOARDING["ONBOARDING"]
        ONBOARDING_SHORT["ONBOARDING_SHORT"]
        TREATMENT["TREATMENT"]
    end

    subgraph AlwaysVisible["Always Visible Tabs"]
        PatientData["Patient Data"]
        Submit["Submit"]
    end

    subgraph ConditionalTabs["Conditionally Visible Tabs"]
        Standard["Standard Form"]
        IncarcTab["Incarceration"]
        OnboardFull["Onboarding Full"]
        OnboardShort["Onboarding Short"]
        TreatTab["Treatment"]
        WarningTab["Warning"]
        DocumentTab["Documentation"]
        FilesTab["Files"]
        QMTab["QM (shift only)"]
    end

    EXTERNAL -.->|"minimal"| AlwaysVisible
    STANDARD --> Standard
    STANDARD --> WarningTab
    STANDARD -.->|"if shift"| QMTab
    ONBOARDING --> OnboardFull
    ONBOARDING -->|"if additionalPrescription"| Standard
    ONBOARDING --> WarningTab
    ONBOARDING -.->|"if shift"| QMTab
    ONBOARDING_SHORT --> OnboardShort
    ONBOARDING_SHORT -.->|"if shift"| QMTab
    INCARCERATION --> IncarcTab
    INCARCERATION --> Standard
    INCARCERATION -.->|"if shift"| QMTab
    TREATMENT --> TreatTab
    DOCUMENT --> DocumentTab
    DOCUMENT -.->|"if shift"| QMTab
```

### Detailed Visibility Table

| Tab | EXTERNAL | STANDARD | ONBOARDING | ONBOARD_SHORT | INCARCERATION | TREATMENT | DOCUMENT |
|:----|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Patient Data | Always | Always | Always | Always | Always | Always | Always |
| Standard Form | - | **Yes** | Rx only* | - | **Yes** (partial**) | - | - |
| Incarceration | - | - | - | - | **Yes** | - | - |
| Onboarding (Full) | - | - | **Yes** | - | - | - | - |
| Onboarding (Short) | - | - | - | **Yes** | - | - | - |
| Treatment | - | - | - | - | - | **Yes** | - |
| Warning | - | **Yes** | **Yes** | - | - | - | - |
| Documentation | - | - | - | - | - | - | **Yes** |
| Files | Always | Always | Always | Always | Always | Always | Always |
| QM | - | shift | shift | shift | shift | - | shift |
| Submit | Always | Always | Always | Always | Always | Always | Always |

*Rx: Standard tab shown only if `data.onboarding.additionalPrescription === "true"`  
**Partial: When type=INCARCERATION, Standard form hides Blocks 1-3 (medication anamnesis, anamnesis, patient report), Block 5 (prescriptions), Blocks 6-7 (work incapacity, procedere) via `incarceration-hide` CSS class — only Diagnosis/ICD-10 and Block 4 remain.

---

## 4. Conditionize2 Field Rules — User Experience

**Who:** Doctor filling consultation form  
**Mechanism:** jQuery `conditionize2` plugin shows/hides fields based on other field values  
**Key observation:** These are client-side-only visibility rules — the hidden fields still exist in the data model.

```mermaid
flowchart TD
    subgraph SubmitTab["Submit Tab Conditional Fields"]
        RT{Require Reporting?}
        RT -->|Yes| CommentReq["Comment textarea<br/>(becomes MANDATORY)"]
        RT -->|No| CommentHidden["Comment hidden"]

        RP{Refer Psychotherapy?}
        RP -->|Checked| PsychComment["Psychotherapy Comment<br/>textarea visible"]
        RP -->|Unchecked| PsychHidden["Psychotherapy Comment<br/>hidden"]

        FT{"Further Treatment<br/>selection?"}
        FT -->|FOLLOW_UP| FTDate["Further Treatment Date<br/>field visible"]
        FT -->|REFERRAL / REFERRAL_OTHER| RefTo["Referral To<br/>select visible"]
        FT -->|IF_REQUIRED / empty| NoExtra["No additional fields"]
    end

    subgraph OnboardingTab["Onboarding Tab Conditional Fields"]
        PS{"Preexisting State?"}
        PS -->|OTHER| PreCond["Preexisting Condition<br/>textarea visible"]
        PS -->|HEALTHY / NO_ANSWER| PreHidden["Textarea hidden"]

        CS{"Current Health State?"}
        CS -->|OTHER| AnamOwn["Own Anamnesis<br/>textarea visible"]
        CS -->|HEALTHY / NO_ANSWER| AnamHidden["Textarea hidden"]
    end

    subgraph WarningTab["Warning Tab Conditional Fields"]
        NW{"No Warnings checkbox?"}
        NW -->|Checked| WarnHidden["Entire warning<br/>collection hidden"]
        NW -->|Unchecked| WarnVisible["Warning collection<br/>+ category selects visible"]
    end

    subgraph StandardTab["Standard Tab — Prescription Type"]
        PT{"Prescription Type?"}
        PT -->|STANDARD| DosReq["Dosage Requirement<br/>text field"]
        PT -->|LIMITED / LONGTERM| DosGrid["Morning/Noon/Evening/Night<br/>dosage grid + Unit"]
    end

    subgraph IncarcTab["Incarceration Tab Conditional"]
        InType{"Incarceration Type?"}
        InType -->|LIABILITY| SuicShow["Suicidality fields<br/>visible"]
        InType -->|INCARCERATION| SuicHide["Suicidality fields<br/>less relevant"]
    end

    style CommentReq fill:#fff3cd,stroke:#856404
    style PsychComment fill:#fff3cd,stroke:#856404
    style FTDate fill:#fff3cd,stroke:#856404
    style RefTo fill:#fff3cd,stroke:#856404
    style PreCond fill:#fff3cd,stroke:#856404
    style AnamOwn fill:#fff3cd,stroke:#856404
    style WarnHidden fill:#f8d7da,stroke:#721c24
    style DosGrid fill:#cce5ff,stroke:#004085
```

### Full Conditionize2 Rules Reference

| Trigger Field | Trigger Value | Target Field(s) | Effect |
|:---|:---|:---|:---|
| `requireReporting` | `true` | `comment` | Becomes **mandatory** (not just visible) |
| `referPsychotherapy` | checked | `psychoTherapy.comment` | Shows textarea |
| `furtherTreatment` | `FOLLOW_UP` | `dateFurtherTreatment` | Shows date picker |
| `furtherTreatment` | `REFERRAL` / `REFERRAL_OTHER` | `standard.referralTo` | Shows category select |
| `preexistingState` | `OTHER` | `preexistingCondition` | Shows textarea (onboarding) |
| `currentState` | `OTHER` | `anamnesisOwn` | Shows textarea (onboarding) |
| `noWarnings` | checked | Warning collection UI | **Hides** entire collection + insert selects |
| `prescription.type` | `STANDARD` | `dosageRequirement` | Shows text field |
| `prescription.type` | `LIMITED` / `LONGTERM` | Dosage grid (4 cols) + unit | Shows grid |
| `prescription.product` | custom vs catalog | Product name + ingredient inputs | Toggles custom/display modes |

---

## 5. Review & Approval Workflow

**Who:** Reviewing physician (requires `CONSULTATION_REPORTING` or `CONSULTATION_ADMIN` permission)  
**Entry point:** Review button in list toolbar (row selected)  
**Exit point:** Consultation state becomes VERIFIED

```mermaid
sequenceDiagram
    actor Reviewer as Reviewing Physician
    participant List as Consultation List
    participant ReviewDlg as Review Dialog
    participant API as Consultation Service

    Reviewer->>List: Select consultation row
    Reviewer->>List: Click "Review" button
    Note over List: Requires CONSULTATION_REPORTING<br/>or CONSULTATION_ADMIN permission

    List->>ReviewDlg: Open review dialog (75%/25% split)
    Note over ReviewDlg: Left: Read-only consultation view<br/>Right: Review editing sidebar

    alt No existing review
        ReviewDlg->>Reviewer: Show "Start Review" button only
        Reviewer->>ReviewDlg: Click "Start Review"
        ReviewDlg->>API: startReporting(consultationId)
        API-->>ReviewDlg: Reporting object created
        ReviewDlg->>Reviewer: Show markdown editor + action buttons
    else Existing review in progress
        ReviewDlg->>Reviewer: Show editor with existing content
    end

    loop Editing cycle
        Reviewer->>ReviewDlg: Write review in markdown editor
        Reviewer->>ReviewDlg: Click "Save Review"
        ReviewDlg->>API: saveReporting(id, { reporting })
        API-->>ReviewDlg: Saved confirmation
    end

    alt Download review
        Reviewer->>ReviewDlg: Click "Download"
        ReviewDlg->>API: download(consultationId, 'REPORTING')
        API-->>Reviewer: PDF opens in browser
    end

    Reviewer->>ReviewDlg: Click "Submit Review"
    ReviewDlg->>API: verify(id, { reporting })
    API-->>ReviewDlg: Consultation state → VERIFIED
    ReviewDlg->>List: Close dialog, reload list
    Note over List: Consultation now shows<br/>state = VERIFIED
```

### Review Dialog Layout

```
+--------------------------------------------------+
| Review Dialog (1500px)                           |
+--------------------------------------------------+
| +-----------------------------+  +-----------+   |
| |  Read-Only Consultation     |  | Review    |   |
| |  View (75% width)           |  | Sidebar   |   |
| |                             |  | (25%)     |   |
| |  - Header info              |  |           |   |
| |  - Type-specific sections   |  | Expert:   |   |
| |  - Attachments              |  | [name]    |   |
| |  - Warning info             |  |           |   |
| |                             |  | End Date: |   |
| |                             |  | [date]    |   |
| |                             |  |           |   |
| |                             |  | Markdown  |   |
| |                             |  | Editor:   |   |
| |                             |  | [70vh     |   |
| |                             |  |  textarea]|   |
| |                             |  |           |   |
| |                             |  | [Start]   |   |
| |                             |  | [Save]    |   |
| |                             |  | [Download]|   |
| |                             |  | [Submit]  |   |
| +-----------------------------+  +-----------+   |
+--------------------------------------------------+
```

---

## 6. Submit & Error Recovery Flow

**Who:** Doctor finalizing a consultation  
**Entry point:** Finalize button in Submit tab (requires all completeness checks)  
**Exit points:** TRANSMITTED state (success) or error recovery actions

```mermaid
stateDiagram-v2
    direction TB

    [*] --> PreCheck

    state PreCheck {
        direction LR
        CheckBase: Base fields complete?
        CheckData: Data tab complete?
        CheckWarning: Warnings complete?
        CheckBase --> CheckData
        CheckData --> CheckWarning
    }

    PreCheck --> AgreeGate : All checks pass
    PreCheck --> Incomplete : Checks fail

    state Incomplete {
        TabIcons: Tab icons show ? markers
        FixFields: Doctor must fix missing fields
    }

    AgreeGate --> FinalizeEnabled : Agree checkbox checked
    state AgreeGate {
        AgreeBox: "I confirm this consultation<br/>is complete" checkbox
    }

    FinalizeEnabled --> Submitting

    state Submitting {
        direction TB
        CallAPI: submit("SUBMIT")
        CallAPI --> Success
        CallAPI --> Error
    }

    state Success {
        direction TB
        Reset: Reset form state
        Reload: Reload list
        OpenPDF: Open PDF in new tab
    }

    state Error {
        direction TB
        ShowModal: Error modal with options
        ShowModal --> RetryBtn: Retry
        ShowModal --> BackupBtn: Backup (if patientDataAccess)
        ShowModal --> DownloadBtn: Download PDF
    }

    RetryBtn --> Submitting
    BackupBtn --> BackupSaved
    DownloadBtn --> PDFDownloaded

    Success --> [*]
    BackupSaved --> [*]
    PDFDownloaded --> [*]
```

---

## 7. Interdependencies Summary

### Factors Affecting User Experience

| Factor | Source | Affects | How |
|:---|:---|:---|:---|
| **Consultation Type** (7 values) | Patient Data tab → type select | Tab visibility, field visibility, form content | Completely changes which tabs and fields appear |
| **Consultation State** (6 values) | Server-controlled | Editability, button visibility, action availability | Only OPEN allows editing; CLOSED enables reopen |
| **User Role** | Authentication | Toolbar buttons, field editability, delete access | Admin: edit doctor + delete; Reporting: review |
| **Shift context** (`data.shift`) | Appointment origin | QM tab, contact time, end time | Shift-originated consultations show additional fields |
| **Template mode** | Created from template | template/notemplate classes | Templates hide location, specialization; show name/description |
| **Internal user flag** | `class="internalOnly"` | Gender, Birthday/Age fields | External users cannot see patient identity fields |
| **BasisWeb integration** | `class="basiswebonly"` | Medication/History tabs in header | BasisWeb-imported consultations show extra data tables |
| **Location.patientDataAccess** | Location config | Backup button in error modal | Controls whether offline backup is available |
| **additionalPrescription** | Onboarding form checkbox | Standard tab visibility | ONBOARDING type can optionally show prescriptions |
| **Prescription product type** | Catalog vs custom | Product entry mode | Toggles between select dropdown and free-text input |

### Cross-Module Dependencies

| This Module | Depends On | Nature of Dependency |
|:---|:---|:---|
| Consultation List | Consultation Wizard (Batch 3) | Wizard creates new consultations that appear in list |
| Consultation Details | Location module (Batch 8) | Room autocomplete filtered by location; room detail dialog |
| Consultation Details | ICD-10 Service | Diagnosis search modal for adding ICD-10 codes |
| Consultation Details | Medication Service | Prescription search for adding medications |
| Consultation Details | User Management (Batch 6) | Doctor autocomplete; expert assignments |
| Consultation Review | Consultation View | Review dialog embeds read-only view at 75% width |
| Export Template | Customer module (Batch 8) | Customer/Location filters for custom exports |
| Warning Tab | Warning Service | 4 category-specific dropdown sources (allergies, infections, etc.) |
| Submit Flow | BasisWeb (Batch 1) | Submission triggers BasisWeb data generation for integrated locations |
| QM Tab | Questionnaire (Batch 3) | Embedded questionnaire within consultation context |

---

## 8. Wireframe Screenshots

### W1: Consultation List Page
List page with 10-column data grid, date/type/location toolbar filters, 6 action buttons (View, Review, Delete, Download, Export, Template Export), and offcanvas filter panel.

![W1: Consultation List](./consultation-list.png)

### W2: Consultation Details — Header & Tab Scaffold
778-line dialog scaffold: header row (book number, copy/template buttons, gender/birthday [internalOnly], date/start), 10-tab navigation with status icons, Patient Data tab content, Save/OK/Download footer.

![W2: Details Header](./consultation-details-header.png)

### W3: Consultation Details — Standard Form
Standard consultation form with 7 card sections: Medication Anamnesis, Anamnesis Collection (11 types), Patient Report Collection (10 types), Diagnosis/ICD-10, Prescription with nested activeIngredients and conditional dosage grid, Work Incapacity, Procedere Report. Fields marked `[incarceration-hide]` are hidden when type=INCARCERATION.

![W3: Standard Form](./consultation-details-standard.png)

### W4: Consultation Details — Onboarding Form
Full onboarding form (~50 elements): Row 1 = Medical History & Examination (family history, physical findings, infectious diseases, organ systems), Row 2 = Evaluation (suitability checks). Includes conditionize2 rules for preexisting/current state. Note: ONBOARDING_SHORT is a strict subset.

![W4: Onboarding Form](./consultation-details-onboarding.png)

### W5: Consultation Details — Incarceration Form
Incarceration form (51 fields, 6 blocks): Type select with `[SIREN]`, Examination Result (3-column), Re-Introduction (disabled), Doctor Examination with consumption sub-block, Intoxication Assessment (stadium NONE–STAGE_5), Body Check. Cross-model bindings to onboarding data.

![W5: Incarceration Form](./consultation-details-incarceration.png)

### W6: Consultation Details — Treatment & Warning
Treatment Form (15 textareas in sections: diagnoses, anamnese, medication, findings, history repeater, further treatment) + Warning Form (4 category selects, warning collection with conditionize2 noWarnings checkbox).

![W6: Treatment & Warning](./consultation-details-treatment-warning.png)

### W7: Consultation View (Read-Only)
Read-only view dialog (1500px): header info bar, type-conditional sections (STANDARD/ONBOARDING/INCARCERATION/TREATMENT/DOCUMENT), attachments with download links, OK + Download PDF buttons.

![W7: Consultation View](./consultation-view.png)

### W8: Consultation Review Dialog
Review dialog with 75%/25% split: left = read-only consultation view, right = review sidebar (expert name, report end date, markdown editor 70vh, Start/Save/Download/Submit Review buttons). 3-step workflow: no reporting → editing → verified.

![W8: Review Dialog](./consultation-review.png)

### W9: ICD-10 Search Modal
ICD-10 search dialog (600px): search input, scrollable results with ICD-10 code (bold), title, inclusion/exclusion lists, Select button per result.

![W9: ICD-10 Search](./consultation-icd10-search.png)

### W10: Export Template Modal
Export template dialog (600px): Year, Month, Template autocomplete (required, filter=CONSULTATION), Customer, Location, Expert fields, Export + Cancel buttons.

![W10: Export Template](./consultation-export-template.png)
