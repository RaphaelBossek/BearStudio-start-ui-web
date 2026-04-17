---
title: 'Data Dictionary Accounting'
---

---
---

# Data Dictionary: Accounting

This document defines the data dictionary for the **Accounting** domain, mapping UI elements to their backend data structures.

## Invoice Receiver Grid

> **Source**: `invoice-receiver/invoice-receiver.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `invoiceReceiver._id` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `number` | `text` | - | No | Yes | - |
| Customer | Kunde | `customer` | `invoiceReceiver.customer` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `reference:customer` | `text` | - | No | Yes | - |
| Location | Standort | `location` | `invoiceReceiver.location` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `reference:location` | `text` | - | No | Yes | - |
| State | Bundesland | `state` | `-` | - | `string` | `text` | - | No | Yes | Derived from location |
| Last Invoice Date | Letzte Rechnung | `dateLastInvoice` | `-` | - | `date` | `text` | - | No | Yes | Computed |
| Address | Adresse | `addressDto` | `-` | - | `string` | `text` | - | No | Yes | Computed full address |

## Invoice Receiver Form - Payment Contact

> **Source**: `invoice-receiver/invoice-receiver.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Customer | Kunde | `data.customer` | `invoiceReceiver.customer` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `reference:customer` | `autocomplete` | CustomerService.autocomplete | No | No | Mutually exclusive with location |
| Location | Standort | `data.location` | `invoiceReceiver.location` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `reference:location` | `autocomplete` | LocationService.autocomplete | No | No | Mutually exclusive with customer |
| Street | Strasse | `data.address` | `invoiceReceiver.address` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `string` | `text input` | - | No | No | Auto-filled |
| Street 2 | Adresszusatz | `data.address2` | `-` | - | `string` | `text input` | - | No | No | Auto-filled |
| Zip Code | PLZ | `data.zip` | `invoiceReceiver.zip` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `string` | `text input` | - | No | No | Auto-filled |
| State | Bundesland | `data.state` | `-` | - | `string` | `text input` | - | No | No | Auto-filled |
| City | Stadt | `data.city` | `invoiceReceiver.city` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `string` | `text input` | - | No | No | Auto-filled |
| Country | Land | `data.country` | `-` | - | `string` | `text input` | - | No | No | Auto-filled |
| Additional Address Info | Zusaetzliche Adressinfo | `data.addressInfo` | `-` | - | `string` | `textarea` | - | No | No | - |
| First Name | Vorname | `data.firstName` | `-` | - | `string` | `text input` | - | No | No | - |
| Last Name | Nachname | `data.lastName` | `-` | - | `string` | `text input` | - | No | No | - |
| Primary Email | Primaere E-Mail | `data.email` | `invoiceReceiver.email` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `string` | `email input` | - | No | No | - |
| More Email | Weitere E-Mail | `data.extraEmail` | `-` | - | `array:string` | `collection (email inputs)` | - | No | No | - |
| Work Phone | Telefon (Arbeit) | `data.phone` | `-` | - | `string` | `text input` | - | No | No | - |
| Fax Number | Faxnummer | `data.faxNumber` | `-` | - | `string` | `text input` | - | No | No | - |
| Title | Titel | `data.title` | `-` | - | `string` | `text input` | - | No | No | Invoice title |
| Extra Title | Zusaetzlicher Titel | `data.extraTitle` | `-` | - | `string` | `textarea` | - | No | No | - |
| Payment Goal | Zahlungsziel | `data.paymentGoal` | `invoiceReceiver.paymentGoal` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `number` | `text input` | - | Yes | No | Days |
| Appointment Cancellation | Storno Termin | `data.appointmentStorno` | `-` | - | `reference:stornoGroup` | `select` | StornoGroupService.getAll | No | No | - |
| Shift Cancellation | Storno Schicht | `data.shiftStorno` | `-` | - | `reference:stornoGroup` | `select` | StornoGroupService.getAll | No | No | - |
| Council Cancellation | Storno Konsil | `data.councilStorno` | `-` | - | `reference:stornoGroup` | `select` | StornoGroupService.getAll | No | No | - |
| Early Payment Discount | Skonto | `data.skontoPaymentGoal` | `-` | - | `number` | `text input` | - | Yes | No | Days |
| Early Payment Discount % | Skonto % | `data.skontoPaymentPercentage` | `-` | - | `number` | `percent input` | - | Yes | No | - |
| Tax Rate | Steuersatz | `data.taxType` | `invoiceReceiver.taxType` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `enum:TaxType` | `select` | SATZ_NORMAL, SATZ_NULL, etc. | No | No | - |
| Contra Account | Gegenkonto | `data.gkto` | `invoiceReceiver.gkto` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `string` | `text input` | - | No | No | - |
| Routing ID | Leitweg-ID | `data.leitwegId` | `-` | - | `string` | `text input` | - | No | No | - |
| Mail Invoice | Rechnung per E-Mail | `data.mailInvoice` | `invoiceReceiver.mailInvoice` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `boolean` | `checkbox switch` | - | No | No | - |
| Post Invoice | Rechnung per Post | `data.postInvoice` | `invoiceReceiver.postInvoice` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoice-receivers) | `boolean` | `checkbox switch` | - | No | No | - |
| Active | Aktiv | `data.active` | `-` | - | `boolean` | `checkbox switch` | - | No | No | - |
| Generate Work Log | Arbeitsnachweis generieren | `data.workLog` | `-` | - | `enum:WorkLogType` | `select` | STANDARD, EXTENDED | No | No | - |
| Worklog Exports | Arbeitsnachweis generieren | `data.worklogExports` | `-` | - | `array` | `collection` | - | No | No | - |
| IBAN | IBAN | `data.iban` | `-` | - | `string` | `text input` | - | No | No | - |
| Bank | Bank | `data.bank` | `-` | - | `string` | `text input` | - | No | No | - |
| BIC | BIC | `data.bic` | `-` | - | `string` | `text input` | - | No | No | - |
| Last Invoice Date | Letzte Rechnung | `data.dateLastInvoice` | `-` | - | `date` | `read-only date span` | - | No | Yes | - |

