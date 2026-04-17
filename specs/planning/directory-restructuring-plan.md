# Directory Restructuring Plan

**Date**: 2026-04-16
**Based on**: Chapter 2.4 "Detailed Sitemap with Submenu Items" from `specs/analysis/readme.md`
**Status**: DRAFT v5 - Awaiting Approval (Link Text Added)

---

## Overview

This plan defines the target directory structure for `specs/analysis/` based on the sitemap navigation hierarchy in chapter 2.4. The restructure aligns documentation files with their corresponding menu items in the application navigation.

---

## Approval Scope and Link Text Index

This plan is the approval artifact. The implementation script is the execution artifact.

The restructure must also update the README navigation link text in `specs/analysis/readme.md` so the documented sitemap, file structure, and cross-links remain aligned after the move.

| Link text | Source path | Target path | Notes |
|-----------|-------------|-------------|-------|
| Dashboard | `system/dashboard/dashboard-main.md` | `01-dashboard/dashboard-main.md` | Main menu item |
| Calendar | `planning/dashboard/calendar-view.md` | `01-dashboard/calendar-view.md` | Dashboard submenu |
| Week View | `planning/dashboard/week-view.md` | `01-dashboard/week-view.md` | Dashboard submenu |
| Worklog | `accounting/worklog/worklog.md` | `01-dashboard/worklog.md` | Dashboard submenu |
| Video Library | `orphan/support-and-video.md` | `01-dashboard/video-library.md` | External URL entry |
| Appointments | `planning/appointment/appointment-list.md` | `02-appointments/appointment-list.md` | Main menu item |
| Appointment Plan | `planning/appointment/appointment-plan.md` | `02-appointments/appointment-plan.md` | Submenu item |
| Patient Data | `treatment/patient-data/patient-data.md` | `02-appointments/patient-data.md` | Submenu item |
| Shifts | `planning/shift/shift-and-plan.md` | `03-shifts/shift-and-plan.md` | Main menu item |
| Treatments | `treatment/treatment-core/treatment-and-category.md` | `04-treatments/treatment-and-category.md` | Main menu item |
| Council | `planning/council/council-and-plan.md` | `05-council/council-and-plan.md` | Main menu item |
| Consultations | `treatment/consultation/consultation-list.md` | `06-consultations/consultation-list.md` | Main menu item |
| Appointment Admin | `planning/appointment-admin/appointment-admin.md` | `07-appointment-admin/appointment-admin.md` | Main menu item |
| Notifications | `system/notification/notification.md` | `08-notifications/notification.md` | Main menu item |
| Customers | `customer/customer-core/customer-list-detail.md` | `09-customers/customer-list-detail.md` | Main menu item |
| Staff | `staff/staff-list.md` | `10-staff/staff-list.md` | Main menu item |
| Administration | `admin/admin-landing.md` | `11-administration/admin-landing.md` | Main menu item |
| Systemadmin | `system/admin/admin-landing.md` | `12-systemadmin/change-log.md` | Main menu item |
| Global Menu | N/A | N/A | UI shell, not a file move |

---

## Current Structure Summary

```
specs/analysis/
├── academy/
├── accounting/
│   ├── admin-job/
│   ├── config/
│   ├── invoice/
│   ├── invoice-receiver/
│   └── worklog/
├── customer/
│   ├── contact/
│   ├── customer-core/
│   ├── equipment/
│   └── room/
├── interfaces/
├── mongodb-mapping/
├── orphan/
├── planning/
│   ├── appointment/
│   ├── appointment-admin/
│   ├── appointment-support/
│   ├── council/
│   ├── dashboard/
│   └── shift/
├── system/
│   ├── admin/
│   ├── admin-cruds/
│   ├── config/
│   ├── dashboard/
│   ├── includes/
│   ├── notification/
│   └── templates-files/
├── treatment/
│   ├── appointment-patient/
│   ├── consultation/
│   ├── dashboard/
│   ├── medication/
│   ├── patient-data/
│   ├── questionnaire/
│   ├── treatment-core/
│   └── warning/
└── user-management/
    ├── admin/
    ├── dashboard/
    └── profile/
```

---

## Target Structure (Sitemap 2.4 Hierarchy)

Each tree entry below includes the README link text where that entry is directly referenced in chapter 2.4.

