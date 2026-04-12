---
title: 'Equipment'
---

> **Split from**: `entity-cruds/room-equipment-contact-medication-patientdata.md`
> **Sections extracted here**: Common CRUD Pattern, 2. Equipment, Cross-Module Summary
> **Other domains received**: `customer/room/room.md` (Common CRUD Pattern, 1. Room, Cross-Module Summary), `customer/contact/contact.md` (Common CRUD Pattern, 3. Contact, Cross-Module Summary), `treatment/medication/medication.md` (Common CRUD Pattern, 4. Medication, Cross-Module Summary), `treatment/patient-data/patient-data.md` (Common CRUD Pattern, 5. PatientData, Cross-Module Summary)

---

# Entity CRUD Analysis: Room, Equipment, Contact, Medication, PatientData

> **Source**: `~/src/vc/videoclinic-prod/web/src/main/webapp/{room,equipment,contact,medication,patientData}/`
> **Date**: 2026-03-22
> **Purpose**: Legacy UI analysis for modern React+Shadcn rebuild

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

## 2. Equipment

**Service**: `EquipmentService` | **Get method**: `get` | **Panel**: Yes | **Filter**: Offcanvas filter panel

### 2.1 Grid Columns

| Field | Name (i18n) | Sortable | Width | Formatter |
|-------|------------|----------|-------|-----------|
| `id` | `label.id` | Yes | 80 | -- |
| `serialNumber` | `equipment.serialNumber` | Yes | 90 | -- |
| `inventoryNumber` | `equipment.inventoryNumber` | Yes | 180 | -- |
| `status` | `EquipmentStatus` | Yes | 90 | `Formatter.equipmentStatus` |
| `name` | `equipment.name` | Yes | 90 | -- |
| `manufacturer` | `equipment.manufacturer` | Yes | 90 | -- |
| `description` | `label.description` | Yes | 250 | -- |
| `comments` | `equipment.comments` | Yes | 90 | `Formatter.count` |
| `room` | `equipment.room` | Yes | 90 | `Formatter.name` |

### 2.2 Custom Formatters

```js
Formatter.equipmentStatus = function(_row, _cell, value) {
    if (!value) return '';
    return i18n["EquipmentStatus_" + value];
}
```

### 2.3 Nav Buttons (additional)

| Action ID | Symbol | Title | English |
|-----------|--------|-------|---------|
| `someActionBtn` | `lock-alt` | "Action" | **HARDCODED** "Action" |

### 2.4 onCreate Default

New equipment is created with `status: "WORKING"`.

### 2.5 Filter Panel (Offcanvas)

| Field | Type | Details |
|-------|------|---------|
| Name | text | `data.name` |
| Location | object autocomplete | `LocationService.autocomplete`, display: `name` |
| Room | object autocomplete | `RoomService.autocomplete`, display: `name`, **readonly until location selected** |
| Customer | object autocomplete | `CustomerService.autocomplete`, display: `name` |
| Status | select | WORKING, DEFECT, INREPAIR, RESERVED, UNKNOWN, SENT |
| Max results | select | 100 (default), 150, 200, 300, 500, >500 |

**Filter dependency logic**: Room select is `readonly` until a Location is selected. Selecting a Location unlocks Room and filters rooms by `location.id`. Selecting a Room auto-populates Location if empty.

### 2.6 Detail Form -- Tab 1: Equipment Info

| Name | Symbol | Data path | Type | Placeholder | Required | Read-only | Notes |
|------|--------|-----------|------|-------------|----------|-----------|-------|
| Inventory Number | `fas fa-inventory` | `data.inventoryNumber` | text | `{{i18n.equipment.inventoryNumber}}` | No | No | -- |
| Name | `fas fa-info-square` | `data.name` | text | `{{i18n.equipment.name}}` | No | No | -- |
| Access User | `fas fa-user` | `data.accessUser` | object autocomplete | `{{i18n.equipment.accessUser}}` | No | No | `UserService.autocomplete`, display: `displayName` |
| Serial Number | `fas fa-barcode-read` | `data.serialNumber` | text | `{{i18n.equipment.serialNumber}}` | No | No | -- |
| Manufacturer | `fas fa-industry-alt` | `data.manufacturer` | text | `{{i18n.equipment.manufacturer}}` | No | No | -- |
| Initial User | `fas fa-user` | `data.initialUser` | object autocomplete | `{{i18n.equipment.initialUser}}` | No | No | `UserService.autocomplete`, display: `displayName` |
| Active | `fas fa-badge-check` | `data.active` | select (bool) | -- | No | No | Options: Active/Inactive |
| Location | `fas fa-clinic-medical` | `data.location` | object autocomplete | `{{i18n.location}}` | No | No | `LocationService.autocomplete`, display: `name` |
| Initial Password | `fas fa-key` | `data.initialPassword` | text | `{{i18n.equipment.initialPassword}}` | No | No | -- |
| Status | `fas fa-badge-check` | `data.status` | text | `{{i18n.EquipmentStatus}}` | No | **Yes** (readonly) | Managed via comments tab |
| Room | `fas fa-building` | `data.room` | object autocomplete | `{{i18n.equipment.room}}` | No | No | `RoomService.autocomplete`, display: `name`, cascading from Location |
| Date Setup | `fas fa-calendar` | `data.dateSetup` | date | `{{i18n.equipment.dateSetup}}` | No | No | -- |
| Product | `fas fa-shopping-bag` | `data.product` | object autocomplete | `{{i18n.equipment.product}}` | No | No | `ProductService.autocomplete`, filter: `"EQUIPMENT"`, display: `name` |
| Date Last Inventory | `fas fa-calendar` | `data.dateLastInventory` | date | `{{i18n.equipment.dateLastInventory}}` | No | No | -- |
| Date Exit | `fas fa-calendar` | `data.dateExit` | date | `{{i18n.equipment.dateExit}}` | No | No | -- |
| Description | -- | `data.description` | textarea | `{{i18n.label.description}}` | No | No | -- |