## Invoice Receiver Form - Product Order

> **Source**: `invoice-receiver/invoice-receiver.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Flat Rate Shift | Pauschale Schicht | `data.flatRateShift` | `-` | - | `boolean` | `checkbox switch` | - | No | No | - |
| Flat Rate Appointment | Pauschale Termin | `data.flatRateAppointment` | `-` | - | `boolean` | `checkbox switch` | - | No | No | - |
| Flat Rate Council | Pauschale Konsil | `data.flatRateCouncil` | `-` | - | `boolean` | `checkbox switch` | - | No | No | - |
| Flat Rate Treatment | Pauschale Behandlung | `data.flatRateTreatment` | `-` | - | `boolean` | `checkbox switch` | - | No | No | - |
| Flat Rate Treatment Report | Pauschale Behandlungsbericht | `data.flatRateTreatmentReport` | `-` | - | `boolean` | `checkbox switch` | - | No | No | - |
| Amount | Menge | `products.amount` | `-` | - | `number` | `number input` | - | No | No | - |
| Product | Produkt | `products.product` | `-` | - | `reference:product` | `read-only span` | - | No | Yes | - |
| Start | Start | `products.start` | `-` | - | `date` | `date input` | - | No | No | - |
| Until | Bis | `products.until` | `-` | - | `date` | `date input` | - | No | No | - |
| Description | Beschreibung | `products.description` | `-` | - | `string` | `text input` | - | No | No | - |
| Comment | Kommentar | `products.comment` | `-` | - | `string` | `text input` | - | No | No | - |
| Price | Preis | `products.product.price` | `-` | - | `number` | `read-only span` | - | No | Yes | - |
| Adjusted Price | Angepasster Preis | `products.adjustedPrice` | `-` | - | `number` | `number input` | - | No | No | - |

## Work Hour Templates Grid

> **Source**: `admin-workhour/workhour.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `workHour._id` | [accounting.md](../mongodb-mapping/accounting.md#entity-work-hours) | `number` | `text` | - | No | Yes | - |
| Code | Code | `code` | `workHour.code` | [accounting.md](../mongodb-mapping/accounting.md#entity-work-hours) | `string` | `text` | - | No | Yes | - |
| Description | Beschreibung | `description` | `workHour.description` | [accounting.md](../mongodb-mapping/accounting.md#entity-work-hours) | `string` | `text` | - | No | Yes | - |
| Hours | Stunden | `hours` | `workHour.hours` | [accounting.md](../mongodb-mapping/accounting.md#entity-work-hours) | `string` | `text` | - | No | Yes | - |

## Work Hour Templates Detail

> **Source**: `admin-workhour/workhour.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Code | Code | `data.code` | `workHour.code` | [accounting.md](../mongodb-mapping/accounting.md#entity-work-hours) | `string` | `text` | - | Yes | No | - |
| Hours | Stunden | `data.hours` | `workHour.hours` | [accounting.md](../mongodb-mapping/accounting.md#entity-work-hours) | `string` | `text` | - | Yes | No | - |
| Priority | Prioritat | `data.prio` | `-` | - | `number` | `number input` | - | No | No | - |
| Description | Beschreibung | `data.description` | `workHour.description` | [accounting.md](../mongodb-mapping/accounting.md#entity-work-hours) | `string` | `text` | - | No | No | - |

## Storno Group Grid

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Title | Titel | `title` | `stornoGroup.title` | [accounting.md](../mongodb-mapping/accounting.md#entity-storno-groups) | `string` | `text` | - | No | Yes | - |
| Comment | Kommentar | `comment` | `stornoGroup.comment` | [accounting.md](../mongodb-mapping/accounting.md#entity-storno-groups) | `string` | `text` | - | No | Yes | - |
| Storno | Storno | `storno` | `-` | - | `array` | `text` | - | No | Yes | - |
| ID | ID | `id` | `stornoGroup._id` | [accounting.md](../mongodb-mapping/accounting.md#entity-storno-groups) | `number` | `text` | - | No | Yes | - |

## Storno Group Detail

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Title | Titel | `data.title` | `stornoGroup.title` | [accounting.md](../mongodb-mapping/accounting.md#entity-storno-groups) | `string` | `text input` | - | No | No | - |
| Comment | Kommentar | `data.comment` | `stornoGroup.comment` | [accounting.md](../mongodb-mapping/accounting.md#entity-storno-groups) | `string` | `text input` | - | No | No | - |
| Name | Name | `storno.name` | `stornoGroup.storno.name` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-stornorule) | `string` | `text input` | - | No | No | - |
| Cancellation Time | Stornozeit | `storno.stornoTime` | `stornoGroup.storno.stornoTime` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-stornorule) | `number` | `humantime input` | - | No | No | - |
| Percentage | Prozentsatz | `storno.percentage` | `stornoGroup.storno.percentage` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-stornorule) | `number` | `percent input` | - | No | No | - |
| Comment | Kommentar | `storno.comment` | `stornoGroup.storno.comment` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-stornorule) | `string` | `text input` | - | No | No | - |
| Start Date | Startdatum | `storno.dateStart` | `-` | - | `date` | `date input` | - | No | No | - |
| Until Date | Bis Datum | `storno.dateUntil` | `-` | - | `date` | `date input` | - | No | No | - |

## Job Price List Grid

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `jobPriceList._id` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `number` | `text` | - | No | Yes | - |
| Name | Name | `name` | `jobPriceList.name` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `string` | `text` | - | No | Yes | - |
| Start | Start | `start` | `jobPriceList.start` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `date` | `text` | - | No | Yes | - |
| Until | Bis | `until` | `jobPriceList.until` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `date` | `text` | - | No | Yes | - |
| Active | Aktiv | `active` | `jobPriceList.active` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `boolean` | `text` | - | No | Yes | - |
| Comment | Kommentar | `comment` | `-` | - | `string` | `text` | - | No | Yes | - |

## Job Price List Detail

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `jobPriceList.name` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `string` | `text input` | - | No | No | - |
| Active | Aktiv | `data.active` | `jobPriceList.active` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `boolean` | `checkbox switch` | - | No | No | - |
| Start | Start | `data.start` | `jobPriceList.start` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `date` | `date input` | - | No | No | - |
| Until | Bis | `data.until` | `jobPriceList.until` | [accounting.md](../mongodb-mapping/accounting.md#entity-job-price-lists) | `date` | `date input` | - | No | No | - |
| Comment | Kommentar | `data.comment` | `-` | - | `string` | `text input` | - | No | No | - |
| Job Code | Job Code | `prices.job.code` | `-` | - | `string` | `display` | - | No | Yes | - |
| Job Type | Job Typ | `prices.job.type` | `-` | - | `string` | `display` | - | No | Yes | - |
| Price | Preis | `prices.price` | `jobPriceList.prices.price` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-jobpriceentry) | `number` | `decimal input` | - | No | No | - |
| Rounding Type | Rundung | `prices.roundingType` | `jobPriceList.prices.roundingType` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-jobpriceentry) | `enum:RoundingType` | `select` | FULL_HOUR, HALF_HOUR | No | No | - |
| Consultation Invoice | Rechnung | `prices.consultationInvoice` | `-` | - | `boolean` | `checkbox switch` | - | No | No | - |
| Appointment Consulation Price | pro Behandlung | `prices.appointmentConsulationPrice` | `-` | - | `number` | `decimal input` | - | No | No | - |
| Support Price | Support Preis | `prices.supportPrice` | `-` | - | `number` | `decimal input` | - | No | No | - |
| Comment | Kommentar | `prices.comment` | `-` | - | `string` | `text input` | - | No | No | - |

## Product Grid

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `product._id` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `number` | `text` | - | No | Yes | - |
| Name | Name | `name` | `product.name` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `string` | `text` | - | No | Yes | - |
| Description | Beschreibung | `description` | `product.description` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `string` | `text` | - | No | Yes | - |
| Booking Code | Buchungscode | `bookingCode` | `product.bookingCode` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `string` | `text` | - | No | Yes | - |
| Type | Typ | `type` | `product.type` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `enum:ProductTarget` | `text` | - | No | Yes | - |
| Price | Preis | `price` | `product.price` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `number` | `text` | - | No | Yes | - |
| Account | Konto | `konto` | `product.konto` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `string` | `text` | - | No | Yes | - |
| Active | Aktiv | `active` | `product.active` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `boolean` | `text` | - | No | Yes | - |

## Product Detail

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `product.name` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `string` | `text input` | - | No | No | - |
| Price | Preis | `data.price` | `product.price` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `number` | `number input` | - | No | No | - |
| Active | Aktiv | `data.active` | `product.active` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `boolean` | `checkbox switch` | - | No | No | - |
| Type | Typ | `data.type` | `product.type` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `enum:ProductTarget` | `select` | CUSTOMER, EXPERT, EQUIPMENT | Yes | No | - |
| Bill Type | Abrechnungsart | `data.billType` | `product.billType` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `enum:BillType` | `select` | MONTH, DAILY, WEEKDAYS | No | No | - |
| Booking Code | Buchungscode | `data.bookingCode` | `product.bookingCode` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `string` | `text input` | - | No | No | - |
| Description | Beschreibung | `data.description` | `product.description` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `string` | `textarea` | - | No | No | - |
| Account | Konto | `data.konto` | `product.konto` | [accounting.md](../mongodb-mapping/accounting.md#entity-products) | `string` | `text input` | - | No | No | - |

## Closed Month Grid

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `closedMonth._id` | [accounting.md](../mongodb-mapping/accounting.md#entity-closed-months) | `number` | `text` | - | No | Yes | - |
| Period | Zeitraum | `period` | `closedMonth.period` | [accounting.md](../mongodb-mapping/accounting.md#entity-closed-months) | `number` | `text` | - | No | Yes | - |
| Closed for Expert | Geschlossen für Experte | `closedForExpert` | `-` | - | `date` | `text` | - | No | Yes | - |
| Verified | Verifiziert | `verified` | `-` | - | `date` | `text` | - | No | Yes | - |
| Invoiced | Abgerechnet | `invoiced` | `-` | - | `date` | `text` | - | No | Yes | - |
| Comment | Kommentar | `comment` | `closedMonth.comment` | [accounting.md](../mongodb-mapping/accounting.md#entity-closed-months) | `string` | `text` | - | No | Yes | - |

## Closed Month Detail

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Period | Zeitraum | `data.period` | `closedMonth.period` | [accounting.md](../mongodb-mapping/accounting.md#entity-closed-months) | `number` | `display` | - | No | Yes | - |
| Comment | Kommentar | `data.comment` | `closedMonth.comment` | [accounting.md](../mongodb-mapping/accounting.md#entity-closed-months) | `string` | `textarea` | - | No | No | - |
| Closed for Expert | Geschlossen für Experte | `data.closedForExpert` | `-` | - | `date` | `date input` | - | No | No | - |
| Verified | Verifiziert | `data.verified` | `-` | - | `date` | `date input` | - | No | No | - |
| Invoiced | Abgerechnet | `data.invoiced` | `-` | - | `date` | `date input` | - | No | No | - |

## Expert Work Monthly Grid

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `expertWorkMonthly._id` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `number` | `text` | - | No | Yes | - |
| Year | Jahr | `year` | `expertWorkMonthly.year` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `number` | `text` | - | No | Yes | - |
| Month | Monat | `month` | `expertWorkMonthly.month` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `number` | `text` | - | No | Yes | - |
| User | Experte | `doctorName` | `expertWorkMonthly.doctorName` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `string` | `text` | - | No | Yes | - |
| Booking Reference | Buchungsreferenz | `bookingReference` | `-` | - | `string` | `text` | - | No | Yes | - |
| Total | Gesamt | `total` | `expertWorkMonthly.total` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `number` | `text` | - | No | Yes | Admin only |
| Date Sent | Sendedatum | `dateSent` | `expertWorkMonthly.dateSent` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `date` | `text` | - | No | Yes | Admin only |
| Date Received | Empfangsdatum | `dateReceived` | `-` | - | `date` | `text` | - | No | Yes | Admin only |
| Date Paid | Zahldatum | `datePaid` | `-` | - | `date` | `text` | - | No | Yes | Admin only |

## Expert Work Monthly Detail

> **Source**: `config/accounting-config.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Month | Monat | `data.month` | `expertWorkMonthly.month` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `number` | `select` | - | No | Yes | - |
| Year | Jahr | `data.year` | `expertWorkMonthly.year` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `number` | `display` | - | No | Yes | - |
| Doctor Name | Experte | `data.doctorName` | `expertWorkMonthly.doctorName` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `string` | `display` | - | No | Yes | - |
| Employee Type | Mitarbeitertyp | `data.employeeType` | `-` | - | `string` | `display` | - | No | Yes | - |
| Comment | Kommentar | `data.comment` | `-` | - | `string` | `textarea` | - | No | No | - |
| Booking Reference | Buchungsreferenz | `data.bookingReference` | `-` | - | `string` | `text input` | - | No | No | - |
| Date Created | Erstellungsdatum | `data.dateCreated` | `expertWorkMonthly.dateCreated` | [accounting.md](../mongodb-mapping/accounting.md#entity-expert-work-monthly) | `date` | `display` | - | No | Yes | - |
| Date Received | Empfangsdatum | `data.received` | `-` | - | `date` | `display` | - | No | Yes | - |
| Date Paid | Zahldatum | `data.datePaid` | `-` | - | `date` | `display` | - | No | Yes | - |
| Start | Start | `worklog.start` | `expertWorkMonthly.worklog.start` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-expertworklogentry) | `date` | `display` | - | No | Yes | - |
| Job | Dienstleistung | `worklog.job.expertTitle` | `expertWorkMonthly.worklog.job` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-expertworklogentry) | `string` | `display` | - | No | Yes | - |
| Location | Ort/Dienst | `worklog.location` | `expertWorkMonthly.worklog.location` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-expertworklogentry) | `string` | `display` | - | No | Yes | - |
| Actual Work Time | Arbeits Zeit | `worklog.actualWorkTime` | `expertWorkMonthly.worklog.actualWorkTime` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-expertworklogentry) | `number` | `display` | - | No | Yes | Admin only |
| Payable Work Time | Abrechnungszeit | `worklog.payableWorkTime` | `expertWorkMonthly.worklog.payableWorkTime` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-expertworklogentry) | `number` | `display` | - | No | Yes | - |
| Actual Patients | beh. Patienten | `worklog.actualPatients` | `-` | - | `number` | `display` | - | No | Yes | Admin only |
| Payable Patients | abr. Patienten | `worklog.payablePatients` | `-` | - | `number` | `display` | - | No | Yes | - |
| Total | Gesamt | `worklog.total` | `expertWorkMonthly.worklog.total` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-expertworklogentry) | `number` | `display` | - | No | Yes | Admin only |
| Checked | Geprüft | `worklog.checked` | `-` | - | `boolean` | `checkbox` | - | No | No | Admin only |