```
specs/analysis/
├── 01-dashboard/
│   ├── calendar-view.md  # README link text: Calendar
│   ├── week-view.md  # README link text: Week View
│   ├── month-view.md  # README link text: Calendar / month view
│   ├── dialogs-planning.md  # README link text: Dashboard support dialogs
│   ├── shift-dialog.md  # README link text: Shift Dialog
│   ├── worklog.md                    # (from accounting/worklog/)
│   ├── video-library.md             # (from orphan/support-and-video.md)
│   ├── dashboard-main.md            # (from system/dashboard/)
│   ├── dashboard-selfservice.md      # (from system/dashboard/)
│   ├── consultation-template.md      # (from treatment/dashboard/)
│   ├── consultation-wizard.md        # (from treatment/dashboard/)
│   └── data-dictionary-planning.md  # Shared planning data dictionary
│
├── 02-appointments/
│   ├── appointment-list.md           # (from planning/appointment/)
│   ├── appointment-plan.md           # (from planning/appointment/) - SEPARATE file
│   ├── patient-data.md               # (from treatment/patient-data/)
│   └── data-dictionary-planning.md   # Shared
│
├── 03-shifts/
│   ├── shift-and-plan.md             # (from planning/shift/)
│   └── data-dictionary-planning.md   # Shared
│
├── 04-treatments/
│   ├── treatment-plan.md             # (from treatment/treatment-core/)
│   ├── treatment-and-category.md     # (from treatment/treatment-core/)
│   └── data-dictionary-treatment.md  # Shared treatment data dictionary
│
├── 05-council/
│   ├── council-and-plan.md           # (from planning/council/)
│   └── data-dictionary-planning.md   # Shared
│
├── 06-consultations/
│   ├── consultation-list.md          # (from treatment/consultation/)
│   ├── consultation-details-header.md
│   ├── consultation-details-standard.md
│   ├── consultation-details-onboarding.md
│   ├── consultation-details-incarceration.md
│   ├── consultation-details-treatment-warning.md
│   ├── consultation-view-review.md
│   └── data-dictionary-treatment.md  # Shared
│
├── 07-appointment-admin/
│   ├── appointment-admin.md          # Main page analysis (from planning/appointment-admin/)
│   ├── closed-month.md               # (from planning/appointment-support/)
│   ├── questionnaire-list.md         # (from treatment/questionnaire/)
│   ├── questionnaire-detail.md  # README link text: Questionnaire
│   └── data-dictionary-planning.md   # Shared
│
├── 08-notifications/
│   ├── notification.md               # (from system/notification/)
│   └── data-dictionary-system.md     # Shared system data dictionary
│
├── 09-customers/
│   ├── customer-list-detail.md       # (from customer/customer-core/)
│   ├── onboarding-customer.md        # (from user-management/admin/)
│   ├── invoices.md                  # (from accounting/invoice/)
│   ├── invoice-list.md  # README link text: Invoices
│   ├── invoice-details.md  # README link text: Invoices
│   ├── invoice-receiver.md          # (from accounting/invoice-receiver/)
│   ├── customer-users.md             # (from customer/customer-core/)
│   ├── locations.md                  # (from customer/customer-core/)
│   ├── rooms.md                      # (from customer/room/)
│   ├── onboarding-location.md       # (from user-management/admin/)
│   └── data-dictionary-customer.md   # Shared customer data dictionary
│
├── 10-staff/
│   ├── onboarding.md                 # (from user-management/admin/)
│   ├── user-management.md  # README link text: User Management
│   ├── expert-weekly-assignments.md  # (from accounting/worklog/)
│   └── data-dictionary-user-management.md  # Shared
│
├── 11-administration/
│   ├── job-ids.md                    # (from accounting/admin-job/)
│   ├── async-job-queue.md            # (from mongodb-mapping/system.md)
│   ├── job-price-list.md             # (from accounting/config/)
│   ├── products.md                   # (from accounting/config/)
│   ├── skills.md                     # (from user-management/admin/)
│   ├── exclusion-criteria.md         # (from system/config/)
│   ├── export-templates.md           # (from system/templates-files/)
│   ├── warnings.md                   # (from treatment/warning/)
│   ├── treatment-categories.md       # (from treatment/treatment-core/)
│   ├── equipment.md                  # (from customer/equipment/)
│   ├── onboarding-steps.md           # (from user-management/admin/)
│   └── data-dictionary-accounting.md  # Shared
│
├── 12-systemadmin/
│   ├── motd.md                       # (from system/admin-cruds/)
│   ├── dashboard-admin.md           # (from system/admin/)
│   ├── login-notification.md         # (from system/config/)
│   ├── notification-templates.md     # (from system/templates-files/)
│   ├── location-types.md             # (from system/config/)
│   ├── storno-groups.md              # (from accounting/config/)
│   ├── work-hours.md                 # (from planning/appointment-support/)
│   ├── cdr.md                        # (from planning/appointment-support/)
│   ├── cdr-assignment.md  # README link text: CDR Assignment
│   ├── log.md                        # (from mongodb-mapping/system.md)
│   ├── support-categories.md         # (from system/config/)
│   ├── basisweb-appointments.md      # (from mongodb-mapping/interfaces.md)
│   ├── change-log.md                 # (from system/admin/)
│   └── data-dictionary-system.md     # Shared
│
├── _shared-components/
│   ├── appointment-assign-user.md    # (from planning/appointment/)
│   ├── appointment-details-scheduling.md  # README link text: internal/shared reference
│   ├── appointment-details-patient.md  # (from treatment/appointment-patient/)
│   ├── consultation-details-js.md  # README link text: internal/shared reference
│   ├── dialogs-treatment.md          # (from treatment/dashboard/)
│   ├── dialogs-system.md             # (from system/dashboard/)
│   ├── dialogs-user-management.md    # (from user-management/dashboard/)
│   ├── medication.md                 # (from treatment/medication/)
│   ├── contact.md                    # (from customer/contact/)
│   ├── profile-expert-availability.md  # (from user-management/profile/)
│   ├── profile-staff.md  # README link text: internal/shared reference
│   ├── totp-onboarding.md           # (from user-management/admin/)
│   ├── group-management.md           # (from user-management/admin/)
│   ├── sysconfig-import.md           # (from system/admin/)
│   ├── includes-customization.md    # (from system/includes/)
│   ├── includes-shared-components.md # (from system/includes/)
│   ├── profile-form.md               # (from user-management/profile/)
│   ├── profile-dialogs.md            # (from user-management/profile/)
│   ├── user-video-history.md         # (from orphan/)
│   └── readme.md                     # (from system/dashboard/)
│
├── _data-dictionaries/
│   ├── data-dictionary-academy.md  # README link text: data dictionary
│   ├── data-dictionary-accounting.md  # README link text: data dictionary
│   ├── data-dictionary-customer.md  # README link text: data dictionary
│   ├── data-dictionary-interfaces.md  # README link text: data dictionary
│   ├── data-dictionary-planning.md  # README link text: data dictionary
│   ├── data-dictionary-system.md  # README link text: data dictionary
│   ├── data-dictionary-treatment.md  # README link text: data dictionary
│   └── data-dictionary-user-management.md  # README link text: data dictionary
│
├── _mongodb-mapping/
│   ├── system.md                     # (Async Job Queue, Log entities)
│   ├── interfaces.md                 # (BasisWeb Appointment entity)
│   ├── accounting.md
│   ├── academy.md
│   ├── analysis-consultation-vs-consultationData.md
│   ├── capabilities.md
│   ├── customer.md
│   ├── deprecated.md
│   ├── external-data.md
│   ├── news.md
│   ├── planning.md
│   ├── readme.md  # README link text: internal/shared reference
│   ├── treatment.md
│   └── user-management.md  # README link text: User Management
│
├── _i18n/
│   ├── domains/
│   │   ├── academy.md
│   │   ├── accounting.md
│   │   ├── customer.md
│   │   ├── interfaces.md
│   │   ├── planning.md
│   │   ├── readme.md  # README link text: internal/shared reference
│   │   ├── system.md
│   │   ├── treatment.md
│   │   └── user-management.md  # README link text: User Management
│   ├── hardcoded-strings.md
│   ├── missing-keys.md
│   ├── readme.md  # README link text: internal/shared reference
│   ├── translation-guide.md
│   └── translation-inventory.md
│
├── _interfaces/
│   ├── basisweb-wizard.md            # (from interfaces/dashboard/)
│   └── data-dictionary-interfaces.md  # README link text: data dictionary
│
├── _orphan/
│   └── (empty - all files moved to their sitemap locations)
│
├── _wireframes/
│   └── wireframes-index.md
│
└── readme.md                         # Main analysis readme
```

