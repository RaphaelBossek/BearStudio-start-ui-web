---
title: 'Wireframe Plan Batch13'
---

# Wireframe Plan — User Management & Extras (Batch 13 + Batch 14)

> **Batch 13**: Admin User Management, TOTP Security, Group Management, Skill Management, Onboarding Flow
> **Batch 14** (partial): User Video History, Work Hour Templates
> **Target directory**: `specs/wireframes/user-management/` (Batch 13), `specs/wireframes/orphan/` (W31), `specs/wireframes/system-admin/` (W32)
> **Analysis sources**: `specs/analysis/staff/user-management.md`, `specs/analysis/user-management/admin-user/totp-onboarding.md`, `specs/analysis/user-management/admin-group/group-management.md`, `specs/analysis/administration/skill.md`, `specs/analysis/staff/onboarding-flow.md`, `specs/analysis/orphan/user-video-history.md`, `specs/analysis/system-admin/workhour.md`, `specs/analysis/user-management/data-dictionary-user-management.md`

## Prerequisites

1. Analysis documents reviewed:
   - [`staff/user-management.md`](../../staff/user-management.md) -- Admin User Management grid, detail panel, QuickFilter, dialogs
   - [`admin-user/totp-onboarding.md`](./admin-user/totp-onboarding.md) -- TOTP 2FA onboarding: 3 states, QR code, 6-digit input
   - [`admin-group/group-management.md`](./admin-group/group-management.md) -- Group tree + detail panel + rights multiselect
   - [`administration/skill.md`](../administration/skill.md) -- Skill CRUD: grid + detail dialog
   - [`staff/onboarding-flow.md`](../staff/onboarding-flow.md) -- Onboarding resource/row grid + dialog with steps table
   - [`orphan/user-video-history.md`](../orphan/user-video-history.md) -- User Video History CRUD + video player dialog
   - [`system-admin/workhour.md`](../system-admin/workhour.md) -- Work Hour Templates CRUD (simplest module)
   - [`data-dictionary-user-management.md`](./data-dictionary-user-management.md) -- Sections 12-16
2. Data dictionary: [`data-dictionary-user-management.md`](./data-dictionary-user-management.md)
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
| Large Dialog | 800-1000px width | Complex dialogs (Group Management, Onboarding) |
| Drawer | 1100px width | Detail drawers for complex forms |
| Full page | 1440px width | Grid/list page frames |
| Input | cornerRadius 8 | padding 10,14; `$--input-border` stroke |
| Alert | cornerRadius 8 | padding 16; contextual fill colors |

---

## Shadcn UI Component Mapping

### Module 1: Admin User Management (W26)

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen) | `@shadcn/table` (DataTable) | 9 columns; `UserService.saveSetting` for grid persistence |
| QuickFilter (A-Z bar) | `@shadcn/toggle-group` | 26 letter buttons + `#` + free text `@shadcn/input`; targets `username` field |
| Site search (`#siteSearch`) | `@shadcn/input` with search icon | Client-side filter on firstName, lastName |
| Side detail panel | `@shadcn/sheet` (side="right") or `@shadcn/resizable-panel` | 15+ fields across profile sections |
| Username input | `@shadcn/input` | `data.username` `*` |
| Role select | `@shadcn/select` | 7 values: REGISTERED, STANDARD, KUNDE, ADMIN_KUNDE, LEITER_INTERN, ADMIN_INTERN, ADMIN |
| Employee State select | `@shadcn/select` | UNCONFIRMED, ACTIVE, SICK, HOLIDAY, INACTIVE |
| Groups collection | `@shadcn/combobox` + `@shadcn/badge` | `GroupService.getAll`; collection insert pattern |
| Customers collection | `@shadcn/combobox` + `@shadcn/badge` | `CustomerService.autocomplete`; collection insert pattern |
| Locked switch | `@shadcn/switch` | `data.accountLocked` |
| 2FA date display | `@shadcn/badge` / text | `data.dateTwoFactor` `[RO]`; reset button adjacent |
| Enabled column | `@shadcn/badge` | `Formatter.bool` |
| Locked column | `@shadcn/badge` | `Formatter.boolStop` |
| Send Password dialog | `@shadcn/dialog` | Confirmation dialog; calls `UserService.sendPassword` |
| Change Password dialog | `@shadcn/dialog` | 2 fields: new password `@shadcn/input[password]`, confirm password `@shadcn/input[password]` |
| API Key Management dialog | `@shadcn/dialog` | Collection of API keys: key `[RO]`, IP whitelist `@shadcn/input`, active `@shadcn/switch`, lastUsed `[RO]` |

