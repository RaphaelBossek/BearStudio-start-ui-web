---
title: 'Data Dictionary Index'
---

# Data Dictionary — Central Index

> **Status**: COMPLETED (Phase D)

## Domain Data Dictionaries

| Domain | File | Status | Complexity |
|:---|:---|:---|:---|
| Treatment | [`treatment/data-dictionary-treatment.md`](treatment/data-dictionary-treatment.md) | Done | Very High |
| Planning | [`planning/data-dictionary-planning.md`](planning/data-dictionary-planning.md) | Done | Very High |
| User Management | [`user-management/data-dictionary-user-management.md`](user-management/data-dictionary-user-management.md) | Done | High |
| Accounting | [`accounting/data-dictionary-accounting.md`](accounting/data-dictionary-accounting.md) | Done | High |
| Customer | [`customer/data-dictionary-customer.md`](customer/data-dictionary-customer.md) | Done | Medium |
| System | [`system/data-dictionary-system.md`](system/data-dictionary-system.md) | Done | Medium |
| Academy | [`academy/data-dictionary-academy.md`](academy/data-dictionary-academy.md) | Done | Low-Medium |
| Interfaces | [`interfaces/data-dictionary-interfaces.md`](interfaces/data-dictionary-interfaces.md) | Done | Low |

## Summary Counts

- **Total domains**: 8
- **Total fields documented**: ~1,600+ (1,769 table rows across all dictionaries)
- **Total workflow-only fields**: 121
- **Total hardcoded strings**: 726

## Common UI Element Type → Abstract Data Type Mapping

The following mapping translates legacy UI components or HTML form elements into abstract data types, ensuring correct and standardized component usage in modern React/Shadcn UI development.

| Legacy UI Element | Abstract Data Type | Modern Component / Usage |
|:---|:---|:---|
| `<input type="text">` | `string` | `Input` (Text) |
| `<textarea>` | `bigstring` | `Textarea` |
| `<input type="number">` / `field decimal` | `number` / `decimal` | `Input` (Number) |
| `<input type="checkbox">` / status toggle | `boolean` | `Checkbox` or `Switch` |
| `<select>` (with enum) | `enum:{Name}` | `Select` (Dropdown) |
| `<select>` (with options) | `string` | `Select` (Dropdown) |
| `<input class="object autoselect">` | `reference:{Entity}` | `Combobox` / Autocomplete |
| `<input type="date">` / `field date` | `date` | `DatePicker` / `Calendar` |
| `clockpicker` / `time` | `time` | Time picker widget |
| `datetime` | `datetime` | Date/Time combined picker |
| `button` / `action` | `action` | Workflow trigger (No DB mapping) |
| `statusTrue`/`statusFalse` / `class="status"` | `boolean` / `tri-state` | Badge or Tri-state icon |

## Common Enum Types

Several enums are shared across multiple domains. They are defined centrally but utilized throughout the system.

| Enum | Typical Values | Usage Context / Domain |
|:---|:---|:---|
| **ConsultationType** | `EXTERNAL`, `STANDARD`, `DOCUMENT`, `ONBOARDING`, `ONBOARDING_SHORT`, `INCARCERATION`, `TREATMENT` | Treatment, Planning, Interfaces |
| **AppointmentState** | `REQUESTED`, `CONFIRMED`, `LOCKEDIN`, `COMPLETED`, `CANCELLED`, etc. | Planning, Treatment |
| **Gender** | `MALE`, `FEMALE`, `OTHER` | User Management, Treatment |
| **JobType** | `APPOINTMENT`, `SHIFT` | Accounting, Treatment, Planning |
| **PriceType** | `WEEKDAY`, `WEEKNIGHT`, `WEEKENDDAY`, `WEEKENDNIGHT` | Planning, Accounting |

## Cross-Domain Field References

Certain sub-entities are reused as **denormalized snapshots** across multiple domains. They are embedded documents rather than separate collections. 

Refer to `specs/mongodb-mapping/README.md` ("Shared Sub-Entities Reference") for the full architecture.

| Sub-entity | Source Collection | Embedded Fields | Domains |
|:---|:---|:---|:---|
| **ConsultationDoctor** | `user` | `_id`, `name`, `email`, `formalDisplayName` | Treatment, News, External-Data, System, Planning |
| **ConsultationJob** | `jobId` | `_id`, `code`, `color`, `expertTitle`, `remoteCode`, `title`, `type` | Treatment, Planning, Accounting |
| **ConsultationLocation** | `location` | `_id`, `name`, `booknumberMask`, `patientDataType`, `ConsultationCustomer` | Treatment, Planning |
| **ConsultationCustomer** | `customer` | `_id`, `name` | Treatment, Planning |
| **PlanUser** | `user` | `_id`, `name`, `email`, `formalDisplayName` | Planning, User-Management |
| **PlanJob** | `jobId` | `_id`, `code`, `color`, `expertTitle`, `remoteCode`, `title`, `type` | Planning |
| **PlanLocation** | `location` | `_id`, `name`, `booknumberMask`, `patientDataType`, `PlanCustomer` | Planning |
| **PlanCustomer** | `customer` | `_id`, `name` | Planning |
