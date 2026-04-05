---
title: 'Wireframe Plan Batch11'
---

---
---

# Wireframe Plan — System Domain (Batch 11)

> **Batch 11**: MOTD & Template Editor, CDR Call & Assignment, System Config CRUDs, Templates & Files
> **Target directory**: `specs/wireframes/system/`
> **Analysis sources**: `specs/analysis/system/admin-cruds/`, `cdr-call/`, `config/`, `templates-files/`, `data-dictionary-system.md`

## Prerequisites

1. Analysis documents reviewed:
   - [`admin-cruds/04-motd-template.md`](./admin-cruds/04-motd-template.md) -- MOTD management + template editor (referenced in `README.md`)
   - [`config/system-config.md`](./config/system-config.md) -- locationType (A), exclusionCriteria (B), supportCategory (D), loginNotification (I)
   - [`data-dictionary-system.md`](./data-dictionary-system.md) -- Sections 2.1 (CDR Call), 2.2 (CDR Assignment), 3.1 (MOTD), 3.2 (Login Notification), 4.1-4.6 (Templates & Config)
   - CDR Call analysis: sourced from `planning/appointment-support/plan-cdr.md` (split to `cdr-call/01-cdr-call.md` per README)
   - Templates & Files analysis: sourced from `utility/worklog-templates-files.md` (split to `templates-files/01-templates-files.md` per README)
2. Data dictionary: [`data-dictionary-system.md`](./data-dictionary-system.md)
3. Pencil MCP server is available and responsive
4. Review guidelines: `get_guidelines(topic="web-app")`
5. Enumerate available Shadcn components: `get_project_registries()` then `list_items_in_registries(["@shadcn"])`

---

## Design System Reference

| Token | Value | Usage |
|:---|:---|:---|
| `$--bg` | `#FFFFFF` | Page and panel backgrounds |
| `$--fg` | `#0A0A0A` | Primary text |
| `$--border` | `#E5E5E5` | Dividers, table borders |
| `$--primary` | `#171717` | Primary buttons, active states |
| `$--input-border` | `#D4D4D4` | Input field strokes |
| `$--muted` | `#F5F5F5` | Muted backgrounds, disabled states |
| `$--destructive` | `#EF4444` | Delete buttons, error alerts |
| Font | Inter | All text |
| Font sizes | 13-20px | Labels (13px), body (14px), headings (16-20px) |
| Font weights | 400-700 | Normal (400), medium (500), semibold (600), bold (700) |
| Dialog | 600px width | Standard dialogs; cornerRadius 12, shadow, `$--bg` fill, `$--border` stroke |
| Drawer | 1100px width | Detail drawers for complex forms |
| Full page | 1440px width | Grid/list page frames |
| Input | cornerRadius 8 | padding 10,14; `$--input-border` stroke |
| Alert | cornerRadius 8 | padding 16; contextual fill colors |

---

## Shadcn UI Component Mapping

### Module 1: MOTD & Template Editor

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen) | `@shadcn/table` (DataTable) | 7 columns; `UserService.saveSetting` for grid persistence |
| Off-canvas detail panel (1100px) | `@shadcn/drawer` (side="right") | 20 fields across grouped sections |
| Checkbox (enabled) | `@shadcn/switch` | Boolean toggle for `data.enabled` |
| Priority select (4 options) | `@shadcn/select` | LOW, NORMAL, HIGH, URGENT |
| Date + Time inputs | `@shadcn/input` (type="date") + `@shadcn/input` (type="time") | Separate date/time for start and end |
| Role checkboxes (6x) | `@shadcn/switch` (x6) | NEW, EXPERT, ADMIN_INTERN, ADMIN, CUSTOMER, ADMIN_CUSTOMER |
| Markdown textarea (`markdownedit`) | `@shadcn/textarea` + markdown preview | `data.message`; rich editing |
| Text input (link, sort, width) | `@shadcn/input` | Standard text/number inputs |
| Image position select (5 options) | `@shadcn/select` | LEFT, TOP, BOTTOM, BACK, *(none)* |
| File upload | `@shadcn/input` (type="file") | Encoded in payload on save |
| Bootstrap card preview | `@shadcn/dialog` | Preview with priority-colored header + image positioning |
| Two-column template editor | Custom layout | Left: `@shadcn/textarea` (markdown), Right: rendered preview |
| Add/Edit/Delete toolbar | `@shadcn/button` (variants) | Standard CRUD toolbar |