### Module 2: TOTP Security (W27)

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| Security page wrapper | `@shadcn/card` | 600px width; 3 conditional states |
| No Token state | `@shadcn/alert` + `@shadcn/button` | Info text + "Start Setup" button |
| QR Code display | `<img>` in `@shadcn/card` | Server-rendered QR from `UserService.showToken` |
| Secret display | `@shadcn/card` (muted bg) | Secret text + Algorithm: SHA1, Digits: 6, Interval: 30 |
| 6-digit code input | `@shadcn/input-otp` | 6 digits, 3-dash-3 grouping, auto-advance, paste handling |
| Device info (Active state) | Description list / `@shadcn/card` | Agent, IP, Activated date, Last Used date |
| Test button | `@shadcn/button` | Calls `UserService.checkTotp` |
| Delete 2nd Factor button | `@shadcn/button` (destructive) | Calls `UserService.resetTotp` via confirmation |
| Generate New Secret | `@shadcn/button` (outline) | Calls `UserService.registerDevice` |
| Success alert | `@shadcn/alert` (success variant) | "Code successfully verified!" |
| Error feedback | `@shadcn/alert` (destructive variant) | Replaces legacy `alert()` |

### Module 3: Group Management (W28)

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| Page container (800px dialog) | `@shadcn/dialog` (800px) | Two-panel layout inside dialog |
| Left tree panel (250px) | `@shadcn/collapsible` / custom tree | Roles as parent nodes, groups as children; `@shadcn/scroll-area` |
| Role node (parent) | `@shadcn/collapsible-trigger` + icon | `fa-object-group` icon; click populates detail |
| Group node (child) | `@shadcn/collapsible-content` item | `fa-group` icon; click fills form + enables delete |
| Detail card (500px) | `@shadcn/card` | Header "Details"; contains form |
| Name input | `@shadcn/input` `*` | `data.name` mandatory |
| Description textarea | `@shadcn/textarea` | `data.description` |
| Rights multiselect | `@shadcn/command` / multi-select | 150px height; `GroupService.getRights`; shows `{name} ({role})` per option |
| Save button | `@shadcn/button` | Disabled until tree node selected |
| Delete button | `@shadcn/button` (destructive) | Disabled when role node selected; requires confirmation |

### Module 4: Skill Management (W29)

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen) | `@shadcn/table` (DataTable) | 5 columns |
| Detail dialog | `@shadcn/dialog` (600px) | 5 fields |
| Code input | `@shadcn/input` `*` | `data.code` mandatory |
| Type select | `@shadcn/select` | 4 options: MAIN, ADDITIONAL, EXTRA, LANGUAGE |
| Certified switch | `@shadcn/switch` | `data.certified` |
| Active switch | `@shadcn/switch` | `data.active` |
| Description input | `@shadcn/input` | `data.description` |
| Type badge (grid) | `@shadcn/badge` | Color-coded by SkillType |
| Bool columns (grid) | `@shadcn/badge` | `Formatter.bool` for certified + active |

### Module 5: Onboarding Flow (W30)

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| Resource/Row grid | `@shadcn/table` (DataTable) | Dynamic columns from backend `data.resources[]`; cells contain checkmark items |
| Row search (`#siteSearch`) | `@shadcn/input` with search icon | Filters rows by `title` |
| Column filter (`#filterJob`) | `@shadcn/input` with filter icon | Filters columns by `name` |
| Onboarding dialog (1000px) | `@shadcn/dialog` (1000px) | Entity name + progress counter + steps table |
| Dialog header | Text + `@shadcn/progress` | `data.name` + `data.completed / data.total` |
| Steps table (collection) | `@shadcn/table` | Columns: step title/desc, dateStarted, dateEnd, dateCompleted, comment, file |
| Step title + description | Text display `[RO]` | Bold title + description below |
| Date inputs (x3) | `@shadcn/input` (type="date") or DatePicker | dateStarted, dateEnd, dateCompleted |
| Comment textarea | `@shadcn/textarea` | `data.steps.comment` |
| File upload | `@shadcn/input` (type="file") | `[cond: step.type == "SUBMIT" OR "SELFSUBMIT"]` |
| File download link | `@shadcn/button` (link variant) | Shows file name; triggers download |
| Export button | `@shadcn/button` | Opens new window with XLS download URL |
| View variant tabs | Not visible in UI | Same layout for EMPLOYEE, CUSTOMER, LOCATION -- differentiated by route/filter |

### Module 6: User Video History (W31 -- Batch 14)

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen) | `@shadcn/table` (DataTable) | 8 columns |
| Detail dialog | `@shadcn/dialog` (600px) | 5 fields |
| Video autocomplete | `@shadcn/combobox` | `VideoService.autocomplete` |
| Date inputs (x3) | `@shadcn/input` (type="date") or DatePicker | dateStart, dateLast, dateDone |
| Time watched input | `@shadcn/input` (type="number") | `data.timeWatched` |
| Watch Video button | `@shadcn/button` | Opens video player dialog |
| Video Player dialog | `@shadcn/dialog` (800px) | Video.js player embedded; out of wireframe scope (implementation-level) |

### Module 7: Work Hour Templates (W32 -- Batch 14)

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| `slickerGrid` (fullscreen) | `@shadcn/table` (DataTable) | 4 columns; simplest CRUD |
| Detail dialog | `@shadcn/dialog` (600px) | 4 fields |
| Code input | `@shadcn/input` `*` | `data.code` mandatory |
| Hours input | `@shadcn/input` `*` | `data.hours` mandatory |
| Priority input | `@shadcn/input` (type="number") | `data.prio` |
| Description input | `@shadcn/input` | `data.description` |

---

## Wireframe Inventory

