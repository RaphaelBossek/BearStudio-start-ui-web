# Data Dictionary: Planning

## Overview

This dictionary documents all UI fields across the Planning domain.

## Source: dashboard/02-dashboard-selfservice.md

### Available Actions
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Type abbreviation | Typ | `availableActions.iType` | `appointment.type` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum:AppointmentType` | `text` | — | No | Yes | — |
| Weekday | Wochentag | `availableActions.wd` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Derived from start |
| Date | Datum | `availableActions.date` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `text` | — | No | Yes | — |
| Time start | Startzeit | `availableActions.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from start |
| Time end | Endzeit | `availableActions.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from until |
| Expert title | Experte | `availableActions.job.expertTitle` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from job |
| Location name | Standort | `availableActions.location.name` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from location |
| Request | Anfragen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.request` |

### My Next Schedules
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Type abbreviation | Typ | `myActions.appointment.iType` | `appointment.type` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum:AppointmentType` | `text` | — | No | Yes | — |
| Weekday | Wochentag | `myActions.appointment.wd` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Derived from start |
| Date | Datum | `myActions.appointment.date` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `text` | — | No | Yes | — |
| Time start | Startzeit | `myActions.appointment.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from start |
| Time end | Endzeit | `myActions.appointment.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from until |
| Expert title | Experte | `myActions.appointment.job.expertTitle` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from job |
| Location name | Standort | `myActions.appointment.location.name` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from location |

### For Confirmation
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Checkbox | Checkbox | `—` | `—` | — | `boolean` | `checkbox` | — | No | No | For row selection |
| Type abbreviation | Typ | `queuedActions.appointment.iType` | `appointment.type` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum:AppointmentType` | `text` | — | No | Yes | — |
| Weekday | Wochentag | `queuedActions.appointment.wd` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Derived from start |
| Date | Datum | `queuedActions.appointment.date` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `text` | — | No | Yes | — |
| Time start | Startzeit | `queuedActions.appointment.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from start |
| Time end | Endzeit | `queuedActions.appointment.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from until |
| Expert title | Experte | `queuedActions.appointment.job.expertTitle` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from job |
| Location name | Standort | `queuedActions.appointment.location.name` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from location |
| Accept | Annehmen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.agreeAll` |
| Decline | Ablehnen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.disagreeAll` |
| Select All | Alle auswählen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: toggles checkboxes |

### Waiting Actions
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Type abbreviation | Typ | `waitingActions.appointment.iType` | `appointment.type` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum:AppointmentType` | `text` | — | No | Yes | — |
| Weekday | Wochentag | `waitingActions.appointment.wd` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Derived from start |
| Date | Datum | `waitingActions.appointment.date` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `text` | — | No | Yes | — |
| Time start | Startzeit | `waitingActions.appointment.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from start |
| Time end | Endzeit | `waitingActions.appointment.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from until |
| Expert title | Experte | `waitingActions.appointment.job.expertTitle` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from job |
| Location name | Standort | `waitingActions.appointment.location.name` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from location |
| Remove request | Anfrage entfernen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.cancel` |

### Aborted/Rejected Schedules
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Type abbreviation | Typ | `rejectedAppointments.appointment.iType` | `appointment.type` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum:AppointmentType` | `text` | — | No | Yes | — |
| Weekday | Wochentag | `rejectedAppointments.appointment.wd` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Derived from start |
| Date | Datum | `rejectedAppointments.appointment.date` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `text` | — | No | Yes | — |
| Time start | Startzeit | `rejectedAppointments.appointment.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from start |
| Time end | Endzeit | `rejectedAppointments.appointment.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | Derived from until |
| Expert title | Experte | `rejectedAppointments.appointment.job.expertTitle` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from job |
| Location name | Standort | `rejectedAppointments.appointment.location.name` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Snapshot from location |

## Source: dashboard/04-dialogs-planning.md

### End Shift Dialog
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Start Date | Startdatum | `data.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `time` | — | Yes | No | — |
| End Date | Enddatum | `data.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `time` | — | Yes | No | — |
| Save | Speichern | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.done` |

