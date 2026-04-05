---
title: 'Contact'
---

> **Split from**: `entity-cruds/room-equipment-contact-medication-patientdata.md`
> **Sections extracted here**: Common CRUD Pattern, 3. Contact, Cross-Module Summary
> **Other domains received**: `customer/room/room.md` (Common CRUD Pattern, 1. Room, Cross-Module Summary), `customer/equipment/equipment.md` (Common CRUD Pattern, 2. Equipment, Cross-Module Summary), `treatment/medication/medication.md` (Common CRUD Pattern, 4. Medication, Cross-Module Summary), `treatment/patient-data/patient-data.md` (Common CRUD Pattern, 5. PatientData, Cross-Module Summary)

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

## 3. Contact

**Service**: `ContactService` | **Get method**: `get` | **Filter**: Offcanvas + A-Z QuickFilter

### 3.1 Special: Alphabetical Quick Filter

Contact has an A-Z quick filter bar unique among these modules:
- **Full**: Individual letters A-Z plus `#`
- **Short** (compact): Ranges A-D, E-H, I-L, M-P, Q-T, U-X, Y-Z#
- **Input**: Free-text search enabled

### 3.2 Grid Columns

| Field | Name (i18n) | Sortable | Width | Formatter |
|-------|------------|----------|-------|-----------|
| `displayName` | `contact.displayname` | Yes | 170 | -- |
| `firstName` | `contact.firstName` | Yes | 100 | -- |
| `lastName` | `contact.lastName` | Yes | 100 | -- |
| `type` | `contact.type` | Yes | 100 | -- |
| `categories` | `contact.categories` | Yes | 100 | `Formatter.categoryType` |
| `primaryEmail` | `contact.primaryemail` | Yes | 130 | -- |
| `cellularNumber` | `contact.cellularnumber` | Yes | 130 | -- |
| `company` | `contact.company` | Yes | 130 | `Formatter.name` |
| `workPhone` | `contact.workphone` | Yes | 130 | -- |
| `workAddress` | `contact.address` | Yes | 120 | -- |
| `workZipCode` | `contact.zipcode` | Yes | 50 | -- |
| `workCity` | `contact.city` | Yes | 120 | -- |
| `workCountry` | `contact.country` | Yes | 120 | -- |

### 3.3 Custom Formatters

```js
Formatter.categoryType = function(row, cell, value) {
    // Joins array of category strings with ", "
}
```

### 3.4 Nav Buttons (additional)

| Action ID | Symbol | Title | English |
|-----------|--------|-------|---------|
| `downloadMenuBtn` | `save` | `export.download` | Download/Export |
| `sendPasswordMenuBtn` | `lock-alt` | `login.password` | Send Password |

### 3.5 Grid Data Processing

`dataProcess` flattens `userProfile` sub-object onto the main contact object (merges all properties from `userProfile` onto the row data).

### 3.6 Filter Panel (Offcanvas)

| Field | Type | Details |
|-------|------|---------|
| Name | text | `data.name` |
| Primary Email | text | `data.email` |
| Max results | select | 100-500, >500 |

### 3.7 Detail Form -- Tab 1: Contact Info

| Name | i18n key | Data path | Type | Notes |
|------|----------|-----------|------|-------|
| Title | `contact.title` | `data.title` | text | -- |
| First Name | `contact.firstname` | `data.firstName` | text | -- |
| Last Name | `contact.lastname` | `data.lastName` | text | -- |
| Display Name | `contact.displayname` | `data.displayName` | text | -- |
| Company | `contact.company` | `data.company` | object autocomplete | `CompanyService.autocomplete`, display: `displayName` |
| Position | `contact.position` | `data.position` | text | -- |
| Categories | `contact.categories` | `data.categories` | tag-it (multi-tag) | `ContactService.getCategories` autocomplete, max 7 tags |
| Primary Email | `contact.primaryemail` | `data.primaryEmail` | email + regexp | Pattern: `^[^ @#]+@[^ @#]+$` |
| Second Email | `contact.secondemail` | `data.secondEmail` | email + regexp | Pattern: `^[^ @#]+@[^ @#]+$` |
| Work Phone | `contact.workphone` | `data.workPhone` | text | -- |
| Cellular | `contact.cellularnumber` | `data.cellularNumber` | text | -- |
| Fax | `contact.faxnumber` | `data.faxNumber` | text | -- |
| Pager | `contact.pagernumber` | `data.pagerNumber` | text | -- |
| Home Phone | `contact.homephone` | `data.homePhone` | text | -- |
| Birthday | `contact.birthday` | `data.birthday` | date | -- |
| QR Code | -- | -- | image (`#contactQR`) | Generated QR code image |

