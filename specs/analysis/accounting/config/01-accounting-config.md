> **Split from**: `config-cruds/01-config-cruds.md`
> **Sections extracted here**: jobPriceList (E), product (F), closedMonth (G), stornoGroup (C), expertWorkMonthly (H)
> **Other domains received**: system/config/01-system-config.md got locationType (A), exclusionCriteria (B), supportCategory (D), loginNotification (I)

# 01 - Config CRUD Modules (Low-Priority Admin Pages)

> **Source directories** (all under `~/src/vc/videoclinic-prod/web/src/main/webapp/`)
> - `stornoGroup/` (3 files) -- Cancellation group config
> - `jobPriceList/` (3 files) -- Job pricing configuration
> - `product/` (3 files) -- Product config
> - `closedMonth/` (3 files) -- Month closing admin
> - `expertWorkMonthly/` (3 files) -- Expert work monthly reports

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

## C. Storno Group (Cancellation Group)

### C.1 Service Binding

| Property     | Value                                    |
| ------------ | ---------------------------------------- |
| Service name | `StornoGroupService`                     |
| Container ID | `#stornoGroup`                           |
| Load guard   | `stornoGroupLoaded`                      |
| Detail icon  | `fas fa-funnel-dollar`                   |
| Detail color | `bg-color-invoice`                       |
| Detail width | `800`                                    |
| Panel        | `usePanel = true`                        |

### C.2 Grid Columns

| # | Field    | Name (i18n)      | Sortable | Width | Formatter    |
|---|----------|-------------------|----------|-------|--------------|
| 1 | `title`  | `label.title`    | Yes      | 80    | *(plain)*    |
| 2 | `comment`| `label.comment`  | Yes      | 80    | *(plain)*    |
| 3 | `storno` | `action.storno`  | Yes      | 80    | *(plain)*    |
| 4 | `id`     | `label.id`       | Yes      | 80    | *(plain)*    |

### C.3 Form Elements (Master)

| # | Binding       | Type | Placeholder     | Required | Notes  |
|---|---------------|------|-----------------|----------|--------|
| 1 | `data.title`  | text | `label.title`   | No       | col-4  |
| 2 | `data.comment`| text | `label.comment` | No       | col-8  |

### C.4 Form Elements -- Nested Collection (`data.storno`)

This is a **repeatable sub-form** (collection with add/delete) for cancellation conditions.

| # | Binding               | Type      | Placeholder/Label            | Notes                        |
|---|-----------------------|-----------|------------------------------|------------------------------|
| 1 | `storno.name`         | text      | `label.name`                 | With delete button           |
| 2 | `storno.stornoTime`   | humantime | --                           | Label: `job.ifCancellationTime` |
| 3 | `storno.percentage`   | percent   | --                           | Label: `job.balancePayable`, suffix `%` |
| 4 | `storno.comment`      | text      | `label.comment`              |                              |
| 5 | `storno.dateStart`    | date      | --                           | Date range pair              |
| 6 | `storno.dateUntil`    | date      | --                           | Date range pair              |

### C.5 Unique Features

- **Nested collection**: `data.storno` is a child array with add (+) and delete (trash) controls. This is NOT a simple single-record CRUD -- it has a master-detail-within-detail pattern.
- Human time formatter for cancellation time.
- Percentage input for balance payable.
- Date range (start/until) on each cancellation condition.

### C.6 Hardcoded Strings

- None. All labels use i18n keys (`job.ifCancellationTime`, `job.balancePayable`).

### C.7 i18n Definitions

- Empty file.

---

## E. Job Price List

### E.1 Service Binding

| Property       | Value                                    |
| -------------- | ---------------------------------------- |
| Service name   | `JobPriceListService`                    |
| Container ID   | `#jobPriceList`                          |
| Load guard     | `jobPriceListLoaded`                     |
| Detail icon    | `fas fa-cash-register`                   |
| Detail color   | `bg-color-customer`                      |
| Detail width   | `1000`                                   |
| Detail target  | `primary`                                |
| Panel          | `usePanel = true`                        |
| Search enabled | **Yes** (`search = true`)                |
| Client filter  | Full-text on `name` and `comment`        |
| Save button    | Explicit (`data-buttonsave="true"`)      |

