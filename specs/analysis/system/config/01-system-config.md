> **Split from**: `config-cruds/01-config-cruds.md`
> **Sections extracted here**: locationType (A), exclusionCriteria (B), supportCategory (D), loginNotification (I)
> **Other domains received**: accounting/config/01-accounting-config.md got jobPriceList (E), product (F), closedMonth (G), stornoGroup (C), expertWorkMonthly (H)

# 01 - Config CRUD Modules (Low-Priority Admin Pages)

> **Source directories** (all under `~/src/vc/videoclinic-prod/web/src/main/webapp/`)
> - `locationType/` (3 files) -- Location type config
> - `exclusionCriteria/` (3 files) -- Exclusion criteria config
> - `supportCategory/` (3 files) -- Support category config
> - `loginNotification/` (3 files) -- Login notification config

All modules share the same boilerplate: `Core.initCrud` + `slickerGrid` (fullscreen), `getAll` list method, `UserService.saveSetting` for grid persistence, standard Add/Edit/Delete toolbar buttons. Differences are called out per module.

---

## Shared Pattern (applies to all unless noted)

| Property        | Value                                    |
| --------------- | ---------------------------------------- |
| Grid plugin     | `slickerGrid` (fullscreen)               |
| List method     | `getAll`                                 |
| Save settings   | `UserService.saveSetting`                |
| Data limit      | `100` (second param)                     |
| CSS class       | `tableView`                              |
| Toolbar buttons | Add, Edit (disabled), Delete (disabled), Action (disabled) |
| Filter panel    | **Disabled** (`filter: false`) unless noted |
| Client filter   | **None** unless noted                    |

---

## A. Location Type

### A.1 Service Binding

| Property     | Value                                    |
| ------------ | ---------------------------------------- |
| Service name | `LocationTypeService`                    |
| Container ID | `#locationType`                          |
| Load guard   | `locationTypeLoaded`                     |
| Detail icon  | `fas fa-boxes`                           |
| Detail color | `bg-color-locationType`                  |

### A.2 Grid Columns

| # | Field         | Name (i18n)         | Sortable | Width | Formatter    |
|---|---------------|----------------------|----------|-------|--------------|
| 1 | `id`          | `label.id`          | Yes      | 80    | *(plain)*    |
| 2 | `name`        | `name`              | Yes      | 80    | *(plain)*    |
| 3 | `description` | `label.description` | Yes      | 80    | *(plain)*    |
| 4 | `prio`        | `prio`              | Yes      | 80    | *(plain)*    |

### A.3 Form Elements

| # | Binding           | Type   | Placeholder          | Required | Notes          |
|---|-------------------|--------|----------------------|----------|----------------|
| 1 | `data.id`         | display | `label.id`          | --       | Read-only span |
| 2 | `data.name`       | text   | `name`               | No       |                |
| 3 | `data.description`| text   | `label.description`  | No       |                |
| 4 | `data.prio`       | number | `prio`               | No       | CSS class `number` |

### A.4 Unique Features

- None. Simplest possible CRUD.

### A.5 Hardcoded Strings

- `"prio"` used as both grid column name and placeholder (not i18n-wrapped).

### A.6 i18n Definitions

- `null_name` -- only custom i18n key.

---

## B. Exclusion Criteria

### B.1 Service Binding

| Property     | Value                                    |
| ------------ | ---------------------------------------- |
| Service name | `ExclusionCriteriaService`               |
| Container ID | `#exclusionCriteria`                     |
| Load guard   | `exclusionCriteriaLoaded`                |
| Detail icon  | `fas fa-comment-slash`                   |
| Detail color | `bg-color-user`                          |
| Panel        | `usePanel = true`                        |

### B.2 Grid Columns

| # | Field         | Name (i18n)         | Sortable | Width | Formatter    |
|---|---------------|----------------------|----------|-------|--------------|
| 1 | `id`          | `label.id`          | Yes      | 50    | *(plain)*    |
| 2 | `title`       | `label.title`       | Yes      | 80    | *(plain)*    |
| 3 | `description` | `label.description` | Yes      | 300   | *(plain)*    |
| 4 | `priority`    | `label.priority`    | Yes      | 50    | *(plain)*    |

### B.3 Form Elements

| # | Binding            | Type     | Placeholder          | Required         | Notes       |
|---|--------------------|----------|----------------------|------------------|-------------|
| 1 | `data.title`       | text     | `label.title`        | Yes (`mandatory`)| Full width  |
| 2 | `data.priority`    | number   | `label.priority`     | No               | CSS `number`|
| 3 | `data.description` | textarea | `label.description`  | No               | 4 rows      |

### B.4 Unique Features

- Extra jsForm fill logic: loads `exclusionCriteriaTable` via separate `getAll` call and populates with `jsForm('fill', {list:data})`. This appears to be a **secondary list view** or draft code (comment says "todo: Later it will be searching per User").
- `title` field is marked `mandatory`.

