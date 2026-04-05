---
title: 'Motd Template'
---

# 04 - MOTD & Template Editor

> **Split from**: `admin/simple-cruds.md`
> **Sections extracted here**: B (Message of the Day), D (Template Editor), relevant parts of E (Cross-Cutting Patterns)
> **Other domains received**: User Management (`admin-skill/skill.md` — Skill), Accounting (`admin-workhour/workhour.md` — Work Hours)

> **Source files** (all under `admin/`)
> - `motd.htmlm` (204 lines) + `motd.js` (203 lines) — Message of the Day management
> - `template.htmlm` (44 lines) + `template.js` (12 lines) — Template editor (markdown + template)

---

## B. Message of the Day (MOTD)

### B.1 HTMLM Metadata

| Property       | Value                                          |
| -------------- | ---------------------------------------------- |
| Templates      | `navbar` (`../_include/navbar.mustache`)        |
| Variables      | `usePanel = true`                               |
| Filter panel   | **Enabled** (`filter: true`)                    |
| Container ID   | `#motd`                                         |
| CSS class      | `tableView`                                     |

### B.2 Service Binding (from `motd.js`)

| Property       | Value                          |
| -------------- | ------------------------------ |
| Service name   | `MOTDService`                  |
| List method    | `getAll`                       |
| Detail method  | `get` (used for edit + preview)|
| Grid plugin    | `slickerGrid` (fullscreen)     |
| Load guard     | `Core.hasLoaded("motdLoaded")` |
| Save settings  | `UserService.saveSetting`      |
| Image upload   | `MOTDService.attachFile` via jQuery File Upload |
| Image URL      | `/get/MOTDService/attachment/{id}/motd.jpg` |

**Special**: `onSave` callback attaches `upload` field (base64 image data from canvas) to the save payload.

**Special**: `editMenuBtn` click handler fetches full record via `MOTDService.get` and converts date strings from `DD.MM.YYYY` to ISO `YYYY-MM-DD` before filling the form.

---

### B.3 Grid Columns

| # | Field          | Name (i18n)                  | Sortable | Width | Formatter            |
|---|---------------|------------------------------|----------|-------|----------------------|
| 1 | `id`           | `label.id`                  | Yes      | 100   | `Formatter.id`       |
| 2 | `subject`      | `motd.title`                | Yes      | 200   | `Formatter.title`    |
| 3 | `dateStart`    | `motd.start`                | Yes      | 100   | `Formatter.date`     |
| 4 | `enabled`      | `motd.active`               | Yes      | 100   | `Formatter.bool`     |
| 5 | `sort`         | `label.priority`            | Yes      | 30    | *(plain text)*       |
| 6 | `priority`     | `motd.important`            | Yes      | 30    | `options` (enum display) |
| 7 | `dateCreated`  | `motd.dateCreated`          | Yes      | 100   | `Formatter.dateTime` |

**Priority column options** (displayed inline in grid):

| Value    | Label (i18n)                        |
|----------|-------------------------------------|
| `LOW`    | `MessageOfTheDayPriority.LOW`       |
| `NORMAL` | `MessageOfTheDayPriority.NORMAL`    |
| `HIGH`   | `MessageOfTheDayPriority.HIGH`      |
| `URGENT` | `MessageOfTheDayPriority.URGENT`    |

---

### B.4 Form Elements (Detail Dialog)

Detail dialog attributes: icon `far fa-newspaper`, color `bg-color3`, title `{{i18n.motd}}`, width `1100`.