### E.2 Grid Columns

| # | Field     | Name (i18n)         | Sortable | Width | Formatter            |
|---|-----------|----------------------|----------|-------|----------------------|
| 1 | `id`      | `label.id`          | Yes      | 60    | *(plain)*            |
| 2 | `name`    | `name`              | Yes      | 320   | *(plain)*            |
| 3 | `start`   | `label.start`       | Yes      | 80    | `Formatter.dateTime` |
| 4 | `until`   | `label.until`       | Yes      | 80    | `Formatter.dateTime` |
| 5 | `active`  | `label.active`      | Yes      | 50    | `Formatter.bool`     |
| 6 | `comment` | `label.comment`     | Yes      | 180   | *(plain)*            |

### E.3 Form Elements (Master)

| # | Binding        | Type     | Placeholder/Label   | Required | Notes                  |
|---|----------------|----------|---------------------|----------|------------------------|
| 1 | `data.name`    | text     | `name`              | No       | col-4                  |
| 2 | `data.active`  | checkbox (switch) | `label.active` | No | col-4                  |
| 3 | `data.start`   | date     | --                  | No       | Date range with icons   |
| 4 | `data.until`   | date     | --                  | No       | (play/stop icons)       |
| 5 | `data.comment` | text     | `label.comment`     | No       | Full width             |

### E.4 Form Elements -- Nested Collection (`data.prices`)

A **sortable table** of job prices with conditional fields based on job type.

| # | Binding                          | Type    | Placeholder/Label               | Condition                |
|---|----------------------------------|---------|---------------------------------|--------------------------|
| 1 | `prices.job.code`                | display | --                              | Always (read-only)       |
| 2 | `prices.job.type`                | display | --                              | Always (read-only)       |
| 3 | `prices.price`                   | decimal | `job.price`, suffix: euro sign  | Always                   |
| 4 | `prices.roundingType`            | select  | `FULL_HOUR`, `HALF_HOUR`       | Only if job type = `APPOINTMENT` |
| 5 | `prices.consultationInvoice`     | checkbox (switch) | `job.consultationInvoice` | Only if job type = `SHIFT` |
| 6 | `prices.appointmentConsulationPrice` | decimal | "pro Behandlung" (hardcoded) | Only if job type = `APPOINTMENT` |
| 7 | `prices.supportPrice`            | decimal | `job.supportPrice`              | Only if job type = `COUNCIL` |
| 8 | `prices.comment`                 | text    | `label.comment`                 | Always                   |

### E.5 Unique Features

- **Most complex module in this batch.** Master record with nested prices collection.
- **Conditional fields**: JS in `postAddCollection` toggles visibility of `.consultationInvoice`, `.appointmentConsulationPrice`, `.councilSupportPrice` based on `pojo.job.type` (SHIFT, APPOINTMENT, COUNCIL).
- **Client-side filter**: Text search on `name` and `comment` via `#siteSearch` input.
- **Sortable table**: `table.sortable` with `sorTable()` plugin.
- **Quick filter**: Column header has a `.quickfilter` input for the prices table.
- Cross-module reference: prices reference Job entities (`prices.job.code`, `prices.job.type`).

### E.6 Hardcoded Strings

- `"pro Behandlung"` -- placeholder for appointment consultation price (German, not i18n).
- `"Preis beh. Arzt bei Konsil"` -- title attribute for council support price (German, not i18n).
- Euro sign `&euro;` -- hardcoded currency symbol.

### E.7 i18n Definitions

- `null_Start`, `null_name` -- null placeholder keys.
- References shared i18n: `HourlyRoundingType.FULL_HOUR`, `HourlyRoundingType.HALF_HOUR`, `job.consultationInvoice`, `job.appointmentConsulationPrice`, `job.supportPrice`, `job.price`, `customer.rounding`.

### E.8 Cross-Module References

- **Job**: prices reference `job.code` and `job.type` (enum: SHIFT, APPOINTMENT, COUNCIL).
- **HourlyRoundingType**: enum with `FULL_HOUR`, `HALF_HOUR`.

---

## F. Product

### F.1 Service Binding