---

## File Mapping Table

### 01-dashboard

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `01-dashboard/calendar-view.md` | `planning/dashboard/calendar-view.md` | |
| `01-dashboard/week-view.md` | `planning/dashboard/week-view.md` | |
| `01-dashboard/month-view.md` | `planning/dashboard/month-view.md` | |
| `01-dashboard/dialogs-planning.md` | `planning/dashboard/dialogs-planning.md` | |
| `01-dashboard/shift-dialog.md` | `planning/dashboard/shift-dialog.md` | |
| `01-dashboard/worklog.md` | `accounting/worklog/worklog.md` | Worklog submenu item |
| `01-dashboard/video-library.md` | `orphan/support-and-video.md` | Renamed |
| `01-dashboard/dashboard-main.md` | `system/dashboard/dashboard-main.md` | Dashboard shell analysis |
| `01-dashboard/dashboard-selfservice.md` | `system/dashboard/dashboard-selfservice.md` | Selfservice section |
| `01-dashboard/consultation-template.md` | `treatment/dashboard/consultation-template.md` | Dashboard consultation flow |
| `01-dashboard/consultation-wizard.md` | `treatment/dashboard/consultation-wizard.md` | Dashboard consultation wizard |

**Note**: `data-dictionary-planning.md` is NOT placed in `01-dashboard/` - it only goes to `_data-dictionaries/` as the canonical location for all data dictionaries.

### 02-appointments

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `02-appointments/appointment-list.md` | `planning/appointment/appointment-list.md` | Contains appointment list analysis |
| `02-appointments/appointment-plan.md` | `planning/appointment/appointment-plan.md` | SEPARATE file - AppointmentPlan + CdrCall module analysis |
| `02-appointments/patient-data.md` | `treatment/patient-data/patient-data.md` | |

### 03-shifts

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `03-shifts/shift-and-plan.md` | `planning/shift/shift-and-plan.md` | |

### 04-treatments

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `04-treatments/treatment-plan.md` | `treatment/treatment-core/treatment-plan.md` | |
| `04-treatments/treatment-and-category.md` | `treatment/treatment-core/treatment-and-category.md` | Treatment Categories |

### 05-council

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `05-council/council-and-plan.md` | `planning/council/council-and-plan.md` | |

### 06-consultations

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `06-consultations/consultation-list.md` | `treatment/consultation/consultation-list.md` | |
| `06-consultations/consultation-details-header.md` | `treatment/consultation/consultation-details-header.md` | |
| `06-consultations/consultation-details-standard.md` | `treatment/consultation/consultation-details-standard.md` | |
| `06-consultations/consultation-details-onboarding.md` | `treatment/consultation/consultation-details-onboarding.md` | |
| `06-consultations/consultation-details-incarceration.md` | `treatment/consultation/consultation-details-incarceration.md` | |
| `06-consultations/consultation-details-treatment-warning.md` | `treatment/consultation/consultation-details-treatment-warning.md` | |
| `06-consultations/consultation-view-review.md` | `treatment/consultation/consultation-view-review.md` | |

### 07-appointment-admin

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `07-appointment-admin/appointment-admin.md` | `planning/appointment-admin/appointment-admin.md` | **Main page analysis - ADDED** |
| `07-appointment-admin/closed-month.md` | `planning/appointment-support/close-month.md` | |
| `07-appointment-admin/questionnaire-list.md` | `treatment/questionnaire/questionnaire-list.md` | |
| `07-appointment-admin/questionnaire-detail.md` | `treatment/questionnaire/questionnaire-detail.md` | |

### 08-notifications

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `08-notifications/notification.md` | `system/notification/notification.md` | |

### 09-customers

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `09-customers/customer-list-detail.md` | `customer/customer-core/customer-list-detail.md` | **ADDED** |
| `09-customers/onboarding-customer.md` | `user-management/admin/onboarding-flow.md` | Onboarding Customer |
| `09-customers/invoice-list.md` | `accounting/invoice/invoice-list.md` | |
| `09-customers/invoice-details.md` | `accounting/invoice/invoice-details.md` | |
| `09-customers/invoice-receiver.md` | `accounting/invoice-receiver/invoice-receiver.md` | |
| `09-customers/locations.md` | `customer/customer-core/location-and-users.md` | Locations submenu |
| `09-customers/customer-users.md` | `customer/customer-core/location-and-users.md` | Customer Users submenu (cp) |
| `09-customers/rooms.md` | `customer/room/room.md` | |
| `09-customers/onboarding-location.md` | `user-management/admin/onboarding-flow.md` | Onboarding Location (cp) |