### Module 2: CDR Call & Assignment

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` CDR Call (fullscreen) | `@shadcn/table` (DataTable) | 16 columns; heavy read-only data |
| `slickerGrid` CDR Assignment | `@shadcn/table` (DataTable) | 11 columns |
| Detail panel (CDR Call) | `@shadcn/drawer` (side="right") | 24 fields in 4 sections |
| Detail panel (CDR Assignment) | `@shadcn/drawer` (side="right") | 10 fields |
| Year/Month/Day filter | `@shadcn/select` (x3) inline | Date decomposition filter toolbar |
| CDR Status badge | `@shadcn/badge` | 7 color-coded values: INVALID_UNKNOWN, DIRECT, FORWARDED, etc. |
| Export XLS/CSV buttons | `@shadcn/button` | Triggers `generateExport(format)` |
| Export job polling dialog | `@shadcn/dialog` | Progress indicator with `[async: poll]` annotation |
| Reset Calls button | `@shadcn/alert-dialog` | Confirmation before `resetCalls` |
| Upload CSV | `@shadcn/input` (type="file") + `@shadcn/button` | Upload CSV workflow |
| Analyze Open button | `@shadcn/button` | `analyzeOpenCalls` action |
| User autocomplete (assignment) | `@shadcn/combobox` | `UserInfoService.autocomplete` binding |
| Video checkbox | `@shadcn/checkbox` | `data.ideo` (CDR Call detail) |

### Module 3: System Config CRUDs

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| Tab container (4 modules) | `@shadcn/tabs` | Location Type, Exclusion Criteria, Support Category, Login Notification |
| `slickerGrid` (per tab) | `@shadcn/table` (DataTable) | Each tab has its own grid |
| Detail panel (per tab) | `@shadcn/drawer` (side="right") | Varies per module |
| Text inputs | `@shadcn/input` | name, description, category, title, queue |
| Number inputs | `@shadcn/input` (type="number") | prio, priority |
| Textarea (4 rows) | `@shadcn/textarea` | `data.description` in Exclusion Criteria |
| Sortable string list | `dnd-kit` + `@shadcn/input` | Support Category subcategories; drag handle + delete |
| Date inputs | `@shadcn/input` (type="date") or DatePicker | Login Notification dateFrom/dateTo |
| Active switch | `@shadcn/switch` | Login Notification `data.active` |
| Markdown textarea (50vh) | `@shadcn/textarea` + markdown preview | Login Notification `data.content` |
| Quick filter | `@shadcn/input` with search icon | Login Notification quick filter |
| Filter panel | Custom filter row | Login Notification only (`filter: true`) |

### Module 4: Templates & Files

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| Tab container (3 modules) | `@shadcn/tabs` | Export Template, Notification Template, User File |
| `slickerGrid` (per tab) | `@shadcn/table` (DataTable) | Each tab has its own grid |
| Detail panel (per tab) | `@shadcn/drawer` (side="right") | Varies per module |
| Type select (Export Template) | `@shadcn/select` | `enum:ExportTemplateType` |
| Active switch | `@shadcn/switch` | Export Template, User File |
| File upload (conditional) | `@shadcn/input` (type="file") | Export Template; `[cond: data.id]` -- only on existing records |
| Event select (Notification Template) | `@shadcn/select` | `enum:NotificationEvent` |
| Message textarea (40 rows) | `@shadcn/textarea` | With live markdown preview side-by-side |
| Data autocomplete (User File) | `@shadcn/combobox` | `FileEntryService` binding |
| Type select (User File) | `@shadcn/select` | `enum:UserFileType` (10 values) |
| Date inputs | `@shadcn/input` (type="date") or DatePicker | date, dateVerified in User File |
| Number inputs | `@shadcn/input` (type="number") | foreignId, parentId, verifiedBy, ownerId |
| Quick filter (User File) | `@shadcn/input` with search icon | Client-side filtering |
| Action button (User File) | `@shadcn/button` | Toolbar action |
| No Add button (Notification Template) | -- | Edit/Delete only; templates are system-seeded |

---

## Wireframe Inventory

| ID | Wireframe | Analysis Source | Target `.pen` | Complexity | Description |
|:---|:---|:---|:---|:---|:---|
| W15 | MOTD List + Detail | data-dictionary-system.md 3.1, admin-cruds/04-motd-template.md | `motd-template.pen` | High | Full-page (1440px) grid with 7 columns (id, subject, dateStart, enabled, sort, priority, dateCreated). Right drawer (1100px) with 20 fields organized in sections: (1) basic info -- subject, enabled `@shadcn/switch`, priority `@shadcn/select` [LOW/NORMAL/HIGH/URGENT]; (2) scheduling -- startDate + startTime, endDate + endTime; (3) visibility -- 6 role switches (NEW, EXPERT, ADMIN_INTERN, ADMIN, CUSTOMER, ADMIN_CUSTOMER); (4) content -- message `@shadcn/textarea` with `[markdown]`, link, sort, width (1-12), imagePos `@shadcn/select` [LEFT/TOP/BOTTOM/BACK], file upload `@shadcn/input[file]`. |
| W15b | MOTD Preview Dialog | data-dictionary-system.md 3.1 | `motd-template.pen` | Low | Preview dialog (600px): Bootstrap-style card with priority-colored header bar, subject as title, rendered markdown message body, optional image with position-driven layout (left/top/bottom/back), link button at bottom. 4 priority color variants annotated. |
| W15c | Template Editor | data-dictionary-system.md 1.3 | `motd-template.pen` | Low | Two-column layout: left column `@shadcn/textarea` for raw markdown (`data.templateMarkdown`), right column rendered HTML preview (`data.templateContent` `[RO]`). Toolbar with save button above. |
| W16 | CDR Call List + Detail | data-dictionary-system.md 2.1 | `cdr-call.pen` | High | Full-page (1440px) grid with 16 columns (id, type/status `@shadcn/badge`, user, location, dateStart, dateConnect, dateDisconnect, duration, callingNumber, calledNumber, callingUser, finalUserId, finalNumber, conversationId, assignmentId, pkId). Filter toolbar: Year `@shadcn/select` + Month `@shadcn/select` + Day `@shadcn/select` inline. Right drawer with 24 fields in 4 sections: (1) call info -- id `[RO]`, type `[RO]`, dateStart, dateConnect, dateDisconnect, duration; (2) parties -- callingNumber, calledNumber, callingUser, callingUri, finalUserId, finalNumber, originalNumber, originalCalledUri; (3) technical -- lastRedirect, joinOnBehalf, destConversationId, destDevice, origDevice, video `@shadcn/checkbox`, controllerInfo, huntPilot, destCause; (4) routing -- conversationId, assignmentId, pkId. Action toolbar: Export XLS, Export CSV, Reset Calls `@shadcn/alert-dialog`, Upload CSV, Analyze Open. |
| W16b | CDR Call Export Job | data-dictionary-system.md 2.1 | `cdr-call.pen` | Low | Job polling dialog (600px): progress spinner, status text (`[async: poll 2000ms]`), cancel/close button. Shown during XLS/CSV export generation. |
| W17 | CDR Assignment List + Detail | data-dictionary-system.md 2.2 | `cdr-call.pen` | Medium | Grid with 11 columns (id, confidence, start, until, duration, user, locationId, location, appointmentId, consultationId, conferenceId `[RO]`). Right drawer with 10 fields: id `[RO]`, confidence, start, until, duration, user `@shadcn/combobox` `[autocomplete: UserInfoService.autocomplete]`, locationId, location, appointmentId, consultationId. Action toolbar: Assign button. |
| W18 | Location Type Tab | config/system-config.md A | `system-config.pen` | Low | Tab 1 of `@shadcn/tabs`. Grid: 4 columns (id, name, description, prio). Drawer: id `[RO]`, name `@shadcn/input`, description `@shadcn/input`, prio `@shadcn/input[number]`. Simplest CRUD -- no special features. |
| W18b | Exclusion Criteria Tab | config/system-config.md B | `system-config.pen` | Low | Tab 2. Grid: 4 columns (id, title, description, priority). Drawer: title `@shadcn/input` `*`, description `@shadcn/textarea` (4 rows), priority `@shadcn/input[number]`. Note: `title` is `mandatory`. |
| W18c | Support Category Tab | config/system-config.md D | `system-config.pen` | Medium | Tab 3. Grid: 5 columns (id, category, title, queue, subcategories). Drawer: category `@shadcn/input` (col-3), title `@shadcn/input` (col-5), queue `@shadcn/input` (col-4) `[HARDCODED: "Queue"]`. Below: sortable subcategories list -- drag-sortable `<ul>` of `@shadcn/input` items with drag handle (grip icon) and delete button per item, plus "Add" button. Uses `dnd-kit` for drag-and-drop reordering. Label: `i18n.themes` `[HARDCODED: different from field name]`. |
| W18d | Login Notification Tab | config/system-config.md I | `system-config.pen` | Medium | Tab 4. Grid: 5 columns (id, content, dateFrom `Formatter.dateTime`, dateTo `Formatter.dateTime`, active `Formatter.bool`). Has filter panel + quick filter. Drawer: id `[RO]`, dateFrom `@shadcn/input[date]`, dateTo `@shadcn/input[date]`, active `@shadcn/switch`, content `@shadcn/textarea` with `[markdown]` CSS class `markdownedit` (height `50vh`). |
| W19 | Export Template Tab | data-dictionary-system.md 4.1 | `templates-files.pen` | Medium | Tab 1 of `@shadcn/tabs`. Grid: 5 columns (id, name, description, type, active). Drawer: name `@shadcn/input` `*`, type `@shadcn/select` `*` (ExportTemplateType enum), prio `@shadcn/input[number]`, active `@shadcn/switch`, filename `@shadcn/input`, description `@shadcn/textarea`, file upload `@shadcn/input[file]` `[cond: data.id]` -- only visible when editing existing record. |
| W19b | Notification Template Tab | data-dictionary-system.md 4.2 | `templates-files.pen` | Medium | Tab 2. Grid: 5 columns (id, event, subject, message). **No Add button** -- edit/delete only (templates are system-seeded). Drawer: subject `@shadcn/input`, event `@shadcn/select` (NotificationEvent enum), message `@shadcn/textarea` (40 rows) with live markdown preview panel beside it. |
| W19c | User File Tab | data-dictionary-system.md 4.4 | `templates-files.pen` | Medium | Tab 3. Grid: 10 columns (id, data, type, foreignId, parentId, date, dateVerified, verifiedBy, active, ownerId). Quick filter + Action button in toolbar. Drawer: 10 fields -- data `@shadcn/combobox` `[autocomplete: FileEntryService]`, type `@shadcn/select` (UserFileType enum, ~10 values), foreignId `@shadcn/input[number]`, parentId `@shadcn/input[number]`, date `@shadcn/input[date]`, dateVerified `@shadcn/input[date]`, verifiedBy `@shadcn/input[number]`, active `@shadcn/switch`, ownerId `@shadcn/input[number]`, id `[RO]`. |

**Total wireframes**: 14 frames across 4 `.pen` files

---

## Wireframe File Layout

### File 1: `specs/wireframes/system/admin/motd-template.pen`

| Frame | Content |
|:---|:---|
| `motd-list` | Full-page grid (1440px) with 7 columns + CRUD toolbar |
| `motd-detail` | Right drawer (1100px) with 20 fields in 4 sections |
| `motd-preview` | Preview dialog (600px) with priority-colored card |
| `template-editor` | Two-column markdown editor/preview layout |

### File 2: `specs/wireframes/system/cdr/cdr-call.pen`

| Frame | Content |
|:---|:---|
| `cdr-call-list` | Full-page grid (1440px) with 16 columns + date filter toolbar + action buttons |
| `cdr-call-detail` | Right drawer with 24 fields in 4 sections |
| `cdr-export-job` | Job polling dialog (600px) |
| `cdr-assignment-list` | Grid with 11 columns + Assign button |
| `cdr-assignment-detail` | Right drawer with 10 fields |

### File 3: `specs/wireframes/system/config/system-config.pen`

| Frame | Content |
|:---|:---|
| `config-tabs` | Full-page (1440px) with `@shadcn/tabs` (4 tabs) |
| `location-type-grid` | Tab 1 grid (4 cols) |
| `location-type-detail` | Tab 1 drawer (3 editable fields) |
| `exclusion-criteria-grid` | Tab 2 grid (4 cols) |
| `exclusion-criteria-detail` | Tab 2 drawer (3 fields, title mandatory) |
| `support-category-grid` | Tab 3 grid (5 cols) |
| `support-category-detail` | Tab 3 drawer (3 fields + sortable subcategories list) |
| `login-notification-grid` | Tab 4 grid (5 cols) with filter panel + quick filter |
| `login-notification-detail` | Tab 4 drawer (5 fields, markdown content at 50vh) |

### File 4: `specs/wireframes/system/templates/templates-files.pen`

| Frame | Content |
|:---|:---|
| `templates-tabs` | Full-page (1440px) with `@shadcn/tabs` (3 tabs) |
| `export-template-grid` | Tab 1 grid (5 cols) |
| `export-template-detail` | Tab 1 drawer (7 fields, file upload conditional) |
| `notification-template-grid` | Tab 2 grid (5 cols, no Add button) |
| `notification-template-detail` | Tab 2 drawer (3 fields, message with markdown preview) |
| `user-file-grid` | Tab 3 grid (10 cols) with quick filter + action |
| `user-file-detail` | Tab 3 drawer (10 fields) |

---

## Annotation Legend

> **Note**: Annotations are documented here for reference. Do NOT embed this legend inside `.pen` files. Instead, embed it in `specs/wireframes/system/workflows.md`.

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key -- string is hard-coded in legacy |
| `[cond: expr]` | Conditional visibility (e.g., `[cond: data.id]` = only on existing records) |
| `[async: poll Xms]` | Polling/async loading state |
| `[markdown]` | Field uses markdown editing/rendering |
| `[autocomplete: Service.method]` | Autocomplete data source |
| `[repeats]` | Collection row template |
| `[sortable]` | Drag-sortable list |
| `data.field.path` | Data model binding |
| `@shadcn/component` | Target Shadcn UI component |

---

## Enum Reference

### CdrStatus (7 values)

| Value | Color | Description |
|:---|:---|:---|
| `INVALID_UNKNOWN` | `$--muted` (gray) | Unknown/invalid status |
| `DIRECT` | `#22C55E` (green) | Direct call |
| `FORWARDED` | `#3B82F6` (blue) | Forwarded call |
| `FROM_TRANSFER` | `#8B5CF6` (violet) | Transferred from |
| `TO_TRANSFER` | `#A855F7` (purple) | Transferred to |
| `FROM_FORWARD` | `#06B6D4` (cyan) | Forwarded from |
| `TO_FORWARD` | `#0EA5E9` (sky) | Forwarded to |