| Property       | Value                                    |
| -------------- | ---------------------------------------- |
| Service name   | `ProductService`                         |
| Container ID   | `#product`                               |
| Load guard     | `productLoaded`                          |
| Detail icon    | `fas fa-shopping-bag`                    |
| Detail color   | `bg-color-product`                       |
| Panel          | `usePanel = true`                        |
| Default create | `{ type: "CUSTOMER", active: true, billType: "MONTH" }` |

### F.2 Grid Columns

| # | Field         | Name (i18n)           | Sortable | Width | Formatter              |
|---|---------------|-----------------------|----------|-------|------------------------|
| 1 | `id`          | `label.id`           | Yes      | 80    | *(plain)*              |
| 2 | `name`        | `product.name`       | Yes      | 100   | *(plain)*              |
| 3 | `description` | `product.description`| Yes      | 100   | *(plain)*              |
| 4 | `bookingCode` | `product.bookingCode`| Yes      | 100   | *(plain)*              |
| 5 | `type`        | `ProductTarget`      | Yes      | 80    | `Formatter.productTarget` |
| 6 | `price`       | `product.price`      | Yes      | 80    | *(plain)*              |
| 7 | `konto`       | `billing.konto`      | Yes      | 80    | *(plain)*              |
| 8 | `active`      | `product.active`     | Yes      | 80    | `Formatter.bool`       |

### F.3 Form Elements

| # | Binding           | Type            | Placeholder/Label       | Required         | Notes                     |
|---|-------------------|-----------------|-------------------------|------------------|---------------------------|
| 1 | `data.name`       | text            | `product.name` (label)  | No               |                           |
| 2 | `data.price`      | number          | --                      | No               | Euro sign prefix icon     |
| 3 | `data.active`     | checkbox (switch) | `label.active`        | No               | Default: `true`           |
| 4 | `data.type`       | select          | `ProductTarget` (label) | Yes (`mandatory`)| Options: CUSTOMER, EXPERT, EQUIPMENT |
| 5 | `data.billType`   | select          | `BillType` (label)      | No               | Options: MONTH, DAILY, WEEKDAYS |
| 6 | `data.bookingCode`| text            | `product.bookingCode`   | No               |                           |
| 7 | `data.description`| textarea        | `label.description`     | No               | Full width                |
| 8 | `data.konto`      | text            | `billing.konto` (label) | No               |                           |

### F.4 Unique Features

- **Default values on create**: `onCreate` sets `type: "CUSTOMER"`, `active: true`, `billType: "MONTH"`.
- **Custom formatter**: `Formatter.productTarget` defined in `messages.i18n.js` -- maps enum value to i18n key `ProductTarget_{VALUE}`.
- **Two enum selects**: `ProductTarget` (CUSTOMER/EXPERT/EQUIPMENT) and `BillType` (MONTH/DAILY/WEEKDAYS).
- Note: Grid shows `LOCATION` and `ANY` as possible ProductTarget values in i18n, but the form select only offers CUSTOMER/EXPERT/EQUIPMENT. The i18n defines 5 values (CUSTOMER, LOCATION, EXPERT, EQUIPMENT, ANY) but the form dropdown only has 3.

### F.5 Hardcoded Strings

- None. Uses i18n throughout.

### F.6 i18n Definitions

- `product_name`, `product_description`, `product_bookingCode`, `product_price`, `product_active`, `product_gkto`, `billing_konto`, `product_type`.
- `ProductTarget` / `ProductTarget_CUSTOMER` / `ProductTarget_LOCATION` / `ProductTarget_EXPERT` / `ProductTarget_EQUIPMENT` / `ProductTarget_ANY`.
- Custom `Formatter.productTarget` function defined in messages file.

### F.7 Cross-Module References

- **BillType** enum: MONTH, DAILY, WEEKDAYS (shared billing concept).
- **ProductTarget** enum: CUSTOMER, LOCATION, EXPERT, EQUIPMENT, ANY.

---

## G. Closed Month

### G.1 Service Binding

| Property     | Value                                    |
| ------------ | ---------------------------------------- |
| Service name | `ClosedMonthService`                     |
| Container ID | `#closedMonth`                           |
| Load guard   | `closedMonthLoaded`                      |
| Detail icon  | `fas fa-boxes`                           |
| Detail color | `bg-color-appointmentAdmin`              |
| Detail target| `primary`                                |