| ID | Wireframe | Analysis Source | Target `.pen` | Complexity | Description |
|:---|:---|:---|:---|:---|:---|
| W26 | Admin User Management List + Detail | staff/user-management.md, data-dictionary 12 | `user-management.pen` | High | Full-page (1440px) grid with 9 columns (id, username, email, firstName, lastName, dateTwoFactor, role `@shadcn/badge`, enabled `Formatter.bool`, accountLocked `Formatter.boolStop`). A-Z QuickFilter bar `@shadcn/toggle-group` targeting `username` + free text `@shadcn/input`. Site search `@shadcn/input`. Side detail panel (Sheet/ResizablePanel) with 15+ fields: username `@shadcn/input` `*`, role `@shadcn/select` (7 values), employeeState `@shadcn/select` (5 values), groups `@shadcn/combobox` + `@shadcn/badge` `[autocomplete: GroupService.getAll]`, customers `@shadcn/combobox` + `@shadcn/badge` `[autocomplete: CustomerService.autocomplete]`, accountLocked `@shadcn/switch`, dateTwoFactor `[RO]` + reset button, enabled `@shadcn/switch`. |
| W26b | Send Password Dialog | staff/user-management.md | `user-management.pen` | Low | Confirmation dialog (600px): "Send password to user?" message, Confirm + Cancel buttons. Calls `UserService.sendPassword(id)`. |
| W26c | Change Password Dialog | staff/user-management.md, data-dictionary 10 | `user-management.pen` | Low | Dialog (600px): new password `@shadcn/input[password]` `*`, confirm password `@shadcn/input[password]` `*`. Calls `UserService.changePassword`. No current-password field (admin context). |
| W26d | API Key Management Dialog | staff/user-management.md, data-dictionary 12 (API Key) | `user-management.pen` | Medium | Dialog (600px): collection of API keys displayed as rows. Per key: key `[RO]` (auto-generated string), IP whitelist `@shadcn/input` (comma-separated), active `@shadcn/switch`, lastUsed `[RO]` `Formatter.dateTime`. Add Key button + Save/Cancel. Permission: `USERS_UPDATE` required. |
| W27 | TOTP Security (3 states) | admin-user/totp-onboarding.md, data-dictionary 13 | `totp-security.pen` | Medium | Card/dialog (600px) with 3 conditional states: (1) **No Token**: info text + "Start Setup" `@shadcn/button`; (2) **Pending**: QR code `<img>`, secret display (secret + SHA1/6/30 params), 6-digit `@shadcn/input-otp` (3-dash-3), "Generate New Secret" `@shadcn/button`, instruction text; (3) **Active**: device info (agent, IP, activated `Formatter.dateTime`, lastUsed `Formatter.dateTime`), 6-digit `@shadcn/input-otp` for testing, "Test" `@shadcn/button`, "Delete 2nd Factor" `@shadcn/button` (destructive). Feedback: success `@shadcn/alert` / error `@shadcn/alert`. |
| W28 | Group Management | admin-group/group-management.md, data-dictionary 14 | `group-management.pen` | Medium | Dialog (800px) with two-panel layout: **Left panel** (250px): tree structure with roles as parent nodes (`@shadcn/collapsible`), groups as children, all expanded by default, `@shadcn/scroll-area`. **Right panel** (500px): `@shadcn/card` "Details" with name `@shadcn/input` `*`, description `@shadcn/textarea`, rights `@shadcn/command` multi-select (150px height, sorted alphabetically, displays `{name} ({role})`, title shows description). Save `@shadcn/button` (disabled until node selected), Delete `@shadcn/button` (destructive, disabled when role node selected). |
| W29 | Skill Management List + Detail | administration/skill.md, data-dictionary 15 | `skill.pen` | Low | Full-page (1440px) grid with 5 columns (id 50px, code 300px, type 100px `@shadcn/badge` `i18n.skillType`, certified 100px `Formatter.bool`, active 50px `Formatter.bool`). CRUD toolbar: Add, Edit (disabled), Delete (disabled). Detail dialog (600px) with 5 fields: code `@shadcn/input` `*` (col-12), type `@shadcn/select` `*` [MAIN/ADDITIONAL/EXTRA/LANGUAGE] (col-6) + certified `@shadcn/switch` (col-3) + active `@shadcn/switch` (col-3), description `@shadcn/input` (col-12). |
| W30 | Onboarding Flow List | staff/onboarding-flow.md, data-dictionary 16 | `onboarding-flow.pen` | High | Full-page (1440px) dynamic resource/row grid: column 0 = row title (entity name, clickable), columns 1..N = resources from backend with colored headers (`res.color`, `res.name`), cells contain checkmark items (`fa-check`). Toolbar: Reload, Edit (disabled), Export. Two filter inputs: row search `@shadcn/input`, column filter `@shadcn/input`. Annotation: 3 view variants (Employee/Customer/Location) share identical layout, differ by assignment type filter. |
| W30b | Onboarding Dialog | staff/onboarding-flow.md, data-dictionary 16 | `onboarding-flow.pen` | High | Dialog (1000px): Header shows entity name (`data.name`) + progress counter (`data.completed / data.total`). Body: steps table (collection) with columns: (1) Step `[RO]` -- bold `step.title` + `step.description` below; (2) Date Started `@shadcn/input[date]`; (3) Date End `@shadcn/input[date]`; (4) Completed `@shadcn/input[date]`; (5) Comment `@shadcn/textarea`; (6) File `@shadcn/input[file]` `[cond: step.type == "SUBMIT" OR "SELFSUBMIT"]` + download link. Save/Cancel footer. |
| W31 | User Video History List + Detail | orphan/user-video-history.md | `user-video-history.pen` | Low | Full-page (1440px) grid with 8 columns (id 80px, user 150px `Formatter.name`, video 200px `Formatter.name`, dateStart 120px `Formatter.dateTime`, dateLast 120px `Formatter.dateTime`, timeWatched 120px, dateDone 120px `Formatter.dateTime`, sessions 80px `Formatter.count`). CRUD toolbar: Add, Edit (disabled), Delete (disabled), Watch Video (disabled). Detail dialog (600px) with 5 fields: video `@shadcn/combobox` `[autocomplete: VideoService.autocomplete]`, dateStart `@shadcn/input[date]`, dateLast `@shadcn/input[date]`, timeWatched `@shadcn/input[number]`, dateDone `@shadcn/input[date]`. |
| W32 | Work Hour Templates List + Detail | system-admin/workhour.md | `workhour.pen` | Low | Full-page (1440px) grid with 4 columns (id 100px `Formatter.id`, code 80px, description 200px, hours 200px). CRUD toolbar: Add, Edit (disabled), Delete (disabled). Detail dialog (600px) with 4 fields: code `@shadcn/input` `*` (col-3), hours `@shadcn/input` `*` (col-3), prio `@shadcn/input[number]` (col-3), description `@shadcn/input` (col-9 on row 2). Simplest CRUD in the codebase -- no special features. |