### Priority (4 values -- MOTD)

| Value | Color |
|:---|:---|
| `LOW` | `$--muted` (gray) |
| `NORMAL` | `#3B82F6` (blue) |
| `HIGH` | `#F59E0B` (amber) |
| `URGENT` | `$--destructive` (red) |

### ImagePos (5 values -- MOTD)

| Value | Layout behavior |
|:---|:---|
| *(none/default)* | No image displayed |
| `LEFT` | Image floated left of message |
| `TOP` | Image above message |
| `BOTTOM` | Image below message |
| `BACK` | Image as background with overlay text |

### ExportTemplateType

Referenced as `enum:ExportTemplateType` in data dictionary. Exact values TBD from service definition.

### NotificationEvent

Referenced as `enum:NotificationEvent` in data dictionary. Exact values TBD from service definition.

### UserFileType (~10 values)

Referenced as `enum:UserFileType` in data dictionary. Exact values TBD from service definition.

---

## Execution Steps

### Phase 1: Setup (once per batch)

1. **Get guidelines**: `pencil_get_guidelines(category="guide", name="web-app")`
2. **List registry**: `Shadcn_list_items_in_registries(["@shadcn"])` -- enumerate available components
3. **Review reference wireframes**: Study existing system wireframes for consistency:
   - `specs/wireframes/system/admin/sysconfig-basis-web.pen` -- tab-based admin layout
   - `specs/wireframes/system/notification/notification-list.pen` -- list + drawer pattern
   - `specs/wireframes/system/dashboard/login-notification.pen` -- notification modal