### G.2 Toolbar (Non-Standard)

| Button        | ID               | Icon   | Disabled | Notes                      |
|---------------|------------------|--------|----------|----------------------------|
| Edit          | `editMenuBtn`    | pencil | Yes      | Standard                   |
| Create Year   | `createYearBtn`  | plus   | No       | **Custom action** (always enabled) |

**No Add or Delete buttons** -- records are generated, not manually created/deleted.

### G.3 Grid Columns

| # | Field              | Name (i18n)                 | Sortable | Width | Formatter            |
|---|--------------------|-----------------------------|----------|-------|----------------------|
| 1 | `id`               | `label.id`                 | Yes      | 80    | *(plain)*            |
| 2 | `period`           | `ClosedMonth.period`       | Yes      | 80    | *(plain)*            |
| 3 | `closedForExpert`  | `ClosedMonth.closedForExpert`| Yes    | 120   | `Formatter.dateTime` |
| 4 | `verified`         | `ClosedMonth.verified`     | Yes      | 120   | `Formatter.dateTime` |
| 5 | `invoiced`         | `ClosedMonth.invoiced`     | Yes      | 120   | `Formatter.dateTime` |
| 6 | `comment`          | `label.comment`            | Yes      | 380   | *(plain)*            |

### G.4 Form Elements

| # | Binding               | Type     | Placeholder                    | Required | Notes              |
|---|-----------------------|----------|--------------------------------|----------|--------------------|
| -- | `data.period`        | display  | --                             | --       | Header `<h6>` span |
| 1 | `data.comment`        | textarea | `label.comment`                | No       | Full width         |
| 2 | `data.closedForExpert`| date     | `ClosedMonth.closedForExpert`  | No       | Calendar icon      |
| 3 | `data.verified`       | date     | `ClosedMonth.verified`         | No       | Calendar icon      |
| 4 | `data.invoiced`       | date     | `ClosedMonth.invoiced`         | No       | Calendar icon      |

### G.5 Unique Features

- **Generate year action**: `createYearBtn` triggers `prompt("Jahr? (YYYY)")` to get a year, then calls `ClosedMonthService.generate(year)`. Uses `alert("Done!")` on completion.
- **No Add/Delete**: Only Edit is available. Records are batch-generated by year.
- **Three date milestones**: closedForExpert, verified, invoiced -- represent a lifecycle/workflow for monthly closing.

### G.6 Hardcoded Strings

- `"Jahr? (YYYY)"` -- German prompt for year input.
- `"Done!"` -- English alert on completion.

### G.7 i18n Definitions

- `ClosedMonth_closedForExpert`, `ClosedMonth_invoiced`, `ClosedMonth_period`, `ClosedMonth_verified`.

---

## H. Expert Work Monthly

### H.1 Service Binding

| Property       | Value                                    |
| -------------- | ---------------------------------------- |
| Service name   | `ExpertWorkMonthlyService`               |
| Container ID   | `#expertWorkMonthly`                     |
| Load guard     | `expertWorkMonthlyLoaded`                |
| Detail icon    | `fas fa-file-chart-line`                 |
| Detail color   | `bg-color-expertWorkMonthly`             |
| Detail width   | `1000`                                   |
| Panel          | `usePanel = true`                        |
| Default action | `#viewMenuBtn` (view, not edit)          |
| Data limit     | `300` (higher than standard)             |

### H.2 Toolbar (Non-Standard)

| Button       | ID                  | Icon     | Disabled | Auth/Role                    | Notes                  |
|-------------|---------------------|----------|----------|------------------------------|------------------------|
| View        | `viewMenuBtn`       | file     | Yes      | --                           | Default action         |
| Edit        | `editMenuBtn`       | pencil   | Yes      | `EXPERTWORKMONTHLY_CREATE`   | Auth-gated             |
| Regenerate  | `regenerateMenuBtn` | pencil   | Yes      | `EXPERTWORKMONTHLY_CREATE`   | Auth-gated             |
| Download    | `downloadMenuBtn`   | download | Yes      | --                           | XLS download           |
| Send        | `sendMenuBtn`       | envelope | Yes      | --                           | Email send             |
| Export      | `exportWorkMenuBtn` | table    | No       | `EXPERTWORKMONTHLY_CREATE` (role) | ZIP export         |