**Total wireframes**: 12 wireframe IDs across 6 `.pen` files

---

## Wireframe File Layout

### File 1: `specs/wireframes/user-management/admin-user/user-management.pen`

| Frame | Content |
|:---|:---|
| `user-mgmt-list` | Full-page grid (1440px) with 9 columns + A-Z QuickFilter bar + search |
| `user-mgmt-detail` | Side detail panel with 15+ fields (username, role, state, groups, customers, locked, 2FA, enabled) |
| `user-mgmt-send-password` | Confirmation dialog (600px) |
| `user-mgmt-change-password` | Password dialog (600px) with 2 password fields |
| `user-mgmt-api-keys` | API Key management dialog (600px) with key collection |

### File 2: `specs/wireframes/user-management/admin-user/totp-security.pen`

| Frame | Content |
|:---|:---|
| `totp-no-token` | Card (600px) -- No Token state: info text + Start button |
| `totp-pending` | Card (600px) -- Pending state: QR code + secret + 6-digit OTP input |
| `totp-active` | Card (600px) -- Active state: device info + test input + reset button |

### File 3: `specs/wireframes/user-management/admin-group/group-management.pen`

| Frame | Content |
|:---|:---|
| `group-mgmt-dialog` | Dialog (800px) with left tree panel (250px) + right detail card (500px) |

### File 4: `specs/wireframes/user-management/admin-skill/skill.pen`

| Frame | Content |
|:---|:---|
| `skill-list` | Full-page grid (1440px) with 5 columns + CRUD toolbar |
| `skill-detail` | Detail dialog (600px) with 5 fields |

### File 5: `specs/wireframes/user-management/onboarding/onboarding-flow.pen`

| Frame | Content |
|:---|:---|
| `onboarding-grid` | Full-page (1440px) dynamic resource/row grid with colored column headers |
| `onboarding-dialog` | Onboarding dialog (1000px) with entity name, progress counter, steps table |

### File 6: `specs/wireframes/orphan/user-video-history.pen`

| Frame | Content |
|:---|:---|
| `video-history-list` | Full-page grid (1440px) with 8 columns + CRUD toolbar + Watch Video button |
| `video-history-detail` | Detail dialog (600px) with 5 fields |

### File 7: `specs/wireframes/system-admin/workhour.pen`

| Frame | Content |
|:---|:---|
| `workhour-list` | Full-page grid (1440px) with 4 columns + CRUD toolbar |
| `workhour-detail` | Detail dialog (600px) with 4 fields |

---

## Annotation Legend

> **Note**: Annotations are documented here for reference. Do NOT embed this legend inside `.pen` files. Instead, embed it in `specs/wireframes/user-management/workflows.md`.

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key -- string is hard-coded in legacy |
| `[cond: expr]` | Conditional visibility (e.g., `[cond: step.type == "SUBMIT"]`) |
| `[autocomplete: Service.method]` | Autocomplete data source |
| `[repeats]` | Collection row template |
| `[sortable]` | Drag-sortable list |
| `data.field.path` | Data model binding |
| `@shadcn/component` | Target Shadcn UI component |
| `Formatter.xxx` | Grid cell formatter from legacy (maps to badge/icon in Shadcn) |

---

## Enum Reference

### Role (7 values -- Admin User Management)

