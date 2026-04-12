---
title: 'Invoice Receiver'
---

---
---

> **Split from**: `utility/worklog-templates-files.md`
> **Sections extracted here**: 6. Invoice Receiver (6.1–6.11), 7. Summary of Cross-Module Dependencies (invoiceReceiver entry), 8. Shared Patterns Across All Modules
> **Other domains received**: `accounting/worklog/worklog.md` got sections 1 (Worklog) + cross-module (worklog entry); `system/templates-files/templates-files.md` got sections 2 (Export Template), 3 (Notification Template), 4 (User File) + cross-module entries; `academy/video-history/user-video-history.md` got section 5 (User Video History) + cross-module entry

---

## 6. Invoice Receiver (`invoiceReceiver/`)

### 6.1 Overview

CRUD management for invoice recipients (customers/locations that receive invoices). Service: `InvoiceReceiverService`. Complex detail form with two tabs: receiver address and product orders. Integrates with invoice creation and worklog exports.

### 6.2 Grid Columns

| # | Field | Name | Sortable | Width | Formatter | Notes |
|---|---|---|---|---|---|---|
| 1 | `id` | `{{i18n.label.id}}` | Yes | 40 | -- | |
| 2 | `customer` | `{{i18n.customer}}` | Yes | 200 | `Formatter.name` | Customer entity |
| 3 | `location` | `{{i18n.location}}` | Yes | 200 | `Formatter.name` | Location entity |
| 4 | `state` | `{{i18n.location.state}}` | Yes | 200 | -- | State/province |
| 5 | `dateLastInvoice` | `{{i18n.invoiceReceiver.dateLastInvoice}}` | Yes | 160 | `Formatter.dateTime` | Last invoice date |
| 6 | `addressDto` | `{{i18n.invoiceReceiver.address}}` | Yes | 360 | `Formatter.address` | Full address |

### 6.3 Form Elements -- Tab 1: Payment Contact (`#tabInvoiceReceiver`)

| # | Field Name | Label | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | `data.customer` | `{{i18n.customer}}` | autocomplete object | -- | `CustomerService.autocomplete`; mutually exclusive with location |
| 2 | `data.location` | `{{i18n.location}}` | autocomplete object | -- | `LocationService.autocomplete`; mutually exclusive with customer |
| 3 | `data.address` | `{{i18n.contact.street}}` | text input | -- | Auto-filled from customer/location |
| 4 | `data.address2` | `{{i18n.contact.street2}}` | text input | -- | Auto-filled |
| 5 | `data.zip` | `{{i18n.contact.zipcode}}` | text input | -- | `searchZipCode` class; auto-filled |
| 6 | `data.state` | `{{i18n.contact.state}}` | text input | -- | Auto-filled |
| 7 | `data.city` | `{{i18n.contact.city}}` | text input | -- | Auto-filled |
| 8 | `data.country` | `{{i18n.contact.country}}` | text input | -- | Auto-filled |
| 9 | `data.addressInfo` | `{{i18n.address.additional.text}}` | textarea | -- | Additional address info |
| 10 | `data.firstName` | `{{i18n.contact.firstName}}` | text input | -- | Contact person |
| 11 | `data.lastName` | `{{i18n.contact.lastName}}` | text input | -- | Contact person |
| 12 | `data.email` | `{{i18n.contact.primaryemail}}` | email input | -- | Primary email |
| 13 | `data.extraEmail` | `{{i18n.invoiceReceiver.moreEMail}}` | collection (email inputs) | -- | Dynamic list with add/delete |
| 14 | `data.phone` | `{{i18n.contact.workphone}}` | text input | -- | Icon: `fa-phone-office` |
| 15 | `data.faxNumber` | `{{i18n.contact.faxnumber}}` | text input | -- | Icon: `fa-fax` |
| 16 | `data.title` | `{{i18n.label.title}}` | text input | -- | Invoice title |
| 17 | `data.extraTitle` | `{{i18n.invoiceReceiver.extraTitle}}` | textarea | -- | Extra title text |
| 18 | `data.paymentGoal` | `{{i18n.invoiceReceiver.paymentGoal}}` | text input | mandatory | Payment terms (days) |
| 19 | `data.appointmentStorno` | `{{i18n.invoiceReceiver.appointmentStorno}}` | select (object) | -- | `StornoGroupService.getAll`; storno group |
| 20 | `data.shiftStorno` | `{{i18n.invoiceReceiver.shiftStorno}}` | select (object) | -- | Storno group for shifts |
| 21 | `data.councilStorno` | `{{i18n.invoiceReceiver.councilStorno}}` | select (object) | -- | Storno group for councils |
| 22 | `data.skontoPaymentGoal` | `{{i18n.invoiceReceiver.skonto}}` | text input | mandatory | Skonto payment days |
| 23 | `data.skontoPaymentPercentage` | (percent suffix) | percent input | mandatory | Skonto discount percentage |
| 24 | `data.taxType` | Steuersatz | select | -- | Tax rate type (5 options, see below) |
| 25 | `data.gkto` | `{{i18n.billing.gkto}}` | text input | -- | Contra account number |
| 26 | `data.leitwegId` | `{{i18n.productOrder.leitwegId}}` | text input | -- | E-invoicing routing ID |
| 27 | `data.mailInvoice` | `{{i18n.invoiceReceiver.mailInvoice}}` | checkbox switch | -- | Send invoice by email |
| 28 | `data.postInvoice` | `{{i18n.invoiceReceiver.postInvoice}}` | checkbox switch | -- | Send invoice by post |
| 29 | `data.active` | `{{i18n.invoiceReceiver.active}}` | checkbox switch | -- | Active status |
| 30 | `data.workLog` | `{{i18n.invoiceReceiver.generateWorkLog}}` | select | -- | WorkLog type: STANDARD, EXTENDED (label has strikethrough -- deprecated?) |
| 31 | `data.worklogExports` | `{{i18n.invoiceReceiver.generateWorkLog}}` | collection (list) | -- | Worklog export configurations (template + type + name) |
| 32 | `data.iban` | IBAN | text input | -- | HARDCODED label |
| 33 | `data.bank` | `{{i18n.address.bank}}` | text input | -- | Bank name |
| 34 | `data.bic` | `{{i18n.address.bic}}` | text input | -- | BIC/SWIFT code |
| 35 | `data.dateLastInvoice` | `{{i18n.invoiceReceiver.dateLastInvoice}}` | read-only date span | -- | Display only |