### 10-staff

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `10-staff/onboarding.md` | `user-management/admin/onboarding-flow.md` | (cp) |
| `10-staff/user-management.md` | `user-management/admin/user-management.md` | |
| `10-staff/expert-weekly-assignments.md` | `accounting/worklog/worklog.md` | Expert Weekly Assignments (cp) |

### 11-administration

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `11-administration/job-ids.md` | `accounting/admin-job/job-configuration.md` | |
| `11-administration/async-job-queue.md` | `mongodb-mapping/system.md` | Async Job Queue section |
| `11-administration/job-price-list.md` | `accounting/config/accounting-config.md` | Job Price List section |
| `11-administration/products.md` | `accounting/config/accounting-config.md` | Products section |
| `11-administration/skills.md` | `user-management/admin/skill.md` | |
| `11-administration/exclusion-criteria.md` | `system/config/system-config.md` | Exclusion Criteria section |
| `11-administration/export-templates.md` | `system/templates-files/templates-files.md` | Export Template section |
| `11-administration/warnings.md` | `treatment/warning/warning-management.md` | |
| `11-administration/treatment-categories.md` | `treatment/treatment-core/treatment-and-category.md` | Treatment Categories section |
| `11-administration/equipment.md` | `customer/equipment/equipment.md` | |
| `11-administration/onboarding-steps.md` | `user-management/admin/onboarding-flow.md` | Onboarding Steps section (cp) |

### 12-systemadmin

| Target File | Source File | Notes |
|-------------|-------------|-------|
| `12-systemadmin/motd.md` | `system/admin-cruds/motd-template.md` | |
| `12-systemadmin/dashboard-admin.md` | `system/admin/dashboard-admin.md` | **ADDED** |
| `12-systemadmin/login-notification.md` | `system/config/system-config.md` | Login Notification section |
| `12-systemadmin/notification-templates.md` | `system/templates-files/templates-files.md` | Notification Template section |
| `12-systemadmin/location-types.md` | `system/config/system-config.md` | Location Types section |
| `12-systemadmin/storno-groups.md` | `accounting/config/accounting-config.md` | Storno Groups section |
| `12-systemadmin/work-hours.md` | `planning/appointment-support/workhour.md` | |
| `12-systemadmin/cdr.md` | `planning/appointment-support/cdr-call.md` | |
| `12-systemadmin/cdr-assignment.md` | `planning/appointment-support/cdr-call.md` | CDR Assignment section (cp) |
| `12-systemadmin/log.md` | `mongodb-mapping/system.md` | Log section |
| `12-systemadmin/support-categories.md` | `system/config/system-config.md` | Support Categories section |
| `12-systemadmin/basisweb-appointments.md` | `mongodb-mapping/interfaces.md` | BasisWeb Appointment section |
| `12-systemadmin/change-log.md` | `system/admin/admin-landing.md` | Change Log section |

---

## Directory Content After Restructuring

### 01-dashboard/

```
01-dashboard/
├── calendar-view.md
├── week-view.md
├── month-view.md
├── dialogs-planning.md
├── shift-dialog.md
├── worklog.md
├── video-library.md
├── dashboard-main.md                 # Dashboard shell
├── dashboard-selfservice.md          # Selfservice section
├── consultation-template.md           # Consultation template
├── consultation-wizard.md             # Consultation wizard
└── data-dictionary-planning.md
```

### 02-appointments/

```
02-appointments/
├── appointment-list.md               # Appointment List page
├── appointment-plan.md               # AppointmentPlan + CdrCall modules
├── patient-data.md
└── data-dictionary-planning.md
```

### 03-shifts/

```
03-shifts/
├── shift-and-plan.md
└── data-dictionary-planning.md
```

### 04-treatments/

```
04-treatments/
├── treatment-plan.md
├── treatment-and-category.md
└── data-dictionary-treatment.md
```

### 05-council/

```
05-council/
├── council-and-plan.md
└── data-dictionary-planning.md
```

### 06-consultations/

```
06-consultations/
├── consultation-list.md
├── consultation-details-header.md
├── consultation-details-standard.md
├── consultation-details-onboarding.md
├── consultation-details-incarceration.md
├── consultation-details-treatment-warning.md
├── consultation-view-review.md
└── data-dictionary-treatment.md
```

### 07-appointment-admin/

```
07-appointment-admin/
├── appointment-admin.md             # Main page analysis
├── closed-month.md
├── questionnaire-list.md
├── questionnaire-detail.md
└── data-dictionary-planning.md
```

### 08-notifications/

```
08-notifications/
├── notification.md
└── data-dictionary-system.md
```

### 09-customers/

```
09-customers/
├── customer-list-detail.md
├── onboarding-customer.md
├── invoice-list.md
├── invoice-details.md
├── invoice-receiver.md
├── locations.md
├── customer-users.md
├── rooms.md
├── onboarding-location.md
└── data-dictionary-customer.md
```

### 10-staff/

```
10-staff/
├── onboarding.md
├── user-management.md
├── expert-weekly-assignments.md
└── data-dictionary-user-management.md
```

### 11-administration/

```
11-administration/
├── job-ids.md
├── async-job-queue.md
├── job-price-list.md
├── products.md
├── skills.md
├── exclusion-criteria.md
├── export-templates.md
├── warnings.md
├── treatment-categories.md
├── equipment.md
├── onboarding-steps.md
└── data-dictionary-accounting.md
```

### 12-systemadmin/