### Phase 2: Module 1 -- MOTD & Template Editor (`motd-template.pen`)

**Step 2.1**: Read analysis documents:
- `data-dictionary-system.md` Section 3.1 (MOTD) and Section 1.3 (Template Editor)
- `admin-cruds/04-motd-template.md` (if available)

**Step 2.2**: Create `specs/wireframes/system/admin/motd-template.pen`:
```
pencil_open_document("specs/wireframes/system/admin/motd-template.pen")
```

**Step 2.3**: Design W15 -- MOTD List + Detail:
- **List frame** (1440px): CRUD toolbar (Add, Edit, Delete buttons) + DataTable with 7 columns
  - Columns: id (80px), subject (200px), dateStart (120px, `Formatter.date`), enabled (80px, `Formatter.bool`), sort (60px), priority (100px), dateCreated (120px, `Formatter.date`)
- **Detail drawer** (1100px, side="right"): 4 sections
  - Section 1 "Basic Info": subject `@shadcn/input`, enabled `@shadcn/switch`, priority `@shadcn/select` [LOW/NORMAL/HIGH/URGENT]
  - Section 2 "Schedule": startDate + startTime (row), endDate + endTime (row)
  - Section 3 "Visibility": 6 role switches in 2x3 grid (NEW, EXPERT, ADMIN_INTERN, ADMIN, CUSTOMER, ADMIN_CUSTOMER)
  - Section 4 "Content": message `@shadcn/textarea` `[markdown]`, link `@shadcn/input`, sort `@shadcn/input[number]`, width `@shadcn/input[number]` (1-12), imagePos `@shadcn/select` [LEFT/TOP/BOTTOM/BACK], file upload

