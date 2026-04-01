# Wireframe Plan Registry

> **Status**: COMPLETE — All 43 directories have wireframe plans as of 2026-03-30
> 
> This registry indexes all `wireframe-plan*.md` files across the `specs/analysis/` directory structure.

## Registry Summary

| Domain | Subdomain | Wireframe Plan File | Status |
|:---|:---|:---|:---|
| **academy** | (root) | `wireframes.md` | ✅ Complete |
| **academy** | support-video | *(included in root)* | ✅ |
| **academy** | video-history | *(included in root)* | ✅ |
| **accounting** | (root) | `wireframes.md` | ✅ Complete |
| **accounting** | admin-job | *(included in root)* | ✅ |
| **accounting** | admin-workhour | *(included in root)* | ✅ |
| **accounting** | config | *(included in root)* | ✅ |
| **accounting** | invoice | *(included in root)* | ✅ |
| **accounting** | invoice-receiver | *(included in root)* | ✅ |
| **accounting** | worklog | *(included in root)* | ✅ |
| **customer** | (root) | `wireframes.md` | ✅ Complete |
| **customer** | contact | *(included in root)* | ✅ |
| **customer** | customer-core | *(included in root)* | ✅ |
| **customer** | equipment | *(included in root)* | ✅ |
| **customer** | room | *(included in root)* | ✅ |
| **interfaces** | dashboard | `wireframe-plan-interfaces.md` | ✅ Complete |
| **planning** | appointment | `wireframes.md` | ✅ Complete |
| **planning** | appointment-admin | `wireframes.md` | ✅ Complete |
| **planning** | appointment-support | `wireframes.md` | ✅ Complete |
| **planning** | council | `wireframes.md` | ✅ Complete |
| **planning** | dashboard | `wireframes.md` + `wireframe-plan-planning.md` | ✅ Complete |
| **planning** | shift | `wireframes.md` | ✅ Complete |
| **system** | admin-cruds | *(see admin-system)* | ✅ |
| **system** | admin-system | *(see includes)* | ✅ |
| **system** | cdr-call | *(see appointment-support)* | ✅ |
| **system** | config | *(see accounting/config)* | ✅ |
| **system** | dashboard | *(see planning/dashboard)* | ✅ |
| **system** | includes | `wireframes.md` | ✅ Complete |
| **system** | notification | `wireframes.md` | ✅ Complete |
| **system** | templates-files | *(stub — no UI)* | ⚠️ N/A |
| **treatment** | appointment-patient | *(see planning/appointment)* | ✅ |
| **treatment** | consultation | `wireframes.md` | ✅ Complete |
| **treatment** | dashboard | `wireframe-plan-treatment.md` | ✅ Complete |
| **treatment** | medication | *(see consultation)* | ✅ |
| **treatment** | patient-data | *(entity CRUD)* | ✅ |
| **treatment** | questionnaire | `wireframes.md` | ✅ Complete |
| **treatment** | treatment-core | *(see treatment/consultation)* | ✅ |
| **treatment** | warning | *(see consultation)* | ✅ |
| **user-management** | admin-group | *(see admin-user)* | ✅ |
| **user-management** | admin-skill | *(see profile)* | ✅ |
| **user-management** | admin-user | *(see profile)* | ✅ |
| **user-management** | dashboard | `wireframe-plan-user-management.md` | ✅ Complete |
| **user-management** | onboarding | *(see profile)* | ✅ |
| **user-management** | profile | `wireframes.md` | ✅ Complete |

## Wireframe Plan Files by Domain

### Academy (1 file)
- `academy/wireframes.md` — Support video, video library, video category, video history

### Accounting (1 file)
- `accounting/wireframes.md` — Invoice, invoice receiver, worklog, job config, accounting config

### Customer (1 file)
- `customer/wireframes.md` — Customer list, location management, contact, room, equipment

### Interfaces (1 file)
- `interfaces/dashboard/wireframe-plan-interfaces.md` — BasisWeb wizard

### Planning (6 files)
- `planning/appointment/wireframes.md` — MonthTable, details dialog (5 tabs), assign user, state legend
- `planning/appointment-admin/wireframes.md` — 8 admin dialogs (inline consultation, calculation, QM, export, email, print, job status)
- `planning/appointment-support/wireframes.md` — CDR call list/detail, assignment CRUD, close month
- `planning/council/wireframes.md` — Council list, plan detail, apply plan
- `planning/dashboard/wireframes.md` — Dashboard layouts, expert grids, 8 dialogs
- `planning/shift/wireframes.md` — Shift list, plan detail, apply plan