```
12-systemadmin/
├── motd.md
├── dashboard-admin.md                # Admin section of dashboard
├── login-notification.md
├── notification-templates.md
├── location-types.md
├── storno-groups.md
├── work-hours.md
├── cdr.md
├── cdr-assignment.md
├── log.md
├── support-categories.md
├── basisweb-appointments.md
├── change-log.md
└── data-dictionary-system.md
```

### _shared-components/

```
_shared-components/
├── appointment-assign-user.md
├── appointment-details-scheduling.md
├── appointment-details-patient.md
├── consultation-details-js.md
├── dialogs-treatment.md
├── dialogs-system.md
├── dialogs-user-management.md
├── medication.md
├── contact.md
├── profile-expert-availability.md
├── profile-staff.md
├── totp-onboarding.md
├── group-management.md
├── sysconfig-import.md
├── includes-customization.md
├── includes-shared-components.md
├── profile-form.md
├── profile-dialogs.md
├── user-video-history.md
└── readme.md                         # from system/dashboard/
```

### _data-dictionaries/

```
_data-dictionaries/
├── data-dictionary-academy.md
├── data-dictionary-accounting.md
├── data-dictionary-customer.md
├── data-dictionary-interfaces.md
├── data-dictionary-planning.md
├── data-dictionary-system.md
├── data-dictionary-treatment.md
└── data-dictionary-user-management.md
```

### _mongodb-mapping/

```
_mongodb-mapping/
├── system.md
├── interfaces.md
├── accounting.md
├── academy.md
├── analysis-consultation-vs-consultationData.md
├── capabilities.md
├── customer.md
├── deprecated.md
├── external-data.md
├── news.md
├── planning.md
├── readme.md
├── treatment.md
└── user-management.md
```

### _i18n/

```
_i18n/
├── domains/
│   ├── academy.md
│   ├── accounting.md
│   ├── customer.md
│   ├── interfaces.md
│   ├── planning.md
│   ├── readme.md  # README link text: internal/shared reference
│   ├── system.md
│   ├── treatment.md
│   └── user-management.md  # README link text: User Management
├── hardcoded-strings.md
├── missing-keys.md
├── readme.md
├── translation-guide.md
└── translation-inventory.md
```

### _interfaces/

```
_interfaces/
├── basisweb-wizard.md
└── data-dictionary-interfaces.md
```

### _orphan/

```
_orphan/
└── (empty - all files moved to their sitemap locations)
```

---

## Files NOT Moved (Stay at Root)

The following files remain at the root level and are NOT restructured:

- `specs/analysis/readme.md` - Main analysis documentation
- `specs/analysis/data-dictionary-index.md` - Index to data dictionaries
- `specs/analysis/wireframes-index.md` - Index to wireframes

---

## Implementation Script (FIXED)

> The script is responsible for both moving files and rewriting README cross-links. README updates are not a manual follow-up; they are part of execution.