### Ad-Hoc Appointment
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Location | Standort | `data.location` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:Location` | `autocomplete` | `LocationService.autocomplete` | Yes | No | — |
| Type | Typ | `data.type` | `appointment.type` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum:AppointmentType` | `select` | APPOINTMENT, SHIFT, COUNCIL | Yes | No | Controls Job options filter |
| Job | Dienstleistung | `data.job` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:Job` | `autocomplete` | `JobService.adHocAutocompleteType` | Yes | No | — |
| Save | Speichern | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.createAdHoc` |

### Appointments Confirm Modal
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Items List | Termine | `data.items` | — | — | `computed` | `list` | — | No | Yes | Display only |
| Accept | Annehmen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.agreeAll` |

### Appointments Decline Modal
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Items List | Termine | `data.items` | — | — | `computed` | `list` | — | No | Yes | Display only |
| Decline | Ablehnen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.disagreeAll` |

## Source: dashboard/08-shift-dialog.md

### Shift Dialog
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Shift name | Schicht | `data.name` | `appointment.title` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |
| Location name | Standort | `data.location.name` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |
| Start date | Startdatum | `data.dateStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `text` | — | No | Yes | — |
| Customer name | Kunde | `data.customer.name` | `appointment.customer` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |
| Latitude | Breitengrad | `data.location.latitude` | `location.latitude` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `number` | `map` | — | No | Yes | Bound to map |
| Longitude | Längengrad | `data.location.longitude` | `location.longitude` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `number` | `map` | — | No | Yes | Bound to map |

### Shift Actions Collection
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Job-Id | Job-Id | `actions.jobId.description` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | Maps to sub-appointments |
| Start Date | Startdatum | `actions.dateStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `datetime` | `text` | — | No | Yes | — |
| End Date | Enddatum | `actions.dateEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | — |
| Request | Anfragen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: opens `requestActionDlg` |

### Request Action Dialog
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Date | Datum | `data.dateStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `text` | — | No | Yes | — |
| Start Date | Startdatum | `data.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | — |
| End Date | Enddatum | `data.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | — |
| Job title | Jobtitel | `data.jobId.description` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |
| Internal Contact | Interner Kontakt | `data.internalContact.displayName` | `user.name` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | Yes | Snapshot from user |
| Phone | Telefon | `data.internalContact.cellularNumber` | `user.cellularNumber` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `link` | — | No | Yes | Uses `tel:` prefix |
| Send Message | Nachricht senden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: triggers internal message |
| Submit | Speichern | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `ActionService.apply` |

## Source: dashboard/09-calendar-view.md

### Calendar View
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Calendar events | Kalendertermine | — | `appointment.start`/`until`/`type`/`state` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `collection` | `calendar` | — | No | Yes | Populated by `InfoService.getCalendar` |

## Source: dashboard/10-week-view.md