### 6.4 Form Elements -- Tab 2: Product Order (`#tabProductOrder`)

**Flat Rate Toggles**:

| # | Field Name | Label | Type |
|---|---|---|---|
| 1 | `data.flatRateShift` | `{{i18n.AppointmentType.SHIFT}}` | checkbox switch |
| 2 | `data.flatRateAppointment` | `{{i18n.AppointmentType.APPOINTMENT}}` | checkbox switch |
| 3 | `data.flatRateCouncil` | `{{i18n.AppointmentType.COUNCIL}}` | checkbox switch |
| 4 | `data.flatRateTreatment` | `{{i18n.AppointmentType.TREATMENT}}` | checkbox switch |
| 5 | `data.flatRateTreatmentReport` | `{{i18n.AppointmentType.TREATMENT_REPORT}}` | checkbox switch |

**Product Collection Table** (`data.products`):

| # | Column | Field Name | Type | Notes |
|---|---|---|---|---|
| 1 | Amount | `products.amount` | number input (50px) | Triggers total recalculation |
| 2 | Product | `products.product.name` | read-only span | Set via autocomplete (`ProductService.autocomplete`, filter `"CUSTOMER"`) |
| 3 | Start | `products.start` | date input | |
| 4 | Until | `products.until` | date input | |
| 5 | Description | `products.description` | text input | |
| 6 | Comment | `products.comment` | text input | |
| 7 | Price | `products.product.price` | read-only span (currency) | Product base price |
| 8 | Adjusted Price | `products.adjustedPrice` | number/currency input (80px) | Override price |
| 9 | Total | (calculated) | read-only span | `amount * adjustedPrice` (or base price if no adjusted) |
| 10 | Delete | -- | trash icon | Removes product row |
| 11 | Sort | -- | sort handle icon | Drag-and-drop reordering |

### 6.5 Tax Type Enum (HARDCODED)

| Enum Value | Display (DE) | Tax Rate | Notes |
|---|---|---|---|
| `SATZ_NORMAL` | Satz-Normal | 0.19 (19%) | HARDCODED |
| `SATZ_ERMAESSIGT_1` | Satz-Ermaessigt-1 | 0.10 (10%) | HARDCODED |
| `SATZ_ERMAESSIGT_2` | Satz-Ermaessigt-2 | 0.15 (15%) | HARDCODED |
| `SATZ_NULL` | Satz-Null | 0.00 (0%) | HARDCODED |
| `SATZ_BESONDERS` | Satz-Besonders | 0.20 (20%) | HARDCODED |

### 6.6 Click Actions