```bash
#!/bin/bash
# specs/planning/restructuring-script.sh
# Restructures specs/analysis/ directory according to sitemap 2.4
# Version 2 - Fixed inconsistencies

set -e

ANALYSIS_DIR="specs/analysis"
BACKUP_DIR="specs/analysis-backup-$(date +%Y%m%d-%H%M%S)"

echo "Creating backup at $BACKUP_DIR..."
cp -r "$ANALYSIS_DIR" "$BACKUP_DIR"

echo "Creating directory structure..."
mkdir -p "$ANALYSIS_DIR/01-dashboard"
mkdir -p "$ANALYSIS_DIR/02-appointments"
mkdir -p "$ANALYSIS_DIR/03-shifts"
mkdir -p "$ANALYSIS_DIR/04-treatments"
mkdir -p "$ANALYSIS_DIR/05-council"
mkdir -p "$ANALYSIS_DIR/06-consultations"
mkdir -p "$ANALYSIS_DIR/07-appointment-admin"
mkdir -p "$ANALYSIS_DIR/08-notifications"
mkdir -p "$ANALYSIS_DIR/09-customers"
mkdir -p "$ANALYSIS_DIR/10-staff"
mkdir -p "$ANALYSIS_DIR/11-administration"
mkdir -p "$ANALYSIS_DIR/12-systemadmin"
mkdir -p "$ANALYSIS_DIR/_shared-components"
mkdir -p "$ANALYSIS_DIR/_data-dictionaries"
mkdir -p "$ANALYSIS_DIR/_mongodb-mapping"
mkdir -p "$ANALYSIS_DIR/_i18n/domains"
mkdir -p "$ANALYSIS_DIR/_interfaces"
mkdir -p "$ANALYSIS_DIR/_orphan"

# ============================================================================
# STEP 1: Move files from treatment/dashboard/ FIRST (before moving parent)
# ============================================================================
mv "$ANALYSIS_DIR/treatment/dashboard/consultation-template.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/treatment/dashboard/consultation-wizard.md" "$ANALYSIS_DIR/01-dashboard/"

# ============================================================================
# STEP 2: Move files to 01-dashboard
# ============================================================================
mv "$ANALYSIS_DIR/planning/dashboard/calendar-view.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/planning/dashboard/week-view.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/planning/dashboard/month-view.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/planning/dashboard/dialogs-planning.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/planning/dashboard/shift-dialog.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/accounting/worklog/worklog.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/orphan/support-and-video.md" "$ANALYSIS_DIR/01-dashboard/video-library.md"
mv "$ANALYSIS_DIR/system/dashboard/dashboard-main.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/system/dashboard/dashboard-selfservice.md" "$ANALYSIS_DIR/01-dashboard/"
mv "$ANALYSIS_DIR/system/dashboard/readme.md" "$ANALYSIS_DIR/_shared-components/readme.md"
mv "$ANALYSIS_DIR/planning/data-dictionary-planning.md" "$ANALYSIS_DIR/01-dashboard/"

# ============================================================================
# STEP 3: Move files to 02-appointments
# ============================================================================
mv "$ANALYSIS_DIR/planning/appointment/appointment-list.md" "$ANALYSIS_DIR/02-appointments/"
mv "$ANALYSIS_DIR/planning/appointment/appointment-plan.md" "$ANALYSIS_DIR/02-appointments/"
mv "$ANALYSIS_DIR/treatment/patient-data/patient-data.md" "$ANALYSIS_DIR/02-appointments/"

# ============================================================================
# STEP 4: Move _shared-components from planning/appointment/ BEFORE directory move
# ============================================================================
mv "$ANALYSIS_DIR/planning/appointment/appointment-assign-user.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/planning/appointment/appointment-details-scheduling.md" "$ANALYSIS_DIR/_shared-components/"

# ============================================================================
# STEP 5: Move files to 03-shifts
# ============================================================================
mv "$ANALYSIS_DIR/planning/shift/shift-and-plan.md" "$ANALYSIS_DIR/03-shifts/"

# ============================================================================
# STEP 6: Move files to 04-treatments
# ============================================================================
mv "$ANALYSIS_DIR/treatment/treatment-core/treatment-plan.md" "$ANALYSIS_DIR/04-treatments/"
mv "$ANALYSIS_DIR/treatment/treatment-core/treatment-and-category.md" "$ANALYSIS_DIR/04-treatments/"

# ============================================================================
# STEP 7: Move files to 05-council
# ============================================================================
mv "$ANALYSIS_DIR/planning/council/council-and-plan.md" "$ANALYSIS_DIR/05-council/"

# ============================================================================
# STEP 8: Move consultation files BEFORE moving parent directory
# ============================================================================
mv "$ANALYSIS_DIR/treatment/consultation/consultation-list.md" "$ANALYSIS_DIR/06-consultations/"
mv "$ANALYSIS_DIR/treatment/consultation/consultation-details-header.md" "$ANALYSIS_DIR/06-consultations/"
mv "$ANALYSIS_DIR/treatment/consultation/consultation-details-standard.md" "$ANALYSIS_DIR/06-consultations/"
mv "$ANALYSIS_DIR/treatment/consultation/consultation-details-onboarding.md" "$ANALYSIS_DIR/06-consultations/"
mv "$ANALYSIS_DIR/treatment/consultation/consultation-details-incarceration.md" "$ANALYSIS_DIR/06-consultations/"
mv "$ANALYSIS_DIR/treatment/consultation/consultation-details-treatment-warning.md" "$ANALYSIS_DIR/06-consultations/"
mv "$ANALYSIS_DIR/treatment/consultation/consultation-view-review.md" "$ANALYSIS_DIR/06-consultations/"
mv "$ANALYSIS_DIR/treatment/consultation/consultation-details-js.md" "$ANALYSIS_DIR/_shared-components/"

# ============================================================================
# STEP 9: Move files to 07-appointment-admin
# ============================================================================
mv "$ANALYSIS_DIR/planning/appointment-admin/appointment-admin.md" "$ANALYSIS_DIR/07-appointment-admin/"
mv "$ANALYSIS_DIR/planning/appointment-support/close-month.md" "$ANALYSIS_DIR/07-appointment-admin/closed-month.md"
mv "$ANALYSIS_DIR/treatment/questionnaire/questionnaire-list.md" "$ANALYSIS_DIR/07-appointment-admin/"
mv "$ANALYSIS_DIR/treatment/questionnaire/questionnaire-detail.md" "$ANALYSIS_DIR/07-appointment-admin/"

# ============================================================================
# STEP 10: Move files to 08-notifications
# ============================================================================
mv "$ANALYSIS_DIR/system/notification/notification.md" "$ANALYSIS_DIR/08-notifications/"

# ============================================================================
# STEP 11: Move files to 09-customers
# ============================================================================
mv "$ANALYSIS_DIR/customer/customer-core/customer-list-detail.md" "$ANALYSIS_DIR/09-customers/"
mv "$ANALYSIS_DIR/user-management/admin/onboarding-flow.md" "$ANALYSIS_DIR/09-customers/onboarding-customer.md"
cp "$ANALYSIS_DIR/09-customers/onboarding-customer.md" "$ANALYSIS_DIR/09-customers/onboarding-location.md"
mv "$ANALYSIS_DIR/accounting/invoice/invoice-list.md" "$ANALYSIS_DIR/09-customers/"
mv "$ANALYSIS_DIR/accounting/invoice/invoice-details.md" "$ANALYSIS_DIR/09-customers/"
mv "$ANALYSIS_DIR/accounting/invoice-receiver/invoice-receiver.md" "$ANALYSIS_DIR/09-customers/"
mv "$ANALYSIS_DIR/customer/customer-core/location-and-users.md" "$ANALYSIS_DIR/09-customers/locations.md"
cp "$ANALYSIS_DIR/09-customers/locations.md" "$ANALYSIS_DIR/09-customers/customer-users.md"
mv "$ANALYSIS_DIR/customer/room/room.md" "$ANALYSIS_DIR/09-customers/rooms.md"

# ============================================================================
# STEP 12: Move files to 10-staff
# ============================================================================
cp "$ANALYSIS_DIR/09-customers/onboarding-customer.md" "$ANALYSIS_DIR/10-staff/onboarding.md"
mv "$ANALYSIS_DIR/user-management/admin/user-management.md" "$ANALYSIS_DIR/10-staff/"
cp "$ANALYSIS_DIR/01-dashboard/worklog.md" "$ANALYSIS_DIR/10-staff/expert-weekly-assignments.md"

# ============================================================================
# STEP 13: Move files to 11-administration
# ============================================================================
mv "$ANALYSIS_DIR/accounting/admin-job/job-configuration.md" "$ANALYSIS_DIR/11-administration/job-ids.md"
mv "$ANALYSIS_DIR/user-management/admin/skill.md" "$ANALYSIS_DIR/11-administration/skills.md"
cp "$ANALYSIS_DIR/09-customers/onboarding-customer.md" "$ANALYSIS_DIR/11-administration/onboarding-steps.md"
mv "$ANALYSIS_DIR/treatment/warning/warning-management.md" "$ANALYSIS_DIR/11-administration/warnings.md"
mv "$ANALYSIS_DIR/customer/equipment/equipment.md" "$ANALYSIS_DIR/11-administration/equipment.md"

# ============================================================================
# STEP 14: Move files to 12-systemadmin
# ============================================================================
mv "$ANALYSIS_DIR/system/admin-cruds/motd-template.md" "$ANALYSIS_DIR/12-systemadmin/motd.md"
mv "$ANALYSIS_DIR/system/admin/dashboard-admin.md" "$ANALYSIS_DIR/12-systemadmin/dashboard-admin.md"
mv "$ANALYSIS_DIR/planning/appointment-support/workhour.md" "$ANALYSIS_DIR/12-systemadmin/work-hours.md"
mv "$ANALYSIS_DIR/planning/appointment-support/cdr-call.md" "$ANALYSIS_DIR/12-systemadmin/cdr.md"
cp "$ANALYSIS_DIR/12-systemadmin/cdr.md" "$ANALYSIS_DIR/12-systemadmin/cdr-assignment.md"
mv "$ANALYSIS_DIR/system/admin/admin-landing.md" "$ANALYSIS_DIR/12-systemadmin/change-log.md"

# ============================================================================
# STEP 15: Move remaining _shared-components
# ============================================================================
mv "$ANALYSIS_DIR/treatment/appointment-patient/appointment-details-patient.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/treatment/dashboard/dialogs-treatment.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/system/dashboard/dialogs-system.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/user-management/dashboard/dialogs-user-management.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/treatment/medication/medication.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/customer/contact/contact.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/user-management/profile/profile-expert-availability.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/user-management/profile/profile-staff.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/user-management/profile/profile-form.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/user-management/profile/profile-dialogs.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/user-management/admin/totp-onboarding.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/user-management/admin/group-management.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/system/admin/sysconfig-import.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/system/includes/includes-customization.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/system/includes/includes-shared-components.md" "$ANALYSIS_DIR/_shared-components/"
mv "$ANALYSIS_DIR/orphan/user-video-history.md" "$ANALYSIS_DIR/_shared-components/"

# ============================================================================
# STEP 16: Move _interfaces
# ============================================================================
mv "$ANALYSIS_DIR/interfaces/dashboard/basisweb-wizard.md" "$ANALYSIS_DIR/_interfaces/"

# ============================================================================
# STEP 17: Move _data-dictionaries
# ============================================================================
mv "$ANALYSIS_DIR/academy/data-dictionary-academy.md" "$ANALYSIS_DIR/_data-dictionaries/"
mv "$ANALYSIS_DIR/accounting/data-dictionary-accounting.md" "$ANALYSIS_DIR/_data-dictionaries/"
mv "$ANALYSIS_DIR/customer/data-dictionary-customer.md" "$ANALYSIS_DIR/_data-dictionaries/"
mv "$ANALYSIS_DIR/interfaces/data-dictionary-interfaces.md" "$ANALYSIS_DIR/_data-dictionaries/"
mv "$ANALYSIS_DIR/planning/data-dictionary-planning.md" "$ANALYSIS_DIR/_data-dictionaries/"
mv "$ANALYSIS_DIR/system/data-dictionary-system.md" "$ANALYSIS_DIR/_data-dictionaries/"
mv "$ANALYSIS_DIR/treatment/data-dictionary-treatment.md" "$ANALYSIS_DIR/_data-dictionaries/"
mv "$ANALYSIS_DIR/user-management/data-dictionary-user-management.md" "$ANALYSIS_DIR/_data-dictionaries/"

# ============================================================================
# STEP 18: Move _mongodb-mapping
# ============================================================================
mv "$ANALYSIS_DIR/mongodb-mapping/" "$ANALYSIS_DIR/_mongodb-mapping/"

# ============================================================================
# STEP 19: Move _i18n
# ============================================================================
mv "$ANALYSIS_DIR/i18n/" "$ANALYSIS_DIR/_i18n/"

# ============================================================================
# STEP 20: Clean up empty directories
# ============================================================================
rmdir "$ANALYSIS_DIR/planning/dashboard" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/planning/appointment" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/planning/shift" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/planning/council" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/planning/appointment-admin" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/planning/appointment-support" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/planning" 2>/dev/null || true

rmdir "$ANALYSIS_DIR/system/admin" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/system/admin-cruds" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/system/config" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/system/dashboard" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/system/includes" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/system/templates-files" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/system/notification" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/system" 2>/dev/null || true

rmdir "$ANALYSIS_DIR/treatment/consultation" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/treatment/dashboard" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/treatment/appointment-patient" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/treatment/medication" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/treatment/patient-data" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/treatment/treatment-core" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/treatment/warning" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/treatment" 2>/dev/null || true

rmdir "$ANALYSIS_DIR/customer/contact" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/customer/equipment" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/customer/room" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/customer/customer-core" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/customer" 2>/dev/null || true

rmdir "$ANALYSIS_DIR/accounting/admin-job" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/accounting/config" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/accounting/invoice" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/accounting/invoice-receiver" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/accounting/worklog" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/accounting" 2>/dev/null || true

rmdir "$ANALYSIS_DIR/user-management/admin" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/user-management/dashboard" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/user-management/profile" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/user-management" 2>/dev/null || true

rmdir "$ANALYSIS_DIR/interfaces/dashboard" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/interfaces" 2>/dev/null || true

rmdir "$ANALYSIS_DIR/academy" 2>/dev/null || true
rmdir "$ANALYSIS_DIR/orphan" 2>/dev/null || true

echo "Restructuring complete!"
echo "Backup location: $BACKUP_DIR"

# ============================================================================
# STEP 21: Fix Cross-References and README Links
# ============================================================================
echo "Fixing cross-references and README links..."
node "$(dirname "$0")/fix-cross-references.mjs"

echo "Done!"
```

