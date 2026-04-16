---
title: 'Medication'
---

# Entity CRUD Analysis: Room, Equipment, Contact, Medication, PatientData

## Cross-References

### Source Files

| File | Purpose |
|------|---------|
| `web/src/main/webapp/room/index.htmlm` | Room list page |
| `web/src/main/webapp/room/index.js` | Room page behavior |
| `web/src/main/webapp/room/messages.i18n.js` | Room translations |
| `web/src/main/webapp/equipment/index.htmlm` | Equipment list page |
| `web/src/main/webapp/equipment/index.js` | Equipment page behavior |
| `web/src/main/webapp/equipment/messages.i18n.js` | Equipment translations |
| `web/src/main/webapp/contact/index.htmlm` | Contact list page |
| `web/src/main/webapp/contact/index.js` | Contact page behavior |
| `web/src/main/webapp/contact/messages.i18n.js` | Contact translations |
| `web/src/main/webapp/medication/index.htmlm` | Medication list page |
| `web/src/main/webapp/medication/index.js` | Medication page behavior |
| `web/src/main/webapp/patientData/index.htmlm` | PatientData list page |
| `web/src/main/webapp/patientData/index.js` | PatientData page behavior |
| `web/src/main/webapp/patientData/messages.i18n.js` | PatientData translations |

### Related Specifications

| File | Relationship |
|------|--------------|
| [`room.md`](09-customers/rooms.md) | Shares the Common CRUD Pattern with FullCalendar integration and tabbed detail dialogs |
| [`equipment.md`](11-administration/equipment.md) | Shares the Common CRUD Pattern with cascading filters and collection tables |
| [`contact.md`](_shared-components/contact.md) | Shares the Common CRUD Pattern with object autocomplete and offcanvas filter panel |
| [`patient-data.md`](../patient-data/patient-data.md) | Shares the `Core.initCrud()` + `slickerGrid()` pattern; PatientData is another standalone reference data module |

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

## 4. Medication

**Service**: `MedicationService` | **Get method**: `get` | **QuickFilter**: Uses `quickFilter.mustache` template | **No messages.i18n.js file**

### 4.1 Grid Columns

| Field | Name (i18n) | Sortable | Width | Formatter |
|-------|------------|----------|-------|-----------|
| `id` | `label.id` | Yes | 80 | -- |
| `entryNumber` | `medication.entryNumber` | Yes | 80 | -- |
| `name` | `label.name` | Yes | 80 | -- |
| `unit` | `medication.unit` | Yes | 80 | -- |
| `targetGroup` | `medication.targetGroup` | Yes | 80 | -- |
| `usage` | `medication.usage` | Yes | 80 | -- |
| `applicationArea` | `medication.applicationArea` | Yes | 80 | -- |
| `approvalStatus` | `medication.approvalStatus` | Yes | 80 | -- |
| `trafficability` | `medication.trafficability` | Yes | 80 | `Formatter.bool` |
| `producer` | `medication.producer` | Yes | 80 | -- |
| `authorisationHolder` | `medication.authorisationHolder` | Yes | 80 | -- |
| `activeIngedients` | `medication.activeIngredients` | Yes | 80 | -- |
| `packageSize` | `medication.packageSize` | Yes | 80 | -- |
| `amClassification` | `medication.amClassification` | Yes | 80 | -- |

**Note**: All columns have uniform 80px width. Field name `activeIngedients` has a typo (missing 'r'), but i18n key is `medication.activeIngredients` (correct spelling).

### 4.2 Detail Form (Single tab, no tabs)

| Name | Label | Data path | Type | Options | Required |
|------|-------|-----------|------|---------|----------|
| ID | `label.id` | `data.id` | number (readonly in context) | -- | No |
| Entry Number | **HARDCODED** "entryNumber" | `data.entryNumber` | number | -- | No |
| Name | `name` | `data.name` | text | -- | No |
| Unit | `medication.unit` | `data.unit` | select | `PIECE` (`MedicationUnit.PIECE`), `IE` (`MedicationUnit.IE`) | No |
| Target Group | `medication.targetGroup` | `data.targetGroup` | text | -- | No |
| Usage | `medication.usage` | `data.usage` | text | -- | No |
| Application Area | `medication.applicationArea` | `data.applicationArea` | text | -- | No |
| Approval Status | `medication.approvalStatus` | `data.approvalStatus` | text | -- | No |
| Trafficability | `medication.trafficability` | `data.trafficability` | checkbox switch | -- | No |
| Producer | `medication.producer` | `data.producer` | text | -- | No |
| Authorisation Holder | `medication.authorisationHolder` | `data.authorisationHolder` | text | -- | No |
| Package Size | `medication.packageSize` | `data.packageSize` | text | -- | No |
| AM Classification | `medication.amClassification` | `data.amClassification` | text | -- | No |

**Layout**: Flat row of `col-md-1` columns (very narrow, likely a single-row form that wraps). No tabs.

### 4.3 Medication Unit Enum

| Value | i18n Key |
|-------|----------|
| `PIECE` | `MedicationUnit.PIECE` |
| `IE` | `MedicationUnit.IE` |

### 4.4 Translation Table

All translations are referenced via `{{i18n.medication.*}}` keys but **no `messages.i18n.js` file exists** -- translations come from a global/server-side i18n system.

| Text-Reference | Notes |
|----------------|-------|
| `medication.entryNumber` | Entry Number |
| `medication.unit` | Unit |
| `medication.targetGroup` | Target Group |
| `medication.usage` | Usage |
| `medication.applicationArea` | Application Area |
| `medication.approvalStatus` | Approval Status |
| `medication.trafficability` | Trafficability (road safety) |
| `medication.producer` | Producer |
| `medication.authorisationHolder` | Authorisation Holder |
| `medication.activeIngredients` | Active Ingredients |
| `medication.packageSize` | Package Size |
| `medication.amClassification` | AM Classification |
| `MedicationUnit.PIECE` | Piece (unit type) |
| `MedicationUnit.IE` | IE (International Einheit/Unit) |
| `label.id` | ID (shared) |
| `label.name` | Name (shared) |

**HARDCODED**: "entryNumber" (label in detail form), "Action" (nav button).

### 4.5 Nav Buttons (additional)

| Action ID | Symbol | Title | English |
|-----------|--------|-------|---------|
| `someActionBtn` | `lock-alt` | "Action" | **HARDCODED** "Action" |

### 4.6 Cross-Module References

None. Medication is a standalone reference data module.

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
