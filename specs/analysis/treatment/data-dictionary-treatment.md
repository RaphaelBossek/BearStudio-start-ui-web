# Data Dictionary: Treatment

This document contains the data dictionary for the Treatment domain, mapping UI elements to their MongoDB database paths.

### 01-consultation-list - 3. Toolbar (Nav Buttons)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| View | Öffnen | `—` | `—` | — | action | button | — | — | — | View consultation detail (CRUD default) |
| consultation.review | ÄL Begutachtung | `—` | `—` | — | action | button | — | — | — | Open reporting review dialog |
| Delete | Löschen | `—` | `—` | — | action | button | — | — | — | Delete consultation |
| Save | Speichern | `—` | `—` | — | action | button | — | — | — | Download consultation PDF |
| Export | Exportieren | `—` | `—` | — | action | button | — | — | — | Export consultations (XLS by year/month) |
| Export | Exportieren | `—` | `—` | — | action | button | — | — | — | Open template export dialog |

### 01-consultation-list - Filter Fields

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Title: Date | Title: Datum | `data.date` | `consultationData.date` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | date | date array, data-array="0" | — | — | — | Date range start, icon fa-calendar-day |
| Title: Date | Title: Datum | `data.date` | `consultationData.date` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | date | date array, data-array="1" | — | — | — | Date range end |
| **HARDCODED**: "- Status -" | **HARDCODED**: "- Status -" | `data.state` | `consultationData.state` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | form-select | — | — | — | Consultation state enum |
| Treating doctor | Behandelnder Arzt | `data.doctor` | `consultationData.doctor` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | object autoselect | — | — | — | Display: displayName, icon fa-user-nurse, data-append="#filter" |

### 01-consultation-list - Form Fields (2-column layout, `col-md-6`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Template | Vorlage | `data.exportTemplate` | `consultationData.exportTemplate` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | Autocomplete (object autoselect) | — | **Yes** (mandatory) | — | data-minlength="0", data-filter='["CONSULTATION"]', icon fa-file-invoice |
| Customer | Kunde | `data.customer` | `consultationData.customer` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | Autocomplete (object autoselect) | — | No | — | data-minlength="0", label prefix {{i18n.customer}} |
| Location | Ort | `data.location` | `consultationData.location` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | Autocomplete (object autoselect) | — | No | — | data-minlength="0", label prefix {{i18n.location}} |
| Expert | Experten | `data.user` | `consultationData.user` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | Autocomplete (object autoselect) | — | No | — | data-minlength="0", label prefix {{i18n.expert}} |

