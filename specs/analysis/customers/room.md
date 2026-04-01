> **Split from**: `entity-cruds/room-equipment-contact-medication-patientdata.md`
> **Sections extracted here**: Common CRUD Pattern, 1. Room, Cross-Module Summary
> **Other domains received**: `customer/equipment/equipment.md` (Common CRUD Pattern, 2. Equipment, Cross-Module Summary), `customer/contact/contact.md` (Common CRUD Pattern, 3. Contact, Cross-Module Summary), `treatment/medication/medication.md` (Common CRUD Pattern, 4. Medication, Cross-Module Summary), `treatment/patient-data/patient-data.md` (Common CRUD Pattern, 5. PatientData, Cross-Module Summary)

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

## 1. Room

**Service**: `RoomService` | **Get method**: `get` | **Panel**: Yes | **Search**: Yes (client-side)

### 1.1 Grid Columns

| Field | Name (i18n) | Sortable | Width | Formatter |
|-------|------------|----------|-------|-----------|
| `id` | `label.id` | Yes | 80 | -- |
| `location` | `location` | Yes | 180 | `Formatter.name` |
| `name` | `room.name` | Yes | 90 | -- |
| `number` | `room.number` | Yes | 90 | -- |
| `description` | `label.description` | Yes | 250 | -- |

### 1.2 Client-side Filter Fields

Searches across: `name`, `number`, `location.name` (case-insensitive substring match).

### 1.3 Detail Form -- Tab 1: Room Info

| Name | Symbol | Data path | Type | Options | Placeholder | Required | Read-only |
|------|--------|-----------|------|---------|-------------|----------|-----------|
| Location | `fas fa-clinic-medical` | `data.location` | object autocomplete | `LocationService.autocomplete`, display: `name` | `{{i18n.location}}` | No | No |
| Available | -- | `data.available` | checkbox (boolean switch) | -- | -- | No | No |
| Name | -- | `data.name` | text | -- | `{{i18n.room.name}}` | **Yes** (`mandatory`) | No |
| Number | -- | `data.number` | text | -- | `{{i18n.room.number}}` | **Yes** (`mandatory`) | No |
| Description | -- | `data.description` | textarea | -- | `{{i18n.label.description}}` | No | No |

### 1.4 Detail Form -- Tab 2: Planning (FullCalendar)

**Special component**: FullCalendar integration. Hidden for new (unsaved) rooms.

#### Calendar Configuration

| Property | Value |
|----------|-------|
| Initial view | `dayGridMonth` |
| Locale | `de` |
| Header toolbar left | `dayGridMonth`, `timeGridWeek`, `timeGridDay` |
| Week numbers | Yes |
| Event color | `#2ec1cc` |
| Event display | `block` with time shown |
| Data source | `RoomplanService.getCalendar(roomId, startStr, endStr)` |

#### Calendar Event Types

| Type | Source field | Display mode | Coloring |
|------|-------------|-------------|----------|
| **Slots** (room plan availability) | `data.slots` | Normal block | `obj.color` (custom per slot) |
| **Appointments** (bookings) | `data.events` | `background` | `i18n.appointmentState(obj.state).color` as CSS class |

#### Plan List (left sidebar, 2-column layout)

- Collection list of plans (`plans.list`) showing `title`
- Each plan row has: check icon (active indicator), edit icon, delete icon
- Plans loaded via `RoomplanService.getByRoom(roomId)`

#### Plan CRUD Actions

| Action | Symbol | Service Call |
|--------|--------|-------------|
| Add plan | `fa-plus` button (`#addPlan`) | Opens `#roomplanDlg`, saves via `RoomplanService.save` |
| Edit plan | `fa-pencil` (`.edit-plan`) | Opens `#roomplanDlg` prefilled, saves via `RoomplanService.save` |
| Delete plan | `fa-trash` (`.delete-plan`) | `RoomplanService.remove([id])` |

### 1.5 Room Plan Dialog (`#roomplanDlg`)

Secondary dialog for creating/editing room availability plans.

