---
title: 'Patient Data'
---

# Entity CRUD Analysis: Room, Equipment, Contact, Medication, PatientData

---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Included by** | `{{> patientData}}` | [Appointment Details Patient](../../planning/appointment/appointment-details-scheduling.md) | Patient data tab in appointment details |
| split | **Sibling** | Same source: `room-equipment-contact-medication-patientdata.md` | [Room Entity CRUD](../customer/room/room.md) | Room module extracted to sibling |
| split | **Sibling** | Same source: `room-equipment-contact-medication-patientdata.md` | [Equipment Entity CRUD](../customer/equipment/equipment.md) | Equipment module extracted to sibling |
| split | **Sibling** | Same source: `room-equipment-contact-medication-patientdata.md` | [Contact Entity CRUD](../customer/contact/contact.md) | Contact module extracted to sibling |
| split | **Sibling** | Same source: `room-equipment-contact-medication-patientdata.md` | [Medication Entity CRUD](../medication/medication.md) | Medication module extracted to sibling |

---

## Common CRUD Pattern

All five modules share the same `Core.initCrud()` + `slickerGrid()` architecture:

| Aspect | Pattern |
|--------|---------|
| **Grid widget** | `slickerGrid({ fullscreen: true, dataService: { service, method: "getAll", param: [filter, limit] } })` |
| **Detail dialog** | `.detail` div with `jsForm`, opened via row click or edit button |
| **CRUD service** | `{Entity}Service` with `get`, `getAll`, `save`, `delete` methods |
| **Nav buttons** | Add (`plus-square`), Edit (`pencil`, disabled), Delete (`trash`, disabled) |
| **Data limit** | `data-limit="100"` on the `tableView` container |
| **Grid settings persistence** | `UserService.saveSetting()` per grid |
| **Search** | Client-side filter via `#siteSearch` keyup (Room, PatientData) or server-side filter panel (Equipment, Contact) |

### Shared Nav Button Actions (all modules)

| Action ID | Symbol | Title (i18n) | English |
|-----------|--------|-------------|---------|
| `addMenuBtn` | `plus-square` | `action.add` | Add |
| `editMenuBtn` | `pencil` | `action.change` | Edit |
| `deleteMenuBtn` | `trash` | `action.delete` | Delete |

---

## 5. PatientData

**Service**: `PatientDataService` | **Get method**: `get` | **Panel**: Yes | **Search**: Yes (client-side)

### 5.1 Grid Columns

| Field | Name (i18n) | Sortable | Width | Formatter |
|-------|------------|----------|-------|-----------|
| `id` | `label.id` | Yes | 40 | -- |
| `appointmentId` | `invoiceLine.appointmentId` | Yes | 80 | -- |
| `bookNumber` | `consultation.booknumber` | Yes | 100 | -- |
| `jNumber` | **HARDCODED** "jNumber" | Yes | 80 | -- |
| `closed` | `PatientData.Closed` | Yes | 100 | `Formatter.dateTime` |
| `attachments` | `PatientData.Attachments` | Yes | 80 | -- |

### 5.2 Client-side Filter Fields

Searches across: `appointmentId` (toString), `bookNumber`, `jNumber` (case-insensitive substring match).

### 5.3 Detail Form (Single view, no tabs)

| Name | Label/Placeholder | Data path | Type | Notes |
|------|-------------------|-----------|------|-------|
| Book Number | `consultation.booknumber` | `data.bookNumber` | text | Input group with label prefix |
| jNumber | **HARDCODED** "jNumber" | `data.jNumber` | text | "JNumber used to get the bookNumber" (tooltip) |
| Appointment ID | `invoiceLine.appointmentId` | `data.appointmentId` | number | "for what appointment is the data" (tooltip) |
| Closed | `PatientData.Closed` | `data.closed` | date | Calendar icon, input group |
| Attachments | -- | `data.attachments` | file collection | See below |

### 5.4 File Attachments

| Element | Details |
|---------|---------|
| File upload | `jsfileupload` class, `PatientDataService.upload`, params: `[data.id]` |
| File list | Collection table showing `attachments.file.name` as download link |
| Download URL | `/get/PatientDataService/attachment/[[data.id]]/[[cur.file.id]]/[[cur.file.name]]` |
| Remove | Trash icon, calls `PatientDataService.removeFile(dataId, attachmentId)` with confirm dialog |

**HARDCODED German**: "Datei" (table header = "File"), "Datei hochladen" (upload title = "Upload file").

### 5.5 Nav Buttons (additional)

