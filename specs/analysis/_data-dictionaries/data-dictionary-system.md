---
title: 'Data Dictionary System'
---

# Data Dictionary — System (Tier 3)

This document maps all UI elements from the System modules (Sysconfig, Telephony/CDR, Notifications, Utilities, and Admin dashboards) to their corresponding MongoDB collection fields.

## 1. System Configuration & Maintenance

### 1.1 Sysconfig Tabs (`admin/sysconfig.htmlm`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **Tab: Basis Web** | | | | | | | | | | |
| Jnummer | Jnummer | `jnummer` | — | — | `string` | `text input` | — | No | No | — |
| JVA | JVA | `jva` | — | — | `string` | `text input` | — | No | No | — |
| UID | UID | `fetchuid` | — | — | `string` | `text input` | — | No | No | — |
| PIN | pin | `pin` | — | — | `string` | `text input` | — | No | No | — |
| Treatment ID | Behandlungs-Id | `consultationId` | — | — | `number` | `text input` | — | No | No | — |
| Load Basis Web data | Basis Web Data laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.updateBasisWeb` |
| Load open registrations | Offene Anmeldungen laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `BasisWebAppointmentService.fetch` |
| Sync Registration List | Anmeldungsliste Angleichen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `BasisWebAppointmentService.sync` |
| Load Emergency Form | Notfallbogen laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `BasisWebDataService.fetchBogen` |
| Decrypt Emergency Form | Notfallbogen entschlüsseln | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `BasisWebDataService.decryptBogen` |
| Show Treatment Data (XML) | Behandlungs-Daten anzeigen (XML) | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `BasisWebDataService.getSerializedResult` |
| **Tab: Cache** | | | | | | | | | | |
| Id | Id | `cache.id` | `cacheState._id` | [system.md#entity-cache-state](_mongodb-mapping/system.md#entity-cache-state) | `string` | `text` | — | — | Yes | Grid column |
| Size | Size | `cache.size` | `cacheState.size` (inferred) | [system.md#entity-cache-state](_mongodb-mapping/system.md#entity-cache-state) | `number` | `text` | — | — | Yes | Grid column |
| TS | TS | `cache.ts` | `cacheState.ts` (inferred) | [system.md#entity-cache-state](_mongodb-mapping/system.md#entity-cache-state) | `datetime` | `text` | — | — | Yes | Grid column |
| Hits | Hits | `cache.hits` | `cacheState.hits` (inferred) | [system.md#entity-cache-state](_mongodb-mapping/system.md#entity-cache-state) | `number` | `text` | — | — | Yes | Grid column |
| Misses | Misses | `cache.miss` | `cacheState.miss` (inferred) | [system.md#entity-cache-state](_mongodb-mapping/system.md#entity-cache-state) | `number` | `text` | — | — | Yes | Grid column |
| Resets | Resets | `cache.resets` | `cacheState.resets` (inferred) | [system.md#entity-cache-state](_mongodb-mapping/system.md#entity-cache-state) | `number` | `text` | — | — | Yes | Grid column |
| DbChecks | DbChecks | `cache.dbchecks` | `cacheState.dbchecks` (inferred) | [system.md#entity-cache-state](_mongodb-mapping/system.md#entity-cache-state) | `number` | `text` | — | — | Yes | Grid column |
| Verify Caches | Caches Verifizieren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.verifyCaches` |
| Clear Caches | Caches Leeren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.clearCaches` |
| **Tab: Data Update** | | | | | | | | | | |
| Year | Jahr | `updatePublicHolidaysYear` | — | — | `number` | `number input` | — | No | No | — |
| Id Format | Id Format | `data.idFormat` | `videoclinicSystem.invoiceIdFormat` | [system.md#entity-videoclinic-system](_mongodb-mapping/system.md#entity-videoclinic-system) | `string` | `text input` | — | Yes | No | — |
| Count | Count | `data.count` | `sequenceEntity.value` | [system.md#entity-sequence-entity](_mongodb-mapping/system.md#entity-sequence-entity) | `number` | `number input` | — | Yes | No | — |
| Load Public Holidays | Feiertage laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `ImportService.updatePublicHolidays` |
| Sync Locations | Orte mit Otobo Abgleichen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `LocationService.otoboSync` |
| Update Count/Format | Update Count/Format | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.updateCashRegister` |
| Load Missing Templates | Fehlende Vorlagen laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.loadMissingNotificationTemplates` |
| Load Incoming CDR Data | Incoming CDR Daten laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `CdrCallService.importIncoming` |
| **Tab: Data Cleanup** | | | | | | | | | | |
| Fix Start date | Zeitraum Start | `fixStart` | — | — | `date` | `date input` | — | No | No | — |
| Fix Until date | Zeitraum Ende | `fixUntil` | — | — | `date` | `date input` | — | No | No | — |
| Attachment File Check | Attachment File Check | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.fixAttachments` |
| Clear File Cache | FileCache Leeren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: UI only |
| Fix Display Names | Namen Anpassen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `UserService.fixDisplayName` |
| Recalculate Appointment Times | Termin Neu Berechnen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.fixTimes` |
| Manually Send Reminders | Termin-Erinnerung Manuell senden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.triggerReminder` |
| **Tab: Training** | | | | | | | | | | |
| Appointment IDs | — | `moveAppointmentIds` | — | — | `string` | `text input` | — | No | No | Comma-separated |
| Target date | — | `moveAppointmentDate` | — | — | `date` | `date input` | — | No | No | — |
| Move Appointments | Termine Verschieben | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AdminService.moveAppointments` |

### 1.2 CSV Import (`admin/import.htmlm`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| File input | — | `importFile` | — | — | `file` | `file input` | — | Yes | No | — |
| Upload | — | — | — | — | `action` | `file upload` | — | — | — | **Workflow-only**: calls `ImportService.upload` |

### 1.3 Template Editor (`admin/template.htmlm`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Markdown | Markdown | `templateMarkdown` | — | — | `bigstring` | `textarea` | — | No | No | Local preview editor |
| Template | Template | `templateContent` | — | — | `bigstring` | `textarea` | — | No | Yes | Rendered preview |

## 2. Telephony & Call Detail Records

### 2.1 CDR Calls (`cdr-call/cdr-call.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **Grid Filters** | | | | | | | | | | |
| Year | Jahr | `year` | — | — | `number` | `input` | — | No | No | Filter |
| Month | Monat | `month` | — | — | `number` | `select` | — | No | No | Filter |
| Day | Tag | `day` | — | — | `number` | `select` | — | No | No | Filter |
| **Detail Fields** | | | | | | | | | | |
| ID | ID | `data.id` | `cDRCall._id` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `number` | `text input` | — | No | Yes | Grid + Detail |
| Status | Status | `data.type` | `cDRCall.type` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `enum:CdrStatus` | `text` | INVALID_UNKNOWN, DIRECT, FORWARDED, etc | No | Yes | Grid |
| Expert | Experte | `data.user` | `cDRCall.userId` (DBRef) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `reference:user` | `text` | — | No | Yes | Grid |
| Place | Ort | `data.location` | `cDRCall.location` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text` | — | No | Yes | Grid |
| Date Start | Startdatum | `data.dateStart` | `cDRCall.dateStart` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `datetime` | `date input` | — | No | No | Grid + Detail |
| Connected | Verbunden | `data.dateConnect` | `cDRCall.dateConnect` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `datetime` | `date input` | — | No | No | Grid + Detail |
| Ended | Beendet | `data.dateDisconnect` | `cDRCall.dateDisconnect` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `datetime` | `date input` | — | No | No | Grid + Detail |
| Duration | Dauer | `data.duration` | `cDRCall.duration` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `number` | `number input` | — | No | No | Grid + Detail |
| Caller | Anrufer | `data.callingNumber` | `cDRCall.callingNumber` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Grid + Detail |
| Receiver | Empfänger | `data.calledNumber` | `cDRCall.calledNumber` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text` | — | No | Yes | Grid |
| Calling User | callingUser | `data.callingUser` | `cDRCall.callingUser` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Grid + Detail |
| Final User | Endbenutzer | `data.finalUserId` | `cDRCall.finalUserId` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Grid + Detail |
| Final Number | Endnummer | `data.finalNumber` | `cDRCall.finalNumber` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Grid + Detail |
| Conversation ID | conversationId | `data.conversationId` | `cDRCall.conversationId` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `number` | `number input` | — | No | No | Grid + Detail |
| Assigned | Zugeordnet | `data.assignmentId` | `cDRCall.assignmentId` (DBRef) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `number` | `number input` | — | No | No | Grid + Detail |
| Pk ID | pkId | `data.pkId` | `cDRCall.pkId` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `number` | `number input` | — | No | No | Grid + Detail |
| Calling Uri | callingUri | `data.callingUri` | `cDRCall.callingUri` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Original Called Uri | originalCalledUri | `data.originalCalledUri` | `cDRCall.originalCalledUri` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Last Redirect | lastRedirect | `data.lastRedirect` | `cDRCall.lastRedirect` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Join On Behalf | joinOnBehalf | `data.joinOnBehalf` | `cDRCall.joinOnBehalf` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `number` | `number input` | — | No | No | Detail |
| Dest Conversation ID | destConversationId | `data.destConversationId` | `cDRCall.destConversationId` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Original Number | originalNumber | `data.originalNumber` | `cDRCall.originalNumber` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Dest Device | destDevice | `data.destDevice` | `cDRCall.destDevice` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Orig Device | origDevice | `data.origDevice` | `cDRCall.origDevice` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Video | ideo | `data.ideo` | `cDRCall.video` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `boolean` | `checkbox` | — | No | No | Detail |
| Controller Info | controllerInfo | `data.controllerInfo` | `cDRCall.controllerInfo` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Hunt Pilot | huntPilot | `data.huntPilot` | `cDRCall.huntPilot` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text input` | — | No | No | Detail |
| Dest Cause | destCause | `data.destCause` | `cDRCall.destCause` (inferred) | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `number` | `number input` | — | No | No | Detail |
| Export | Exportieren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `generateExport(xls)` |
| Export CSV | Export CSV | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `generateExport(csv)` |
| Reset Calls | Reset Calls | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `resetCalls` |
| Upload | Upload | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: upload CSV |
| Analyze Open | Analyze Open | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `analyzeOpenCalls` |

### 2.2 CDR Call Assignment (`cdr-call/cdr-call.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `cDRCallAssignment._id` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `number` | `text input` | — | No | Yes | Grid + Detail |
| Confidence | confidence | `data.confidence` | `cDRCallAssignment.confidence` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `number` | `number input` | — | No | No | Grid + Detail |
| Start | Start | `data.start` | `cDRCallAssignment.start` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `datetime` | `date input` | — | No | No | Grid + Detail |
| Until | until | `data.until` | `cDRCallAssignment.until` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `datetime` | `date input` | — | No | No | Grid + Detail |
| Duration | duration | `data.duration` | `cDRCallAssignment.duration` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `number` | `number input` | — | No | No | Grid + Detail |
| User | Benutzer | `data.user` | `cDRCallAssignment.user` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `reference:User` | `autocomplete` | `UserInfoService.autocomplete` | No | No | Grid + Detail |
| Location ID | locationId | `data.locationId` | `cDRCallAssignment.locationId` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `number` | `number input` | — | No | No | Grid + Detail |
| Location | location | `data.location` | `cDRCallAssignment.location` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `string` | `text input` | — | No | No | Grid + Detail |
| Appointment ID | appointmentId | `data.appointmentId` | `cDRCallAssignment.appointmentId` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `number` | `number input` | — | No | No | Grid + Detail |
| Consultation ID | consultationId | `data.consultationId` | `cDRCallAssignment.consultationId` | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `number` | `number input` | — | No | No | Grid + Detail |
| Conference | Conference | `data.conferenceId` | `cDRCallAssignment.conferenceId` (inferred) | [external-data.md#entity-cdr-call-assignment](_mongodb-mapping/external-data.md#entity-cdr-call-assignment) | `number` | `text` | — | No | Yes | Grid |
| Assign | Assign | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `CdrCallService.assignCalls` |

## 3. Communication & News

### 3.1 Message of the Day (`admin-cruds/motd-template.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `messageOfTheDay._id` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `number` | `text` | — | No | Yes | Grid |
| Title | Titel | `data.subject` | `messageOfTheDay.subject` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `string` | `text input` | — | No | No | Grid + Detail |
| Enabled | Aktiviert | `data.enabled` | `messageOfTheDay.enabled` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `boolean` | `checkbox` | — | No | No | Grid + Detail |
| Priority | Prioritat | `data.priority` | `messageOfTheDay.important` (enum variant) | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `enum:Priority` | `select` | LOW, NORMAL, HIGH, URGENT | No | No | Grid + Detail |
| Start date | Start | `data.startDate` | `messageOfTheDay.dateStart` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `date` | `date input` | — | No | No | Grid + Detail |
| Start time | Start | `data.startTime` | `messageOfTheDay.dateStart` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `time` | `time input` | — | No | No | Detail |
| End date | Ende | `data.endDate` | `messageOfTheDay.dateEnd` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `date` | `date input` | — | No | No | Detail |
| End time | Ende | `data.endTime` | `messageOfTheDay.dateEnd` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `time` | `time input` | — | No | No | Detail |
| Role: New | Neu | `data.roles[]` | `messageOfTheDay.roles` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `boolean` | `checkbox` | — | No | No | Detail |
| Role: Expert | Experte | `data.roles[]` | `messageOfTheDay.roles` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `boolean` | `checkbox` | — | No | No | Detail |
| Role: Admin Intern | Admin Intern | `data.roles[]` | `messageOfTheDay.roles` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `boolean` | `checkbox` | — | No | No | Detail |
| Role: Admin | Admin | `data.roles[]` | `messageOfTheDay.roles` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `boolean` | `checkbox` | — | No | No | Detail |
| Role: Customer | Kunde | `data.roles[]` | `messageOfTheDay.roles` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `boolean` | `checkbox` | — | No | No | Detail |
| Role: Admin Customer | Admin-Kunde | `data.roles[]` | `messageOfTheDay.roles` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `boolean` | `checkbox` | — | No | No | Detail |
| Message | — | `data.message` | `messageOfTheDay.message` | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `bigstring` | `textarea` | — | Yes | No | Markdown content |
| Link | Link | `data.link` | `messageOfTheDay.link` (inferred) | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `string` | `text input` | — | No | No | Detail |
| Sort order | Sortierung | `data.sort` | `messageOfTheDay.sort` (inferred) | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `number` | `number input` | — | No | No | Grid + Detail |
| Width (1-12) | Breite (1-12) | `data.width` | `messageOfTheDay.width` (inferred) | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `number` | `number input` | — | No | No | Detail |
| Image Position | Bildposition | `data.imagePos` | `messageOfTheDay.imagePos` (inferred) | [news.md#entity-message-of-the-day](_mongodb-mapping/news.md#entity-message-of-the-day) | `enum:ImagePos` | `select` | LEFT, TOP, BOTTOM, BACK | No | No | Detail |
| File upload | — | `upload` | — | — | `file` | `file upload` | — | No | No | Encoded in payload on save |

### 3.2 Login Notification (`config/system-config.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `loginNotification._id` | [news.md#er-diagram](_mongodb-mapping/news.md#er-diagram) | `number` | `text` | — | No | Yes | Grid + Detail |
| Content | Name | `data.content` | `loginNotification.content` (inferred) | [news.md#er-diagram](_mongodb-mapping/news.md#er-diagram) | `bigstring` | `textarea` | — | No | No | Grid + Detail |
| From Date | `dateFilter.fromDate` | `data.dateFrom` | `loginNotification.dateFrom` | [news.md#er-diagram](_mongodb-mapping/news.md#er-diagram) | `datetime` | `date input` | — | No | No | Grid + Detail |
| To Date | `dateFilter.toDate` | `data.dateTo` | `loginNotification.dateTo` | [news.md#er-diagram](_mongodb-mapping/news.md#er-diagram) | `datetime` | `date input` | — | No | No | Grid + Detail |
| Active | Aktiv | `data.active` | `loginNotification.active` | [news.md#er-diagram](_mongodb-mapping/news.md#er-diagram) | `boolean` | `checkbox` | — | No | No | Grid + Detail |
| Accept | Akzeptieren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: from Modal dialog |
| Cancel | Abbrechen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: logs out user |

### 3.3 Notifications (`notification/notification.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Important | Wichtig | `important` | `notification.important` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `boolean` | `icon` | — | No | Yes | Grid |
| From | Sender | `from` | `notification.from` (DBRef) | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `reference:User` | `text` | — | No | Yes | Grid |
| Date | Datum | `ts` | `notification.ts` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `datetime` | `text` | — | No | Yes | Grid |
| Subject | Titel | `subject` | `notification.subject` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `string` | `text` | — | No | Yes | Grid |
| Folder | Ort | `folder` | `notification.folder` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `enum:Folder` | `text` | INBOX, OUTBOX, ARCHIVE, TRASH | No | Yes | Grid |
| Recipient | Empfänger | `data.to.name` | `notification.to` (DBRef) | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `reference:User` | `text` | — | No | Yes | Detail |
| Sender | Sender | `data.from.name` | `notification.from` (DBRef) | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `reference:User` | `text` | — | No | Yes | Detail |
| Date | Datum | `data.ts` | `notification.ts` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `datetime` | `text` | — | No | Yes | Detail |
| Subject | Titel | `data.subject` | `notification.subject` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `string` | `text` | — | No | Yes | Detail |
| Message | Nachricht | `data.message` | `notification.message` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `bigstring` | `text` | — | No | Yes | Detail |
| **Compose Dialogs** | | | | | | | | | | |
| Recipients | Empfänger | `data.tos` | `notification.to` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `array:reference:User` | `checkbox` | — | Yes | No | Multi message dialog |
| Recipient | Empfänger | `data.to` | `notification.to` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `reference:User` | `autocomplete` | `UserService.findEmployee` | Yes | No | Single message dialog |
| Subject | Titel | `data.subject` | `notification.subject` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `string` | `text input` | — | Yes | No | Dialogs |
| Message | Nachricht | `data.message` | `notification.message` | [news.md#entity-notifications](_mongodb-mapping/news.md#entity-notifications) | `bigstring` | `textarea` | — | No | No | Dialogs |

### 3.4 Bug Report (`includes/includes-customization.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Subject | Betreff | `data.errorReport.subject` | — | — | `string` | `text input` | — | Yes | No | **Workflow-only**: SupportTicketService |
| Message | Nachricht | `data.errorReport.message` | — | — | `bigstring` | `textarea` | — | Yes | No | **Workflow-only**: SupportTicketService |

## 4. Templates & Master Data

### 4.1 Export Templates (`templates-files/templates-files.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `exportTemplate._id` | [system.md#entity-export-templates](_mongodb-mapping/system.md#entity-export-templates) | `number` | `text` | — | No | Yes | Grid + Detail |
| Name | Name | `data.name` | `exportTemplate.name` | [system.md#entity-export-templates](_mongodb-mapping/system.md#entity-export-templates) | `string` | `text input` | — | Yes | No | Grid + Detail |
| Description | Beschreibung | `data.description` | `exportTemplate.description` (inferred) | [system.md#entity-export-templates](_mongodb-mapping/system.md#entity-export-templates) | `bigstring` | `textarea` | — | No | No | Grid + Detail |
| Type | Typ | `data.type` | `exportTemplate.type` | [system.md#entity-export-templates](_mongodb-mapping/system.md#entity-export-templates) | `enum:ExportTemplateType` | `select` | — | Yes | No | Grid + Detail |
| Active | Aktiv | `data.active` | `exportTemplate.active` | [system.md#entity-export-templates](_mongodb-mapping/system.md#entity-export-templates) | `boolean` | `checkbox` | — | No | No | Grid + Detail |
| Priority | Prioritaet | `data.prio` | `exportTemplate.prio` (inferred) | [system.md#entity-export-templates](_mongodb-mapping/system.md#entity-export-templates) | `number` | `number input` | — | No | No | Detail |
| Filename | Dateiname | `data.filename` | `exportTemplate.filename` | [system.md#entity-export-templates](_mongodb-mapping/system.md#entity-export-templates) | `string` | `text input` | — | No | No | Detail |
| File | Datei | `template` | `exportTemplate.template` | [system.md#entity-export-templates](_mongodb-mapping/system.md#entity-export-templates) | `file` | `file upload` | — | No | No | Detail |

### 4.2 Notification Templates (`templates-files/templates-files.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `notificationTemplate._id` | [news.md#entity-notification-templates](_mongodb-mapping/news.md#entity-notification-templates) | `number` | `text` | — | No | Yes | Grid + Detail |
| Event | Ereignis | `data.event` | `notificationTemplate.event` | [news.md#entity-notification-templates](_mongodb-mapping/news.md#entity-notification-templates) | `enum:NotificationEvent` | `select` | — | No | No | Grid + Detail |
| Subject | Betreff | `data.subject` | `notificationTemplate.subject` | [news.md#entity-notification-templates](_mongodb-mapping/news.md#entity-notification-templates) | `string` | `text input` | — | No | No | Grid + Detail |
| Message | Nachricht | `data.message` | `notificationTemplate.message` | [news.md#entity-notification-templates](_mongodb-mapping/news.md#entity-notification-templates) | `bigstring` | `textarea` | — | No | No | Grid + Detail |

### 4.3 Support Category (`config/system-config.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | id | `data.id` | `supportCategory._id` | [system.md#entity-support-categories](_mongodb-mapping/system.md#entity-support-categories) | `number` | `text` | — | No | Yes | Grid + Detail |
| Category | Category | `data.category` | `supportCategory.category` | [system.md#entity-support-categories](_mongodb-mapping/system.md#entity-support-categories) | `string` | `text input` | — | No | No | Grid + Detail |
| Title | Title | `data.title` | `supportCategory.title` | [system.md#entity-support-categories](_mongodb-mapping/system.md#entity-support-categories) | `string` | `text input` | — | No | No | Grid + Detail |
| Queue | Queue | `data.queue` | `supportCategory.queue` | [system.md#entity-support-categories](_mongodb-mapping/system.md#entity-support-categories) | `string` | `text input` | — | No | No | Grid + Detail |
| Themes | Themes | `data.subcategories.` | `supportCategory.subcategories` | [system.md#entity-support-categories](_mongodb-mapping/system.md#entity-support-categories) | `array:string` | `list` | — | No | No | Grid + Detail |

### 4.4 User File (`templates-files/templates-files.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `userFile._id` | — | `number` | `text` | — | No | Yes | Grid + Detail |
| Data | Daten | `data.data` | `userFile.data` | — | `reference:FileEntry` | `autocomplete` | `FileEntryService` | No | No | Grid + Detail |
| Type | Typ | `data.type` | `userFile.type` | — | `enum:UserFileType` | `select` | — | No | No | Grid + Detail |
| Foreign ID | Fremd-ID | `data.foreignId` | `userFile.foreignId` | — | `number` | `number input` | — | No | No | Grid + Detail |
| Parent ID | Eltern-ID | `data.parentId` | `userFile.parentId` | — | `number` | `number input` | — | No | No | Grid + Detail |
| Date | Datum | `data.date` | `userFile.date` | — | `date` | `date input` | — | No | No | Grid + Detail |
| Date Verified | Verifiziert am | `data.dateVerified` | `userFile.dateVerified` | — | `date` | `date input` | — | No | No | Grid + Detail |
| Verified By | Verifiziert von | `data.verifiedBy` | `userFile.verifiedBy` | — | `number` | `number input` | — | No | No | Grid + Detail |
| Active | Aktiv | `data.active` | `userFile.active` | — | `boolean` | `checkbox` | — | No | No | Grid + Detail |
| Owner ID | Besitzer-ID | `data.ownerId` | `userFile.ownerId` | — | `number` | `number input` | — | No | No | Grid + Detail |

### 4.5 Location Type (`config/system-config.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `locationType._id` | — | `number` | `text` | — | No | Yes | Grid + Detail |
| Name | Name | `data.name` | `locationType.name` | — | `string` | `text input` | — | No | No | Grid + Detail |
| Description | Beschreibung | `data.description` | `locationType.description` | — | `string` | `text input` | — | No | No | Grid + Detail |
| Priority | prio | `data.prio` | `locationType.prio` | — | `number` | `number input` | — | No | No | Grid + Detail |

### 4.6 Exclusion Criteria (`config/system-config.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `exclusionCriteria._id` | — | `number` | `text` | — | No | Yes | Grid + Detail |
| Title | Title | `data.title` | `exclusionCriteria.title` | — | `string` | `text input` | — | Yes | No | Grid + Detail |
| Description | Beschreibung | `data.description` | `exclusionCriteria.description` | — | `bigstring` | `textarea` | — | No | No | Grid + Detail |
| Priority | Priority | `data.priority` | `exclusionCriteria.priority` | — | `number` | `number input` | — | No | No | Grid + Detail |

## 5. Dashboard Admin Widgets (`dashboard/dashboard-admin.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **Active Calls Card** | | | | | | | | | | |
| Call Start Time | — | `calls.list.started` | `cDRCall.dateStart` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `datetime` | `text` | — | — | Yes | Display only |
| Party Number | — | `parties.number` | `cDRCall.callingNumber` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text` | — | — | Yes | Display only |
| Party Description | — | `parties.description` | — | — | `string` | `text` | — | — | Yes | Display only |
| Location Name | — | `parties.location.name` | `cDRCall.location` | [external-data.md#entity-cdr-calls](_mongodb-mapping/external-data.md#entity-cdr-calls) | `string` | `text` | — | — | Yes | Display only |
| Expert Name | — | `parties.expert.displayName` | — | — | `string` | `text` | — | — | Yes | Display only |
| **Doctor Information Card** | | | | | | | | | | |
| Working Time | Arbeitszeit | `data.maxWorkTime` | — | — | `number` | `text` | — | — | Yes | Display only |
| Current Month | Aktueller Monat | `data.usedWorkTime` | — | — | `number` | `text` | — | — | Yes | Display only |
| Availability | Verfügbarkeit | `data.availableWorkTime` | — | — | `number` | `text` | — | — | Yes | Display only |
| Department | — | `count.department.description` | — | — | `string` | `text` | — | — | Yes | Display only |
| Available Count | Verfügbar | `count.available` | — | — | `number` | `text` | — | — | Yes | Display only |
| Booked Count | Gebucht | `count.booked` | — | — | `number` | `text` | — | — | Yes | Display only |
| Sick Count | Krank | `count.sick` | — | — | `number` | `text` | — | — | Yes | Display only |
| **Employee Stats Dialog** | | | | | | | | | | |
| Date | — | `data.ts` | — | — | `date` | `date input` | — | No | No | Triggers reload |
| **Birthdays Card** | | | | | | | | | | |
| Display name | — | `birthdays.displayName` | `user.displayName` | — | `string` | `text` | — | — | Yes | Display only |
| Birthday date | — | `birthdays.birthday` | `user.birthday` | — | `date` | `text` | — | — | Yes | Display only |
| Cellular number | — | `birthdays.cellularNumber` | `user.cellularNumber` | — | `string` | `link` | — | — | Yes | Display only |
| Send Message | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: opens msg dialog |
| **Appointment Requests Card** | | | | | | | | | | |
| Appointment type | — | `approvableActions.appointment.iType` | `appointment.iType` | — | `string` | `text` | — | — | Yes | Display only |
| Weekday | — | `approvableActions.appointment.wd` | — | — | `string` | `text` | — | — | Yes | Display only |
| Date | — | `approvableActions.appointment.date` | `appointment.date` | — | `date` | `text` | — | — | Yes | Display only |
| Time start | — | `approvableActions.appointment.timeStart` | `appointment.timeStart` | — | `time` | `text` | — | — | Yes | Display only |
| User name | — | `approvableActions.user.displayName` | `user.displayName` | — | `string` | `text` | — | — | Yes | Display only |
| Job code | — | `approvableActions.appointment.job.code` | `appointment.job` | — | `string` | `text` | — | — | Yes | Display only |
| Location name | — | `approvableActions.appointment.location.name` | `appointment.location` | — | `string` | `text` | — | — | Yes | Display only |
| Accept | Annehmen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.adjustUser` |
| Reserve | Auf Warteliste | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.adjustUser` |
| Reject | Ablehnen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.adjustUser` |
| **Unfilled Schedules Card** | | | | | | | | | | |
| Appointment type | — | `todoAppointments.iType` | `appointment.iType` | — | `string` | `text` | — | — | Yes | Display only |
| Weekday | — | `todoAppointments.wd` | — | — | `string` | `text` | — | — | Yes | Display only |
| Date | — | `todoAppointments.date` | `appointment.date` | — | `date` | `text` | — | — | Yes | Display only |
| Time start | — | `todoAppointments.timeStart` | `appointment.timeStart` | — | `time` | `text` | — | — | Yes | Display only |
| Job code | — | `todoAppointments.job.code` | `appointment.job` | — | `string` | `text` | — | — | Yes | Display only |
| Location name | — | `todoAppointments.location.name` | `appointment.location` | — | `string` | `text` | — | — | Yes | Display only |
| Open Appointment | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentDetails.open` |

### 5.2 Dashboard Overview Widgets (`dashboard/dashboard-main.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **Active Appointments Card** | | | | | | | | | | |
| Type | — | `activeAppointments.appointment.iType` | `appointment.iType` | — | `string` | `text` | — | — | Yes | Display only |
| Weekday | — | `activeAppointments.appointment.wd` | — | — | `string` | `text` | — | — | Yes | Display only |
| Date | — | `activeAppointments.appointment.date` | `appointment.date` | — | `date` | `text` | — | — | Yes | Display only |
| Time start | — | `activeAppointments.appointment.timeStart` | `appointment.timeStart` | — | `time` | `text` | — | — | Yes | Display only |
| Time end | — | `activeAppointments.appointment.timeEnd` | `appointment.timeEnd` | — | `time` | `text` | — | — | Yes | Display only |
| Job title | — | `activeAppointments.appointment.job.expertTitle` | `appointment.job` | — | `string` | `text` | — | — | Yes | Display only |
| Location name | — | `activeAppointments.appointment.location.name` | `appointment.location` | — | `string` | `text` | — | — | Yes | Display only |
| Start appointment | Einsatz Starten | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.activate` |
| New patient | Behandlung Starten | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: triggers `loadConsultation` |
| Start basis web | Behandlung Starten | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: triggers `loadConsultation` |
| Summarize | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: opens dialog |
| End appointment | Einsatz Beenden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: opens dialog |
| **Consultations Table** | | | | | | | | | | |
| Start | Start | `activeConsultations.start` | `consultationData.start` | — | `datetime` | `text` | — | — | Yes | Display only |
| Book number | Buchnummer | `activeConsultations.bookNumber` | `consultationData.bookNumber` | — | `string` | `text` | — | — | Yes | Display only |
| Job | Dienstleistung | `activeConsultations.job` | `consultationData.job` | — | `string` | `text` | — | — | Yes | Display only |
| Location | — | `activeConsultations.location.name` | `consultationData.location` | — | `string` | `text` | — | — | Yes | Display only |
| Type | — | `activeConsultations.iType` | `consultationData.type` | — | `string` | `text` | — | — | Yes | Display only |
| State | — | `activeConsultations.iState` | `consultationData.state` | — | `string` | `text` | — | — | Yes | Display only |
| Base completed | Basisdaten | `baseCompleted` | — | — | `boolean` | `status` | — | — | Yes | Display only |
| Data complete | Behandlungsdaten | `dataComplete` | — | — | `boolean` | `status` | — | — | Yes | Display only |
| Warning complete | Warnhinweise | `warningComplete` | — | — | `boolean` | `status` | — | — | Yes | Display only |
| QM complete | Fragebogen | `qmComplete` | — | — | `boolean` | `status` | — | — | Yes | Display only |
| Transmit complete | Ubermittelt | `transmitComplete` | — | — | `boolean` | `status` | — | — | Yes | Display only |
| Open | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `ConsultationDetails.open` |
| Delete | Loschen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `ConsultationService.remove` |
| **Consultations to Control Table** | | | | | | | | | | |
| Date | — | `reportingConsultations.date` | `consultationData.date` | — | `date` | `text` | — | — | Yes | Display only |
| Start | Start | `reportingConsultations.start` | `consultationData.start` | — | `datetime` | `text` | — | — | Yes | Display only |
| Book number | Buchnummer | `reportingConsultations.bookNumber` | `consultationData.bookNumber` | — | `string` | `text` | — | — | Yes | Display only |
| Job code | Dienstleistung | `reportingConsultations.job.code` | `consultationData.job` | — | `string` | `text` | — | — | Yes | Display only |
| Location | — | `reportingConsultations.location.name` | `consultationData.location` | — | `string` | `text` | — | — | Yes | Display only |
| Doctor name | Experten | `reportingConsultations.doctor.displayName` | `consultationData.doctor` | — | `string` | `text` | — | — | Yes | Display only |
| Type | — | `reportingConsultations.iType` | `consultationData.type` | — | `string` | `text` | — | — | Yes | Display only |
| Open | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `ConsultationService.getReporting` |
| **Treatment Tasks Table** | | | | | | | | | | |
| Date | Start | `treatmentTasks.date` | `treatment.date` | — | `date` | `text` | — | — | Yes | Display only |
| Book number | Buchnummer | `treatmentTasks.treatment.bookNumber` | `treatment.bookNumber` | — | `string` | `text` | — | — | Yes | Display only |
| Job code | Dienstleistung | `treatmentTasks.treatment.job.code` | `treatment.job` | — | `string` | `text` | — | — | Yes | Display only |
| Location | — | `treatmentTasks.treatment.location.name` | `treatment.location` | — | `string` | `text` | — | — | Yes | Display only |
| Edit | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `TreatmentService.getReport` |