| Name | Symbol | Data path | Type | Placeholder | Required |
|------|--------|-----------|------|-------------|----------|
| Title | `fa-tag` | `data.title` | text | `{{i18n.label.name}}` | **Yes** (`mandatory`) |
| Date Start | `fa-calendar-day` | `data.dateStart` | date | `{{i18n.dateFilter.fromDate}}` | No |
| Date Until | -- | `data.dateUntil` | date | `{{i18n.dateFilter.toDate}}` | No |
| Active | -- | `data.active` | checkbox switch | -- | No |
| Description | `fa-quote-left` | `data.description` | textarea | `{{i18n.label.description}}` | No |
| Monday | -- | `data.recur.monday` | checkbox switch | -- | No |
| Tuesday | -- | `data.recur.tuesday` | checkbox switch | -- | No |
| Wednesday | -- | `data.recur.wednesday` | checkbox switch | -- | No |
| Thursday | -- | `data.recur.thursday` | checkbox switch | -- | No |
| Friday | -- | `data.recur.friday` | checkbox switch | -- | No |
| Saturday | -- | `data.recur.saturday` | checkbox switch | -- | No |
| Sunday | -- | `data.recur.sunday` | checkbox switch | -- | No |
| Start time | `far fa-play` | `data.recur.start` | time (clockpicker) | `{{i18n.label.start}}` | **Yes** (`mandatory`) |
| End time | `far fa-stop` | `data.recur.end` | time (clockpicker) | `{{i18n.label.until}}` | **Yes** (`mandatory`) |

**HARDCODED German strings in plan dialog**:
- "Neuer Plan" (title attribute on add button)
- "Plan" (table header)
- "Datum in welchem der Plan aktiv ist (leer = Open End)"
- "Wochentage/Uhrzeit wann der Raum an den angegebenen Tagen frei ist"

**Holiday time toggle** (referenced in JS but no HTML found in template): `#enableHolidayTimeSwitch`, `#holidayTimeStartInput`, `#holidayTimeEndInput` -- possibly incomplete/dead code.

### 1.6 Detail Form -- Tab 3: Equipment Assignment

Inline equipment association for the room.

| Element | Type | Details |
|---------|------|---------|
| Equipment autocomplete | object autocomplete | `EquipmentService.autocomplete`, display: `displayName`, insert mode |
| Equipment table | collection | Columns: Name, Serial Number, Status, Description, Remove (trash icon) |

### 1.7 Translation Table

| Text-Reference | German (from i18n key) | English | Notes |
|----------------|----------------------|---------|-------|
| `room.number` | `$[room.number]` | Room Number | -- |
| `room.name` | `$[room.name]` | Room Name | -- |
| `room.available` | `$[room.available]` | Available | Used in checkbox label |
| `label.description` | `$[label.description]` | Description | Shared key |
| `location` | `$[location]` | Location | Shared key |
| `Roomplan` | `$[Roomplan]` | Room Plan | Tab title |
| `equipment` | `$[equipment]` | Equipment | Tab title |
| `WeekDay.MO` | `$[WeekDay.MO]` | Monday | Plan dialog |
| `WeekDay.TU` | `$[WeekDay.TU]` | Tuesday | Plan dialog |
| `WeekDay.WE` | `$[WeekDay.WE]` | Wednesday | Plan dialog |
| `WeekDay.TH` | `$[WeekDay.TH]` | Thursday | Plan dialog |
| `WeekDay.FR` | `$[WeekDay.FR]` | Friday | Plan dialog |
| `WeekDay.SA` | `$[WeekDay.SA]` | Saturday | Plan dialog |
| `WeekDay.SU` | `$[WeekDay.SU]` | Sunday | Plan dialog |
| `label.start` | `$[label.start]` | Start | Plan dialog |
| `label.until` | `$[label.until]` | Until | Plan dialog |
| `label.active` | `$[label.active]` | Active | Plan dialog |
| `label.name` | `$[label.name]` | Name | Plan dialog |
| `dateFilter.fromDate` | `$[dateFilter.fromDate]` | From Date | Plan dialog |
| `dateFilter.toDate` | `$[dateFilter.toDate]` | To Date | Plan dialog |
| `dateFilter.userDefined` | `$[dateFilter.userDefined]` | User-Defined Date Range | Tooltip |

**HARDCODED (German)**: "Neuer Plan", "Plan", "Datum in welchem der Plan aktiv ist (leer = Open End)", "Wochentage/Uhrzeit wann der Raum an den angegebenen Tagen frei ist"