| # | Name (i18n)            | Binding           | Type             | Options                                          | Placeholder        | Required | Default    | Read-only | Condition |
|---|------------------------|-------------------|------------------|--------------------------------------------------|--------------------|----------|------------|-----------|-----------|
| 1 | *(Subject)*            | `data.subject`    | text             | --                                               | `label.title`      | No       | --         | No        | -- |
| 2 | `label.enabled`        | `data.enabled`    | checkbox (switch)| boolean                                          | --                 | No       | `false`    | No        | -- |
| 3 | *(Priority)*           | `data.priority`   | select           | `LOW`, `NORMAL`, `HIGH`, `URGENT`                | --                 | No       | `LOW`      | No        | -- |
| 4 | *(Start date)*         | `data.startDate`  | date             | --                                               | `motd.start`       | No       | --         | No        | -- |
| 5 | *(Start time)*         | `data.startTime`  | time             | --                                               | `motd.start`       | No       | --         | No        | -- |
| 6 | *(End date)*           | `data.endDate`    | date             | --                                               | `motd.end`         | No       | --         | No        | -- |
| 7 | *(End time)*           | `data.endTime`    | time             | --                                               | `motd.end`         | No       | --         | No        | -- |
| 8 | `motd.new`             | `data.roles[]`    | checkbox (switch)| value=`REGISTERED`                               | --                 | No       | --         | No        | -- |
| 9 | `motd.expert`          | `data.roles[]`    | checkbox (switch)| value=`STANDARD`                                 | --                 | No       | --         | No        | -- |
| 10| Admin Intern           | `data.roles[]`    | checkbox (switch)| value=`ADMIN_INTERN`                             | --                 | No       | --         | No        | HARDCODED label |
| 11| Admin                  | `data.roles[]`    | checkbox (switch)| value=`ADMIN`                                    | --                 | No       | --         | No        | HARDCODED label |
| 12| `motd.customer`        | `data.roles[]`    | checkbox (switch)| value=`KUNDE`                                    | --                 | No       | --         | No        | -- |
| 13| `motd.adminCustomer`   | `data.roles[]`    | checkbox (switch)| value=`ADMIN_KUNDE`                              | --                 | No       | --         | No        | -- |
| 14| *(Message)*            | `data.message`    | textarea (markdown) | CSS class `markdownedit`; height 250px        | --                 | Yes (`mandatory`) | -- | No | -- |
| 15| *(Image preview)*      | --                | img/canvas       | Shows existing image or uploaded preview         | --                 | No       | --         | No        | Shows `previewFile` img when existing, `previewPic` canvas after upload |
| 16| *(Link)*               | `data.link`       | text             | --                                               | `motd.link`        | No       | --         | No        | -- |
| 17| `label.priority`       | `data.sort`       | number           | --                                               | `label.priority.description` | No | --  | No        | -- |
| 18| `motd.widthInfo`       | `data.width`      | number           | --                                               | `motd.widthInfo`   | No       | --         | No        | Width 1-12 (Bootstrap grid) |
| 19| `motd.imagePosition`   | `data.imagePos`   | select           | `""` (default), `LEFT`, `TOP`, `BOTTOM`, `BACK`  | --                 | No       | `""` (none)| No        | -- |
| 20| *(File upload)*        | file input        | file             | jQuery File Upload plugin                        | --                 | No       | --         | No        | Uploads to `MOTDService.attachFile` |

**Layout**:
- Row 1: subject (col-8) + enabled switch (col-2) + priority select (col-2)
- Row 2: start date+time input group (col-6) + end date+time input group (col-6)
- Row 3: 6 role visibility checkboxes (col-2 each)
- Row 4: message textarea (col-8) + image preview area (col-4)
- Row 5: link (col-12)
- Row 6: sort/priority number (col-4) + width number (col-4) + image position select (col-4)
- Row 7: file upload input (col-12)

**Visibility roles mapping** (checkbox value to role):

| Checkbox Value  | Label (i18n)           | Role Description       |
|-----------------|------------------------|------------------------|
| `REGISTERED`    | `motd.new`             | Newly registered users |
| `STANDARD`      | `motd.expert`          | Expert/standard users  |
| `ADMIN_INTERN`  | "Admin Intern" HARDCODED | Internal admin        |
| `ADMIN`         | "Admin" HARDCODED      | Administrator          |
| `KUNDE`         | `motd.customer`        | Customer               |
| `ADMIN_KUNDE`   | `motd.adminCustomer`   | Admin customer         |

