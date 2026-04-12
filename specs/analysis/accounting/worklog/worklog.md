---
title: 'Worklog'
---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| split | **Sibling** | Same source: `utility/worklog-templates-files.md` | [Invoice Receiver](../../accounting/invoice-receiver/invoice-receiver.md) | Section 6 (Invoice Receiver) extracted to sibling |
| split | **Sibling** | Same source: `utility/worklog-templates-files.md` | [Templates Files](../../system/templates-files/templates-files.md) | Sections 2–4 (Export/Notification/User File) extracted to sibling |
| split | **Sibling** | Same source: `utility/worklog-templates-files.md` | [User Video History](../../orphan/user-video-history.md) | Section 5 (User Video History) extracted to sibling |

### Service Calls

| Service | Method | Parameters | Dialog / Context |
|---------|--------|------------|------------------|
| `WorklogService` | `getAll` | `[month, year]` | Worklog List grid load |
| `WorkExportService` | `generateWeeklyWork` | `[start, end, type]` | Weekly Assignments grid load |
| `InvoiceService` | `downloadExport` | `/{year}/{month}` | Export XLS via navbar button |
| `InvoiceService` | `prepareZip` | `[{year, month}]` | ZIP download: queues job, monitors status, downloads result |

### Event Flows

| Type | Direction | Event | Linked Document | Condition |
|------|-----------|-------|-----------------|-----------|
| event | **Outgoing** | `InvoiceDetails.open(id, "view")` | [Invoice Details](../../accounting/invoice/invoice-details.md) | Show Invoice row action |
| event | **Outgoing** | `InvoiceDetails.open(id, "change")` | [Invoice Details](../../accounting/invoice/invoice-details.md) | Edit Invoice row action |

> **Split origin:** This file and [Invoice Receiver](../../accounting/invoice-receiver/invoice-receiver.md), [Templates Files](../../system/templates-files/templates-files.md), and [User Video History](../../orphan/user-video-history.md) were all extracted from `utility/worklog-templates-files.md`. This file covers Worklog List and Weekly Assignments (sections 1, 7, 8).

---

## 1. Worklog (`worklog/`)

### 1.1 Overview

Two sub-views sharing one module directory:

| Sub-view | Template | JS | Service | Description |
|---|---|---|---|---|
| **Worklog List** | `index.htmlm` | `index.js` | `WorklogService.getAll` | Monthly work log entries with invoice actions |
| **Weekly Assignments** | `weeklyAssignments.htmlm` | `weeklyAssignments.js` | `WorkExportService.generateWeeklyWork` | Weekly assignment matrix (expert x day-of-week x shift) |

### 1.2 Worklog List -- Grid Columns

| # | Field | Name (DE) | Sortable | Width | Formatter | Notes |
|---|---|---|---|---|---|---|
| 1 | `id` | Id | Yes | 100 | -- | |
| 2 | `type` | Art der Leistung | Yes | 380 | `Formatter.name` | Service type |
| 3 | `type` | Arzt | Yes | 380 | `Formatter.name` | Duplicate field binding (doctor) |
| 4 | `location` | JVA | Yes | 380 | `Formatter.name` | Prison/location |
| 5 | `type` | Abrechnung-Zeit | Yes | 80 | `Formatter.humantime` | Billing time |
| 6 | `type` | Behandelte Patienten | Yes | 80 | -- | Treated patients count |
| 7 | `type` | Betrag | Yes | 100 | `Formatter.currency` | Amount |
| 8 | `type` | Hinweise | Yes | 300 | -- | Notes/remarks |

**NOTE**: Columns 2-8 all bind to `type` field -- this is likely a legacy bug or the server returns a flat object where these fields are nested under different actual properties. The grid column definitions appear incomplete/copy-pasted.

### 1.3 Worklog List -- Toolbar (Month/Year Selector)

| Element | Type | ID | Default Value | Notes |
|---|---|---|---|---|
| Year | `<input type="number">` | `#year` | Current year (or prev year if January) | Width 100px |
| Month | `<select>` | `#month` | Current month - 1 (or 12 if January) | i18n month names `{{i18n.Month.JAN}}` .. `{{i18n.Month.DEC}}` |

**Behavior**: Changing month triggers grid reload. Date range is computed as `[1st of month 00:00:01, 1st of next month)` using Luxon `DateTime.fromObject` -> `toMillis()`.

### 1.4 Worklog List -- Click Actions