| Value | Description |
|:---|:---|
| `REGISTERED` | Registered user (basic) |
| `STANDARD` | Standard user |
| `KUNDE` | Customer |
| `ADMIN_KUNDE` | Customer admin |
| `LEITER_INTERN` | Internal lead |
| `ADMIN_INTERN` | Internal admin |
| `ADMIN` | Super admin |

### EmployeeState (5 values)

| Value | Color | Description |
|:---|:---|:---|
| `UNCONFIRMED` | `$--muted` (gray) | Pending confirmation |
| `ACTIVE` | `#22C55E` (green) | Active employee |
| `SICK` | `#F59E0B` (amber) | On sick leave |
| `HOLIDAY` | `#3B82F6` (blue) | On holiday |
| `INACTIVE` | `$--destructive` (red) | Inactive |

### SkillType (4 values)

| Value | Color | Description |
|:---|:---|:---|
| `MAIN` | `#171717` (primary) | Main skill/specialty |
| `ADDITIONAL` | `#3B82F6` (blue) | Additional qualification |
| `EXTRA` | `#8B5CF6` (violet) | Extra qualification |
| `LANGUAGE` | `#06B6D4` (cyan) | Language skill |

### OnboardingStepType (5 values)

| Value | File Upload | Description |
|:---|:---|:---|
| `SUBMIT` | Yes | Requires document submission |
| `CHECK` | No | Administrative check |
| `SELFCHECK` | No | Self-verification |
| `SELFSUBMIT` | Yes | Self-submitted document |
| `SELFVIDEO` | No | Self-recorded video |

### OnboardingAssignmentType (3 values)

| Value | Description |
|:---|:---|
| `EMPLOYEE` | Employee onboarding |
| `CUSTOMER` | Customer onboarding |
| `LOCATION` | Location onboarding |

---

## Execution Steps

### Phase 1: Setup (once per batch)

1. **Get guidelines**: `pencil_get_guidelines(category="guide", name="web-app")`
2. **List registry**: `Shadcn_list_items_in_registries(["@shadcn"])` -- enumerate available components
3. **Review reference wireframes**: Study existing user-management wireframes for consistency:
   - `specs/wireframes/user-management/profile/profile-form.pen` -- profile form pattern
   - `specs/wireframes/user-management/profile/profile-staff-list.pen` -- list + detail pattern
   - `specs/wireframes/user-management/profile/profile-password-dialog.pen` -- dialog pattern
   - `specs/wireframes/user-management/dashboard/user-stats.pen` -- dashboard dialog pattern

### Phase 2: Module 1 -- Admin User Management (`user-management.pen`)

**Step 2.1**: Read analysis documents:
- `staff/user-management.md` (full admin user management analysis)
- `data-dictionary-user-management.md` Section 12 (Admin User Management) + Section 10 (Password Dialogs)

**Step 2.2**: Create `specs/wireframes/user-management/admin-user/user-management.pen`:
```
pencil_open_document("specs/wireframes/user-management/admin-user/user-management.pen")
```

**Step 2.3**: Design W26 -- User Management List + Detail:
- **QuickFilter bar** (full width, above grid): `@shadcn/toggle-group` with 26 letter buttons (A-Z) + `#` button + free text `@shadcn/input`. Active letter highlighted with `$--primary`.
- **Search bar**: `@shadcn/input` with search icon, aligned right of toolbar
- **List frame** (1440px): CRUD toolbar (Add, Edit, Delete, separator, API Key, Send Password, Change Password) + DataTable with 9 columns:
  - id (80px, `Formatter.id`), username (300px), email (180px), firstName (80px), lastName (80px), dateTwoFactor (100px, `Formatter.dateTime`), role (100px, `Formatter.role` `@shadcn/badge`), enabled (30px, `Formatter.bool` icon), accountLocked (30px, `Formatter.boolStop` icon)
- **Detail panel** (Sheet side="right" or ResizablePanel): 15+ fields organized in groups:
  - Basic: username `@shadcn/input` `*`, email `@shadcn/input`, role `@shadcn/select` (7 values), employeeState `@shadcn/select` (5 values)
  - Security: accountLocked `@shadcn/switch`, dateTwoFactor `[RO]` display + reset button, enabled `@shadcn/switch`
  - Groups: `@shadcn/combobox` with tag badges for selected groups
  - Customers: `@shadcn/combobox` with tag badges for selected customers

**Step 2.4**: Design W26b -- Send Password Dialog:
- Dialog (600px): Warning icon, "Send password reset email to {username}?" message, Confirm (primary) + Cancel buttons

**Step 2.5**: Design W26c -- Change Password Dialog:
- Dialog (600px): New password `@shadcn/input[password]` `*`, Confirm password `@shadcn/input[password]` `*`, Save + Cancel

**Step 2.6**: Design W26d -- API Key Management Dialog:
- Dialog (600px): Title "API Keys". Collection rows:
  - Per row: Key `@shadcn/input` `[RO]` (truncated, copy button), IP Whitelist `@shadcn/input`, Active `@shadcn/switch`, Last Used `[RO]` `Formatter.dateTime`
  - Add Key button at bottom
  - Save/Cancel footer