---

### B.5 Toolbar Buttons

| Action ID        | Icon            | Title (i18n)    | Disabled | Notes |
| ---------------- | --------------- | --------------- | -------- | ----- |
| `addMenuBtn`     | `plus-square`   | `action.add`    | No       | Add new MOTD |
| `editMenuBtn`    | `pencil`        | `action.change` | Yes      | Edit selected; fetches full record + converts dates |
| `deleteMenuBtn`  | `trash`         | `action.delete` | Yes      | Delete selected MOTD |
| `previewMenuBtn` | `glasses`       | `motd.preview`  | Yes      | Opens preview dialog; enabled when exactly 1 row selected |

---

### B.6 Preview Dialog

**Special component**: A separate dialog (`#previewDlg`) renders a card-style preview of the selected MOTD.

| Attribute    | Value                        |
| ------------ | ---------------------------- |
| `data-icon`  | `far fa-business-time`       |
| `data-color` | `bg-color-appointment`       |
| `data-width` | `1070`                       |
| `title`      | `{{i18n.motd.preview}}`      |

**Preview behavior** (from `motd.js`):
1. Fetches full MOTD record via `MOTDService.get(id)`
2. Renders `subject` (escaped HTML) and `message` (plain text) into a Bootstrap card
3. Loads image from `/get/MOTDService/attachment/{id}/motd.jpg`
4. Applies **priority-based card styling**:

| Priority | Card CSS Classes                  |
|----------|-----------------------------------|
| `LOW`    | `bg-secondary text-white`        |
| `NORMAL` | *(no additional classes)*         |
| `HIGH`   | `bg-warning`                      |
| `URGENT` | `text-white bg-danger`            |

5. Adjusts **image position** based on `imagePos`:

| `imagePos` | Layout Behavior                                      |
|------------|------------------------------------------------------|
| *(none)*   | Image column removed; body spans full width (col-12) |
| `LEFT`     | Image in left column (col-4), body in right (col-8)  |
| `TOP`      | Image above body (`card-img-top`)                    |
| `BOTTOM`   | Image below body                                     |
| `BACK`     | Image as card background (`card-img-overlay`)        |

---

### B.7 Image Upload Mechanism

- Uses **jQuery File Upload** plugin
- Uploads to `MOTDService.attachFile` via `Core.conn.SERVICE_URL`
- If record already saved: passes `data.id`; if new record: passes `-2`
- On client side: reads file as DataURL, draws to `<canvas>` for preview, stores base64 in `data().photo`
- On save: the `onSave` callback attaches `data().photo` as `upload` field
- Error message on upload failure is HARDCODED in German: `"Hochladen fehlgeschlagen. Bitte Probieren Sie es mit einem kleineren Bild oder melden Sie sich beim Administrator."`

---

### B.8 Filter Panel (Offcanvas)

| Filter Field     | Binding    | Label              |
| ---------------- | ---------- | ------------------ |
| ID               | `data.id`  | `id` (HARDCODED)   |
| Name             | `data.code`| `filter.name`      |

> Note: Filter uses `data.code` but the grid displays `subject` — this may be a legacy mismatch. No `maxResults` selector in this filter panel.

---

### B.9 Translation Table