## Worklog List Grid

> **Source**: `worklog/worklog.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | Id | `id` | `-` | - | `number` | `text` | - | No | Yes | - |
| Type of Service | Art der Leistung | `type` | `-` | - | `string` | `text` | - | No | Yes | Note: duplicate binding issue |
| Doctor | Arzt | `type` | `-` | - | `string` | `text` | - | No | Yes | Note: duplicate binding issue |
| Prison | JVA | `location` | `-` | - | `string` | `text` | - | No | Yes | - |
| Billing Time | Abrechnung-Zeit | `type` | `-` | - | `string` | `text` | - | No | Yes | Note: duplicate binding issue |
| Treated Patients | Behandelte Patienten | `type` | `-` | - | `number` | `text` | - | No | Yes | Note: duplicate binding issue |
| Amount | Betrag | `type` | `-` | - | `number` | `text` | - | No | Yes | Note: duplicate binding issue |
| Notes | Hinweise | `type` | `-` | - | `string` | `text` | - | No | Yes | Note: duplicate binding issue |

## Weekly Assignments Grid

> **Source**: `worklog/worklog.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Expert Name | Name | `expertName` | `-` | - | `string` | `text` | - | No | Yes | - |
| Monday AM | Mo/Mo | `countMorning` | `-` | - | `number` | `text` | - | No | Yes | Derived matrix |
| Monday PM | Mo/NM | `countAfternoon` | `-` | - | `number` | `text` | - | No | Yes | Derived matrix |
| Monday Night | Mo/Na | `countNight` | `-` | - | `number` | `text` | - | No | Yes | Derived matrix |