**Step 2.7**: Validate + Export:
```
pencil_get_screenshot(nodeId="user-mgmt-list")
pencil_get_screenshot(nodeId="user-mgmt-detail")
pencil_get_screenshot(nodeId="user-mgmt-send-password")
pencil_get_screenshot(nodeId="user-mgmt-change-password")
pencil_get_screenshot(nodeId="user-mgmt-api-keys")
pencil_export_nodes(outputDir="specs/wireframes/user-management/admin-user/", nodeIds=[...], format="png")
```

### Phase 3: Module 2 -- TOTP Security (`totp-security.pen`)

**Step 3.1**: Read analysis: `admin-user/totp-onboarding.md` (all sections, especially state machine and code entry flow)

**Step 3.2**: Create `specs/wireframes/user-management/admin-user/totp-security.pen`:
```
pencil_open_document("specs/wireframes/user-management/admin-user/totp-security.pen")
```

**Step 3.3**: Design W27 -- TOTP Security (3 state frames):
- **Frame: totp-no-token** (600px Card):
  - Heading: "2-Factor Authentication"
  - `@shadcn/alert` (info): explanatory text about 2FA benefits
  - "Start Setup" `@shadcn/button` (primary, centered)

- **Frame: totp-pending** (600px Card):
  - Heading: "2-Factor Authentication" + subheading "Not yet activated"
  - Instruction text: "Scan the QR code with your Authenticator App"
  - QR code placeholder (200x200px centered)
  - Secret display block (muted background): Secret string, Algorithm: SHA1, Digits: 6, Interval: 30
  - "Authenticator App" link (opens recommendation info)
  - Instruction: "Enter a valid token to activate"
  - `@shadcn/input-otp` (6 digits, 3-dash-3 grouping)
  - "Generate New Secret" `@shadcn/button` (outline)

- **Frame: totp-active** (600px Card):
  - Heading: "2-Factor Authentication" + subheading "Active"
  - Device Information section: Agent `[RO]`, IP `[RO]`, Activated `[RO]` `Formatter.dateTime`, Last Used `[RO]` `Formatter.dateTime`
  - Instruction: "Test your token or remove it"
  - `@shadcn/input-otp` (6 digits, 3-dash-3 grouping)
  - Button row: "Test" `@shadcn/button` + "Delete 2nd Factor" `@shadcn/button` (destructive)

**Step 3.4**: Validate + Export

### Phase 4: Module 3 -- Group Management (`group-management.pen`)

**Step 4.1**: Read analysis: `admin-group/group-management.md` (tree structure, detail panel, rights multiselect)

**Step 4.2**: Create `specs/wireframes/user-management/admin-group/group-management.pen`:
```
pencil_open_document("specs/wireframes/user-management/admin-group/group-management.pen")
```

**Step 4.3**: Design W28 -- Group Management Dialog:
- **Dialog** (800px): Two-panel layout
- **Left panel** (250px, `@shadcn/scroll-area`):
  - Tree structure using `@shadcn/collapsible`:
    - Each role = collapsible parent node with `object-group` icon + role name (e.g., "ADMIN", "STANDARD")
    - Each group = child item with `group` icon + group name
    - All nodes expanded by default (`open: true`)
  - Clicking role node: enables Save, disables Delete, clears form
  - Clicking group node: enables Save + Delete, fills form with group data
- **Right panel** (500px, `@shadcn/card`):
  - Header: "Details"
  - Name `@shadcn/input` `*` (placeholder: "Name")
  - Description `@shadcn/textarea`
  - Rights label: "Right" (`i18n.group.right`)
  - Rights multiselect: `@shadcn/command` or native `<select multiple>` (150px height), populated from `GroupService.getRights`, sorted alphabetically, each option shows `{right.name} ({right.role})` with title=`{right.description}`
  - Button row: Save `@shadcn/button` (disabled initially) + Delete `@shadcn/button` (destructive, disabled initially)

**Step 4.4**: Validate + Export

### Phase 5: Module 4 -- Skill Management (`skill.pen`)

**Step 5.1**: Read analysis: `administration/skill.md` + `data-dictionary-user-management.md` Section 15

**Step 5.2**: Create `specs/wireframes/user-management/admin-skill/skill.pen`:
```
pencil_open_document("specs/wireframes/user-management/admin-skill/skill.pen")
```

**Step 5.3**: Design W29 -- Skill List + Detail:
- **List frame** (1440px): CRUD toolbar (Add, Edit disabled, Delete disabled) + DataTable with 5 columns:
  - id (50px, `Formatter.id`), code (300px), type (100px, `@shadcn/badge` `i18n.skillType` [4 colors]), certified (100px, `Formatter.bool`), active (50px, `Formatter.bool`)
- **Detail dialog** (600px):
  - Row 1: code `@shadcn/input` `*` (col-12)
  - Row 2: type `@shadcn/select` `*` [MAIN/ADDITIONAL/EXTRA/LANGUAGE] (col-6) + certified `@shadcn/switch` (col-3) + active `@shadcn/switch` (col-3)
  - Row 3: description `@shadcn/input` (col-12)
  - Save/Cancel footer

**Step 5.4**: Validate + Export

### Phase 6: Module 5 -- Onboarding Flow (`onboarding-flow.pen`)

