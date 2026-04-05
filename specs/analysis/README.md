---
title: 'Analysis Domain'
---

# Analysis Domain Documentation

This directory contains domain-driven analysis documentation for the application, organized by business domain rather than technical layer.

> **Source**: Legacy `site.htmlm` application shell  
> **Target**: React 19 + Shadcn/ui + TanStack Router + Tailwind CSS 4

---

## Directory Structure

| Domain | Subdirectories | Description |
|--------|---------------|-------------|
| **[academy/](./academy/README.md)** | — | Support video, video library |
| **[accounting/](./accounting/README.md)** | `admin-job/`, `config/`, `invoice/`, `invoice-receiver/`, `worklog/` | Invoicing, job configuration, accounting config |
| **[customer/](./customer/README.md)** | `contact/`, `customer-core/`, `equipment/`, `room/` | Customer management, contacts, locations, rooms, equipment |
| **[interfaces/](./interfaces/README.md)** | `dashboard/` | BasisWeb wizard integration |
| **[planning/](./planning/README.md)** | `appointment/`, `appointment-admin/`, `appointment-support/`, `council/`, `dashboard/`, `shift/` | Appointments, shifts, councils, planning dashboards |
| **[system/](./system/README.md)** | `admin/`, `admin-cruds/`, `config/`, `dashboard/`, `includes/`, `notification/`, `shell/`, `templates-files/` | System config, admin, notifications, shared components |
| **[treatment/](./treatment/README.md)** | `appointment-patient/`, `consultation/`, `dashboard/`, `medication/`, `patient-data/`, `questionnaire/`, `treatment-core/`, `warning/` | Consultations, treatments, patient data |
| **[user-management/](./user-management/README.md)** | `admin/`, `dashboard/`, `profile/` | User profiles, admin, groups, skills, onboarding |
| **[components/](./components/README.md)** | — | Shared reusable components |
| **[orphan/](./orphan/README.md)** | — | Orphaned content with context |
| **[i18n/](./i18n/README.md)** | `domains/`, `scripts/` | Internationalization (cross-cutting) |
| **[mongodb-mapping/](./mongodb-mapping/README.md)** | — | MongoDB-to-Prisma schema mapping (cross-cutting) |
| **[permissions/](./permissions/README.md)** | — | RBAC matrix and permission gates (cross-cutting) |

---

## Application Sitemap (Legacy → Canonical Mapping)

The application's main navigation from the legacy `site.htmlm` shell maps to the current canonical structure as follows:

| # | Legacy Menu Item | Legacy Path | Canonical Path |
|---|-----------------|-------------|----------------|
| 1 | Dashboard | `dashboard/` | `system/dashboard/`, `planning/dashboard/` |
| 2 | Appointments | `appointments/` | `planning/appointment/` |
| 3 | Shifts | `shifts/` | `planning/shift/` |
| 4 | Treatments | `treatments/` | `treatment/treatment-core/` |
| 5 | Council | `council/` | `planning/council/` |
| 6 | Consultations | `consultations/` | `treatment/consultation/` |
| 7 | Appointment Admin | `appointment-admin/` | `planning/appointment-admin/` |
| 8 | Notifications | `notifications/` | `system/notification/` |
| 9 | Customers | `customers/` | `customer/` |
| 10 | Staff | `staff/` | `user-management/profile/`, `user-management/admin/` |
| 11 | Administration | `administration/` | `accounting/admin-job/`, `accounting/config/`, `treatment/warning/`, `user-management/admin/` |
| 12 | System Admin | `system-admin/` | `system/admin/`, `system/admin-cruds/`, `planning/appointment-support/` |

### Shared Components & Infrastructure

| Legacy Path | Canonical Path |
|-------------|----------------|
| `includes/` | `system/includes/`, `system/shell/`, `system/templates-files/` |

---

## Module Details

### System / Dashboard

**Canonical**: `system/dashboard/`, `planning/dashboard/`  
**Legacy URLs**: `/dash.html`, `/monthView.html`, `/weekView.html`, `/expertWorkMonthly.html`

| Submenu | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Calendar (Month View) | `planning/dashboard/calendar-view.md` | `planning/dashboard/calendar.png` |
| Week View | `planning/dashboard/week-view.md` | `planning/dashboard/expert-availability.png` |
| Worklog | `accounting/worklog/worklog.md` | `accounting/worklog/worklog.png` |