| # | Action ID | Symbol | Title | English | Notes |
|---|---|---|---|---|---|
| 1 | `addMenuBtn` | `plus-square` | `action.add` | Add | Create new receiver |
| 2 | `editMenuBtn` | `pencil` | `action.change` | Edit | Initially disabled |
| 3 | `deleteMenuBtn` | `trash` | `action.delete` | Delete | Initially disabled |
| 4 | `invoiceCreateMenuBtn` | `file-invoice` | `action.invoice` | Create Invoice | Disabled until row selected; creates invoice for last month |
| 5 | `invoicesCreateMenuBtn` | `receipt` | `action.createDirectly` | Create All Invoices | Creates invoices for ALL selected receivers |
| 6 | `exportMenuBtn` | `file-export` | `action.export` | Export | Downloads XLS: `/get/InvoiceReceiverService/export/InvoiceReceiverlist-{date}.xls` |
| 7 | `addWorklogExport` | `plus` | -- | Add Worklog Export | Opens `addWorklogExportDlg` modal |
| 8 | `addCustomerProduct` | `plus` | -- | Add Product | Prefills product from autocomplete to product list |

### 6.7 Filter Panel (Offcanvas)

| # | Field | Type | Notes |
|---|---|---|---|
| 1 | `data.active` | checkbox switch | Label: "Active" (HARDCODED English) |
| 2 | Max Results | select | Options: 100 (default), 150, 200, 300, 500 |
| 3 | Apply button | button | `{{i18n.button.apply}}` |
| 4 | Reset button | button | `{{i18n.button.reset}}` |

### 6.8 Worklog Export Dialog (`#addWorklogExportDlg`)

| # | Field Name | Label | Type | Notes |
|---|---|---|---|---|
| 1 | `data.template` | `{{i18n.exportTemplate.template}}` | autocomplete object | `ExportTemplateService.autocomplete`, filter `["WORKLOG"]` |
| 2 | `data.type` | -- | select | Options: ALL, APPOINTMENT, SHIFT, TREATMENT, TREATMENT_REPORT, COUNCIL |
| 3 | `data.name` | `{{i18n.label.title}}` | text input | Export name |

### 6.9 Special Components

| Component | Description | Implementation |
|---|---|---|
| Customer/Location Mutual Exclusion | Selecting customer clears location and vice versa | `change` + `itemSelected` event handlers on autocomplete inputs |
| Address Auto-Fill | Selecting customer/location fills address fields | `CustomerService.get` or direct pojo data for fields: address, zip, state, city, address2, email, country |
| Product Collection Table | Dynamic table with add/remove/sort | `jsForm` collection with `sort sortable` class; `postAddCollection` event for total calculation |
| Invoice Creation | Creates monthly invoice for receiver | `createMonthlyInvoice({receiver, year, month})` using previous month; redirects to `invoice.html` on completion |
| Batch Invoice Creation | Creates invoices for all selected receivers | Same as above but passes `$this.data().entries` (all grid data) |
| StornoGroup Dropdowns | Three select fields for appointment/shift/council storno rules | Data from `StornoGroupService.getAll`; rendered as server-side `<option>` elements |
| Embedded Invoice Dialog | Invoice details panel | Template include: `{{> invoiceDlg}}` from `../invoice/invoiceDetails.html` |
| Job Status Dialog | Async job monitoring | Template include: `{{> jobStatusDlg}}` |
| Worklog Export Collection | Dynamic list of worklog export configs | Each entry has template (ExportTemplate), type (AppointmentType), and name |
| Extra Email Collection | Dynamic add/remove email list | `data.extraEmail` collection with trash delete |

### 6.10 Cross-Module References

| Reference | Source | Target | Mechanism |
|---|---|---|---|
| Invoice Details | invoiceReceiver | `invoice/invoiceDetails.html` | Mustache template include `{{> invoiceDlg}}` |
| Invoice Creation | invoiceReceiver | `InvoiceService` | `createMonthlyInvoice()` function; redirects to `invoice.html` |
| StornoGroups | invoiceReceiver | `StornoGroupService` | Server-rendered `<option>` elements for 3 dropdowns |
| Export Templates | invoiceReceiver | `ExportTemplateService` | Autocomplete in worklog export dialog, filtered by `["WORKLOG"]` |
| Products | invoiceReceiver | `ProductService` | Autocomplete filtered by `"CUSTOMER"` |
| Customers | invoiceReceiver | `CustomerService` | Autocomplete + `get` for address fill |
| Locations | invoiceReceiver | `LocationService` | Autocomplete + address data from pojo |
| Job Status | invoiceReceiver | `jobStatusDlg.html` | Template include for async job monitoring |
| Site Loader | invoiceReceiver | `siteloader.mustache` | Template include; `initGenericLoader()` called |