**No Add or Delete buttons.**

### H.3 Year/Month Filter (Above Grid)

- Year: `<input type="number" id="year">` -- defaults to previous month's year (handles January rollover).
- Month: `<select id="month">` -- 12 month options using `i18n.Month.JAN..DEC`. Defaults to previous month.
- Both trigger grid reload on change.
- Month select is **admin-only** (`{{#isAdmin}}`).

### H.4 Grid Columns

| # | Field              | Name (i18n)                     | Sortable | Width | Formatter              | Condition    |
|---|--------------------|---------------------------------|----------|-------|------------------------|--------------|
| 1 | `id`               | `label.id`                     | Yes      | 80    | *(plain)*              | Always       |
| 2 | `year`             | `year`                         | Yes      | 80    | *(plain)*              | Always       |
| 3 | `month`            | `month`                        | Yes      | 80    | `Formatter.month`      | Always       |
| 4 | `doctorName`       | `user`                         | Yes      | 180   | `Formatter.name`       | Always       |
| 5 | `bookingReference` | `expertWorkMonthly.bookingReference` | Yes | 180   | *(plain)*              | Always       |
| 6 | `total`            | `total`                        | Yes      | 80    | `Formatter.currency`   | Admin only   |
| 7 | `dateSent`         | `EquipmentStatus.SENT`         | Yes      | 180   | `Formatter.dateTime`   | Admin only   |
| 8 | `dateReceived`     | `expertWorkMonthly.dateReceived`| Yes     | 180   | `Formatter.dateTime`   | Admin only   |
| 9 | `datePaid`         | `expertWorkMonthly.datePaid`   | Yes      | 180   | `Formatter.dateTime`   | Admin only   |

### H.5 Form Elements (Detail Header)

| # | Binding                | Type      | Notes                                     |
|---|------------------------|-----------|--------------------------------------------|
| 1 | `data.month`           | select (disabled) | Month dropdown, read-only             |
| 2 | `data.year`            | display   | Span                                       |
| 3 | `data.doctorName`      | display   | Span                                       |
| 4 | `data.employeeType`    | display   | Span, admin-only                           |
| 5 | `data.comment`         | textarea  | Admin-only                                 |
| 6 | `data.bookingReference`| text      | Title: "Reference Number for accounting system..." |
| 7 | `data.dateCreated`     | display (date) | Calendar icon                         |
| 8 | `data.received`        | display (date) | Envelope icon                         |
| 9 | `data.datePaid`        | display (date) | Money icon                            |

### H.6 Form Elements -- Nested Collection (`data.worklog`)

Read-only table of work log entries with admin-conditional columns.

| # | Binding                   | Type          | Condition  | Notes                    |
|---|---------------------------|---------------|------------|--------------------------|
| 1 | `worklog.start`           | display (date)| Always     |                          |
| 2 | `worklog.job.expertTitle` | display       | Always     | Service/job title        |
| 3 | `worklog.location`        | display       | Always     | Location/service name    |
| 4 | `worklog.actualWorkTime`  | display (humantime) | Admin only |                    |
| 5 | `worklog.payableWorkTime` | display (humantimeday) | Always | Custom formatter    |
| 6 | `worklog.actualPatients`  | display       | Admin only |                          |
| 7 | `worklog.payablePatients` | display       | Always     |                          |
| 8 | `worklog.total`           | display (currency) | Admin only |                     |
| 9 | `worklog.checked`         | checkbox (bool) | Admin only | Editable                |
| -- | `data.total`             | display (currency) | Admin only | Summary in header   |

### H.7 Export Status Dialog

Separate modal dialog (`#exportStatusDlg`) with:
- Progress bar with percentage polling (`getStatus` called every 1.8s).
- On completion: auto-downloads ZIP file, shows download link.
- Triggered by Export button via `prepareZip` service call.

### H.8 Unique Features