### 02-consultation-details-header - Form Elements

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Book Number | `data.bookNumber` | `consultationData.bookNumber` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | far fa-user-injured | -- | No | Yes (disabled) | Always visible |
| Copy Existing Consultation | Copy Existing Consultation | `--` | `—` | — | ui-only | far fa-copy | -- | -- | -- | Always visible. id="openSearchDlg". Opens #consultationSearchDlg |
| Save as Template | Save as Template | `--` | `—` | — | ui-only | far fa-books-medical | -- | -- | -- | Always visible. id="createConsulationTemplate". Opens template create dialog |
| Gender | Gender | `data.body.gender` | `consultationData.body.gender` | [treatment.md#sub-entity-consultationbody](../mongodb-mapping/treatment.md#sub-entity-consultationbody) | string | -- | "" (placeholder), FEMALE, MALE, OTHER | Yes (required) | No | class="internalOnly" -- internal users only |
| Birthday | Birthday | `data.body.birthday` | `consultationData.body.birthday` | [treatment.md#sub-entity-consultationbody](../mongodb-mapping/treatment.md#sub-entity-consultationbody) | string | far fa-birthday-cake | -- | No | No | class="internalOnly" -- internal users only |
| Age | Age | `data.body.age` | `consultationData.body.age` | [treatment.md#sub-entity-consultationbody](../mongodb-mapping/treatment.md#sub-entity-consultationbody) | string | -- | -- | Yes (required) | No (auto-calculated from birthday) | class="internalOnly" -- internal users only. Width: 70px |
| Consultation Date | Consultation Date | `data.date` | `consultationData.date` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | far fa-calendar-day | -- | Yes (mandatory required) | No | Always visible |
| Start Time | Start Time | `data.start` | `consultationData.start` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | far fa-play | -- | Yes (mandatory required) | No | Always visible. Uses clockpicker |
| Search Input | Search Input | `search` | `—` | — | action | fa fa-search (action) | -- | No | No | Search icon triggers search action |

### 02-consultation-details-header - 5.1 Patient Data Tab (`#tabPatientData`) -- Form Elements

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Location Name | Location Name | `data.location.name` | `consultationData.location.name` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | far fa-compass | -- | -- | Yes | notemplate |
| Location Customer | Location Customer | `data.location.customer.name` | `consultationData.location.customer.name` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | -- | Yes | notemplate |
| Room | Room | `data.room` | `consultationData.room` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | fas fa-building | RoomService.autocompleteAvailableRooms | No | Yes (readonly) | notemplate. id="roomAutoselect". Filtered by data.location.id |
| Room Info | Room Info | `--` | `—` | — | ui-only | fas fa-info | -- | -- | -- | id="roomInformation". Opens #roomDetailDialog with room data |
| Time of Contact | Time of Contact | `data.base.contact` | `consultationData.base.contact` | [treatment.md#sub-entity-consultationbase](../mongodb-mapping/treatment.md#sub-entity-consultationbase) | string | far fa-phone-plus | -- | Yes (required) | No | class="shiftonly" -- only for shift consultations |
| Location External Description | Location External Description | `data.location.externalDescription` | `consultationData.location.externalDescription` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | -- | Yes | notemplate |
| Template Name | Template Name | `data.name` | `consultationData.name` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | -- | Yes | class="template" -- only for template consultations |
| Template Description | Template Description | `data.description` | `consultationData.description` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | -- | Yes | class="template" |
| Consultation Type | Consultation Type | `data.type` | `consultationData.type` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | EXTERNAL, DOCUMENT, STANDARD, INCARCERATION, ONBOARDING, TREATMENT | Yes (mandatory required) | No | id="consultationTypeSelection". EXTERNAL option has class="externalonly" |
| Specialization | Specialization | `data.job.code` | `consultationData.job.code` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | far fa-briefcase-medical | -- | -- | Yes | notemplate |
| Doctor | Doctor | `data.doctor` | `consultationData.doctor` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | far fa-user-md | UserService.findDoctor | No | Yes (disabled/readonly) unless admin | {{^isAnAdmin}}disabled{{/isAnAdmin}} -- editable only for admins |
| Communication Type | Communication Type | `data.base.communicationType` | `consultationData.base.communicationType` | [treatment.md#sub-entity-consultationbase](../mongodb-mapping/treatment.md#sub-entity-consultationbase) | string | -- | "" (placeholder), VIDEO, VCGO, PHONE, EMAIL | Yes (mandatory required) | No | notemplate |
| Medical Trained Personnel | Medical Trained Personnel | `data.base.medicalTrainedPersonel` | `consultationData.base.medicalTrainedPersonel` | [treatment.md#sub-entity-consultationbase](../mongodb-mapping/treatment.md#sub-entity-consultationbase) | string | -- | -- | No | No | notemplate |

### 02-consultation-details-header - 5.2 Submit Tab (`#tabSubmit`) -- Form Elements

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| End Time | End Time | `data.end` | `consultationData.end` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | Yes (required) | No | class="shiftonly" |
| Require Reporting | Require Reporting | `data.requireReporting` | `consultationData.requireReporting` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | true / false | No | No | Label: {{i18n.Questionaire.requireReporting}} |
| Comment | Comment | `data.comment` | `consultationData.comment` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | Conditional (mandatory if requireReporting=true) | No | -- |
| Refer Psychotherapy | Refer Psychotherapy | `data.referral.referPsychotherapy` | `consultationData.referral.referPsychotherapy` | [treatment.md#sub-entity-consultationreferral](../mongodb-mapping/treatment.md#sub-entity-consultationreferral) | string | -- | -- | No | No | id="referPsychotherapy" |
| Psychotherapy Comment | Psychotherapy Comment | `data.referral.psychoTherapy.comment` | `consultationData.referral.psychoTherapy.comment` | [treatment.md#sub-entity-consultationreferral](../mongodb-mapping/treatment.md#sub-entity-consultationreferral) | string | -- | -- | No | No | class="conditional" data-condition="#referPsychotherapy" -- shown when referPsychotherapy is checked |
| Further Treatment | Further Treatment | `data.base.furtherTreatment` | `consultationData.base.furtherTreatment` | [treatment.md#sub-entity-consultationbase](../mongodb-mapping/treatment.md#sub-entity-consultationbase) | string | -- | "", REFERRAL, IF_REQUIRED, FOLLOW_UP, REFERRAL_OTHER | Yes (required) | No | id="furtherTreatment" |
| Further Treatment Date | Further Treatment Date | `data.base.dateFurtherTreatment` | `consultationData.base.dateFurtherTreatment` | [treatment.md#sub-entity-consultationbase](../mongodb-mapping/treatment.md#sub-entity-consultationbase) | string | -- | -- | Yes (required) | No | class="conditional" -- shown when furtherTreatment is FOLLOW_UP |
| Referral To | Referral To | `data.standard.referralTo` | `consultationData.standard.referralTo` | [treatment.md#sub-entity-consultationstandard](../mongodb-mapping/treatment.md#sub-entity-consultationstandard) | string | -- | Dynamic from {{{treatmentCategories}}} | Yes (required) | No | class="conditional" -- shown when furtherTreatment is REFERRAL or REFERRAL_OTHER |
| Finalize Agree Checkbox | Finalize Agree Checkbox | `--` | `—` | — | ui-only | -- | -- | -- | -- | id="submitConsultationAgree". Gates the submit button |
| Finalize Button | Finalize Button | `--` | `—` | — | ui-only | -- | -- | -- | -- | id="submitConsultationOK". Disabled until agree checkbox is checked. Saves then calls submit("SUBMIT") |
| Transmit Result | Transmit Result | `data.transmitResult` | `consultationData.transmitResult` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | -- | Yes | Shows result of submission |
| Debug Textarea | Debug Textarea | `--` | `—` | — | ui-only | -- | -- | -- | -- | {{#roleSwitch}} -- admin/debug only. id="consultationDebug" |
| Generate BasisWeb | Generate BasisWeb | `--` | `—` | — | ui-only | -- | -- | -- | -- | {{#roleSwitch}} -- admin/debug only. id="generateBasisWeb" |

### 02-consultation-details-header - 8.1 Patient Data Tab -- Inline Attachment List (line 318-336)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Uploaded Files Label | Uploaded Files Label | `--` | `—` | — | ui-only | -- | -- | -- | -- | {{i18n.PatientData.Attachments.UploadedFiles}}: |
| Attachments Collection | Attachments Collection | `data.attachments` | `consultationData.attachments` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | fa fa-file-download | -- | -- | Yes | Each <li> shows download link + comment |

### 02-consultation-details-header - 8.2 Files Tab (`#tabFiles`) -- Full File Manager (line 463-490)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| File Upload | File Upload | `--` | `—` | — | ui-only | -- | multiple | -- | -- | id="attachFile" |
| Upload Status | Upload Status | `--` | `—` | — | ui-only | -- | -- | -- | -- | id="uploadStatus" |
| File List | File List | `data.attachments` | `consultationData.attachments` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | -- | -- | id="fileList". Shows name, date, delete button |
| Delete Attachment | Delete Attachment | `--` | `—` | — | ui-only | fa fa-trash | -- | -- | -- | class="deleteAttachment". {{#isAnAdmin}} -- admin only |

### 02-consultation-details-header - Filter Form (`#consultationSearchDlgFilter`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Book Number | `filter.bookNumber` | `consultationData.filter.bookNumber` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | far fa-user-injured | -- | No | No | -- |
| Location | Location | `filter.location` | `consultationData.filter.location` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | far fa-compass | LocationService.autocomplete | Yes (mandatory) | No | -- |
| Date From | Date From | `filter.dateStart` | `consultationData.filter.dateStart` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | No | No | Label: {{i18n.dateFilter.fromDate}} |
| Date To | Date To | `filter.dateEnd` | `consultationData.filter.dateEnd` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | -- | -- | No | No | Label: {{i18n.dateFilter.toDate}} |
| Search Button | Search Button | `--` | `—` | — | ui-only | -- | -- | -- | -- | Calls ConsultationService.getAll |

### 03-consultation-details-standard - Form Elements

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| AnamnesisType.MEDICATION (section heading) | AnamnesisType.MEDICATION (section heading) | `--` | `—` | — | ui-only | section-title | -- | -- | -- | incarceration-hide |
| -- | -- | `data.standard.medicationAnamnesis.documentation` | `consultationData.standard.medicationAnamnesis.documentation` | [treatment.md#sub-entity-consultationmedicationanamnesis](../mongodb-mapping/treatment.md#sub-entity-consultationmedicationanamnesis) | bigstring | textarea | -- | Yes (class="required") | No | incarceration-hide; linked to #standardMedicationAnamnesis via class="linked" |

### 03-consultation-details-standard - Collection: `data.standard.anamnesis`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| anamnesis type selector | anamnesis type selector | `anamnesis.type` | `consultationData.anamnesis.type` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | enum | select (readonly) | "" = patientReport, MEDICAL, ALLERGY, OWN, FAMILY, PRETREATMENT, NOW, ADDICTION, NOTES, DENTAL, HAND | No | Yes (readonly) | -- |
| Delete action | Delete action | `--` | `—` | — | action | action-button | -- | -- | -- | -- |
| Documentation | Documentation | `anamnesis.documentation` | `consultationData.anamnesis.documentation` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | bigstring | textarea | -- | Yes (class="required") | No | -- |
| Insert type selector | Insert type selector | `inserts into data.standard.anamnesis` | `consultationData.standard.anamnesis` | [treatment.md#sub-entity-consultationanamnesis](../mongodb-mapping/treatment.md#sub-entity-consultationanamnesis) | enum | select (class="insert insertType insert-required") | "" = anamnesis (placeholder), MEDICAL, ALLERGY, DENTAL, OWN, FAMILY, HAND, NOW, MEDICATION, NOTES, ADDICTION, PRETREATMENT | Yes (insert-required) | No | -- |

### 03-consultation-details-standard - Collection: `data.standard.patientReport`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Report type selector | Report type selector | `patientReport.type` | `consultationData.patientReport.type` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | enum | select (readonly) | "" = patientReport, FINDINGS, ECG, NOW, MEASUREMENT, LZRR, XRAY, OTHER, ULTRASOUND, ACCESS, DENTAL | No | Yes (readonly) | -- |
| Delete action | Delete action | `--` | `—` | — | action | action-button | -- | -- | -- | -- |
| Documentation | Documentation | `patientReport.documentation` | `consultationData.patientReport.documentation` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | bigstring | textarea | -- | Yes (class="required") | No | -- |
| Insert type selector | Insert type selector | `inserts into data.standard.patientReport` | `consultationData.standard.patientReport` | [treatment.md#sub-entity-consultationpatientreport](../mongodb-mapping/treatment.md#sub-entity-consultationpatientreport) | enum | select (class="insert insertType insert-required") | "" = patientReport, FINDINGS, MEASUREMENT, ECG, NOW, LZRR, XRAY, OTHER, ULTRASOUND, ACCESS, DENTAL | Yes (insert-required) | No | -- |

### 03-consultation-details-standard - Collection: `data.standard.diagnosis`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Localization | Localization | `diagnosis.localization` | `consultationData.diagnosis.localization` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | enum | select | UNKNOWN="", LEFT="L", RIGHT="R", BOTH="B" | No | No | -- |
| Diagnostic certainty level | Diagnostic certainty level | `diagnosis.level` | `consultationData.diagnosis.level` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | enum | select (class="mandatory") | ""="-", VERIFY="V", ZERO="Z", GENERAL="G" | Yes (mandatory) | No | -- |
| Delete action | Delete action | `--` | `—` | — | action | action-button | -- | -- | -- | -- |
| Diagnosis title | Diagnosis title | `diagnosis.title` | `consultationData.diagnosis.title` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display (bold) | -- | -- | Yes (display only) | -- |
| ICD-10 Inclusion | ICD-10 Inclusion | `diagnosis.icd10.inclusion` | `consultationData.diagnosis.icd10.inclusion` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display (rendered) | -- | -- | Yes (display only) | -- |
| ICD-10 Exclusion | ICD-10 Exclusion | `diagnosis.icd10.exclusion` | `consultationData.diagnosis.icd10.exclusion` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display (rendered) | -- | -- | Yes (display only) | -- |
| Comment | Comment | `diagnosis.comment` | `consultationData.diagnosis.comment` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | bigstring | textarea | -- | No | No | -- |
| ICD-10 search | ICD-10 search | `inserts into data.standard.diagnosis` | `consultationData.standard.diagnosis` | [treatment.md#sub-entity-consultationdiagnosis](../mongodb-mapping/treatment.md#sub-entity-consultationdiagnosis) | enum | autocomplete (data-service="IcdService", data-method="autocomplete", data-forceselect="true") | display: title icd10.name | Yes (insert-required) | No | -- |
| ICD-10 search button | ICD-10 search button | `--` | `—` | — | action | action-button | -- | -- | -- | Opens ICD-10 search dialog |

### 03-consultation-details-standard - Column 1 (col-md-6): Product & Active Ingredients

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Info action | Info action | `--` | `—` | — | action | action-button | -- | -- | -- | -- |
| Product selector | Product selector | `prescription.product` | `consultationData.prescription.product` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | enum | select (class="object") | custom-filled | No | No | -- |
| Product name (custom) | Product name (custom) | `prescription.product.name` | `consultationData.prescription.product.name` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | text (class="customPrescription") | -- | Yes (mandatory) | No | Shown via customPrescription class |
| Delete action | Delete action | `--` | `—` | — | action | action-button | -- | -- | -- | -- |
| Packaging / dosage form | Packaging / dosage form | `prescription.packaging` | `consultationData.prescription.packaging` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | enum | select (class="mandatory") | See Packaging Enum below | Yes (mandatory) | No | -- |

### 03-consultation-details-standard - Nested Collection: `prescription.activeIngredients`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Name (display) | Name (display) | `activeIngredients.name` | `consultationData.activeIngredients.name` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display (bold) | -- | -- | Yes | -- |
| Amount (display) | Amount (display) | `activeIngredients.amount` | `consultationData.activeIngredients.amount` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display | -- | -- | Yes | -- |
| Name (input) | Name (input) | `activeIngredients.name` | `consultationData.activeIngredients.name` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | text (class="customPrescription") | -- | Yes (mandatory) | No | customPrescription |
| Amount (input) | Amount (input) | `activeIngredients.amount` | `consultationData.activeIngredients.amount` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | text (class="customPrescription") | -- | Yes (mandatory) | No | customPrescription |
| Delete action | Delete action | `--` | `—` | — | action | action-button | -- | -- | -- | -- |
| Description (display) | Description (display) | `activeIngredients.description` | `consultationData.activeIngredients.description` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display | -- | -- | Yes | -- |

### 03-consultation-details-standard - Column 2 (col-md-6): Dosage & Medication Info

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Dosage amount | Dosage amount | `prescription.dosageAmount` | `consultationData.prescription.dosageAmount` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | bigstring | textarea | -- | Yes (required) | No | -- |
| Medication name | Medication name | `prescription.medication.name` | `consultationData.prescription.medication.name` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display (bold) | -- | -- | Yes | -- |
| Medication code | Medication code | `prescription.medication.code` | `consultationData.prescription.medication.code` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display | -- | -- | Yes | -- |
| Medication dosage | Medication dosage | `prescription.medication.dosage` | `consultationData.prescription.medication.dosage` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display | -- | -- | Yes | -- |
| Medication usage | Medication usage | `prescription.medication.usage` | `consultationData.prescription.medication.usage` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | field-display | -- | -- | Yes | -- |

### 03-consultation-details-standard - Column 3 (col-md-4): Prescription Type & Comment

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Prescription type | Prescription type | `prescription.type` | `consultationData.prescription.type` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | enum | select (class="mandatory required") | "" = "- PrescriptionType", STANDARD, LIMITED, LONGTERM | Yes | No | -- |
| Comment | Comment | `prescription.comment` | `consultationData.prescription.comment` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | text | -- | No | No | -- |

### 03-consultation-details-standard - When type = `STANDARD` (`<div class="prescription standard">`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Dosage requirement | Dosage requirement | `prescription.dosageRequirement` | `consultationData.prescription.dosageRequirement` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | text | -- | Yes (required) | No | Visible when prescription.type = STANDARD |

### 03-consultation-details-standard - When type = `LIMITED` or `LONGTERM` (`<table class="prescription limited longterm">`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Morning header | Morning header | `--` | `—` | — | ui-only | header | -- | -- | -- | prescription.type in [LIMITED, LONGTERM] |
| Noon header | Noon header | `--` | `—` | — | ui-only | header | -- | -- | -- | same |
| Evening header | Evening header | `--` | `—` | — | ui-only | header | -- | -- | -- | same |
| Night header | Night header | `--` | `—` | — | ui-only | header | -- | -- | -- | same |
| Morning dose | Morning dose | `prescription.morning` | `consultationData.prescription.morning` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | number | number | -- | No | No | same; title=**HARDCODED** "Morgens" |
| Noon dose | Noon dose | `prescription.lunch` | `consultationData.prescription.lunch` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | number | number | -- | No | No | same; title=**HARDCODED** "Mittags" |
| Evening dose | Evening dose | `prescription.evening` | `consultationData.prescription.evening` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | number | number | -- | No | No | same; title=**HARDCODED** "Abends" |
| Night dose | Night dose | `prescription.night` | `consultationData.prescription.night` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | number | number | -- | No | No | same; title=**HARDCODED** "Nachts" |
| Unit | Unit | `prescription.unit` | `consultationData.prescription.unit` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | enum | select | See Unit Enum below | No | No | same |

### 03-consultation-details-standard - Column 5 (col-md-3): Dates & Checkboxes

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Start date | Start date | `prescription.start` | `consultationData.prescription.start` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | date | date | -- | No | No | -- |
| End date | End date | `prescription.end` | `consultationData.prescription.end` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | date | date | -- | No | No | -- |
| Initial dosage given | Initial dosage given | `prescription.initialDosageGiven` | `consultationData.prescription.initialDosageGiven` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | boolean | checkbox | -- | No | No | -- |
| Allow substitute | Allow substitute | `prescription.allowSubstitute` | `consultationData.prescription.allowSubstitute` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | boolean | checkbox | -- | No | No | -- |
| Medication search | Medication search | `inserts into data.standard.prescription` | `consultationData.standard.prescription` | [treatment.md#sub-entity-consultationprescription](../mongodb-mapping/treatment.md#sub-entity-consultationprescription) | enum | autocomplete (data-service="ConsultationService", data-method="prescription", data-forceselect="true") | display: medication.name | No | No | -- |
| Medication add action | Medication add action | `--` | `—` | — | action | action-button | -- | -- | -- | -- |
| Medication search button | Medication search button | `--` | `—` | — | action | action-button | -- | -- | -- | Opens medication search dialog |

### 03-consultation-details-standard - Collection: `data.standard.workIncapacity`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Start date | Start date | `workIncapacity.start` | `consultationData.workIncapacity.start` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | date | date | -- | No | No | incarceration-hide |
| End date | End date | `workIncapacity.end` | `consultationData.workIncapacity.end` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | date | date | -- | No | No | incarceration-hide |
| Delete action | Delete action | `--` | `—` | — | action | action-button | -- | -- | -- | -- |
| Documentation | Documentation | `workIncapacity.documentation` | `consultationData.workIncapacity.documentation` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | bigstring | textarea | -- | No | No | incarceration-hide |

### 03-consultation-details-standard - 7. Block: Procedere Report

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Procedere report | Procedere report | `data.standard.procedureReport` | `consultationData.standard.procedureReport` | [treatment.md#sub-entity-consultationstandard](../mongodb-mapping/treatment.md#sub-entity-consultationstandard) | bigstring | textarea | -- | Yes (required) | No | incarceration-hide |

### 08-consultation-details-js - 5. Collection Handlers (postAddCollection)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| data.standard.prescription | data.standard.prescription | `data.standard.prescription` | `consultationData.standard.prescription` | [treatment.md#sub-entity-consultationprescription](../mongodb-mapping/treatment.md#sub-entity-consultationprescription) | string | — | — | — | — | — |
| data.warnings | data.warnings | `data.warnings` | `consultationData.warnings` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | string | — | — | — | — | — |
| data.patientReport | data.patientReport | `data.patientReport` | `consultationData.patientReport` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | — | — | — | — | — |
| data.anamnesis (inferred) | data.anamnesis (inferred) | `data.anamnesis (inferred)` | `consultationData.anamnesis (inferred)` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | — | — | — | — | — |
| (ICD-10 diagnosis collections) | (ICD-10 diagnosis collections) | `(ICD-10 diagnosis collections)` | `consultationData.(ICD-10 diagnosis collections)` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | — | — | — | — | — |
| result | result | `result` | `consultationData.result` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | — | — | — | — | — |
| templates | templates | `templates` | `consultationData.templates` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | — | — | — | — | — |
| diagnosis | diagnosis | `diagnosis` | `consultationData.diagnosis` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | — | — | — | — | — |
| prescription | prescription | `prescription` | `consultationData.prescription` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | — | — | — | — | — |

### 01-treatment-and-category - Form Elements

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Select time period for sending reminders | Zeitraum für die Sendung von Erinnerungen auswählen | `—` | `—` | — | ui-only | <p> (static text) | — | — | — | Always shown |
| action.dateStart (title) | action.dateStart (title) | `data.start` | `consultationData.start` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | date | <input class="date"> | — | Yes (mandatory) | No | — |
| days (suffix label) | days (suffix label) | `data.days` | `consultationData.days` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | number | <input type="number"> | — | Yes (mandatory) | No | — |
| Each location receives an e-mail with all the scheduled appointments for this period. | Jeder Ort bekommt eine E-Mail mit allen eingeteilten Terminen in diesem Zeitraum. | `—` | `—` | — | ui-only | <p class="text-muted"> (static help text) | — | — | — | Always shown |
| "Tag" | "Tag" | `—` | `—` | — | ui-only | <input type="number"> | — | — | — | **HARDCODED** placeholder "Tag" (German for "Day") |
| Job-Id | Dienstleistung | `—` | `—` | — | ui-only | <input type="text"> | — | — | — | — |
| "- State -" (empty option) | "- Status -" (empty option) | `—` | `—` | — | ui-only | <select> | — | — | — | 12 state options (see below) |
| button.reset | button.reset | `—` | `—` | — | action | <button> | — | — | — | — |
| label.name | label.name | `data.name` | `consultationData.name` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | <input class="form-control"> | — | No (no mandatory class) | No | — |
| label.description | label.description | `data.description` | `consultationData.description` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | string | <input class="form-control"> | — | No | No | — |
| label.priority | label.priority | `data.prio` | `consultationData.prio` | [treatment.md#table-consultationdata](../mongodb-mapping/treatment.md#table-consultationdata) | number | <input class="form-control number"> | — | No | No | — |

### 01-medication - 4.2 Detail Form (Single tab, no tabs)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Entry Number | Entry Number | `—` | `—` | — | ui-only | number | -- | No | — | — |
| Name | Name | `—` | `—` | — | ui-only | text | -- | No | — | — |
| Unit | Unit | `—` | `—` | — | ui-only | select | PIECE (MedicationUnit.PIECE), IE (MedicationUnit.IE) | No | — | — |
| Target Group | Target Group | `—` | `—` | — | ui-only | text | -- | No | — | — |
| Usage | Usage | `—` | `—` | — | ui-only | text | -- | No | — | — |
| Application Area | Application Area | `—` | `—` | — | ui-only | text | -- | No | — | — |
| Approval Status | Approval Status | `—` | `—` | — | ui-only | text | -- | No | — | — |
| Trafficability | Trafficability | `—` | `—` | — | ui-only | checkbox switch | -- | No | — | — |
| Producer | Producer | `—` | `—` | — | ui-only | text | -- | No | — | — |
| Authorisation Holder | Authorisation Holder | `—` | `—` | — | ui-only | text | -- | No | — | — |
| Package Size | Package Size | `—` | `—` | — | ui-only | text | -- | No | — | — |
| AM Classification | AM Classification | `—` | `—` | — | ui-only | text | -- | No | — | — |

### 01-patient-data - 5.3 Detail Form (Single view, no tabs)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Book Number | `—` | `—` | — | ui-only | text | — | — | — | Input group with label prefix |
| jNumber | jNumber | `—` | `—` | — | ui-only | text | — | — | — | "JNumber used to get the bookNumber" (tooltip) |
| Appointment ID | Appointment ID | `—` | `—` | — | ui-only | number | — | — | — | "for what appointment is the data" (tooltip) |
| Closed | Closed | `—` | `—` | — | ui-only | date | — | — | — | Calendar icon, input group |
| Attachments | Attachments | `—` | `—` | — | ui-only | file collection | — | — | — | See below |

### 02-appointment-details-patient - Patient Data Dialog (`patientDataDlg`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| data.bookNumber | data.bookNumber | `—` | `—` | — | ui-only | input | — | — | — | — |
| data.jNumber | data.jNumber | `—` | `—` | — | ui-only | input | — | — | — | Used to derive bookNumber |
| data.location | data.location | `—` | `—` | — | ui-only | input (autocomplete) | — | — | — | LocationService.autocomplete; mandatory toggles with jobSupport checkbox |
| data.closed | data.closed | `—` | `—` | — | ui-only | input (datepicker) | — | — | — | — |

### 05-consultation-wizard - 5.1 Step 1: `cw-start` — Patient Selection

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| data.bookNumberSelect | data.bookNumberSelect | `—` | `—` | — | ui-only | <select> | — | Yes | — | Dynamically populated from appointment.patients[]. Each option value is bookNumber ?? jNumber. |

### 05-consultation-wizard - 5.2 Step 2: `cw-booknumber` — Manual Book Number

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| data.booknumber | data.booknumber | `—` | `—` | — | ui-only | <input> | — | Yes | — | Placeholder: consultation.booknumber. Dynamic input mask from location.booknumberMask. |

### 05-consultation-wizard - 5.3 Step 3: `cw-type` — Consultation Type

| UI Field Label (EN)   | UI Field Label (DE)   | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required                                   | Read-only | Notes                                                                                         |
| --------------------- | --------------------- | -------------------- | --------------------------------- | -------------------- | ------------- | ---------- | ------------ | ------------------------------------------ | --------- | --------------------------------------------------------------------------------------------- |
| data.consultationtype | data.consultationtype | `—`                  | `—`                               | —                    | ui-only       | <select>   | —            | Yes (implicitly — empty value blocks Next) | —         | Options: EXTERNAL, DOCUMENT, STANDARD, INCARCERATION, ONBOARDING, ONBOARDING_SHORT, TREATMENT |

### 05-consultation-wizard - 5.4 Step 4: `cw-success` — Summary & Confirm

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| data.appointment.job.expertTitle | data.appointment.job.expertTitle | `—` | `—` | — | ui-only | <span> | — | — | Display only | — |
| data.location.name | data.location.name | `—` | `—` | — | ui-only | <span> | — | — | Display only | — |
| data.booknumber | data.booknumber | `—` | `—` | — | ui-only | <span> | — | — | Display only | — |
| data.type | data.type | `—` | `—` | — | ui-only | <select> | — | — | Display (pre-selected) | — |

### 05-consultation-wizard - Form Elements

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| data.location | data.location | `—` | `—` | — | ui-only | <input> | — | Yes | — | data-service="LocationService", data-method="autocomplete", data-display="name". Placeholder: location. Icon: far fa-compass. |

### 04-dialogs-treatment - Form Elements

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| data.timeStart | data.timeStart | `—` | `—` | — | ui-only | input[type=time] | — | Yes | No | Clockpicker; icon far fa-play; title {{i18n.action.dateStart}} |
| data.timeEnd | data.timeEnd | `—` | `—` | — | ui-only | input[type=time] | — | Yes | No | Clockpicker; icon far fa-stop; title {{i18n.action.dateEnd}} |
| data.summary.adjustedStart | data.summary.adjustedStart | `—` | `—` | — | ui-only | input[type=time] | — | Yes | No | Clockpicker; label {{i18n.action.dateStartTime}} |
| data.summary.adjustedUntil | data.summary.adjustedUntil | `—` | `—` | — | ui-only | input[type=time] | — | Yes | No | Clockpicker; label "Ende" (HARDCODED) |
| data.summary.communicationType | data.summary.communicationType | `—` | `—` | — | ui-only | select | — | Yes | No | Options: VIDEO, VCGO (default), PHONE (default), EMAIL (default) |
| data.summary.referral | data.summary.referral | `—` | `—` | — | ui-only | input | — | No | No | Label {{i18n.FurtherTreatment.REFERRAL}} |
| data.summary.ifRequired | data.summary.ifRequired | `—` | `—` | — | ui-only | input | — | No | No | Label "WV" (HARDCODED) |
| data.summary.followUp | data.summary.followUp | `—` | `—` | — | ui-only | input | — | No | No | Label {{i18n.FurtherTreatment.FOLLOW_UP}} |
| data.summary.referralOther | data.summary.referralOther | `—` | `—` | — | ui-only | input | — | No | No | Label "Uberweisung" (HARDCODED) |
| data.bookNumber | data.bookNumber | `—` | `—` | — | ui-only | input | — | Yes | No | Icon far fa-user-injured; placeholder {{i18n.consultation.booknumber}} |
| data.code | data.code | `—` | `—` | — | ui-only | input | — | Yes | No | Icon far fa-key; placeholder {{i18n.consultation.code}} |
| data.bookNumber | data.bookNumber | `—` | `—` | — | ui-only | input | — | No | Yes | readonly="readonly"; icon far fa-user-injured |
| data.code | data.code | `—` | `—` | — | ui-only | input | — | No | Yes | readonly="readonly"; icon far fa-key |
| data.target.name | data.target.name | `—` | `—` | — | ui-only | input | — | Yes | No | Placeholder {{i18n.contact.firstName}} {{i18n.contact.lastName}} |
| data.target.address | data.target.address | `—` | `—` | — | ui-only | input | — | Yes | No | Placeholder {{i18n.contact.street}} |
| data.target.address2 | data.target.address2 | `—` | `—` | — | ui-only | input | — | No | No | Placeholder {{i18n.contact.street2}} |
| data.target.zip | data.target.zip | `—` | `—` | — | ui-only | input | — | Yes | No | Placeholder {{i18n.contact.zipcode}}; has searchZipCode class for auto-lookup |
| data.target.state | data.target.state | `—` | `—` | — | ui-only | input | — | No | No | Placeholder {{i18n.contact.state}} |
| data.target.city | data.target.city | `—` | `—` | — | ui-only | input | — | Yes | No | Placeholder {{i18n.contact.city}} |
| data.target.country | data.target.country | `—` | `—` | — | ui-only | input | — | No | No | Placeholder {{i18n.contact.country}} |
| data.target.addressInfo | data.target.addressInfo | `—` | `—` | — | ui-only | textarea | — | No | No | Placeholder "Zusatztext Adresse" (HARDCODED) |

