---
title: 'Skill'
---

---
---

# 04 - Skill Management

> **Split from**: `admin/simple-cruds.md`
> **Sections extracted here**: A (Skill Management), relevant parts of E (Cross-Cutting Patterns)
> **Other domains received**: System (`admin-cruds/motd-template.md` — MOTD + Template), Accounting (`admin-workhour/workhour.md` — Work Hours)

> **Source files** (all under `admin/`)
> - `skill.htmlm` (98 lines) + `skill.js` (63 lines) — Skill management

---

## A. Skill Management

### A.1 HTMLM Metadata

| Property       | Value                                          |
| -------------- | ---------------------------------------------- |
| Templates      | `navbar` (`../_include/navbar.mustache`)        |
| Variables      | `usePanel = true`, `search = true`              |
| Filter panel   | **Enabled** (`filter: true`)                    |
| Container ID   | `#skill`                                        |
| CSS class      | `tableView`                                     |

### A.2 Service Binding (from `skill.js`)

| Property       | Value                          |
| -------------- | ------------------------------ |
| Service name   | `SkillService`                 |
| List method    | `getAll`                       |
| Grid plugin    | `slickerGrid` (fullscreen)     |
| Load guard     | `Core.hasLoaded("skillLoaded")`|
| Save settings  | `UserService.saveSetting`      |
| Data limit     | `100` (passed as second param) |
| Client filter  | Full-text on `code` and localized `type` |

---

### A.3 Grid Columns

| # | Field        | Name (i18n)            | Sortable | Width | Formatter          |
|---|-------------|------------------------|----------|-------|--------------------|
| 1 | `id`         | `label.id`            | Yes      | 50    | `Formatter.id`     |
| 2 | `code`       | `label.name`          | Yes      | 300   | *(plain text)*     |
| 3 | `type`       | `label.type`          | Yes      | 100   | `i18n.skillType`   |
| 4 | `certified`  | `skill.certificate`   | Yes      | 100   | `Formatter.bool`   |
| 5 | `active`     | `label.active`        | Yes      | 50    | `Formatter.bool`   |

> Column `description` is commented out in the HTMLM source.

---

### A.4 Form Elements (Detail Dialog)

| # | Name (i18n)            | Binding           | Type      | Options                                          | Placeholder      | Required | Default | Read-only | Condition |
|---|------------------------|-------------------|-----------|--------------------------------------------------|------------------|----------|---------|-----------|-----------|
| 1 | *(Code)*               | `data.code`       | text      | --                                               | `label.code`     | Yes (`mandatory`) | -- | No | -- |
| 2 | *(Type)*               | `data.type`       | select    | `MAIN`, `ADDITIONAL`, `EXTRA`, `LANGUAGE`        | --               | Yes (`mandatory`) | `MAIN` (first option) | No | -- |
| 3 | `skill.certificate`    | `data.certified`  | checkbox (switch) | boolean                               | --               | No       | `false` | No | -- |
| 4 | `label.active`         | `data.active`     | checkbox (switch) | boolean                               | --               | No       | `false` | No | -- |
| 5 | *(Description)*        | `data.description`| text      | --                                               | `label.description` | No    | --      | No | -- |

**Detail dialog attributes**: icon `far fa-graduation-cap`, color `bg-color3`, title `{{i18n.skill}}`.

**Layout**: code (col-12), type (col-6) + certified (col-3) + active (col-3), description (col-12).

---

### A.5 Toolbar Buttons

| Action ID        | Icon            | Title (i18n)    | Disabled | Notes |
| ---------------- | --------------- | --------------- | -------- | ----- |
| `addMenuBtn`     | `plus-square`   | `action.add`    | No       | Add new skill |
| `editMenuBtn`    | `pencil`        | `action.change` | Yes      | Edit selected skill |
| `deleteMenuBtn`  | `trash`         | `action.delete` | Yes      | Delete selected skill |

---

### A.6 Filter Panel (Offcanvas)

| Filter Field     | Binding    | Label              |
| ---------------- | ---------- | ------------------ |
| ID               | `data.id`  | `id` (HARDCODED)   |
| Name             | `data.code`| `filter.name`      |

Max results selector: 100 (default), 150, 200, 300, 500, >500.

---

### A.7 Translation Table

| Text-Reference             | German (inferred)       | English                | Notes |
|---------------------------|-------------------------|------------------------|-------|
| `skill`                   | Fachgebiet              | Skill                  | Dialog title |
| `skill.certificate`       | Zertifikat              | Certificate            | Column + form label |
| `skill.type.MAIN`         | Hauptfach               | Main                   | Type enum |
| `skill.type.ADDITIONAL`   | Zusatzfach              | Additional             | Type enum |
| `skill.type.EXTRA`        | Extra                   | Extra                  | Type enum |
| `skill.type.LANGUAGE`     | Sprache                 | Language               | Type enum |
| `label.id`                | ID                      | ID                     | Shared label |
| `label.name`              | Name                    | Name                   | Shared label |
| `label.type`              | Typ                     | Type                   | Shared label |
| `label.code`              | Code                    | Code                   | Placeholder |
| `label.active`            | Aktiv                   | Active                 | Column + form label |
| `label.description`       | Beschreibung            | Description            | Placeholder |
| `action.add`              | Hinzufugen              | Add                    | Toolbar |
| `action.change`           | Bearbeiten              | Change                 | Toolbar |
| `action.delete`           | Loschen                 | Delete                 | Toolbar |
| `filter.name`             | Name                    | Name                   | Filter label |
| `button.apply`            | Anwenden                | Apply                  | Filter button |
| `button.reset`            | Zurucksetzen            | Reset                  | Filter button |

---

## Data Model Summary

### Skill
| Field        | Type    | Notes                          |
|-------------|---------|--------------------------------|
| `id`        | number  | Primary key                    |
| `code`      | string  | Skill name/code                |
| `type`      | enum    | `MAIN`, `ADDITIONAL`, `EXTRA`, `LANGUAGE` |
| `certified` | boolean | Whether certification is required |
| `active`    | boolean | Whether skill is active        |
| `description`| string | Optional description           |

---

## Cross-Cutting Patterns (Shared)

- `Core.initCrud($container, { grid, detail, serviceName })` handles Add/Edit/Delete button wiring
- `slickerGrid` with `fullscreen: true` renders the data grid
- Detail dialogs use `jsForm` for data binding (field names prefixed with `data.`)
- `UserService.saveSetting` persists column layout preferences
- Grid columns are declared with `data-*` attributes on `<span>` elements
- Filter panels are Bootstrap offcanvas components