| # | Action ID | Symbol | Title (DE) | English | Notes |
|---|---|---|---|---|---|
| 1 | `exportInvoicesMenuBtn` | `table` | Export | Export | Navbar button; opens export dialog |
| 2 | `showInvoiceMenuBtn` | -- | -- | Show Invoice | Row-selected; opens `InvoiceDetails.open` in "view" mode |
| 3 | `editInvoiceMenuBtn` | -- | -- | Edit Invoice | Row-selected; opens `InvoiceDetails.open` in "change" mode |
| 4 | `printInvoiceMenuBtn` | -- | -- | Print Invoice | Calls `printInvoice(entry)` |
| 5 | `printOdtInvoiceMenuBtn` | -- | -- | Print ODT Invoice | Calls `printInvoice(entry, true)` |
| 6 | `exportInvoicesMenuBtn` (dialog) | -- | -- | Export Invoices | Downloads XLS via `InvoiceService/downloadExport/{year}/{month}` |
| 7 | `downloadInvoicesMenuBtn` | -- | -- | Download Invoices ZIP | Calls `InvoiceService.prepareZip` then downloads ZIP |
| Row double-click | -- | -- | -- | -- | Triggers `showInvoiceMenuBtn.click()` |

### 1.5 Weekly Assignments -- Grid Columns

A matrix grid: rows = experts, columns = day-of-week x shift (morning/afternoon/night).

| # | Field | Name (DE) | Width | Formatter | Notes |
|---|---|---|---|---|---|
| 1 | `expertName` | Name | 250 | -- | Expert/doctor name |
| 2 | `countMorning` | Mo/Mo | 50 | `Formatter.countMo` | Monday Morning |
| 3 | `countAfternoon` | Mo/NM | 50 | `Formatter.countMo` | Monday Afternoon |
| 4 | `countNight` | Mo/Na | 50 | `Formatter.countMo` | Monday Night |
| 5 | `countMorning` | Di/Mo | 50 | `Formatter.countTu` | Tuesday Morning |
| 6 | `countAfternoon` | Di/NM | 50 | `Formatter.countTu` | Tuesday Afternoon |
| 7 | `countNight` | Di/Na | 50 | `Formatter.countTu` | Tuesday Night |
| 8 | `countMorning` | Mi/Mo | 50 | `Formatter.countWe` | Wednesday Morning |
| 9 | `countAfternoon` | Mi/NM | 50 | `Formatter.countWe` | Wednesday Afternoon |
| 10 | `countNight` | Mi/Na | 50 | `Formatter.countWe` | Wednesday Night |
| 11 | `countMorning` | Do/Mo | 50 | `Formatter.countTh` | Thursday Morning |
| 12 | `countAfternoon` | Do/NM | 50 | `Formatter.countTh` | Thursday Afternoon |
| 13 | `countNight` | Do/Na | 50 | `Formatter.countTh` | Thursday Night |
| 14 | `countMorning` | Fr/Mo | 50 | `Formatter.countFr` | Friday Morning |
| 15 | `countAfternoon` | Fr/NM | 50 | `Formatter.countFr` | Friday Afternoon |
| 16 | `countNight` | Fr/Na | 50 | `Formatter.countFr` | Friday Night |
| 17 | `countMorning` | Sa/Mo | 50 | `Formatter.countSa` | Saturday Morning |
| 18 | `countAfternoon` | Sa/NM | 50 | `Formatter.countSa` | Saturday Afternoon |
| 19 | `countNight` | Sa/Na | 50 | `Formatter.countSa` | Saturday Night |
| 20 | `countMorning` | So/Mo | 50 | `Formatter.countSu` | Sunday Morning |
| 21 | `countAfternoon` | So/NM | 50 | `Formatter.countSu` | Sunday Afternoon |
| 22 | `countNight` | So/Na | 50 | `Formatter.countSu` | Sunday Night |

**Data shape**: Each row contains `countMorning`, `countAfternoon`, `countNight` objects with day-of-week keys (`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`). Formatters extract the day key from the value object.

### 1.6 Weekly Assignments -- Toolbar

| Element | Type | ID | Default | Notes |
|---|---|---|---|---|
| Start date | `<input type="date">` | `#start` | 1st of current month | |
| End date | `<input type="date">` | `#end` | 1st of next month | |
| Type filter | `<select>` | `#type` | `null` (all) | Options: APPOINTMENT, SHIFT, COUNCIL |

**Behavior**: Any change triggers grid reload. Service call: `WorkExportService.generateWeeklyWork(start, end, type)`.

### 1.7 Worklog -- Special Components

| Component | Description | Implementation |
|---|---|---|
| Month/Year Selector | Toolbar with year number input + month dropdown | Same pattern as invoice list; Luxon date math |
| Invoice Details Dialog | Embedded `InvoiceDetails.open()` | Cross-module: opens invoice detail panel in view/change mode |
| Export Dialog | Year/month export to XLS | Downloads via `InvoiceService/downloadExport/{year}/{month}/{name}.xls` |
| ZIP Download | Batch invoice PDF download | `InvoiceService.prepareZip` -> job status dialog -> download ZIP |