| Action ID | Symbol | Title | English |
|-----------|--------|-------|---------|
| `someActionBtn` | `lock-alt` | "Action" | **HARDCODED** "Action" |

### 5.6 Translation Table

The `messages.i18n.js` file is **empty** (only a comment). All translations come from global i18n.

| Text-Reference | Notes |
|----------------|-------|
| `PatientData.Closed` | Closed date |
| `PatientData.Attachments` | Attachments count |
| `PatientDataType` | Dialog title |
| `consultation.booknumber` | Book Number (shared with consultation module) |
| `invoiceLine.appointmentId` | Appointment ID (shared with invoiceLine module) |
| `label.id` | ID (shared) |

**HARDCODED**: "jNumber" (grid column name + form labels), "Datei" (file), "Datei hochladen" (upload file), "JNumber used to get the bookNumber" (tooltip), "for what appointment is the data" (tooltip), "Action" (nav button).

### 5.7 Cross-Module References

| Reference | Direction | Details |
|-----------|-----------|---------|
| `PatientDataService.upload` | PatientData (internal) | File upload endpoint |
| `PatientDataService.removeFile` | PatientData (internal) | File delete endpoint |
| `PatientDataService.attachment` | PatientData (internal) | File download URL pattern |
| `consultation.booknumber` (i18n) | PatientData -> Consultation | Shared translation key |
| `invoiceLine.appointmentId` (i18n) | PatientData -> InvoiceLine/Appointment | Shared translation key |

---

## Cross-Module Summary

### Shared Service Dependencies

```
Room ---------> LocationService, EquipmentService, RoomplanService, AppointmentState (i18n)
Equipment ----> LocationService, RoomService, UserService, ProductService, CustomerService
Contact ------> CompanyService, ContactService.getCategories
Medication ---> (standalone)
PatientData --> (standalone, but references appointment/consultation i18n keys)
```

### Shared Formatters

| Formatter | Used By | Behavior |
|-----------|---------|----------|
| `Formatter.name` | Room (location), Equipment (room), Contact (company) | Displays `.name` property of an object |
| `Formatter.count` | Equipment (comments) | Displays array/collection count |
| `Formatter.bool` | Medication (trafficability) | Boolean display |
| `Formatter.dateTime` | PatientData (closed) | Date+time formatting |
| `Formatter.equipmentStatus` | Equipment (status) | Maps enum value to i18n label |
| `Formatter.categoryType` | Contact (categories) | Joins string array with ", " |

### Common UI Patterns to Replicate

1. **Object autocomplete** (`class="object autoselect"` with `data-service`/`data-method`/`data-display`): Used heavily in Room, Equipment, Contact. Rebuild as a reusable `AsyncCombobox` or `AutocompleteInput` component.

2. **Cascading filters** (Equipment: Location -> Room): Parent selection unlocks/filters child. Rebuild with controlled `useQuery` dependencies.

3. **Collection tables** (Room plans, Equipment comments, PatientData attachments): Inline sub-entity lists with add/edit/delete. Rebuild as embedded `DataTable` or list components.

4. **Tab layout in detail dialogs**: Room (3 tabs), Equipment (2 tabs), Contact (4 tabs). Map to Shadcn `Tabs` or `SectionedScrollLayout` as appropriate.

5. **File upload with collection** (PatientData): Upload button + downloadable file list + delete. Rebuild with a `FileUpload` component + collection display.

6. **Offcanvas filter panel** (Equipment, Contact): Side drawer with form fields + Apply/Reset + max results selector. Rebuild as Shadcn `Sheet` with form.

7. **A-Z quick filter** (Contact only): Alphabetical filter bar. Rebuild as a custom filter component.

8. **FullCalendar** (Room only): Month/week/day calendar with background events for appointments and block events for availability slots. Evaluate using `@fullcalendar/react` or a Shadcn-compatible calendar alternative.

### Hardcoded Strings Requiring i18n Migration

| Module | String | Context |
|--------|--------|---------|
| Room | "Neuer Plan" | Add plan button title |
| Room | "Plan" | Table header |
| Room | "Datum in welchem der Plan aktiv ist (leer = Open End)" | Help text |
| Room | "Wochentage/Uhrzeit wann der Raum an den angegebenen Tagen frei ist" | Help text |
| Equipment | "Action" | Nav button label |
| Equipment | "Inventory" | Placeholder when no room selected |
| Medication | "entryNumber" | Form label |
| Medication | "Action" | Nav button label |
| PatientData | "jNumber" | Grid column + form labels |
| PatientData | "Datei" | File table header |
| PatientData | "Datei hochladen" | Upload dialog title |
| PatientData | "Action" | Nav button label |
