---
title: 'Site Navigation'
---

# Application Navigation & Sitemap

> **Source**: Legacy `site.htmlm` application shell  
> **Target**: React 19 + Shadcn/ui + TanStack Router + Tailwind CSS 4  
> **Last Updated**: 2026-03-31  
> **Status**: **MASTER NAVIGATION DOCUMENT** — All specification documents organized by application module

---

## Overview

This document serves as the **top-level navigation guide** for all specifications in the `specs/` directory. It's organized according to the application's sitemap structure from the legacy `site.htmlm` shell, with each main menu item linking to its corresponding analysis and wireframe documents.

### How to Use This Document

1. **Find your module** in the sitemap table below
2. **Click the domain link** to navigate to that module's specifications
3. **Each domain folder** contains:
   - `README.md` — Domain overview and key entities
   - Analysis documents (`.md`) — Detailed functional analysis
   - `wireframes.md` — Wireframe inventory and execution log
   - `workflows.md` — User journey flowcharts (in `specs/wireframes/{domain}/`)

---

## Complete Sitemap Structure

| # | Main Menu Item | Domain Folder | Icon | Color | Roles | Submenu Items |
|---|----------------|---------------|------|-------|-------|---------------|
| 1 | [Dashboard](#1-dashboard) | [`dashboard/`](./dashboard/README.md) | `tachometer` | `color-dash` | — | 4 |
| 2 | [Appointments](#2-appointments) | [`appointments/`](./appointments/README.md) | `user-md` | `color-appointment` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 2 |
| 3 | [Shifts](#3-shifts) | [`shifts/`](./shifts/README.md) | `user-injured` | `color-shift` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 1 |
| 4 | [Treatments](#4-treatments) | [`treatments/`](./treatments/README.md) | `people-arrows` | `color-treatment` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 2 |
| 5 | [Council](#5-council) | [`council/`](./council/README.md) | `user-friends` | `color-council` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 1 |
| 6 | [Consultations](#6-consultations) | [`consultations/`](./consultations/README.md) | `heartbeat` | `color-consultation` | STANDARD, LEITER_INTERN, ADMIN | 0 |
| 7 | [Appointment Admin](#7-appointment-admin) | [`appointment-admin/`](./appointment-admin/README.md) | `calendar` | `color-appointmentAdmin` | LEITER_INTERN, ADMIN, ADMIN_INTERN | 2 |
| 8 | [Notifications](#8-notifications) | [`notifications/`](./notifications/README.md) | `comments` | `color-notify` | — | 1 |
| 9 | [Customers](#9-customers) | [`customers/`](./customers/README.md) | `hospital-user` | `color-customer` | LEITER_INTERN, ADMIN_INTERN, KUNDE_ADMIN, ADMIN | 7 |
| 10 | [Staff](#10-staff) | [`staff/`](./staff/README.md) | `user-md` | `color-user` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 3 |
| 11 | [Administration](#11-administration) | [`administration/`](./administration/README.md) | `user-cog` | `admin` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 11 |
| 12 | [System Admin](#12-system-admin) | [`system-admin/`](./system-admin/README.md) | `cogs` | `sysadmin` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 13 |

---

## Detailed Module Navigation

### 1. Dashboard

**Domain**: [`dashboard/`](./dashboard/README.md)  
**Legacy URLs**: `/dash.html`, `/monthView.html`, `/weekView.html`, `/expertWorkMonthly.html`  
**Analysis Documents**:

- [`standard.md`](./dashboard/standard.md) — Standard user dashboard (main landing page)
- [`admin.md`](./dashboard/admin.md) — Admin dashboard with system metrics
- [`self-service.md`](./dashboard/self-service.md) — Self-service dashboard for experts with `SELF_ASSIGNMENT` permission
- [`dialogs.md`](./dashboard/dialogs.md) — Shared dashboard dialogs (shift, ad-hoc appointment, end shift)

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Calendar (Month View) | [`dashboard/standard.md`](./dashboard/standard.md) | [`../wireframes/dashboard/calendar.png`](../wireframes/dashboard/calendar.png) | ✅ Complete |
| Week View | [`dashboard/standard.md`](./dashboard/standard.md) | [`../wireframes/dashboard/expert-availability-week.png`](../wireframes/dashboard/expert-availability-week.png) | ✅ Complete |
| Worklog | [`../administration/jobs.md`](../administration/jobs.md) | — | 📝 Planned |
| Video Library | External | — | 🔗 External link |

**Key Features**:
- Role-based dashboard switching (standard vs admin vs self-service)
- MonthTable calendar grid (custom day × job calendar, NOT standard DataTables)
- Expert availability grids (week and month views with tri-state toggle)
- Quick actions: ad-hoc appointments, end shift

---

### 2. Appointments

**Domain**: [`appointments/`](./appointments/README.md)  
**Legacy URLs**: `/appointment.html`, `/appointmentPlan.html`, `/patientData.html`  
**Analysis Documents**:

- [`list.md`](./appointments/list.md) — Appointment list with MonthTable calendar grid
- [`details.md`](./appointments/details.md) — 5-tab appointment detail dialog (Info, Referenced, Patients, Assigned, Suggestions)
- [`assign-user.md`](./appointments/assign-user.md) — Collision resolution when assigning experts
- [`plan.md`](./appointments/plan.md) — Appointment plan support functions
- [`patient-data.md`](./appointments/patient-data.md) — Patient data management

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Appointment Plan | [`list.md`](./appointments/list.md) | [`../wireframes/appointments/list.png`](../wireframes/appointments/list.png) | ✅ Complete |
| Patient Data | [`patient-data.md`](./appointments/patient-data.md) | — | 📝 Planned |

**Key Features**:
- **12-state appointment state machine** with color-coded badges
- MonthTable calendar: rows = days, columns = jobs, cells = colored appointments
- 5-tab detail dialog (1200px drawer)
- Collision detection when assigning experts
- Type-driven field visibility (APPOINTMENT, SHIFT, COUNCIL, TREATMENT)

---

### 3. Shifts

**Domain**: [`shifts/`](./shifts/README.md)  
**Legacy URLs**: `/shift.html`, `/shiftPlan.html`  
**Analysis Documents**:

- [`list.md`](./shifts/list.md) — Shift list and shift plan management

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Shift Plan | [`list.md`](./shifts/list.md) | [`../wireframes/shifts/shift-plan-detail.png`](../wireframes/shifts/shift-plan-detail.png) | ✅ Complete |

**Key Features**:
- Shift plan templates (recurring weekly/monthly schedules)
- Price type auto-suggestion (weekday/night/weekend/weekend night)
- Preferred experts collection with priority ordering
- Apply Plan generates appointments asynchronously

---

### 4. Treatments

**Domain**: [`treatments/`](./treatments/README.md)  
**Legacy URLs**: `/treatment.html`, `/treatmentPlan.html`  
**Analysis Documents**:

- [`list.md`](./treatments/list.md) — Treatment list and categories
- [`plan.md`](./treatments/plan.md) — Treatment plan management

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Treatment Plan | [`plan.md`](./treatments/plan.md) | — | 📝 Planned |
| Treatment Plan History | [`plan.md`](./treatments/plan.md) | — | 📝 Planned |

**Key Features**:
- Treatment categories hierarchy
- Treatment plan scheduling
- History view for completed treatments

---

### 5. Council

**Domain**: [`council/`](./council/README.md)  
**Legacy URLs**: `/council.html`, `/councilPlan.html`  
**Analysis Documents**:

- [`list.md`](./council/list.md) — Council list and plan management

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Council Plan | [`list.md`](./council/list.md) | [`../wireframes/council/council-plan-detail.png`](../wireframes/council/council-plan-detail.png) | ✅ Complete |

**Key Features**:
- Council plan templates (similar to shift plans, simpler)
- Doctor collection with role assignments
- Job support checkbox (council-specific)
- No price type (councils don't have shift-based pricing)

---

### 6. Consultations

**Domain**: [`consultations/`](./consultations/README.md)  
**Legacy URLs**: `/consultation.html`  
**Analysis Documents**:

- [`list.md`](./consultations/list.md) — Consultation list with filters and export
- [`details-header.md`](./consultations/details-header.md) — Consultation detail dialog header (8 form elements, ICD-10 search)
- [`standard-form.md`](./consultations/standard-form.md) — Standard form (50 elements, 6 collections including nested prescriptions)
- [`onboarding-form.md`](./consultations/onboarding-form.md) — Onboarding form (type-specific)
- [`incarceration-form.md`](./consultations/incarceration-form.md) — Incarceration form (51 elements, siren animation on critical fields)
- [`treatment-warning.md`](./consultations/treatment-warning.md) — Treatment textareas + warning categories
- [`view-review.md`](./consultations/view-review.md) — Read-only view template + markdown review dialog
- [`details-js.md`](./consultations/details-js.md) — JavaScript behavior (conditionize2, incarceration-hide, internalOnly)

**Submenu Items**: None (single-page module)

**Key Features**:
- **7 consultation types** controlling tab/field visibility
- **6-state consultation state machine** (OPEN, IN_PROGRESS, TRANSMITTED, etc.)
- ICD-10 search dialog with inclusion/exclusion lists
- Nested prescription collection (prescription → activeIngredients)
- Incarceration siren animation (blue-to-red flash on critical fields)
- Markdown editor for review comments

---

### 7. Appointment Admin

**Domain**: [`appointment-admin/`](./appointment-admin/README.md)  
**Legacy URLs**: `/appointmentAdmin.html`, `/closedMonth.html`, `/questionaire.html`  
**Analysis Documents**:

- [`admin.md`](./appointment-admin/admin.md) — Appointment admin grid with inline consultation management
- [`closed-month.md`](./appointment-admin/closed-month.md) — Closed month configuration and management

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Closed Month | [`closed-month.md`](./appointment-admin/closed-month.md) | [`../wireframes/appointment-admin/close-month.png`](../wireframes/appointment-admin/close-month.png) | ✅ Complete |
| Questionnaire | [`../administration/jobs.md`](../administration/jobs.md) | — | 📝 Planned |

**Key Features**:
- 13-column admin grid with year/month/day filter
- Detail drawer with 3 time columns (Expert / Logging / Verified)
- Inline consultation CRUD (add, edit, duplicate, move, transmit, delete)
- CDR call assignment (assigned vs unassigned panels)
- Export workflows (EK, VK, VK by Location, Template Export)
- Month closed status (read-only mode)

---

### 8. Notifications

**Domain**: [`notifications/`](./notifications/README.md)  
**Legacy URLs**: `/notification.html`  
**Analysis Documents**:

- [`list.md`](./notifications/list.md) — Notification list with folder filtering

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Trash Folder | [`list.md`](./notifications/list.md) | [`../wireframes/notifications/notification-list.png`](../wireframes/notifications/notification-list.png) | ✅ Complete |

**Key Features**:
- Folder-based filtering (Inbox, Sent, Trash)
- Rights-based access: `NOTIFICATION_READ`, `SELF_ASSIGNMENT`
- Compose notification dialog
- Send message to users

---

### 9. Customers

**Domain**: [`customers/`](./customers/README.md)  
**Legacy URLs**: `/customer.html`, `/onboardingCustomer.html`, `/invoice.html`, `/invoiceReceiver.html`, `/customerUser.html`, `/customerLocation.html`, `/room.html`, `/onboardingLocation.html`  
**Analysis Documents**:

- [`list.md`](./customers/list.md) — Customer list and detail
- [`locations-users.md`](./customers/locations-users.md) — Customer locations and users management
- [`invoices.md`](./customers/invoices.md) — Invoice list
- [`invoice-details.md`](./customers/invoice-details.md) — Invoice details
- [`invoice-receivers.md`](./customers/invoice-receivers.md) — Invoice receiver management
- [`rooms.md`](./customers/rooms.md) — Room management

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Onboarding Customer | [`locations-users.md`](./customers/locations-users.md) | — | 📝 Planned |
| Invoices | [`invoices.md`](./customers/invoices.md) | [`../wireframes/administration/invoice-list.png`](../wireframes/administration/invoice-list.png) | ✅ Complete |
| Invoice Receivers | [`invoice-receivers.md`](./customers/invoice-receivers.md) | [`../wireframes/administration/invoice-receiver.png`](../wireframes/administration/invoice-receiver.png) | ✅ Complete |
| Customer Users | [`locations-users.md`](./customers/locations-users.md) | — | 📝 Planned |
| Locations | [`locations-users.md`](./customers/locations-users.md) | [`../wireframes/customers/location-management.png`](../wireframes/customers/location-management.png) | ✅ Complete |
| Rooms | [`rooms.md`](./customers/rooms.md) | [`../wireframes/customers/room-list-view.png`](../wireframes/customers/room-list-view.png) | ✅ Complete |
| Onboarding Location | [`locations-users.md`](./customers/locations-users.md) | — | 📝 Planned |

**Key Features**:
- Customer hierarchy (customer → locations → users → rooms)
- Invoice generation and payment tracking
- Invoice receiver (payment contact) management
- Contact management (private, work, other addresses)

---

### 10. Staff

**Domain**: [`staff/`](./staff/README.md)  
**Legacy URLs**: `/staff.html`, `/onboarding.html`, `/adminUser.html`, `/expertWorkWeeklyAssignments.html`  
**Analysis Documents**:

- [`profile.md`](./staff/profile.md) — User profile form, staff list, dialogs, expert availability (merged from 4 documents)
- [`user-management.md`](./staff/user-management.md) — User management (admin users)
- [`onboarding.md`](./staff/onboarding.md) — Staff onboarding flow
- [`expert-assignments.md`](./staff/expert-assignments.md) — Expert weekly assignments

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Onboarding | [`onboarding.md`](./staff/onboarding.md) | — | 📝 Planned |
| User Management | [`user-management.md`](./staff/user-management.md) | [`../wireframes/staff/profile-form.png`](../wireframes/staff/profile-form.png) | ✅ Complete |
| Expert Weekly Assignments | [`expert-assignments.md`](./staff/expert-assignments.md) | — | 📝 Planned |

**Key Features**:
- Profile form with 4 tabs (personal, business, other, overview)
- Expert availability (week and month grids)
- User assignment to customers/locations
- TOTP onboarding for 2FA

---

### 11. Administration

**Domain**: [`administration/`](./administration/README.md)  
**Legacy URLs**: `/admin.html` + 11 submenu items  
**Analysis Documents**:

- [`jobs.md`](./administration/jobs.md) — Job ID configuration
- [`job-prices.md`](./administration/job-prices.md) — Job price list
- [`products.md`](./administration/products.md) — Product management
- [`skills.md`](./administration/skills.md) — Skill management
- [`warnings.md`](./administration/warnings.md) — Warning categories
- [`treatment-categories.md`](./administration/treatment-categories.md) — Treatment categories
- [`equipment.md`](./administration/equipment.md) — Equipment management
- [`onboarding-steps.md`](./administration/onboarding-steps.md) — Onboarding step configuration

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| Job IDs | [`jobs.md`](./administration/jobs.md) | [`../wireframes/administration/job-configuration.png`](../wireframes/administration/job-configuration.png) | ✅ Complete |
| Async Job Queue | — | — | 📝 Planned |
| Job Price List | [`job-prices.md`](./administration/job-prices.md) | — | 📝 Planned |
| Products | [`products.md`](./administration/products.md) | — | 📝 Planned |
| Skills | [`skills.md`](./administration/skills.md) | — | 📝 Planned |
| Exclusion Criteria | — | — | 📝 Planned |
| Export Templates | — | — | 📝 Planned |
| Warnings | [`warnings.md`](./administration/warnings.md) | — | 📝 Planned |
| Treatment Categories | [`treatment-categories.md`](./administration/treatment-categories.md) | — | 📝 Planned |
| Equipment | [`equipment.md`](./administration/equipment.md) | [`../wireframes/customers/equipment-detail.png`](../wireframes/customers/equipment-detail.png) | ✅ Complete |
| Onboarding Steps | [`onboarding-steps.md`](./administration/onboarding-steps.md) | — | 📝 Planned |

**Key Features**:
- Job configuration (billing codes)
- Product catalog
- Skill taxonomy
- Warning categories for consultations
- Equipment/device management

---

### 12. System Admin

**Domain**: [`system-admin/`](./system-admin/README.md)  
**Legacy URLs**: `/sysadmin.html` + 13 submenu items  
**Analysis Documents**:

- [`admin-landing.md`](./system-admin/admin-landing.md) — System admin landing page
- [`motd.md`](./system-admin/motd.md) — Message of the Day (MOTD)
- [`work-hours.md`](./system-admin/work-hours.md) — Work hour configuration
- [`cdr.md`](./system-admin/cdr.md) — CDR (Call Detail Records) tracking
- [`cdr-assignment.md`](./system-admin/cdr-assignment.md) — CDR call assignment to consultations

**Submenu Items**:

| Item | Analysis Doc | Wireframe | Status |
|------|--------------|-----------|--------|
| MOTD | [`motd.md`](./system-admin/motd.md) | — | 📝 Planned |
| Login Notification | — | — | 📝 Planned |
| Notification Templates | — | — | 📝 Planned |
| Location Types | — | — | 📝 Planned |
| Storno Groups | — | — | 📝 Planned |
| Work Hours | [`work-hours.md`](./system-admin/work-hours.md) | — | 📝 Planned |
| CDR | [`cdr.md`](./system-admin/cdr.md) | [`../wireframes/appointment-admin/cdr-call-list.png`](../wireframes/appointment-admin/cdr-call-list.png) | ✅ Complete |
| CDR Assignment | [`cdr-assignment.md`](./system-admin/cdr-assignment.md) | [`../wireframes/appointment-admin/cdr-assignment-crud.png`](../wireframes/appointment-admin/cdr-assignment-crud.png) | ✅ Complete |
| Log | — | — | 📝 Planned |
| Support Categories | — | — | 📝 Planned |
| BasisWeb Appointments | — | — | 📝 Planned |
| Change Log | — | — | 📝 Planned |

**Key Features**:
- System configuration (sysconfig)
- Message of the Day (MOTD) management
- CDR call tracking (7 color-coded statuses)
- Work hour definitions
- Login notifications

---

## Shared Components & Infrastructure

### Includes Domain

**Domain**: [`includes/`](./includes/README.md)  
**Purpose**: Shared components, templates, and infrastructure used across all modules

**Documents**:

- [`site-shell.md`](./includes/site-shell.md) — Application shell architecture (this document, extended version)
- [`shared-components.md`](./includes/shared-components.md) — Shared dialogs (loading spinner, bug report, role switch)
- [`customization.md`](./includes/customization.md) — Customization points and theming
- [`templates-files.md`](./includes/templates-files.md) — Template system and file includes

**Key Components**:
- Global navigation sidebar (sitemap-driven)
- User dropdown menu (profile, security, role switch, logout)
- Loading spinner overlay
- Bug report dialog
- Role switch modal
- Maintenance mode alert

---

## Cross-Reference Index

### By Entity Type

| Entity | Primary Domain | Related Domains |
|--------|----------------|-----------------|
| Appointment | [`appointments/`](./appointments/README.md) | [`shifts/`](./shifts/README.md), [`council/`](./council/README.md), [`treatments/`](./treatments/README.md) |
| Consultation | [`consultations/`](./consultations/README.md) | [`treatments/`](./treatments/README.md), [`appointment-admin/`](./appointment-admin/README.md) |
| Customer | [`customers/`](./customers/README.md) | [`staff/`](./staff/README.md) (customer users) |
| User/Staff | [`staff/`](./staff/README.md) | [`customers/`](./customers/README.md) (assignment) |
| Invoice | [`customers/invoices.md`](./customers/invoices.md) | [`administration/jobs.md`](./administration/jobs.md) (job pricing) |
| CDR Call | [`system-admin/cdr.md`](./system-admin/cdr.md) | [`appointment-admin/admin.md`](./appointment-admin/admin.md) (assignment) |

### By Permission/Role

| Role | Visible Modules |
|------|-----------------|
| **STANDARD** | Dashboard, Consultations, Notifications (with rights) |
| **LEITER_INTERN** | All modules |
| **ADMIN_INTERN** | All modules except Consultations |
| **ADMIN** | All modules |
| **KUNDE_ADMIN** | Dashboard, Notifications, Customers |
| **REGISTERED** | Dashboard only |

---

## Wireframe Status Summary

| Domain | Analysis Docs | Wireframes | Completion |
|--------|---------------|------------|------------|
| [`dashboard/`](./dashboard/README.md) | 4 | 8 | 🟡 Partial |
| [`appointments/`](./appointments/README.md) | 5 | 8 | 🟢 Complete |
| [`shifts/`](./shifts/README.md) | 1 | 4 | 🟡 Partial |
| [`treatments/`](./treatments/README.md) | 2 | 0 | 🔴 Not Started |
| [`council/`](./council/README.md) | 1 | 3 | 🟡 Partial |
| [`consultations/`](./consultations/README.md) | 8 | 12 | 🟢 Complete |
| [`appointment-admin/`](./appointment-admin/README.md) | 2 | 11 | 🟢 Complete |
| [`notifications/`](./notifications/README.md) | 1 | 4 | 🟡 Partial |
| [`customers/`](./customers/README.md) | 6 | 8 | 🟡 Partial |
| [`staff/`](./staff/README.md) | 4 | 10 | 🟡 Partial |
| [`administration/`](./administration/README.md) | 8 | 2 | 🔴 Not Started |
| [`system-admin/`](./system-admin/README.md) | 5 | 2 | 🔴 Not Started |

**Legend**: 🟢 Complete (all wireframes done) | 🟡 Partial (some wireframes done) | 🔴 Not Started

---

## Related Documents

- **[Migration Plan](../MIGRATION-PLAN.md)** — Directory restructuring plan and execution guide
- **[Data Dictionaries](./data-dictionary-index.md)** — Entity relationship documentation
- **[Table View Rules](../rules/table-view.md)** — TanStack React Table implementation guidelines
- **[AGENTS.md](../../AGENTS.md)** — Project-specific agent instructions

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-31 | 2.0 | Restructured as top-level navigation doc per migration plan |
| 2026-03-30 | 1.0 | Initial analysis from `site.htmlm` |

---

**End of Navigation Document**