| Text-Reference                   | German (inferred)         | English                  | Notes |
|---------------------------------|---------------------------|--------------------------|-------|
| `motd`                          | Neuigkeiten               | Message of the Day       | Dialog title |
| `motd.title`                    | Titel                     | Title                    | Grid column |
| `motd.start`                    | Start                     | Start                    | Grid column + placeholder |
| `motd.end`                      | Ende                      | End                      | Placeholder |
| `motd.active`                   | Aktiv                     | Active                   | Grid column |
| `motd.important`                | Wichtigkeit               | Important                | Grid column |
| `motd.dateCreated`              | Erstellt am               | Date Created             | Grid column |
| `motd.preview`                  | Vorschau                  | Preview                  | Toolbar + dialog title |
| `motd.link`                     | Link                      | Link                     | Form placeholder |
| `motd.widthInfo`                | Breite (1-12)             | Width (1-12)             | Form label + placeholder |
| `motd.new`                      | Neu                       | New                      | Role checkbox |
| `motd.expert`                   | Experte                   | Expert                   | Role checkbox |
| `motd.customer`                 | Kunde                     | Customer                 | Role checkbox |
| `motd.adminCustomer`            | Admin-Kunde               | Admin Customer           | Role checkbox |
| `motd.imagePosition`            | Bildposition              | Image Position           | Select default option |
| `motd.imageLeft`                | Bild links                | Image Left               | Select option |
| `motd.imageAbove`               | Bild oben                 | Image Above              | Select option |
| `motd.imageBelow`               | Bild unten                | Image Below              | Select option |
| `motd.imageAsBackground`        | Bild als Hintergrund      | Image As Background      | Select option |
| `MessageOfTheDayPriority.LOW`   | Niedrig                   | Low                      | Priority enum |
| `MessageOfTheDayPriority.NORMAL`| Normal                    | Normal                   | Priority enum |
| `MessageOfTheDayPriority.HIGH`  | Hoch                      | High                     | Priority enum |
| `MessageOfTheDayPriority.URGENT`| Dringend                  | Urgent                   | Priority enum |
| `label.title`                   | Titel                     | Title                    | Placeholder |
| `label.enabled`                 | Aktiviert                 | Enabled                  | Switch label |
| `label.priority`                | Prioritat                 | Priority                 | Form group label |
| `label.priority.description`    | Sortierung                | Sort order               | Number placeholder |
| "Admin Intern"                  | Admin Intern              | Admin Intern             | HARDCODED |
| "Admin"                         | Admin                     | Admin                    | HARDCODED |
| *(upload error)*                | Hochladen fehlgeschlagen... | *(not translated)*    | HARDCODED German error message |

---

---

## D. Template Editor

### D.1 HTMLM Metadata

| Property       | Value                                          |
| -------------- | ---------------------------------------------- |
| Templates      | `navbar` (`../_include/navbar.mustache`)        |
| Variables      | *(none beyond navbar)*                          |
| Filter panel   | **Disabled** (no filter config)                 |
| Container ID   | `#templateArea`                                 |
| CSS class      | *(none — not a tableView)*                      |

> **Important**: This page does NOT follow the `tableView` + `detail` pattern. It is a standalone side-by-side editor.

### D.2 External Dependencies

| Library          | Include Path                          | Purpose                    |
|-----------------|---------------------------------------|----------------------------|
| `marked.min.js` | `_lib/3rdparty/marked.min.js`        | Markdown-to-HTML rendering |

> **Special component note**: This page uses the `marked` library (Markdown parser/compiler) for converting Markdown content to HTML. In the React rebuild, this should be replaced with a React-compatible Markdown library (e.g., `react-markdown` or `@mdx-js/react`).

### D.3 Service Binding (from `template.js`)

| Property       | Value                          |
| -------------- | ------------------------------ |
| Service name   | *(none — no CRUD service)*     |
| Load guard     | *(none)*                       |

The JS file is minimal (12 lines): it runs `marked.parse()` on a hardcoded demo string and sets up an `onchange` listener on `#templateMarkdown` that only logs to console. The `#content` target element referenced in JS does not exist in the HTML. This page appears to be an **incomplete prototype/stub**.

### D.4 Layout

Side-by-side two-column layout (no grid, no detail dialog):

| Column | Width  | Element ID            | Label              | Type       | Notes |
|--------|--------|-----------------------|--------------------|------------|-------|
| Left   | col-6  | `#templateMarkdown`   | "Markdown" HARDCODED | textarea  | Markdown input editor |
| Right  | col-6  | `#templateContent`    | "Template" HARDCODED | textarea  | Template content editor |

---