### 3.8 Detail Form -- Tab 2: Private Address

| Name | i18n key | Data path | Type |
|------|----------|-----------|------|
| Address | `contact.address` | `data.homeAddress` | text (wide) |
| Address 2 | `contact.address2` | `data.homeAddress2` | text (wide) |
| City | `contact.city` | `data.homeCity` | text (wide) |
| State | `contact.state` | `data.homeState` | text (wide) |
| Zip Code | `contact.zipcode` | `data.homeZipCode` | text |
| Country | `contact.country` | `data.homeCountry` | text (wide) |
| Webpage | `contact.webpage` | `data.webpage1` | text (wide) |

### 3.9 Detail Form -- Tab 3: Work Address

| Name | i18n key | Data path | Type |
|------|----------|-----------|------|
| Address | `contact.address` | `data.workAddress` | text (wide) |
| Address 2 | `contact.address2` | `data.workAddress2` | text (wide) |
| City | `contact.city` | `data.workCity` | text (wide) |
| State | `contact.state` | `data.workState` | text (wide) |
| Zip Code | `contact.zipcode` | `data.workZipCode` | text |
| Country | `contact.country` | `data.workCountry` | text (wide) |
| Webpage | `contact.webpage` | `data.webpage2` | text (wide) |

### 3.10 Detail Form -- Tab 4: Other

| Name | i18n key | Data path | Type |
|------|----------|-----------|------|
| Custom 1 | `contact.custom1` | `data.custom1` | text (wide) |
| Custom 2 | `contact.custom2` | `data.custom2` | text (wide) |
| Custom 3 | `contact.custom3` | `data.custom3` | text (wide) |
| Custom 4 | `contact.custom4` | `data.custom4` | text (wide) |
| Notes | `contact.notes` | `data.notes` | textarea (full-width) |

### 3.11 Import Dialog

`#contactImportDialog` provides file upload with a "force update existing contacts" checkbox. Uses `fileUpload` class pattern.

### 3.12 Translation Table

| Text-Reference | German (key) | English | Notes |
|----------------|-------------|---------|-------|
| `contact` | `$[contact]` | Contact | -- |
| `contact.title` | `$[contact.title]` | Title | -- |
| `contact.displayname` | `$[contact.displayname]` | Display Name | -- |
| `contact.firstname` | `$[contact.firstname]` | First Name | -- |
| `contact.lastname` | `$[contact.lastname]` | Last Name | -- |
| `contact.type` | `$[contact.type]` | Type | -- |
| `contact.categories` | `$[contact.categories]` | Categories | -- |
| `contact.address` | `$[contact.address]` | Address | Shared for home/work |
| `contact.state` | `$[contact.state]` | State | -- |
| `contact.primaryemail` | `$[contact.primaryemail]` | Primary Email | -- |
| `contact.company` | `$[contact.company]` | Company | -- |
| `contact.workphone` | `$[contact.workphone]` | Work Phone | -- |
| `contact.cellularnumber` | `$[contact.cellularnumber]` | Cellular Number | -- |
| `contact.zipcode` | `$[contact.zipcode]` | Zip Code | -- |
| `contact.city` | `$[contact.city]` | City | -- |
| `contact.country` | `$[contact.country]` | Country | -- |
| `contact.homephone` | `$[contact.homephone]` | Home Phone | -- |
| `contact.private` | -- | Private | Tab title, not in i18n file |
| `contact.work` | -- | Work | Tab title, not in i18n file |
| `contact.other` | -- | Other | Tab title, not in i18n file |
| `contact.position` | -- | Position | Not in i18n file |
| `contact.secondemail` | -- | Second Email | Not in i18n file |
| `contact.faxnumber` | -- | Fax Number | Not in i18n file |
| `contact.pagernumber` | -- | Pager Number | Not in i18n file |
| `contact.birthday` | -- | Birthday | Not in i18n file |
| `contact.webpage` | -- | Webpage | Not in i18n file |
| `contact.address2` | -- | Address 2 | Not in i18n file |
| `contact.custom1`-`4` | -- | Custom 1-4 | Not in i18n file |
| `contact.notes` | -- | Notes | Not in i18n file |
| `contact.updateExistingContacts` | -- | Update existing contacts | Import dialog |
| `label.import` | -- | Import | Import dialog |
| `export.download` | -- | Download | Nav button |
| `login.password` | -- | Password | Nav button (send password) |

