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

### Accounting
Entities related to billing, customers, pricing, and financial tracking.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`customer`](#entity-kunden-customers) | Kunden (Customers) | Organizational entities (customers) that are assigned to locations and appointment plans. | `Customer` |
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
Technical configurations, logs, notifications, and system-wide settings.

| Table Name (DBML) | Business Entity | Description Summary | Model (de.videoclinic.model.*) |
| :--- | :--- | :--- | :--- |
| [`notification`](#entity-benachrichtigungen-notifications) | Benachrichtigungen (Notifications) | Logs of notifications sent to users via various channels. | `Notification` |
| [`notificationTemplate`](#entity-benachrichtigungsvorlagen-notification-templates) | Benachrichtigungsvorlagen (Notification Templates) | Reusable templates for automated system notifications. | `NotificationTemplate` |
| [`log`](#entity-system-logs-logs) | System-Logs (Logs) | Technical application logs for monitoring and debugging. | `Log` |
| [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue) | Hintergrundaufgaben (Async Job Queue) | Status and tracking of asynchronous background tasks. | `AsyncJobQueue` |
| [`video`](#entity-videos-videos) | Videos (Videos) | Metadata for instructional or informational videos in the system. | `Video` |
| [`videoCategory`](#entity-videokategorien-video-categories) | Videokategorien (Video Categories) | Categorization for organizing the video library. | `VideoCategory` |
| [`location`](#entity-standorte-locations) | Standorte (Locations) | Definition of consultation sites, including room configurations and contact details. | `Location` |
| [`locationRoomsDto`](#entity-standort-snapshots-location-rooms-dto) | Standort-Snapshots (Location Rooms DTO) | Snapshots of location and room configurations at a specific point in time. | `dto.LocationRoomsDto` |
| [`locationType`](#entity-standorttypen-location-types) | Standorttypen (Location Types) | Classification for different types of consultation locations. | `LocationType` |
| [`room`](#entity-r-ume-rooms) | Räume (Rooms) | Individual consultation or treatment rooms within a location. | `Room` |
| [`site`](#entity-seiten-standorte-sites) | Seiten/Standorte (Sites) | Physical locations or digital sites associated with the system. | `Site` |
| [`department`](#entity-abteilungen-departments) | Abteilungen (Departments) | Medical specialties or organizational departments. | `Department` |
| [`equipment`](#entity-ausr-stung-equipment) | Ausrüstung (Equipment) | Inventory of medical or technical equipment used in consultations. | `Equipment` |
| [`equipmentGroup`](#entity-ausr-stungsgruppen-equipment-groups) | Ausrüstungsgruppen (Equipment Groups) | Grouping of equipment for easier management and assignment. | `EquipmentGroup` |
| [`project`](#entity-projekte-projects) | Projekte (Projects) | Organizational entities used to group related resources or operations. | `Project` |
| [`tag`](#entity-tags-tags) | Tags (Tags) | Metadata tags used for labeling and filtering various system entities. | `Tag` |
| [`exportTemplate`](#entity-export-vorlagen-export-templates) | Export-Vorlagen (Export Templates) | Configuration for data exports for various business entities. | `ExportTemplate` |
| [`messageOfTheDay`](#entity-system-ank-ndigungen-message-of-the-day) | System-Ankündigungen (Message of the Day) | Global announcements displayed to users upon login. | `MessageOfTheDay` |
| [`supportCategory`](#entity-support-kategorien-support-categories) | Support-Kategorien (Support Categories) | Categories used for organizing support requests and help documents. | `SupportCategory` |
| [`uploadFile`](#entity-dateiuploads-upload-files) | Dateiuploads (Upload Files) | Records of generic file uploads managed by the system. | `UploadFile` |
| [`sequenceEntity`](#entity-sequenz-z-hler-sequence-entity) | Sequenz-Zähler (Sequence Entity) | Global counters used to generate unique numeric identifiers. | `SequenceEntity` |
| [`videoclinicSystem`](#entity-systemkonfiguration-videoclinic-system) | Systemkonfiguration (Videoclinic System) | Global system settings and configuration parameters. | `VideoclinicSystem` |
| [`cacheState`](#entity-cache-status-cache-state) | Cache-Status (Cache State) | Technical collection for tracking the version/state of various system caches. | `CacheState` |
| [`userVideoHistory`](#entity-video-verlauf-user-video-history) | Video-Verlauf (User Video History) | Tracking of video call attempts and successful connections. | `UserVideoHistory` |

---

## Collection Name Mapping
This section documents the mapping between original MongoDB collection names and their new business-friendly names used in this document.

| Original Collection Name | New Business Name |
| :--- | :--- |
| `warning` | `patientAlerts` |

---

# Enum Overlaps and Redundancies

This section documents identified overlapping or redundant enums within the `videoclinic.dbml` schema. These overlaps range from identical value sets to subsets where one enum covers a portion of another's domain.

## Identical Overlaps
These enums have exactly the same set of values and could likely be unified.

*   **`appointment_type_enum`** and **`invoiceComponent_appointmentType_enum`**
    *   Values: `{APPOINTMENT, SHIFT, TREATMENT, TREATMENT_REPORT}`
*   **`appointment_priceType_enum`** and **`shiftPlan_priceType_enum`**
    *   Values: `{WEEKDAY, WEEKNIGHT, WEEKENDDAY, WEEKENDNIGHT}`

## Subset / Parent-Child Overlaps
These enums share values, where one is a more specific subset of a broader category.

*   **`Role_Enum`** and **`accessRight_role_enum`**
    *   `Role_Enum`: `{ADMIN, ADMIN_INTERN, ADMIN_KUNDE, KUNDE, LEITER_INTERN, REGISTERED, STANDARD}`
    *   `accessRight_role_enum`: `{ADMIN, GUEST, LEITER_INTERN, REGISTERED, STANDARD}`
    *   *Overlap:* Most roles are shared, but `accessRight` introduces `GUEST` and excludes `ADMIN_INTERN`, `ADMIN_KUNDE`, and `KUNDE`.
*   **`ConsultationBase_furtherTreatment_enum`** and **`jobId_defaultFurtherTreatment_enum`**
    *   `ConsultationBase_furtherTreatment_enum`: `{FOLLOW_UP, IF_REQUIRED, REFERRAL, REFERRAL_OTHER}`
    *   `jobId_defaultFurtherTreatment_enum`: `{FOLLOW_UP, IF_REQUIRED}`
    *   *Overlap:* The latter is a direct subset of the former.
*   **`consultation_state_enum`** and **`consultationData_state_enum`**
    *   `consultation_state_enum`: `{CLOSED, CREATED, OPEN, REPORTED, TRANSMITTED, VERIFIED}`
    *   `consultationData_state_enum`: `{CLOSED, TRANSMITTED}`
    *   *Overlap:* `consultationData` uses a subset of the states defined in the legacy `consultation` table.
*   **`appointment_state_enum`** and **`TreatmentPosition_state_enum`**
    *   `appointment_state_enum`: `{ACTIVE, CANCELED, CLOSED, DONE, LOCKEDIN, READY, REQUESTED, RESCHEDULED, STARTED, STORNO}`
    *   `TreatmentPosition_state_enum`: `{CANCELED, CLOSED, DONE, LOCKEDIN, READY, RESCHEDULED, STORNO}`
    *   *Overlap:* `TreatmentPosition_state_enum` is a subset of `appointment_state_enum`.

## Single-Value Redundancies
These enums currently only contain a single value and often represent a subset of a larger type enum.

*   **`consultationData_appointmentType_enum`** (`{APPOINTMENT}`) is a subset of **`appointment_type_enum`**.
*   **`consultationData_paymentType_enum`** (`{FULL}`) is a subset of **`appointment_paymentType_enum`** (`{EK, FULL, VK, IGNORE}`).
*   **`expertWeek_type_enum`** (`{TREATMENT}`) is conceptually related to **`appointment_type_enum`**.
*   **`treatment_type_enum`** (`{PSYCH}`) is currently limited but may overlap with future specialization enums.
*   **`OnboardingType_Enum`** (`{CHECK}`) and **`TreatmentReport_type_enum`** (`{STANDARD}`).

## Logical Overlaps (Different Naming)
*   **`JobType_Enum`** (`{APPOINTMENT, SHIFT}`) vs **`appointment_type_enum`** (`{APPOINTMENT, SHIFT, TREATMENT, TREATMENT_REPORT}`). The `JobType_Enum` appears to be a high-level classification of the more detailed appointment types.
*   **`consultationData_type_enum`** (`{EXTERNAL, STANDARD}`) vs **`consultation_type_enum`** (`{DOCUMENT, EXTERNAL, INCARCERATION, ONBOARDING, ONBOARDING_SHORT, STANDARD, TREATMENT}`). Both define the nature of a consultation but at different levels of granularity.

---

## Entity: Kunden (Customers)
Organizational entities (customers) that are assigned to locations and appointment plans.

### Table: customer
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `name` | `String` | Name des Kunden |
| `code` | `String` | Kunden-Code |
| `representative` | `String` | Ansprechpartner |
| `email` | `String` | E-Mail-Adresse |
| `uid` | `String` | Umsatzsteuer-ID |
| `bank` | `String` | Kreditinstitut |
| `bic` | `String` | BIC |
| `iban` | `String` | IBAN |
| `address` | `String` | Straße und Hausnummer |
| `address2` | `String` | Adresszusatz |
| `zip` | `String` | Postleitzahl |
| `city` | `String` | Ort |
| `state` | `String` | Bundesland |
| `country` | `String` | Land |
| `webpage` | `String` | Webseite |
| `phone` | `String` | Telefonnummer |
| `phone2` | `String` | Zweite Telefonnummer |
| `faxNumber` | `String` | Faxnummer |
| `timeframe` | `String` | Abrechnungszeitraum:<br>• `MONTHLY` (Used) |
| `roundingType` | `String` | Rundungsregel:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeExceptions` | `Array` | Ausnahmen von der Rundungsregel |
| `discounts` | `Array` | Liste von Rabatten ([CustomerDiscount](#sub-entity-customerdiscount)) |
| `priceLists` | `Array` | Zugeordnete Preislisten ([CustomerPriceList](#sub-entity-customerpricelist)) |
| `priceListsValid` | `String` | Validierungshinweis für Preislisten (Freitext) |
| `dateCustomer` | `Date` | Kundendatum |
| `dateCreated` | `Date` | Erstellungsdatum |
| `createdById` | `Long` | Ersteller (Referenz auf `user`) |
| `dateChanged` | `Date` | Änderungsdatum |
| `changedById` | `Long` | Geändert von (Referenz auf `user`) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Customer` (Used) |

### Cross-references
The `customer` entity is referenced by:
- [`appointment`](#entity-termine-appointments)
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)
- [`consultationData`](#entity-konsultationsdaten-consultation-data)
- [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers)
- [`location`](#entity-standorte-locations)
- [`project`](#entity-projekte-projects)
- [`treatment`](#entity-behandlungsverlauf-treatment)
- [`locationRoomsDto`](#entity-standort-snapshots-location-rooms-dto)

### Sub-entities for customer

#### Sub-entity: CustomerDiscount
Definition eines kundenindividuellen Rabatts für eine bestimmte Dienstleistung.

| Column | Type | Description |
| :--- | :--- | :--- |
| `job` | `Long` | Referenz ID auf `jobId` |
| `discount` | `Number` | Rabattsatz |
| `comment` | `String` | Kommentar |
| `dateStart` | `Date` | Startdatum |
| `dateUntil` | `Date` | Enddatum |

### Cross-references
The `CustomerDiscount` sub-entity is used within:
- [`customer`](#entity-kunden-customers) (as `discounts` array)

#### Sub-entity: CustomerPriceList
Zuweisung einer Preisliste zu einem Kunden mit zeitlicher Gültigkeit.

| Column | Type | Description |
| :--- | :--- | :--- |
| `priceList` | `Document` | Snapshot der Preisliste (enthält `_id` und `name`) |
| `start` | `Date` | Startdatum |
| `until` | `Date` | Enddatum |
| `comment` | `String` | Kommentar |

### Cross-references
The `CustomerPriceList` sub-entity is used within:
- [`customer`](#entity-kunden-customers) (as `priceLists` array)

---

## Entity: Sprechstundenplan (Appointment Plan)
The appointment plan defines the schedule for consultation hours, including services, recurrence rules, assigned experts, locations, and customers.

### Table: appointmentPlan
| Column | Type | Description (from all-together.md) |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `name` | `String` | Ein Name für den Plan (Freitext) |
| `job` | `Document` | Eine Dienstleistung ([PlanJob](#sub-entity-planjob)) |
| `day` | `String` | Einen Wochentag:<br>• `MO` (Used)<br>• `TU` (Used)<br>• `WE` (Used)<br>• `TH` (Used)<br>• `FR` (Used) |
| `startDate` | `Date` | Ein Startdatum |
| `endDate` | `Date` | Einen Enddatum |
| `lastDate` | `Date` | Ein Datum der letzten Wiederholung |
| `count` | `Number` | Einer Anzahl von Wiederholungen |
| `scheduling` | `String` | Die Eigenschaft der Wiederholung:<br>• `WEEKLY`: Wöchentlich (Used)<br>• `XOFMONTH`: jeder x-te Tag im Monat (Used)<br>• `FIRST_DAY_MONTH`: Erster Tag im Monats (Not used)<br>• `DAY_MONTH`: Tag im Monat (Not used)<br>• `LAST_DAY_MONTH`: Letzter Tag im Monat (Not used) |
| `schedulingMulitplier` | `Number` | Multiplikator für die Wiederholung |
| `timeStart` | `Number` | Einer Startuhrzeit (Format: HHmm, z.B. 930 für 09:30) |
| `timeEnd` | `Number` | Eine Enduhrzeit (Format: HHmm, z.B. 1200 für 12:00) |
| `doctor` | `Document` | Einen zugewiesenen Experten ([PlanUser](#sub-entity-planuser)) |
| `location` | `Document` | Einen zugewiesenen Ort ([PlanLocation](#sub-entity-planlocation)) |
| `comment` | `String` | Einem Kommentar (Freitext) |
| `expertOnly` | `Boolean` | Gibt an, ob nur der zugewiesene Experte die Dienstleistung erbringen kann |
| `dateCreated` | `Date` | Erstellungsdatum |
| `createdBy` | `Document/DBRef` | Ersteller ([PlanUser](#sub-entity-planuser)) |
| `dateChanged` | `Date` | Änderungsdatum |
| `changedBy` | `Document/DBRef` | Ändernder ([PlanUser](#sub-entity-planuser)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.AppointmentPlan` (Used) |

### Cross-references
The `appointmentPlan` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (via `planId`)
- [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue) (via `type`)

### Functionality Details
- **Recurrence rules:** The `scheduling` field maps to "Wöchentlich", "Erster Tag im Monats", "jeder x-te Tag im Monat", "Tag im Monat", "Letzter Tag im Monat" (Only `WEEKLY` and `XOFMONTH` currently in use).
- **Time Format:** `timeStart` and `timeEnd` use a numeric representation of time (e.g., 900 = 09:00, 1500 = 15:00).
- **Expert restriction:** `expertOnly` (Boolean) indicates if only the assigned expert can perform the service.

### Sub-entities for appointmentPlan

The following structures are used as nested documents within the `appointmentPlan` collection.

#### Sub-entity: PlanJob
A snapshot of the assigned service.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | ID of the job |
| `code` | `String` | Short code (Systematische Kodierung) |
| `color` | `String` | HEX color code |
| `expertTitle` | `String` | Title for experts (Freitext) |
| `remoteCode` | `String` | External code (Systematische Kodierung) |
| `title` | `String` | Service title (Freitext) |
| `type` | `String` | Job type: `APPOINTMENT` (Used) |

### Cross-references
The `PlanJob` sub-entity is used within:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)

#### Sub-entity: PlanUser
A snapshot of a user (doctor, creator, etc.).

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | User ID |
| `name` | `String` | Full name (Freitext) |
| `email` | `String` | Email address (Freitext) |
| `formalDisplayName` | `String` | Formal display name (Freitext) |

### Cross-references
The `PlanUser` sub-entity is used within:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)

#### Sub-entity: PlanLocation
A snapshot of the location.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Location ID |
| `name` | `String` | Location name (Freitext) |
| `booknumberMask` | `String` | Mask for booking numbers (Strukturierter Text) |
| `patientDataType` | `String` | Data type: `EXTERNAL`, `INTERNAL_VCCLOUD`, etc. ([Location.patientDataType](#entity-standorte-locations)) |
| `customer` | `Document` | Assigned customer ([PlanCustomer](#sub-entity-plancustomer)) |

### Cross-references
The `PlanLocation` sub-entity is used within:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)

#### Sub-entity: PlanCustomer
A snapshot of the customer.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Customer ID |
| `name` | `String` | Customer name (Freitext) |

### Cross-references
The `PlanCustomer` sub-entity is used within:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan) (nested in `location`)

---

## Entity: Dienstleistung (Service)
Defines the types of medical services provided, their billing modalities, and required skills.

### Table: jobId
| Column | Type | Description (from all-together.md and DB) |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `title` | `String` | Einen Titel (intern, Experte, Rechnung) |
| `code` | `String` | Eine Kurzbezeichnung |
| `shortcode` | `String` | Ein Buchstabe als Kurzbezeichnung |
| `expertTitle` | `String` | Titel für Experten |
| `remoteCode` | `String` | Externer Code (z.B. Fachrichtung) |
| `color` | `String` | Eine Farbe |
| `type` | `String` | Die Abrechnungsmodalität:<br>• `APPOINTMENT` (Used)<br>• `SHIFT` (Used) |
| `prio` | `Number` | Priorität der Dienstleistung |
| `skillRules` | `Array` | Regeln für benötigte Fähigkeiten ([SkillRule](#sub-entity-skillrule)) |
| `appointmentCondition` | `Document` | Konditionen für Termine ([AppointmentCondition](#sub-entity-appointmentcondition)) |
| `shiftCondition` | `Document` | Konditionen für Bereitschaften ([ShiftCondition](#sub-entity-shiftcondition)) |
| `consultationStandard` | `Boolean` | Normale Konsultation |
| `consultationOnboarding` | `Boolean` | Komplette Zugangsuntersuchung |
| `consultationOnboardingShort` | `Boolean` | Kurze Zugangsuntersuchung |
| `consultationDocument` | `Boolean` | Konsiliarbericht |
| `consultationIncarceration` | `Boolean` | Gewahrsamstauglichkeit |
| `defaultConsultation` | `String` | Vorauswahl für eine Dienstleistung |
| `defaultFurtherTreatment` | `String` | Voreinstellung für die weitere Behandlung:<br>• `FOLLOW_UP` (Used)<br>• `IF_REQUIRED` (Used) |
| `_class` | `String` | Java Klassenname |

### Cross-references
The `jobId` entity is referenced by:
- [`appointment`](#entity-termine-appointments)
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)
- [`consultationData`](#entity-konsultationsdaten-consultation-data)
- [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly)
- [`invoice`](#entity-rechnungen-invoices) (in positions)
- [`jobPriceList`](#entity-preislisten-job-price-lists)
- [`treatment`](#entity-behandlungsverlauf-treatment)

### Functionality Details
- **Billing Modalities:** "Patienten (Bereitschaft)", "Zeit (Sprechstunde, Therapie)", "Experten+Zeit (Konsil)".
- **Consultation Types:** selectable types include `consultationStandard`, `consultationDocument`, etc.
- **Further Treatment:** Handles "Einweisung", "Wiedervorstellung", "Folgetermin", "Überweisung".

### Sub-entities for jobId

The following structures are used as nested documents within the `jobId` collection.

#### Sub-entity: SkillRule
Defines requirements for expert skills.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `skills` | `Array` | List of DBRefs to the `skill` collection |
| `rule` | `String` | Logical rule for the skills: `ANY_MUST`, `ALL_MUST`, `ANY_WEIGHT`, `ALL_WEIGHT` |

### Cross-references
The `SkillRule` sub-entity is used within:
- [`jobId`](#entity-dienstleistung-service) (as `skillRules` array)

#### Sub-entity: PriceDefinition
A reusable structure for defining time-based or condition-based prices. Used in both `AppointmentCondition` and `ShiftCondition`.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `prices` | `Array` | List of price points ([PricePoint](#sub-entity-pricepoint)) |

### Cross-references
The `PriceDefinition` sub-entity is used within:
- [`AppointmentCondition`](#sub-entity-appointmentcondition) (via `hourlyPrice` document)
- [`ShiftCondition`](#sub-entity-shiftcondition) (via `priceWeekDay`, `priceWeekNight`, etc.)

#### Sub-entity: PricePoint
An individual price entry with an optional start date.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `comment` | `String` | Description or reason for the price (e.g., "Basis", "Preisanpassung") |
| `price` | `Number` | The price value |
| `dateStart` | `Date` | Optional start date for when this price becomes active |

### Cross-references
The `PricePoint` sub-entity is used within:
- [`PriceDefinition`](#sub-entity-pricedefinition) (as `prices` array)

#### Sub-entity: AppointmentCondition
Defines pricing and rounding rules for appointments.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `storno` | `DBRef` | Reference to a `stornoGroup` |
| `hourlyPrice` | `Document` | Contains multiple [PriceDefinitions](#sub-entity-pricedefinition) (e.g., `priceHN`, `priceHN2`, `priceA1`, `priceA2`) |
| `roundingTypeHN` | `String` | Rounding rule for HN:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeHN2` | `String` | Rounding rule for HN2:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeHN3` | `String` | Rounding rule for HN3:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeA1` | `String` | Rounding rule for A1:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeA2` | `String` | Rounding rule for A2:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeA3` | `String` | Rounding rule for A3:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |

### Cross-references
The `AppointmentCondition` sub-entity is used within:
- [`jobId`](#entity-dienstleistung-service) (as `appointmentCondition` field)

#### Sub-entity: ShiftCondition
Defines pricing for shift-based services, categorized by time and day.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `priceWeekDay` | `Document` | [PriceDefinitions](#sub-entity-pricedefinition) for weekdays |
| `priceWeekNight` | `Document` | [PriceDefinitions](#sub-entity-pricedefinition) for week nights |
| `priceWeekendDay` | `Document` | [PriceDefinitions](#sub-entity-pricedefinition) for weekend days |
| `priceWeekendNight` | `Document` | [PriceDefinitions](#sub-entity-pricedefinition) for weekend nights |

### Cross-references
The `ShiftCondition` sub-entity is used within:
- [`jobId`](#entity-dienstleistung-service) (as `shiftCondition` field)

---

## Entity: Fähigkeiten (Skills)
Defines the qualifications required by experts.

### Table: skill
| Column | Type | Description (from all-together.md) |
| :--- | :--- | :--- |
| `code` | `String` | Eine Bezeichnung der Fähigkeit |
| `description` | `String` | Eine Beschreibung |
| `type` | `String` | Art der Fähigkeit:<br>• `ADDITIONAL` (Used)<br>• `EXTRA` (Used)<br>• `LANGUAGE` (Used)<br>• `MAIN` (Used) |
| `certified` | `Boolean` | Ob für die Fähigkeit ein Zertifikat benötigt wird |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Skill` (Used) |

### Cross-references
The `skill` entity is referenced by:
- [`user`](#entity-benutzer-users) (via `EmployeeProfile.skills`)
- [`jobId`](#entity-dienstleistung-service) (via `SkillRule.skills`)

---

## Entity: Patientenbezogene Risikofaktoren / Warnhinweise (Patient Alerts)
Patient-related risk factors or alerts that can be assigned to patients.

### Table: patientAlerts (former: warning)
| Column | Type | Description (from all-together.md) |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `name` | `String` | Eine Bezeichnung des Ausschlusskriteriums (Warnhinweis) |
| `type` | `String` | Art des Warnhinweises:<br>• `ALLERGY` (Used)<br>• `CONSPICIOUS` (Used)<br>• `INFECTION` (Used)<br>• `OTHER` (Used) |
| `entryRequirement` | `Boolean` | Ob das Ausschlusskriterium aktiv oder deaktiviert ist |
| `documentationRequirement` | `Boolean` | Ob eine Dokumentationspflicht besteht |
| `description` | `String` | Eine Beschreibung |
| `priority` | `Number` | Eine Gewichtung als Zahl |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Warning` (Used) |

### Cross-references
The `patientAlerts` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (in `warnings`)

---

## Entity: Experte (Expert)
Personal and professional data for medical experts.

### Table: user
| Column | Type | Description (from all-together.md) |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `username` | `String` | Benutzername für den Login |
| `email` | `String` | Primäre E-Mail-Adresse |
| `password` | `String` | Persönliches Passwort |
| `enabled` | `Boolean` | Ob das Konto aktiv oder deaktiviert ist |
| `accountLocked` | `Boolean` | Ob das Konto gesperrt ist |
| `role` | `String` | Rolle des Benutzers:<br>• `ADMIN`<br>• `ADMIN_INTERN`<br>• `ADMIN_KUNDE`<br>• `KUNDE`<br>• `LEITER_INTERN`<br>• `REGISTERED`<br>• `STANDARD` |
| `employeeState` | `String` | Status des Kontos:<br>• `ACTIVE`<br>• `CUSTOMER`<br>• `INACTIVE`<br>• `UNCONFIRMED` |
| `userProfile` | `Document` | Persönliches Profil des Benutzers ([UserProfile](#sub-entity-userprofile)) |
| `employeeProfile` | `Document` | Berufliches Profil des Experten ([EmployeeProfile](#sub-entity-employeeprofile)) |
| `employerProfile` | `Document` | Profil des Arbeitgebers/Abrechnungsdaten ([EmployerProfile](#sub-entity-employerprofile)) |
| `dateChanged` | `Date` | Änderungsdatum |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.User` (Used) |

### Cross-references
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

### Functionality Details
- **Availability:** Managed via `expertDays` collection (mapped from "Jahreskalender eines Experten").
- **Account Status:** `employeeState` includes `ACTIVE`, `CUSTOMER`, `INACTIVE`, `UNCONFIRMED`.
- **Focus and Hingabe:** Focus levels for `shift`, `appointment`, and `therapy` are stored in `employeeProfile`.
- **Certifications:** Documents for skills are stored in `employeeProfile.skills[].certification`.

### Sub-entities for user

The following structures are used as nested documents within the `user` collection.

#### Sub-entity: UserProfile
Contains personal information and general settings for the user.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier (often UUID if present, otherwise nested) |
| `firstName` | `String` | Vorname |
| `lastName` | `String` | Nachname |
| `displayName` | `String` | Vollständiger Name für die Anzeige |
| `title` | `String` | Akademischer Titel |
| `salutation` | `String` | Anrede (`MALE`, `FEMALE`) |
| `gender` | `String` | Geschlecht |
| `birthday` | `Date` | Geburtsdatum |
| `mainAddress` | `Document` | Rechnungsadresse ([Address](#sub-entity-address)) |
| `workPhone` | `String` | Telefonnummer (Arbeit) |
| `cellularNumber` | `String` | Handynummer |
| `shiftPhoneNumber` | `String` | Telefonnummer für die Bereitschaft |
| `notificationPerMail` | `Boolean` | Weiterleitung von Nachrichten an E-Mail |
| `exludedNotifications` | `Array` | Liste deaktivierter Benachrichtigungstypen (Strings: `APPOINTMENT_ACCEPTED`, `APPOINTMENT_ASSIGNED`, `APPOINTMENT_CANCELED`, `APPOINTMENT_DELETED`, `APPOINTMENT_DONE`, `APPOINTMENT_EXPERT_AGREED`, `APPOINTMENT_EXPERT_CANCELED`, `APPOINTMENT_EXPERT_DISAGREED`, `APPOINTMENT_REJECTED`, `APPOINTMENT_REMINDER`, `APPOINTMENT_REQUEST`, `APPOINTMENT_RESERVED`, `APPOINTMENT_UPCOMING`, `CONSULATION_SUBMIT`, `COUNCIL_START`, `COUNCIL_SUBMIT`, `EXPERT_SUMMARY`, `INVOICE_CUSTOMER`, `TEMPLATE`, `USER_PASSWORD`) |

### Cross-references
The `UserProfile` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `userProfile` field)

#### Sub-entity: Address
A reusable structure for postal addresses.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Internal identifier |
| `name` | `String` | Name des Empfängers |
| `address` | `String` | Straße und Hausnummer |
| `address2` | `String` | Adresszusatz |
| `zip` | `String` | Postleitzahl |
| `city` | `String` | Ort |
| `state` | `String` | Bundesland |
| `country` | `String` | Land |
| `type` | `String` | Art der Adresse:<br>• `PRIVATE` (Used)<br>• `WORK` (Used)<br>• `PRAXIS` (Used)<br>• `OTHER` (Used) |

### Cross-references
The `Address` sub-entity is used within:
- [`UserProfile`](#sub-entity-userprofile) (as `mainAddress` field)
- [`EmployerProfile`](#sub-entity-employerprofile) (as `billingAddress` field)
- [`customer`](#entity-kunden-customers) (as `mainAddress` field)

#### Sub-entity: EmployeeProfile
Contains professional qualifications and payment details for the expert.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `email2` | `String` | Sekundäre E-Mail-Adresse |
| `activeSince` | `Date` | Ab wann der Experte als Arzt tätig ist |
| `bank` | `String` | Kreditinstitut |
| `iban` | `String` | IBAN |
| `bic` | `String` | BIC |
| `taxid` | `String` | Steuer-ID |
| `uid` | `String` | Umsatzsteuernummer |
| `mailInvoice` | `Boolean` | E-Mail-Rechnung senden |
| `postInvoice` | `Boolean` | Post-Rechnung senden |
| `shift` | `String` | Bereitschaftsdienst Fokus (`NONE`, `LOW`, `MEDIUM`, `HIGH`) |
| `appointment` | `String` | Sprechstunde Fokus |
| `therapy` | `String` | Therapie Fokus |
| `skills` | `Array` | Liste der erlangten Fähigkeiten ([SkillAssignment](#sub-entity-skillassignment)) |
| `imageSignature` | `Document` | Bild mit der Unterschrift ([FileMetadata](#sub-entity-filemetadata)) |
| `bayernBoxAccess` | `Document` | Zugangsdaten SecureBox (user/password) |

### Cross-references
The `EmployeeProfile` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `employeeProfile` field)

#### Sub-entity: SkillAssignment
Maps a specific skill to the expert with certification details.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `skill` | `DBRef` | Referenz auf die `skill` Kollektion |
| `active` | `Boolean` | Ob die Fähigkeit für den Experten aktiv ist |
| `dateCertification` | `Date` | Datum, ab wann die Fähigkeit erlangt wurde |
| `certification` | `Document` | Zertifikatsdatei ([FileMetadata](#sub-entity-filemetadata)) |

### Cross-references
The `SkillAssignment` sub-entity is used within:
- [`EmployeeProfile`](#sub-entity-employeeprofile) (as `skills` array)

#### Sub-entity: EmployerProfile
Contains contract details and billing information related to Videoclinic.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `konto` | `String` | Debitorenkonto (GKTK) |
| `gkto` | `String` | Debitorennummer (GKTO) |
| `efn` | `String` | Einheitliche Fortbildungsnummer (EFN) |
| `level` | `String` | Qualifikationsniveau (`ONBOARDING`, `BEGINNER`, etc.) |
| `activeSinceVC` | `Date` | Ab wann for Videoclinic tätig |
| `activeUntilVC` | `Date` | Bis wann for Videoclinic tätig |
| `products` | `Array` | Liste abonnierter Waren ([SubscribedProduct](#sub-entity-subscribedproduct)) |
| `sipAccounts` | `Array` | Liste von SIP-Accounts |

### Cross-references
The `EmployerProfile` sub-entity is used within:
- [`user`](#entity-experte-expert) (as `employerProfile` field)

#### Sub-entity: SubscribedProduct
A product or service the expert has subscribed to.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `product` | `DBRef` | Referenz auf die `product` Kollektion |
| `amount` | `Number` | Anzahl/Menge |
| `start` | `Date` | Startdatum |
| `until` | `Date` | Enddatum |
| `adjustedPrice` | `Number` | Angebotspreis |
| `description` | `String` | Beschreibung |
| `comment` | `String` | Kommentar |

### Cross-references
The `SubscribedProduct` sub-entity is used within:
- [`EmployerProfile`](#sub-entity-employerprofile) (as `products` array)

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

### Cross-references
The `FileMetadata` sub-entity is used within:
- [`EmployeeProfile`](#sub-entity-employeeprofile) (as `imageSignature`)
- [`SkillAssignment`](#sub-entity-skillassignment) (as `certification`)
- [`uploadFile`](#entity-dateiuploads-upload-files) (as `data`)
- [`video`](#entity-videos-videos) (as `file` and `preview`)
- [`exportTemplate`](#entity-export-vorlagen-export-templates) (as `template`)

---

## Entity: Waren (Products)
Items experts can subscribe to.

### Table: product
| Column | Type | Description (from all-together.md) |
| :--- | :--- | :--- |
| `active` | `Boolean` | Status |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Product` (Used) |

### Cross-references
The `product` entity is referenced by:
- [`user`](#entity-experte-expert) (in `employerProfile.products`)
- [`invoice`](#entity-rechnungen-invoices) (in `positions`)

---

## Entity: Konsultationsdaten (Consultation Data)
Die Konsultationsdaten erfassen alle medizinischen Informationen, die während einer Konsultation dokumentiert werden, einschließlich Anamnese, Befund, Diagnose und Medikation.

### Table: consultationData
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `date` | `Date` | Datum der Konsultation |
| `timeStart` | `Number` | Startuhrzeit (Sekunden seit Mitternacht) |
| `timeEnd` | `Number` | Enduhrzeit (Sekunden seit Mitternacht) |
| `dateSignedOff` | `Date` | Datum der Abzeichnung |
| `archived` | `Boolean` | Archivierungsstatus |
| `type` | `String` | Typ der Konsultation:<br>• `EXTERNAL` (Used)<br>• `STANDARD` (Used) |
| `state` | `String` | Status:<br>• `CLOSED` (Used)<br>• `TRANSMITTED` (Used) |
| `base` | `Document` | Basiselemente ([ConsultationBase](#sub-entity-consultationbase)) |
| `body` | `Document` | Körperliche Basisdaten ([ConsultationBody](#sub-entity-consultationbody)) |
| `warnings` | `Array` | Warnhinweise ([ConsultationWarning](#sub-entity-consultationwarning)) |
| `onboarding` | `Document` | Daten der Erstuntersuchung ([ConsultationOnboarding](#sub-entity-consultationonboarding)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ConsultationData` (Used) |
| `standard` | `Document` | Daten einer Standard-Konsultation ([ConsultationStandard](#sub-entity-consultationstandard)) |
| `signedOffBy` | `DBRef` | Abgezeichnet von (Referenz auf `user`) |
| `appointment` | `DBRef` | Zugehöriger Termin (Referenz auf `appointment`) |
| `location` | `Document` | Ort der Konsultation ([ConsultationLocation](#sub-entity-consultationlocation)) |
| `period` | `Number` | Abrechnungszeitraum |
| `appointmentType` | `String` | Termintyp:<br>• `APPOINTMENT` (Used) |
| `customer` | `Document` | Zugehöriger Kunde ([ConsultationCustomer](#sub-entity-consultationcustomer)) |
| `job` | `Document` | Erbrachte Dienstleistung ([ConsultationJob](#sub-entity-consultationjob)) |
| `paymentType` | `String` | Zahlungsart:<br>• `FULL` (Used) |
| `basisWebDataId` | `Long` | Referenz auf `basisWebData` |

### Cross-references
The `consultationData` entity is referenced by:
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`log`](#entity-system-logs-logs)
- [`questionaire`](#entity-qualit-tsumfragen-questionaires)
- [`treatment`](#entity-behandlungsverlauf-treatment) (in `positions.report`)
- [`cDRCallAssignment`](#entity-cdr-call-zuweisungen-cdr-call-assignment)

### Sub-entities for consultationData

#### Sub-entity: ConsultationBase
Basiselemente der Konsultation.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `medicalTrainedPersonel` | `Boolean` | Medizinisch geschultes Personal anwesend |
| `timeContact` | `Number` | Kontaktzeit |
| `communicationType` | `String` | Art der Kommunikation:<br>• `VIDEO` (Used) |
| `furtherTreatment` | `String` | Voreinstellung für die weitere Behandlung:<br>• `FOLLOW_UP` (Used)<br>• `IF_REQUIRED` (Used)<br>• `REFERRAL` (Used)<br>• `REFERRAL_OTHER` (Used) |
| `dateFurtherTreatment` | `Date` | Datum der weiteren Behandlung |
| `history` | `Document` | Medizinische Historie ([ConsultationHistory](#sub-entity-consultationhistory)) |

### Cross-references
The `ConsultationBase` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `base` field)

#### Sub-entity: ConsultationBody
Körperliche Basisdaten des Patienten zum Zeitpunkt der Konsultation.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `gender` | `String` | Geschlecht |
| `age` | `Number` | Alter |
| `birthday` | `Date` | Geburtsdatum |
| `bodyHeight` | `Number` | Körpergröße |
| `bodyWeight` | `Number` | Körpergewicht |
| `rr` | `String` | Blutdruck (RR) |
| `pulse` | `String` | Puls |

### Cross-references
The `ConsultationBody` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `body` field)
- [`expertConsultationTemplate`](#entity-konsultationsvorlagen-expert-consultation-templates) (as `body` field)

#### Sub-entity: ConsultationWarning
Warnhinweise für den Patienten.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `warning` | `DBRef` | Referenz auf den Warnhinweis ([patientAlerts](#table-patientalerts-former-warning)) |
| `comment` | `String` | Kommentar |
| `applies` | `Boolean` | Trifft zu |
| `dateStart` | `Date` | Startdatum |

### Cross-references
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

### Cross-references
The `ConsultationOnboarding` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `onboarding` field)
- [`expertConsultationTemplate`](#entity-konsultationsvorlagen-expert-consultation-templates) (as `onboarding` field)

#### Sub-entity: ConsultationStandard
Dokumentation einer Standard-Konsultation.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `medicationAnamnesis` | `Document` | Zusammenfassung der Medikation ([ConsultationMedicationAnamnesis](#sub-entity-consultationmedicationanamnesis)) |
| `anamnesis` | `Array` | Anamnese Einträge ([ConsultationAnamnesis](#sub-entity-consultationanamnesis)) |
| `patientReport` | `Array` | Befundberichte ([ConsultationPatientReport](#sub-entity-consultationpatientreport)) |
| `diagnosis` | `Array` | Diagnosen ([ConsultationDiagnosis](#sub-entity-consultationdiagnosis)) |
| `procedureReport` | `String` | Prozedurenbericht |
| `prescription` | `Array` | Verschreibungen ([ConsultationPrescription](#sub-entity-consultationprescription)) |
| `workIncapacity` | `Array` | Arbeitsunfähigkeit ([ConsultationWorkIncapacity](#sub-entity-consultationworkincapacity)) |
| `referralTo` | `String` | Überweisung an |
| `furtherTreatment` | `String` | Voreinstellung für die weitere Behandlung (mapped to [ConsultationBase.furtherTreatment](#sub-entity-consultationbase)) |

### Cross-references
The `ConsultationStandard` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `standard` field)
- [`expertConsultationTemplate`](#entity-konsultationsvorlagen-expert-consultation-templates) (as `standard` field)

#### Sub-entity: ConsultationMedicationAnamnesis
Zusammenfassung der Medikationsanamnese mit Kategorisierung.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `documentation` | `String` | Dokumentation der Medikation |
| `categoryA01` | `Boolean` | Kategorie A01 |
| `categoryB01` | `Boolean` | Kategorie B01 |
| `categoryJ05` | `Boolean` | Kategorie J05 |
| `categoryN06` | `Boolean` | Kategorie N06 |
| `categoryC09` | `Boolean` | Kategorie C09 |
| `categoryC10` | `Boolean` | Kategorie C10 |
| `categoryN02` | `Boolean` | Kategorie N02 |
| `categoryN05` | `Boolean` | Kategorie N05 |
| `categoryR03` | `Boolean` | Kategorie R03 |
| `categoryA02` | `Boolean` | Kategorie A02 |
| `categoryL02` | `Boolean` | Kategorie L02 |
| `categoryL04` | `Boolean` | Kategorie L04 |
| `categoryA12` | `Boolean` | Kategorie A12 |

### Cross-references
The `ConsultationMedicationAnamnesis` sub-entity is used within:
- [`ConsultationStandard`](#sub-entity-consultationstandard) (as `medicationAnamnesis` field)

#### Sub-entity: ConsultationDiagnosis
 Einzelne Diagnose mit ICD-10 Code.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `icd10` | `Document` | ICD-10 Referenz ([Icd10](#table-icd10)) |
| `localization` | `String` | Lokalisierung:<br>• `LEFT` (Used)<br>• `RIGHT` (Used)<br>• `BOTH` (Used)<br>• `UNKNOWN` (Used) |
| `level` | `String` | Sicherheit der Diagnose:<br>• `GENERAL` (Used)<br>• `VERIFY` (Used)<br>• `ZERO` (Used)<br>• `STATIONARY` (Used) |
| `title` | `String` | Titel |
| `comment` | `String` | Kommentar |

### Cross-references
The `ConsultationDiagnosis` sub-entity is used within:
- [`ConsultationStandard`](#sub-entity-consultationstandard) (as `diagnosis` array)

---

## Entity: Jahreskalender eines Experten (Expert Days)
Detailed availability calendar for experts, tracking shifts and appointment availability per day.

### Table: expertDays
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `userId` | `Long` | Referenz auf `user` |
| `month` | `Number` | Monat (Format: YYYYMM) |
| `maxWeekDayMorning` | `Number` | Maximale Vormittagsschichten (Wochentag) |
| `maxWeekDayAfternoon` | `Number` | Maximale Nachmittagsschichten (Wochentag) |
| `maxWeekDayNight` | `Number` | Maximale Nachtschichten (Wochentag) |
| `maxWeekEndMorning` | `Number` | Maximale Vormittagsschichten (Wochenende) |
| `maxWeekEndAfternoon` | `Number` | Maximale Nachmittagsschichten (Wochenende) |
| `maxWeekEndNight` | `Number` | Maximale Nachtschichten (Wochenende) |
| `maxWeekDayAppointmentMorning` | `Number` | Maximale Vormittagssprechstunden |
| `maxWeekDayAppointmentAfternoon` | `Number` | Maximale Nachmittagssprechstunden |
| `morningNo` | `Array` | Tage mit explizitem "Nein" für Vormittagsbereitschaft |
| `dateChanged` | `Date` | Zeitpunkt der letzten Änderung |
| `createdBy` | `DBRef` | Erstellt von (Referenz auf `user`) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ExpertDays` (Used) |

### Cross-references
The `expertDays` entity defines availability for:
- [`user`](#entity-experte-expert) (referenced via `userId`)
| `afternoonNo` | `Array` | Tage mit explizitem "Nein" für Nachmittagsbereitschaft |
| `nightNo` | `Array` | Tage mit explizitem "Nein" für Nachtbereitschaft |
| `morningYes` | `Array` | Tage mit explizitem "Ja" für Vormittagsbereitschaft |
| `afternoonYes` | `Array` | Tage mit explizitem "Ja" für Nachmittagsbereitschaft |
| `nightYes` | `Array` | Tage mit explizitem "Ja" für Nachtbereitschaft |
| `morningAppointmentNo` | `Array` | Tage mit explizitem "Nein" für Vormittagssprechstunde |
| `afternoonAppointmentNo` | `Array` | Tage mit explizitem "Nein" für Nachmittagssprechstunde |
| `treatmentAppointmentNo` | `Array` | Tage mit explizitem "Nein" für Therapiesprechstunde |
| `morningAppointmentYes` | `Array` | Tage mit explizitem "Ja" für Vormittagssprechstunde |
| `afternoonAppointmentYes` | `Array` | Tage mit explizitem "Ja" für Nachmittagssprechstunde |
| `treatmentAppointmentYes` | `Array` | Tage mit explizitem "Ja" für Therapiesprechstunde |
| `changedBy` | `DBRef` | Letzte Änderung durch (Referenz auf `user`) |
| `dateChanged` | `timestamp` | Zeitpunkt der letzten Änderung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ExpertDays` (Used) |

### Cross-references
The `expertDays` entity stores availability data for:
- [`user`](#entity-experte-expert) (referenced via `userId`)

---

## Entity: ICD-10 Klassifikation (ICD-10)
Systematische Verzeichnis der Krankheiten und verwandter Gesundheitsprobleme.

### Table: icd10
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `code` | `String` | ICD-10 Code |
| `name` | `String` | Bezeichnung der Diagnose |
| `text` | `String` | Detaillierter Text zur Diagnose |
| `inclusion` | `String` | Einschlüsse |
| `exclusion` | `String` | Ausschlusskriterien |
| `ageLow` | `Number` | Mindestalter |
| `ageHigh` | `Number` | Höchstalter |
| `exotic` | `Boolean` | Ob es sich um eine seltene/exotische Diagnose handelt |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Icd10` (Used) |

### Cross-references
The `icd10` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (in `standard.diagnosis`)

---

#### Sub-entity: ConsultationPrescription
Medikamentenverschreibung.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `type` | `String` | Art der Verschreibung:<br>• `LIMITED` (Used) |
| `packages` | `Number` | Anzahl der Packungen |
| `product` | `Document` | Schnappschuss des gewählten Produkts ([MedicationProduct](#sub-entity-medicationproduct)) |
| `medication` | `DBRef` | Referenz auf Medikament ([Medication](#entity-medikamente-medication)) |
| `morning` | `Number` | Dosierung Morgens |
| `lunch` | `Number` | Dosierung Mittags |
| `evening` | `Number` | Dosierung Abends |
| `night` | `Number` | Dosierung Nachts |
| `amountEveryXDays` | `Number` | Menge alle X Tage |
| `everyXDays` | `Number` | Alle X Tage |
| `start` | `Date` | Startdatum |
| `end` | `Date` | Enddatum |
| `comment` | `String` | Kommentar |
| `reasoning` | `String` | Begründung |

### Cross-references
The `ConsultationPrescription` sub-entity is used within:
- [`ConsultationStandard`](#sub-entity-consultationstandard) (as `prescription` array)

#### Sub-entity: ConsultationHistory
Medizinische Historie des Patienten.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `medication` | `Array` | Historische Medikation |
| `history` | `Array` | Historische Einträge |

### Cross-references
The `ConsultationHistory` sub-entity is used within:
- [`ConsultationBase`](#sub-entity-consultationbase) (as `history` field)

#### Sub-entity: ConsultationAnamnesis
Anamnese Eintrag in einer Standard-Konsultation.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `type` | `String` | Art des Eintrags:<br>• `MEDICAL` (Used)<br>• `MEDICATION` (Used)<br>• `ALLERGY` (Used) |
| `documentation` | `String` | Dokumentationstext |

### Cross-references
The `ConsultationAnamnesis` sub-entity is used within:
- [`ConsultationStandard`](#sub-entity-consultationstandard) (as `anamnesis` array)

#### Sub-entity: ConsultationPatientReport
Befundbericht in einer Standard-Konsultation.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `type` | `String` | Art des Berichts:<br>• `FINDINGS` (Used)<br>• `MEASUREMENT` (Used) |
| `title` | `String` | Titel des Befundes |
| `documentation` | `String` | Dokumentationstext |

### Cross-references
The `ConsultationPatientReport` sub-entity is used within:
- [`ConsultationStandard`](#sub-entity-consultationstandard) (as `patientReport` array)

#### Sub-entity: ConsultationWorkIncapacity
Arbeitsunfähigkeit in einer Standard-Konsultation.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `dateStart` | `Date` | Beginn der AU |
| `dateEnd` | `Date` | Ende der AU |
| `type` | `String` | Art der AU:<br>• `INITIAL` (Used)<br>• `FOLLOW_UP` (Used) |
| `comment` | `String` | Kommentar |

### Cross-references
The `ConsultationWorkIncapacity` sub-entity is used within:
- [`ConsultationStandard`](#sub-entity-consultationstandard) (as `workIncapacity` array)

#### Sub-entity: ConsultationDoctor
Durchführender Experte in den Konsultationsdaten.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Referenz ID auf `user` |
| `name` | `String` | Name des Experten |
| `email` | `String` | E-Mail-Adresse |
| `formalDisplayName` | `String` | Vollständiger Name mit Titel |

### Cross-references
The `ConsultationDoctor` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `doctor` field)
- [`notification`](#entity-benachrichtigungen-notifications) (as `from` and `to` fields)
- [`treatment`](#entity-behandlungsverlauf-treatment) (as `assigned` field)
- [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly) (as `expert` field)

#### Sub-entity: ConsultationJob
Dienstleistung in den Konsultationsdaten.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Referenz ID auf `jobId` |
| `code` | `String` | Dienstleistungscode |
| `color` | `String` | Farbe |
| `expertTitle` | `String` | Titel für Experten |
| `remoteCode` | `String` | Externer Code |
| `title` | `String` | Titel |
| `type` | `String` | Abrechnungsart (z.B. `APPOINTMENT`):<br>• `APPOINTMENT` (Used)<br>• `SHIFT` (Used) |

### Cross-references
The `ConsultationJob` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `job` field)
- [`treatment`](#entity-behandlungsverlauf-treatment) (as `job` field)
- [`shiftPlan`](#entity-schichtplan-shift-plan) (as `job` field)
- [`appointment`](#entity-termine-appointments) (as `job` field)

#### Sub-entity: ConsultationLocation
Ort der Konsultation.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Referenz ID auf `location` |
| `name` | `String` | Name des Ortes |
| `booknumberMask` | `String` | Maske für Buchnummern |
| `patientDataType` | `String` | Datentyp der Patienten:<br>• `EXTERNAL` (Used)<br>• `INTERNAL_SECUREBOX` (Used) |
| `customer` | `Document` | Zugehöriger Kunde ([ConsultationCustomer](#sub-entity-consultationcustomer)) |

### Cross-references
The `ConsultationLocation` sub-entity is used within:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (as `location` field)
- [`treatment`](#entity-behandlungsverlauf-treatment) (as `location` field)

#### Sub-entity: ConsultationCustomer
Kunde in den Konsultationsdaten.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Referenz ID auf `customer` |
| `name` | `String` | Name des Kunden |

### Cross-references
The `ConsultationCustomer` sub-entity is used within:
- [`ConsultationLocation`](#sub-entity-consultationlocation) (as `customer` field)
- [`consultation`](#entity-konsultationen-legacy) (as `customer` field)

---

## Entity: Behandlungsverlauf (Treatment)
Erfasst den Verlauf von Behandlungen, insbesondere im Bereich der Psychotherapie.

### Table: treatment
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `assigned` | `Document` | Zugewiesener Experte ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `hour` | `Number` | Stundenindex |
| `day` | `String` | Wochentag:<br>• `MO` (Used)<br>• `TU` (Used)<br>• `WE` (Used)<br>• `TH` (Used)<br>• `FR` (Used) |
| `bookNumber` | `String` | Buchnummer (JVA) |
| `jNumber` | `String` | J-Nummer (JVA) |
| `type` | `String` | Art der Behandlung:<br>• `PSYCH` (Used) |
| `state` | `String` | Status der Behandlung:<br>• `ACTIVE` (Used)<br>• `CANCELED` (Used)<br>• `CANCELED_CLOSED` (Used)<br>• `CLOSED` (Used)<br>• `ENDING` (Used)<br>• `PROBATORIK` (Used)<br>• `RUNNING` (Used)<br>• `STARTED` (Used)<br>• `STORNO` (Used)<br>• `STORNO_CLOSED` (Used) |
| `job` | `Document` | Erbrachte Dienstleistung ([ConsultationJob](#sub-entity-consultationjob)) |
| `archived` | `Boolean` | Archivierungsstatus |
| `positions` | `Array` | Einzelne Termine der Behandlung ([TreatmentPosition](#sub-entity-treatmentposition)) |
| `location` | `Document` | Ort der Behandlung ([ConsultationLocation](#sub-entity-consultationlocation)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Treatment` (Used) |

### Cross-references
The `treatment` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (via `treatmentId`)
- [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue) (via `type`)

### Sub-entities for treatment

#### Sub-entity: TreatmentPosition
Ein einzelner Termin oder eine Position innerhalb eines Behandlungsverlaufs.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `appointmentId` | `Long` | Referenz auf `appointment` |
| `start` | `Date` | Startzeitpunkt |
| `until` | `Date` | Endzeitpunkt |
| `state` | `String` | Status des Termins:<br>• `CANCELED` (Used)<br>• `CLOSED` (Used)<br>• `DONE` (Used)<br>• `LOCKEDIN` (Used)<br>• `READY` (Used)<br>• `RESCHEDULED` (Used)<br>• `STORNO` (Used) |
| `requireReport` | `Boolean` | Bericht erforderlich |
| `report` | `Document` | Referenz auf den Bericht ([TreatmentReport](#sub-entity-treatmentreport)) |

### Cross-references
The `TreatmentPosition` sub-entity is used within:
- [`treatment`](#entity-behandlungsverlauf-treatment) (as `positions` array)

#### Sub-entity: TreatmentReport
Informationen zum Bericht einer Behandlungsposition.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `type` | `String` | Art des Berichts:<br>• `STANDARD` (Used) |
| `consultationId` | `Long` | Referenz auf `consultationData` |
| `date` | `Date` | Datum des Berichts |

### Cross-references
The `TreatmentReport` sub-entity is used within:
- [`TreatmentPosition`](#sub-entity-treatmentposition) (as `report` field)

---

## Entity: Benachrichtigungen (Notifications)
Interne Benachrichtigungen und Nachrichten zwischen Benutzern oder vom System.

### Table: notification
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `ts` | `Date` | Zeitstempel |
| `from` | `Document` | Absender ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `to` | `Document` | Empfänger ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `important` | `Boolean` | Wichtigkeit |
| `folder` | `String` | Ordner:<br>• `INBOX` (Used)<br>• `OUTBOX` (Used)<br>• `TRASH` (Used)<br>• `ARCHIVE` (Not used) |
| `read` | `Date` | Gelesen-Zeitpunkt |
| `subject` | `String` | Betreff |
| `message` | `String` | Nachrichtentext |
| `notificationEvent` | `String` | Art des Ereignisses |
| `emailSent` | `Boolean` | Ob eine E-Mail versendet wurde |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Notification` (Used) |

### Cross-references
The `notification` entity is referenced by:
- [`appointmentAssignmentHistory`](#entity-terminzuweisungs-historie-appointment-assignment-history) (via `notificationId`)

---

## Entity: Anrufliste (CDR Calls)
Erfasst Details zu getätigten Video- und Audioanrufen (Call Detail Records).

### Table: cDRCall
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `type` | `String` | Art des Anrufs:<br>• `DIRECT` (Used)<br>• `CONFERENCE` (Used)<br>• `FORWARDED` (Used)<br>• `INVALID_MISSING_EXPERT` (Used)<br>• `INVALID_SHORT` (Used)<br>• `INVALID_UNKNOWN` (Used) |
| `dateStart` | `Date` | Startzeitpunkt |
| `dateConnect` | `Date` | Verbindungszeitpunkt |
| `dateDisconnect` | `Date` | Trennungszeitpunkt |
| `location` | `String` | Ort des Anrufs |
| `userId` | `Long` | Referenz auf `user` |
| `expert` | `Document` | Snapshot des Experten ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `appointment` | `Long` | Referenz auf `appointment` |
| `consultation` | `Long` | Referenz auf `consultationData` |
| `duration` | `Long` | Dauer in Sekunden |
| `status` | `String` | Status des Anrufs |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.CDRCall` (Used) |

### Cross-references
The `cDRCall` entity is referenced by:
- [`cDRCallAssignment`](#entity-cdr-call-zuweisungen-cdr-call-assignment) (implicitly linked by time and location)

---

## Entity: Termine (Appointments)
Verwaltung von Einzelterminen, Bereitschaften und Behandlungen.

### Table: appointment
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `start` | `Date` | Startzeitpunkt |
| `until` | `Date` | Endzeitpunkt |
| `dateCreated` | `Date` | Erstellungsdatum |
| `title` | `String` | Titel |
| `comment` | `String` | Kommentar |
| `state` | `String` | Status:<br>• `ACTIVE` (Used)<br>• `CANCELED` (Used)<br>• `CLOSED` (Used)<br>• `DONE` (Used)<br>• `LOCKEDIN` (Used)<br>• `READY` (Used)<br>• `REQUESTED` (Used)<br>• `RESCHEDULED` (Used)<br>• `STARTED` (Used)<br>• `STORNO` (Used) |
| `type` | `String` | Typ:<br>• `APPOINTMENT` (Used)<br>• `SHIFT` (Used)<br>• `TREATMENT` (Used)<br>• `TREATMENT_REPORT` (Used) |
| `job` | `Document` | Erbrachte Dienstleistung ([ConsultationJob](#sub-entity-consultationjob)) |
| `billingType` | `String` | Abrechnungsart:<br>• `HOURLY` (Used)<br>• `PER_CONSULTATION` (Used) |
| `treatmentId` | `Long` | Referenz auf `treatment` |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Appointment` (Used) |

### Cross-references
The `appointment` entity is referenced by:
- [`appointmentAssignment`](#entity-terminzuweisungen-appointment-assignments)
- [`basisWebData`](#entity-jva-patientendaten-basis-web-data)
- [`cDRCallAssignment`](#entity-cdr-call-zuweisungen-cdr-call-assignment)
- [`consultationData`](#entity-konsultationsdaten-consultation-data)
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`log`](#entity-system-logs-logs)
- [`patientData`](#entity-patientenerg-nzungsdaten-patient-data)
- [`questionaire`](#entity-qualit-tsumfragen-questionaires)
- [`treatment`](#entity-behandlungsverlauf-treatment) (in `positions`)

---

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
| `customer` | `Document` | Kunde ([ConsultationCustomer](#sub-entity-consultationcustomer)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Consultation` (Used) |

### Cross-references
The `consultation` (Legacy) entity stores historical records and is referenced by:
- (Internal audit and history tools)

## Entity: JVA Patientendaten (Basis Web Data)
Vom JVA-System übermittelte Patientendaten, die verschlüsselt in der Datenbank abgelegt werden.

### Table: basisWebData
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `uuid` | `String` | Eindeutige ID der Übermittlung |
| `jva` | `Long` | ID der JVA |
| `jnummer` | `String` | J-Nummer des Gefangenen |
| `buchnummer` | `String` | Buchnummer des Gefangenen |
| `familienname` | `String` | Familienname |
| `geburtsname` | `String` | Geburtsname |
| `vorname` | `String` | Vorname |
| `geburtsdatum` | `String` | Geburtsdatum |
| `staatsangehoerigkeit` | `String` | Staatsangehörigkeit |
| `geburtsland` | `String` | Geburtsland |
| `geschlecht` | `String` | Geschlecht |
| `medication` | `Array` | Liste übermittelter Medikamente ([BasisWebMedication](#sub-entity-basiswebmedication)) |
| `warning` | `Array` | Liste übermittelter Warnhinweise ([BasisWebWarning](#sub-entity-basiswebwarning)) |
| `dateCreated` | `Date` | Erstellungsdatum |
| `appointment` | `DBRef` | Zugehöriger Termin (Referenz auf `appointment`) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.BasisWebData` (Used) |

### Cross-references
The `basisWebData` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (via `basisWebDataId`)

### Sub-entities for basisWebData

#### Sub-entity: BasisWebMedication
Übermitteltes Medikament aus dem JVA-System.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `date` | `String` | Datum |
| `type` | `String` | Art des Medikaments (Encrypted/Hashed) |
| `content` | `String` | Inhalt/Wirkstoff |
| `entry` | `String` | Eintragstext |
| `note` | `String` | Notiz |
| `until` | `String` | Gültig bis |

### Cross-references
The `BasisWebMedication` sub-entity is used within:
- [`basisWebData`](#entity-jva-patientendaten-basis-web-data) (as `medication` array)

#### Sub-entity: BasisWebWarning
Übermittelter Warnhinweis aus dem JVA-System.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `date` | `String` | Datum |
| `active` | `String` | Status (Encrypted/Hashed) |
| `type` | `String` | Art der Warnung (Encrypted/Hashed) |
| `content` | `String` | Inhaltstext |

### Cross-references
The `BasisWebWarning` sub-entity is used within:
- [`basisWebData`](#entity-jva-patientendaten-basis-web-data) (as `warning` array)

#### Sub-entity: BasisWebEntry
Allgemeiner medizinischer Eintrag aus dem JVA-System.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `date` | `String` | Datum |
| `active` | `String` | Status (Encrypted/Hashed) |
| `type` | `String` | Art des Eintrags (Encrypted/Hashed) |
| `content` | `String` | Inhaltstext |

### Cross-references
The `BasisWebEntry` sub-entity is used within:
- (Internal JVA patient data processing)

---

## Entity: System-Logs (Logs)
Protokollierung von Systemereignissen, Fehlern und sicherheitsrelevanten Aktionen.

### Table: log
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `ts` | `Date` | Zeitstempel |
| `userId` | `Long` | Referenz auf `user` |
| `level` | `String` | Log-Level:<br>• `INFO` (Used)<br>• `ERROR` (Used)<br>• `SECURITY` (Used) |
| `appointment` | `Long` | Referenz auf `appointment` |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Log` (Used) |

### Cross-references
The `log` entity stores technical logs and is referenced by:
- (System-wide monitoring tools)

---

## Entity: Rechnungskomponenten (Invoice Components)
Einzelne Bestandteile einer Rechnung, basierend auf Terminen und Konsultationen.

### Table: invoiceComponent
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `start` | `Date` | Startzeitpunkt |
| `priceList` | `Long` | Referenz auf `jobPriceList` |
| `customerId` | `Long` | Referenz auf `customer` |
| `locationId` | `Long` | Referenz auf `location` |
| `appointmentId` | `Long` | Referenz auf `appointment` |
| `consultationId` | `Long` | Referenz auf `consultationData` |
| `actualPatients` | `Number` | Tatsächliche Anzahl Patienten |
| `billablePatients` | `Number` | Abrechenbare Patienten |
| `payablePatients` | `Number` | Auszahlbare Patienten |
| `billableWorkTime` | `Number` | Abrechenbare Arbeitszeit |
| `payableWorkTime` | `Number` | Auszahlbare Arbeitszeit |
| `billValue` | `Number` | Rechnungsbetrag |
| `payValue` | `Number` | Auszahlungsbetrag |
| `stornoType` | `Document` | Stornierungsdetails ([InvoiceComponentStorno](#sub-entity-invoicecomponentstorno)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.InvoiceComponent` (Used) |

### Cross-references
The `invoiceComponent` entity is a derived entity used for accounting and is referenced by:
- [`invoice`](#entity-rechnungen-invoices) (implicitly during invoice generation)

### Sub-entities for invoiceComponent

#### Sub-entity: InvoiceComponentStorno
Details zur Stornierung einer Rechnungskomponente.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `name` | `String` | Name des Stornos |
| `percentage` | `Number` | Prozentsatz |
| `stornoTime` | `Long` | Zeitpunkt der Stornierung |
| `comment` | `String` | Kommentar |
| `type` | `String` | Storno-Typ |

### Cross-references
The `InvoiceComponentStorno` sub-entity is used within:
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components) (as `stornoType` field)

---

## Entity: Qualitätsumfragen (Questionaires)
Fragebögen zur Bewertung der Qualität von Konsultationen und Dienstleistungen.

### Table: questionaire
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `appointmentId` | `Long` | Referenz auf `appointment` |
| `consultationId` | `Long` | Referenz auf `consultationData` |
| `date` | `Date` | Datum der Umfrage |
| `ratingRisk` | `Number` | Bewertung Risiko (1-5) |
| `ratingTeleApplyable` | `Number` | Bewertung Telemedizin-Eignung (1-5) |
| `comment` | `String` | Kommentar |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Questionaire` (Used) |

### Cross-references
The `questionaire` entity is referenced by:
- (Internal quality management reports)

---

## Entity: CDR Call Zuweisungen (CDR Call Assignment)
Ordnet CDR-Anrufe bestimmten Terminen oder Konsultationen zu.

### Table: cDRCallAssignment
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `start` | `Date` | Startzeitpunkt |
| `until` | `Date` | Endzeitpunkt |
| `duration` | `Long` | Dauer in Sekunden |
| `locationId` | `Long` | Referenz auf `location` |
| `location` | `String` | Name des Ortes |
| `user` | `Document` | Beteiligter Benutzer ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `state` | `String` | Status der Zuweisung |
| `confidence` | `Number` | Konfidenzlevel der Zuweisung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.CDRCallAssignment` (Used) |

### Cross-references
The `cDRCallAssignment` entity links calls to:
- [`appointment`](#entity-termine-appointments)
- [`consultationData`](#entity-konsultationsdaten-consultation-data)

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

### Cross-references
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

### Cross-references
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

### Cross-references
The `MedicationProduct` sub-entity is used within:
- [`medication`](#entity-medikamente-medication) (as `products` array)

## Entity: Rechnungen (Invoices)
Zentrale Abrechnungsdokumente für Kunden und Experten.

### Table: invoice
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `no` | `String` | Rechnungsnummer |
| `title` | `String` | Titel |
| `description` | `String` | Beschreibung |
| `cashRegister` | `DBRef` | Referenz auf `cashRegister` |
| `client` | `Document` | Rechnungsempfänger-Details (Snapshot: [InvoiceClient](#sub-entity-invoiceclient)) |
| `month` | `Number` | Monat |
| `year` | `Number` | Jahr |
| `positions` | `Array` | Rechnungspositionen ([InvoicePosition](#sub-entity-invoiceposition)) |
| `totalNetPrice` | `Number` | Gesamt-Nettopreis |
| `totalPrice` | `Number` | Gesamt-Bruttopreis |
| `taxType` | `String` | Steuerart:<br>• `SATZ_NORMAL` (Used)<br>• `SATZ_NULL` (Used) |
| `taxes` | `Array` | Steuersätze ([InvoiceTax](#sub-entity-invoicetax)) |
| `dateInvoice` | `Date` | Rechnungsdatum |
| `dateSubmit` | `Date` | Einreichungsdatum |
| `paymentType` | `String` | Zahlungsart:<br>• `CASH` (Used)<br>• `INVOICE` (Used)<br>• `INVOICE_STORNO` (Used) |
| `invoiceType` | `String` | Rechnungstyp:<br>• `EXPERT_INVOICE` (Used)<br>• `INVOICE` (Used)<br>• `START_INVOICE` (Used) |
| `mail` | `String` | E-Mail-Adresse für den Versand |
| `mailSendDate` | `Date` | Versanddatum |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Invoice` (Used) |

### Cross-references
The `invoice` entity is referenced by:
- [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers) (implicit link via billing data)
- [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly) (for billing calculations)
- [`stornoGroup`](#entity-stornogruppen-storno-groups) (via cancellation logic)

### Sub-entities for invoice

#### Sub-entity: InvoiceClient
Snapshot der Client-Daten zum Zeitpunkt der Rechnungserstellung.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `name` | `String` | Name |
| `gkto` | `String` | Debitorennummer |
| `firstName` | `String` | Vorname |
| `lastName` | `String` | Nachname |
| `address` | `String` | Adresse |
| `zip` | `String` | PLZ |
| `city` | `String` | Ort |
| `bank` | `String` | Bank |
| `iban` | `String` | IBAN |
| `bic` | `String` | BIC |
| `taxid` | `String` | Steuer-ID |
| `uid` | `String` | Umsatzsteuer-ID |

### Cross-references
The `InvoiceClient` sub-entity is used within:
- [`invoice`](#entity-rechnungen-invoices) (as `client` field)

#### Sub-entity: InvoicePosition
Einzelne Position auf einer Rechnung.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `no` | `Number` | Positionsnummer |
| `title` | `String` | Titel |
| `description` | `String` | Beschreibung |
| `amount` | `Number` | Menge |
| `pricePerUnit` | `Number` | Preis pro Einheit |
| `totalPrice` | `Number` | Gesamtpreis der Position |
| `taxType` | `String` | Steuerart:<br>• `SATZ_NORMAL` (Used)<br>• `SATZ_NULL` (Used) |
| `job` | `DBRef` | Referenz auf `jobId` |
| `comment` | `String` | Kommentar |

### Cross-references
The `InvoicePosition` sub-entity is used within:
- [`invoice`](#entity-rechnungen-invoices) (as `positions` array)

#### Sub-entity: InvoiceTax
Zusammenfassung einer Steuerart auf der Rechnung.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `taxType` | `String` | Steuerart:<br>• `SATZ_NORMAL` (Used)<br>• `SATZ_NULL` (Used) |
| `value` | `Number` | Steuersatz |
| `sum` | `Number` | Steuersumme |
| `net` | `Number` | Nettosumme |
| `total` | `Number` | Bruttosumme |
| `description` | `String` | Beschreibung |

### Cross-references
The `InvoiceTax` sub-entity is used within:
- [`invoice`](#entity-rechnungen-invoices) (as `taxes` array)

---

## Entity: Terminzuweisungen (Appointment Assignments)
Zuweisung von Experten zu bestimmten Terminen mit Statusverfolgung.

### Table: appointmentAssignment
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `userId` | `Long` | Referenz auf `user` |
| `assignedById` | `Long` | Zugewiesen durch (Referenz auf `user`) |
| `appointmentId` | `Long` | Referenz auf `appointment` |
| `state` | `String` | Status der Zuweisung |
| `dateAssigned` | `Date` | Zuweisungsdatum |
| `dateReminder` | `Date` | Erinnerungsdatum |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.AppointmentAssignment` (Used) |

### Cross-references
The `appointmentAssignment` entity is referenced by:
- [`appointmentAssignmentHistory`](#entity-terminzuweisungs-historie-appointment-assignment-history)

### Sub-entities for appointmentAssignment

#### Sub-entity: AppointmentAssignmentHistory
Audit-Trail für Änderungen an einer Terminzuweisung.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `assignmentId` | `Long` | Referenz auf `appointmentAssignment` |
| `state` | `String` | Neuer Status |
| `dateCreated` | `Date` | Zeitpunkt der Änderung |
| `message` | `String` | Systemnachricht oder Kommentar |

### Cross-references
The `AppointmentAssignmentHistory` sub-entity is used within:
- [`appointmentAssignment`](#entity-terminzuweisungen-appointment-assignments) (conceptually, though also a separate collection `appointmentAssignmentHistory`)

---

## Entity: Terminzuweisungs-Historie (Appointment Assignment History)
Detaillierte Historie aller Zuweisungsänderungen.

### Table: appointmentAssignmentHistory
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `assignmentId` | `Long` | Referenz auf `appointmentAssignment` |
| `dateCreated` | `Date` | Zeitpunkt der Änderung |
| `state` | `String` | Neuer Status |
| `target` | `Document` | Ziel des Ereignisses (Snapshot von `user`) |
| `subject` | `String` | Betreff |
| `message` | `String` | Nachricht oder Kommentar |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.AppointmentAssignmentHistory` (Used) |

### Cross-references
The `appointmentAssignmentHistory` entity provides an audit trail for:
- [`appointmentAssignment`](#entity-terminzuweisungen-appointment-assignments)

---

---

## Entity: Monatliche Expertenarbeit (Expert Work Monthly)
Zusammenfassung der erbrachten Leistungen eines Experten pro Monat zur Abrechnungsvorbereitung.

### Table: expertWorkMonthly
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `year` | `Number` | Jahr |
| `month` | `Number` | Monat |
| `user` | `DBRef` | Referenz auf `user` |
| `doctorName` | `String` | Name des Experten |
| `total` | `Number` | Gesamtbetrag |
| `payableWorkTimeTotal` | `Number` | Auszahlbare Arbeitszeit gesamt |
| `payablePatientsTotal` | `Number` | Auszahlbare Patienten gesamt |
| `worklog` | `Array` | Detaillierte Liste der Tätigkeiten ([ExpertWorklogEntry](#sub-entity-expertworklogentry)) |
| `dateSent` | `Date` | Sendedatum |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ExpertWorkMonthly` (Used) |

### Cross-references
The `expertWorkMonthly` entity is a summary for experts and is referenced by:
- (Internal billing and payment processes)

### Sub-entities for expertWorkMonthly

#### Sub-entity: ExpertWorklogEntry
Einzelner Eintrag im monatlichen Arbeitsprotokoll eines Experten.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `appointmentId` | `Long` | Referenz auf `appointment` |
| `job` | `DBRef` | Referenz auf `jobId` |
| `start` | `Date` | Startzeitpunkt |
| `actualWorkTime` | `Long` | Tatsächliche Arbeitszeit |
| `payableWorkTime` | `Number` | Auszahlbare Arbeitszeit |
| `price` | `Number` | Einzelpreis |
| `total` | `Number` | Gesamtpreis |
| `location` | `String` | Ort |
| `expert` | `Document` | Snapshot des Experten ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `invoice` | `Document` | Rechnungs-Snapshot |

### Cross-references
The `ExpertWorklogEntry` sub-entity is used within:
- [`expertWorkMonthly`](#entity-monatliche-expertenarbeit-expert-work-monthly) (as `worklog` array)

---

---

## Entity: Web-Terminanfragen (Basis Web Appointment)
Vom Web-System übermittelte Terminanfragen.

### Table: basisWebAppointment
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `uuid` | `String` | Eindeutige ID der Anfrage |
| `start` | `Date` | Gewünschter Startzeitpunkt |
| `location` | `Long` | Referenz auf `location` |
| `jva` | `Long` | ID der JVA |
| `dateCreated` | `Date` | Erstellungsdatum |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.BasisWebAppointment` (Used) |

### Cross-references
The `basisWebAppointment` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (implicitly when converted to an appointment)

---

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

### Cross-references
The `zipCodeLookup` entity is used for:
- (Geographic data validation and lookups in the UI)

---

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
| `ownerId` | `Long` | Referenz auf `user` |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.UserFile` (Used) |

### Cross-references
The `userFile` entity references:
- [`user`](#entity-experte-expert) (via `ownerId`)

---

## Entity: Hintergrundaufgaben (Async Job Queue)
Warteschlange für asynchron auszuführende Systemaufgaben.

### Table: asyncJobQueue
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `dateCreated` | `Date` | Erstellungsdatum |
| `dateStarted` | `Date` | Startdatum |
| `dateFinished` | `Date` | Fertigstellungsdatum |
| `title` | `String` | Titel der Aufgabe |
| `state` | `String` | Status:<br>• `DONE` (Used)<br>• `ERROR` (Used)<br>• `FINISHED` (Used)<br>• `RUNNING` (Used) |
| `type` | `String` | Art der Aufgabe:<br>• `APPOINTMENTPLAN` (Used)<br>• `INVOICE` (Used)<br>• `SHIFTPLAN` (Used)<br>• `TREATMENT` (Used) |
| `createdBy` | `Document` | Ersteller ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.AsyncJobQueue` (Used) |

### Cross-references
The `asyncJobQueue` entity tracks background tasks for:
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)
- [`shiftPlan`](#entity-schichtplan-shift-plan)
- [`invoice`](#entity-rechnungen-invoices)
- [`treatment`](#entity-behandlungsverlauf-treatment)

### Sub-entities for asyncJobQueue

#### Sub-entity: AsyncJobTask
Einzelner Arbeitsschritt innerhalb einer Hintergrundaufgabe.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `title` | `String` | Titel des Arbeitsschritts |
| `status` | `String` | Status des Arbeitsschritts (Freitext/Progress message, z.B. "25/2987/5697 OK") |
| `dateStarted` | `Date` | Startzeitpunkt |
| `dateFinished` | `Date` | Endzeitpunkt |

### Cross-references
The `AsyncJobTask` sub-entity is used within:
- [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue)

---

## Remaining Unknown Tables
Die folgenden Tabellen wurden im System gefunden, aber noch nicht detailliert gemappt oder in die Business-Logik integriert.

## Entity: Benutzersitzungen (Persistent Sessions)
Speichert Informationen über aktive und vergangene Benutzersitzungen im System.

### Table: persistentSession
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Session-ID |
| `version` | `Long` | Versionsnummer |
| `user` | `DBRef` | Referenz auf `user` |
| `created` | `Date` | Erstellungszeitpunkt |
| `ip` | `String` | IP-Adresse des Benutzers |
| `userAgent` | `String` | Browser-Informationen (User Agent) |
| `role` | `String` | Aktive Rolle in der Sitzung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.PersistentSession` (Used) |

### Cross-references
The `persistentSession` entity references:
- [`user`](#entity-experte-expert)

---

## Entity: Cache-Status (Cache State)
Technical collection for tracking the version/state of various system caches.

### Table: cacheState
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Cache-Bezeichner |
| `version` | `Long` | Aktuelle Version des Caches |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.CacheState` (Used) |

### Cross-references
The `cacheState` entity is used for:
- (Internal system performance tracking and cache invalidation)

---

---

## Entity: Preislisten (Job Price Lists)
Versionierte Preislisten für Dienstleistungen mit zeitlicher Gültigkeit.

### Table: jobPriceList
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `name` | `String` | Name der Preisliste |
| `start` | `Date` | Gültig ab |
| `until` | `Date` | Gültig bis |
| `active` | `Boolean` | Ob die Preisliste aktiv ist |
| `prices` | `Array` | Liste der Einzelpreise ([JobPriceEntry](#sub-entity-jobpriceentry)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.JobPriceList` (Used) |

### Cross-references
The `jobPriceList` entity is referenced by:
- [`customer`](#entity-kunden-customers) (in `priceLists`)
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers)

### Sub-entities for jobPriceList

#### Sub-entity: JobPriceEntry
Konkreter Preis für eine bestimmte Dienstleistung innerhalb einer Preisliste.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `jobId` | `Long` | Referenz auf `jobId` |
| `price` | `Number` | Preiswert |
| `roundingType` | `String` | Rundungsregel:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `consultationType` | `String` | Art der Konsultation |
| `currency` | `String` | Währung |

### Cross-references
The `JobPriceEntry` sub-entity is used within:
- [`jobPriceList`](#entity-preislisten-job-price-lists) (as `prices` array)

---

## Entity: Rechnungsempfänger (Invoice Receivers)
Konfiguration von Empfängern für Rechnungen, inklusive steuerlicher Details und Kontaktinformationen.

### Table: invoiceReceiver
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `customer` | `DBRef` | Referenz auf `customer` |
| `location` | `DBRef` | Referenz auf `location` |
| `name` | `String` | Name des Empfängers |
| `address` | `String` | Straße und Hausnummer |
| `zip` | `String` | PLZ |
| `city` | `String` | Ort |
| `taxType` | `String` | Steuerliche Einordnung:<br>• `SATZ_NORMAL` (Used)<br>• `SATZ_NULL` (Used) |
| `paymentGoal` | `Number` | Zahlungsziel in Tagen |
| `gkto` | `String` | Debitorennummer |
| `email` | `String` | Primäre E-Mail-Adresse |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.InvoiceReceiver` (Used) |

### Cross-references
The `invoiceReceiver` entity is used by:
- (Internal invoice generation processes)

---

## Entity: Konsultationsvorlagen (Expert Consultation Templates)
Vordefinierte Vorlagen für medizinische Konsultationen zur schnelleren Dokumentation.

### Table: expertConsultationTemplate
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `name` | `String` | Name der Vorlage |
| `description` | `String` | Beschreibung |
| `body` | `Document` | Vorlage für körperliche Basisdaten ([ConsultationBody](#sub-entity-consultationbody)) |
| `standard` | `Document` | Vorlage für Standard-Konsultation ([ConsultationStandard](#sub-entity-consultationstandard)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ExpertConsultationTemplate` (Used) |
| `onboarding` | `Document` | Vorlage für Erstuntersuchung ([ConsultationOnboarding](#sub-entity-consultationonboarding)) |
| `job` | `Document` | Vorlage für Dienstleistung ([ConsultationJob](#sub-entity-consultationjob)) |

---

## Entity: Standorte (Locations)
Medizinische Einrichtungen oder Standorte, an denen Konsultationen durchgeführt werden.

### Table: location
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `name` | `String` | Name der Einrichtung |
| `address` | `String` | Adresse |
| `zip` | `String` | PLZ |
| `city` | `String` | Ort |
| `customer` | `DBRef` | Referenz auf `customer` |
| `patientDataAccess` | `Document` | Konfiguration für Datenzugriff ([LocationPatientDataAccess](#sub-entity-locationpatientdataaccess)) |
| `rooms` | `Array` | Liste der Räume am Standort (Referenzen auf `room`) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Location` (Used) |

### Cross-references
The `location` entity is referenced by:
- [`appointment`](#entity-termine-appointments)
- [`appointmentPlan`](#entity-sprechstundenplan-appointment-plan)
- [`consultationData`](#entity-konsultationsdaten-consultation-data)
- [`invoiceComponent`](#entity-rechnungskomponenten-invoice-components)
- [`invoiceReceiver`](#entity-rechnungsempf-nger-invoice-receivers)
- [`project`](#entity-projekte-projects)
- [`treatment`](#entity-behandlungsverlauf-treatment)
- [`basisWebAppointment`](#entity-web-terminanfragen-basis-web-appointment)
- [`onboardingHistory`](#entity-onboarding-verlauf-onboarding-history)
- [`room`](#entity-r-ume-rooms)
- [`patientData`](#entity-patientenerg-nzungsdaten-patient-data)

### Sub-entities for location

#### Sub-entity: LocationPatientDataAccess
Konfiguration für den Zugriff auf externe Patientendaten (z.B. SecureBox).

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `user` | `String` | Benutzername |
| `password` | `String` | Passwort |
| `url` | `String` | Zugriff-URL |
| `active` | `Boolean` | Status des Zugangs |
| `type` | `String` | Art des Datenzugriffs:<br>• `INTERNAL_SECUREBOX` (Used)<br>• `EXTERNAL` (Used) |
| `address` | `String` | URL oder IP-Adresse der SecureBox |
| `port` | `Number` | Portnummer |
| `secure` | `Boolean` | Ob SSL verwendet wird |
| `comment` | `String` | Kommentar zur Konfiguration |

### Cross-references
The `LocationPatientDataAccess` sub-entity is used within:
- [`location`](#entity-standorte-locations) (as `patientDataAccess` field)

## Entity: Experten-Wochenplan (Expert Week)
Standardisierte wöchentliche Verfügbarkeitsslots für Experten.

### Table: expertWeek
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `userId` | `Long` | Referenz auf `user` |
| `type` | `String` | Typ des Wochenplans:<br>• `TREATMENT` (Used) |
| `slotsMo` | `Array` | Zeit-Slots für Montag (Werte: 1-24, entsprechend der Tagesstunde) |
| `slotsTu` | `Array` | Zeit-Slots für Dienstag (Werte: 1-24) |
| `slotsWe` | `Array` | Zeit-Slots für Mittwoch (Werte: 1-24) |
| `slotsTh` | `Array` | Zeit-Slots für Donnerstag (Werte: 1-24) |
| `slotsFr` | `Array` | Zeit-Slots für Freitag (Werte: 1-24) |
| `slotsSa` | `Array` | Zeit-Slots für Samstag (Werte: 1-24) |
| `slotsSu` | `Array` | Zeit-Slots für Sonntag (Werte: 1-24) |
| `changedBy` | `DBRef` | Letzte Änderung durch (Referenz auf `user`) |
| `dateChanged` | `Date` | Zeitpunkt der letzten Änderung |
| `createdBy` | `DBRef` | Erstellt von (Referenz auf `user`) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ExpertWeek` (Used) |

### Cross-references
The `expertWeek` entity defines standard schedules for:
- [`user`](#entity-experte-expert) (referenced via `userId`)

---

## Entity: Video-Verlauf (User Video History)
Protokollierung der von Benutzern angesehenen (Schulungs-)Videos.

### Table: userVideoHistory
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `user` | `DBRef` | Referenz auf `user` |
| `video` | `DBRef` | Referenz auf `video` |
| `dateStart` | `Date` | Erster Zugriff |
| `dateLast` | `Date` | Letzter Zugriff |
| `timeWatched` | `Long` | Gesamt-Zuschauerzeit in Sekunden |
| `watchCount` | `Number` | Anzahl der Aufrufe |
| `sessions` | `Array` | Einzelne Video-Sitzungen ([UserVideoSession](#sub-entity-uservideosession)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.UserVideoHistory` (Used) |

### Cross-references
The `userVideoHistory` entity references:
- [`user`](#entity-experte-expert) (via `user` DBRef)
- [`video`](#entity-videos-videos) (via `video` DBRef)

### Sub-entities for userVideoHistory

#### Sub-entity: UserVideoSession
Einzelne Wiedergabe-Sitzung eines Videos.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `sessionId` | `String` | Session-ID |
| `dateStart` | `Date` | Beginn der Sitzung |
| `dateEnd` | `Date` | Ende der Sitzung |
| `duration` | `Long` | Wiedergabedauer in Sekunden |
| `completed` | `Boolean` | Ob das Video vollständig gesehen wurde |
| `timeWatched` | `Long` | Zuschauerzeit in dieser Sitzung |

### Cross-references
The `UserVideoSession` sub-entity is used within:
- [`userVideoHistory`](#entity-video-verlauf-user-video-history) (as `sessions` array)

---

## Entity: Feiertage (Public Holidays)
Definition von gesetzlichen Feiertagen zur Berücksichtigung in der Planung.

### Table: publicHoliday
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `day` | `Date` | Datum des Feiertags |
| `name` | `String` | Name des Feiertags |
| `states` | `Array` | Liste der Bundesländer (Strings) |
| `country` | `String` | Land (z.B. `DE`) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.PublicHoliday` (Used) |

### Cross-references
The `publicHoliday` entity is used by:
- (Planning modules to identify non-working days)

---

## Entity: Onboarding-Verlauf (Onboarding History)
Verlauf und Status der einzelnen Onboarding-Schritte eines Experten.

### Table: onboardingHistory
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `referenceId` | `Long` | Referenz (z.B. `user.id` oder `location.id`) |
| `step` | `Document` | Snapshot des Onboarding-Schritts ([OnboardingStep](#sub-entity-onboardingstep)) |
| `comment` | `String` | Kommentar (Freitext) |
| `dateStarted` | `Date` | Startzeitpunkt des Schritts |
| `dateCompleted` | `Date` | Abschlusszeitpunkt des Schritts |
| `dateChanged` | `Date` | Zeitpunkt der letzten Änderung |
| `changedBy` | `DBRef` | Letzte Änderung durch (Referenz auf `user`) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.OnboardingHistory` (Used) |

### Cross-references
The `onboardingHistory` entity references:
- [`user`](#entity-experte-expert) (via `referenceId` or `changedBy`)
- [`location`](#entity-standorte-locations) (via `referenceId`)

### Sub-entities for onboardingHistory

#### Sub-entity: OnboardingStep
Definition der einzelnen Schritte, die ein Experte oder Standort während des Onboarding-Prozesses durchlaufen muss.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `title` | `String` | Titel des Schritts (Freitext) |
| `description` | `String` | Beschreibung (Freitext) |
| `priority` | `Number` | Sortierreihenfolge |
| `mandatory` | `Boolean` | Pflichtschritt |
| `type` | `String` | Typ des Onboarding-Schritts:<br>• `CHECK` (Used) |
| `assignmentType` | `String` | Art der Zuordnung:<br>• `EMPLOYEE` (Used)<br>• `LOCATION` (Used) |
| `dateCreated` | `Date` | Erstellungszeitpunkt |
| `dateChanged` | `Date` | Zeitpunkt der letzten Änderung |
| `createdBy` | `DBRef` | Erstellt von (Referenz auf `user`) |
| `changedBy` | `DBRef` | Geändert von (Referenz auf `user`) |

### Cross-references
The `OnboardingStep` sub-entity is used within:
- [`onboardingHistory`](#entity-onboarding-verlauf-onboarding-history) (as `step` snapshot)
- [`onboardingStep`](#entity-onboarding-schritte-onboarding-steps) (as the main entity table)

---

## Entity: Schichtplan (Shift Plan)
Planungsvorgaben für wiederkehrende Bereitschaftsdienste.

### Table: shiftPlan
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `name` | `String` | Name des Schichtplans |
| `day` | `String` | Wochentag:<br>• `MO` (Used)<br>• `TU` (Used)<br>• `WE` (Used)<br>• `TH` (Used)<br>• `FR` (Used)<br>• `SA` (Used)<br>• `SU` (Used) |
| `scheduling` | `String` | Wiederholungsregel:<br>• `WEEKLY` (Used) |
| `schedulingMulitplier` | `Number` | Multiplikator für Planung (z.B. alle X Wochen) |
| `timeStart` | `Number` | Startuhrzeit (Format: HHmm) |
| `timeEnd` | `Number` | Enduhrzeit (Format: HHmm) |
| `job` | `Document` | Dienstleistung ([ConsultationJob](#sub-entity-consultationjob)) |
| `minPatients` | `Number` | Mindestanzahl an Patienten |
| `lastDate` | `Date` | Letztes geplantes Datum |
| `priceType` | `String` | Abrechnungstyp:<br>• `WEEKDAY` (Used)<br>• `WEEKNIGHT` (Used)<br>• `WEEKENDDAY` (Used)<br>• `WEEKENDNIGHT` (Used) |
| `changedBy` | `Document` | Letzte Änderung durch ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `dateChanged` | `Date` | Zeitpunkt der letzten Änderung |
| `createdBy` | `Document` | Erstellt von ([ConsultationDoctor](#sub-entity-consultationdoctor)) |
| `dateCreated` | `Date` | Erstellungszeitpunkt |
| `comment` | `String` | Kommentar (Freitext) |
| `_class` | `String` | Java-Klassenname: `de.videoclinic.model.ShiftPlan` (Used) |

### Cross-references
The `shiftPlan` entity is referenced by:
- [`appointment`](#entity-termine-appointments) (via `shiftPlanId`)
- [`asyncJobQueue`](#entity-hintergrundaufgaben-async-job-queue) (via `type`)

## Entity: Zugriffsrechte (Access Rights)
Definition von spezifischen Berechtigungen innerhalb des Systems.

### Table: accessRight
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `name` | `String` | Name des Rechts (Used: `ACTIVE_CALLS`, `ADMIN`, `ADMIN_INTERN`, `ADMIN_KUNDE`, `ALL_DEPARTMENTS`, `AMDIN`, `ANY_CUSTOMER`, `ANY_EMPLOYEE`, `APPOINTMENTPLAN_CREATE`, `APPOINTMENTPLAN_READ`, `APPOINTMENTPLAN_REMOVE`, `APPOINTMENTPLAN_UPDATE`, `APPOINTMENT_ADHOC`, `APPOINTMENT_ADMIN`, `APPOINTMENT_AGREE`, `APPOINTMENT_ASSIGNMENT`, `APPOINTMENT_CREATE`, `APPOINTMENT_GET`, `APPOINTMENT_MANAGE`, `APPOINTMENT_PURGE`, `APPOINTMENT_READ`, `APPOINTMENT_REMOVE`, `APPOINTMENT_UPDATE`, `APPOINTMENT_USE`, `ASYNCJOBQUEUE_CREATE`, `ASYNCJOBQUEUE_READ`, `ASYNCJOBQUEUE_REMOVE`, `ASYNCJOBQUEUE_UPDATE`, `BASIS`, `BASISWEBAPPOINTMENT_CREATE`, `BASISWEBAPPOINTMENT_READ`, `BASISWEBAPPOINTMENT_REMOVE`, `BASISWEBAPPOINTMENT_UPDATE`, `BASISWEBDATA_CREATE`, `BASISWEBDATA_READ`, `BASISWEBDATA_REMOVE`, `BASISWEBDATA_UPDATE`, `BASISWEBNFB_MANAGER`, `BASISWEB_MANAGER`, `CDRCALLASSIGNMENT_CREATE`, `CDRCALLASSIGNMENT_READ`, `CDRCALLASSIGNMENT_REMOVE`, `CDRCALLASSIGNMENT_UPDATE`, `CDRCALL_CREATE`, `CDRCALL_IMPORT`, `CDRCALL_READ`, `CDRCALL_REMOVE`, `CHECKINOUT`, `CLOSEDMONTH_MANAGE`, `CLOSEDMONTH_READ`, `COMPANY_READ`, `CONFERENCE_CREATE`, `CONFERENCE_READ`, `CONFERENCE_REMOVE`, `CONFERENCE_UPDATE`, `CONSULATION_ADMIN`, `CONSULATION_CREATE`, `CONSULATION_GET`, `CONSULATION_READ`, `CONSULATION_UPDATE`, `CONSULTATION_ADMIN`, `CONSULTATION_CREATE`, `CONSULTATION_GET`, `CONSULTATION_READ`, `CONSULTATION_REPORTING`, `CONSULTATION_REPORTING_PSYCHOTHERAPY`, `CONSULTATION_SUBMIT_CUSTOMER`, `CONSULTATION_UPDATE`, `COUNCILPLAN_CREATE`, `COUNCILPLAN_READ`, `COUNCILPLAN_REMOVE`, `COUNCILPLAN_UPDATE`, `CUSTOMER_CREATE`, `CUSTOMER_DELETE`, `CUSTOMER_READ`, `CUSTOMER_READ_ALL`, `CUSTOMER_REMOVE`, `CUSTOMER_UPDATE`, `EMPLOYEE`, `EQUIPMENT_CREATE`, `EQUIPMENT_READ`, `EQUIPMENT_REMOVE`, `EQUIPMENT_UPDATE`, `EQUIPMENT_WRITE`, `EXPERTCONSULTATION_ADMIN`, `EXPERTCONSULTATION_CREATE`, `EXPERTCONSULTATION_GET`, `EXPERTCONSULTATION_READ`, `EXPERTCONSULTATION_UPDATE`, `EXPERTS_READ`, `EXPERTWEEK_READ`, `EXPERTWORKMONTHLY_CREATE`, `EXPERTWORKMONTHLY_GET`, `EXPERTWORKMONTHLY_READ`, `EXPERTWORKMONTHLY_REMOVE`, `EXPERTWORKMONTHLY_UPDATE`, `EXPERT_WEEK`, `EXPORT_CONSULTATION`, `EXPORT_EK_VK`, `EXPORT_INVOICERECEIVER`, `GROUP_CREATE`, `GROUP_DELETE`, `GROUP_READ`, `GROUP_UPDATE`, `GUEST`, `HOLIDAY_APPROVE`, `HOLIDAY_READ`, `HOLIDAY_SAVE`, `HOLIDAY_SAVE_ALL`, `ICD_QUERY`, `INVOICERECEIVER_CREATE`, `INVOICERECEIVER_READ`, `INVOICERECEIVER_REMOVE`, `INVOICERECEIVER_UPDATE`, `INVOICE_CREATE`, `INVOICE_READ`, `INVOICE_REMOVE`, `INVOICE_STORNO`, `INVOICE_UPDATE`, `INVOICE_VIEW`, `JOBPRICELIST_READ`, `JOB_ADMIN`, `JOB_WRITE`, `KUNDE`, `LEITER_INTERN`, `LOCATIONTYPE_CREATE`, `LOCATIONTYPE_REMOVE`, `LOCATIONTYPE_UPDATE`, `LOCATION_DELETE`, `LOCATION_READ`, `LOCATION_REMOVE`, `LOCATION_WRITE`, `LOGINNOTIFICATION_CREATE`, `LOGINNOTIFICATION_READ`, `LOGINNOTIFICATION_REMOVE`, `LOGINNOTIFICATION_UPDATE`, `LOG_READ`, `LOG_REMOVE`, `MEDICATION_CREATE`, `MEDICATION_READ`, `MEDICATION_REMOVE`, `MEDICATION_UPDATE`, `MOTD_CREATE`, `MOTD_READ`, `NOTIFICATIONTEMPLATE_CREATE`, `NOTIFICATIONTEMPLATE_READ`, `NOTIFICATIONTEMPLATE_REMOVE`, `NOTIFICATIONTEMPLATE_UPDATE`, `NOTIFICATION_ANSWER`, `NOTIFICATION_CREATE`, `NOTIFICATION_CREATE_BATCH`, `NOTIFICATION_READ`, `ONBOARDINGSTEP_CREATE`, `ONBOARDINGSTEP_READ`, `ONBOARDINGSTEP_REMOVE`, `ONBOARDINGSTEP_UPDATE`, `ONBOARDING_READ`, `ONBOARDING_SAVE`, `ONBOARDING_SAVE_ALL`, `PATIENTDATA_CREATE`, `PATIENTDATA_READ`, `PATIENTDATA_REMOVE`, `PATIENTDATA_UPDATE`, `PATIENT_CREATE`, `PATIENT_IMPORT`, `PATIENT_READ`, `PATIENT_READ_ALL`, `PATIENT_REMOVE`, `PATIENT_UPDATE`, `PATIENT_VIEW`, `PATIENT_VIEW_ALL`, `PRODUCT_CREATE`, `PRODUCT_READ`, `PRODUCT_REMOVE`, `PRODUCT_UPDATE`, `PROJECT_ADMIN`, `PROJECT_ASSIGNMENT`, `PROJECT_CREATE`, `PROJECT_FORCE_STORNO`, `PROJECT_GET`, `PROJECT_MANAGE`, `PROJECT_READ`, `PROJECT_STORNO`, `PROJECT_UPDATE`, `QUESTIONAIRE_CREATE`, `QUESTIONAIRE_READ`, `QUESTIONAIRE_REMOVE`, `QUESTIONAIRE_REVIEW`, `QUESTIONAIRE_UPDATE`, `REGISTERED`, `ROOM_CREATE`, `ROOM_READ`, `ROOM_REMOVE`, `ROOM_UPDATE`, `SELFSERVICE`, `SELF_ASSIGNMENT`, `SELF_CHECKINOUT`, `SERVICEQM_CREATE`, `SERVICEQM_READ`, `SERVICEQM_REMOVE`, `SERVICEQM_UPDATE`, `SHIFTPLAN_CREATE`, `SHIFTPLAN_READ`, `SHIFTPLAN_REMOVE`, `SHIFTPLAN_UPDATE`, `SHIFT_CREATE`, `SHIFT_GET`, `SKILL_WRITE`, `STANDARD`, `STORNOGROUP_CREATE`, `STORNOGROUP_READ`, `STORNOGROUP_REMOVE`, `STORNOGROUP_UPDATE`, `SUPPORTCATEGORY_CREATE`, `SUPPORTCATEGORY_READ`, `SUPPORTCATEGORY_REMOVE`, `SUPPORTCATEGORY_UPDATE`, `SUPPORTTICKET_ANSWER`, `SUPPORTTICKET_CREATE`, `SUPPORTTICKET_READ`, `SYSADMIN`, `SYSTEM_READ`, `SYSTEM_WRITE`, `TREATMENTCATEGORY_MANAGE`, `TREATMENTCATEGORY_READ`, `TREATMENT_CREATE`, `TREATMENT_READ`, `TREATMENT_REMOVE`, `TREATMENT_UPDATE`, `UNIFORM_READ`, `UNIFORM_WRITE`, `USER`, `USERS_ADMIN`, `USERS_CREATE`, `USERS_CUSTOMER_READ`, `USERS_DELETE`, `USERS_EXPERTS_READ`, `USERS_READ`, `USERS_ROLE_UPDATE`, `USERS_UPDATE`, `USERVIDEOHISTORY_CREATE`, `USERVIDEOHISTORY_READ`, `USERVIDEOHISTORY_REMOVE`, `USERVIDEOHISTORY_UPDATE`, `USER_GET`, `USER_READ`, `USER_UPDATE`, `VIDEOCATEGORY_CREATE`, `VIDEOCATEGORY_READ`, `VIDEOCATEGORY_REMOVE`, `VIDEOCATEGORY_UPDATE`, `VIDEOHISTORY_CREATE`, `VIDEOHISTORY_READ`, `VIDEOHISTORY_REMOVE`, `VIDEOHISTORY_UPDATE`, `VIDEO_CREATE`, `VIDEO_GET`, `VIDEO_READ`, `VIDEO_REMOVE`, `VIDEO_UPDATE`, `WARNING_READ`, `WARNING_REMOVE`, `WARNING_UPDATE`, `WORKHOUR_WRITE`, `WORKLOG_CONFIRM`, `WORKLOG_WRITE`) |
| `description` | `String` | Beschreibung (Freitext) |
| `_class` | `String` | Java-Klassenname: `de.videoclinic.model.AccessRight` (Used) |

### Cross-references
The `accessRight` entity is referenced by:
- [`group`](#entity-benutzergruppen-groups) (via `rights`)

---

## Entity: Videos (Videos)
Metadaten für Schulungs- oder Informationsvideos.

### Table: video
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `name` | `String` | Videotitel |
| `category` | `DBRef` | Referenz auf `videoCategory` |
| `file` | `Document` | Metadaten der Videodatei ([FileMetadata](#sub-entity-filemetadata)) |
| `preview` | `Document` | Metadaten des Vorschaubilds ([FileMetadata](#sub-entity-filemetadata)) |
| `lengthInSeconds` | `Long` | Videolänge in Sekunden |
| `path` | `String` | Speicherpfad |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Video` (Used) |

### Cross-references
The `video` entity is referenced by:
- [`userVideoHistory`](#entity-video-verlauf-user-video-history)

---

## Entity: Benutzergruppen (Groups)
Zusammenfassung von Benutzern zu Gruppen mit gemeinsamen Rollen und Rechten.

### Table: group
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `name` | `String` | Gruppenname |
| `_class` | `String` | `de.videoclinic.model.Group` (Used) |

### Cross-references
The `group` entity is referenced by:
- [`user`](#entity-experte-expert) (in `groups`)

---

## Entity: Videokategorien (Video Categories)
Kategorisierung von Videos in einer hierarchischen Struktur.

### Table: videoCategory
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `parent` | `Long` | Referenz auf übergeordnete Kategorie |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.VideoCategory` (Used) |

### Cross-references
The `videoCategory` entity is referenced by:
- [`video`](#entity-videos-videos)

---

## Entity: Länder (Countries)
Verzeichnis von Ländern für Adressdaten und Feiertagsberechnungen.

### Table: country
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `code` | `String` | Ländercode (ISO) |
| `description` | `String` | Name des Landes |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Country` (Used) |

### Cross-references
The `country` entity is used by:
- (Geographic lookup and address validation)

## Entity: Benachrichtigungsvorlagen (Notification Templates)
Vordefinierte Vorlagen für Systembenachrichtigungen basierend auf Ereignissen.

### Table: notificationTemplate
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `event` | `String` | Ereignis-Typ (Used: `APPOINTMENT_ACCEPTED`, `APPOINTMENT_AGREED`, `APPOINTMENT_ASSIGNED`, `APPOINTMENT_CANCELED`, `APPOINTMENT_DELETED`, `APPOINTMENT_DISAGREED`, `APPOINTMENT_DONE`, `APPOINTMENT_EXPERT_AGREED`, `APPOINTMENT_EXPERT_CANCELED`, `APPOINTMENT_EXPERT_DISAGREED`, `APPOINTMENT_REJECTED`, `APPOINTMENT_REMINDER`, `APPOINTMENT_REQUEST`, `APPOINTMENT_RESERVED`, `APPOINTMENT_STORNO`, `APPOINTMENT_UPCOMING`, `APPOINTMENT_UPCOMING_LOCATION`, `ASYNC_JOB_QUEUE_ERROR`, `ASYNC_JOB_QUEUE_SUCCESS`, `CONSULATION_REPORTED`, `CONSULATION_REPORTED_EXPERT`, `CONSULATION_REPORTING`, `CONSULATION_SUBMIT`, `CONSULTATION_REPORTING_PSYCHOTHERAPY`, `COUNCIL_START`, `COUNCIL_SUBMIT`, `EXPERT_SUMMARY`, `FORWARD_NOTIFICATION`, `HOLIDAY_REMOVED`, `HOLIDAY_REQUEST`, `INVOICE_CUSTOMER`, `JOB_FINISHED`, `RECOVER_PASSWORD`, `TEMPLATE`, `TREATMENT_END_STORNO`, `TREATMENT_EXPERT_START`, `TREATMENT_START`, `USER_PASSWORD`) |
| `subject` | `String` | Betreffzeile (Strukturierter Text) |
| `message` | `String` | Nachrichtentext mit Platzhaltern (Strukturierter Text) |
| `enabled` | `Boolean` | Ob die Vorlage aktiv ist |
| `language` | `String` | Sprache der Vorlage (Used: `de`) |
| `dateCreated` | `Date` | Erstellungsdatum |
| `_class` | `String` | `de.videoclinic.model.NotificationTemplate` (Used) |

### Cross-references
The `notificationTemplate` entity is used by:
- (System-wide notification logic triggered by events)

---

## Entity: Abgeschlossene Zeiträume (Closed Months)
Protokollierung von Abrechnungszeiträumen, die für Änderungen gesperrt wurden.

### Table: closedMonth
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `month` | `Number` | Monat |
| `year` | `Number` | Jahr |
| `dateClosed` | `Date` | Abschlussdatum |
| `closedBy` | `DBRef` | Abgeschlossen von (Referenz auf `user`) |
| `comment` | `String` | Kommentar zum Abschluss |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ClosedMonth` (Used) |

### Cross-references
The `closedMonth` entity is used by:
- (System-wide billing and locking processes)

---

## Entity: Export-Vorlagen (Export Templates)
Definition von Vorlagen für den Datenexport aus dem System.

### Table: exportTemplate
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `name` | `String` | Name der Vorlage |
| `filename` | `String` | Standard-Dateiname für den Export |
| `template` | `Document` | Metadaten der Template-Datei ([FileMetadata](#sub-entity-filemetadata)) |
| `type` | `String` | Export-Typ:<br>• `APPOINTMENT` (Used)<br>• `EXPERT` (Used)<br>• `WORKLOG` (Used) |
| `active` | `Boolean` | Status |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ExportTemplate` (Used) |

### Cross-references
The `exportTemplate` entity is used by:
- (Data export modules for generating CSV/PDF reports)

---

## Entity: Seiten/Standorte (Sites)
Allgemeine Informationen zu physischen Standorten oder Web-Präsenzen.

### Table: site
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `name` | `String` | Name der Seite |
| `address` | `String` | Adresse |
| `zip` | `String` | PLZ |
| `city` | `String` | Ort |
| `primary` | `Boolean` | Hauptstandort Kennzeichnung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Site` (Used) |

### Cross-references
The `site` entity is used for:
- (Organizational structure and location grouping)

---

## Entity: System-Ankündigungen (Message of the Day)
Meldungen, die Benutzern beim Login oder auf dem Dashboard angezeigt werden.

### Table: messageOfTheDay
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `message` | `String` | Die eigentliche Nachricht (HTML/Text) |
| `subject` | `String` | Betreff |
| `roles` | `Array` | Rollen, denen diese Nachricht angezeigt wird (Strings) |
| `dateStart` | `Date` | Anzeige ab |
| `dateEnd` | `Date` | Anzeige bis |
| `enabled` | `Boolean` | Status |
| `important` | `Boolean` | Wichtig-Kennzeichnung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.MessageOfTheDay` (Used) |

### Cross-references
The `messageOfTheDay` entity is used for:
- (Global announcements shown to users on the dashboard)

## Entity: Onboarding-Schritte (Onboarding Steps)
Definition der einzelnen Schritte, die ein Experte oder Standort während des Onboarding-Prozesses durchlaufen muss.

### Table: onboardingStep
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer (Zeitstempel) |
| `title` | `String` | Titel des Schritts (Freitext) |
| `description` | `String` | Detaillierte Beschreibung (Freitext) |
| `priority` | `Number` | Reihenfolge der Bearbeitung |
| `mandatory` | `Boolean` | Ob der Schritt verpflichtend ist |
| `type` | `String` | Art des Schritts:<br>• `CHECK` (Used) |
| `assignmentType` | `String` | Art der Zuordnung:<br>• `EMPLOYEE` (Used)<br>• `LOCATION` (Used) |
| `dateCreated` | `Date` | Erstellungszeitpunkt |
| `dateChanged` | `Date` | Zeitpunkt der letzten Änderung |
| `createdBy` | `DBRef` | Erstellt von (Referenz auf `user`) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.OnboardingStep` (Used) |

### Cross-references
The `onboardingStep` entity is referenced by:
- [`onboardingHistory`](#entity-onboarding-verlauf-onboarding-history) (as a snapshot in `step`)

---

## Entity: Sequenz-Zähler (Sequence Entity)
Zähler zur Generierung von fortlaufenden IDs für verschiedene Entitäten.

### Table: sequenceEntity
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Interner Bezeichner |
| `name` | `String` | Name der Sequenz (z.B. Entitätsname) |
| `value` | `Long` | Aktueller Zählerwert |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.SequenceEntity` (Used) |

### Cross-references
The `sequenceEntity` entity is used by:
- (Internal ID generation logic for various collections)

---

## Entity: Behandlungskategorien (Treatment Categories)
Kategorisierung von verschiedenen Behandlungsarten.

### Table: treatmentCategory
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version" | `Long` | Versionsnummer |
| `name` | `String` | Name der Kategorie (Used: `Allgemeinmedizin`, `Allgemeinmedizin_Telearzt`, `Andrologie`, `Anästhesie`, `Apotheke`, `Arbeitsmedizin`, `Audiologie`, `Augenheilkunde`, `Chirurgie`, `Diätassistent`, `Diätberatung`, `Durchgangsarzt`, `Gastroenterologie`, `Genetik`, `Gynäkologie`, `HNO-Heilkunde`, `Haut- und Geschlechtskrankheiten`, `Hämatologie`, `Hörgeräteakkustiker`, `Innere Medizin`, `Kardiologie`, `Kieferorthopädie`, `Labor`, `Logopädie`, `Mund-Kiefer-Gesichtschirurgie`, `Nephrologie`, `Neurologie`, `Nuklearmedizin`, `Onkologie`, `Optiker`, `Orthopädie`, `Orthopädieschuhmacher`, `Orthopädietechniker`, `Pathologie`, `Physiotherapie`, `Pneumologie`, `Psychiatrie`, `Psychiatrie_Telearzt`, `Pädiatrie`, `Radiologie`, `Rechtsmedizin`, `Sanitätshaus`, `Schmerztherapie`, `Traumatologie`, `Urologie`, `Zahnmedizin`, `Zahntechniker`, `sonstige`, `öffentliches Gesundheitswesen`) |
| `description` | `String` | Beschreibung (Freitext) |
| `prio` | `Number` | Priorität |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.TreatmentCategory` (Used) |

### Cross-references
The `treatmentCategory` entity is referenced by:
- [`treatment`](#entity-behandlungsverlauf-treatment) (via `category` DBRef)

---

## Entity: Abwesenheiten/Urlaub (Holidays)
Manuell eingetragene Abwesenheiten oder Urlaubszeiten von Experten.

### Table: holiday
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `start` | `Date` | Beginn der Abwesenheit |
| `until` | `Date` | Ende der Abwesenheit |
| `owner` | `DBRef` | Referenz auf `user` |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Holiday` (Used) |

### Cross-references
The `holiday` entity is used by:
- (Planning tools to show expert unavailability)

---

## Entity: Standort-Snapshots (Location Rooms DTO)
Snapshots von Standortdaten inklusive Raum-Informationen für die Web-Oberfläche.

### Table: locationRoomsDto
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `name` | `String` | Name des Standorts |
| `customer` | `DBRef` | Referenz auf `customer` |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.LocationRoomsDto` (Used) |

### Cross-references
The `locationRoomsDto` entity is used for:
- (UI snapshots of location data)

## Entity: Login-Benachrichtigungen (Login Notifications)
Spezifische Meldungen, die Benutzern beim Einloggen in das System angezeigt werden.

### Table: loginNotification
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `content` | `String` | Inhalt der Benachrichtigung |
| `dateFrom` | `Date` | Gültig ab |
| `dateTo` | `Date` | Gültig bis |
| `active` | `Boolean` | Status |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.LoginNotification` (Used) |

### Cross-references
The `loginNotification` entity is used for:
- (Alerts shown to users upon successful system login)

---

## Entity: Patientenergänzungsdaten (Patient Data)
Zusätzliche oder ergänzende Informationen zu Patienten, oft im Kontext spezifischer Termine.

### Table: patientData
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `onlyDocumentation` | `Boolean` | Nur Dokumentation Kennzeichnung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.PatientData` (Used) |

### Cross-references
The `patientData` entity references:
- [`appointment`](#entity-termine-appointments)
- [`location`](#entity-standorte-locations)

---

## Entity: Storno-Regelgruppen (Storno Groups)
Zusammenfassungen von Stornierungsregeln für verschiedene Dienstleistungen oder Kunden.

### Table: stornoGroup
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `comment` | `String` | Kommentar |
| `storno` | `Array` | Einzelne Stornierungsregeln ([StornoRule](#sub-entity-stornorule)) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.StornoGroup` (Used) |

### Cross-references
The `stornoGroup` entity is referenced by:
- [`jobId`](#entity-dienstleistung-service) (via `appointmentCondition.storno`)

### Sub-entities for stornoGroup

#### Sub-entity: StornoRule
Definiert eine spezifische Stornierungsbedingung (Zeitpunkt und Kosten).

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `name` | `String` | Bezeichnung der Regel |
| `stornoTime` | `Long` | Zeitpunkt (in Sekunden/Millisekunden vor Termin) |
| `percentage` | `Number` | Prozentsatz der Kosten |
| `type` | `String` | Art der Regel |
| `comment` | `String` | Kommentar |

### Cross-references
The `StornoRule` sub-entity is used within:
- [`stornoGroup`](#entity-storno-regelgruppen-storno-groups) (as `storno` array)

---

## Entity: Support-Kategorien (Support Categories)
Kategorisierung von Support-Anfragen und deren Zuordnung zu Bearbeitungsschlangen.

### Table: supportCategory
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `category` | `String` | Kategoriename (intern) |
| `title` | `String` | Anzeigename der Kategorie |
| `queue` | `String` | Bearbeitungsschlange (Queue) |
| `subcategories` | `Array` | Liste von Unterkategorien (Strings) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.SupportCategory` (Used) |

### Cross-references
The `supportCategory` entity is used for:
- (Internal helpdesk categorization of support tickets)

---

## Entity: Arbeitszeit-Kategorien (Work Hours)
Definition von standardisierten Arbeitszeit-Modellen oder Stundenkontingenten.

### Table: workHour
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `hours` | `Number` | Anzahl der Stunden |
| `code` | `String` | Kurzcode |
| `description` | `String` | Beschreibung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.WorkHour` (Used) |

### Cross-references
The `workHour` entity is used for:
- (Internal calculation of expert working hours)

## Entity: Patienten (Patients)
Zentrales Verzeichnis aller Patienten mit persönlichen Daten und Kontakthistorie.

### Table: patient
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `title` | `String` | Akademischer Titel |
| `firstName` | `String` | Vorname |
| `lastName` | `String` | Nachname |
| `displayName` | `String` | Vollständiger Name für die Anzeige |
| `birthday` | `Date` | Geburtsdatum |
| `location` | `DBRef` | Zugeordneter Standard-Standort |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Patient` (Used) |

### Cross-references
The `patient` entity is referenced by:
- [`consultationData`](#entity-konsultationsdaten-consultation-data) (implicitly via JVA identifiers or legacy links)
- [`treatment`](#entity-behandlungsverlauf-treatment) (implicitly via JVA identifiers)

---

## Entity: Ausrüstung (Equipment)
Verzeichnis von medizinischem Equipment, das an Standorten vorhanden sein kann.

### Table: equipment
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `description` | `String` | Beschreibung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Equipment` (Used) |

### Cross-references
The `equipment` entity is referenced by:
- [`questionaire`](#entity-qualit-tsumfragen-questionaires) (implicitly via quality ratings)

---

## Entity: Dateiuploads (Upload Files)
Registry aller über die Benutzeroberfläche hochgeladenen Dateien.

### Table: uploadFile
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `sessionId` | `String` | Session-ID des Uploads |
| `created` | `Long` | Erstellungszeitpunkt (Unix TS) |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.UploadFile` (Used) |

### Cross-references
The `uploadFile` entity references:
- (Uploaded files managed by the system)

---

## Entity: Projekte (Projects)
Verwaltung von Projekten, die Kunden und Standorten zugeordnet sind.

### Table: project
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `dateStart` | `Date` | Projektstart |
| `dateEnd` | `Date` | Projektende |
| `description` | `String` | Projektbeschreibung |
| `location` | `DBRef` | Referenz auf `location` |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Project` (Used) |

### Cross-references
The `project` entity is referenced by:
- (Internal project management tools)

---

## Entity: Tags (Tags)
Zentrales Verzeichnis für Tags zur Kategorisierung verschiedener Entitäten.

### Table: tag
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `count` | `Long` | Verwendungshäufigkeit |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Tag` (Used) |

### Cross-references
The `tag` entity is used for:
- (Labeling and filtering various system entities)

---

## Entity: Standorttypen (Location Types)
Kategorisierung von Standorten (z.B. JVA, Klinik).

### Table: locationType
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `name` | `String` | Name des Typs |
| `prio` | `Number` | Sortierpriorität |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.LocationType` (Used) |

### Cross-references
The `locationType` entity is referenced by:
- [`location`](#entity-standorte-locations) (conceptually, though not explicitly shown in schema samples)

## Entity: Kassenregistrierung (Cash Register)
Definition von Abrechnungseinheiten mit spezifischen Steuersätzen und ID-Formaten.

### Table: cashRegister
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `cashRegisterId` | `String` | ID der Kasse |
| `count` | `Long` | Aktueller Zähler für Rechnungsnummern |
| `enabled` | `Boolean` | Status |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.CashRegister` (Used) |

### Cross-references
The `cashRegister` entity is referenced by:
- [`invoice`](#entity-rechnungen-invoices)

### Sub-entities for cashRegister

#### Sub-entity: TaxValue
Definition eines Steuersatzes.

| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `String` | Internal identifier |
| `name` | `String` | Bezeichnung |
| `value` | `Number` | Prozentsatz |
| `enabled` | `Boolean` | Status |
| `start` | `Date` | Gültig ab |
| `until` | `Date` | Gültig bis |
| `description` | `String` | Beschreibung |

### Cross-references
The `TaxValue` sub-entity is used within:
- [`cashRegister`](#entity-kassenregistrierung-cash-register) (as `taxes` array)

---

## Entity: Testbenutzer (Test User)
Interne Testbenutzer für Systemprüfungen.

### Table: 1testuser
| Column | Type | Description |
| :--- | :--- | :--- |
| `password` | `String` | Passwort |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.TestUser` (Used) |

### Cross-references
The `1testuser` entity is used for:
- (System testing and QA)

---

## Entity: Service-Qualitätsmanagement (Service QM)
Protokollierung von Qualitätsmetriken für erbrachte Dienstleistungen.

### Table: serviceQm
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `dateCreated` | `Date` | Erstellungsdatum |
| `comment` | `String` | Kommentar |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.ServiceQm` (Used) |

### Cross-references
The `serviceQm` entity is used for:
- (Quality assurance reports)

---

## Entity: Räume (Rooms)
Definition von physischen Räumen an den Standorten.

### Table: room
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `available` | `Boolean` | Verfügbarkeit |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Room` (Used) |

### Cross-references
The `room` entity references:
- [`location`](#entity-standorte-locations)

---

## Entity: Systemkonfiguration (Videoclinic System)
Globale Systemeinstellungen und Metadaten.

### Table: videoclinicSystem
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `ObjectId` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `invoiceIdFormat` | `String` | Globales Format für Rechnungs-IDs |
| `accountManagement` | `Boolean` | Account-Management aktiviert |
| `timeManagement` | `Boolean` | Zeit-Management aktiviert |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.VideoclinicSystem` (Used) |

### Cross-references
The `videoclinicSystem` entity is used for:
- (Global system configuration and feature toggles)

---

## Entity: Ausrüstungsgruppen (Equipment Groups)
Kategorisierung von medizinischer Ausrüstung.

### Table: equipmentGroup
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `code` | `String` | Gruppen-Code |
| `description` | `String` | Beschreibung |
| `prio` | `Number` | Priorität |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.EquipmentGroup` (Used) |

### Cross-references
The `equipmentGroup` entity is referenced by:
- [`equipment`](#entity-ausr-stung-equipment) (conceptually, to group inventory items)

---

## Entity: Abteilungen (Departments)
Definition von organisatorischen Abteilungen.

### Table: department
| Column | Type | Description |
| :--- | :--- | :--- |
| `_id` | `Long` | Interner Bezeichner |
| `version` | `Long` | Versionsnummer |
| `code` | `String` | Abteilungs-Code |
| `description` | `String` | Beschreibung |
| `_class` | `String` | Java Klassenname: `de.videoclinic.model.Department` (Used) |

### Cross-references
The `department` entity is used for:
- (Organizational structure within locations)