**Layout**: 3-column grid (`col-md-4`), rows: [inventoryNumber, name, accessUser], [serialNumber, manufacturer, initialUser], [active, location, initialPassword], [status, room, dateSetup], [product, empty, dateLastInventory], [empty, empty, dateExit], [description full-width].

### 2.7 Detail Form -- Tab 2: Comments / Status Change

| Element | Type | Details |
|---------|------|---------|
| Status select | mandatory select | WORKING, DEFECT, INREPAIR, RESERVED, UNKNOWN, SENT |
| Comment textarea | textarea | `#equipmentComment`, placeholder: `label.comment` |
| Save comment button | button | `#submitEquipmentComment`, calls `EquipmentService.addComment(equipmentId, status, text)` |
| Comments collection | list | Shows: `user.name`, `ts` (dateTime), `status`, `comment` per entry |

**Behavior**: Adding a comment also changes the equipment status. Minimum comment length: 4 characters. Unsaved equipment triggers `dialog_unsaved` alert.

### 2.8 Equipment Status Enum

| Value | i18n Key | Meaning |
|-------|----------|---------|
| `WORKING` | `EquipmentStatus.WORKING` | Working / operational |
| `DEFECT` | `EquipmentStatus.DEFECT` | Defective |
| `INREPAIR` | `EquipmentStatus.INREPAIR` | In repair |
| `RESERVED` | `EquipmentStatus.RESERVED` | Reserved |
| `UNKNOWN` | `EquipmentStatus.UNKNOWN` | Unknown |
| `SENT` | `EquipmentStatus.SENT` | Sent (shipped) |

### 2.9 Translation Table

| Text-Reference | German (key) | English | Notes |
|----------------|-------------|---------|-------|
| `EquipmentStatus` | `$[EquipmentStatus]` | Equipment Status | -- |
| `EquipmentStatus.WORKING` | `$[EquipmentStatus.WORKING]` | Working | Enum label |
| `EquipmentStatus.DEFECT` | `$[EquipmentStatus.DEFECT]` | Defective | Enum label |
| `EquipmentStatus.INREPAIR` | `$[EquipmentStatus.INREPAIR]` | In Repair | Enum label |
| `EquipmentStatus.RESERVED` | `$[EquipmentStatus.RESERVED]` | Reserved | Enum label |
| `EquipmentStatus.UNKNOWN` | `$[EquipmentStatus.UNKNOWN]` | Unknown | Enum label |
| `EquipmentStatus.SENT` | `$[EquipmentStatus.SENT]` | Sent | Enum label |
| `equipment.name` | `$[equipment.name]` | Name | -- |
| `equipment.serialNumber` | `$[equipment.serialNumber]` | Serial Number | -- |
| `equipment.inventoryNumber` | `$[equipment.inventoryNumber]` | Inventory Number | -- |
| `equipment.manufacturer` | `$[equipment.manufacturerr]` | Manufacturer | **Note**: typo in source `manufacturerr` |
| `equipment.product` | `$[equipment.product]` | Product | -- |
| `equipment.room` | `$[equipment.room]` | Room | -- |
| `equipment.comments` | `$[equipment.comments]` | Comments | -- |
| `equipment.accessUser` | -- | Access User | Referenced in HTML, not in i18n file |
| `equipment.initialUser` | -- | Initial User | Referenced in HTML, not in i18n file |
| `equipment.initialPassword` | -- | Initial Password | Referenced in HTML, not in i18n file |
| `equipment.dateSetup` | -- | Date Setup | Referenced in HTML, not in i18n file |
| `equipment.dateLastInventory` | -- | Date Last Inventory | Referenced in HTML, not in i18n file |
| `equipment.dateExit` | -- | Date Exit | Referenced in HTML, not in i18n file |
| `equipment.active` | -- | Active | Referenced in HTML, not in i18n file |
| `equipment.inactive` | -- | Inactive | Referenced in HTML, not in i18n file |