**Step 2.4**: Design W15b -- MOTD Preview Dialog:
- Dialog (600px): priority-colored top bar, subject title, rendered message body (markdown), image placeholder with position annotation, link button

**Step 2.5**: Design W15c -- Template Editor:
- Two-column layout: left `@shadcn/textarea` (raw markdown), right rendered preview `[RO]`, toolbar above with Save button

**Step 2.6**: Validate + Export:
```
pencil_get_screenshot(nodeId="motd-list")
pencil_get_screenshot(nodeId="motd-detail")
pencil_get_screenshot(nodeId="motd-preview")
pencil_get_screenshot(nodeId="template-editor")
pencil_export_nodes(outputDir="specs/wireframes/system/admin/", nodeIds=[...], format="png")
```

### Phase 3: Module 2 -- CDR Call & Assignment (`cdr-call.pen`)

**Step 3.1**: Read analysis documents:
- `data-dictionary-system.md` Section 2.1 (CDR Call) and Section 2.2 (CDR Assignment)

**Step 3.2**: Create `specs/wireframes/system/cdr/cdr-call.pen`:
```
pencil_open_document("specs/wireframes/system/cdr/cdr-call.pen")
```

**Step 3.3**: Design W16 -- CDR Call List + Detail:
- **Filter toolbar**: Year `@shadcn/select`, Month `@shadcn/select`, Day `@shadcn/select` inline
- **Action toolbar**: Export XLS `@shadcn/button`, Export CSV `@shadcn/button`, Reset Calls `@shadcn/button` (destructive), Upload CSV `@shadcn/button`, Analyze Open `@shadcn/button`
- **List frame** (1440px): DataTable with 16 columns
  - id (60px), type `@shadcn/badge` (100px), user (120px), location (120px), dateStart (120px), dateConnect (120px), dateDisconnect (120px), duration (80px), callingNumber (120px), calledNumber (120px), callingUser (100px), finalUserId (100px), finalNumber (100px), conversationId (100px), assignmentId (80px), pkId (60px)