### 6.11 Translation Table

| Text-Reference | German | English | Notes |
|---|---|---|---|
| `i18n.customer` | Kunde | Customer | |
| `i18n.location` | Standort | Location | NOTE: messages.i18n.js maps this to `$[customer]` (possible bug) |
| `i18n.location.state` | Bundesland | State | |
| `i18n.invoiceReceiver.dateLastInvoice` | Letzte Rechnung | Last Invoice Date | |
| `i18n.invoiceReceiver.address` | Adresse | Address | |
| `i18n.invoice.paymentContact` | Rechnungsempfaenger | Payment Contact | Tab 1 / panel title |
| `i18n.invoice.productOrder` | Produktbestellung | Product Order | Tab 2 title |
| `i18n.invoiceReceiver.moreEMail` | Weitere E-Mail | More Email | |
| `i18n.invoiceReceiver.extraTitle` | Zusaetzlicher Titel | Extra Title | |
| `i18n.invoiceReceiver.paymentGoal` | Zahlungsziel | Payment Goal | |
| `i18n.invoiceReceiver.appointmentStorno` | Storno Termin | Appointment Cancellation | |
| `i18n.invoiceReceiver.shiftStorno` | Storno Schicht | Shift Cancellation | |
| `i18n.invoiceReceiver.councilStorno` | Storno Konsil | Council Cancellation | |
| `i18n.invoiceReceiver.skonto` | Skonto | Early Payment Discount | |
| `i18n.invoiceReceiver.skonto.days` | Tage | days | Suffix after skonto input |
| `i18n.invoiceReceiver.mailInvoice` | Rechnung per E-Mail | Mail Invoice | |
| `i18n.invoiceReceiver.postInvoice` | Rechnung per Post | Post Invoice | |
| `i18n.invoiceReceiver.active` | Aktiv | Active | |
| `i18n.invoiceReceiver.generateWorkLog` | Arbeitsnachweis generieren | Generate Work Log | |
| `i18n.invoiceReceiver.flatRate` | Pauschale | Flat Rate | |
| `i18n.billing.gkto` | Gegenkonto | Contra Account | |
| `i18n.productOrder.leitwegId` | Leitweg-ID | Routing ID | E-invoicing |
| `i18n.productOrder.start` | Start | Start | Product order date |
| `i18n.productOrder.until` | Bis | Until | Product order end date |
| `i18n.productOrder.amount` | Menge | Amount | |
| `i18n.productOrder.description` | Beschreibung | Description | |
| `i18n.productOrder.comment` | Kommentar | Comment | |
| `i18n.productOrder.adjustedPrice` | Angepasster Preis | Adjusted Price | |
| `i18n.product` | Produkt | Product | |
| `i18n.product.price` | Preis | Price | |
| `i18n.address.bank` | Bank | Bank | |
| `i18n.address.bic` | BIC | BIC | |
| `i18n.address.additional.text` | Zusaetzliche Adressinfo | Additional Address Info | |
| `i18n.contact.street` | Strasse | Street | |
| `i18n.contact.street2` | Adresszusatz | Street 2 | |
| `i18n.contact.zipcode` | PLZ | Zip Code | |
| `i18n.contact.state` | Bundesland | State | |
| `i18n.contact.city` | Stadt | City | |
| `i18n.contact.country` | Land | Country | |
| `i18n.contact.firstName` | Vorname | First Name | |
| `i18n.contact.lastName` | Nachname | Last Name | |
| `i18n.contact.primaryemail` | Primaere E-Mail | Primary Email | |
| `i18n.contact.workphone` | Telefon (Arbeit) | Work Phone | |
| `i18n.contact.faxnumber` | Faxnummer | Fax Number | |
| `i18n.label.title` | Titel | Title | |
| `i18n.WorkLogType.STANDARD` | Standard | Standard | |
| `i18n.WorkLogType.EXTENDED` | Erweitert | Extended | |
| `i18n.AppointmentType.SHIFT` | Schicht | Shift | |
| `i18n.AppointmentType.APPOINTMENT` | Termin | Appointment | |
| `i18n.AppointmentType.COUNCIL` | Konsil | Council | |
| `i18n.AppointmentType.TREATMENT` | Behandlung | Treatment | |
| `i18n.AppointmentType.TREATMENT_REPORT` | Behandlungsbericht | Treatment Report | |
| `i18n.AppointmentType.ALL` | Alle | All | |
| `i18n.templateExportDlg.title` | Exportvorlage hinzufuegen | Add Export Template | Dialog title |
| `i18n.exportTemplate.template` | Vorlage | Template | |
| "Steuersatz" | Steuersatz | Tax Rate | HARDCODED in select placeholder |
| "Satz-Normal" .. "Satz-Besonders" | (as shown) | (as shown) | HARDCODED tax type labels |
| "IBAN" | IBAN | IBAN | HARDCODED label |
| "Total" | Total | Total | HARDCODED product table column header |
| "Active" (filter) | Active | Active | HARDCODED in filter panel |
| "Keine Vorlage ausgewahlt." | Keine Vorlage ausgewahlt. | No template selected. | HARDCODED alert message |

