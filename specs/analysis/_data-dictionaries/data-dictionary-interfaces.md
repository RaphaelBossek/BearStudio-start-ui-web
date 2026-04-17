---
title: 'Data Dictionary Interfaces'
---

# Data Dictionary: Interfaces

## BasisWeb Wizard (dashboard/basisWebWizard)

### Step 1: Start (`bww-start`)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data.type` | `<select>` | `enum(EXTERNAL, DOCUMENT, STANDARD, INCARCERATION, ONBOARDING, TREATMENT)` | *Workflow: ConsultationService.start* | Art der Konsultation | Consultation Type |
| `bwwjnumberselect` | `<input>` | `string` | *Workflow: ConsultationService.findBasisWeb* | J-Nummer | Inmate Number |
| `anmeldungen.list` | `collection` | `array` | *Workflow: Search Results* | - | - |
| `list.jnumber` | `text` | `string` | [`basisWebData.jnummer`](_mongodb-mapping/interfaces.md#entity-basis-web-data) | - | - |
| `list.uuid` | `text` | `string` | [`basisWebData.uuid`](_mongodb-mapping/interfaces.md#entity-basis-web-data) | - | - |
| `list.remoteCode` | `text` | `string` | *Workflow: Search Results* | - | - |

### Step 2: Fallback Book Number (`bww-notavailable`)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bwwbooknumber` | `<input>` | `string` | [`basisWebData.buchnummer`](_mongodb-mapping/interfaces.md#entity-basis-web-data) | Buchnummer | Book-number |

### Step 3: Prepare & Poll (`bww-getting`)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `jnumber` | `<span>` | `string` | [`basisWebData.jnummer`](_mongodb-mapping/interfaces.md#entity-basis-web-data) | J-Nummer | Inmate Number |
| `uuid` | `<span>` | `string` | [`basisWebData.uuid`](_mongodb-mapping/interfaces.md#entity-basis-web-data) | - | - |

### Step 4: PIN Entry (`bww-pin`)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data.pin` | `<input>` | `string` | *Workflow: ConsultationService.start* | Pin | Pin |

### Step 5: Decryption (`bww-loading`)

*(Loading spinner and error messages only. Data passed from previous steps.)*

### Step 6: Summary (`bww-success`)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data.appointment.job.expertTitle` | `<span>` | `string` | *Workflow: Display only* | Termin | Appointment |
| `data.location.name` | `<span>` | `string` | *Workflow: Display only* | Standort | Location |
| `data.booknumber` | `<span>` | `string` | [`basisWebData.buchnummer`](_mongodb-mapping/interfaces.md#entity-basis-web-data) | Buchnummer | Book-number |
| `data.jnumber` | `<span>` | `string` | [`basisWebData.jnummer`](_mongodb-mapping/interfaces.md#entity-basis-web-data) | J-Nummer | Inmate Number |
| `data.uuid` | `<span>` | `string` | [`basisWebData.uuid`](_mongodb-mapping/interfaces.md#entity-basis-web-data) | - | - |
| `data.type` | `<select>` | `enum` | *Workflow: Display only* | Art der Konsultation | Consultation Type |