**Step 6.1**: Read analysis: `staff/onboarding-flow.md` (grid structure, dialog, step types) + `data-dictionary-user-management.md` Section 16

**Step 6.2**: Create `specs/wireframes/user-management/onboarding/onboarding-flow.pen`:
```
pencil_open_document("specs/wireframes/user-management/onboarding/onboarding-flow.pen")
```

**Step 6.3**: Design W30 -- Onboarding Grid:
- **Full page** (1440px):
  - Toolbar: Reload `@shadcn/button`, Edit `@shadcn/button` (disabled), Export `@shadcn/button`
  - Filter row: Row search `@shadcn/input` (left), Column filter `@shadcn/input` (right)
  - Grid: Custom resource/row layout (annotated as `gridTable.js` pattern):
    - Column 0: Row header cell (entity name, clickable, `cursor: pointer`)
    - Columns 1..N: Resource columns with colored `<th>` headers (background from `res.color`, text from `res.name`)
    - Cells: centered checkmark icons (`fa-check`) for each item
  - Annotate: "3 variants (Employee/Customer/Location) -- same layout, different `assignmentType` filter"

**Step 6.4**: Design W30b -- Onboarding Dialog:
- **Dialog** (1000px):
  - Header row: Entity name `data.name` (left, col-6) + Progress `data.completed / data.total` (right, col-2)
  - Steps table (collection bound to `data.steps`):
    - Column 1 "Step": `step.title` (bold) + `step.description` (normal) below `[RO]`
    - Column 2 "Date": `dateStarted` `@shadcn/input[date]`
    - Column 3 "Date": `dateEnd` `@shadcn/input[date]`
    - Column 4 "Completed": `dateCompleted` `@shadcn/input[date]`
    - Column 5 "Comment": `comment` `@shadcn/textarea`
    - Column 6 "File": `@shadcn/input[file]` + download link `[cond: step.type == "SUBMIT" OR "SELFSUBMIT"]`
  - Save/Cancel footer

**Step 6.5**: Validate + Export

### Phase 7: Module 6 -- User Video History (`user-video-history.pen`) [Batch 14]

**Step 7.1**: Read analysis: `orphan/user-video-history.md`

**Step 7.2**: Create `specs/wireframes/orphan/user-video-history.pen`:
```
pencil_open_document("specs/wireframes/orphan/user-video-history.pen")
```

**Step 7.3**: Design W31 -- Video History List + Detail:
- **List frame** (1440px): CRUD toolbar (Add, Edit disabled, Delete disabled, Watch Video disabled) + DataTable with 8 columns:
  - id (80px), user (150px, `Formatter.name`), video (200px, `Formatter.name`), dateStart (120px, `Formatter.dateTime`), dateLast (120px, `Formatter.dateTime`), timeWatched (120px), dateDone (120px, `Formatter.dateTime`), sessions (80px, `Formatter.count`)
- **Detail dialog** (600px) with 5 fields:
  - video `@shadcn/combobox` `[autocomplete: VideoService.autocomplete]`
  - dateStart `@shadcn/input[date]`
  - dateLast `@shadcn/input[date]`
  - timeWatched `@shadcn/input[number]`
  - dateDone `@shadcn/input[date]`
  - Save/Cancel footer

**Step 7.4**: Validate + Export

### Phase 8: Module 7 -- Work Hour Templates (`workhour.pen`) [Batch 14]

**Step 8.1**: Read analysis: `system-admin/workhour.md`

**Step 8.2**: Create `specs/wireframes/system-admin/workhour.pen`:
```
pencil_open_document("specs/wireframes/system-admin/workhour.pen")
```

**Step 8.3**: Design W32 -- Work Hour List + Detail:
- **List frame** (1440px): CRUD toolbar (Add, Edit disabled, Delete disabled) + DataTable with 4 columns:
  - id (100px, `Formatter.id`), code (80px), description (200px), hours (200px)
- **Detail dialog** (600px):
  - Row 1: code `@shadcn/input` `*` (col-3) + hours `@shadcn/input` `*` (col-3) + prio `@shadcn/input[number]` (col-3)
  - Row 2: description `@shadcn/input` (col-9)
  - Save/Cancel footer
  - Annotate: "Simplest CRUD in the codebase"

**Step 8.4**: Validate + Export

### Phase 9: Documentation

1. **Embed screenshots** in `specs/wireframes/user-management/workflows.md`:
   - Add new sections for Admin User Management, TOTP Security, Group Management, Skill, Onboarding
   - Include annotation legend (from this plan)
2. **Update wireframe registry** `specs/analysis/wireframe-plan-registry.md`:
   - Add rows for user-management/admin-user, user-management/admin-group, user-management/admin-skill, user-management/onboarding, orphan/user-video-history, system-admin/workhour
3. **Update README** `specs/analysis/user-management/README.md`:
   - Add wireframe plan reference for Batch 13
4. **Cross-reference**: Link Batch 14 wireframes (W31, W32) from their respective domain READMEs

---

## Dependency Notes

### Admin User Management -- Profile Integration
- The admin user detail panel embeds a subset of the profile form fields (analyzed separately in `profile/profile-form.md`). The wireframe should reference but not duplicate the full profile form layout.
- QuickFilter on `username` field is unique to this module -- no other module uses A-Z filtering.
- API Key management requires `USERS_UPDATE` permission -- annotate the permission guard on the dialog trigger button.

