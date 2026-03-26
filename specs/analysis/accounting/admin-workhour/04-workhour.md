# 04 - Work Hour Templates

> **Split from**: `admin/04-simple-cruds.md`
> **Sections extracted here**: C (Work Hour Templates), relevant parts of E (Cross-Cutting Patterns)
> **Other domains received**: User Management (`admin-skill/04-skill.md` — Skill), System (`admin-cruds/04-motd-template.md` — MOTD + Template)

> **Source files** (all under `admin/`)
> - `workHour.htmlm` (79 lines) + `workHour.js` (38 lines) — Work hour templates

---

## C. Work Hour Templates

### C.1 HTMLM Metadata

| Property       | Value                                          |
| -------------- | ---------------------------------------------- |
| Templates      | `navbar` (`../_include/navbar.mustache`)        |
| Variables      | `usePanel = true`                               |
| Filter panel   | **Enabled** (`filter: true`)                    |
| Container ID   | `#workHours`                                    |
| CSS class      | `tableView`                                     |

### C.2 Service Binding (from `workHour.js`)

| Property       | Value                              |
| -------------- | ---------------------------------- |
| Service name   | `WorkHourService`                  |
| List method    | `getAll`                           |
| Grid plugin    | `slickerGrid` (fullscreen)         |
| Load guard     | `Core.hasLoaded("workHoursLoaded")`|
| Save settings  | `UserService.saveSetting`          |

---

### C.3 Grid Columns

| # | Field          | Name (i18n)            | Sortable | Width | Formatter        |
|---|---------------|------------------------|----------|-------|------------------|
| 1 | `id`           | `label.id`            | Yes      | 100   | `Formatter.id`   |
| 2 | `code`         | `label.name`          | Yes      | 80    | *(plain text)*   |
| 3 | `description`  | `label.description`   | Yes      | 200   | *(plain text)*   |
| 4 | `hours`        | `workHour.hours`      | Yes      | 200   | *(plain text)*   |

---

### C.4 Form Elements (Detail Dialog)

Detail dialog attributes: icon `far fa-user-clock`, color `bg-color3`, title `{{i18n.workHours}}`.

| # | Name (i18n)            | Binding           | Type    | Options | Placeholder            | Required | Default | Read-only | Condition |
|---|------------------------|-------------------|---------|---------|------------------------|----------|---------|-----------|-----------|
| 1 | *(Code)*               | `data.code`       | text    | --      | `label.code`           | Yes (`mandatory`) | -- | No | -- |
| 2 | *(Hours)*              | `data.hours`      | text    | --      | `label.hours`          | Yes (`mandatory`) | -- | No | -- |
| 3 | *(Priority)*           | `data.prio`       | number  | --      | `label.priority`       | No       | --      | No        | -- |
| 4 | *(Description)*        | `data.description`| text    | --      | `label.description`    | No       | --      | No        | -- |

**Layout**: Row 1: code (col-3) + hours (col-3) + priority (col-3). Row 2: description (col-9).

---

### C.5 Toolbar Buttons

| Action ID        | Icon            | Title (i18n)    | Disabled | Notes |
| ---------------- | --------------- | --------------- | -------- | ----- |
| `addMenuBtn`     | `plus-square`   | `action.add`    | No       | Add new work hour |
| `editMenuBtn`    | `pencil`        | `action.change` | Yes      | Edit selected |
| `deleteMenuBtn`  | `trash`         | `action.delete` | Yes      | Delete selected |

---

### C.6 Filter Panel (Offcanvas)

| Filter Field     | Binding    | Label                |
| ---------------- | ---------- | -------------------- |
| ID               | `data.id`  | `id` (HARDCODED)     |
| Name             | `data.code`| "Name" (HARDCODED)   |

Max results selector: 100 (default), 150, 200, 300, 500, >500.

---

### C.7 Translation Table

| Text-Reference     | German (inferred)   | English            | Notes |
|-------------------|---------------------|--------------------|-------|
| `workHours`       | Arbeitszeiten       | Work Hours         | Dialog title |
| `workHour.hours`  | Stunden             | Hours              | Grid column |
| `label.code`      | Code                | Code               | Placeholder |
| `label.hours`     | Stunden             | Hours              | Placeholder |
| `label.priority`  | Prioritat           | Priority           | Placeholder |
| `label.description`| Beschreibung       | Description        | Placeholder |
| "Name"            | Name                | Name               | HARDCODED filter label |

---

## Data Model Summary

### WorkHour
| Field        | Type    | Notes                          |
|-------------|---------|--------------------------------|
| `id`        | number  | Primary key                    |
| `code`      | string  | Work hour template name        |
| `hours`     | string  | Hours value                    |
| `prio`      | number  | Sort priority                  |
| `description`| string | Optional description           |

---

## Cross-Cutting Patterns (Shared)

- `Core.initCrud($container, { grid, detail, serviceName })` handles Add/Edit/Delete button wiring
- `slickerGrid` with `fullscreen: true` renders the data grid
- Detail dialogs use `jsForm` for data binding (field names prefixed with `data.`)
- `UserService.saveSetting` persists column layout preferences
- Grid columns are declared with `data-*` attributes on `<span>` elements
- Filter panels are Bootstrap offcanvas components
