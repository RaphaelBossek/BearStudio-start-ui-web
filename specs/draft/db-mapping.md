# Database Mapping Specification

This document defines the mapping between the business entities described in `specs/draft/all-together.md` and the actual database schema of the `videoclinic` database, as explored via MongoDB and defined in `specs/draft/videoclinic.dbml`.

---

## Database Overview

This section provides a high-level overview of the collections in the `videoclinic` database, grouped by their primary usage topics.

### Planning
Definition of consultation schedules, shifts, and expert availability.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan) | Sprechstundenplan (Appointment Plan) | Definition of a consultation schedule entry, including service, day, repetitions, times, assigned experts, locations, and customers. | `AppointmentPlan` |
| [`expertWeek`](#entity-experten-wochenplan-expert-week) | Experten-Wochenplan (Expert Week) | Weekly availability and shift definitions for an individual expert. | `ExpertWeek` |
| [`expertDays`](#entity-jahreskalender-eines-experten-expert-days) | Jahreskalender eines Experten (Expert Days) | Detailed availability calendar for experts, tracking shifts and appointment availability per day. | `ExpertDays` |
| [`appointment`](#entity-termine-appointments) | Termine (Appointments) | Individual appointments scheduled for patients with experts. | `Appointment` |
| [`appointmentAssignment`](#entity-terminzuweisungen-appointment-assignments) | Terminzuweisungen (Appointment Assignments) | Links between appointments and the experts or tasks assigned to them. | `AppointmentAssignment` |
| [`appointmentAssignmentHistory`](#entity-terminzuweisungs-historie-appointment-assignment-history) | Terminzuweisungs-Historie (Appointment Assignment History) | Audit trail for changes to appointment assignments. | `AppointmentAssignmentHistory` |
| [`shiftPlan`](#entity-schichtplan-shift-plan) | Schichtplan (Shift Plan) | Recurring shift schedule for expert on-call duties. | `ShiftPlan` |
| [`holiday`](#entity-abwesenheiten-urlaub-holidays) | Abwesenheiten/Urlaub (Holidays) | Individual expert absences, vacations, or sick leave. | `Holiday` |
| [`room`](#entity-r-ume-rooms) | Räume (Rooms) | Individual consultation or treatment rooms within a location. | `Room` |

### Capabilities
Definition of expert skills and required qualifications for services.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`skill`](#entity-fähigkeiten-skills) | Fähigkeiten (Skills) | Definition of a skill (Fähigkeit), including name, description, type, and status. | `Skill` |

### User Management
Management of experts, users, roles, and their associated profiles and sessions.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`user`](#entity-experte-expert) | Experte (Expert) | Expert profile including personal details, contact info, credentials, status, billing info, and qualifications. | `User` |
| [`group`](#entity-benutzergruppen-groups) | Benutzergruppen (Groups) | Roles and permissions groups assigned to users. | `Group` |
| [`accessRight`](#entity-zugriffsrechte-access-rights) | Zugriffsrechte (Access Rights) | Definition of individual permissions and their descriptions. | `AccessRight` |
| [`userFile`](#entity-benutzerdateien-user-files) | Benutzerdateien (User Files) | Metadata and references for files uploaded by or for users. | `UserFile` |
| [`persistentSession`](#entity-benutzersitzungen-persistent-sessions) | Benutzersitzungen (Persistent Sessions) | Storage for persistent user authentication sessions. | `PersistentSession` |
| [`onboardingHistory`](#entity-onboarding-verlauf-onboarding-history) | Onboarding-Verlauf (Onboarding History) | Records of onboarding steps completed by employees or locations. | `OnboardingHistory` |
| [`onboardingStep`](#entity-onboarding-schritte-onboarding-steps) | Onboarding-Schritte (Onboarding Steps) | Individual steps and checks required for onboarding processes. | `OnboardingStep` |
| [`loginNotification`](#entity-login-benachrichtigungen-login-notifications) | Login-Benachrichtigungen (Login Notifications) | Specialized notifications triggered by user login events. | `LoginNotification` |
| [`1testuser`](#entity-testbenutzer-test-user) | Testbenutzer (Test User) | Placeholder or dedicated entity for system testing and QA. | `Unknown/Test` |

### Treatment
Core medical data, consultations, treatments, and patient information.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`treatment`](#entity-behandlungsverlauf-treatment) | Behandlungsverlauf (Treatment) | Tracking of medical treatments, including states and positions. | `Treatment` |
| [`treatmentCategory`](#entity-behandlungskategorien-treatment-categories) | Behandlungskategorien (Treatment Categories) | Categories for organizing and classifying different treatments. | `TreatmentCategory` |
| [`consultationData`](#entity-konsultationsdaten-consultation-data) | Konsultationsdaten (Consultation Data) | Detailed data for a consultation, including medical records, prescriptions, and results. | `Consultation` |
| [`consultation`](#entity-konsultationen-legacy) | Konsultationen (Legacy) | Legacy consultation records and their states. | `Consultation` |
| [`expertConsultationTemplate`](#entity-konsultationsvorlagen-expert-consultation-templates) | Konsultationsvorlagen (Expert Consultation Templates) | Custom templates used by experts for various consultation types. | `ExpertConsultationTemplate` |
| [`patientData`](#entity-patientenerg-nzungsdaten-patient-data) | Patientenergänzungsdaten (Patient Data) | Additional metadata and settings associated with a patient profile. | `PatientData` |
| [`patient`](#entity-patienten-patients) | Patienten (Patients) | Core patient profiles, including demographic and contact information. | `Patient` |
| [`patientAlerts`](#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | Patientenbezogene Risikofaktoren / Warnhinweise (Patient Alerts) | Exclusion criteria (warnings) consisting of name, description, weight, and status. | `Warning` |
| [`serviceQm`](#entity-service-qualit-tsmanagement-service-qm) | Service-Qualitätsmanagement (Service QM) | Data related to quality assurance and management of medical services. | `ServiceQm` |
| [`questionaire`](#entity-qualit-tsumfragen-questionaires) | Qualitätsumfragen (Questionaires) | Quality management surveys and results. | `Questionaire` |
| [`equipment`](#entity-ausr-stung-equipment) | Ausrüstung (Equipment) | Inventory of medical or technical equipment used in consultations. | `Equipment` |
| [`equipmentGroup`](#entity-ausr-stungsgruppen-equipment-groups) | Ausrüstungsgruppen (Equipment Groups) | Grouping of equipment for easier management and assignment. | `EquipmentGroup` |
| [`locationRoomsDto`](#entity-standort-snapshots-location-rooms-dto) | Standort-Snapshots (Location Rooms DTO) | Snapshots of location and room configurations at a specific point in time. | `dto.LocationRoomsDto` |

### Academy (Training)
Educational resources and training materials for users.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`video`](#entity-videos-videos) | Videos (Videos) | Metadata for instructional or informational videos in the system. | `Video` |
| [`userVideoHistory`](#entity-video-verlauf-user-video-history) | Video-Verlauf (User Video History) | Tracking of video call attempts and successful connections. | `UserVideoHistory` |
| [`videoCategory`](#entity-videokategorien-video-categories) | Videokategorien (Video Categories) | Categorization for organizing the video library. | `VideoCategory` |

### News
System announcements and user notifications.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`notification`](#entity-benachrichtigungen-notifications) | Benachrichtigungen (Notifications) | Logs of notifications sent to users via various channels. | `Notification` |
| [`notificationTemplate`](#entity-benachrichtigungsvorlagen-notification-templates) | Benachrichtigungsvorlagen (Notification Templates) | Reusable templates for automated system notifications. | `NotificationTemplate` |
| [`messageOfTheDay`](#entity-system-ank-ndigungen-message-of-the-day) | System-Ankündigungen (Message of the Day) | Global announcements displayed to users upon login. | `MessageOfTheDay` |

### Interfaces
Data exchange and integration with external systems like BasisWeb.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`basisWebData`](#entity-jva-patientendaten-basis-web-data) | JVA Patientendaten (Basis Web Data) | Encrypted patient information from external JVA systems. | `BasisWebData` |
| [`basisWebAppointment`](#entity-web-terminanfragen-basis-web-appointment) | Web-Terminanfragen (Basis Web Appointment) | External appointment requests originating from BasisWeb. | `BasisWebAppointment` |

### External Data
Reference data including medical classifications, medications, and telephony logs.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`icd10`](#entity-icd-10-klassifikation-icd-10) | ICD-10 Klassifikation (ICD-10) | International Classification of Diseases (ICD-10) codes and descriptions. | `Icd10` |
| [`medication`](#entity-medikamente-medication) | Medikamente (Medication) | Comprehensive database of medications, ingredients, and dosages. | `Medication` |
| [`zipCodeLookup`](#entity-plz-verzeichnis-zip-code-lookup) | PLZ-Verzeichnis (Zip Code Lookup) | Geographic reference data for postal codes and cities. | `ZipCodeLookup` |
| [`country`](#entity-l-nder-countries) | Länder (Countries) | Reference data for countries, including codes and names. | `Country` |
| [`publicHoliday`](#entity-feiertage-public-holidays) | Feiertage (Public Holidays) | Definition of public holidays for specific regions and years. | `PublicHoliday` |
| [`cDRCall`](#entity-anrufliste-cdr-calls) | Anrufliste (CDR Calls) | Call Detail Records for tracking telephonic interactions. | `CDRCall` |
| [`cDRCallAssignment`](#entity-cdr-call-zuweisungen-cdr-call-assignment) | CDR Call Zuweisungen (CDR Call Assignment) | Mapping of call records to specific patients or consultations. | `CDRCallAssignment` |

### Customer
Entities related to customers, locations, and sites.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`customer`](#entity-kunden-customers) | Kunden (Customers) | Organizational entities (customers) that are assigned to locations and appointment plans. | `Customer` |
| [`location`](#entity-standorte-locations) | Standorte (Locations) | Definition of consultation sites, including room configurations and contact details. | `Location` |
| [`locationType`](#entity-standorttypen-location-types) | Standorttypen (Location Types) | Classification for different types of consultation locations. | `LocationType` |
| [`site`](#entity-seiten-standorte-sites) | Seiten/Standorte (Sites) | Physical locations or digital sites associated with the system. | `Site` |

### Accounting
Entities related to billing, customers, pricing, and financial tracking.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`invoice`](#entity-rechnungen-invoices) | Rechnungen (Invoices) | Billing documents for experts, customers, or patients. | `Invoice` |
| [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components) | Rechnungskomponenten (Invoice Components) | Individual items and rules contributing to a final invoice. | `InvoiceComponent` |
| [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers) | Rechnungsempfänger (Invoice Receivers) | Details of entities receiving invoices, including tax settings. | `InvoiceReceiver` |
| [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly) | Monatliche Expertenarbeit (Expert Work Monthly) | Aggregated monthly work logs and billing summaries for experts. | `ExpertWorkMonthly` |
| [`jobId`](#entity-dienstleistung-service) | Dienstleistung (Service) | Definition of a service (Dienstleistung), including title, color, billing modality, specialty, and consultation types. | `JobId` |
| [`jobPriceList`](#entity-preislisten-job-price-lists) | Preislisten (Job Price Lists) | Master price lists for different services and specialties. | `JobPriceList` |
| [`product`](#entity-waren-products) | Waren (Products) | Goods or services subscribed by the expert, including quantity, price, and dates. | `Product` |
| [`cashRegister`](#entity-kassenregistrierung-cash-register) | Kassenregistrierung (Cash Register) | Records of cash transactions and POS register states. | `CashRegister` |
| [`closedMonth`](#entity-abgeschlossene-zeitr-ume-closed-months) | Abgeschlossene Zeiträume (Closed Months) | Tracking of billing periods that have been finalized and locked. | `ClosedMonth` |
| [`stornoGroup`](#entity-storno-regelgruppen-storno-groups) | Storno-Regelgruppen (Storno Groups) | Rules and groups defining cancellation conditions and fees. | `StornoGroup` |
| [`workHour`](#entity-arbeitszeit-kategorien-work-hours) | Arbeitszeit-Kategorien (Work Hours) | Definitions of different work hour types for billing and reporting. | `WorkHour` |

### System
Technical configurations, logs, and system-wide settings.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`log`](#entity-system-logs-logs) | System-Logs (Logs) | Technical application logs for monitoring and debugging. | `Log` |
| [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue) | Hintergrundaufgaben (Async Job Queue) | Status and tracking of asynchronous background tasks. | `AsyncJobQueue` |
| [`exportTemplate`](#entity-export-vorlagen-export-templates) | Export-Vorlagen (Export Templates) | Configuration for data exports for various business entities. | `ExportTemplate` |
| [`supportCategory`](#entity-support-kategorien-support-categories) | Support-Kategorien (Support Categories) | Categories used for organizing support requests and help documents. | `SupportCategory` |
| [`uploadFile`](#entity-dateiuploads-upload-files) | Dateiuploads (Upload Files) | Records of generic file uploads managed by the system. | `UploadFile` |
| [`sequenceEntity`](#entity-sequenz-z-hler-sequence-entity) | Sequenz-Zähler (Sequence Entity) | Global counters used to generate unique numeric identifiers. | `SequenceEntity` |
| [`videoclinicSystem`](#entity-systemkonfiguration-videoclinic-system) | Systemkonfiguration (Videoclinic System) | Global system settings and configuration parameters. | `VideoclinicSystem` |
| [`cacheState`](#entity-cache-status-cache-state) | Cache-Status (Cache State) | Technical collection for tracking the version/state of various system caches. | `CacheState` |

### Depricated (not implemented)
Tables that are no longer in use or not yet implemented.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`tag`](#entity-tags-tags) | Tags (Tags) | Metadata tags used for labeling and filtering various system entities. | `Tag` |
| [`project`](#entity-projekte-projects) | Projekte (Projects) | Organizational entities used to group related resources or operations. | `Project` |
| [`department`](#entity-abteilungen-departments) | Abteilungen (Departments) | Medical specialties or organizational departments. | `Department` |


---

## Enumeration Overlaps and Redundancies

This section documents identified overlapping or redundant "enum-like" string columns within the `videoclinic` MongoDB. These overlaps range from identical value sets to subsets where one field covers a portion of another's domain.

### Identical Overlaps
These fields have exactly the same set of values and could likely be unified.
- **`appointment.type`**, **`consultationData.appointmentType`**, and **`jobId.type`**
   - Values: `{APPOINTMENT, SHIFT}`
- **`appointment.priceType`** and **`shiftPlan.priceType`**
   - Values: `{WEEKDAY, WEEKNIGHT, WEEKENDDAY, WEEKENDNIGHT}`

### Subset / Parent-Child Overlaps
These fields share values, where one is a more specific subset of a broader category.

- **`consultationData.type`** and **`consultation.type`**
   - `consultationData.type`: `{EXTERNAL, STANDARD, DOCUMENT}`
   - `consultation.type`: `{EXTERNAL, STANDARD, DOCUMENT, ONBOARDING, ONBOARDING_SHORT}`
   - *Overlap:* `consultationData` uses a subset of the types defined in the legacy `consultation` table.
- **`consultationData.state`** and **`consultation.state`**
   - `consultationData.state`: `{CLOSED, VERIFIED, TRANSMITTED}`
   - `consultation.state`: `{CLOSED, OPEN, VERIFIED, TRANSMITTED}`
   - *Overlap:* `consultationData` uses a subset of the states defined in the legacy `consultation` table.
- **`user.employeeState`** and **`user.role`**
   - While semantically different, `ACTIVE` and `INACTIVE` appear in both the `employeeState` and potentially in role-based logic across the system.
- **`jobId.defaultFurtherTreatment`** and **`ConsultationBase.furtherTreatment`**
   - `jobId.defaultFurtherTreatment`: `{FOLLOW_UP, IF_REQUIRED}`
   - `ConsultationBase.furtherTreatment`: `{FOLLOW_UP, IF_REQUIRED, REFERRAL, REFERRAL_OTHER}`

### Single-Value Redundancies
These fields currently primarily contain a single value and often represent a subset of a larger type enum.

- **`appointment.paymentType`** and **`consultationData.paymentType`**
   - Primary Value: `{FULL}`
- **`expertWeek.type`**
   - Value: `{TREATMENT}` (conceptually related to `appointment.type`).
- **`treatment.type`**
   - Value: `{PSYCH}`.

### Logical Overlaps (Different Naming)
- **`jobId.defaultConsultation`** vs **`consultation.type`**
   - Values like `STANDARD`, `DOCUMENT`, `EXTERNAL`, and `INCARCERATION` appear in both, where `jobId` defines the *default* and `consultation` defines the *actual* type.
- **`userProfile.salutation`** vs **`userProfile.gender`**
   - Both use `{MALE, FEMALE}`, which is a direct overlap in value sets.

---
## Entity: Sprechstundenplan (Appointment Plan)
The appointment plan defines the schedule for consultation hours, including services, recurrence rules, assigned experts, locations, and customers.

### Table: appointmentPlan
| Column | Type | Field Type | Description (from all-together.md) |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `name` | `String` | schema | Ein Name für den Plan (Freitext) |
| `job` | `Document` | snapshot | Eine Dienstleistung (denormalized snapshot of [`jobId`](#entity-dienstleistung-service)) ([PlanJob](#sub-entity-planjob)) |
| `day` | `String` | schema | Einen Wochentag:<br>• `MO` (Used)<br>• `TU` (Used)<br>• `WE` (Used)<br>• `TH` (Used)<br>• `FR` (Used) |
| `startDate` | `Date` | schema | Ein Startdatum |
| `endDate` | `Date` | schema | Einen Enddatum |
| `lastDate` | `Date` | schema | Ein Datum der letzten Wiederholung |
| `count` | `Number` | schema | Einer Anzahl von Wiederholungen |
| `scheduling` | `String` | schema | Die Eigenschaft der Wiederholung:<br>• `WEEKLY`: Wöchentlich (Used)<br>• `XOFMONTH`: jeder x-te Tag im Monat (Used)<br>• `FIRST_DAY_MONTH`: Erster Tag im Monats (Not used)<br>• `DAY_MONTH`: Tag im Monat (Not used)<br>• `LAST_DAY_MONTH`: Letzter Tag im Monat (Not used) |
| `schedulingMulitplier` | `Number` | schema | Multiplikator für die Wiederholung |
| `timeStart` | `Number` | schema | Einer Startuhrzeit (Format: HHmm, z.B. 930 für 09:30) |
| `timeEnd` | `Number` | schema | Eine Enduhrzeit (Format: HHmm, z.B. 1200 für 12:00) |
| `doctor` | `Document` | snapshot | Assigned expert (denormalized snapshot of [`user`](#entity-experte-expert)) ([PlanUser](#sub-entity-planuser)) |
| `location` | `Document` | snapshot | Assigned location (denormalized snapshot of [`location`](#entity-standorte-locations)) ([PlanLocation](#sub-entity-planlocation)) |
| `comment` | `String` | schema | Einem Kommentar (Freitext) |
| `expertOnly` | `Boolean` | schema | Indicates if only the assigned expert can provide the service |
| `dateCreated` | `Date` | schema | Creation date |
| `createdBy` | `Document/DBRef` | snapshot | Creator (denormalized snapshot of [`user`](#entity-experte-expert)) ([PlanUser](#sub-entity-planuser)) |
| `dateChanged` | `Date` | schema | Date of last change |
| `changedBy` | `Document/DBRef` | snapshot | Changed by (denormalized snapshot of [`user`](#entity-experte-expert)) ([PlanUser](#sub-entity-planuser)) |
| `_class` | `String` | schema | Java class name: `de.videoclinic.model.AppointmentPlan` (Used) |

The `appointmentPlan` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (via `planId`)
- [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue) (via `type`)

### Functionality Details
- **Recurrence rules:** The `scheduling` field maps to "Wöchentlich", "Erster Tag im Monats", "jeder x-te Tag im Monat", "Tag im Monat", "Letzter Tag im Monat" (Only `WEEKLY` and `XOFMONTH` currently in use).
- **Time Format:** `timeStart` and `timeEnd` use a numeric representation of time (e.g., 900 = 09:00, 1500 = 15:00).
- **Expert restriction:** `expertOnly` (Boolean) indicates if only the assigned expert can perform the service.

### Sub-entities for appointmentPlan

The following structures are used as nested documents within the `appointmentPlan` collection. These are denormalized snapshots (copies) of selected fields from other collections, used to ensure historical consistency and performance.

#### Sub-entity: PlanJob
A denormalized snapshot of the associated [`jobId`](#entity-dienstleistung-service) entity.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | ID of the job |
| `code` | `String` | schema | Short code (Systematische Kodierung) |
| `color` | `String` | schema | HEX color code |
| `expertTitle` | `String` | schema | Title for experts (Freitext) |
| `remoteCode` | `String` | schema | External code (Systematische Kodierung) |
| `title` | `String` | schema | Service title (Freitext) |
| `type` | `String` | schema | Job type: `APPOINTMENT` (Used) |

The `PlanJob` sub-entity is used within:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)

#### Sub-entity: PlanUser
A denormalized snapshot of the associated [`user`](#entity-experte-expert) entity.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | User ID |
| `name` | `String` | schema | Full name (Freitext) |
| `email` | `String` | schema | Email address (Freitext) |
| `formalDisplayName` | `String` | schema | Formal display name (Freitext) |

The `PlanUser` sub-entity is used within:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)

#### Sub-entity: PlanLocation
A denormalized snapshot of the associated [`location`](#entity-standorte-locations) entity.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Location ID (referenced from [`location`](#entity-standorte-locations)) |
| `name` | `String` | schema | Location name (copied from [`location`](#entity-standorte-locations) for consistency) |
| `booknumberMask` | `String` | schema | Mask for booking numbers (Strukturierter Text) |
| `patientDataType` | `String` | schema | Data type: `EXTERNAL`, `EXTERNAL_BASISWEB`, `INTERNAL`, `INTERNAL_SECUREBOX`, `INTERNAL_VCCLOUD` (Used) ([Location.patientDataType](#entity-standorte-locations)) |
| `customer` | `Document` | snapshot | Denormalized snapshot of the assigned customer ([PlanCustomer](#sub-entity-plancustomer)) |

The `PlanLocation` sub-entity is used within:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)

#### Sub-entity: PlanCustomer
A denormalized snapshot of the associated [`customer`](#entity-kunden-customers) entity.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Customer ID (referenced from [`customer`](#entity-kunden-customers)) |
| `name` | `String` | schema | Customer name (copied from [`customer`](#entity-kunden-customers) for consistency) |

The `PlanCustomer` sub-entity is used within:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan) (nested in `location`)

## Entity: Experten-Wochenplan (Expert Week)
Standardisierte wöchentliche Verfügbarkeitsslots für Experten.

### Table: expertWeek
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `userId` | `Long` | schema | Reference to [user](#entity-experte-expert) |
| `type` | `String` | schema | Typ des Wochenplans:<br>• `TREATMENT` (Used) |
| `slotsMo` | `Array` | schema | Zeit-Slots für Montag (Werte: 1-24, entsprechend der Tagesstunde) |
| `slotsTu` | `Array` | schema | Zeit-Slots für Dienstag (Werte: 1-24) |
| `slotsWe` | `Array` | schema | Zeit-Slots für Mittwoch (Werte: 1-24) |
| `slotsTh` | `Array` | schema | Zeit-Slots für Donnerstag (Werte: 1-24) |
| `slotsFr` | `Array` | schema | Zeit-Slots für Freitag (Werte: 1-24) |
| `slotsSa` | `Array` | schema | Zeit-Slots für Samstag (Werte: 1-24) |
| `slotsSu` | `Array` | schema | Time slots for Sunday (values: 1-24) |
| `dateChanged` | `Date` | schema | Zeitpunkt der letzten Änderung |
| `changedBy` | `DBRef` | schema | Last change by (Reference to [user](#entity-experte-expert)) |
| `dateCreated` | `Date` | schema | Erstellungszeitpunkt |
| `createdBy` | `DBRef` | schema | Erstellt von (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.ExpertWeek` (Used) |

The `expertWeek` entity defines standard schedules for:
- [`user`](#entity-experte-expert) (referenced via `userId`)

## Entity: Jahreskalender eines Experten (Expert Days)
Detailed availability calendar for experts, tracking shifts and appointment availability per day.

### Table: expertDays
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `userId` | `Long` | schema | Reference to [user](#entity-experte-expert) |
| `month` | `Number` | schema | Monat (Format: YYYYMM) |
| `maxWeekDayMorning` | `Number` | schema | Maximale Vormittagsschichten (Wochentag) |
| `maxWeekDayAfternoon` | `Number` | schema | Maximale Nachmittagsschichten (Wochentag) |
| `maxWeekDayNight` | `Number` | schema | Maximale Nachtschichten (Wochentag) |
| `maxWeekEndMorning` | `Number` | schema | Maximale Vormittagsschichten (Wochenende) |
| `maxWeekEndAfternoon` | `Number` | schema | Maximale Nachmittagsschichten (Wochenende) |
| `maxWeekEndNight` | `Number` | schema | Maximale Nachtschichten (Wochenende) |
| `maxWeekDayAppointmentMorning` | `Number` | schema | Maximale Vormittagssprechstunden |
| `maxWeekDayAppointmentAfternoon` | `Number` | schema | Maximale Nachmittagssprechstunden |
| `morningNo` | `Array` | schema | Days with explicit "No" for morning availability |
| `afternoonNo` | `Array` | schema | Tage mit explizitem "Nein" für Nachmittagsbereitschaft |
| `nightNo` | `Array` | schema | Tage mit explizitem "Nein" für Nachtbereitschaft |
| `morningYes` | `Array` | schema | Tage mit explizitem "Ja" für Vormittagsbereitschaft |
| `afternoonYes` | `Array` | schema | Tage mit explizitem "Ja" für Nachmittagsbereitschaft |
| `nightYes` | `Array` | schema | Tage mit explizitem "Ja" für Nachtbereitschaft |
| `morningAppointmentNo` | `Array` | schema | Tage mit explizitem "Nein" für Vormittagssprechstunde |
| `afternoonAppointmentNo` | `Array` | schema | Tage mit explizitem "Nein" für Nachmittagssprechstunde |
| `treatmentAppointmentNo` | `Array` | schema | Tage mit explizitem "Nein" für Therapiesprechstunde |
| `morningAppointmentYes` | `Array` | schema | Tage mit explizitem "Ja" für Vormittagssprechstunde |
| `afternoonAppointmentYes` | `Array` | schema | Tage mit explizitem "Ja" für Nachmittagssprechstunde |
| `treatmentAppointmentYes` | `Array` | schema | Days with explicit "Yes" for therapy appointment |
| `dateChanged` | `Date` | schema | Time of last change |
| `changedBy` | `DBRef` | schema | Last change by (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | Java class name: `de.videoclinic.model.ExpertDays` (Used) |

The `expertDays` entity defines availability for:
- [`user`](#entity-experte-expert) (referenced via `userId`)

## Entity: Termine (Appointments)
Verwaltung von Einzelterminen, Bereitschaften und Behandlungen.

### Table: appointment
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `start` | `Date` | schema | Startzeitpunkt |
| `until` | `Date` | schema | Endzeitpunkt |
| `adjustedStart` | `Date` | schema | Angepasster Startzeitpunkt |
| `adjustedUntil` | `Date` | schema | Angepasster Endzeitpunkt |
| `actualStart` | `Date` | schema | Tatsächlicher Startzeitpunkt |
| `actualUntil` | `Date` | schema | Tatsächlicher Endzeitpunkt |
| `loggedStart` | `Date` | schema | Protokollierter Startzeitpunkt |
| `loggedUntil` | `Date` | schema | Protokollierter Endzeitpunkt |
| `verifiedStart` | `Date` | schema | Verifizierter Startzeitpunkt |
| `verifiedUntil` | `Date` | schema | Verifizierter Endzeitpunkt |
| `billStart` | `Date` | schema | Abrechnungs-Startzeitpunkt |
| `billUntil` | `Date` | schema | Abrechnungs-Endzeitpunkt |
| `dateStarted` | `Date` | schema | Startdatum des Termins |
| `dateDone` | `Date` | schema | Abschlussdatum des Termins |
| `dateStorno` | `Date` | schema | Stornierungsdatum |
| `firstContact` | `Date` | schema | Erster Kontaktzeitpunkt |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `dateChanged` | `Date` | schema | Letztes Änderungsdatum |
| `title` | `String` | schema | Titel |
| `comment` | `String` | schema | Kommentar |
| `state` | `String` | schema | Status:<br>• `ACTIVE` (Used)<br>• `CANCELED` (Used)<br>• `CLOSED` (Used)<br>• `DONE` (Used)<br>• `LOCKEDIN` (Used)<br>• `READY` (Used)<br>• `REQUESTED` (Used)<br>• `RESCHEDULED` (Used)<br>• `STARTED` (Used)<br>• `STORNO` (Used) |
| `type` | `String` | schema | Typ:<br>• `APPOINTMENT` (Used)<br>• `SHIFT` (Used)<br>• `TREATMENT` (Used)<br>• `TREATMENT_REPORT` (Used) |
| `job` | `Document` | snapshot | Erbrachte Dienstleistung (denormalized snapshot of [`jobId`](#entity-dienstleistung-service)) ([ConsultationJob](#sub-entity-consultationjob)) |
| `billingType` | `String` | schema | Abrechnungsart:<br>• `HOURLY` (Used)<br>• `PER_CONSULTATION` (Used) |
| `paymentType` | `String` | schema | Zahlungsart:<br>• `EK` (Used)<br>• `FULL` (Used)<br>• `VK` (Used)<br>• `IGNORE` (Used) |
| `priceType` | `String` | schema | Preistyp:<br>• `WEEKDAY` (Used)<br>• `WEEKNIGHT` (Used)<br>• `WEEKENDDAY` (Used)<br>• `WEEKENDNIGHT` (Used) |
| `customer` | `Document` | snapshot | Zugehöriger Kunde (denormalized snapshot of [`customer`](#entity-kunden-customers)) ([ConsultationCustomer](#sub-entity-consultationcustomer)) |
| `location` | `Document` | snapshot | Ort des Termins (denormalized snapshot of [`location`](#entity-standorte-locations)) ([ConsultationLocation](#sub-entity-consultationlocation)) |
| `treatmentId` | `Long` | schema | Reference to [treatment](#entity-behandlungsverlauf-treatment) |
| `minPatients` | `Number` | schema | Mindestanzahl Patienten |
| `actualPatients` | `Number` | schema | Anzahl tatsächlicher Patienten |
| `billablePatients` | `Number` | schema | Anzahl abrechenbarer Patienten |
| `payablePatients` | `Number` | schema | Anzahl zahlungspflichtiger Patienten |
| `billableBaseTime` | `Long` | schema | Abrechenbare Basiszeit (ms) |
| `workTimePlanned` | `Long` | schema | Geplante Arbeitszeit (ms) |
| `workTimeActual` | `Long` | schema | Tatsächliche Arbeitszeit (ms) |
| `workTimeIs` | `Long` | schema | Differenz Arbeitszeit (ms) |
| `requiredStaffCount` | `Number` | schema | Benötigte Personalanzahl |
| `addedStaffCount` | `Number` | schema | Hinzugefügte Personalanzahl |
| `backlogCount` | `Number` | schema | Backlog-Anzahl |
| `adjustedStaffCount` | `Number` | schema | Angepasste Personalanzahl |
| `assignedStaffCount` | `Number` | schema | Zugewiesene Personalanzahl |
| `reservedStaffCount` | `Number` | schema | Reservierte Personalanzahl |
| `missing` | `Long` | schema | Fehlend (ms) |
| `finished` | `Boolean` | schema | Abgeschlossen |
| `countFurtherFollowUp` | `Number` | schema | Anzahl Folgeuntersuchungen |
| `countFurtherIfRequired` | `Number` | schema | Anzahl bei Bedarf |
| `countFurtherReferral` | `Number` | schema | Anzahl Überweisungen |
| `countFurtherReferralOther` | `Number` | schema | Anzahl sonstige Überweisungen |
| `period` | `Number` | schema | Abrechnungszeitraum (YYYYMM) |
| `changedById` | `Long` | schema | Reference ID to [user](#entity-experte-expert) (last change) |
| `createdById` | `Long` | schema | Reference ID to [user](#entity-experte-expert) (creation) |
| `stornoById` | `Long` | schema | Reference ID to [user](#entity-experte-expert) (cancellation) |
| `planId` | `Long` | schema | Reference ID to [appointmentPlan](#entity-sprechstundenplan-appointment-plan) |
| `shiftPlanId` | `Long` | schema | Reference ID to [shiftPlan](#entity-schichtplan-shift-plan) |
| `expertOnly` | `Boolean` | schema | Nur Experte |
| `jobSupport` | `Boolean` | schema | Job Support |
| `treatmentRequireReport` | `Boolean` | schema | Bericht erforderlich (Treatment) |
| `assignedDisplayName` | `String` | schema | Angezeigter Name des zugewiesenen Experten |
| `expertAppointment` | `Document` | schema | Experten-Termin Snapshot |
| `unmatchedShiftCalls` | `Number` | schema | Nicht zugeordnete Schichtanrufe |
| `unmatchedConsultationsCalls` | `Number` | schema | Nicht zugeordnete Konsultationsanrufe |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Appointment` (Used) |

The `appointment` entity is referenced by:
- [`appointmentAssignment`](#entity-terminzuweisungen-appointment-assignments)
- [`basisWebData`](#entity-jva-patientendaten-basis-web-data)
- [`cDRCallAssignment`](#entity-cdr-call-zuweisungen-cdr-call-assignment)
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (via `appointmentId`)
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`log`](#entity-system-logs-logs)
- [`patientData`](#entity-patientenerg-nzungsdaten-patient-data)
- [`questionaire`](#entity-qualit-tsumfragen-questionaires)
- [`treatment`](#entity-behandlungsverlauf-treatment) (in `positions`)

## Entity: Terminzuweisungen (Appointment Assignments)
Zuweisung von Experten zu bestimmten Terminen mit Statusverfolgung.

### Table: appointmentAssignment
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `userId` | `Long` | schema | Reference to [user](#entity-experte-expert) |
| `assignedById` | `Long` | schema | Zugewiesen durch (Reference to [user](#entity-experte-expert)) |
| `appointmentId` | `Long` | schema | Reference to [appointment](#entity-termine-appointments) |
| `period` | `number` | inferred | Abrechnungszeitraum (YYYYMM) |
| `control` | `boolean` | inferred | Kontrollstatus |
| `force` | `boolean` | inferred | Erzwingen |
| `appointmentDay` | `Date` | inferred | Tag des Termins |
| `paused` | `Long` | inferred | Pausiert (ms) |
| `state` | `String` | schema | Status der Zuweisung |
| `dateAssigned` | `Date` | schema | Zuweisungsdatum |
| `dateCreated` | `Date` | inferred | Erstellungsdatum |
| `dateChanged` | `Date` | inferred | Änderungsdatum |
| `changedById` | `Long` | inferred | Zuletzt geändert von (Reference to [user](#entity-experte-expert)) |
| `dateReminder` | `Date` | schema | Erinnerungsdatum |
| `dateSelfAdded` | `Date` | inferred | Datum der Selbsteintragung |
| `support` | `boolean` | inferred | Support-Status |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.AppointmentAssignment` (Used) |

The `appointmentAssignment` entity is referenced by:
- [`appointmentAssignmentHistory`](#entity-terminzuweisungs-historie-appointment-assignment-history)

### Sub-entities for appointmentAssignment

#### Sub-entity: AppointmentAssignmentHistory
Audit-Trail für Änderungen an einer Terminzuweisung.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `assignmentId` | `Long` | schema | Reference to [appointmentAssignment](#entity-terminzuweisungen-appointment-assignments) |
| `state` | `String` | schema | Neuer Status |
| `dateCreated` | `Date` | schema | Zeitpunkt der Änderung |
| `message` | `String` | schema | Systemnachricht oder Kommentar |

The `AppointmentAssignmentHistory` sub-entity is used within:
- [`appointmentAssignment`](#entity-terminzuweisungen-appointment-assignments) (conceptually, though also a separate collection `appointmentAssignmentHistory`)

## Entity: Terminzuweisungs-Historie (Appointment Assignment History)
Detaillierte Historie aller Zuweisungsänderungen.

### Table: appointmentAssignmentHistory
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `assignmentId` | `Long` | schema | Reference to [appointmentAssignment](#entity-terminzuweisungen-appointment-assignments) |
| `dateCreated` | `Date` | schema | Zeitpunkt der Änderung |
| `state` | `String` | schema | Neuer Status |
| `target` | `Document` | schema | Ziel des Ereignisses (Snapshot von [user](#entity-experte-expert)) |
| `subject` | `String` | schema | Betreff |
| `message` | `String` | schema | Nachricht oder Kommentar |
| `relevantDate` | `Date` | inferred | Relevantes Datum für das Ereignis |
| `notificationId` | `Long` | inferred | Reference to [notification](#entity-benachrichtigungen-notifications) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.AppointmentAssignmentHistory` (Used) |

The `appointmentAssignmentHistory` entity provides an audit trail for:
- [`appointmentAssignment`](#entity-terminzuweisungen-appointment-assignments)

## Entity: Schichtplan (Shift Plan)
Planungsvorgaben für wiederkehrende Bereitschaftsdienste.

### Table: shiftPlan
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Name des Schichtplans |
| `day` | `String` | schema | Wochentag:<br>• `MO` (Used)<br>• `TU` (Used)<br>• `WE` (Used)<br>• `TH` (Used)<br>• `FR` (Used)<br>• `SA` (Used)<br>• `SU` (Used) |
| `scheduling` | `String` | schema | Wiederholungsregel:<br>• `WEEKLY` (Used) |
| `schedulingMulitplier` | `Number` | schema | Multiplikator für Planung (z.B. alle X Wochen) |
| `timeStart` | `Number` | schema | Startuhrzeit (Format: HHmm) |
| `timeEnd` | `Number` | schema | Enduhrzeit (Format: HHmm) |
| `job` | `Document` | snapshot | Dienstleistung (denormalized snapshot of [`jobId`](#entity-dienstleistung-service)) ([ConsultationJob](#sub-entity-consultationjob)) |
| `minPatients` | `Number` | schema | Mindestanzahl an Patienten |
| `count` | `Number` | inferred | Anzahl |
| `lastDate` | `Date` | schema | Letztes geplantes Datum |
| `priceType` | `String` | schema | Abrechnungstyp:<br>• `WEEKDAY` (Used)<br>• `WEEKNIGHT` (Used)<br>• `WEEKENDDAY` (Used)<br>• `WEEKENDNIGHT` (Used) |
| `dateChanged` | `Date` | schema | Zeitpunkt der letzten Änderung |
| `changedBy` | `Document` | snapshot | Letzte Änderung durch (denormalized snapshot of [`user`](#entity-experte-expert)) ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `dateCreated` | `Date` | schema | Erstellungszeitpunkt |
| `createdBy` | `Document` | snapshot | Erstellt von (denormalized snapshot of [`user`](#entity-experte-expert)) ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `comment` | `String` | schema | Kommentar (Freitext) |
| `prefered` | `Array` | inferred | Liste bevorzugter Ärzte (DBRefs) |
| `_class` | `String` | schema | Java-Klassenname: `de.videoclinic.model.ShiftPlan` (Used) |

The `shiftPlan` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (via `shiftPlanId`)
- [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue) (via `type`)

## Entity: Abwesenheiten/Urlaub (Holidays)
Manuell eingetragene Abwesenheiten oder Urlaubszeiten von Experten.

### Table: holiday
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `start` | `Date` | schema | Beginn der Abwesenheit |
| `until` | `Date` | schema | Ende der Abwesenheit |
| `title` | `String` | inferred | Grund/Bezeichnung |
| `approved` | `Boolean` | inferred | Genehmigungsstatus |
| `minutes` | `Number` | inferred | Dauer in Minuten |
| `dateApproved` | `Date` | inferred | Genehmigungsdatum |
| `approvalComment` | `String` | inferred | Genehmigungskommentar |
| `approvedBy` | `DBRef` | inferred | Genehmigt von (Reference to [user](#entity-experte-expert)) |
| `owner` | `DBRef` | schema | Abwesenheit für (Reference to [user](#entity-experte-expert)) |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `dateChanged` | `Date` | schema | Änderungsdatum |
| `createdBy` | `DBRef` | schema | Erstellt von (Reference to [user](#entity-experte-expert)) |
| `changedBy` | `DBRef` | schema | Geändert von (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Holiday` (Used) |

The `holiday` entity is used by:
- (Planning tools to show expert unavailability)

## Entity: Räume (Rooms)
Definition von physischen Räumen an den Standorten.

### Table: room
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `location` | `DBRef` | schema | Reference to [location](#entity-standorte-locations) |
| `name` | `String` | inferred | Raumname |
| `number` | `String` | inferred | Raumnummer |
| `available` | `Boolean` | schema | Verfügbarkeit |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Room` (Used) |

The `room` entity references:
- [`location`](#entity-standorte-locations)

## Entity: Fähigkeiten (Skills)
Defines the qualifications required by experts.

### Table: skill
| Column | Type | Field Type | Description (from all-together.md) |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner (MANDATORY) |
| `version` | `Long` | schema | Versionsnummer |
| `code` | `String` | schema | Eine Bezeichnung der Fähigkeit |
| `description` | `String` | schema | Eine Beschreibung |
| `type` | `String` | schema | Art der Fähigkeit:<br>• `ADDITIONAL` (Used)<br>• `EXTRA` (Used)<br>• `LANGUAGE` (Used)<br>• `MAIN` (Used) |
| `active` | `Boolean` | schema | Ob die Fähigkeit aktiv oder deaktiviert ist |
| `certified` | `Boolean` | schema | Ob für die Fähigkeit ein Zertifikat benötigt wird |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Skill` (Used) |

The `skill` entity is referenced by:
- [`user`](#entity-experte-expert) (via [`SkillAssignment`](#sub-entity-skillassignment))
- [`jobId`](#entity-dienstleistung-service) (via [`SkillRule`](#sub-entity-skillrule))

### Functionality Details
- **Skill Types:** Classified into `Fachrichtung` (MAIN), `Zusatzausbildung` (EXTRA), `Fort- und Weiterbildung` (ADDITIONAL), and `Sprache` (LANGUAGE).
- **Status:** Skills can be active or deactivated.
- **Certification:** Some skills require a certificate, which is then tracked in the expert's profile.

## Entity: Experte (Expert)
Personal and professional data for medical experts.

### Table: user
| Column | Type | Field Type | Description (from all-together.md) |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `username` | `String` | schema | Benutzername für den Login |
| `email` | `String` | schema | Primäre E-Mail-Adresse |
| `password` | `String` | schema | Persönliches Passwort |
| `enabled` | `Boolean` | schema | Ob das Konto aktiv oder deaktiviert ist |
| `accountLocked` | `Boolean` | schema | Ob das Konto gesperrt ist |
| `accountExpired` | `Boolean` | schema | Ob das Konto abgelaufen ist |
| `credentialsExpired` | `Boolean` | schema | Ob die Anmeldedaten abgelaufen sind |
| `deleted` | `Boolean` | schema | Ob der Benutzer gelöscht wurde |
| `external` | `Boolean` | schema | Ob es ein externer Benutzer ist |
| `role` | `String` | schema | Rolle des Benutzers:<br>• `ADMIN`<br>• `ADMIN_INTERN`<br>• `ADMIN_KUNDE`<br>• `KUNDE`<br>• `LEITER_INTERN`<br>• `REGISTERED`<br>• `STANDARD` |
| `employeeState` | `String` | schema | Status des Kontos:<br>• `ACTIVE`<br>• `CUSTOMER`<br>• `INACTIVE`<br>• `UNCONFIRMED` |
| `userProfile` | `Document` | schema | Persönliches Profil des Benutzers ([UserProfile](#sub-entity-userprofile)) |
| `employeeProfile` | `Document` | schema | Berufliches Profil des Experten ([EmployeeProfile](#sub-entity-employeeprofile)) |
| `employerProfile` | `Document` | schema | Profil des Arbeitgebers/Abrechnungsdaten ([EmployerProfile](#sub-entity-employerprofile)) |
| `nextBirthday` | `Date` | schema | Nächster Geburtstag |
| `totpDevice` | `Document` | schema | TOTP-Gerät Information ([TotpDevice](#sub-entity-totpdevice)) |
| `requireTotp` | `Boolean` | schema | Ob TOTP erforderlich ist |
| `totpActivity` | `Document` | schema | Letzte TOTP-Aktivität ([TotpActivity](#sub-entity-totpactivity)) |
| `countInvalidLogin` | `Number` | schema | Anzahl ungültiger Logins |
| `dateLocked` | `Date` | schema | Sperrdatum des Kontos |
| `lastIP` | `String` | schema | Letzte IP-Adresse |
| `countLogin` | `Number` | schema | Gesamtanzahl Logins |
| `lastLogin` | `Date` | schema | Letzter Login-Zeitpunkt |
| `settings` | `Document` | schema | Benutzereinstellungen |
| `ip` | `String` | schema | Aktuelle IP-Adresse |
| `invalidLogins` | `Array` | schema | Liste ungültiger Logins ([LoginEvent](#sub-entity-loginevent)) |
| `groups` | `Array` | schema | Liste zugeordneter Gruppen (DBRefs to [group](#entity-benutzergruppen-groups)) |
| `consecutiveFailedLoginAttempts` | `Number` | schema | Aufeinanderfolgende fehlgeschlagene Logins |
| `successfulLogins` | `Array` | schema | Liste erfolgreicher Logins ([LoginEvent](#sub-entity-loginevent)) |
| `dateAcceptedLoginNotification` | `Date` | schema | Akzeptanzdatum der Login-Benachrichtigung |
| `resetDate` | `Date` | schema | Datum des Passwort-Resets |
| `resetIp` | `String` | schema | IP des Passwort-Resets |
| `resetKey` | `String` | schema | Schlüssel für Passwort-Reset |
| `dateChanged` | `Date` | schema | Änderungsdatum |
| `changedBy` | `Document` | schema | Zuletzt geändert von ([PlanUser](#sub-entity-planuser)) |
| `lastReminder` | `Date` | schema | Letzte Erinnerung |
| `emailVerified` | `String` | schema | Status der E-Mail-Verifizierung |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `createdBy` | `Document` | schema | Erstellt von ([PlanUser](#sub-entity-planuser)) |
| `onBoardingPercentComplete` | `Number` | inferred | Onboarding Fortschritt (%) |
| `stepsTotal` | `Number` | inferred | Gesamtanzahl Onboarding-Schritte |
| `stepsCompleted` | `Number` | inferred | Abgeschlossene Onboarding-Schritte |
| `customers` | `Array` | schema | Zugeordnete Kunden (DBRefs to [customer](#entity-kunden-customers)) |
| `lang` | `String` | schema | Spracheinstellung (z.B. `de`) |
| `verifikationKey` | `String` | schema | Verifizierungsschlüssel |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.User` (Used) |

The `user` entity is referenced by:
- [`appointmentAssignment`](#entity-terminzuweisungen-appointment-assignments)
- [`appointmentAssignmentHistory`](#entity-terminzuweisungs-historie-appointment-assignment-history)
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan) (as `doctor`, `createdBy`, `changedBy`)
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `signedOffBy`, `doctor`, `changedBy`, `createdBy`)
- [`expertDays`](#entity-jahreskalender-eines-experten-expert-days)
- [`expertWeek`](#entity-experten-wochenplan-expert-week)
- [`holiday`](#entity-abwesenheiten-urlaub-holidays)
- [`invoice`](#entity-rechnungen-invoices) (as `createdBy`, `changedBy`)
- [`log`](#entity-system-logs-logs)
- [`notification`](#entity-benachrichtigungen-notifications)
- [`patient`](#entity-patienten-patients) (as `createdBy`, `changedBy`)
- [`userFile`](#entity-benutzerdateien-user-files)
- [`userVideoHistory`](#entity-video-verlauf-user-video-history)
- [`persistentSession`](#entity-benutzersitzungen-persistent-sessions)
- [`onboardingHistory`](#entity-onboarding-verlauf-onboarding-history) (as `changedBy`)
- [`onboardingStep`](#entity-onboarding-schritte-onboarding-steps) (as `createdBy`, `changedBy`)
- [`notificationTemplate`](#entity-benachrichtigungsvorlagen-notification-templates) (as `changedBy`)
- [`cDRCall`](#entity-anrufliste-cdr-calls) (as `ownerId`, `assignedById`)
- [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly) (as `userId`)
- [`closedMonth`](#entity-abgeschlossene-zeitr-ume-closed-months) (as `closedBy`)

### Functionality Details
- **Availability:** Managed via `expertDays` collection (mapped from "Jahreskalender eines Experten").
- **Account Status:** `employeeState` includes `ACTIVE`, `CUSTOMER`, `INACTIVE`, `UNCONFIRMED`.
- **Focus and Hingabe:** Focus levels for `shift`, `appointment`, and `therapy` are stored in `employeeProfile`.
- **Certifications:** Documents for skills are stored in `employeeProfile.skills[].certification`.

### Sub-entities for user

The following structures are used as nested documents within the `user` collection.

#### Sub-entity: UserProfile
Contains personal information and general settings for the user.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier (often UUID if present, otherwise nested) |
| `firstName` | `String` | schema | Vorname |
| `lastName` | `String` | schema | Nachname |
| `displayName` | `String` | inferred | Vollständiger Name für die Anzeige |
| `title` | `String` | inferred | Akademischer Titel |
| `salutation` | `String` | inferred | Anrede:<br>• `MALE`<br>• `FEMALE` |
| `gender` | `String` | schema | Geschlecht:<br>• `MALE` (Used)<br>• `FEMALE` (Used) |
| `birthday` | `Date` | schema | Geburtsdatum |
| `mainAddress` | `Document` | inferred | Hauptadresse ([Address](#sub-entity-address)) |
| `cellularNumber` | `String` | inferred | Mobilfunknummer |
| `shiftPhoneNumber` | `String` | inferred | Bereitschaftsnummer |
| `notificationPerMail` | `Boolean` | inferred | Benachrichtigung per E-Mail |
| `exludedNotifications` | `Array` | inferred | Ausgeschlossene Benachrichtigungen (Strings) |
| `photo` | `Document` | inferred | Profilfoto ([UserFileMetadata](#sub-entity-userfilemetadata)) |
| `homePhone` | `String` | inferred | Privatnummer |
| `faxNumber` | `String` | inferred | Faxnummer |
| `workPhone` | `String` | inferred | Dienstnummer |
| `userId` | `Long` | inferred | Reference to [user](#entity-experte-expert) |

The `UserProfile` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `userProfile` field)

#### Sub-entity: Address
A reusable structure for postal addresses.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Internal identifier |
| `name` | `String` | schema | Name des Empfängers |
| `address` | `String` | schema | Straße und Hausnummer |
| `address2` | `String` | schema | Adresszusatz |
| `zip` | `String` | schema | Postleitzahl |
| `city` | `String` | schema | Ort |
| `state` | `String` | schema | Bundesland |
| `country` | `String` | schema | Land |
| `type` | `String` | schema | Art der Adresse:<br>• `PRIVATE` (Used)<br>• `WORK` (Used)<br>• `PRAXIS` (Used)<br>• `OTHER` (Used) |

The `Address` sub-entity is used within:
- [`UserProfile`](#sub-entity-userprofile) (as `mainAddress` field)
- [`EmployerProfile`](#sub-entity-employerprofile) (as `billingAddress` field)
- [`customer`](#entity-kunden-customers) (as `mainAddress` field)

#### Sub-entity: EmployeeProfile
Contains professional qualifications and payment details for the expert.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `email2` | `String` | schema | Sekundäre E-Mail-Adresse |
| `activeSince` | `Date` | schema | Ab wann der Experte als Arzt tätig ist |
| `bank` | `String` | schema | Kreditinstitut |
| `iban` | `String` | schema | IBAN |
| `bic` | `String` | schema | BIC |
| `taxid` | `String` | schema | Steuer-ID |
| `uid` | `String` | schema | Umsatzsteuernummer |
| `mailInvoice` | `Boolean` | schema | E-Mail-Rechnung senden |
| `postInvoice` | `Boolean` | schema | Post-Rechnung senden |
| `shift` | `String` | schema | Bereitschaftsdienst Fokus (`NONE`, `LOW`, `MEDIUM`, `HIGH`) |
| `appointment` | `String` | schema | Sprechstunde Fokus (`NONE`, `LOW`, `MEDIUM`, `HIGH`) |
| `therapy` | `String` | schema | Therapie Fokus (`NONE`, `LOW`, `MEDIUM`, `HIGH`) |
| `skills` | `Array` | schema | Liste der erlangten Fähigkeiten ([EmployeeSkillAssignment](#sub-entity-employeeskillassignment)) |
| `exclusionCriteria` | `Array` | inferred | Ausschlusskriterien |
| `imageSignature` | `Document` | schema | Bild mit der Unterschrift ([UserFileMetadata](#sub-entity-userfilemetadata)) |
| `bayernBoxAccess` | `Document` | schema | Zugangsdaten SecureBox ([BayernBoxAccess](#sub-entity-bayernboxaccess)) |
| `categoriesWatched` | `Array` | inferred | Gesehene Video-Kategorien ([WatchedCategory](#sub-entity-watchedcategory)) |
| `email2` | `String` | inferred | Sekundäre E-Mail-Adresse |
| `activeSince` | `Date` | inferred | Aktiv seit |
| `bank` | `String` | inferred | Bankname |
| `iban` | `String` | inferred | IBAN |
| `bic` | `String` | inferred | BIC |
| `taxid` | `String` | inferred | Steuer-ID |
| `uid` | `String` | inferred | Umsatzsteuer-ID |
| `mailInvoice` | `Boolean` | inferred | Rechnung per Mail |
| `postInvoice` | `Boolean` | inferred | Rechnung per Post |

The `EmployeeProfile` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `employeeProfile` field)

#### Sub-entity: SkillAssignment
Maps a specific skill to the expert with certification details.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `skill` | `DBRef` | schema | Reference to [skill](#entity-fähigkeiten-skills) collection |
| `active` | `Boolean` | schema | Whether the skill is active for the expert |
| `dateCertification` | `Date` | schema | Date when the skill was obtained |
| `certification` | `Document` | schema | Zertifikatsdatei ([FileMetadata](#sub-entity-filemetadata)) |

The `SkillAssignment` sub-entity is used within:
- [`EmployeeProfile`](#sub-entity-employeeprofile) (as `skills` array)

#### Sub-entity: EmployerProfile
Contains contract details and billing information related to Videoclinic.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `konto` | `String` | schema | Debitorenkonto (GKTK) |
| `gkto` | `String` | schema | Debitorennummer (GKTO) |
| `efn` | `String` | inferred | Einheitliche Fortbildungsnummer (EFN) |
| `level` | `String` | schema | Qualifikationsniveau:<br>• `ONBOARDING` (Used)<br>• `BEGINNER` (Not used)<br>• `AMATEUR` (Not used)<br>• `PROFI` (Not used) |
| `activeSinceVC` | `Date` | schema | Ab wann for Videoclinic tätig |
| `activeUntilVC` | `Date` | schema | Bis wann for Videoclinic tätig |
| `products` | `Array` | schema | Liste abonnierter Waren ([SubscribedProduct](#sub-entity-subscribedproduct)) |
| `sipAccounts` | `Array` | inferred | Liste von SIP-Accounts ([SipAccount](#sub-entity-sipaccount)) |
| `employeeType` | `Array` | inferred | Beschäftigungsverhältnis ([EmployeeTypeEntry](#sub-entity-employeetypeentry)) |
| `currentIncome` | `Number` | inferred | Aktuelles Einkommen |
| `activeSince` | `Date` | inferred | Aktiv seit |
| `inctiveReason` | `String` | inferred | Grund für Inaktivität |
| `experienceAddictionMedicine` | `String` | inferred | Erfahrung in Suchtmedizin |

The `EmployerProfile` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `employerProfile` field)

#### Sub-entity: SubscribedProduct
A product or service the expert has subscribed to.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `product` | `DBRef` | schema | Reference to [product](#entity-waren-products) collection |
| `amount` | `Number` | schema | Quantity |
| `start` | `Date` | schema | Start date |
| `until` | `Date` | schema | Enddatum |
| `adjustedPrice` | `Number` | schema | Angebotspreis |
| `description` | `String` | schema | Beschreibung |
| `comment` | `String` | schema | Kommentar |

The `SubscribedProduct` sub-entity is used within:
- [`EmployerProfile`](#sub-entity-employerprofile) (as `products` array)

#### Sub-entity: TotpDevice
Information about the TOTP device used for multi-factor authentication.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `ip` | `String` | schema | IP address used during registration |
| `dateRegistered` | `Date` | schema | Date of registration |
| `secret` | `String` | schema | TOTP secret key |
| `activated` | `Date` | schema | Date of activation |

The `TotpDevice` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `totpDevice` field)

#### Sub-entity: TotpActivity
Records the last TOTP-related activity.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `dateAccess` | `Date` | schema | Date of last access |
| `ip` | `String` | schema | IP address of the access |
| `ua` | `String` | schema | User Agent of the access |
| `action` | `String` | schema | Performed action (e.g., `login`) |

The `TotpActivity` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `totpActivity` field)

#### Sub-entity: LoginEvent
Details of a login attempt (successful or unsuccessful).

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `ip` | `String` | schema | IP address of the attempt |
| `date` | `Date` | schema | Date of the latest attempt for this IP |
| `first` | `Date` | schema | Date of the first attempt for this IP |
| `ua` | `String` | inferred | User Agent (often present in successful logins) |
| `count` | `Number` | schema | Total count of attempts for this IP |

The `LoginEvent` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `invalidLogins` and `successfulLogins` arrays)


#### Sub-entity: FileMetadata
Metadata for uploaded files (signatures, certifications, etc.).

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Eindeutiger Dateiname/ID |
| `name` | `String` | Ursprünglicher Dateiname |
| `mime` | `String` | MIME-Typ |
| `size` | `Long` | Dateigröße in Bytes |
| `checksum` | `String` | Prüfsumme (SHA-256) |
| `type` | `String` | Dateityp:<br>• `cert` (Used)<br>• `sig` (Used)<br>• `usertn` (Used)<br>• `usertempupload` (Used) |
| `dateCreated` | `Date` | Erstellungsdatum |

The `FileMetadata` sub-entity is used within:
- [`EmployeeProfile`](#sub-entity-employeeprofile) (as `imageSignature`)
- [`SkillAssignment`](#sub-entity-skillassignment) (as `certification`)
- [`uploadFile`](#entity-dateiuploads-upload-files) (as `data`)
- [`video`](#entity-videos-videos) (as `file` and `preview`)
- [`exportTemplate`](#entity-export-vorlagen-export-templates) (as `template`)

## Entity: Benutzergruppen (Groups)
Zusammenfassung von Benutzern zu Gruppen mit gemeinsamen Rollen und Rechten.

### Table: group
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Gruppenname |
| `description` | `String` | inferred | Beschreibung (Freitext) |
| `role` | `String` | inferred | Hauptrolle der Gruppe |
| `rights` | `Array` | inferred | Liste zugeordneter Rechte |
| `_class` | `String` | schema | `de.videoclinic.model.Group` (Used) |

The `group` entity is referenced by:
- [`user`](#entity-experte-expert) (in `groups`)

## Entity: Zugriffsrechte (Access Rights)
Definition von spezifischen Berechtigungen innerhalb des Systems.

### Table: accessRight
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Name des Rechts |
| `description` | `String` | schema | Beschreibung (Freitext) |
| `role` | `String` | inferred | Zugeordnete Rolle |
| `_class` | `String` | schema | Java-Klassenname: `de.videoclinic.model.AccessRight` (Used) |

The `accessRight` entity is referenced by:
- [`group`](#entity-benutzergruppen-groups) (via `rights`)

## Entity: Benutzerdateien (User Files)
Dateien, die Benutzern zugeordnet sind (z.B. Zertifikate).

### Table: userFile
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `data` | `Document` | Metadaten der Datei ([FileMetadata](#sub-entity-filemetadata)) |
| `name` | `String` | Anzeigename |
| `type` | `String` | Dateityp:<br>• `APPROBIATION` (Used)<br>• `AUTHENTICATED_MEDICAL_SPECIALIST_CERTIFICATE` (Used)<br>• `BASIC_RULES_CONTRACT` (Used)<br>• `BAVARIA_LAWS_CONTRACT` (Used)<br>• `CONDUCT_CERTIFICATE` (Used)<br>• `CURRICULUM_VITAE` (Used)<br>• `DATA_PROTECTION_CONTRACT` (Used)<br>• `LOAN_AGREEMENT` (Used)<br>• `OTHER` (Used)<br>• `PROFESSIONAL_LIABILITY_INSURANCE` (Used)<br>• `PROOF_OF_EXPERTISE` (Used)<br>• `SERVICE_CONTRACT` (Used)<br>• `SOCIAL_SECURITY_CHECKLIST` (Used) |
| `ownerId` | `Long` | schema | Reference to [user](#entity-experte-expert) |
| `date` | `Date` | inferred | Datum |
| `active` | `Boolean` | inferred | Status |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.UserFile` (Used) |

The `userFile` entity references:
- [`user`](#entity-experte-expert) (via `ownerId`)

## Entity: Benutzersitzungen (Persistent Sessions)
Speichert Informationen über aktive und vergangene Benutzersitzungen im System.

### Table: persistentSession
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Session-ID |
| `version` | `Long` | schema | Versionsnummer |
| `user` | `DBRef` | schema | Reference to [user](#entity-experte-expert) |
| `created` | `Date` | schema | Erstellungszeitpunkt |
| `ip` | `String` | schema | IP-Adresse des Benutzers |
| `userAgent` | `String` | schema | Browser-Informationen (User Agent) |
| `authorities` | `Array` | inferred | Liste zugeordneter Berechtigungen ([UserAuthority](#sub-entity-userauthority)) |
| `loginUser` | `Long` | inferred | Reference to [user](#entity-experte-expert) |
| `lang` | `String` | inferred | Spracheinstellung (z.B. `de`) |
| `csfr` | `String` | inferred | CSRF-Token |
| `newSession` | `Boolean` | inferred | Ob es eine neue Sitzung ist |
| `type` | `String` | inferred | Sitzungstyp |
| `lastAccess` | `Date` | inferred | Letzter Zugriff |
| `role` | `String` | schema | Aktive Rolle in der Sitzung |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.PersistentSession` (Used) |

The `persistentSession` entity references:
- [`user`](#entity-experte-expert)

## Entity: Onboarding-Verlauf (Onboarding History)
Verlauf und Status der einzelnen Onboarding-Schritte eines Experten.

### Table: onboardingHistory
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `referenceId` | `Long` | schema | Reference (e.g. [user.id](#entity-experte-expert) or [location.id](#entity-standorte-locations)) |
| `step` | `Document` | schema | Snapshot des Onboarding-Schritts ([OnboardingStep](#sub-entity-onboardingstep)) |
| `comment` | `String` | schema | Kommentar (Freitext) |
| `dateStarted` | `Date` | schema | Startzeitpunkt des Schritts |
| `dateCompleted` | `Date` | schema | Abschlusszeitpunkt des Schritts |
| `dateChanged` | `Date` | schema | Zeitpunkt der letzten Änderung |
| `changedBy` | `DBRef` | schema | Letzte Änderung durch (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.OnboardingHistory` (Used) |

The `onboardingHistory` entity references:
- [`user`](#entity-experte-expert) (via `referenceId` or `changedBy`)
- [`location`](#entity-standorte-locations) (via `referenceId`)

### Sub-entities for onboardingHistory

#### Sub-entity: OnboardingStep
Definition der einzelnen Schritte, die ein Experte oder Standort während des Onboarding-Prozesses durchlaufen muss.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `title` | `String` | schema | Titel des Schritts (Freitext) |
| `description` | `String` | schema | Beschreibung (Freitext) |
| `priority` | `Number` | schema | Sortierreihenfolge |
| `mandatory` | `Boolean` | schema | Pflichtschritt |
| `type` | `String` | schema | Typ des Onboarding-Schritts:<br>• `CHECK` (Used) |
| `assignmentType` | `String` | schema | Art der Zuordnung:<br>• `EMPLOYEE` (Used)<br>• `LOCATION` (Used) |
| `dateCreated` | `Date` | schema | Creation time |
| `dateChanged` | `Date` | schema | Time of last change |
| `createdBy` | `DBRef` | schema | Created by (Reference to [user](#entity-experte-expert)) |
| `changedBy` | `DBRef` | schema | Changed by (Reference to [user](#entity-experte-expert)) |

The `OnboardingStep` sub-entity is used within:
- [`onboardingHistory`](#entity-onboarding-verlauf-onboarding-history) (as `step` snapshot)
- [`onboardingStep`](#entity-onboarding-schritte-onboarding-steps) (as the main entity table)

## Entity: Onboarding-Schritte (Onboarding Steps)
Definition der einzelnen Schritte, die ein Experte oder Standort während des Onboarding-Prozesses durchlaufen muss.

### Table: onboardingStep
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `title` | `String` | schema | Titel des Schritts (Freitext) |
| `description` | `String` | schema | Detaillierte Beschreibung (Freitext) |
| `priority` | `Number` | schema | Reihenfolge der Bearbeitung |
| `mandatory` | `Boolean` | schema | Ob der Schritt verpflichtend ist |
| `type` | `String` | schema | Art des Schritts:<br>• `CHECK` (Used) |
| `assignmentType` | `String` | schema | Art der Zuordnung:<br>• `EMPLOYEE` (Used)<br>• `LOCATION` (Used) |
| `createdBy` | `DBRef` | schema | Erstellt von (Reference to [user](#entity-experte-expert)) |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `dateChanged` | `Date` | schema | Änderungsdatum |
| `changedBy` | `DBRef` | schema | Geändert von (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.OnboardingStep` (Used) |

The `onboardingStep` entity is referenced by:
- [`onboardingHistory`](#entity-onboarding-verlauf-onboarding-history) (as a snapshot in `step`)

## Entity: Login-Benachrichtigungen (Login Notifications)
Spezifische Meldungen, die Benutzern beim Einloggen in das System angezeigt werden.

### Table: loginNotification
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `content` | `String` | schema | Inhalt der Benachrichtigung |
| `dateFrom` | `Date` | schema | Gültig ab |
| `dateTo` | `Date` | schema | Gültig bis |
| `active` | `Boolean` | schema | Status |
| `dateCreated` | `Date` | inferred | Erstellungsdatum |
| `createdBy` | `DBRef` | inferred | Erstellt von (Reference to [user](#entity-experte-expert)) |
| `dateChanged` | `Date` | inferred | Letztes Änderungsdatum |
| `changedBy` | `DBRef` | inferred | Geändert von (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.LoginNotification` (Used) |

The `loginNotification` entity is used for:
- (Alerts shown to users upon successful system login)

## Entity: Testbenutzer (Test User)
Interne Testbenutzer für Systemprüfungen.

### Table: 1testuser
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `password` | `String` | schema | Passwort |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.TestUser` (Used) |

The `1testuser` entity is used for:
- (System testing and QA)

## Entity: Behandlungsverlauf (Treatment)
Erfasst den Verlauf von Behandlungen, insbesondere im Bereich der Psychotherapie.

### Table: treatment
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `assigned` | `Document` | snapshot | Zugewiesener Experte (denormalized snapshot of [`user`](#entity-experte-expert)) ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `hour` | `Number` | schema | Stundenindex |
| `day` | `String` | schema | Wochentag:<br>• `MO` (Used)<br>• `TU` (Used)<br>• `WE` (Used)<br>• `TH` (Used)<br>• `FR` (Used) |
| `bookNumber` | `String` | schema | Buchnummer (JVA) |
| `jNumber` | `String` | schema | J-Nummer (JVA) |
| `type` | `String` | schema | Art der Behandlung:<br>• `PSYCH` (Used) |
| `state` | `String` | schema | Status der Behandlung:<br>• `ACTIVE` (Used)<br>• `CANCELED` (Used)<br>• `CANCELED_CLOSED` (Used)<br>• `CLOSED` (Used)<br>• `ENDING` (Used)<br>• `PROBATORIK` (Used)<br>• `RUNNING` (Used)<br>• `STARTED` (Used)<br>• `STORNO` (Used)<br>• `STORNO_CLOSED` (Used) |
| `dateStorno` | `Date` | schema | Stornierungsdatum |
| `job` | `Document` | snapshot | Erbrachte Dienstleistung (denormalized snapshot of [`jobId`](#entity-dienstleistung-service)) ([ConsultationJob](#sub-entity-consultationjob)) |
| `jobReport` | `Document` | snapshot | Dienstleistung für Berichte (denormalized snapshot of [`jobId`](#entity-dienstleistung-service)) ([ConsultationJob](#sub-entity-consultationjob)) |
| `reportingPath` | `String` | schema | Pfad für das Reporting |
| `jobReportPobatorik` | `Document` | snapshot | Dienstleistung für Probatorik-Berichte (denormalized snapshot of [`jobId`](#entity-dienstleistung-service)) ([ConsultationJob](#sub-entity-consultationjob)) |
| `archived` | `Boolean` | schema | Archivierungsstatus |
| `attachments` | `Array` | schema | Liste von Anhängen |
| `positions` | `Array` | schema | Einzelne Termine der Behandlung ([TreatmentPosition](#sub-entity-treatmentposition)) |
| `changedBy` | `Document` | snapshot | Zuletzt geändert von (denormalized snapshot of [`user`](#entity-experte-expert)) ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `dateChanged` | `Date` | schema | Zeitpunkt der letzten Änderung |
| `createdBy` | `Document` | snapshot | Erstellt von (denormalized snapshot of [`user`](#entity-experte-expert)) ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `dateCreated` | `Date` | inferred | Erstellungsdatum |
| `closed` | `Date` | schema | Abschlussdatum |
| `countTotal` | `Number` | schema | Gesamtanzahl |
| `countFinished` | `Number` | schema | Anzahl abgeschlossener Termine |
| `dateInitial` | `Date` | schema | Initiales Datum |
| `countPlanned` | `Number` | schema | Anzahl geplanter Termine |
| `comment` | `String` | schema | Kommentar |
| `dateAcceptedPTLeitung` | `Date` | schema | Akzeptiert von PT-Leitung am |
| `dateAcceptedPT` | `Date` | schema | Akzeptiert von PT am |
| `dateAcceptedLocation` | `Date` | schema | Akzeptiert von Standort am |
| `dateStarted` | `Date` | schema | Startdatum (tatsächlich) |
| `dateStart` | `Date` | schema | Startdatum (geplant) |
| `dateLastAppointment` | `Date` | schema | Datum des letzten Termins |
| `reportCountInitial` | `Number` | schema | Initiale Anzahl Berichte |
| `reportCountRhytm` | `Number` | schema | Rhythmus der Berichte |
| `customer` | `Document` | snapshot | Zugehöriger Kunde (denormalized snapshot of [`customer`](#entity-kunden-customers)) ([ConsultationCustomer](#sub-entity-consultationcustomer)) |
| `location` | `Document` | snapshot | Ort der Behandlung (denormalized snapshot of [`location`](#entity-standorte-locations)) ([ConsultationLocation](#sub-entity-consultationlocation)) |
| `minutes` | `Number` | schema | Dauer in Minuten |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Treatment` (Used) |

The `treatment` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (via `treatmentId`)
- [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue) (via `type`)

### Sub-entities for treatment

#### Sub-entity: TreatmentPosition
Ein einzelner Termin oder eine Position innerhalb eines Behandlungsverlaufs.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `appointmentId` | `Long` | schema | Reference to [appointment](#entity-termine-appointments) |
| `start` | `Date` | schema | Startzeitpunkt |
| `until` | `Date` | schema | Endzeitpunkt |
| `state` | `String` | schema | Status des Termins:<br>• `CANCELED` (Used)<br>• `CLOSED` (Used)<br>• `DONE` (Used)<br>• `LOCKEDIN` (Used)<br>• `READY` (Used)<br>• `RESCHEDULED` (Used)<br>• `STORNO` (Used) |
| `requireReport` | `Boolean` | schema | Bericht erforderlich |
| `forceReport` | `Boolean` | schema | Bericht erzwingen |
| `report` | `Document` | schema | Referenz auf den Bericht ([TreatmentReport](#sub-entity-treatmentreport)) |

The `TreatmentPosition` sub-entity is used within:
- [`treatment`](#entity-behandlungsverlauf-treatment) (as `positions` array)

#### Sub-entity: TreatmentReport
Informationen zum Bericht einer Behandlungsposition.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `type` | `String` | schema | Art des Berichts:<br>• `STANDARD` (Used) |
| `consultationId` | `Long` | schema | Referenz auf [consultationData](#entity-konsultationsdaten-consultation-data) |
| `date` | `Date` | schema | Datum des Berichts |
| `dateStart` | `Date` | schema | Startdatum des Berichts |
| `dateEnd` | `Date` | schema | Enddatum des Berichts |
| `job` | `Document` | snapshot | Zugehörige Dienstleistung (denormalized snapshot of [`jobId`](#entity-dienstleistung-service)) ([ConsultationJob](#sub-entity-consultationjob)) |

The `TreatmentReport` sub-entity is used within:
- [`TreatmentPosition`](#sub-entity-treatmentposition) (as `report` field)

## Entity: Behandlungskategorien (Treatment Categories)
Kategorisierung von verschiedenen Behandlungsarten.

### Table: treatmentCategory
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version" | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Name der Kategorie (Used: `Allgemeinmedizin`, `Allgemeinmedizin_Telearzt`, `Andrologie`, `Anästhesie`, `Apotheke`, `Arbeitsmedizin`, `Audiologie`, `Augenheilkunde`, `Chirurgie`, `Diätassistent`, `Diätberatung`, `Durchgangsarzt`, `Gastroenterologie`, `Genetik`, `Gynäkologie`, `HNO-Heilkunde`, `Haut- und Geschlechtskrankheiten`, `Hämatologie`, `Hörgeräteakkustiker`, `Innere Medizin`, `Kardiologie`, `Kieferorthopädie`, `Labor`, `Logopädie`, `Mund-Kiefer-Gesichtschirurgie`, `Nephrologie`, `Neurologie`, `Nuklearmedizin`, `Onkologie`, `Optiker`, `Orthopädie`, `Orthopädieschuhmacher`, `Orthopädietechniker`, `Pathologie`, `Physiotherapie`, `Pneumologie`, `Psychiatrie`, `Psychiatrie_Telearzt`, `Pädiatrie`, `Radiologie`, `Rechtsmedizin`, `Sanitätshaus`, `Schmerztherapie`, `Traumatologie`, `Urologie`, `Zahnmedizin`, `Zahntechniker`, `sonstige`, `öffentliches Gesundheitswesen`) |
| `description` | `String` | schema | Beschreibung (Freitext) |
| `prio` | `Number` | schema | Priorität |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.TreatmentCategory` (Used) |

The `treatmentCategory` entity is referenced by:
- [`treatment`](#entity-behandlungsverlauf-treatment) (via `category` DBRef)

## Entity: Konsultationsdaten (Consultation Data)
Die Konsultationsdaten erfassen alle medizinischen Informationen, die während einer Konsultation dokumentiert werden, einschließlich Anamnese, Befund, Diagnose und Medikation.

### Table: consultationData
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `date` | `Date` | schema | Datum der Konsultation |
| `timeStart` | `Number` | schema | Startuhrzeit (Sekunden seit Mitternacht) |
| `timeEnd` | `Number` | schema | Enduhrzeit (Sekunden seit Mitternacht) |
| `dateSignedOff` | `Date` | schema | Datum der Abzeichnung |
| `archived` | `Boolean` | schema | Archivierungsstatus |
| `type` | `String` | schema | Typ der Konsultation:<br>• `EXTERNAL` (Used)<br>• `STANDARD` (Used) |
| `state` | `String` | schema | Status:<br>• `CLOSED` (Used)<br>• `TRANSMITTED` (Used) |
| `base` | `Document` | schema | Basiselemente ([ConsultationBase](#sub-entity-consultationbase)) |
| `body` | `Document` | schema | Körperliche Basisdaten ([ConsultationBody](#sub-entity-consultationbody)) |
| `warnings` | `Array` | schema | Warnhinweise ([ConsultationWarning](#sub-entity-consultationwarning)) |
| `onboarding` | `Document` | schema | Daten der Erstuntersuchung ([ConsultationOnboarding](#sub-entity-consultationonboarding)) |
| `standard` | `Document` | schema | Daten einer Standard-Konsultation ([ConsultationStandard](#sub-entity-consultationstandard)) |
| `signedOffBy` | `DBRef` | schema | Signed off by (Reference to [user](#entity-experte-expert)) |
| `appointment` | `DBRef` | schema | Associated appointment (Reference to [appointment](#entity-termine-appointments)) |
| `location` | `Document` | snapshot | Location of the consultation (denormalized snapshot of [`location`](#entity-standorte-locations)) ([ConsultationLocation](#sub-entity-consultationlocation)) |
| `period` | `Number` | schema | Abrechnungszeitraum |
| `appointmentType` | `String` | schema | Termintyp:<br>• `APPOINTMENT` (Used) |
| `customer` | `Document` | snapshot | Zugehöriger Kunde (denormalized snapshot of [`customer`](#entity-kunden-customers)) ([ConsultationCustomer](#sub-entity-consultationcustomer)) |
| `job` | `Document` | snapshot | Erbrachte Dienstleistung (denormalized snapshot of [`jobId`](#entity-dienstleistung-service)) ([ConsultationJob](#sub-entity-consultationjob)) |
| `paymentType` | `String` | schema | Zahlungsart:<br>• `FULL` (Used) |
| `doctor` | `Document` | snapshot | Durchführender Experte (denormalized snapshot of [`user`](#entity-experte-expert)) ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `history` | `Document` | inferred | Historie ([ConsultationHistory](#sub-entity-consultationhistory)) |
| `bookNumber` | `String` | inferred | Buchnummer (JVA) |
| `jNumber` | `String` | inferred | J-Nummer (JVA) |
| `basisWebDataId` | `Long` | schema | Reference to [basisWebData](#entity-jva-patientendaten-basis-web-data) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.ConsultationData` (Used) |

The `consultationData` entity is referenced by:
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`log`](#entity-system-logs-logs)
- [`questionaire`](#entity-qualit-tsumfragen-questionaires)
- [`treatment`](#entity-behandlungsverlauf-treatment) (in `positions.report`)
- [`cDRCallAssignment`](#entity-cdr-call-zuweisungen-cdr-call-assignment)

### Sub-entities for consultationData

#### Sub-entity: ConsultationBase
Basiselemente der Konsultation.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `medicalTrainedPersonel` | `Boolean` | schema | Medizinisch geschultes Personal anwesend |
| `timeContact` | `Number` | schema | Kontaktzeit |
| `communicationType` | `String` | schema | Art der Kommunikation:<br>• `VIDEO` (Used) |
| `furtherTreatment` | `String` | schema | Voreinstellung für die weitere Behandlung:<br>• `FOLLOW_UP` (Used)<br>• `IF_REQUIRED` (Used)<br>• `REFERRAL` (Used)<br>• `REFERRAL_OTHER` (Used) |
| `dateFurtherTreatment` | `Date` | schema | Datum der weiteren Behandlung |

The `ConsultationBase` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `base` field)

#### Sub-entity: ConsultationBody
Körperliche Basisdaten des Patienten zum Zeitpunkt der Konsultation.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `gender` | `String` | schema | Geschlecht:<br>• `MALE` (Used)<br>• `FEMALE` (Used) |
| `age` | `Number` | inferred | Alter |
| `birthday` | `Date` | schema | Geburtsdatum |
| `bodyHeight` | `Number` | schema | Körpergröße |
| `bodyWeight` | `Number` | schema | Körpergewicht |
| `rr` | `String` | schema | Blutdruck (RR) |
| `pulse` | `String` | schema | Puls |

The `ConsultationBody` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `body` field)
- [`expertConsultationTemplate`](#entity-konsultationsvorlagen-expert-consultation-templates) (as `body` field)

#### Sub-entity: ConsultationWarning
Warnhinweise für den Patienten.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `warning` | `DBRef` | schema | Reference to the alert ([patientAlerts](#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts)) |
| `comment` | `String` | schema | Kommentar |
| `applies` | `Boolean` | schema | Trifft zu |
| `dateStart` | `Date` | schema | Startdatum |

The `ConsultationWarning` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `warnings` array)

#### Sub-entity: ConsultationOnboarding
Detaillierte medizinische Daten für die Erstuntersuchung (Zugangsuntersuchung).

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `previousPhysician` | `String` | Vorheriger Arzt |
| `preexistingState` | `String` | Vorzustand |
| `preexistingCondition` | `String` | Vorerkrankungen |
| `currentState` | `String` | Aktueller Zustand |
| `hepatitis` | `String` | Hepatitis Status |
| `std` | `String` | STD Status |
| `hiv` | `String` | HIV Status |
| `generalState` | `String` | Allgemeinzustand |
| `weightState` | `String` | Ernährungszustand |
| `skinCondition` | `String` | Hautbefund |
| `alcoholUsage` | `String` | Alkoholkonsum |
| `drugUsage` | `String` | Drogenkonsum |
| `suicidal` | `Boolean` | Suizidalität |
| `dangerous` | `Boolean` | Fremdgefährdung |
| `incarcerationSuitability` | `Boolean` | Gewahrsamstauglichkeit |

The `ConsultationOnboarding` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `onboarding` field)
- [`expertConsultationTemplate`](#entity-konsultationsvorlagen-expert-consultation-templates) (as `onboarding` field)

#### Sub-entity: ConsultationStandard
Dokumentation einer Standard-Konsultation.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `medicationAnamnesis` | `Document` | schema | Zusammenfassung der Medikation ([ConsultationMedicationAnamnesis](#sub-entity-consultationmedicationanamnesis)) |
| `anamnesis` | `Array` | schema | Anamnese Einträge ([ConsultationAnamnesis](#sub-entity-consultationanamnesis)) |
| `patientReport` | `Array` | schema | Befundberichte ([ConsultationPatientReport](#sub-entity-consultationpatientreport)) |
| `diagnosis` | `Array` | schema | Diagnosen ([ConsultationDiagnosis](#sub-entity-consultationdiagnosis)) |
| `procedureReport` | `String` | schema | Prozedurenbericht |
| `prescription` | `Array` | schema | Verschreibungen ([ConsultationPrescription](#sub-entity-consultationprescription)) |
| `workIncapacity` | `Array` | schema | Arbeitsunfähigkeit ([ConsultationWorkIncapacity](#sub-entity-consultationworkincapacity)) |
| `referralTo` | `String` | schema | Überweisung an |
| `furtherTreatment` | `String` | schema | Voreinstellung für die weitere Behandlung (mapped to [ConsultationBase.furtherTreatment](#sub-entity-consultationbase)) |

The `ConsultationStandard` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `standard` field)
- [`expertConsultationTemplate`](#entity-konsultationsvorlagen-expert-consultation-templates) (as `standard` field)

#### Sub-entity: ConsultationMedicationAnamnesis
Zusammenfassung der Medikationsanamnese mit Kategorisierung.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `documentation` | `String` | schema | Dokumentation der Medikation |
| `categoryA01` | `Boolean` | schema | Kategorie A01 |
| `categoryB01` | `Boolean` | schema | Kategorie B01 |
| `categoryJ05` | `Boolean` | schema | Kategorie J05 |
| `categoryN06` | `Boolean` | schema | Kategorie N06 |
| `categoryC09` | `Boolean` | schema | Kategorie C09 |
| `categoryC10` | `Boolean` | schema | Kategorie C10 |
| `categoryN02` | `Boolean` | schema | Kategorie N02 |
| `categoryN05` | `Boolean` | schema | Kategorie N05 |
| `categoryR03` | `Boolean` | schema | Kategorie R03 |
| `categoryA02` | `Boolean` | schema | Kategorie A02 |
| `categoryL02` | `Boolean` | schema | Kategorie L02 |
| `categoryL04` | `Boolean` | schema | Kategorie L04 |
| `categoryA12` | `Boolean` | schema | Kategorie A12 |

The `ConsultationMedicationAnamnesis` sub-entity is used within:
- [`ConsultationStandard`](#sub-entity-consultationstandard) (as `medicationAnamnesis` field)

#### Sub-entity: ConsultationDiagnosis
 Einzelne Diagnose mit ICD-10 Code.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String" | inferred | Internal identifier |
| `icd10` | `Document` | schema | ICD-10 Reference ([Icd10](#table-icd10)) |
| `localization` | `String` | schema | Lokalisierung:<br>• `LEFT` (Used)<br>• `RIGHT` (Used)<br>• `BOTH` (Used)<br>• `UNKNOWN` (Used) |
| `level` | `String` | schema | Sicherheit der Diagnose:<br>• `GENERAL` (Used)<br>• `VERIFY` (Used)<br>• `ZERO` (Used)<br>• `STATIONARY` (Used) |
| `title` | `String` | schema | Titel |
| `comment` | `String` | schema | Kommentar |

The `ConsultationDiagnosis` sub-entity is used within:
- [`ConsultationStandard`](#sub-entity-consultationstandard) (as `diagnosis` array)

## Entity: Konsultationen (Legacy)
Historische oder alternative Konsultationsdaten (ähnlich wie `consultationData`).

### Table: consultation
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `date` | `Date` | Datum |
| `type` | `String` | Typ:<br>• `DOCUMENT` (Used)<br>• `EXTERNAL` (Used)<br>• `INCARCERATION` (Used)<br>• `ONBOARDING` (Used)<br>• `ONBOARDING_SHORT` (Used)<br>• `STANDARD` (Used)<br>• `TREATMENT` (Used) |
| `state` | `String` | Status:<br>• `CLOSED` (Used)<br>• `CREATED` (Used)<br>• `OPEN` (Used)<br>• `REPORTED` (Used)<br>• `TRANSMITTED` (Used)<br>• `VERIFIED` (Used) |
| `__ref_snapshot_doctor_id` | `Document` | Experte ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `__ref_snapshot_job_id` | `Document` | Dienstleistung ([ConsultationJob](#sub-entity-consultationjob)) |
| `__ref_snapshot_location_id` | `Document` | Ort ([ConsultationLocation](#sub-entity-consultationlocation)) |
| `__ref_snapshot_customer_id` | `Document` | Kunde ([ConsultationCustomer](#sub-entity-consultationcustomer)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Consultation` (Used) |

The `consultation` (Legacy) entity stores historical records and is referenced by:
- (Internal audit and history tools)

## Entity: Konsultationsvorlagen (Expert Consultation Templates)
Vordefinierte Vorlagen für medizinische Konsultationen zur schnelleren Dokumentation.

### Table: expertConsultationTemplate
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `name` | `String` | schema | Name der Vorlage |
| `description` | `String` | schema | Beschreibung |
| `body` | `Document` | schema | Vorlage für körperliche Basisdaten ([ConsultationBody](#sub-entity-consultationbody)) |
| `standard` | `Document` | schema | Vorlage für Standard-Konsultation ([ConsultationStandard](#sub-entity-consultationstandard)) |
| `onboarding` | `Document` | schema | Vorlage für Erstuntersuchung ([ConsultationOnboarding](#sub-entity-consultationonboarding)) |
| `job` | `Document` | schema | Vorlage für Dienstleistung ([ConsultationJob](#sub-entity-consultationjob)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.ExpertConsultationTemplate` (Used) |

## Entity: Patientenergänzungsdaten (Patient Data)
Zusätzliche oder ergänzende Informationen zu Patienten, oft im Kontext spezifischer Termine.

### Table: patientData
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `appointmentId` | `Long` | inferred | Reference to [appointment](#entity-termine-appointments) |
| `bookNumber` | `String` | inferred | Buchnummer (JVA) |
| `location` | `Document` | inferred | Ort der Erfassung ([ConsultationLocation](#sub-entity-consultationlocation)) |
| `onlyDocumentation` | `Boolean` | schema | Nur Dokumentation Kennzeichnung |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.PatientData` (Used) |

The `patientData` entity references:
- [`appointment`](#entity-termine-appointments)
- [`location`](#entity-standorte-locations)

## Entity: Patienten (Patients)
Zentrales Verzeichnis aller Patienten mit persönlichen Daten und Kontakthistorie.

### Table: patient
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `title` | `String` | schema | Akademischer Titel |
| `firstName` | `String` | schema | Vorname |
| `lastName` | `String` | schema | Nachname |
| `displayName` | `String` | schema | Vollständiger Name für die Anzeige |
| `birthday` | `Date` | schema | Geburtsdatum |
| `primaryEmail` | `String` | inferred | Primäre E-Mail-Adresse |
| `homeZipCode` | `String` | inferred | Postleitzahl |
| `homeCity` | `String` | inferred | Stadt |
| `location` | `DBRef` | schema | Zugeordneter Standard-Standort |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Patient` (Used) |

The `patient` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (implicitly via JVA identifiers or legacy links)
- [`treatment`](#entity-behandlungsverlauf-treatment) (implicitly via JVA identifiers)

## Entity: Patientenbezogene Risikofaktoren / Warnhinweise (Patient Alerts)
Patient-related risk factors or alerts that can be assigned to patients.

### Table: patientAlerts (former: warning)
| Column | Type | Field Type | Description (from all-together.md) |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `name` | `String` | schema | Eine Bezeichnung des Ausschlusskriteriums (Warnhinweis) |
| `type` | `String` | schema | Art des Warnhinweises:<br>• `ALLERGY` (Used)<br>• `CONSPICIOUS` (Used)<br>• `INFECTION` (Used)<br>• `OTHER` (Used) |
| `entryRequirement` | `Boolean` | schema | Ob das Ausschlusskriterium aktiv oder deaktiviert ist |
| `documentationRequirement` | `Boolean` | schema | Ob eine Dokumentationspflicht besteht |
| `description` | `String` | schema | Eine Beschreibung |
| `priority` | `Number` | schema | Eine Gewichtung als Zahl |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Warning` (Used) |

The `patientAlerts` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (in `warnings`)

## Entity: Service-Qualitätsmanagement (Service QM)
Protokollierung von Qualitätsmetriken für erbrachte Dienstleistungen.

### Table: serviceQm
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `ratingRisk` | `Number` | inferred | Risiko-Bewertung |
| `ratingCommunication` | `Number` | inferred | Kommunikations-Bewertung |
| `comment` | `String` | schema | Kommentar |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.ServiceQm` (Used) |

The `serviceQm` entity is used for:
- (Quality assurance reports)

## Entity: Qualitätsumfragen (Questionaires)
Fragebögen zur Bewertung der Qualität von Konsultationen und Dienstleistungen.

### Table: questionaire
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `appointmentId` | `Long` | schema | Reference to [appointment](#entity-termine-appointments) |
| `consultationId` | `Long` | schema | Reference to [consultationData](#entity-konsultationsdaten-consultation-data) |
| `date` | `Date` | schema | Datum der Umfrage |
| `ratingRisk` | `Number` | schema | Bewertung Risiko (1-5) |
| `ratingTeleApplyable` | `Number` | schema | Bewertung Telemedizin-Eignung (1-5) |
| `ratingDocumentation` | `Number` | inferred | Bewertung Dokumentation (1-5) |
| `ratingEquipment` | `Number` | inferred | Bewertung Ausrüstung (1-5) |
| `ratingCommunication` | `Number` | inferred | Bewertung Kommunikation (1-5) |
| `comment` | `String` | schema | Kommentar |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Questionaire` (Used) |

The `questionaire` entity is referenced by:
- (Internal quality management reports)

## Entity: Ausrüstung (Equipment)
Verzeichnis von medizinischem Equipment, das an Standorten vorhanden sein kann.

### Table: equipment
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `name` | `String` | inferred | Name des Equipments |
| `description` | `String` | schema | Beschreibung |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Equipment` (Used) |

The `equipment` entity is referenced by:
- [`questionaire`](#entity-qualit-tsumfragen-questionaires) (implicitly via quality ratings)

## Entity: Ausrüstungsgruppen (Equipment Groups)
Kategorisierung von medizinischer Ausrüstung.

### Table: equipmentGroup
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `code` | `String` | schema | Gruppen-Code |
| `description` | `String` | schema | Beschreibung |
| `prio` | `Number` | schema | Priorität |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.EquipmentGroup` (Used) |

The `equipmentGroup` entity is referenced by:
- [`equipment`](#entity-ausr-stung-equipment) (conceptually, to group inventory items)

## Entity: Standort-Snapshots (Location Rooms DTO)
Snapshots von Standortdaten inklusive Raum-Informationen für die Web-Oberfläche.

### Table: locationRoomsDto
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Name des Standorts |
| `address` | `String` | inferred | Adresse |
| `customer` | `DBRef` | schema | Reference to [customer](#entity-kunden-customers) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.LocationRoomsDto` (Used) |

The `locationRoomsDto` entity is used for:
- (UI snapshots of location data)

## Entity: Videos (Videos)
Metadaten für Schulungs- oder Informationsvideos.

### Table: video
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String" | schema | Videotitel |
| `category` | `DBRef` | schema | Reference to [videoCategory](#entity-videokategorien-video-categories) |
| `file` | `Document` | schema | Metadaten der Videodatei ([FileMetadata](#sub-entity-filemetadata)) |
| `preview` | `Document` | schema | Metadaten des Vorschaubilds ([FileMetadata](#sub-entity-filemetadata)) |
| `lengthInSeconds` | `Long` | schema | Videolänge in Sekunden |
| `path` | `String` | schema | Speicherpfad |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Video` (Used) |

The `video` entity is referenced by:
- [`userVideoHistory`](#entity-video-verlauf-user-video-history)

## Entity: Video-Verlauf (User Video History)
Protokollierung der von Benutzern angesehenen (Schulungs-)Videos.

### Table: userVideoHistory
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `user` | `DBRef` | schema | Reference to [user](#entity-experte-expert) |
| `video` | `DBRef` | schema | Reference to [video](#entity-videos-videos) |
| `dateStart` | `Date` | schema | Erster Zugriff |
| `dateLast` | `Date` | schema | Letzter Zugriff |
| `timeWatched` | `Long` | schema | Gesamt-Zuschauerzeit in Sekunden |
| `watchCount` | `Number` | schema | Anzahl der Aufrufe |
| `sessions` | `Array` | schema | Einzelne Video-Sitzungen ([UserVideoSession](#sub-entity-uservideosession)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.UserVideoHistory` (Used) |

The `userVideoHistory` entity references:
- [`user`](#entity-experte-expert) (via `user` DBRef)
- [`video`](#entity-videos-videos) (via `video` DBRef)

### Sub-entities for userVideoHistory

#### Sub-entity: UserVideoSession
Einzelne Wiedergabe-Sitzung eines Videos.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String" | inferred | Internal identifier |
| `sessionId` | `String` | schema | Session-ID |
| `dateStart` | `Date` | inferred | Beginn der Sitzung |
| `dateEnd` | `Date` | inferred | Ende der Sitzung |
| `duration` | `Long` | inferred | Wiedergabedauer in Sekunden |
| `completed` | `Boolean` | inferred | Ob das Video vollständig gesehen wurde |
| `date` | `Date` | inferred | Zeitpunkt |
| `timeWatched` | `Long` | schema | Zuschauerzeit in dieser Sitzung |

The `UserVideoSession` sub-entity is used within:
- [`userVideoHistory`](#entity-video-verlauf-user-video-history) (as `sessions` array)

## Entity: Videokategorien (Video Categories)
Kategorisierung von Videos in einer hierarchischen Struktur.

### Table: videoCategory
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `title` | `String` | inferred | Name der Kategorie |
| `description` | `String` | inferred | Beschreibung |
| `thumbnail` | `Document` | inferred | Vorschaubild ([FileMetadata](#sub-entity-filemetadata)) |
| `parent` | `Long` | schema | Reference to übergeordnete [videoCategory](#entity-videokategorien-video-categories) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.VideoCategory` (Used) |

The `videoCategory` entity is referenced by:
- [`video`](#entity-videos-videos)

## Entity: Benachrichtigungen (Notifications)
Interne Benachrichtigungen und Nachrichten zwischen Benutzern oder vom System.

### Table: notification
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `ts` | `Date` | schema | Zeitstempel |
| `from` | `Document` | snapshot | Absender (denormalized snapshot of [`user`](#entity-experte-expert)) ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `to` | `Document` | snapshot | Empfänger (denormalized snapshot of [`user`](#entity-experte-expert)) ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `important` | `Boolean` | schema | Wichtigkeit |
| `folder` | `String` | schema | Ordner:<br>• `INBOX` (Used)<br>• `OUTBOX` (Used)<br>• `TRASH` (Used)<br>• `ARCHIVE` (Not used) |
| `read` | `Date` | schema | Gelesen-Zeitpunkt |
| `subject` | `String` | schema | Betreff |
| `message` | `String` | schema | Nachrichtentext |
| `notificationEvent` | `String` | schema | Art des Ereignisses |
| `emailSent` | `Boolean` | schema | Ob eine E-Mail versendet wurde |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Notification` (Used) |

The `notification` entity is referenced by:
- [`appointmentAssignmentHistory`](#entity-terminzuweisungs-historie-appointment-assignment-history) (via `notificationId`)

## Entity: Benachrichtigungsvorlagen (Notification Templates)
Vordefinierte Vorlagen für Systembenachrichtigungen basierend auf Ereignissen.

### Table: notificationTemplate
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `event` | `String` | schema | Ereignis-Typ (Used: `APPOINTMENT_ACCEPTED`, `APPOINTMENT_AGREED`, `APPOINTMENT_ASSIGNED`, `APPOINTMENT_CANCELED`, `APPOINTMENT_DELETED`, `APPOINTMENT_DISAGREED`, `APPOINTMENT_DONE`, `APPOINTMENT_EXPERT_AGREED`, `APPOINTMENT_EXPERT_CANCELED`, `APPOINTMENT_EXPERT_DISAGREED`, `APPOINTMENT_REJECTED`, `APPOINTMENT_REMINDER`, `APPOINTMENT_REQUEST`, `APPOINTMENT_RESERVED`, `APPOINTMENT_STORNO`, `APPOINTMENT_UPCOMING`, `APPOINTMENT_UPCOMING_LOCATION`, `ASYNC_JOB_QUEUE_ERROR`, `ASYNC_JOB_QUEUE_SUCCESS`, `CONSULATION_REPORTED`, `CONSULATION_REPORTED_EXPERT`, `CONSULATION_REPORTING`, `CONSULATION_SUBMIT`, `CONSULTATION_REPORTING_PSYCHOTHERAPY`, `COUNCIL_START`, `COUNCIL_SUBMIT`, `EXPERT_SUMMARY`, `FORWARD_NOTIFICATION`, `HOLIDAY_REMOVED`, `HOLIDAY_REQUEST`, `INVOICE_CUSTOMER`, `JOB_FINISHED`, `RECOVER_PASSWORD`, `TEMPLATE`, `TREATMENT_END_STORNO`, `TREATMENT_EXPERT_START`, `TREATMENT_START`, `USER_PASSWORD`) |
| `subject` | `String` | schema | Betreffzeile (Strukturierter Text) |
| `message` | `String` | schema | Nachrichtentext mit Platzhaltern (Strukturierter Text) |
| `enabled` | `Boolean` | schema | Ob die Vorlage aktiv ist |
| `language` | `String` | schema | Sprache der Vorlage (Used: `de`) |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `dateChanged` | `Date` | inferred | Änderungsdatum |
| `changedBy` | `DBRef` | inferred | Geändert von (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | `de.videoclinic.model.NotificationTemplate` (Used) |

The `notificationTemplate` entity is used by:
- (System-wide notification logic triggered by events)

## Entity: System-Ankündigungen (Message of the Day)
Meldungen, die Benutzern beim Login oder auf dem Dashboard angezeigt werden.

### Table: messageOfTheDay
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `message` | `String` | schema | Die eigentliche Nachricht (HTML/Text) |
| `subject` | `String` | schema | Betreff |
| `roles` | `Array` | schema | Rollen, denen diese Nachricht angezeigt wird (Strings) |
| `dateStart` | `Date` | schema | Anzeige ab |
| `dateEnd` | `Date` | schema | Anzeige bis |
| `enabled` | `Boolean` | schema | Status |
| `important` | `Boolean` | schema | Wichtig-Kennzeichnung |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.MessageOfTheDay` (Used) |

The `messageOfTheDay` entity is used for:
- (Global announcements shown to users on the dashboard)

## Entity: JVA Patientendaten (Basis Web Data)
Vom JVA-System übermittelte Patientendaten, die verschlüsselt in der Datenbank abgelegt werden.

### Table: basisWebData
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `uuid` | `String` | schema | Eindeutige ID der Übermittlung |
| `jva` | `Long` | schema | ID der JVA |
| `jnummer` | `String` | schema | J-Nummer des Gefangenen |
| `buchnummer` | `String` | schema | Buchnummer des Gefangenen |
| `familienname` | `String` | schema | Familienname |
| `geburtsname` | `String` | schema | Geburtsname |
| `vorname` | `String` | schema | Vorname |
| `geburtsdatum` | `String` | schema | Geburtsdatum |
| `staatsangehoerigkeit` | `String` | schema | Staatsangehörigkeit |
| `geburtsland` | `String` | schema | Geburtsland |
| `geschlecht` | `String` | schema | Geschlecht |
| `medication` | `Array` | schema | Liste übermittelter Medikamente ([BasisWebMedication](#sub-entity-basiswebmedication)) |
| `warning` | `Array` | schema | Liste übermittelter Warnhinweise ([BasisWebWarning](#sub-entity-basiswebwarning)) |
| `dateDecrypted` | `Date` | inferred | Entschlüsselungszeitpunkt |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `appointment` | `DBRef` | schema | Associated appointment (Reference to [appointment](#entity-termine-appointments)) |
| `_class` | `String` | schema | Java class name: `de.videoclinic.model.BasisWebData` (Used) |

The `basisWebData` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (via `basisWebDataId`)

### Sub-entities for basisWebData

#### Sub-entity: BasisWebMedication
Übermitteltes Medikament aus dem JVA-System.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `date` | `String` | schema | Datum |
| `type` | `String` | schema | Art des Medikaments (Encrypted/Hashed) |
| `content` | `String` | schema | Inhalt/Wirkstoff |
| `entry` | `String` | schema | Eintragstext |
| `note` | `String` | schema | Notiz |
| `until` | `String` | schema | Gültig bis |

The `BasisWebMedication` sub-entity is used within:
- [`basisWebData`](#entity-jva-patientendaten-basis-web-data) (as `medication` array)

#### Sub-entity: BasisWebWarning
Übermittelter Warnhinweis aus dem JVA-System.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `date` | `String` | schema | Datum |
| `active` | `String` | schema | Status (Encrypted/Hashed) |
| `type` | `String` | schema | Art der Warnung (Encrypted/Hashed) |
| `content` | `String` | schema | Inhaltstext |

The `BasisWebWarning` sub-entity is used within:
- [`basisWebData`](#entity-jva-patientendaten-basis-web-data) (as `warning` array)

#### Sub-entity: BasisWebEntry
Allgemeiner medizinischer Eintrag aus dem JVA-System.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String" | inferred | Internal identifier |
| `date` | `String` | schema | Datum |
| `active` | `String` | schema | Status (Encrypted/Hashed) |
| `type` | `String` | schema | Art des Eintrags (Encrypted/Hashed) |
| `content` | `String` | schema | Inhaltstext |

The `BasisWebEntry` sub-entity is used within:
- (Internal JVA patient data processing)

## Entity: Web-Terminanfragen (Basis Web Appointment)
Vom Web-System übermittelte Terminanfragen.

### Table: basisWebAppointment
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `uuid` | `String` | Eindeutige ID der Anfrage |
| `start` | `Date` | Gewünschter Startzeitpunkt |
| `location` | `Long` | Reference to [location](#entity-standorte-locations) |
| `jva` | `Long` | ID der JVA |
| `dateCreated` | `Date` | Erstellungsdatum |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.BasisWebAppointment` (Used) |

The `basisWebAppointment` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (implicitly when converted to an appointment)

## Entity: ICD-10 Klassifikation (ICD-10)
Systematische Verzeichnis der Krankheiten und verwandter Gesundheitsprobleme.

### Table: icd10
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `code` | `String` | schema | ICD-10 Code |
| `name` | `String` | schema | Bezeichnung der Diagnose |
| `text` | `String` | schema | Detaillierter Text zur Diagnose |
| `inclusion` | `String` | schema | Einschlüsse |
| `exclusion` | `String` | schema | Ausschlusskriterien |
| `ageLow` | `Number` | schema | Mindestalter |
| `ageHigh` | `Number` | schema | Höchstalter |
| `exotic` | `Boolean` | schema | Ob es sich um eine seltene/exotische Diagnose handelt |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Icd10` (Used) |

The `icd10` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (in `standard.diagnosis`)

## Entity: Medikamente (Medication)
Zentrales Verzeichnis der verfügbaren Medikamente mit Inhaltsstoffen, Produkten und Anwendungshinweisen.

### Table: medication
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `code` | `String` | Medikamenten-Code |
| `group` | `String` | Medikamenten-Gruppe |
| `name` | `String` | Bezeichnung des Medikaments |
| `praepName` | `String` | Präparatename |
| `producer` | `String` | Hersteller |
| `medical` | `Boolean` | Ob es sich um ein medizinisches Produkt handelt |
| `monokomb` | `String` | Monopräparat oder Kombinationspräparat (Used: `NO`) |
| `ingredientCode` | `String` | Code der Wirkstoffe (Systematische Kodierung) |
| `ingredientInfo` | `String` | Information zur Wirkstoffmenge |
| `ingredients` | `Array` | Liste der Inhaltsstoffe ([MedicationIngredient](#sub-entity-medicationingredient)) |
| `products` | `Array` | Liste der verfügbaren Produkte ([MedicationProduct](#sub-entity-medicationproduct)) |
| `contra` | `String` | Kontraindikationen (Freitext/Strukturierter Text) |
| `area` | `String` | Anwendungsgebiete (Freitext/Strukturierter Text) |
| `usage` | `String` | Anwendungshinweise (Freitext/Strukturierter Text) |
| `infoFeeding` | `String` | Informationen zu Schwangerschaft und Stillzeit (Freitext) |
| `infoSideEffects` | `String` | Nebenwirkungen (Freitext) |
| `infoInteractions` | `String` | Wechselwirkungen (Freitext) |
| `dosage` | `String` | Dosierungshinweise (Freitext) |
| `_class` | `String` | Java Klassenname (Used: `de.videoclinic.model.Medication`) |

The `medication` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (in `standard.prescription`)

### Sub-entities for medication

#### Sub-entity: MedicationIngredient
Einzelner Wirkstoff oder Hilfsstoff eines Medikaments.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `name` | `String` | Name des Inhaltsstoffs |
| `code` | `String` | Code des Inhaltsstoffs (Systematische Kodierung) |
| `equivalent` | `String` | Entsprechung |
| `amount` | `String` | Menge (z.B. "50 mg") |
| `extra` | `Boolean` | Ob es sich um einen Hilfsstoff handelt |

The `MedicationIngredient` sub-entity is used within:
- [`medication`](#entity-medikamente-medication) (as `ingredients` array)
- [`MedicationProduct`](#sub-entity-medicationproduct) (as `ingredients` snapshot array)

#### Sub-entity: MedicationProduct
Konkrete Packungsform oder Variante eines Medikaments.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `name` | `String` | Name der Packung |
| `packaging` | `String` | Packungsgröße (z.B. "50 g (N2)") |
| `packageName` | `String` | Ausgeschriebener Packungsname |
| `rl` | `Boolean` | Relevanz-Indikator |
| `price` | `Number` | Preis |
| `ingredients` | `Array` | Liste der Inhaltsstoffe (Snapshot) |

The `MedicationProduct` sub-entity is used within:
- [`medication`](#entity-medikamente-medication) (as `products` array)

## Entity: PLZ-Verzeichnis (Zip Code Lookup)
Verzeichnis von Postleitzahlen zur Zuordnung von Orten und Bundesländern.

### Table: zipCodeLookup
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `zipCode` | `String` | Postleitzahl |
| `city` | `String` | Ort |
| `state` | `String` | Bundesland |
| `country` | `String` | Land |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ZipCodeLookup` (Used) |

The `zipCodeLookup` entity is used for:
- (Geographic data validation and lookups in the UI)

## Entity: Länder (Countries)
Verzeichnis von Ländern für Adressdaten und Feiertagsberechnungen.

### Table: country
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `code` | `String` | schema | Ländercode (ISO) |
| `description` | `String` | schema | Name des Landes |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Country` (Used) |

The `country` entity is used by:
- (Geographic lookup and address validation)

## Entity: Feiertage (Public Holidays)
Definition von gesetzlichen Feiertagen zur Berücksichtigung in der Planung.

### Table: publicHoliday
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `day` | `Date` | schema | Datum des Feiertags |
| `name` | `String` | schema | Name des Feiertags (Freitext) |
| `country` | `String` | schema | Land (e.g. `DE`) |
| `states` | `Array` | inferred | Liste der Bundesländer (Strings) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.PublicHoliday` (Used) |

The `publicHoliday` entity is used by:
- (Planning modules to identify non-working days)

## Entity: Anrufliste (CDR Calls)
Erfasst Details zu getätigten Video- und Audioanrufen (Call Detail Records).

### Table: cDRCall
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `type` | `String` | schema | Art des Anrufs:<br>• `DIRECT` (Used)<br>• `CONFERENCE` (Used)<br>• `FORWARDED` (Used)<br>• `INVALID_MISSING_EXPERT` (Used)<br>• `INVALID_SHORT` (Used)<br>• `INVALID_UNKNOWN` (Used) |
| `dateStart` | `Date` | schema | Startzeitpunkt |
| `dateConnect` | `Date` | schema | Verbindungszeitpunkt |
| `dateDisconnect` | `Date` | schema | Trennungszeitpunkt |
| `duration` | `Long` | schema | Dauer in Sekunden |
| `video` | `Boolean` | inferred | Ob Video genutzt wurde |
| `callingNumber` | `String` | inferred | Anrufende Nummer |
| `connected` | `Boolean` | inferred | Ob eine Verbindung zustande kam |
| `location` | `String` | schema | Ort des Anrufs |
| `userId` | `Long` | inferred | Reference to [user](#entity-experte-expert) |
| `assignmentId` | `Long` | inferred | Reference to [appointmentAssignment](#entity-terminzuweisungen-appointment-assignments) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.CDRCall` (Used) |

The `cDRCall` entity is referenced by:
- [`cDRCallAssignment`](#entity-cdr-call-zuweisungen-cdr-call-assignment) (implicitly linked by time and location)

## Entity: CDR Call Zuweisungen (CDR Call Assignment)
Ordnet CDR-Anrufe bestimmten Terminen oder Konsultationen zu.

### Table: cDRCallAssignment
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `start` | `Date` | schema | Startzeitpunkt |
| `until` | `Date` | schema | Endzeitpunkt |
| `duration` | `Long` | schema | Dauer in Sekunden |
| `locationId` | `Long` | schema | Reference to [location](#entity-standorte-locations) |
| `location` | `String` | schema | Name des Ortes |
| `user` | `Document` | schema | Beteiligter Benutzer ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `state` | `String` | schema | Status der Zuweisung |
| `appointmentId` | `Long" | inferred | Reference to [appointment](#entity-termine-appointments) |
| `consultationId` | `Long" | inferred | Reference to [consultationData](#entity-konsultationsdaten-consultation-data) |
| `confidence` | `Number" | schema | Konfidenzlevel der Zuweisung |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.CDRCallAssignment` (Used) |

The `cDRCallAssignment` entity links calls to:
- [`appointment`](#entity-termine-appointments)
- [`consultationData`](#entity-konsultationsdaten-consultation-data)

## Entity: Kunden (Customers)
Organizational entities (customers) that are assigned to locations and appointment plans.

### Table: customer
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `name` | `String` | schema | Name des Kunden |
| `code` | `String` | schema | Kunden-Code |
| `representative` | `String` | schema | Ansprechpartner |
| `email` | `String` | schema | E-Mail-Adresse |
| `uid` | `String` | schema | Umsatzsteuer-ID |
| `bank` | `String` | schema | Kreditinstitut |
| `bic` | `String` | schema | BIC |
| `iban` | `String` | schema | IBAN |
| `address` | `String` | schema | Straße und Hausnummer |
| `address2` | `String` | schema | Adresszusatz |
| `zip` | `String` | schema | Postleitzahl |
| `city` | `String` | schema | Ort |
| `state` | `String` | schema | Bundesland |
| `country` | `String` | schema | Land |
| `webpage` | `String` | schema | Webseite |
| `phone` | `String` | schema | Telefonnummer |
| `phone2` | `String` | schema | Zweite Telefonnummer |
| `faxNumber` | `String` | schema | Faxnummer |
| `timeframe` | `String` | schema | Abrechnungszeitraum:<br>• `MONTHLY` (Used) |
| `roundingType` | `String` | schema | Rundungsregel:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeExceptions` | `Array` | schema | Ausnahmen von der Rundungsregel |
| `discounts` | `Array` | schema | Liste von Rabatten ([CustomerDiscount](#sub-entity-customerdiscount)) |
| `priceLists` | `Array` | schema | Zugeordnete Preislisten ([CustomerPriceList](#sub-entity-customerpricelist)) |
| `priceListsValid` | `String` | schema | Validierungshinweis für Preislisten (Freitext) |
| `dateCustomer` | `Date` | schema | Kundendatum |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `createdById` | `Long` | schema | Ersteller (Reference to [user](#entity-experte-expert)) |
| `dateChanged` | `Date` | schema | Änderungsdatum |
| `changedById` | `Long` | schema | Geändert von (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Customer` (Used) |

The `customer` entity is referenced by:
- [`appointment`](#entity-termine-appointments)
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `customer` sub-entity)
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers)
- [`location`](#entity-standorte-locations)
- [`project`](#entity-projekte-projects)
- [`treatment`](#entity-behandlungsverlauf-treatment)
- [`locationRoomsDto`](#entity-standort-snapshots-location-rooms-dto)

### Sub-entities for customer

#### Sub-entity: CustomerDiscount
Definition eines kundenindividuellen Rabatts für eine bestimmte Dienstleistung.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `job` | `Long` | schema | Reference ID to [jobId](#entity-dienstleistung-service) |
| `discount` | `Number` | schema | Rabattsatz |
| `comment` | `String` | schema | Kommentar |
| `dateStart` | `Date` | schema | Startdatum |
| `dateUntil` | `Date` | schema | Enddatum |

The `CustomerDiscount` sub-entity is used within:
- [`customer`](#entity-kunden-customers) (as `discounts` array)

#### Sub-entity: CustomerPriceList
Zuweisung einer Preisliste zu einem Kunden mit zeitlicher Gültigkeit.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `priceList` | `Document` | snapshot | Snapshot der Preisliste (enthält `_id` und `name`) |
| `start` | `Date` | schema | Startdatum |
| `until` | `Date` | schema | Enddatum |
| `comment` | `String` | schema | Kommentar |

The `CustomerPriceList` sub-entity is used within:
- [`customer`](#entity-kunden-customers) (as `priceLists` array)

## Entity: Standorte (Locations)
Medizinische Einrichtungen oder Standorte, an denen Konsultationen durchgeführt werden.

### Table: location
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `foreignId` | `String` | schema | Externe ID (JVA) |
| `externalId` | `String` | schema | Externe ID (ZMS) |
| `version` | `Long` | schema | Versionsnummer |
| `uid` | `String` | schema | Umsatzsteuer-ID |
| `type` | `DBRef` | schema | Reference to [locationType](#entity-standorttypen-location-types) |
| `typeEnum` | `String` | schema | Typ als Enum-String |
| `name` | `String` | schema | Name der Einrichtung |
| `building` | `String` | schema | Gebäude |
| `address` | `String` | schema | Adresse |
| `address2` | `String` | schema | Adresszusatz |
| `zip` | `String` | schema | PLZ |
| `city` | `String` | schema | Ort |
| `state` | `String` | schema | Bundesland |
| `country` | `String` | schema | Land |
| `bank` | `String` | schema | Kreditinstitut |
| `bic` | `String` | schema | BIC |
| `iban` | `String` | schema | IBAN |
| `sipAccounts` | `Array` | schema | Liste von SIP-Accounts ([SipAccount](#sub-entity-sipaccount)) |
| `representative` | `String` | schema | Ansprechpartner |
| `phone` | `String` | schema | Telefonnummer |
| `phoneMedical` | `String` | schema | Medizinische Telefonnummer |
| `contactMedical` | `String` | schema | Medizinischer Ansprechpartner |
| `emailMedical` | `String` | schema | Medizinische E-Mail |
| `sip1` | `String` | schema | SIP 1 |
| `sip2` | `String` | schema | SIP 2 |
| `sipMobile` | `String` | schema | SIP Mobil |
| `fax` | `String` | schema | Faxnummer |
| `medicationType` | `String` | schema | Art der Medikation |
| `patientDataType` | `String` | schema | Art der Patientendatenübermittlung:<br>• `EXTERNAL` (Used)<br>• `EXTERNAL_BASISWEB` (Used)<br>• `INTERNAL` (Used)<br>• `INTERNAL_DAV` (Used)<br>• `INTERNAL_SECUREBOX` (Used)<br>• `INTERNAL_VCCLOUD` (Used) |
| `patientDataAccess` | `Document` | schema | Konfiguration für Datenzugriff ([LocationPatientDataAccess](#sub-entity-locationpatientdataaccess)) |
| `booknumberMask` | `String` | schema | Maske für Buchnummern |
| `externalDescription` | `String` | schema | Externe Beschreibung |
| `customer` | `DBRef` | schema | Reference to [customer](#entity-kunden-customers) |
| `longitude` | `Number` | schema | Längengrad |
| `latitude` | `Number` | schema | Breitengrad |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Location` (Used) |

The `location` entity is referenced by:
- [`appointment`](#entity-termine-appointments)
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `location` sub-entity)
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers)
- [`project`](#entity-projekte-projects)
- [`treatment`](#entity-behandlungsverlauf-treatment)
- [`basisWebAppointment`](#entity-web-terminanfragen-basis-web-appointment)
- [`onboardingHistory`](#entity-onboarding-verlauf-onboarding-history)
- [`cDRCallAssignment`](#entity-cdr-call-zuweisungen-cdr-call-assignment)
- [`room`](#entity-r-ume-rooms)
- [`patientData`](#entity-patientenerg-nzungsdaten-patient-data)

### Sub-entities for location

#### Sub-entity: LocationPatientDataAccess
Konfiguration für den Zugriff auf externe Patientendaten (z.B. SecureBox).

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `user` | `String` | schema | Benutzername |
| `password` | `String` | schema | Passwort |
| `url` | `String` | schema | Zugriff-URL |
| `backupUrl` | `String` | schema | Backup-URL |
| `host` | `String` | schema | Host |
| `email` | `String` | schema | E-mail |
| `subject` | `String` | schema | Betreff |
| `active` | `Boolean` | schema | Status des Zugangs |
| `type` | `String` | Art des Datenzugriffs:<br>• `INTERNAL_SECUREBOX` (Used)<br>• `EXTERNAL` (Used) |
| `address` | `String` | URL oder IP-Adresse der SecureBox |
| `port` | `Number` | Portnummer |
| `secure` | `Boolean` | Ob SSL verwendet wird |
| `comment` | `String` | Kommentar zur Konfiguration |

The `LocationPatientDataAccess` sub-entity is used within:
- [`location`](#entity-standorte-locations) (as `patientDataAccess` field)

## Entity: Standorttypen (Location Types)
Kategorisierung von Standorten: `JVA`, `CLINIC`, `POLICE`, etc.

### Table: locationType
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `name` | `String` | schema | Name des Typs:<br>• `JVA` (Used)<br>• `MRV` (Used)<br>• `SHIP` (Used)<br>• `CLINIC` (Used)<br>• `POLICE` (Used)<br>• `OTHER` (Used)<br>• `MUKI` (Used)<br>• `INTERN` (Used)<br>• `KUR` (Used) |
| `description` | `String` | inferred | Beschreibung |
| `prio` | `Number` | schema | Sortierpriorität |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.LocationType` (Used) |

The `locationType` entity is referenced by:
- [`location`](#entity-standorte-locations) (conceptually, though not explicitly shown in schema samples)

## Entity: Seiten/Standorte (Sites)
Allgemeine Informationen zu physischen Standorten oder Web-Präsenzen.

### Table: site
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Name der Seite |
| `address` | `String` | schema | Adresse |
| `zip` | `String` | schema | PLZ |
| `city` | `String` | schema | Ort |
| `primary` | `Boolean` | schema | Hauptstandort Kennzeichnung |
| `dateCreated` | `Date` | inferred | Erstellungsdatum |
| `createdBy` | `DBRef` | inferred | Erstellt von |
| `dateChanged` | `Date` | inferred | Änderungsdatum |
| `changedBy` | `DBRef` | inferred | Geändert von |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Site` (Used) |

The `site` entity is used for:
- (Organizational structure and location grouping)

## Entity: Rechnungen (Invoices)
Zentrale Abrechnungsdokumente für Kunden und Experten.

### Table: invoice
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `no` | `String` | schema | Rechnungsnummer |
| `title` | `String` | schema | Titel |
| `description` | `String` | schema | Beschreibung |
| `cashRegister` | `DBRef` | schema | Reference to [cashRegister](#entity-kassenregistrierung-cash-register) |
| `client` | `Document` | schema | Rechnungsempfänger-Details (Snapshot: [InvoiceClient](#sub-entity-invoiceclient)) |
| `month` | `Number` | schema | Monat |
| `year` | `Number` | schema | Jahr |
| `positions` | `Array` | schema | Rechnungspositionen ([InvoicePosition](#sub-entity-invoiceposition)) |
| `totalNetPrice` | `Number` | schema | Gesamt-Nettopreis |
| `totalPrice` | `Number` | schema | Gesamt-Bruttopreis |
| `taxType` | `String` | schema | Steuerart:<br>• `SATZ_NORMAL` (Used)<br>• `SATZ_NULL` (Used) |
| `taxes` | `Array` | schema | Steuersätze ([InvoiceTax](#sub-entity-invoicetax)) |
| `dateInvoice` | `Date` | schema | Rechnungsdatum |
| `dateSkonto` | `Date` | inferred | Skonto-Datum |
| `dateSubmit` | `Date` | schema | Einreichungsdatum |
| `dateWorklog` | `Date` | inferred | Arbeitsnachweis-Datum |
| `dateCreated` | `Date` | inferred | Erstellungsdatum |
| `createdBy` | `DBRef` | inferred | Erstellt von (Reference to [user](#entity-experte-expert)) |
| `dateChanged` | `Date` | inferred | Änderungsdatum |
| `changedBy` | `DBRef` | inferred | Geändert von (Reference to [user](#entity-experte-expert)) |
| `totalTaxes` | `Number` | inferred | Gesamtsteuer |
| `paidAt` | `Date` | inferred | Bezahlungsdatum |
| `storno` | `DBRef` | inferred | Storno-Referenz (Reference to [invoice](#entity-rechnungen-invoices)) |
| `attachments` | `Array` | inferred | Anhänge ([UserFileMetadata](#sub-entity-userfilemetadata)) |
| `paymentType` | `String` | schema | Zahlungsart:<br>• `CASH` (Used)<br>• `INVOICE` (Used)<br>• `INVOICE_STORNO` (Used) |
| `invoiceType` | `String` | schema | Rechnungstyp:<br>• `EXPERT_INVOICE` (Used)<br>• `INVOICE` (Used)<br>• `START_INVOICE` (Used) |
| `mail` | `String` | schema | E-Mail-Adresse für den Versand |
| `mailSendDate` | `Date` | schema | Versanddatum |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Invoice` (Used) |

The `invoice` entity is referenced by:
- [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers) (implicit link via billing data)
- [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly) (for billing calculations)
- [`stornoGroup`](#entity-stornogruppen-storno-groups) (via cancellation logic)

### Sub-entities for invoice

#### Sub-entity: InvoiceClient
Snapshot der Client-Daten zum Zeitpunkt der Rechnungserstellung.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `name` | `String` | schema | Name |
| `gkto` | `String` | schema | Debitorennummer |
| `firstName` | `String` | schema | Vorname |
| `lastName` | `String" | schema | Nachname |
| `address` | `String` | schema | Adresse |
| `zip` | `String` | schema | PLZ |
| `city` | `String` | schema | Ort |
| `bank` | `String` | schema | Bank |
| `iban` | `String` | schema | IBAN |
| `bic` | `String` | schema | BIC |
| `taxid` | `String` | schema | Steuer-ID |
| `uid` | `String` | schema | Umsatzsteuer-ID |

The `InvoiceClient` sub-entity is used within:
- [`invoice`](#entity-rechnungen-invoices) (as `client` field)

#### Sub-entity: InvoicePosition
Einzelne Position auf einer Rechnung.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `no` | `Number` | schema | Positionsnummer |
| `title` | `String` | schema | Titel |
| `description` | `String` | schema | Beschreibung |
| `amount` | `Number` | schema | Menge |
| `pricePerUnit` | `Number` | schema | Preis pro Einheit |
| `totalPrice` | `Number` | schema | Gesamtpreis der Position |
| `taxType` | `String` | schema | Steuerart:<br>• `SATZ_NORMAL` (Used)<br>• `SATZ_NULL` (Used) |
| `job` | `DBRef` | schema | Reference to [jobId](#entity-dienstleistung-service) |
| `comment` | `String` | schema | Kommentar |

The `InvoicePosition` sub-entity is used within:
- [`invoice`](#entity-rechnungen-invoices) (as `positions` array)

#### Sub-entity: InvoiceTax
Zusammenfassung einer Steuerart auf der Rechnung.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String" | inferred | Internal identifier |
| `taxType` | `String` | schema | Steuerart:<br>• `SATZ_NORMAL` (Used)<br>• `SATZ_NULL` (Used) |
| `value` | `Number` | schema | Steuersatz |
| `sum` | `Number` | schema | Steuersumme |
| `net` | `Number` | schema | Nettosumme |
| `total` | `Number` | schema | Bruttosumme |
| `description` | `String" | schema | Beschreibung |

The `InvoiceTax` sub-entity is used within:
- [`invoice`](#entity-rechnungen-invoices) (as `taxes` array)

## Entity: Rechnungskomponenten (Invoice Components)
Einzelne Bestandteile einer Rechnung, basierend auf Terminen und Konsultationen.

### Table: invoiceComponent
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `start` | `Date` | schema | Startzeitpunkt |
| `priceList` | `Long` | schema | Reference to [jobPriceList](#entity-preislisten-job-price-lists) |
| `customerId` | `Long` | schema | Reference to [customer](#entity-kunden-customers) |
| `locationId` | `Long` | schema | Reference to [location](#entity-standorte-locations) |
| `appointmentId` | `Long` | schema | Reference to [appointment](#entity-termine-appointments) |
| `consultationId` | `Long` | schema | Reference to [consultationData](#entity-konsultationsdaten-consultation-data) |
| `actualPatients` | `Number` | schema | Tatsächliche Anzahl Patienten |
| `billablePatients` | `Number` | schema | Abrechenbare Patienten |
| `payablePatients` | `Number` | schema | Auszahlbare Patienten |
| `billableWorkTime` | `Number` | schema | Abrechenbare Arbeitszeit |
| `payableWorkTime` | `Number` | schema | Auszahlbare Arbeitszeit |
| `billValue` | `Number` | schema | Rechnungsbetrag |
| `payValue` | `Number` | schema | Auszahlungsbetrag |
| `employeeType` | `String` | inferred | Mitarbeitertyp:<br>• `A1` (Used)<br>• `HN2` (Used)<br>• `HONORAR` (Used) |
| `appointmentType` | `String` | inferred | Termintyp:<br>• `APPOINTMENT` (Used)<br>• `SHIFT` (Used)<br>• `TREATMENT` (Used)<br>• `TREATMENT_REPORT` (Used) |
| `stornoType` | `Document` | schema | Stornierungsdetails ([InvoiceComponentStorno](#sub-entity-invoicecomponentstorno)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.InvoiceComponent` (Used) |

The `invoiceComponent` entity is a derived entity used for accounting and is referenced by:
- [`invoice`](#entity-rechnungen-invoices) (implicitly during invoice generation)

### Sub-entities for invoiceComponent

#### Sub-entity: InvoiceComponentStorno
Details zur Stornierung einer Rechnungskomponente.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `name` | `String` | schema | Name des Stornos |
| `percentage` | `Number` | schema | Prozentsatz |
| `stornoTime` | `Long` | schema | Zeitpunkt der Stornierung |
| `comment` | `String` | schema | Kommentar |
| `type` | `String` | schema | Storno-Typ |

The `InvoiceComponentStorno` sub-entity is used within:
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components) (as `stornoType` field)

## Entity: Rechnungsempfänger (Invoice Receivers)
Konfiguration von Empfängern für Rechnungen, inklusive steuerlicher Details und Kontaktinformationen.

### Table: invoiceReceiver
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `customer` | `DBRef` | schema | Reference to [customer](#entity-kunden-customers) |
| `location` | `DBRef` | schema | Reference to [location](#entity-standorte-locations) |
| `name` | `String` | schema | Name des Empfängers |
| `address` | `String` | schema | Straße und Hausnummer |
| `zip` | `String` | schema | PLZ |
| `city` | `String` | schema | Ort |
| `taxType` | `String` | schema | Steuerliche Einordnung:<br>• `SATZ_NORMAL` (Used)<br>• `SATZ_NULL` (Used) |
| `paymentGoal` | `Number` | schema | Zahlungsziel in Tagen |
| `gkto` | `String` | schema | Debitorennummer |
| `mailInvoice` | `Boolean` | inferred | Rechnungsversand per E-Mail |
| `postInvoice` | `Boolean` | inferred | Rechnungsversand per Post |
| `email` | `String` | schema | Primäre E-Mail-Adresse |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.InvoiceReceiver` (Used) |

The `invoiceReceiver` entity is used by:
- (Internal invoice generation processes)

## Entity: Monatliche Expertenarbeit (Expert Work Monthly)
Zusammenfassung der erbrachten Leistungen eines Experten pro Monat zur Abrechnungsvorbereitung.

### Table: expertWorkMonthly
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `year` | `Number` | schema | Jahr |
| `month` | `Number` | schema | Monat |
| `user` | `DBRef` | schema | Reference to [user](#entity-experte-expert) |
| `doctorName` | `String` | schema | Name des Experten |
| `total` | `Number` | schema | Gesamtbetrag |
| `payableWorkTimeTotal` | `Number` | schema | Auszahlbare Arbeitszeit gesamt |
| `payablePatientsTotal` | `Number` | schema | Auszahlbare Patienten gesamt |
| `worklog` | `Array` | schema | Detaillierte Liste der Tätigkeiten ([ExpertWorklogEntry](#sub-entity-expertworklogentry)) |
| `dateCreated` | `Date` | inferred | Erstellungsdatum |
| `dateSent` | `Date` | schema | Sendedatum |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.ExpertWorkMonthly` (Used) |

The `expertWorkMonthly` entity is a summary for experts and is referenced by:
- (Internal billing and payment processes)

### Sub-entities for expertWorkMonthly

#### Sub-entity: ExpertWorklogEntry
Einzelner Eintrag im monatlichen Arbeitsprotokoll eines Experten.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `appointmentId` | `Long` | schema | Reference to [appointment](#entity-termine-appointments) |
| `job` | `DBRef` | schema | Reference to [jobId](#entity-dienstleistung-service) |
| `start` | `Date` | schema | Startzeitpunkt |
| `actualWorkTime` | `Long` | schema | Tatsächliche Arbeitszeit |
| `payableWorkTime` | `Number` | schema | Auszahlbare Arbeitszeit |
| `price` | `Number` | schema | Einzelpreis |
| `total` | `Number` | schema | Gesamtpreis |
| `location` | `String` | schema | Ort |
| `expert` | `Document` | inferred | Snapshot des Experten ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `invoice` | `Document` | inferred | Rechnungs-Snapshot |

The `ExpertWorklogEntry` sub-entity is used within:
- [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly) (as `worklog` array)

## Entity: Dienstleistung (Service)
Defines the types of medical services provided, their billing modalities, and required skills.

### Table: jobId
| Column | Type | Field Type | Description (from all-together.md and DB) |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `title` | `String` | schema | Einen Titel (intern, Experte, Rechnung) |
| `code` | `String` | schema | Eine Kurzbezeichnung |
| `shortcode` | `String` | schema | Ein Buchstabe als Kurzbezeichnung |
| `expertTitle` | `String` | schema | Titel für Experten |
| `remoteCode` | `String` | schema | Externer Code (z.B. Fachrichtung) |
| `color` | `String` | schema | Eine Farbe |
| `type` | `String` | schema | Die Abrechnungsmodalität:<br>• `APPOINTMENT` (Used)<br>• `SHIFT` (Used) |
| `prio` | `Number` | schema | Priorität der Dienstleistung |
| `skillRules` | `Array` | schema | Regeln für benötigte Fähigkeiten ([SkillRule](#sub-entity-skillrule)) |
| `appointmentCondition` | `Document` | schema | Konditionen für Termine ([AppointmentCondition](#sub-entity-appointmentcondition)) |
| `shiftCondition` | `Document` | schema | Konditionen für Bereitschaften ([ShiftCondition](#sub-entity-shiftcondition)) |
| `consultationStandard` | `Boolean` | schema | Normale Konsultation |
| `consultationOnboarding` | `Boolean` | schema | Komplette Zugangsuntersuchung |
| `consultationOnboardingShort` | `Boolean` | schema | Kurze Zugangsuntersuchung |
| `consultationDocument` | `Boolean` | schema | Konsiliarbericht |
| `consultationIncarceration` | `Boolean` | schema | Gewahrsamstauglichkeit |
| `defaultConsultation` | `String` | schema | Vorauswahl für eine Dienstleistung:<br>• `STANDARD` (Used)<br>• `DOCUMENT` (Used)<br>• `EXTERNAL` (Used)<br>• `INCARCERATION` (Used) |
| `defaultFurtherTreatment` | `String` | schema | Voreinstellung für die weitere Behandlung:<br>• `FOLLOW_UP` (Used)<br>• `IF_REQUIRED` (Used) |
| `onCallNumbers` | `Array` | inferred | Rufnummern für Bereitschaften |
| `_class` | `String` | schema | Java Klassenname |

The `jobId` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (as `job` sub-entity)
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan) (as `job` sub-entity)
- [`consultationData`](#entity-konsultationsdaten-consultation-data)
- [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly)
- [`invoice`](#entity-rechnungen-invoices) (in positions)
- [`jobPriceList`](#entity-preislisten-job-price-lists) (as `jobPriceEntries` sub-entities)
- [`treatment`](#entity-behandlungsverlauf-treatment)
- [`customer`](#entity-kunden-customers) (as `discounts` sub-entities)

### Functionality Details
- **Billing Modalities:** "Patienten (Bereitschaft)", "Zeit (Sprechstunde, Therapie)", "Experten+Zeit (Konsil)".
- **Consultation Types:** selectable types include `consultationStandard`, `consultationDocument`, etc.
- **Further Treatment:** Handles "Einweisung", "Wiedervorstellung", "Folgetermin", "Überweisung".

### Sub-entities for jobId

The following structures are used as nested documents within the `jobId` collection.

#### Sub-entity: SkillRule
Defines requirements for expert skills.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `skills` | `Array` | schema | List of DBRefs to the [skill](#entity-fähigkeiten-skills) collection |
| `rule` | `String` | schema | Logical rule for the skills: `ANY_MUST`, `ALL_MUST`, `ANY_WEIGHT`, `ALL_WEIGHT` |

The `SkillRule` sub-entity is used within:
- [`jobId`](#entity-dienstleistung-service) (as `skillRules` array)

#### Sub-entity: PriceDefinition
A reusable structure for defining time-based or condition-based prices. Used in both `AppointmentCondition` and `ShiftCondition`.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `prices` | `Array` | schema | List of price points ([PricePoint](#sub-entity-pricepoint)) |

The `PriceDefinition` sub-entity is used within:
- [`AppointmentCondition`](#sub-entity-appointmentcondition) (via `hourlyPrice` document)
- [`ShiftCondition`](#sub-entity-shiftcondition) (via `priceWeekDay`, `priceWeekNight`, etc.)

#### Sub-entity: PricePoint
An individual price entry with an optional start date.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `comment` | `String` | schema | Description or reason for the price (e.g., "Basis", "Preisanpassung") |
| `price` | `Number` | schema | The price value |
| `dateStart` | `Date` | schema | Optional start date for when this price becomes active |

The `PricePoint` sub-entity is used within:
- [`PriceDefinition`](#sub-entity-pricedefinition) (as `prices` array)

#### Sub-entity: AppointmentCondition
Defines pricing and rounding rules for appointments.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `storno` | `DBRef` | schema | Reference to [stornoGroup](#entity-storno-regelgruppen-storno-groups) |
| `hourlyPrice` | `Document` | schema | Contains multiple [PriceDefinitions](#sub-entity-pricedefinition) (e.g., `priceHN`, `priceHN2`, `priceA1`, `priceA2`) |
| `roundingTypeHN` | `String` | schema | Rounding rule for HN:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeHN2` | `String` | schema | Rounding rule for HN2:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeHN3` | `String` | schema | Rounding rule for HN3:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeA1` | `String` | schema | Rounding rule for A1:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeA2` | `String` | schema | Rounding rule for A2:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeA3` | `String` | schema | Rounding rule for A3:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |

The `AppointmentCondition` sub-entity is used within:
- [`jobId`](#entity-dienstleistung-service) (as `appointmentCondition` field)

#### Sub-entity: ShiftCondition
Defines pricing for shift-based services, categorized by time and day.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Internal identifier |
| `priceWeekDay` | `Document` | schema | [PriceDefinitions](#sub-entity-pricedefinition) for weekdays |
| `priceWeekNight` | `Document` | schema | [PriceDefinitions](#sub-entity-pricedefinition) for week nights |
| `priceWeekendDay` | `Document` | schema | [PriceDefinitions](#sub-entity-pricedefinition) for weekend days |
| `priceWeekendNight` | `Document` | schema | [PriceDefinitions](#sub-entity-pricedefinition) for weekend nights |

The `ShiftCondition` sub-entity is used within:
- [`jobId`](#entity-dienstleistung-service) (as `shiftCondition` field)

## Entity: Preislisten (Job Price Lists)
Versionierte Preislisten für Dienstleistungen mit zeitlicher Gültigkeit.

### Table: jobPriceList
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Name der Preisliste |
| `start` | `Date` | schema | Gültig ab |
| `until` | `Date` | schema | Gültig bis |
| `active` | `Boolean` | schema | Ob die Preisliste aktiv ist |
| `prices` | `Array` | schema | Liste der Einzelpreise ([JobPriceEntry](#sub-entity-jobpriceentry)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.JobPriceList` (Used) |

The `jobPriceList` entity is referenced by:
- [`customer`](#entity-kunden-customers) (in `priceLists`)
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers)

### Sub-entities for jobPriceList

#### Sub-entity: JobPriceEntry
Konkreter Preis für eine bestimmte Dienstleistung innerhalb einer Preisliste.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String" | inferred | Internal identifier |
| `jobId` | `Long` | schema | Reference to [jobId](#entity-dienstleistung-service) |
| `price` | `Number` | schema | Preiswert |
| `roundingType` | `String` | schema | Rundungsregel:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `consultationType` | `String` | Art der Konsultation |
| `currency` | `String` | Währung |

The `JobPriceEntry` sub-entity is used within:
- [`jobPriceList`](#entity-preislisten-job-price-lists) (as `prices` array)

## Entity: Waren (Products)
Items experts can subscribe to.

### Table: product
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `name` | `String` | schema | Name der Ware |
| `description` | `String` | schema | Beschreibung |
| `konto` | `String` | schema | Buchungskonto |
| `bookingCode` | `String` | schema | Buchungsschlüssel |
| `type` | `String` | schema | Typ der Ware |
| `billType` | `String` | schema | Abrechnungsart |
| `price` | `Number` | schema | Preis |
| `active` | `Boolean` | schema | Status (Aktiv/Inaktiv) |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `createdBy` | `DBRef` | schema | Erstellt von (Reference to [user](#entity-experte-expert)) |
| `dateChanged` | `Date` | schema | Änderungsdatum |
| `changedBy` | `DBRef` | schema | Geändert von (Reference to [user](#entity-experte-expert)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Product` (Used) |

The `product` entity is referenced by:
- [`user`](#entity-experte-expert) (in `employerProfile.products`)
- [`invoice`](#entity-rechnungen-invoices) (in `positions`)

## Entity: Kassenregistrierung (Cash Register)
Definition von Abrechnungseinheiten mit spezifischen Steuersätzen und ID-Formaten.

### Table: cashRegister
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `cashRegisterId` | `String` | schema | ID der Kasse |
| `count` | `Long` | schema | Aktueller Zähler für Rechnungsnummern |
| `idFormat` | `String` | inferred | Format der Rechnungs-ID |
| `taxValues` | `Array` | inferred | Verfügbare Steuersätze ([TaxValue](#sub-entity-taxvalue)) |
| `enabled` | `Boolean` | schema | Status |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.CashRegister` (Used) |

The `cashRegister` entity is referenced by:
- [`invoice`](#entity-rechnungen-invoices)

### Sub-entities for cashRegister

#### Sub-entity: TaxValue
Definition eines Steuersatzes.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String" | inferred | Internal identifier |
| `name` | `String` | schema | Bezeichnung |
| `value` | `Number` | schema | Prozentsatz |
| `enabled` | `Boolean` | schema | Status |
| `start` | `Date` | schema | Gültig ab |
| `until` | `Date` | schema | Gültig bis |
| `description` | `String` | schema | Beschreibung |

The `TaxValue` sub-entity is used within:
- [`cashRegister`](#entity-kassenregistrierung-cash-register) (as `taxes` array)

## Entity: Abgeschlossene Zeiträume (Closed Months)
Protokollierung von Abrechnungszeiträumen, die für Änderungen gesperrt wurden.

### Table: closedMonth
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `period` | `Number` | schema | Abgeschlossener Zeitraum (Format: YYYYMM) |
| `comment` | `String` | schema | Kommentar zum Abschluss |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.ClosedMonth` (Used) |

The `closedMonth` entity is used by:
- (System-wide billing and locking processes)

## Entity: Storno-Regelgruppen (Storno Groups)
Zusammenfassungen von Stornierungsregeln für verschiedene Dienstleistungen oder Kunden.

### Table: stornoGroup
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `title` | `String` | inferred | Titel der Gruppe |
| `comment` | `String` | schema | Kommentar |
| `storno` | `Array` | schema | Einzelne Stornierungsregeln ([StornoRule](#sub-entity-stornorule)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.StornoGroup` (Used) |

The `stornoGroup` entity is referenced by:
- [`jobId`](#entity-dienstleistung-service) (via `appointmentCondition.storno`)

### Sub-entities for stornoGroup

#### Sub-entity: StornoRule
Definiert eine spezifische Stornierungsbedingung (Zeitpunkt und Kosten).

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `name` | `String` | schema | Bezeichnung der Regel |
| `stornoTime` | `Long` | schema | Zeitpunkt (in Sekunden/Millisekunden vor Termin) |
| `percentage` | `Number` | schema | Prozentsatz der Kosten |
| `type` | `String` | inferred | Art der Regel |
| `comment` | `String` | schema | Kommentar |

The `StornoRule` sub-entity is used within:
- [`stornoGroup`](#entity-storno-regelgruppen-storno-groups) (as `storno` array)

## Entity: Arbeitszeit-Kategorien (Work Hours)
Definition von standardisierten Arbeitszeit-Modellen oder Stundenkontingenten.

### Table: workHour
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `hours` | `Number` | schema | Anzahl der Stunden |
| `code` | `String` | schema | Kurzcode |
| `description` | `String` | schema | Beschreibung |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.WorkHour` (Used) |

The `workHour` entity is used for:
- (Internal calculation of expert working hours)

## Entity: System-Logs (Logs)
Protokollierung von Systemereignissen, Fehlern und sicherheitsrelevanten Aktionen.

### Table: log
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `ts` | `Date` | schema | Zeitstempel |
| `userId` | `Long` | schema | Reference to [user](#entity-experte-expert) |
| `level` | `String` | schema | Log-Level:<br>• `INFO` (Used)<br>• `ERROR` (Used)<br>• `SECURITY` (Used) |
| `type` | `String` | inferred | Art des Ereignisses:<br>• `CONSULTATION` (Used)<br>• `CONSULTATION_TRANSMIT` (Used)<br>• `CONTACT` (Used) |
| `key` | `String` | inferred | Eindeutiger Schlüssel für das Ereignis |
| `message` | `String` | inferred | Log-Nachricht |
| `param` | `Array` | inferred | Parameter zur Nachricht (Strings) |
| `appointment` | `Long` | schema | Reference to [appointment](#entity-termine-appointments) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Log` (Used) |

The `log` entity stores technical logs and is referenced by:
- (System-wide monitoring tools)

## Entity: Hintergrundaufgaben (Async Job Queue)
Warteschlange für asynchron auszuführende Systemaufgaben.

### Table: asyncJobQueue
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `dateStarted` | `Date` | schema | Startdatum |
| `dateFinished` | `Date` | schema | Fertigstellungsdatum |
| `title` | `String` | schema | Titel der Aufgabe |
| `state` | `String` | schema | Status:<br>• `DONE` (Used)<br>• `ERROR` (Used)<br>• `FINISHED` (Used)<br>• `RUNNING` (Used) |
| `type` | `String` | schema | Art der Aufgabe:<br>• `APPOINTMENTPLAN` (Used)<br>• `INVOICE` (Used)<br>• `SHIFTPLAN` (Used)<br>• `TREATMENT` (Used) |
| `createdBy` | `Document` | schema | Ersteller ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `tasks` | `Array` | schema | Einzelne Teilschritte ([AsyncJobTask](#sub-entity-asyncjobtask)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.AsyncJobQueue` (Used) |

The `asyncJobQueue` entity tracks background tasks for:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)
- [`shiftPlan`](#entity-schichtplan-shift-plan)
- [`invoice`](#entity-rechnungen-invoices)
- [`treatment`](#entity-behandlungsverlauf-treatment)

### Sub-entities for asyncJobQueue

#### Sub-entity: AsyncJobTask
Einzelner Arbeitsschritt innerhalb einer Hintergrundaufgabe.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `title` | `String` | schema | Titel des Arbeitsschritts |
| `status` | `String` | schema | Status des Arbeitsschritts (Freitext/Progress message, e.g. "25/2987/5697 OK") |
| `dateStarted` | `Date` | schema | Startzeitpunkt |
| `dateFinished` | `Date` | schema | Endzeitpunkt |

The `AsyncJobTask` sub-entity is used within:
- [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue)

## Entity: Export-Vorlagen (Export Templates)
Definition von Vorlagen für den Datenexport aus dem System.

### Table: exportTemplate
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Name der Vorlage |
| `filename` | `String` | schema | Standard-Dateiname für den Export |
| `template` | `Document` | schema | Metadaten der Template-Datei ([FileMetadata](#sub-entity-filemetadata)) |
| `type` | `String` | schema | Export-Typ:<br>• `APPOINTMENT` (Used)<br>• `EXPERT` (Used)<br>• `WORKLOG` (Used) |
| `active` | `Boolean` | schema | Status |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.ExportTemplate` (Used) |

The `exportTemplate` entity is used by:
- (Data export modules for generating CSV/PDF reports)

## Entity: Support-Kategorien (Support Categories)
Kategorisierung von Support-Anfragen und deren Zuordnung zu Bearbeitungsschlangen.

### Table: supportCategory
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `category` | `String` | schema | Kategoriename (intern) |
| `title` | `String` | schema | Anzeigename der Kategorie |
| `queue` | `String` | schema | Bearbeitungsschlange (Queue) |
| `subcategories` | `Array` | schema | Liste von Unterkategorien (Strings) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.SupportCategory` (Used) |

The `supportCategory` entity is used for:
- (Internal helpdesk categorization of support tickets)

## Entity: Dateiuploads (Upload Files)
Registry aller über die Benutzeroberfläche hochgeladenen Dateien.

### Table: uploadFile
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `sessionId` | `String` | schema | Session-ID des Uploads |
| `created` | `Long` | schema | Erstellungszeitpunkt (Unix TS) |
| `entry` | `Document` | inferred | Metadaten der Datei ([FileMetadata](#sub-entity-filemetadata)) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.UploadFile` (Used) |

The `uploadFile` entity references:
- (Uploaded files managed by the system)

## Entity: Sequenz-Zähler (Sequence Entity)
Zähler zur Generierung von fortlaufenden IDs für verschiedene Entitäten.

### Table: sequenceEntity
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | schema | Interner Bezeichner |
| `name` | `String` | schema | Name der Sequenz (e.g. Entitätsname) |
| `value` | `Long` | schema | Aktueller Zählerwert |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.SequenceEntity` (Used) |

The `sequenceEntity` entity is used by:
- (Internal ID generation logic for various collections)

## Entity: Systemkonfiguration (Videoclinic System)
Globale Systemeinstellungen und Metadaten.

### Table: videoclinicSystem
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `invoiceIdFormat` | `String` | schema | Globales Format für Rechnungs-IDs |
| `accountManagement` | `Boolean` | schema | Account-Management aktiviert |
| `timeManagement` | `Boolean` | schema | Zeit-Management aktiviert |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.VideoclinicSystem` (Used) |

The `videoclinicSystem` entity is used for:
- (Global system configuration and feature toggles)

## Entity: Cache-Status (Cache State)
Technical collection for tracking the version/state of various system caches.

### Table: cacheState
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | schema | Cache-Bezeichner |
| `version` | `Long` | schema | Aktuelle Version des Caches |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.CacheState` (Used) |

The `cacheState` entity is used for:
- (Internal system performance tracking and cache invalidation)

## Entity: Tags (Tags)
Zentrales Verzeichnis für Tags zur Kategorisierung verschiedener Entitäten.

### Table: tag
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `tag` | `String` | inferred | Tag-Name |
| `type` | `String` | inferred | Tag-Kategorie |
| `count` | `Long` | schema | Verwendungshäufigkeit |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Tag` (Used) |

The `tag` entity is used for:
- (Labeling and filtering various system entities)

## Entity: Projekte (Projects)
Verwaltung von Projekten, die Kunden und Standorten zugeordnet sind.

### Table: project
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `dateStart` | `Date` | schema | Projektstart |
| `dateEnd` | `Date` | schema | Projektende |
| `description` | `String` | schema | Projektbeschreibung |
| `state` | `String` | inferred | Projektstatus |
| `customer` | `DBRef` | inferred | Reference to [customer](#entity-kunden-customers) |
| `location` | `DBRef` | schema | Reference to [location](#entity-standorte-locations) |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Project` (Used) |

The `project` entity is referenced by:
- (Internal project management tools)

## Entity: Abteilungen (Departments)
Definition von organisatorischen Abteilungen.

### Table: department
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `code` | `String` | schema | Abteilungs-Code |
| `description` | `String` | schema | Beschreibung |
| `_class` | `String` | schema | Java Klassenname: `de.videoclinic.model.Department` (Used) |

The `department` entity is used for:
- (Organizational structure within locations)