### TOTP Security -- Login Flow Integration
- TOTP verification is also triggered during login (`login/totpCheck.html`). The admin TOTP security page (W27) manages device registration/testing, while the login flow consumes the registered device.
- The `UserService.checkTotp` return codes have distinct meanings: `< 0` = invalid, `=== 1` = valid but needs activation, `>= 0 (not 1)` = valid test. The UI must handle all three cases.

### Group Management -- Role System
- Groups are organized by `role` field in the tree. Each unique role value becomes a parent node.
- The rights multiselect shows all available rights from `GroupService.getRights`. Rights are cross-referenced by `role` in the display format `{name} ({role})`.
- Groups are used in Admin User Management (W26) as a collection insert field.

### Skill Management -- Profile Education Tab
- Skills defined here appear in the Profile Form Education tab (`data.employeeProfile.skills`) via `SkillService.autocomplete`.
- The `certified` flag determines whether a certification date and file upload are required when assigning the skill to a user.

### Onboarding Flow -- Multi-Module Embedding
- The onboarding dialog (`form.html`) is embedded in 4 different contexts: Employee list, Customer list, Location list, and Staff Profile.
- OnboardingStep admin (separate module, not in this batch) defines the step templates that populate the dialog's steps table.
- File upload is conditional on step type: only `SUBMIT` and `SELFSUBMIT` types show the upload control.

### User Video History -- Video System
- Depends on `VideoService.autocomplete` for video selection and `VideoService.get` for video playback.
- The Watch Video dialog with Video.js/PeerTube player is complex but is implementation-level detail, not wireframed (only the CRUD data dialog is wireframed).

### Work Hour Templates -- Simplest Module
- No cross-module dependencies. This is a standalone reference data CRUD.
- Used elsewhere in the planning domain for work-hour calculations.

---

## Hardcoded Strings Inventory

| Module | String | Location | i18n Key Needed |
|:---|:---|:---|:---|
| Admin User Management | `"2FA"` | Grid column header for `dateTwoFactor` | `user.twoFactor` |
| TOTP Security | `"2-Factor"` | Section heading | `security.twoFactor` |
| TOTP Security | `"Gerateinformationen"` | Device info subheading | `security.deviceInfo` |
| TOTP Security | `"Der 2. Faktor ist noch nicht aktiviert"` | Pending state subheading | `security.notActivated` |
| TOTP Security | `"Neues Secret Generieren"` | Button label | `security.generateNewSecret` |
| TOTP Security | `"Code erfolgreich uberpruft!"` | Success alert | `security.codeVerified` |
| TOTP Security | `"Der eingegeben code ist ungultig."` | Error alert (was browser `alert()`) | `security.codeInvalid` |
| TOTP Security | `"2. Faktor Loschen"` | Delete button label | `security.deleteSecondFactor` |
| TOTP Security | `"Test"` | Test button label | `security.test` |
| TOTP Security | `"Zwei-Faktor Apps"` | App recommendation modal title | `security.twoFactorApps` |
| Group Management | `"Details"` | Card header | `group.details` |
| Onboarding Flow | `"Export"` | Toolbar button | `action.export` |
| Onboarding Flow | `"Erfolgreich hochgeladen"` | File upload success alert | `onboarding.uploadSuccess` |
| User Video History | `"Watch Video"` | Dialog title | `userVideoHistory.watchVideo` |
| Work Hour Templates | `"Name"` | Filter label (field is `code`) | `filter.name` |

---

## Shared Patterns

All modules (except Group Management and Onboarding grid) follow the `Core.initCrud` + `slickerGrid` boilerplate:
- Grid: fullscreen `slickerGrid` with `getAll` list method, `UserService.saveSetting` for column persistence
- Toolbar: Add, Edit (disabled until selection), Delete (disabled until selection), additional action buttons (disabled until selection)
- Data limit: 100 records per page
- Detail panel: side panel (W26) or dialog (W27-W32) with form fields
- Filter panel: disabled by default for most modules

**Notable exceptions**:
- **W26 (Admin User)**: Uses QuickFilter (A-Z) + site search instead of standard filter panel
- **W28 (Group Management)**: Uses tree + detail card in a dialog instead of grid + drawer
- **W30 (Onboarding)**: Uses custom `gridTable.js` resource/row grid instead of `slickerGrid`

These map to the established DataTable + Dialog/Sheet patterns used in all previous batches, with the noted exceptions requiring custom layout handling.

---

## Wireframe Count Summary

| `.pen` File | Frames | Wireframe IDs |
|:---|:---|:---|
| `user-management.pen` | 5 | W26, W26b, W26c, W26d |
| `totp-security.pen` | 3 | W27 |
| `group-management.pen` | 1 | W28 |
| `skill.pen` | 2 | W29 |
| `onboarding-flow.pen` | 2 | W30, W30b |
| `user-video-history.pen` | 2 | W31 |
| `workhour.pen` | 2 | W32 |
| **Total** | **17 frames** | **12 wireframe IDs** |