### 1.8 Worklog -- Translation Table

| Text-Reference | German | English | Notes |
|---|---|---|---|
| Column: Art der Leistung | Art der Leistung | Type of Service | HARDCODED in grid HTML |
| Column: Arzt | Arzt | Doctor | HARDCODED in grid HTML |
| Column: JVA | JVA | Prison | HARDCODED in grid HTML |
| Column: Abrechnung-Zeit | Abrechnung-Zeit | Billing Time | HARDCODED in grid HTML |
| Column: Behandelte Patienten | Behandelte Patienten | Treated Patients | HARDCODED in grid HTML |
| Column: Betrag | Betrag | Amount | HARDCODED in grid HTML |
| Column: Hinweise | Hinweise | Notes | HARDCODED in grid HTML |
| `i18n.Month.JAN` .. `i18n.Month.DEC` | Januar .. Dezember | January .. December | Month names for selector |
| `i18n.appointment` | Termin | Appointment | Weekly assignments type filter |
| `i18n.shift` | Schicht | Shift | Weekly assignments type filter |
| `i18n.council` | Konsil | Council | Weekly assignments type filter |
| Column: Mo/Mo, Mo/NM, Mo/Na, etc. | Mo/Mo, Mo/NM, Mo/Na | Mon/AM, Mon/PM, Mon/Night | HARDCODED abbreviations (day/shift) |
| Navbar: Export | Export | Export | Navbar button label |

---

## 7. Summary of Cross-Module Dependencies (Worklog)

```
worklog
    |-- InvoiceDetails.open()        (view/change invoice)
    |-- InvoiceService               (downloadExport, downloadZip, prepareZip)
    |-- WorkExportService            (generateWeeklyWork)
```

## 8. Shared Patterns Across All Modules

| Pattern | Description | Used In |
|---|---|---|
| `Core.initCrud` | Standard CRUD initialization (grid + detail + service) | All 6 modules |
| `slickerGrid` | jQuery grid plugin with data service binding | All 6 modules |
| `Core.hasLoaded` | Guard against duplicate initialization | All 6 modules |
| `saveSettings` | Persist grid column settings via `UserService.saveSetting` | All 6 modules |
| `data-formatter` | Declarative column formatting in HTML grid definitions | All 6 modules |
| `Formatter.name` | Display `.name` property of object fields | worklog, userVideoHistory, invoiceReceiver |
| `Formatter.dateTime` | Date/time formatting | userFile, userVideoHistory, invoiceReceiver |
| `Formatter.bool` | Boolean display (checkmark/cross) | exportTemplate, userFile |
| `Formatter.currency` | Currency formatting | worklog |
| `jsForm` | jQuery form data binding (fill/getData) | exportTemplate, invoiceReceiver |
| `Dialog.init` / `Dialog.open` | Modal dialog management | worklog, invoiceReceiver, userVideoHistory |

---

## Wireframe Reference (ASCII)

> Full wireframe: [`specs/wireframes/accounting/workflows.md#w3-worklog`](../../../wireframes/accounting/workflows.md#w3-worklog)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ▌Worklog                                    Month: [March ▾] Year: [2025] │
├────────────────────────────────────────────────────────────────────────────┤
│ [View][Edit Structure][PerMonth][MonthGST]          [Export XLS][ZIP DL]  │
├────┬──────────────┬────────┬──────┬──────┬──────┬────────┬────────────────┤
│ ID │ Type of Svc  │ Doctor │ JVA  │ Time │ Pts  │ Amount │ Notes          │
├────┼──────────────┼────────┼──────┼──────┼──────┼────────┼────────────────┤
│1819│Shift-Morning │Lt Muhr │K Bln │08:00 │ 12   │€1,108  │Regular shift   │
│1820│Appointment-1 │P.Schul │JA Hbg│02:30 │  3   │€ 220   │                │
├────┴──────────────┴────────┴──────┴──────┴──────┴────────┴────────────────┤
│ Showing 1-2 of 18 entries                                                │
├──────────────────────────────────────────────────────────────────────────-┤
│                                                                          │
│ Weekly Assignments Matrix [matrix: 7d×3shifts]                           │
│ Start: 2026-03-01  End: 2026-07-06  Type: [All ▾]                        │
│ ┌────────┬──Mon──┬──Tue──┬──Wed──┬──Thu──┬──Fri──┬──Sat──┬──Sun──┐       │
│ │ Expert │ M A N │ M A N │ M A N │ M A N │ M A N │ M A N │ M A N │       │
│ ├────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤       │
│ │Dr.Muhr │ ✓ - - │ ✓ - - │ - ✓ - │ - - - │ ✓ - - │ - - - │ - - - │       │
│ └────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┘       │
└──────────────────────────────────────────────────────────────────────────┘
```