## Job Configuration Grid

> **Source**: `admin-job/job-configuration.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `jobId._id` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `number` | `text` | - | No | Yes | - |
| Name | Name | `code` | `jobId.code` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `text` | - | No | Yes | - |
| Type | Typ | `type` | `jobId.type` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `enum:AppointmentType` | `text` | - | No | Yes | - |
| Title (Expert) | Titel (Experte) | `expertTitle` | `jobId.expertTitle` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `text` | - | No | Yes | - |
| Shortcode | Kurzcode | `shortcode` | `jobId.shortcode` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `text` | - | No | Yes | - |
| Remote Code | Remote Code | `remoteCode` | `jobId.remoteCode` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `text` | - | No | Yes | - |
| Account | Konto | `konto` | `-` | - | `string` | `text` | - | No | Yes | - |
| Priority | Prioritat | `prio` | `jobId.prio` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `number` | `text` | - | No | Yes | - |

## Job Configuration Detail - Tab 1 Info

> **Source**: `admin-job/job-configuration.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.code` | `jobId.code` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `text input` | - | Yes | No | - |
| Shortcode | Kurzcode | `data.shortcode` | `jobId.shortcode` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `text input` | - | No | No | - |
| Title (Expert) | Titel (Experte) | `data.expertTitle` | `jobId.expertTitle` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `text input` | - | No | No | - |
| Type | Typ | `data.type` | `jobId.type` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `enum:AppointmentType` | `select` | APPOINTMENT, SHIFT, COUNCIL | No | No | - |
| Subject Area | Fachgebiet | `data.remoteCode` | `jobId.remoteCode` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `select` | - | No | No | - |
| Consultation Type | Konsultationstyp | `data.defaultConsultation` | `jobId.defaultConsultation` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `enum:ConsultationType` | `select` | - | No | No | - |
| Further Treatment | Weiterbehandlung | `data.defaultFurtherTreatment` | `jobId.defaultFurtherTreatment` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `enum:FurtherTreatment` | `select` | - | No | No | - |
| Standard | Standard | `data.consultationStandard` | `jobId.consultationStandard` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `boolean` | `checkbox` | - | No | No | - |
| Onboarding | Onboarding | `data.consultationOnboarding` | `jobId.consultationOnboarding` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `boolean` | `checkbox` | - | No | No | - |
| Incarceration | Inhaftierung | `data.consultationIncarceration` | `jobId.consultationIncarceration` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `boolean` | `checkbox` | - | No | No | - |
| Onboarding Short | Onboarding (kurz) | `data.consultationOnboardingShort` | `jobId.consultationOnboardingShort` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `boolean` | `checkbox` | - | No | No | - |
| Document | Dokument | `data.consultationDocument` | `jobId.consultationDocument` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `boolean` | `checkbox` | - | No | No | - |
| Invoice Title | Rechnung Titel | `data.title` | `jobId.title` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `text input` | - | No | No | - |
| Bill As | Abrechnen als | `data.billAs` | `-` | - | `reference:jobId` | `select` | - | No | No | - |
| Account | Konto | `data.konto` | `-` | - | `string` | `text input` | - | No | No | - |
| Color | Farbe | `data.color` | `jobId.color` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `string` | `color picker` | - | No | No | - |
| Priority | Prioritat | `data.prio` | `jobId.prio` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `number` | `number input` | - | No | No | - |
| Skill Rule | Qualifikation Regel | `skillRules.rule` | `jobId.skillRules.rule` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-skillrule) | `string` | `select` | ALL_MUST, ANY_MUST, etc. | Yes | No | - |
| Skills | Qualifikationen | `skillRules.skills` | `jobId.skillRules.skills` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-skillrule) | `array` | `nested collection` | - | No | No | - |
| On-Call Numbers | Bereitschaftsnummern | `data.onCallNumbers` | `jobId.onCallNumbers` | [accounting.md](../mongodb-mapping/accounting.md#entity-service) | `array:string` | `text input collection` | - | No | No | - |

## Job Configuration Detail - Tab 2 Times/Pricing

> **Source**: `admin-job/job-configuration.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Shift Price Weekday | Werktag Preis | `shiftCondition.priceWeekDay` | `jobId.shiftCondition.priceWeekDay` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-shiftcondition) | `object` | `pricePoints input` | - | No | No | - |
| Appointment Hourly Price | Stundensatz | `appointmentCondition.hourlyPrice` | `jobId.appointmentCondition.hourlyPrice` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-appointmentcondition) | `object` | `pricePoints input` | - | No | No | - |
| Appointment Rounding HN | Rundung HN | `data.appointmentCondition.roundingTypeHN` | `jobId.appointmentCondition.roundingTypeHN` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-appointmentcondition) | `enum:RoundingType` | `select` | FULL_HOUR, HALF_HOUR | No | No | - |
| Appointment Storno | Storno | `data.appointmentCondition.storno` | `jobId.appointmentCondition.storno` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-appointmentcondition) | `reference:stornoGroup` | `select` | - | No | No | - |
| Council Unit Count | Einheiten | `data.councilCondition.unitCount` | `-` | - | `number` | `number input` | - | No | No | - |
| Council Price Per Patient | Preis pro Patient | `councilCondition.pricePerConsulation` | `-` | - | `object` | `pricePoints input` | - | No | No | - |