---

## Cross-Reference Handling

The implementation script rewrites both internal file links and README navigation references. The README link text and the filesystem structure must stay synchronized.

### Problem

After restructuring, **464 markdown cross-references** will be broken. These include:

| Pattern | Example | Count |
|---------|---------|-------|
| Sibling links | `[text](./folder/file.md)` | Many |
| Parent links | `[text](../folder/file.md)` | Many |
| Grandparent links | `[text](../../folder/file.md)` | Many |
| With anchors | `[text](./file.md#section)` | Several |

### Solution: Automated Path Mapping

The plan includes a **path mapping table** and **fix-cross-references.mjs** script that:

1. **Maps OLD paths to NEW paths** (e.g., `planning/appointment/appointment-list.md` → `02-appointments/appointment-list.md`)
2. **Calculates new relative paths** based on each file's new location
3. **Rewrites all markdown links** in all `.md` files

### Path Mapping Table (Complete)

**Total: 104 source paths → 104 target paths** (see `fix-cross-references.mjs` for full mapping)

#### Content Extraction Source Files (NOT MOVED - Links Rewritten to Primary Target)

These files have content extracted into multiple targets. The source files **remain in place** but links to them are rewritten to point to the **primary target**:

| Source File | Primary Target | Other Targets | Links to Fix |
|------------|---------------|---------------|--------------|
| `accounting/config/accounting-config.md` | `11-administration/job-price-list.md` | Products, Storno Groups | 17 |
| `system/config/system-config.md` | `11-administration/exclusion-criteria.md` | Login Notification, Notification Templates, Location Types, Support Categories | 14 |
| `system/templates-files/templates-files.md` | `11-administration/export-templates.md` | Notification Templates | 16 |