- **Detail drawer** (4 collapsible sections):
  - Section 1 "Call Info" (6 fields): id `[RO]`, type `[RO]`, dateStart, dateConnect, dateDisconnect, duration
  - Section 2 "Parties" (8 fields): callingNumber, calledNumber, callingUser, callingUri, finalUserId, finalNumber, originalNumber, originalCalledUri
  - Section 3 "Technical" (9 fields): lastRedirect, joinOnBehalf, destConversationId, destDevice, origDevice, video `@shadcn/checkbox`, controllerInfo, huntPilot, destCause
  - Section 4 "Routing" (3 fields): conversationId, assignmentId, pkId

**Step 3.4**: Design W16b -- CDR Export Job Dialog:
- Dialog (600px): spinner/progress indicator, status text, `[async: poll 2000ms]` annotation, Cancel button

**Step 3.5**: Design W17 -- CDR Assignment List + Detail:
- **List frame**: DataTable with 11 columns
  - id (60px), confidence (80px), start (120px), until (120px), duration (80px), user (120px), locationId (80px), location (120px), appointmentId (100px), consultationId (100px), conferenceId `[RO]` (100px)
- **Action toolbar**: Assign button
- **Detail drawer** (10 fields): id `[RO]`, confidence, start, until, duration, user `@shadcn/combobox` `[autocomplete: UserInfoService.autocomplete]`, locationId, location, appointmentId, consultationId

