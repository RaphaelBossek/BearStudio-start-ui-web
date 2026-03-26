> **Split from**: `appointment/02-appointment-details.md`
> **Sections extracted here**: Patient data CRUD (add/edit/remove patient), patient file uploads/downloads, patient data attachments (Tab 3 -- Patients, patientDataDlg, treatments sub-collection)
> **Other domains received**: `planning/appointment/02-appointment-details-scheduling.md` got state transitions, user assignment (autocomplete, suggestions, accept/reject/reserve/override/abort), assignment history, referenced appointments, collision handling

## 6. Tab 3 — Patients

### Add Patient Input

| Element | ID | Action |
|---|---|---|
| Book number input | inside `patientDataAdd` | Manual text entry, placeholder `patient.number` |
| Add button (plus icon) | `.add` in `patientDataAdd` | Calls `PatientDataService.save({appointmentId, bookNumber})`, inserts row |

### Collection: Patients

| Attribute | Value |
|---|---|
| **ID** | `patientDataList` |
| **Data field** | `data.patients` |
| **Classes** | `collection selectable` |

#### Columns

| # | Field | Format | Notes |
|---|---|---|---|
| 1 | `patients.title` | text | Patient identifier |
| 2 | `patients.onlyDocumentation` | boolean | Rendered as checkmark icon or empty |
| 3 | `patients.closed` | datetime | |
| 4 | `patients.location.name` | text | |
| 5 | Edit icon | action | Opens `patientDataDlg` with `PatientDataService.get` |
| 6 | Remove icon | action | Confirms, then calls `PatientDataService.remove` |
| 7 | Sort up/down | action | Reorder arrows |

### Collection: Treatments (within same tab)

| Attribute | Value |
|---|---|
| **ID** | `appointmentTreatmentList` |
| **Data field** | `data.treatments` |
| **Classes** | `collection selectable` |

#### Columns

| # | Field | Notes |
|---|---|---|
| 1 | `treatments.title` | Treatment identifier |
| 2 | Edit icon | Action (handler not in analyzed JS) |

### Patient Data Dialog (`patientDataDlg`)

| Field | Name | Type | Mandatory | Conditional | Notes |
|---|---|---|---|---|---|
| Book number | `data.bookNumber` | `input` | No | — | |
| jNumber | `data.jNumber` | `input` | No | — | Used to derive bookNumber |
| Location | `data.location` | `input` (autocomplete) | Yes (conditional) | `.council` class only | `LocationService.autocomplete`; mandatory toggles with `jobSupport` checkbox |
| Closed date | `data.closed` | `input` (datepicker) | No | — | |

#### Attachments Sub-Collection

| Attribute | Value |
|---|---|
| **Container** | `patientDataFiles` table |
| **Data field** | `data.attachments` |
| **Upload** | `PatientDataService.upload` via `jsfileupload` |

| # | Field | Type | Notes |
|---|---|---|---|
| 1 | `attachments.file.name` | link | Template URL: `/get/PatientDataService/attachment/[[data.id]]/[[cur.file.id]]/[[cur.file.name]]` |
| 2 | `attachments.attach` | checkbox | "Transmit" flag |
| 3 | `attachments.comment` | input | Free text |
| 4 | Delete icon | action | Calls `PatientDataService.removeFile(dataId, fileId)` |
