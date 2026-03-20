# Videoclinic MongoDB Mapping

This directory contains the mapping between business entities and the actual database schema of the `videoclinic` MongoDB database. Each file covers one category group of collections.

Source: `specs/draft/videoclinic.dbml`

---

## Database Overview

This section provides a high-level overview of the collections in the `videoclinic` database, grouped by their primary usage topics.

### Planning
Definition of consultation schedules, shifts, and expert availability.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`appointmentPlan`](./planning.md#entity-sprechstundenplan-appointment-plan) | Sprechstundenplan (Appointment Plan) | Definition of a consultation schedule entry, including service, day, repetitions, times, assigned experts, locations, and customers. |
| [`expertWeek`](./planning.md#entity-experten-wochenplan-expert-week) | Experten-Wochenplan (Expert Week) | Weekly availability and shift definitions for an individual expert. |
| [`expertDays`](./planning.md#entity-jahreskalender-eines-experten-expert-days) | Jahreskalender eines Experten (Expert Days) | Detailed availability calendar for experts, tracking shifts and appointment availability per day. |
| [`appointment`](./planning.md#entity-termine-appointments) | Termine (Appointments) | Individual appointments scheduled for patients with experts. |
| [`appointmentAssignment`](./planning.md#entity-terminzuweisungen-appointment-assignments) | Terminzuweisungen (Appointment Assignments) | Links between appointments and the experts or tasks assigned to them. |
| [`appointmentAssignmentHistory`](./planning.md#entity-terminzuweisungs-historie-appointment-assignment-history) | Terminzuweisungs-Historie (Appointment Assignment History) | Audit trail for changes to appointment assignments. |
| [`shiftPlan`](./planning.md#entity-schichtplan-shift-plan) | Schichtplan (Shift Plan) | Recurring shift schedule for expert on-call duties. |
| [`holiday`](./planning.md#entity-abwesenheiten-urlaub-holidays) | Abwesenheiten/Urlaub (Holidays) | Individual expert absences, vacations, or sick leave. |
| [`room`](./planning.md#entity-r-ume-rooms) | Räume (Rooms) | Individual consultation or treatment rooms within a location. |

### Capabilities
Definition of expert skills and required qualifications for services.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`skill`](./capabilities.md#entity-fähigkeiten-skills) | Fähigkeiten (Skills) | Definition of a skill (Fähigkeit), including name, description, type, and status. |

### User Management
Management of experts, users, roles, and their associated profiles and sessions.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`user`](./user-management.md#entity-experte-expert) | Experte (Expert) | Expert profile including personal details, contact info, credentials, status, billing info, and qualifications. |
| [`group`](./user-management.md#entity-benutzergruppen-groups) | Benutzergruppen (Groups) | Roles and permissions groups assigned to users. |
| [`accessRight`](./user-management.md#entity-zugriffsrechte-access-rights) | Zugriffsrechte (Access Rights) | Definition of individual permissions and their descriptions. |
| [`userFile`](./user-management.md#entity-benutzerdateien-user-files) | Benutzerdateien (User Files) | Metadata and references for files uploaded by or for users. |
| [`persistentSession`](./user-management.md#entity-benutzersitzungen-persistent-sessions) | Benutzersitzungen (Persistent Sessions) | Storage for persistent user authentication sessions. |
| [`onboardingHistory`](./user-management.md#entity-onboarding-verlauf-onboarding-history) | Onboarding-Verlauf (Onboarding History) | Records of onboarding steps completed by employees or locations. |
| [`onboardingStep`](./user-management.md#entity-onboarding-schritte-onboarding-steps) | Onboarding-Schritte (Onboarding Steps) | Individual steps and checks required for onboarding processes. |
| [`loginNotification`](./user-management.md#entity-login-benachrichtigungen-login-notifications) | Login-Benachrichtigungen (Login Notifications) | Specialized notifications triggered by user login events. |
| [`1testuser`](./user-management.md#entity-testbenutzer-test-user) | Testbenutzer (Test User) | Placeholder or dedicated entity for system testing and QA. |

### Treatment
Core medical data, consultations, treatments, and patient information.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`treatment`](./treatment.md#entity-behandlungsverlauf-treatment) | Behandlungsverlauf (Treatment) | Tracking of medical treatments, including states and positions. |
| [`treatmentCategory`](./treatment.md#entity-behandlungskategorien-treatment-categories) | Behandlungskategorien (Treatment Categories) | Categories for organizing and classifying different treatments. |
| [`consultationData`](./treatment.md#entity-konsultationsdaten-consultation-data) | Konsultationsdaten (Consultation Data) | Detailed data for a consultation, including medical records, prescriptions, and results. |
| [`consultation`](./treatment.md#entity-konsultationen-cqrs-read-projection) | Konsultationen (CQRS Read Projection) | Read-optimized CQRS projection of `consultationData`. Indexed on `{ period, location._id }` for list queries. |
| [`expertConsultationTemplate`](./treatment.md#entity-konsultationsvorlagen-expert-consultation-templates) | Konsultationsvorlagen (Expert Consultation Templates) | Custom templates used by experts for various consultation types. |
| [`patientData`](./treatment.md#entity-patientenerg-nzungsdaten-patient-data) | Patientenergänzungsdaten (Patient Data) | Additional metadata and settings associated with a patient profile. |
| [`patient`](./treatment.md#entity-patienten-patients) | Patienten (Patients) | Core patient profiles, including demographic and contact information. |
| [`patientAlerts`](./treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | Patientenbezogene Risikofaktoren / Warnhinweise (Patient Alerts) | Exclusion criteria (warnings) consisting of name, description, weight, and status. |
| [`serviceQm`](./treatment.md#entity-service-qualit-tsmanagement-service-qm) | Service-Qualitätsmanagement (Service QM) | Data related to quality assurance and management of medical services. |
| [`questionaire`](./treatment.md#entity-qualit-tsumfragen-questionaires) | Qualitätsumfragen (Questionaires) | Quality management surveys and results. |
| [`equipment`](./treatment.md#entity-ausr-stung-equipment) | Ausrüstung (Equipment) | Inventory of medical or technical equipment used in consultations. |
| [`equipmentGroup`](./treatment.md#entity-ausr-stungsgruppen-equipment-groups) | Ausrüstungsgruppen (Equipment Groups) | Grouping of equipment for easier management and assignment. |
| [`locationRoomsDto`](./treatment.md#entity-standort-snapshots-location-rooms-dto) | Standort-Snapshots (Location Rooms DTO) | Snapshots of location and room configurations at a specific point in time. |

### Academy (Training)
Educational resources and training materials for users.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`video`](./academy.md#entity-videos-videos) | Videos (Videos) | Metadata for instructional or informational videos in the system. |
| [`userVideoHistory`](./academy.md#entity-video-verlauf-user-video-history) | Video-Verlauf (User Video History) | Tracking of video call attempts and successful connections. |
| [`videoCategory`](./academy.md#entity-videokategorien-video-categories) | Videokategorien (Video Categories) | Categorization for organizing the video library. |

### News
System announcements and user notifications.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`notification`](./news.md#entity-benachrichtigungen-notifications) | Benachrichtigungen (Notifications) | Logs of notifications sent to users via various channels. |
| [`notificationTemplate`](./news.md#entity-benachrichtigungsvorlagen-notification-templates) | Benachrichtigungsvorlagen (Notification Templates) | Reusable templates for automated system notifications. |
| [`messageOfTheDay`](./news.md#entity-system-ank-ndigungen-message-of-the-day) | System-Ankündigungen (Message of the Day) | Global announcements displayed to users upon login. |

### Interfaces
Data exchange and integration with external systems like BasisWeb.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`basisWebData`](./interfaces.md#entity-jva-patientendaten-basis-web-data) | JVA Patientendaten (Basis Web Data) | Encrypted patient information from external JVA systems. |
| [`basisWebAppointment`](./interfaces.md#entity-web-terminanfragen-basis-web-appointment) | Web-Terminanfragen (Basis Web Appointment) | External appointment requests originating from BasisWeb. |

### External Data
Reference data including medical classifications, medications, and telephony logs.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`icd10`](./external-data.md#entity-icd-10-klassifikation-icd-10) | ICD-10 Klassifikation (ICD-10) | International Classification of Diseases (ICD-10) codes and descriptions. |
| [`medication`](./external-data.md#entity-medikamente-medication) | Medikamente (Medication) | Comprehensive database of medications, ingredients, and dosages. |
| [`zipCodeLookup`](./external-data.md#entity-plz-verzeichnis-zip-code-lookup) | PLZ-Verzeichnis (Zip Code Lookup) | Geographic reference data for postal codes and cities. |
| [`country`](./external-data.md#entity-l-nder-countries) | Länder (Countries) | Reference data for countries, including codes and names. |
| [`publicHoliday`](./external-data.md#entity-feiertage-public-holidays) | Feiertage (Public Holidays) | Definition of public holidays for specific regions and years. |
| [`cDRCall`](./external-data.md#entity-anrufliste-cdr-calls) | Anrufliste (CDR Calls) | Call Detail Records for tracking telephonic interactions. |
| [`cDRCallAssignment`](./external-data.md#entity-cdr-call-zuweisungen-cdr-call-assignment) | CDR Call Zuweisungen (CDR Call Assignment) | Mapping of call records to specific patients or consultations. |

### Customer
Entities related to customers, locations, and sites.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`customer`](./customer.md#entity-kunden-customers) | Kunden (Customers) | Organizational entities (customers) that are assigned to locations and appointment plans. |
| [`location`](./customer.md#entity-standorte-locations) | Standorte (Locations) | Definition of consultation sites, including room configurations and contact details. |
| [`locationType`](./customer.md#entity-standorttypen-location-types) | Standorttypen (Location Types) | Classification for different types of consultation locations. |
| [`site`](./customer.md#entity-seiten-standorte-sites) | Seiten/Standorte (Sites) | Physical locations or digital sites associated with the system. |

### Accounting
Entities related to billing, customers, pricing, and financial tracking.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`invoice`](./accounting.md#entity-rechnungen-invoices) | Rechnungen (Invoices) | Billing documents for experts, customers, or patients. |
| [`invoiceComponent`](./accounting.md#entity-rechnungskomponenten-invoice-components) | Rechnungskomponenten (Invoice Components) | Individual items and rules contributing to a final invoice. |
| [`invoiceReceiver`](./accounting.md#entity-rechnungsempf-nger-invoice-receivers) | Rechnungsempfänger (Invoice Receivers) | Details of entities receiving invoices, including tax settings. |
| [`expertWorkMonthly`](./accounting.md#entity-monatliche-expertenarbeit-expert-work-monthly) | Monatliche Expertenarbeit (Expert Work Monthly) | Aggregated monthly work logs and billing summaries for experts. |
| [`jobId`](./accounting.md#entity-dienstleistung-service) | Dienstleistung (Service) | Definition of a service (Dienstleistung), including title, color, billing modality, specialty, and consultation types. |
| [`jobPriceList`](./accounting.md#entity-preislisten-job-price-lists) | Preislisten (Job Price Lists) | Master price lists for different services and specialties. |
| [`product`](./accounting.md#entity-waren-products) | Waren (Products) | Goods or services subscribed by the expert, including quantity, price, and dates. |
| [`cashRegister`](./accounting.md#entity-kassenregistrierung-cash-register) | Kassenregistrierung (Cash Register) | Records of cash transactions and POS register states. |
| [`closedMonth`](./accounting.md#entity-abgeschlossene-zeitr-ume-closed-months) | Abgeschlossene Zeiträume (Closed Months) | Tracking of billing periods that have been finalized and locked. |
| [`stornoGroup`](./accounting.md#entity-storno-regelgruppen-storno-groups) | Storno-Regelgruppen (Storno Groups) | Rules and groups defining cancellation conditions and fees. |
| [`workHour`](./accounting.md#entity-arbeitszeit-kategorien-work-hours) | Arbeitszeit-Kategorien (Work Hours) | Definitions of different work hour types for billing and reporting. |

### System
Technical configurations, logs, and system-wide settings.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`log`](./system.md#entity-system-logs-logs) | System-Logs (Logs) | Technical application logs for monitoring and debugging. |
| [`asyncJobQueue`](./system.md#entity-hintergrundaufgaben-async-job-queue) | Hintergrundaufgaben (Async Job Queue) | Status and tracking of asynchronous background tasks. |
| [`exportTemplate`](./system.md#entity-export-vorlagen-export-templates) | Export-Vorlagen (Export Templates) | Configuration for data exports for various business entities. |
| [`supportCategory`](./system.md#entity-support-kategorien-support-categories) | Support-Kategorien (Support Categories) | Categories used for organizing support requests and help documents. |
| [`uploadFile`](./system.md#entity-dateiuploads-upload-files) | Dateiuploads (Upload Files) | Records of generic file uploads managed by the system. |
| [`sequenceEntity`](./system.md#entity-sequenz-z-hler-sequence-entity) | Sequenz-Zähler (Sequence Entity) | Global counters used to generate unique numeric identifiers. |
| [`videoclinicSystem`](./system.md#entity-systemkonfiguration-videoclinic-system) | Systemkonfiguration (Videoclinic System) | Global system settings and configuration parameters. |
| [`cacheState`](./system.md#entity-cache-status-cache-state) | Cache-Status (Cache State) | Technical collection for tracking the version/state of various system caches. |

### Depricated (not implemented)
Tables that are no longer in use or not yet implemented.

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`tag`](./deprecated.md#entity-tags-tags) | Tags (Tags) | Metadata tags used for labeling and filtering various system entities. |
| [`project`](./deprecated.md#entity-projekte-projects) | Projekte (Projects) | Organizational entities used to group related resources or operations. |
| [`department`](./deprecated.md#entity-abteilungen-departments) | Abteilungen (Departments) | Medical specialties or organizational departments. |

---

## Sub-documents

| File | Description |
| :--- | :--- |
| [planning.md](./planning.md) | Planning entities: appointment plans, expert schedules, shift plans, holidays, and rooms. |
| [capabilities.md](./capabilities.md) | Capabilities entities: skill definitions and qualifications. |
| [user-management.md](./user-management.md) | User Management entities: experts, groups, access rights, sessions, and onboarding. |
| [treatment.md](./treatment.md) | Treatment entities: treatments, consultations, patients, and quality management. |
| [academy.md](./academy.md) | Academy (Training) entities: videos, video history, and video categories. |
| [news.md](./news.md) | News entities: notifications, notification templates, and messages of the day. |
| [interfaces.md](./interfaces.md) | Interfaces entities: BasisWeb data and appointment requests from external JVA systems. |
| [external-data.md](./external-data.md) | External Data entities: ICD-10, medications, geographic lookups, and call records. |
| [customer.md](./customer.md) | Customer entities: customers, locations, location types, and sites. |
| [accounting.md](./accounting.md) | Accounting entities: invoices, services, price lists, products, and financial tracking. |
| [system.md](./system.md) | System entities: logs, async jobs, export templates, sequences, and system config. |
| [deprecated.md](./deprecated.md) | Deprecated entities: tags, projects, and departments (not implemented). |

---

## Enumeration Overlaps and Redundancies

This section identifies overlapping or redundant "enum-like" string columns within the `videoclinic` MongoDB. These overlaps range from identical value sets to subsets where one field covers a portion of another's domain.

### Identical Overlaps
These fields have exactly the same set of values and could likely be unified.
- **`appointment.type`**, **`consultationData.appointmentType`**, and **`jobId.type`**
   - Values: `{APPOINTMENT, SHIFT}`
- **`appointment.priceType`** and **`shiftPlan.priceType`**
   - Values: `{WEEKDAY, WEEKNIGHT, WEEKENDDAY, WEEKENDNIGHT}`
- **`consultationData.type`** and **`consultation.type`**
   - Both have identical values: `{EXTERNAL, STANDARD, DOCUMENT, ONBOARDING, ONBOARDING_SHORT, INCARCERATION, TREATMENT}`
   - *Note:* Confirmed via MongoDB counts that `consultationData` uses all 7 types (previously documented as subset only).

### Subset / Parent-Child Overlaps
These fields share values, where one is a more specific subset of a broader category.

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

### Related Collections
- [`appointment`](./planning.md#entity-termine-appointments)
- [`consultationData`](./treatment.md#entity-konsultationsdaten-consultation-data)
- [`consultation`](./treatment.md#entity-konsultationen-cqrs-read-projection)
- [`jobId`](./accounting.md#entity-dienstleistung-service)
- [`shiftPlan`](./planning.md#entity-schichtplan-shift-plan)
- [`expertWeek`](./planning.md#entity-experten-wochenplan-expert-week)
- [`treatment`](./treatment.md#entity-behandlungsverlauf-treatment)
- [`user`](./user-management.md#entity-experte-expert)

---

## Shared Sub-Entities Reference

These PascalCase sub-entities are reused as **denormalized snapshots** across multiple domains. They are embedded documents, not MongoDB collections.

| Sub-entity | Source collection | Embedded fields | Domains |
|---|---|---|---|
| `ConsultationDoctor` | `user` | `_id`, `name`, `email`, `formalDisplayName` | treatment, news, external-data, system, planning |
| `ConsultationJob` | `jobId` | `_id`, `code`, `color`, `expertTitle`, `remoteCode`, `title`, `type` | treatment, planning, accounting |
| `ConsultationLocation` | `location` | `_id`, `name`, `booknumberMask`, `patientDataType`, + nested `ConsultationCustomer` | treatment, planning |
| `ConsultationCustomer` | `customer` | `_id`, `name` | treatment, planning |
| `PlanUser` | `user` | `_id`, `name`, `email`, `formalDisplayName` | planning, user-management |
| `PlanJob` | `jobId` | `_id`, `code`, `color`, `expertTitle`, `remoteCode`, `title`, `type` | planning |
| `PlanLocation` | `location` | `_id`, `name`, `booknumberMask`, `patientDataType`, + nested `PlanCustomer` | planning |
| `PlanCustomer` | `customer` | `_id`, `name` | planning |

> **Multi-level snapshot nesting**: `ConsultationLocation` and `PlanLocation` each embed a customer snapshot (`ConsultationCustomer` / `PlanCustomer`), demonstrating that a snapshot can itself contain another snapshot.
>
> **Context-shaped snapshots**: `PlanUser` and `ConsultationDoctor` both snapshot `user`, but exist as distinct types because different write-time contexts require them independently. Same applies to `PlanJob` vs `ConsultationJob`.

---

## CQRS Pair Registry

Known dual-collection pairs implementing the CQRS-lite vertical partitioning pattern.

| Source of Truth | Read Projection | Shared `_class` | Fields only in source | Index on projection |
|---|---|---|---|---|
| [`consultationData`](./treatment.md#entity-konsultationsdaten-consultation-data) | [`consultation`](./treatment.md#entity-konsultationen-cqrs-read-projection) | `de.videoclinic.model.Consultation` | `paymentType` | `{ period: 1, "location._id": 1 }` |