**Step 3.6**: Validate + Export

### Phase 4: Module 3 -- System Config CRUDs (`system-config.pen`)

**Step 4.1**: Read analysis: `config/system-config.md` (all 4 sections A, B, D, I)

**Step 4.2**: Create `specs/wireframes/system/config/system-config.pen`:
```
pencil_open_document("specs/wireframes/system/config/system-config.pen")
```

**Step 4.3**: Design tab shell:
- Full-page (1440px) with `@shadcn/tabs` header showing 4 tabs: Location Type, Exclusion Criteria, Support Category, Login Notification

**Step 4.4**: Design W18 -- Location Type (Tab 1):
- Grid: 4 cols (id 80px, name 80px, description 80px, prio 80px)
- Drawer: id `[RO]`, name `@shadcn/input`, description `@shadcn/input`, prio `@shadcn/input[number]`
- No special features. Annotate: "Simplest possible CRUD"

**Step 4.5**: Design W18b -- Exclusion Criteria (Tab 2):
- Grid: 4 cols (id 50px, title 80px, description 300px, priority 50px)
- Drawer: title `@shadcn/input` `*` (mandatory), description `@shadcn/textarea` (4 rows), priority `@shadcn/input[number]`

**Step 4.6**: Design W18c -- Support Category (Tab 3):
- Grid: 5 cols (id 80px, category 80px, title 80px, queue 80px, subcategories 80px)
- Drawer: category `@shadcn/input`, title `@shadcn/input`, queue `@shadcn/input` `[HARDCODED: "Queue"]`
- Sortable subcategories list below: label "Themes" `[HARDCODED: label != field name]`, drag-sortable `<ul>` with `dnd-kit`, each item = `@shadcn/input` + grip handle + delete `@shadcn/button`, "Add" button at bottom

**Step 4.7**: Design W18d -- Login Notification (Tab 4):
- Grid: 5 cols (id 80px, content 150px, dateFrom 120px `Formatter.dateTime`, dateTo 120px `Formatter.dateTime`, active 80px `Formatter.bool`)
- Filter panel (enabled) + quick filter `@shadcn/input` with search icon
- Drawer: id `[RO]`, dateFrom `@shadcn/input[date]`, dateTo `@shadcn/input[date]`, active `@shadcn/switch`, content `@shadcn/textarea` `[markdown]` (height 50vh)

**Step 4.8**: Validate + Export

### Phase 5: Module 4 -- Templates & Files (`templates-files.pen`)

**Step 5.1**: Read analysis: `data-dictionary-system.md` Sections 4.1, 4.2, 4.4

**Step 5.2**: Create `specs/wireframes/system/templates/templates-files.pen`:
```
pencil_open_document("specs/wireframes/system/templates/templates-files.pen")
```

**Step 5.3**: Design tab shell:
- Full-page (1440px) with `@shadcn/tabs` header: Export Template, Notification Template, User File

**Step 5.4**: Design W19 -- Export Template (Tab 1):
- Grid: 5 cols (id, name, description, type, active)
- Drawer: name `@shadcn/input` `*`, type `@shadcn/select` `*` (ExportTemplateType), prio `@shadcn/input[number]`, active `@shadcn/switch`, filename `@shadcn/input`, description `@shadcn/textarea`, file upload `@shadcn/input[file]` `[cond: data.id]`