### Planning / Appointments

**Canonical**: `planning/appointment/`  
**Legacy URLs**: `/appointment.html`, `/appointmentPlan.html`, `/patientData.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Appointment List | `planning/appointment/appointment-list.md` | `planning/appointment/appointment-list.png` |
| Appointment Details | `planning/appointment/appointment-details-scheduling.md` | `planning/appointment/appointment-details.png` (+ sub-dialogs) |
| Assign User | `planning/appointment/appointment-assign-user.md` | `planning/appointment/appointment-assign-user.png` |

### Planning / Shifts

**Canonical**: `planning/shift/`  
**Legacy URLs**: `/shift.html`, `/shiftPlan.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Shift Plan | `planning/shift/shift-and-plan.md` | `planning/shift/shift-list.png`, `shift-plan-detail.png` |

### Treatment / Treatments

**Canonical**: `treatment/treatment-core/`  
**Legacy URLs**: `/treatment.html`, `/treatmentPlan.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Treatment Categories | `treatment/treatment-core/treatment-and-category.md` | — |
| Treatment Plan | `treatment/treatment-core/treatment-plan.md` | — |

### Planning / Council

**Canonical**: `planning/council/`  
**Legacy URLs**: `/council.html`, `/councilPlan.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Council Plan | `planning/council/council-and-plan.md` | `planning/council/council-list.png`, `council-plan-detail.png` |

### Treatment / Consultations

**Canonical**: `treatment/consultation/`  
**Legacy URLs**: `/consultation.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Consultation List | `treatment/consultation/consultation-list.md` | `treatment/consultation/consultation-list.png` |
| Details Header | `treatment/consultation/consultation-details-header.md` | `treatment/consultation/consultation-details-header.png` |
| Standard Form | `treatment/consultation/consultation-details-standard.md` | `treatment/consultation/consultation-details-standard.png` |
| Onboarding Form | `treatment/consultation/consultation-details-onboarding.md` | `treatment/consultation/consultation-details-onboarding.png` |
| Incarceration Form | `treatment/consultation/consultation-details-incarceration.md` | `treatment/consultation/consultation-details-incarceration.png` |
| Treatment/Warning | `treatment/consultation/consultation-details-treatment-warning.md` | `treatment/consultation/consultation-details-treatment-warning.png` |
| View/Review | `treatment/consultation/consultation-view-review.md` | `treatment/consultation/consultation-view.png`, `consultation-review.png` |

### Planning / Appointment Admin

**Canonical**: `planning/appointment-admin/`  
**Legacy URLs**: `/appointmentAdmin.html`, `/closedMonth.html`, `/questionaire.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Admin Grid | `planning/appointment-admin/appointment-admin.md` | `planning/appointment-admin/inline-consultation.png` (+ dialogs) |
| Closed Month | `planning/appointment-support/close-month.md` | `planning/appointment-support/close-month.png` |

### System / Notifications

**Canonical**: `system/notification/`  
**Legacy URLs**: `/notification.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Notification List | `system/notification/notification.md` | `system/notification/notification-list.png`, `notification-compose.png` |

### Customer

**Canonical**: `customer/`  
**Legacy URLs**: `/customer.html`, `/onboardingCustomer.html`, `/invoice.html`, `/invoiceReceiver.html`, `/room.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Customer List/Detail | `customer/customer-core/customer-list-detail.md` | `customer/customer-core/customer-list.png` |
| Locations & Users | `customer/customer-core/location-and-users.md` | `customer/customer-core/location-management.png` |
| Contact Management | `customer/contact/contact.md` | `customer/contact/contact-management.png` |
| Equipment | `customer/equipment/equipment.md` | `customer/equipment/equipment-management.png` |
| Room Management | `customer/room/room.md` | `customer/room/room-management.png` |
| Invoice List | `accounting/invoice/invoice-list.md` | `accounting/invoice/invoice-list.png` |
| Invoice Details | `accounting/invoice/invoice-details.md` | `accounting/invoice/invoice-details.png` |
| Invoice Receiver | `accounting/invoice-receiver/invoice-receiver.md` | `accounting/invoice-receiver/invoice-receiver.png` |

### User Management / Staff