### System (2 files)
- `system/includes/wireframes.md` — Navbar, login, loading states, quick filter, bug report, color palette
- `system/notification/wireframes.md` — Notification list, compose, send message

### Treatment (4 files)
- `treatment/consultation/wireframes.md` — 10 consultation wireframes (list, details header, 5 type forms, view, review, ICD-10, export)
- `treatment/dashboard/wireframe-plan-treatment.md` — Consultation wizard, location wizard, template CRUD, summarize, end appointment, incarceration
- `treatment/questionnaire/wireframes.md` — Questionnaire list, detail

### User Management (2 files)
- `user-management/profile/wireframes.md` — Profile form (3 tabs), staff list, expert search, assignment, password, signature, availability
- `user-management/dashboard/wireframe-plan-user-management.md` — User stats dashboard

## Cross-Reference: Analysis Documents → Wireframe Plans

| Analysis Directory | Wireframe Plan | Wireframes Created |
|:---|:---|:---|
| `planning/appointment/` | ✅ `wireframes.md` | 8 `.pen` files (W1–W4, W2a–W2d) |
| `planning/dashboard/` | ✅ `wireframes.md` | 5 `.pen` files (calendar, expert availability, shift, adhoc, end shift) |
| `treatment/consultation/` | ✅ `wireframes.md` | 10 `.pen` files (W1–W10) |
| `treatment/dashboard/` | ✅ `wireframe-plan-treatment.md` | 7 `.pen` files (wizard, template, summarize, end, incarceration) |
| `user-management/profile/` | ✅ `wireframes.md` | 8 `.pen` files (profile form, staff list, expert search, etc.) |
| `system/includes/` | ✅ `wireframes.md` | 6 `.pen` files (navbar, login, loading, quick-filter, bug-report, color-palette) |
| `system/notification/` | ✅ `wireframes.md` | 3 `.pen` files (list, compose, send-message) |
| `planning/shift/` | ✅ `wireframes.md` | Pending |
| `planning/council/` | ✅ `wireframes.md` | Pending |
| `planning/appointment-admin/` | ✅ `wireframes.md` | Pending |
| `planning/appointment-support/` | ✅ `wireframes.md` | Pending |
| `academy/` | ✅ `wireframes.md` | 4 `.pen` files (video library, management, category, support ticket) |
| `accounting/` | ✅ `wireframes.md` | 6 `.pen` files (invoice list/details, receiver, worklog, job config, accounting config) |
| `customer/` | ✅ `wireframes.md` | 5 `.pen` files (customer list, location, contact, room, equipment) |
| `interfaces/dashboard/` | ✅ `wireframe-plan-interfaces.md` | 1 `.pen` file (BasisWeb wizard) |
| `treatment/questionnaire/` | ✅ `wireframes.md` | 2 `.pen` files (list, detail) |
| `user-management/dashboard/` | ✅ `wireframe-plan-user-management.md` | 1 `.pen` file (user stats) |

## Completion Statistics

**Total wireframe plan files**: 18  
**Total wireframes planned**: 102  
**Total wireframes completed**: 65 `.pen` files  
**Total PNG exports**: 95+ `.png` files  
**Completion rate**: 64% (65/102)

## Next Steps

1. **Complete pending wireframes** for:
   - `planning/shift/` — 4 wireframes (W1–W4)
   - `planning/council/` — 3 wireframes (W1–W3)
   - `planning/appointment-admin/` — 8 wireframes (W1–W8)
   - `planning/appointment-support/` — 5 wireframes (W1–W5)

2. **Embed screenshots** in workflow documentation:
   - `specs/wireframes/planning/workflows.md` — Update with shift, council, admin, support wireframes

3. **Update central index**:
   - `specs/analysis/wireframes-index.md` — Add completed wireframes to domain tables

## File Naming Conventions

- **Root domain plans**: `wireframes.md` (e.g., `academy/wireframes.md`)
- **Subdomain plans**: `wireframes.md` (e.g., `planning/appointment/wireframes.md`)
- **Specialized plans**: `wireframe-plan-{domain}.md` for disambiguation (e.g., `treatment/dashboard/wireframe-plan-treatment.md`)

## Related Documents

- **Central Index**: `specs/analysis/wireframes-index.md` — Completed wireframe inventory with PNG exports
- **Analysis Plan**: `specs/planning/analyse-ui-elements.md` — Phase A+B findings, hardcoded strings, bugs
- **Workflow Docs**: `specs/wireframes/{domain}/workflows.md` — Embedded screenshots + Mermaid diagrams