### Expert Week Grid
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Week Type | Typ | `weekTypeSelection` | `expertWeek.type` | [planning.md#expertWeek](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `enum` | `select` | TREATMENT | No | No | — |
| Monday slots | Montag | `slotsMo` | `expertWeek.slotsMo` | [planning.md#expertWeek](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `array:boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Tuesday slots | Dienstag | `slotsTu` | `expertWeek.slotsTu` | [planning.md#expertWeek](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `array:boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Wednesday slots | Mittwoch | `slotsWe` | `expertWeek.slotsWe` | [planning.md#expertWeek](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `array:boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Thursday slots | Donnerstag | `slotsTh` | `expertWeek.slotsTh` | [planning.md#expertWeek](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `array:boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Friday slots | Freitag | `slotsFr` | `expertWeek.slotsFr` | [planning.md#expertWeek](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `array:boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Saturday slots | Samstag | `slotsSa` | `expertWeek.slotsSa` | [planning.md#expertWeek](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `array:boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Sunday slots | Sonntag | `slotsSu` | `expertWeek.slotsSu` | [planning.md#expertWeek](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `array:boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Save | Speichern | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: saves week configuration |
| Reload | Neu laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: reloads table data |

## Source: dashboard/11-month-view.md

### Expert Month View Header
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Year | Jahr | `expertdaysYear` | `expertDays.month` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `input` | — | Yes | No | Parsed into YYYYMM |
| Month | Monat | `expertdaysMonth` | `expertDays.month` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `enum` | `select` | 1-12 | Yes | No | Parsed into YYYYMM |
| Max Weekday Morning | Max. Wochentag Morgen | `maxWeekDayMorning` | `expertDays.maxWeekDayMorning` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | Yes | Display counter |
| Max Weekday Afternoon | Max. Wochentag Nachmittag | `maxWeekDayAfternoon` | `expertDays.maxWeekDayAfternoon` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | Yes | Display counter |
| Max Weekday Night | Max. Wochentag Nacht | `maxWeekDayNight` | `expertDays.maxWeekDayNight` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | Yes | Display counter |
| Max Weekday Appt Morning | Max. Wochentag Termin Morgen | `maxWeekDayAppointmentMorning` | `expertDays.maxWeekDayAppointmentMorning` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | Yes | Display counter |
| Max Weekday Appt Afternoon | Max. Wochentag Termin Nachmittag | `maxWeekDayAppointmentAfternoon`| `expertDays.maxWeekDayAppointmentAfternoon` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | Yes | Display counter |
| Max Weekend Morning | Max. Wochenende Morgen | `maxWeekEndMorning` | `expertDays.maxWeekEndMorning` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | Yes | Display counter |
| Max Weekend Afternoon | Max. Wochenende Nachmittag | `maxWeekEndAfternoon` | `expertDays.maxWeekEndAfternoon` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | Yes | Display counter |
| Max Weekend Night | Max. Wochenende Nacht | `maxWeekEndNight` | `expertDays.maxWeekEndNight` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | Yes | Display counter |
| Save | Speichern | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: saves month configuration |
| Holiday | Urlaub | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: opens `#holidayApprovalDetails` |
| Reload | Neu laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: reloads table data |

### Expert Month View Grid
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Morning Slot | Morgen | `morning` | `expertDays.morningYes` / `morningNo` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Afternoon Slot | Nachmittag | `afternoon` | `expertDays.afternoonYes` / `afternoonNo` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Night Slot | Nacht | `night` | `expertDays.nightYes` / `nightNo` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Morning Appt Slot | Termin Morgen | `morningAppointment` | `expertDays.morningAppointmentYes` / `morningAppointmentNo` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Afternoon Appt Slot | Termin Nachmittag | `afternoonAppointment` | `expertDays.afternoonAppointmentYes` / `afternoonAppointmentNo` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |
| Treatment Slot | Behandlung | `treatmentAppointment` | `expertDays.treatmentAppointmentYes` / `treatmentAppointmentNo` | [planning.md#expertDays](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `tri-state` | null, true, false | No | No | Cycles tri-state |

### Holiday Approval Dialog
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Start Date | Start | `data.start` | `holiday.start` | [planning.md#holiday](../mongodb-mapping/planning.md#entity-abwesenheiten-urlaub-holidays) | `date` | `date` | — | Yes | No | — |
| End Date | Ende | `data.until` | `holiday.until` | [planning.md#holiday](../mongodb-mapping/planning.md#entity-abwesenheiten-urlaub-holidays) | `date` | `date` | — | Yes | No | — |
| Submit | Speichern | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `ExpertDaysService.setHoliday` |

## Source: appointment/01-appointment-list.md

### Filter Panel
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Day | Tag | `filterDay` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `number` | `input` | — | No | No | Exact match on `row.day` number |
| Job ID | Job ID | `filterJob` | `appointment.job.code` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `input` | — | No | No | Substring match on `col.data.name` |
| Appointment state | Terminstatus | `filterState` | `appointment.state` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum` | `select` | `AppointmentState` | No | No | Matches `data.state` exactly |

## Source: appointment/02-appointment-details-scheduling.md

### Tab 1 — Details/Edit
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Date | Datum | `data.date` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `date` | — | Yes | No | Triggers priceType auto-suggest |
| Start | Start | `data.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `time` | — | Yes | No | Triggers priceType auto-suggest |
| Until | Bis | `data.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `time` | — | Yes | No | — |
| Expert only | Nur Experte | `data.expertOnly` | `appointment.expertOnly` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `boolean` | `checkbox` | — | No | No | Hides location/room/customer |
| Appointment state | Terminstatus | `data.state` | `appointment.state` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum` | `select` | `AppointmentState` | Yes | Yes | Click opens state transition dialog |
| Customer | Kunde | `data.customer` | `appointment.customer` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:Customer` | `input` | — | No | Yes | Display-only |
| Location | Standort | `data.location` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:Location` | `autocomplete` | `LocationService.autocomplete` | Yes | No | Hidden when expertOnly=true |
| Room | Raum | `data.room` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:Room` | `autocomplete` | `RoomService.autocompleteAvailableRooms` | No | No | Hidden when expertOnly=true |
| Required staff count | Benötigte Mitarbeiter | `data.requiredStaffCount` | `appointment.requiredStaffCount` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `number` | `input` | — | Yes | No | — |
| Job | Dienstleistung | `data.job` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:Job` | `autocomplete` | `JobService.autocompleteType` | Yes | No | Filter by entity type |
| Price type | Preistyp | `data.priceType` | `appointment.priceType` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum` | `select` | WEEKDAY, WEEKNIGHT, WEEKENDDAY, WEEKENDNIGHT | No | No | SHIFT type only |
| Job support | Job Support | `data.jobSupport` | `appointment.jobSupport` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `boolean` | `checkbox` | — | No | No | COUNCIL type only |
| Min. patients | Min. Patienten | `data.minPatients` | `appointment.minPatients` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `number` | `input` | — | No | No | SHIFT type only |
| Comment | Kommentar | `data.comment` | `appointment.comment` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `textarea` | — | No | No | — |

### Tab 2 — Referenced (Patient Appointments)
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Start time | Startzeit | `referenced.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | — |
| End time | Endzeit | `referenced.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | — |
| Location | Standort | `referenced.location.name` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |
| Book number | Buchnummer | `referenced.location.booknumberMask` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |
| Job code | Job code | `referenced.job.code` | `appointment.job` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |
| Appointment state | Terminstatus | `referenced.state` | `appointment.state` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum` | `badge` | `AppointmentState` | No | Yes | Click opens state transition dialog |

### Tab 4 — Assigned (Experts)
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Expert name | Experte | `assigned.user.displayName` | `appointmentAssignment.userId` | [planning.md#appointmentAssignment](../mongodb-mapping/planning.md#entity-terminzuweisungen-appointment-assignments) | `string` | `text` | — | No | Yes | — |
| Phone | Telefon | `assigned.user.userProfile.cellularNumber` | `user.cellularNumber` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `link` | — | No | Yes | — |
| Support | Support | `pojo.support` | `appointmentAssignment.support` | [planning.md#appointmentAssignment](../mongodb-mapping/planning.md#entity-terminzuweisungen-appointment-assignments) | `boolean` | `icon` | — | No | Yes | Indicates role icon |
| Accept | Annehmen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `assignAppointment(id, "ACCEPTED")` |
| Reserve | Reservieren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.adjustUser(id, "RESERVED")` |
| Override | Direkt akzeptieren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `assignAppointment(id, "AGREED")` |
| Reject | Ablehnen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.adjustUser(id, "REJECTED")` |
| Abort | Absagen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.adjustUser(id, "ABORTED")` |
| Send reminder | Erinnerung senden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.sendReminder(id)` |

### Tab 5 — Suggestions (Add Expert)
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Expert name | Experte | `result.displayName` | `user.name` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | Yes | — |
| Skills | Fähigkeiten | `skills.skill.code` | `user.skills` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | Yes | Comma-separated |
| Phone | Telefon | `result.userProfile.cellularNumber` | `user.cellularNumber` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `link` | — | No | Yes | — |
| Add | Hinzufügen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `AppointmentService.addUser` |

### State Transition Dialog (`appointmentStateDlg`)
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Next state | Nächster Schritt | `data.status` | `appointment.state` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum` | `select` | `AppointmentState` | Yes | No | Populated dynamically |
| Date | Datum | `data.date` | `appointment.dateStorno` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `date` | — | No | No | Shown only when STORNO is selected |
| Time | Zeit | `data.time` | `appointment.dateStorno` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `time` | — | No | No | Shown only when STORNO is selected |

## Source: appointment/03-appointment-assign-user.md

### Assignments Table
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| State | Status | `assignments.state` | `appointmentAssignment.state` | [planning.md#appointmentAssignment](../mongodb-mapping/planning.md#entity-terminzuweisungen-appointment-assignments) | `enum` | `select` | ACCEPTED, RESERVED, AGREED, REJECTED, ABORTED, REMOVE | Yes | No | Dropdown for state resolution |
| Start time | Start | `assignments.appointment.timeStart` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | — |
| End time | Ende | `assignments.appointment.timeEnd` | `appointment.until` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `text` | — | No | Yes | — |
| Date | Datum | `assignments.appointment.date` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `text` | — | No | Yes | — |
| Title | Titel | `assignments.appointment.title` | `appointment.title` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |
| Location | Standort | `assignments.appointment.location.name` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `text` | — | No | Yes | — |

## Source: appointment-support/01-appointment-plan.md

### Appointment Plan Detail
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `appointmentPlan.name` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `string` | `input` | — | Yes | No | — |
| Day | Wochentag | `data.day` | `appointmentPlan.day` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `enum` | `select` | MO, TU, WE, TH, FR, SA, SU | Yes | No | — |
| Scheduling | Wiederholung | `data.scheduling` | `appointmentPlan.scheduling` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `enum` | `select` | WEEKLY, XOFMONTH, FIRST_DAY_MONTH, etc. | Yes | No | — |
| Multiplier | Multiplikator | `data.schedulingMulitplier` | `appointmentPlan.schedulingMulitplier` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `number` | `input` | — | Yes | No | — |
| Start time | Startzeit | `data.timeStart` | `appointmentPlan.timeStart` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `time` | `time` | — | Yes | No | — |
| End time | Endzeit | `data.timeEnd` | `appointmentPlan.timeEnd` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `time` | `time` | — | Yes | No | — |
| Expert only | Nur Experte | `data.expertOnly` | `appointmentPlan.expertOnly` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `boolean` | `checkbox` | — | No | No | — |
| Doctor | Arzt | `data.doctor` | `appointmentPlan.doctor` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `reference:User` | `autocomplete` | `UserService.autocomplete` | Yes | No | — |
| Location | Standort | `data.location` | `appointmentPlan.location` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `reference:Location` | `autocomplete` | `LocationService.autocomplete` | Yes | No | — |
| Job | Dienstleistung | `data.job` | `appointmentPlan.job` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `reference:Job` | `autocomplete` | `JobService.autocomplete` | Yes | No | — |
| Start date | Startdatum | `data.startDate` | `appointmentPlan.startDate` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `date` | `date` | — | Yes | No | — |
| End date | Enddatum | `data.endDate` | `appointmentPlan.endDate` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `date` | `date` | — | No | No | — |

## Source: shift/01-shift-and-plan.md

### Shift Plan Detail
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `shiftPlan.name` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `string` | `input` | — | Yes | No | — |
| Day | Wochentag | `data.day` | `shiftPlan.day` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `enum` | `select` | MO, TU, WE, TH, FR, SA, SU | Yes | No | — |
| Scheduling | Wiederholung | `data.scheduling` | `shiftPlan.scheduling` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `enum` | `select` | WEEKLY | Yes | No | — |
| Multiplier | Multiplikator | `data.schedulingMulitplier` | `shiftPlan.schedulingMulitplier` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `number` | `input` | — | Yes | No | — |
| Start time | Startzeit | `data.timeStart` | `shiftPlan.timeStart` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `time` | `time` | — | Yes | No | Triggers priceType calc |
| End time | Endzeit | `data.timeEnd` | `shiftPlan.timeEnd` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `time` | `time` | — | Yes | No | — |
| Job | Dienstleistung | `data.job` | `shiftPlan.job` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `reference:Job` | `autocomplete` | `JobService.autocompleteShift` | Yes | No | — |
| Min. patients | Min. Patienten | `data.minPatients` | `shiftPlan.minPatients` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `number` | `input` | — | No | No | — |
| Price type | Preistyp | `data.priceType` | `shiftPlan.priceType` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `enum` | `select` | WEEKDAY, WEEKNIGHT, WEEKENDDAY, WEEKENDNIGHT | No | No | — |
| Comment | Kommentar | `data.comment` | `shiftPlan.comment` | [planning.md#shiftPlan](../mongodb-mapping/planning.md#entity-schichtplan-shift-plan) | `string` | `textarea` | — | No | No | — |

## Source: council/01-council-and-plan.md

### Council Plan Detail
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `appointmentPlan.name` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `string` | `input` | — | Yes | No | — |
| Day | Wochentag | `data.day` | `appointmentPlan.day` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `enum` | `select` | MO, TU, WE, TH, FR, SA, SU | Yes | No | — |
| Scheduling | Wiederholung | `data.scheduling` | `appointmentPlan.scheduling` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `enum` | `select` | WEEKLY, XOFMONTH | Yes | No | — |
| Multiplier | Multiplikator | `data.schedulingMulitplier` | `appointmentPlan.schedulingMulitplier` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `number` | `input` | — | Yes | No | — |
| Start time | Startzeit | `data.timeStart` | `appointmentPlan.timeStart` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `time` | `time` | — | Yes | No | — |
| End time | Endzeit | `data.timeEnd` | `appointmentPlan.timeEnd` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `time` | `time` | — | Yes | No | — |
| Job | Dienstleistung | `data.job` | `appointmentPlan.job` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `reference:Job` | `autocomplete` | `JobService.autocomplete` | Yes | No | — |
| Start date | Startdatum | `data.startDate` | `appointmentPlan.startDate` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `date` | `date` | — | Yes | No | — |
| End date | Enddatum | `data.endDate` | `appointmentPlan.endDate` | [planning.md#appointmentPlan](../mongodb-mapping/planning.md#entity-sprechstundenplan-appointment-plan) | `date` | `date` | — | No | No | — |

## Source: appointment-admin/01-appointment-admin.md

### Appointment Admin Calculation Filter
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Year | Jahr | `data.year` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `number` | `input` | — | Yes | No | — |
| Month | Monat | `data.month` | `appointment.start` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `enum` | `select` | 1-12 | Yes | No | — |

### Appointment Admin Export
| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Customer | Kunde | `data.customer` | `appointment.customer` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:Customer` | `autocomplete` | `CustomerService.autocomplete` | No | No | — |
| Location | Standort | `data.location` | `appointment.location` | [planning.md#appointment](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:Location` | `autocomplete` | `LocationService.autocomplete` | No | No | — |
| User | Benutzer | `data.user` | `appointmentAssignment.userId` | [planning.md#appointmentAssignment](../mongodb-mapping/planning.md#entity-terminzuweisungen-appointment-assignments) | `reference:User` | `autocomplete` | `UserService.autocomplete` | No | No | — |