### D.5 Toolbar Buttons

| Action ID        | Icon            | Title (i18n)    | Disabled | Notes |
| ---------------- | --------------- | --------------- | -------- | ----- |
| `addMenuBtn`     | `plus-square`   | `action.add`    | No       | *(no JS handler)* |
| `editMenuBtn`    | `pencil`        | `action.change` | Yes      | *(no JS handler)* |
| `deleteMenuBtn`  | `trash`         | `action.delete` | Yes      | *(no JS handler)* |

> All toolbar buttons are defined in the HTMLM header but have no corresponding JS handlers. The template page appears non-functional beyond the basic markdown demo.

---

### D.6 Translation Table

| Text-Reference     | German (inferred) | English          | Notes |
|-------------------|-------------------|------------------|-------|
| "Markdown"        | Markdown          | Markdown         | HARDCODED label |
| "Template"        | Template          | Template         | HARDCODED label |

---

## Data Model Summary

### MOTD (Message of the Day)
| Field        | Type      | Notes                          |
|-------------|-----------|--------------------------------|
| `id`        | number    | Primary key                    |
| `subject`   | string    | Display title                  |
| `message`   | string    | Markdown content               |
| `enabled`   | boolean   | Whether MOTD is active         |
| `priority`  | enum      | `LOW`, `NORMAL`, `HIGH`, `URGENT` |
| `sort`      | number    | Display sort order             |
| `dateStart` | date      | Start display date             |
| `startDate` | string    | Start date (DD.MM.YYYY in API, converted to ISO) |
| `startTime` | string    | Start time                     |
| `endDate`   | string    | End date                       |
| `endTime`   | string    | End time                       |
| `dateCreated`| datetime | Record creation timestamp       |
| `roles`     | string[]  | Visibility: `REGISTERED`, `STANDARD`, `ADMIN_INTERN`, `ADMIN`, `KUNDE`, `ADMIN_KUNDE` |
| `link`      | string    | Optional link URL              |
| `width`     | number    | Display width (1-12, Bootstrap grid) |
| `imagePos`  | enum      | `LEFT`, `TOP`, `BOTTOM`, `BACK`, or empty |
| `upload`    | string    | Base64 image data (on save only) |

### Template
| Field        | Type    | Notes                          |
|-------------|---------|--------------------------------|
| *(none)*    | --      | No data model — stub page      |

---

## Cross-Cutting Patterns (Shared)

- `Core.initCrud($container, { grid, detail, serviceName })` handles Add/Edit/Delete button wiring
- `slickerGrid` with `fullscreen: true` renders the data grid
- Detail dialogs use `jsForm` for data binding (field names prefixed with `data.`)
- `UserService.saveSetting` persists column layout preferences
- Grid columns are declared with `data-*` attributes on `<span>` elements
- Filter panels are Bootstrap offcanvas components

### Shared Formatters

| Formatter          | Usage                                          |
|-------------------|------------------------------------------------|
| `Formatter.id`    | ID columns (all pages)                         |
| `Formatter.bool`  | Boolean columns: `certified`, `active`, `enabled` |
| `Formatter.date`  | Date display (MOTD `dateStart`)                |
| `Formatter.dateTime` | DateTime display (MOTD `dateCreated`)       |
| `Formatter.title` | Title display with styling (MOTD `subject`)    |
| `i18n.skillType`  | Localized enum display (Skill `type`)          |
| `options`         | Inline option-based enum (MOTD `priority`)     |

### Form Input Types

| CSS Class      | Meaning                                            |
|---------------|----------------------------------------------------|
| `mandatory`   | Required field — form validation prevents save      |
| `boolean`     | Checkbox bound as true/false                        |
| `array`       | Checkbox bound as array element (MOTD roles)        |
| `number`      | Numeric input                                       |
| `markdownedit`| Textarea with markdown editing support              |
| `form-select` | Dropdown select                                     |
| `form-check form-switch` | Toggle switch (Bootstrap)                |