**HARDCODED strings**: "Action" (nav button), "Equipment" (label in room tab), "Inventory" (placeholder when no room), "the location of the room" (tooltip), "the room the equipment is in" (tooltip), "if the equipment is rented out..." (tooltip).

### 2.10 Cross-Module References

| Reference | Direction | Details |
|-----------|-----------|---------|
| `LocationService.autocomplete` | Equipment -> Location | Location picker (cascading to Room) |
| `RoomService.autocomplete` | Equipment -> Room | Room picker (filtered by Location) |
| `UserService.autocomplete` | Equipment -> User | accessUser and initialUser pickers |
| `ProductService.autocomplete` | Equipment -> Product | Product picker (filtered: `"EQUIPMENT"`) |
| `CustomerService.autocomplete` | Equipment -> Customer | Filter panel only |
| `EquipmentService.addComment` | Equipment (internal) | Status change via comment |

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

---

## Wireframe Reference (ASCII)

> Full wireframe: [`specs/wireframes/customer/workflows.md#w5-equipment-management`](../../../wireframes/customer/workflows.md#w5-equipment-management)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▌Equipment                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ [+ Add] [✎ Edit] [🗑 Delete] [⚙ Filter]                                    │
├────┬──────────┬───────────┬─────────┬────────┬──────────┬──────┬────┬──────┤
│ ID │ Serial   │ Inventory │ Status  │ Name   │Manufact. │ Desc │ #💬│ Room │
├────┼──────────┼───────────┼─────────┼────────┼──────────┼──────┼────┼──────┤
│  1 │ SN-123   │ INV-001   │🟢WORK  │Monitor │ Samsung  │ 24"  │  3 │ R101 │
│  2 │ SN-456   │ INV-002   │🔴DEFECT│Printer │ HP       │ Jet  │  5 │ R202 │
├────┴──────────┴───────────┴─────────┴────────┴──────────┴──────┴────┴──────┤
│ Filter Panel (offcanvas):                                                  │
│   Name [___] Location [autocomplete] Room [autocomplete, cascade: loc→rm]  │
│   Customer [autocomplete] Status [select] Max Results [select]             │
│   [Apply] [Reset]                                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Equipment Detail (900px) ────────────────────────────────────────────────┐
│  [Tab 1: Info] [Tab 2: Comments/Status]                                   │
├───────────────────────────────────────────────────────────────────────────┤
│  Tab 1: Info (3-column layout)                                            │
│  ┌──────────────────┐┌──────────────────┐┌──────────────────┐             │
│  │ Inventory# [___] ││ Name       [___] ││ Access User [ac] │             │
│  │ Serial#    [___] ││ Manufacturer[___]││ Initial User[ac] │             │
│  │ Active  [select] ││ Location   [ac]  ││ Init.Passwd [___]│             │
│  │ Status  [RO]     ││ Room [ac,cascade]││ Date Setup [📅]  │             │
│  │ Product [ac,EQUIP]│                  ││ Date Inv.  [📅]  │             │
│  │                  ││                  ││ Date Exit  [📅]  │             │
│  └──────────────────┘└──────────────────┘└──────────────────┘             │
│  Description [textarea___________________________]                        │
│                                                                           │
│  Tab 2: Comments / Status Change                                          │
│  ┌─ Status Change ──────────────────────────────┐                         │
│  │  New Status [select ▾]  (disabled if unsaved)│                         │
│  │  Comment* [textarea____] (min 4 chars)       │                         │
│  │                              [Submit Change] │                         │
│  └──────────────────────────────────────────────┘                         │
│  ┌──────────┬────────────────┬──────────┬───────────────────┐             │
│  │ User     │ Timestamp      │ Status   │ Comment           │             │
│  ├──────────┼────────────────┼──────────┼───────────────────┤             │
│  │ Dr.Müll  │ 2025-03-15 14h │ WORKING  │ Repair completed  │             │
│  │ Admin    │ 2025-03-10 09h │ INREPAIR │ Sent for repair   │             │
│  └──────────┴────────────────┴──────────┴───────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘

---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| split | **Sibling** | Same source: `entity-cruds/room-equipment-contact-medication-patientdata.md` | [Room](../room/room.md) | Common CRUD Pattern, 1. Room |
| split | **Sibling** | Same source: `entity-cruds/room-equipment-contact-medication-patientdata.md` | [Contact](../contact/contact.md) | Common CRUD Pattern, 3. Contact |
| split | **Sibling** | Same source: `entity-cruds/room-equipment-contact-medication-patientdata.md` | [Medication](../../treatment/medication/medication.md) | Common CRUD Pattern, 4. Medication |
| split | **Sibling** | Same source: `entity-cruds/room-equipment-contact-medication-patientdata.md` | [PatientData](../../treatment/patient-data/patient-data.md) | Common CRUD Pattern, 5. PatientData |

> **Split origin:** All five files (Room, Equipment, Contact, Medication, PatientData) were extracted from the same brownfield source `entity-cruds/room-equipment-contact-medication-patientdata.md` and share the Common CRUD Pattern section. This file covers Equipment (section 2).