- **Most complex module in this entire batch.** Not a simple CRUD at all.
- **Role-based visibility**: `{{#isAdmin}}` conditionals hide columns, form fields, and toolbar buttons from non-admin users.
- **Auth-gated buttons**: `EXPERTWORKMONTHLY_CREATE` permission for edit/regenerate/export.
- **Year/month filter**: Dynamic filter above grid with auto-previous-month defaults using Luxon.
- **Regenerate action**: Calls `generateWorkLog(userId, year, month, false)` to regenerate a single expert's work log.
- **Send action**: Bulk sends work reports for all selected entries.
- **Download action**: Direct XLS file download via URL `/get/ExpertWorkMonthlyService/download/{id}/false/Videoclinic-{year}_{month}.xls`.
- **Export ZIP**: Bulk export with progress polling dialog.
- **Custom formatter**: `Formatter.humantimeDayFormatter` in `messages.i18n.js` -- converts day fraction to human-readable time (`value * 24 * 3600000` then formats).
- **Higher data limit**: 300 records instead of the standard 100.
- Default action is **View** (not Edit).

### H.9 Hardcoded Strings

- `"Start"` -- table header (German/English).
- `"Dienstleistung"` -- table header (German: "Service").
- `"Ort/Dienst"` -- table header (German: "Location/Service").
- `"Arbeits Zeit"` -- table header (German: "Work Time"), admin-only.
- `"Abrechnungszeit"` -- table header (German: "Billing Time").
- `"beh. Patienten"` -- table header (German: "treated Patients"), admin-only.
- `"abr. Patienten"` -- table header (German: "billed Patients").
- `"Fertig!"` -- German alert on export completion.
- `"done"` -- English alert on send completion.
- `"Processing..."` -- export dialog text.
- `"Reference Number for accounting system e.g. invoice number, internal booking number, etc."` -- title attribute (English).
- `"Videoclinic-"` -- hardcoded filename prefix for XLS download.
- `"Export-"` -- hardcoded filename prefix for ZIP export.

### H.10 i18n Definitions

- Custom `Formatter.humantimeDayFormatter` function.
- References shared: `Month.JAN..DEC`, `EquipmentStatus.SENT`, `expertWorkMonthly.bookingReference`, `expertWorkMonthly.dateReceived`, `expertWorkMonthly.datePaid`.

### H.11 Cross-Module References

- **User/Expert**: `data.doctorName`, `data.employeeType`, `data.user.id`.
- **Job**: `worklog.job.expertTitle`.
- **ClosedMonth**: Conceptually related (monthly period closing).
- **Luxon**: Uses `luxon.DateTime.now()` for date calculations.

---

## Wireframe Reference (ASCII)

> Full wireframe: [`specs/wireframes/accounting/workflows.md#w6-accounting-config`](../../../wireframes/accounting/workflows.md#w6-accounting-config)

```
┌─────────────────────── Accounting Configuration ────────────────────────────┐
│                                                                             │
│ [Storno Groups] [Price Lists] [Products] [Closed Months] [Expert Work Mth] │
│                                                                             │
│ ═══ Storno Groups (selected) ═══                                            │
│                                                                             │
│ [+ Add] [✎ Edit] [✕ Delete]               │  Standard Storno                │
│ ┌────┬──────────────┬──────────┐           │  Group Name *: [Standard Storno]│
│ │ #  │ Name         │ Rules    │           │                                 │
│ ├────┼──────────────┼──────────┤           │  Storno Rules [repeats]         │
│ │ 1  │Standard Strno│ 3 rules  │ ←selected │  [nested: group → rules]        │
│ │ 2  │Emergency Ptn │ 1 rule   │           │  ┌──────┬──────┬────────┬───┐  │
│ └────┴──────────────┴──────────┘           │  │ Days │  %   │ Amount │ ✕ │  │
│                                             │  ├──────┼──────┼────────┼───┤  │
│                                             │  │  7   │ 100% │       │ ✕ │  │
│                                             │  │ 14   │  50% │       │ ✕ │  │
│                                             │  │ 30   │  75% │       │ ✕ │  │
│                                             │  └──────┴──────┴────────┴───┘  │
│                                             │          [Cancel]  [Save]      │
└─────────────────────────────────────────────────────────────────────────────┘
  Other tabs: Price Lists (job-type prices), Products (8 fields),
  Closed Months [batch: generated] (3 milestones, no add/delete),
  Expert Work Monthly [cond: role=ADMIN|ACCOUNTING] (ZIP export, polling)
```