## Invoice List Grid

> **Source**: `invoice/invoice-list.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Invoice No. | Rechnungsnr. | `no` | `invoice.no` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `string` | `text` | - | No | Yes | - |
| Client | Kunde | `client` | `invoice.client` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `object` | `text` | - | No | Yes | - |
| Shipping | Versand | `client` | `-` | - | `object` | `icon` | - | No | Yes | Displays mail/post icons |
| Title | Titel | `title` | `invoice.title` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `string` | `text` | - | No | Yes | - |
| Invoice Date | Rechnungsdatum | `dateInvoice` | `invoice.dateInvoice` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `text` | - | No | Yes | - |
| Total | Gesamt | `totalPrice` | `invoice.totalPrice` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `number` | `text` | - | No | Yes | - |
| Paid | Bezahlt | `paidAt` | `invoice.paidAt` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `text` | - | No | Yes | - |
| Comment | Kommentar | `comment` | `invoice.comment` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `string` | `text` | - | No | Yes | - |
| Worklog | Arbeitsnachweis | `dateWorklog` | `invoice.dateWorklog` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `icon` | - | No | Yes | Existence indicator |
| Date Created | Erstellt | `dateCreated` | `invoice.dateCreated` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `text` | - | No | Yes | - |
| Date Submitted | Gesendet | `dateSubmit` | `invoice.dateSubmit` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `text` | - | No | Yes | - |

## Invoice Detail Dialog

> **Source**: `invoice/invoice-details.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Multi-invoice Switch | Multi-Rechnung | `multiInvoice` | `-` | - | `action` | `select` | - | No | No | Workflow-only |
| Invoice No. | Rechnungsnr. | `data.no` | `invoice.no` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `string` | `text input` | - | No | No | - |
| Date Created | Erstellt am | `data.dateCreated` | `invoice.dateCreated` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `span` | - | No | Yes | - |
| Client Name | Kunde Name | `data.client.name` | `invoice.client.name` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceclient) | `string` | `span` | - | No | Yes | - |
| Client Extra Title | Kunde Extra Titel | `data.client.extraTitle` | `-` | - | `string` | `span` | - | No | Yes | - |
| Client Address | Kunde Adresse | `data.client.address` | `invoice.client.address` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceclient) | `string` | `span` | - | No | Yes | - |
| Client ZIP | Kunde PLZ | `data.client.zip` | `invoice.client.zip` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceclient) | `string` | `span` | - | No | Yes | - |
| Client City | Kunde Stadt | `data.client.city` | `invoice.client.city` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceclient) | `string` | `span` | - | No | Yes | - |
| Title | Titel | `data.title` | `invoice.title` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `string` | `text input` | - | No | No | - |
| Description | Beschreibung | `data.description` | `invoice.description` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `string` | `textarea` | - | No | No | - |
| Paid At | Bezahlt am | `data.paidAt` | `invoice.paidAt` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `date input` | - | No | Yes | - |
| Comment | Kommentar | `data.comment` | `invoice.comment` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `string` | `textarea` | - | No | No | - |
| Invoice Date | Rechnungsdatum | `data.dateInvoice` | `invoice.dateInvoice` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `date input` | - | No | No | - |
| Skonto Date | Skonto Datum | `data.dateSkonto` | `invoice.dateSkonto` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `span` | - | No | Yes | - |
| Skonto % | Skonto % | `data.client.skontoPaymentPercentage` | `-` | - | `number` | `span` | - | No | Yes | - |
| Date Submitted | Versanddatum | `data.dateSubmit` | `invoice.dateSubmit` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `date` | `date input` | - | No | No | - |
| Month | Monat | `data.month` | `invoice.month` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `number` | `select` | - | No | No | - |
| Year | Jahr | `data.year` | `invoice.year` | [accounting.md](../mongodb-mapping/accounting.md#entity-invoices) | `number` | `number input` | - | No | No | - |

## Invoice Positions Collection

> **Source**: `invoice/invoice-details.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Amount | Menge | `positions.amount` | `invoice.positions.amount` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceposition) | `number` | `number input` | - | Yes | No | - |
| Service | Leistung | `positions.title` | `invoice.positions.title` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceposition) | `string` | `text input` | - | No | No | - |
| Product | Produkt | `positions.product` | `-` | - | `reference:product` | `autocomplete` | ProductService.autocomplete | No | No | - |
| Description | Beschreibung | `positions.description` | `invoice.positions.description` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceposition) | `string` | `textarea` | - | No | No | - |
| Comment | Kommentar | `positions.comment` | `invoice.positions.comment` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceposition) | `string` | `textarea` | - | No | No | - |
| Account | Konto | `positions.konto` | `-` | - | `string` | `text input` | - | No | No | - |
| Net Price | Netto Preis | `positions.netPricePerUnit` | `-` | - | `number` | `currency input` | - | No | No | - |
| Tax Rate | MwSt-Satz | `positions.taxType` | `invoice.positions.taxType` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceposition) | `enum:TaxType` | `select` | - | No | No | - |
| Taxes | MwSt | `positions.taxes` | `-` | - | `number` | `span` | - | No | Yes | - |
| Total Price | Gesamt | `positions.totalPrice` | `invoice.positions.totalPrice` | [accounting.md](../mongodb-mapping/accounting.md#sub-entity-invoiceposition) | `number` | `span` | - | No | Yes | - |

## Invoice Attachments

> **Source**: `invoice/invoice-details.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| File Name | Datei | `attachments.name` | `-` | - | `string` | `link` | - | No | Yes | - |
| Delete | Entfernen | `-` | `-` | - | `action` | `button` | - | No | No | Workflow-only: InvoiceService.removeFile |

## Email Dialog

> **Source**: `invoice/invoice-details.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Email | E-Mail | `data.recipient` | `-` | - | `string` | `email input` | - | Yes | No | Workflow-only: recipient |
| Send Copy | Kopie senden | `data.copy` | `-` | - | `boolean` | `checkbox` | - | No | No | Workflow-only: send copy |
| Subject | Betreff | `data.subject` | `-` | - | `string` | `text input` | - | No | No | Workflow-only |
| Body | Text | `data.body` | `-` | - | `string` | `textarea` | - | No | No | Workflow-only |

## Create Invoice Dialog

> **Source**: `invoice/invoice-details.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Invoice Receiver | Rechnungsempfänger | `data.receiver` | `-` | - | `reference:invoiceReceiver` | `autocomplete` | InvoiceReceiverService.autocomplete | No | No | Workflow-only |
| Month | Monat | `data.month` | `-` | - | `number` | `select` | - | No | No | Workflow-only |
| Year | Jahr | `data.year` | `-` | - | `number` | `number input` | - | No | No | Workflow-only |

## Appointment Admin Grid

> **Source**: `planning/appointment-admin/appointment-admin.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `appointment._id` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `number` | `text` | - | No | Yes | - |
| Start Date | Startdatum | `date` | `appointment.date` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `date` | `text` | - | No | Yes | - |
| From | Von | `timeStart` | `appointment.timeStart` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `string` | `text` | - | No | Yes | - |
| Until | Bis | `timeEnd` | `appointment.timeEnd` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `string` | `text` | - | No | Yes | - |
| Location | Ort | `location` | `appointment.location` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `reference:location` | `text` | - | No | Yes | - |
| Service | Dienstleistung | `job` | `appointment.job` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `reference:jobId` | `text` | - | No | Yes | - |
| Physician | Arzt | `assignedDisplayName` | `-` | - | `string` | `text` | - | No | Yes | - |
| Type | Typ | `type` | `appointment.type` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `enum:AppointmentType` | `text` | - | No | Yes | - |
| Status | Status | `state` | `appointment.state` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `enum:AppointmentState` | `icon` | - | No | Yes | - |
| Payment Type | Zahlungsart | `paymentType` | `appointment.paymentType` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `enum:AppointmentPaymentType` | `text` | - | No | Yes | - |
| Cancel | Storno | `dateStorno` | `appointment.dateStorno` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `date` | `text` | - | No | Yes | - |
| Count | Anzahl | `count` | `-` | - | `number` | `text` | - | No | Yes | - |
| Period | Zeitraum | `period` | `-` | - | `string` | `text` | - | No | Yes | - |

## Appointment Admin Detail Drawer

> **Source**: `planning/appointment-admin/appointment-admin.md`

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Customer | Kunde | `data.appointment.customer` | `appointment.customer` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `reference:customer` | `autocomplete` | - | No | Yes | Read-only |
| Location | Ort | `data.appointment.location` | `appointment.location` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `reference:location` | `autocomplete` | LocationService.autocomplete | No | No | - |
| Status | Status | `data.appointment.state` | `appointment.state` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `enum:AppointmentState` | `select` | - | No | No | - |
| Service | Dienstleistung | `data.appointment.job` | `appointment.job` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `reference:jobId` | `autocomplete` | JobService.autocomplete | Yes | No | - |
| Payment Type | Zahlungsart | `data.appointment.paymentType` | `appointment.paymentType` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `enum:AppointmentPaymentType` | `select` | - | No | No | - |
| Storno Time | Stornozeit | `data.summary.stornoTime` | `-` | - | `number` | `humantime input` | - | No | No | Recalculates dateStorno |
| First Contact | Erster Kontakt | `data.summary.firstContact` | `-` | - | `time` | `time picker` | - | No | No | - |
| Adjusted Start | Angepasster Start | `data.summary.adjustedStart` | `-` | - | `time` | `time picker` | - | No | No | - |
| Adjusted Until | Angepasstes Ende | `data.summary.adjustedUntil` | `-` | - | `time` | `time picker` | - | No | No | - |
| Logged First Contact | Geloggter Kontakt | `data.summary.loggedFirstContact` | `-` | - | `time` | `time picker` | - | No | No | - |
| Logged Start | Geloggter Start | `data.summary.loggedStart` | `-` | - | `time` | `time picker` | - | No | No | - |
| Logged Until | Geloggtes Ende | `data.summary.loggedUntil` | `-` | - | `time` | `time picker` | - | No | No | - |
| Verified First Contact | Verifizierter Kontakt | `data.summary.verifiedFirstContact` | `-` | - | `time` | `time picker` | - | No | No | - |
| Verified Start | Verifizierter Start | `data.summary.verifiedStart` | `-` | - | `time` | `time picker` | - | No | No | - |
| Verified Until | Verifiziertes Ende | `data.summary.verifiedUntil` | `-` | - | `time` | `time picker` | - | No | No | - |
| Referral | Überweisung | `data.summary.referral` | `-` | - | `number` | `number input` | - | No | No | - |
| If Required | WV | `data.summary.ifRequired` | `-` | - | `number` | `number input` | - | No | No | - |
| Follow Up | Nachsorge | `data.summary.followUp` | `-` | - | `number` | `number input` | - | No | No | - |
| Referral Other | Überweisung andere | `data.summary.referralOther` | `-` | - | `number` | `number input` | - | No | No | - |
| Unknown Follow Up | Unbekannte Nachsorge | `data.summary.nofollow` | `-` | - | `number` | `number input` | - | No | No | - |
| QM Comment | QM Kommentar | `data.qm.comment` | `-` | - | `string` | `textarea` | - | No | No | - |
| Comment | Kommentar | `data.appointment.comment` | `appointment.comment` | [planning.md](../mongodb-mapping/planning.md#entity-appointments) | `string` | `textarea` | - | No | No | - |