**Total: 47 links** pointing to content extraction sources will be rewritten.

### Cross-Reference Fix Script

The `fix-cross-references.mjs` script is automatically run after the file moves. It:

1. Reads each `.md` file in `specs/analysis/`
2. Finds all `[text](path.md)` patterns
3. Looks up the target path in the mapping table
4. Calculates the new relative path from the source file's new location
5. Rewrites the link
6. **Handles content extraction sources** by mapping to primary target

**Usage:**
```bash
# Dry run (shows what would change)
node fix-cross-references.mjs --dry-run

# Live run (applies changes)
node fix-cross-references.mjs
```

### What Happens to Content Extraction Source Files

After restructuring, the source files remain in place but are now **orphaned** (no links point to them from the new structure). They are kept for reference but may be manually consolidated later.

---

## Known Issues / Inconsistencies (v3 → v4 Fixes)

1. **Plan File Mapping Table was incomplete** - Now references `fix-cross-references.mjs` for complete mapping
2. **Content extraction sources were not in PATH_MAPPING** - Now added to `fix-cross-references.mjs` with primary target mapping
3. **Script's CONTENT_EXTRACTION_SOURCES logic was incomplete** - Now properly rewrites links to primary target

---

## Files Added to Plan (v3)

| File | From | To | Reason |
|------|------|-----|--------|
| `planning/appointment-admin/appointment-admin.md` | 07-appointment-admin | NEW | Main page analysis was missing |
| `system/admin/dashboard-admin.md` | 12-systemadmin | NEW | Admin section of dashboard |
| `system/dashboard/dashboard-selfservice.md` | 01-dashboard | NEW | Selfservice section of dashboard |
| `system/dashboard/readme.md` | _shared-components | NEW | Dashboard folder readme |
| `customer/customer-core/customer-list-detail.md` | 09-customers | NEW | Customer list detail analysis |
| `mongodb-mapping/analysis-consultation-vs-consultationData.md` | _mongodb-mapping | NEW | Comparison analysis doc |
| `planning/appointment/appointment-plan.md` | 02-appointments | SEPARATE | Already existed as separate file |
| `treatment/dashboard/consultation-template.md` | 01-dashboard | MOVED FIRST | Was listed but mv was after directory move |
| `treatment/dashboard/consultation-wizard.md` | 01-dashboard | MOVED FIRST | Was listed but mv was after directory move |

---

## Script Fixes Applied (v3)

1. **Moved treatment/dashboard files FIRST** (before moving parent directories)
2. **Kept appointment-list.md and appointment-plan.md separate** (no rename conflict)
3. **Added missing files** to appropriate targets
4. **Fixed readme.md** from system/dashboard to go to _shared-components
5. **Added cross-reference fix step** (Step 21) - runs `fix-cross-references.mjs` after file moves

---

## Pre-Execution Checklist

- [ ] Review and approve this plan (including the link-text table)
- [ ] Ensure git working tree is clean or backed up
- [ ] Run script in a test environment first
- [ ] Verify all files are moved correctly after execution
- [ ] **Run cross-reference fix script** (`node fix-cross-references.mjs --dry-run` first to preview; validates README link text rewrites)
- [ ] Update any symlinks or references in other documentation
- [ ] Verify all cross-references are correct after fix

## Rollback Procedure

To rollback, restore from the backup created by the script:
```bash
rm -rf specs/analysis
mv specs/analysis-backup-YYYYMMDD-HHMMSS specs/analysis
```

---

**Approval Required**: Please review this plan and confirm execution.