**Step 5.5**: Design W19b -- Notification Template (Tab 2):
- Grid: 5 cols (id, event, subject, message). **No Add button** in toolbar -- annotate "edit/delete only"
- Drawer: subject `@shadcn/input`, event `@shadcn/select` (NotificationEvent), message `@shadcn/textarea` (40 rows) with live markdown preview panel (side-by-side within drawer)

**Step 5.6**: Design W19c -- User File (Tab 3):
- Grid: 10 cols (id, data, type, foreignId, parentId, date, dateVerified, verifiedBy, active, ownerId)
- Quick filter `@shadcn/input` + Action `@shadcn/button` in toolbar
- Drawer: data `@shadcn/combobox` `[autocomplete: FileEntryService]`, type `@shadcn/select` (UserFileType ~10 values), foreignId, parentId, date, dateVerified, verifiedBy, active `@shadcn/switch`, ownerId, id `[RO]`

**Step 5.7**: Validate + Export

### Phase 6: Documentation

1. **Embed screenshots** in `specs/wireframes/system/workflows.md`:
   - Add new sections for MOTD, CDR, Config, Templates
   - Include annotation legend (from this plan)
2. **Update wireframe registry** `specs/analysis/wireframe-plan-registry.md`:
   - Add rows for system/admin-cruds, system/cdr-call, system/config, system/templates-files
3. **Update README** `specs/analysis/system/README.md`:
   - Add wireframe plan reference for each subdomain

---

## Dependency Notes

### MOTD -- Dashboard Integration
- MOTD cards are rendered on the main dashboard (`dashboard/01-dashboard-main.md`). The preview dialog (W15b) should match the dashboard card rendering to ensure visual consistency.
- The priority enum maps to Bootstrap alert variants in legacy: LOW=info, NORMAL=success, HIGH=warning, URGENT=danger. Map these to Shadcn alert color tokens.

### CDR Call -- Appointment Support Integration
- CDR Call data feeds into the appointment support workflow (`planning/appointment-support/`). The assignment grid (W17) links to appointments and consultations via foreign keys.
- The "Analyze Open" action cross-references open calls with unassigned appointment slots.

### System Config -- Cross-Module Usage
- **Location Type** is referenced by Location entities throughout the planning and customer modules.
- **Exclusion Criteria** are attached to consultations in the treatment module.
- **Support Category** feeds the support ticket system (academy module).
- **Login Notification** is displayed as a modal on user login (see `system/dashboard/login-notification.pen` -- already wireframed in earlier batch).

### Templates & Files -- System-Wide
- **Export Templates** define the format for XLS/CSV exports across all modules (invoices, CDR calls, etc.).
- **Notification Templates** are system-seeded and define message formats for automated notifications.
- **User Files** are generic file attachments linked to users via `ownerId` and to other entities via `foreignId` + `parentId`.

---

## Hardcoded Strings Inventory

| Module | String | Location | i18n Key Needed |
|:---|:---|:---|:---|
| Location Type | `"prio"` | Grid column name + placeholder | `label.prio` |
| Support Category | `"Queue"` | Input group text label | `label.queue` |
| Support Category | `"id"` | Grid column name | `label.id` |
| Support Category | `i18n.themes` label | Collection header (field is `subcategories`) | `label.subcategories` |

---

## Shared Patterns

All 4 modules follow the `Core.initCrud` + `slickerGrid` boilerplate:
- Grid: fullscreen `slickerGrid` with `getAll` list method, `UserService.saveSetting` for column persistence
- Toolbar: Add, Edit (disabled until selection), Delete (disabled until selection), Action (disabled until selection)
- Data limit: 100 records per page
- Detail panel: off-canvas side panel with form fields
- Filter panel: disabled by default; enabled only for Login Notification

This maps cleanly to the established DataTable + Drawer pattern used in all previous batches.

---

## Wireframe Count Summary

| `.pen` File | Frames | Wireframe IDs |
|:---|:---|:---|
| `motd-template.pen` | 4 | W15, W15b, W15c |
| `cdr-call.pen` | 5 | W16, W16b, W17 |
| `system-config.pen` | 9 | W18, W18b, W18c, W18d |
| `templates-files.pen` | 7 | W19, W19b, W19c |
| **Total** | **25 frames** | **14 wireframe IDs** |