**Canonical**: `user-management/profile/`, `user-management/admin/`  
**Legacy URLs**: `/staff.html`, `/onboarding.html`, `/adminUser.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Profile Form | `user-management/profile/profile-form.md` | `user-management/profile/profile-form.png` |
| Staff List | `user-management/profile/profile-staff.md` | `user-management/profile/profile-staff-list.png` |
| Profile Dialogs | `user-management/profile/profile-dialogs.md` | `user-management/profile/profile-password-dialog.png`, `profile-signature-pad.png` |
| Expert Availability | `user-management/profile/profile-expert-availability.md` | `user-management/profile/profile-expert-availability.png` |
| User Management | `user-management/admin/user-management.md` | — |
| Onboarding Flow | `user-management/admin/onboarding-flow.md` | — |
| Group Management | `user-management/admin/group-management.md` | — |
| Skill Management | `user-management/admin/skill.md` | — |
| TOTP Onboarding | `user-management/admin/totp-onboarding.md` | — |

### Accounting / Administration

**Canonical**: `accounting/admin-job/`, `accounting/config/`, `treatment/warning/`, `user-management/admin/`  
**Legacy URLs**: `/admin.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Job Configuration | `accounting/admin-job/job-configuration.md` | `accounting/admin-job/job-configuration.png` |
| Accounting Config | `accounting/config/accounting-config.md` | `accounting/config/accounting-config.png` |
| Warning Management | `treatment/warning/warning-management.md` | — |

### System / System Admin

**Canonical**: `system/admin/`, `system/admin-cruds/`, `planning/appointment-support/`  
**Legacy URLs**: `/sysadmin.html`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Admin Landing | `system/admin/admin-landing.md` | `system/admin/sysconfig-*.png` |
| MOTD Template | `system/admin-cruds/motd-template.md` | — |
| CDR Call List | `planning/appointment-support/cdr-call.md` | `planning/appointment-support/cdr-call-list.png` |
| CDR Assignment | `planning/appointment-support/workhour.md` | `planning/appointment-support/cdr-assignment-crud.png` |

### System / Shared Components

**Canonical**: `system/includes/`, `system/shell/`, `system/templates-files/`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Site Shell | `system/shell/site-shell.md` | `system/shell/app-shell-layout.png`, `global-navigation.png` |
| Shared Components | `system/includes/includes-shared-components.md` | `system/includes/navbar.png`, `loading-states.png`, `quick-filter.png` |
| Customization | `system/includes/includes-customization.md` | `system/includes/login.png`, `bug-report.png` |
| Templates & Files | `system/templates-files/templates-files.md` | — |

---

## Cross-Reference Index

### By Entity Type

| Entity | Primary Domain | Related Domains |
|--------|----------------|-----------------|
| Appointment | `planning/appointment/` | `planning/shift/`, `planning/council/`, `treatment/treatment-core/` |
| Consultation | `treatment/consultation/` | `treatment/`, `planning/appointment-admin/` |
| Customer | `customer/` | `user-management/` (customer users) |
| User/Staff | `user-management/` | `customer/` (assignment) |
| Invoice | `accounting/invoice/` | `accounting/admin-job/` (job pricing) |
| CDR Call | `planning/appointment-support/` | `planning/appointment-admin/` (assignment) |

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

## Correlation with Wireframes

Each analysis document correlates with wireframes in `specs/wireframes/` using the same domain and file names:

- Analysis: `planning/appointment/appointment-list.md` ↔ Wireframe: `planning/appointment/appointment-list.pen` / `.png`

---

## Progress Tracking

| Domain | Analysis | Wireframes | Features |
|--------|----------|------------|----------|
| Academy | ✅ | ✅ | 🔄 |
| Accounting | ✅ | ✅ | 🔄 |
| Customer | ✅ | ✅ | 🔄 |
| Interfaces | ✅ | ✅ | 🔄 |
| Planning | ✅ | ✅ | 🔄 |
| System | ✅ | ✅ | 🔄 |
| Treatment | ✅ | ✅ | 🔄 |
| User Management | ✅ | ✅ | 🔄 |

✅ Complete | 🔄 In Progress | ⏳ Pending

---

## Related Documents

- **[Data Dictionaries](./data-dictionary-index.md)** — Entity relationship documentation
- **[Wireframe Plan Registry](../planning/wireframe-plan-registry.md)** — Complete wireframe inventory and design system reference
- **[Analysis-Wireframe Mapping](../wireframes/analysis-wireframes-mapping.md)** — Maps analysis files to wireframe files