### B.5 Hardcoded Strings

- None. All labels use i18n.

### B.6 i18n Definitions

- Empty file (no custom i18n keys).

---

## D. Support Category

### D.1 Service Binding

| Property     | Value                                    |
| ------------ | ---------------------------------------- |
| Service name | `SupportCategoryService`                 |
| Container ID | `#supportCategory`                       |
| Load guard   | `supportCategoryLoaded`                  |
| Detail icon  | `fas fa-boxes`                           |
| Detail color | `bg-color-supportCategory`               |
| Panel        | `usePanel = true`                        |

### D.2 Grid Columns

| # | Field            | Name (i18n)          | Sortable | Width | Formatter    |
|---|------------------|----------------------|----------|-------|--------------|
| 1 | `id`             | `id` (hardcoded)    | Yes      | 80    | *(plain)*    |
| 2 | `category`       | `label.category`    | Yes      | 80    | *(plain)*    |
| 3 | `title`          | `label.title`       | Yes      | 80    | *(plain)*    |
| 4 | `queue`          | `label.queue`       | Yes      | 80    | *(plain)*    |
| 5 | `subcategories`  | `label.subcategories`| Yes     | 80    | *(plain)*    |

### D.3 Form Elements (Master)

| # | Binding          | Type | Placeholder      | Required | Notes  |
|---|------------------|------|------------------|----------|--------|
| 1 | `data.category`  | text | `category`       | No       | col-3  |
| 2 | `data.title`     | text | `label.title`    | No       | col-5  |
| 3 | `data.queue`     | text | --               | No       | col-4, label "Queue" (hardcoded) |

### D.4 Form Elements -- Nested Collection (`data.subcategories`)

Sortable list of simple string values (themes/subcategories).

| # | Binding           | Type      | Notes                               |
|---|-------------------|-----------|-------------------------------------|
| 1 | `subcategories.`  | text      | Sortable UL list, add/delete, drag handle |

### D.5 Unique Features

- **Sortable string collection**: `data.subcategories` is a drag-sortable `<ul>` list of plain string inputs. Each item has a drag handle and delete button.
- Label says `i18n.themes` for the collection header (but field is `subcategories`).

### D.6 Hardcoded Strings

- `"Queue"` -- input-group-text label is hardcoded English.
- `"id"` -- grid column name is hardcoded, not i18n.

### D.7 i18n Definitions

- Empty file.

---

## I. Login Notification

### I.1 Service Binding

| Property     | Value                                    |
| ------------ | ---------------------------------------- |
| Service name | `LoginNotificationService`               |
| Container ID | `#loginNotification`                     |
| Load guard   | `loginNotificationLoaded`                |
| Detail icon  | `fa-solid fa-comment-exclamation`        |
| Detail color | `bg-color3`                              |
| Panel        | `usePanel = true`                        |
| Filter panel | **Enabled** (`filter: true`)             |
| Quick filter | **Yes** (includes `quickFilter.mustache`)|

### I.2 Grid Columns

| # | Field      | Name (i18n)          | Sortable | Width | Formatter            |
|---|------------|----------------------|----------|-------|----------------------|
| 1 | `id`       | `label.id`          | Yes      | 80    | *(plain)*            |
| 2 | `content`  | `label.name`        | Yes      | 150   | *(plain)*            |
| 3 | `dateFrom` | `dateFilter.fromDate`| Yes     | 120   | `Formatter.dateTime` |
| 4 | `dateTo`   | `dateFilter.toDate` | Yes      | 120   | `Formatter.dateTime` |
| 5 | `active`   | `label.active`      | Yes      | 80    | `Formatter.bool`     |

### I.3 Form Elements

| # | Binding        | Type              | Placeholder/Label       | Required | Notes                     |
|---|----------------|-------------------|-------------------------|----------|---------------------------|
| 1 | `data.id`      | number (readonly) | `label.id`              | --       | Read-only, badge icon     |
| 2 | `data.dateFrom`| date              | `dateFilter.fromDate`   | No       | Calendar icon              |
| 3 | `data.dateTo`  | date              | `dateFilter.toDate`     | No       | Calendar icon              |
| 4 | `data.active`  | checkbox (switch) | `label.active`          | No       |                           |
| 5 | `data.content` | textarea          | --                      | No       | CSS class `markdownedit`, height `50vh` |

### I.4 Unique Features

- **Markdown editor**: The `content` textarea has CSS class `markdownedit`, indicating a rich markdown editing experience.
- **Quick filter**: Includes the shared `quickFilter.mustache` template.
- **Filter panel enabled**: Unlike most other modules, `filter: true`.
- **Date range**: `dateFrom`/`dateTo` define the active display period for the notification.

### I.5 Hardcoded Strings

- None.

### I.6 i18n Definitions

- `null_Content` -- null placeholder key.