### 1.8 Cross-Module References

| Reference | Direction | Details |
|-----------|-----------|---------|
| `LocationService.autocomplete` | Room -> Location | Location picker in room form |
| `EquipmentService.autocomplete` | Room -> Equipment | Equipment tab, insert-mode autocomplete |
| `RoomplanService` | Room -> RoomPlan | Separate service for plan CRUD + calendar data |
| `appointment/messages.i18n.js` | Room -> Appointment | Loaded for `i18n.appointmentState()` used in calendar event coloring |
| `CalendarUtils.lightOrDark()` | Room -> Shared Utils | Text contrast calculation for slot colors |

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

> Full wireframe: [`specs/wireframes/customer/workflows.md#w4-room-management`](../../../wireframes/customer/workflows.md#w4-room-management)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▌Rooms                                        🔍 [Search: name/number/loc] │
├─────────────────────────────────────────────────────────────────────────────┤
│ [+ Add] [✎ Edit] [🗑 Delete]                                               │
├────┬──────────────┬──────────┬────────┬─────────────────────────────────────┤
│ ID │ Location     │ Name     │ Number │ Description                         │
├────┼──────────────┼──────────┼────────┼─────────────────────────────────────┤
│  1 │ JVA Berlin   │ Room A   │ 101    │ Main consultation room              │
│  2 │ JVA Hamburg  │ Room B   │ 202    │ Equipment storage                   │
├────┴──────────────┴──────────┴────────┴─────────────────────────────────────┤
│ Showing 1-2 of 15 rooms                                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Room Detail (900px) ─────────────────────────────────────────────────────┐
│  [Tab 1: Info] [Tab 2: Planning] [Tab 3: Equipment]                       │
├───────────────────────────────────────────────────────────────────────────┤
│  Tab 1: Room Info                                                         │
│  Location [autocomplete 🏥]  Available [toggle ◉]                         │
│  Name* [_________]  Number* [_________]                                   │
│  Description [textarea___________________________]                        │
│                                                                           │
│  Tab 2: Planning [integration: @fullcalendar/react]                       │
│  ┌─ Plan Sidebar ─┐  ┌─ FullCalendar ──────────────────────────────────┐  │
│  │ [+ Add Plan]   │  │  [Month] [Week] [Day]           ◀ March 2025 ▶ │  │
│  │ ✓ Morning slot │  │  ┌───┬───┬───┬───┬───┬───┬───┐                 │  │
│  │   ✎  🗑        │  │  │Mon│Tue│Wed│Thu│Fri│Sat│Sun│                 │  │
│  │ ○ Evening slot │  │  │▓▓▓│▓▓▓│▓▓▓│▓▓▓│▓▓▓│   │   │ ▓=availability  │  │
│  │   ✎  🗑        │  │  │░░░│   │░░░│   │░░░│   │   │ ░=appointments  │  │
│  └────────────────┘  └──────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─ Room Plan Sub-Dialog ───────────────────────────────┐                 │
│  │  Title* [_________]                                  │                 │
│  │  Date Range: [From ____] - [Until ____] (empty=open) │                 │
│  │  Active [toggle ◉]                                   │                 │
│  │  Weekdays: [Mon][Tue][Wed][Thu][Fri][Sat][Sun]       │                 │
│  │  Time: Start* [__:__] End* [__:__]                   │                 │
│  │  Description [textarea_____]                         │                 │
│  │                            [Cancel] [Save Plan]      │                 │
│  └──────────────────────────────────────────────────────┘                 │
│                                                                           │
│  Tab 3: Equipment                                                         │
│  Search: [Equipment autocomplete_____]                                    │
│  ┌──────────┬────────────┬──────────┬──────────────────┬───┐              │
│  │ Name     │ Serial No. │ Status   │ Description      │ 🗑│              │
│  ├──────────┼────────────┼──────────┼──────────────────┼───┤              │
│  │ Monitor  │ SN-12345   │ WORKING  │ Samsung 24"      │ 🗑│              │
│  └──────────┴────────────┴──────────┴──────────────────┴───┘              │
│                                            [Cancel] [Save]                │
└───────────────────────────────────────────────────────────────────────────┘
```