### 3.13 Cross-Module References

| Reference | Direction | Details |
|-----------|-----------|---------|
| `CompanyService.autocomplete` | Contact -> Company | Company picker in detail form |
| `ContactService.getCategories` | Contact (internal) | Tag autocomplete for categories |
| `userProfile` flattening | Contact -> User | Grid dataProcess merges userProfile fields |

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

> Full wireframe: [`specs/wireframes/customer/workflows.md#w3-contact-management`](../../../wireframes/customer/workflows.md#w3-contact-management)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▌Contacts                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [A][B][C][D][E][F]...[X][Y][Z][#]   [custom: AZFilterBar]                  │
│ Compact: [A-D][E-H][I-L][M-P][Q-T][U-X][Y-Z#]                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [+ Add][✎ Edit][🗑 Delete] | [📥 Import][💾 Export][🔑 Send Password]       │
├──────┬───────┬────────┬────┬──────┬──────┬──────┬────────┬──────┬────┬──────┤
│ Name │ First │ Last   │Type│ Cat  │Email │Cell  │Company │WkPhn │Addr│ Zip  │
├──────┼───────┼────────┼────┼──────┼──────┼──────┼────────┼──────┼────┼──────┤
│ Mull │ Hans  │ Müller │ -- │ VIP  │h@..  │+43.. │ACME    │+43.. │... │ 1010 │
├──────┴───────┴────────┴────┴──────┴──────┴──────┴────────┴──────┴────┴──────┤
│ Filter: [⚙ Name][Email][Max Results]                    [< 1  2  3  4  >]  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Contact Detail (900px) ──────────────────────────────────────────────────┐
│  [Tab 1: Personal] [Tab 2: Private] [Tab 3: Work] [Tab 4: Other]          │
├───────────────────────────────────────────────────────────────────────────┤
│  Tab 1: Personal Info                                                     │
│  Title [___] First Name [___] Last Name [___] Display Name [___]          │
│  Company [autocomplete] Position [___]                                    │
│  Categories [tag-it: ████ ████ ████] (max 7)                              │
│  Email [___] Second Email [___]                                           │
│  Work Phone [___] Cell [___] Fax [___] Pager [___] Home Phone [___]       │
│  Birthday [____]  [QR Code 📱]                                            │
│                                                                           │
│  Tab 2: Private Address                                                   │
│  Address [_____] Address2 [_____] City [___] State [___] Zip [___]        │
│  Country [___] Webpage [___]                                              │
│                                                                           │
│  Tab 3: Work Address (same layout as Tab 2)                               │
│  Tab 4: Other — Custom1-4 [___] Notes [textarea]                          │
│                                            [Cancel] [Save]                │
└───────────────────────────────────────────────────────────────────────────┘

┌─ Import Dialog ──────────────────────────────┐
│  Upload File: [Choose File...]               │
│  ☑ Update existing contacts                  │
│                       [Cancel] [Import]       │
└──────────────────────────────────────────────┘
```