---

## 7. Summary of Cross-Module Dependencies (Invoice Receiver)

```
invoiceReceiver
    |-- invoice/invoiceDetails.html  (embedded dialog)
    |-- InvoiceService               (createMonthlyInvoice, prepareZip)
    |-- StornoGroupService           (storno group dropdowns)
    |-- ExportTemplateService        (worklog export template autocomplete)
    |-- ProductService               (product autocomplete)
    |-- CustomerService              (customer autocomplete + address fill)
    |-- LocationService              (location autocomplete + address fill)
    |-- jobStatusDlg                 (async job monitoring)
    |-- siteloader                   (generic site loader)
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

## Cross-References

| Reference | Type | Target | Anchor |
|---|---|---|---|
| [Wireframe: W4 Invoice Receiver](#wireframe-reference-ascii) | internal-anchor | — | `#w4-invoice-receiver` |
| [`specs/wireframes/accounting/workflows.md#w4-invoice-receiver`](../../../wireframes/accounting/workflows.md#w4-invoice-receiver) | cross-file | `workflows.md` | `#w4-invoice-receiver` |

### Related Analysis Files

- [`specs/analysis/accounting/invoice/invoice.md`](../invoice/invoice.md) — invoice creation triggered by Invoice Receiver (`createMonthlyInvoice`)
- [`specs/analysis/utility/worklog-templates-files.md`](../../utility/worklog-templates-files.md) — source file this module was split from

### Related MongoDB Mapping Files

- [`specs/mongodb-mapping/accounting.md`](../mongodb-mapping/accounting.md) — `invoice`, `invoiceComponent`, `product` collections

---

## Wireframe Reference (ASCII)

> Full wireframe: [`specs/wireframes/accounting/workflows.md#w4-invoice-receiver`](../../../wireframes/accounting/workflows.md#w4-invoice-receiver)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▌Invoice Receivers                                                 [Filter]│
├─────────────────────────────────────────────────────────────────────────────┤
│ [Add][Edit][Delete] | [Create Invoice][Create All] | [Export XLS]          │
├────┬──────────────┬───────────┬──────────┬──────┬──────────────────────────-┤
│ ID │ Name         │ Customer  │ Location │Active│ Address                   │
├────┼──────────────┼───────────┼──────────┼──────┼───────────────────────────┤
│ 201│JVA Berlin Mn │Berlin Jstv│  K.Berlin│  ✓   │Berliner Str. 99, 10115    │
├────┴──────────────┴───────────┴──────────┴──────┴───────────────────────────┤
│                                                                             │
│ ┌ Detail ─────────────────────────────────────────────────────────────────┐ │
│ │ [Payment Contact]  [Product Orders]                                    │ │
│ │                                                                        │ │
│ │ Entity Selection [cond: customer↔location mutex]                       │ │
│ │ Customer *: [Berlin Justice ▾]        Location *: [── Disabled ──]     │ │
│ │                                                                        │ │
│ │ Address (auto-fill from entity)                                        │ │
│ │ Street: [Berliner Str. 99]  ZIP/City: [10115] [Berlin]                 │ │
│ │                                                                        │ │
│ │ Contact & Payment Terms                                                │ │
│ │ Email: [billing@jva-berlin.de]  Payment Goal *: [30]                   │ │
│ │ Skonto % *: [2.0]              Storno Group: [Standard ▾]              │ │
│ │                                                                        │ │
│ │ Storno/Invoice & Banking                                               │ │
│ │ [✓ Active] [✓ Mail Invoice] [✓ Post Invoice]                           │ │
│ │ IBAN: [DE89 3044 0432 0120 00]  BIC: [COBADEFRXXX]                     │ │
│ │                                                                        │ │
│ │                                              [Cancel]  [Save]          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```
