---
title: 'Analysis Domain'
---

# Analysis Domain Documentation

This directory contains domain-driven analysis documentation for the application, organized by business domain rather than technical layer. The core of this document is the **Application Shell Analysis** from the legacy `site.htmlm` file.

> **Source**: Legacy `site.htmlm` application shell (`web/src/main/webapp/site.htmlm`, 272 lines)  
> **Scope**: Main application shell that wraps all pages  
> **Target**: React 19 + Shadcn/ui + TanStack Router + Tailwind CSS 4  
> **Analysis Date**: 2026-03-30  

---

## 1. Overview

The `site.htmlm` file is the **main application shell** that wraps all other pages in the legacy application. It provides:

- **Global navigation sidebar** (runtime-generated from `{{sitemap}}`)
- **User dropdown menu** (profile, security, role switch, logout, bug report)
- **Shared infrastructure dialogs** (loading spinner, upload dialog, role switch modal)
- **Maintenance mode alert** (toast notification)
- **Permission/authority checks** (8 role-based variables)

This is the **outermost layout container** — all other pages are loaded into the `#main` content area via the `{{> content}}` template include.

---

## 2. Sitemap Overview

The sitemap is defined in `brownfield/web/src/main/webapp/index.json` under the `site.sitemap` key. It's a runtime-generated navigation structure with **12 main menu items**, each potentially containing submenu items.

### 2.1 Sitemap Tree View

The application's main navigation from the legacy `site.htmlm` shell maps to the current canonical analysis structure as follows:

- **Dashboard**: Dashboards for calendar, week view, worklog; video library support
  - [Calendar](01-dashboard/calendar-view.md)
  - [Week View](01-dashboard/week-view.md)
  - [Worklog](01-dashboard/worklog.md)
  - [Video Library](01-dashboard/video-library.md)

- **Appointments**: Appointments, shifts, councils, planning dashboards
  - [Appointment Plan](02-appointments/appointment-plan.md)
  - [Patient Data](02-appointments/patient-data.md)

- **Shifts**: Appointments, shifts, councils, planning dashboards
  - [Shift Plan](03-shifts/shift-and-plan.md)

- **Treatments**: Consultations, treatments, patient data
  - [Treatment Plan](04-treatments/treatment-plan.md)
  - [Treatment Plan History](04-treatments/treatment-plan.md)

- **Council**: Appointments, shifts, councils, planning dashboards
  - [Council Plan](05-council/council-and-plan.md)

- **Consultations**: Consultations, treatments, patient data
  - [Consultation List](06-consultations/consultation-list.md)

- **Appointment Admin**: Appointments, shifts, councils, planning dashboards
  - [Closed Month](07-appointment-admin/appointment-admin.md)
  - [Questionnaire](07-appointment-admin/questionnaire-list.md)

- **Notifications**: System config, admin, notifications, shared components
  - [Notification List](08-notifications/notification.md)

- **Customers**: Customer management, contacts, locations, rooms, equipment
  - [Onboarding Customer](09-customers/onboarding-customer.md)
  - [Invoices](09-customers/invoice-list.md)
  - [Invoice Receivers](09-customers/invoice-receiver.md)
  - [Customer Users](09-customers/locations.md)
  - [Locations](09-customers/locations.md)
  - [Rooms](09-customers/rooms.md)
  - [Onboarding Location](09-customers/onboarding-customer.md)

- **Staff**: User profiles, admin, groups, skills, onboarding
  - [Onboarding](09-customers/onboarding-customer.md)
  - [User Management](10-staff/user-management.md)
  - [Expert Weekly Assignments](01-dashboard/worklog.md)

- **Administration**: Invoicing, job configuration, accounting config; user profiles, admin, groups, skills, onboarding; consultations, treatments, patient data
  - [Job IDs](11-administration/job-ids.md)
  - [Async Job Queue](_mongodb-mapping/system.md#entity-async-job-queue)
  - [Job Price List](11-administration/job-price-list.md#e-job-price-list)
  - [Products](11-administration/job-price-list.md#f-product)
  - [Skills](11-administration/skills.md)
  - [Exclusion Criteria](11-administration/exclusion-criteria.md#b-exclusion-criteria)
  - [Export Templates](11-administration/export-templates.md#2-export-template)
  - [Warnings](11-administration/warnings.md)
  - [Treatment Categories](04-treatments/treatment-and-category.md)
  - [Equipment](11-administration/equipment.md)
  - [Onboarding Steps](09-customers/onboarding-customer.md)

- **Systemadmin**: System config, admin, notifications, shared components; appointments, shifts, councils, planning dashboards
  - [MOTD](12-systemadmin/motd.md)
  - [Login Notification](11-administration/exclusion-criteria.md#i-login-notification)
  - [Notification Templates](11-administration/export-templates.md#3-notification-template)
  - [Location Types](11-administration/exclusion-criteria.md#a-location-type)
  - [Storno Groups](11-administration/job-price-list.md#c-storno-group-cancellation-group)
  - [Work Hours](12-systemadmin/work-hours.md)
  - [CDR](12-systemadmin/cdr.md)
  - [CDR Assignment](12-systemadmin/cdr.md)
  - [Log](_mongodb-mapping/system.md#entity-logs)
  - [Support Categories](11-administration/exclusion-criteria.md#d-support-category)
  - [BasisWeb Appointments](_mongodb-mapping/interfaces.md#entity-basis-web-appointment)
  - [Change Log](12-systemadmin/change-log.md#8-page-changelog-changeloghtmlm)

- **Global Menu Items**: User utility actions always available in the sidebar
  - Search Toggle (full-text search)
  - [Settings / Profile](_shared-components/profile-form.md)
  - [Security](_shared-components/profile-dialogs.md)
  - [Role Switch](_shared-components/includes-shared-components.md) (requires `USERS_CREATE` authority)
  - [Bug Report](_shared-components/includes-shared-components.md)
  - Logout
  - Version Display

### 2.2 Sitemap JSON Structure

```json
{
  "sitemap": [
    {
      "url": "/dash.html",
      "id": "dashArea",
      "title": "Dashboard",
      "icon": "tachometer",
      "color": "color-dash",
      "sub": [
        {
          "url": "/monthView.html",
          "id": "monthViewArea",
          "title": "i18n.calendar",
          "icon": "calendar-alt"
        }
      ]
    }
  ]
}
```

### 2.3 Rights for Sitemap Structure

| # | Main Menu Item | URL | Icon | Color | Roles | Rights | Submenu Count |
|---|----------------|-----|------|-------|-------|--------|---------------|
| 1 | Dashboard | `/dash.html` | `tachometer` | `color-dash` | — | — | 4 |
| 2 | Appointments | `/appointment.html` | `user-md` | `color-appointment` | LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 2 |
| 3 | Shifts | `/shift.html` | `user-injured` | `color-shift` | LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 1 |
| 4 | Treatments | `/treatment.html` | `people-arrows` | `color-treatment` | LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 2 |
| 5 | Council | `/council.html` | `user-friends` | `color-council` | LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 1 |
| 6 | Consultations | `/consultation.html` | `heartbeat` | `color-consultation` | STANDARD, LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 0 |
| 7 | Appointment Admin | `/appointmentAdmin.html` | `calendar` | `color-appointmentAdmin` | LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 2 |
| 8 | Notifications | `/notification.html` | `comments` | `color-notify` | — | NOTIFICATION_READ, SELF_ASSIGNMENT | 1 |
| 9 | Customers | `/customer.html` | `hospital-user` | `color-customer` | LEITER_INTERN, ADMIN_INTERN, KUNDE_ADMIN, ADMIN | — | 7 |
| 10 | Staff | `/staff.html` | `user-md` | `color-user` | LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 3 |
| 11 | Administration | `/admin.html` | `user-cog` | `admin` | LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 11 |
| 12 | Systemadmin | `/sysadmin.html` | `cogs` | `sysadmin` | LEITER_INTERN, ADMIN_INTERN, ADMIN | — | 13 |
| 13 | Global Menu | `#globalMenu` | `user` | — | — | `USERS_CREATE` (Role Switch only) | 7 |

**Shell-Level Permission Gates** (template-level conditions applied outside the sitemap):

| Permission / Condition | Scope | Description |
|------------------------|-------|-------------|
| `roleSwitch` (authority: `USERS_CREATE`) | Role switch menu item + dialog | Only users who can create/modify users see the role switch option |
| `{{#search}}` | Full-text search input | Search feature visibility (always shown in current implementation) |
| `{{#maintenance}}` | Maintenance toast | Shown when `UserService.isMaintenance` returns true |
| `{{#roleSwitch}}` | Role switch menu item | Same as `roleSwitch` variable — gated by `USERS_CREATE` permission |

### 2.4 Detailed Sitemap with Submenu Items

> **Note**: Analysis document references point to existing documentation. Items marked with **TODO** need analysis documents created.
>
> **Cross-Reference Types in Analysis Doc**: `(include: {{> partial}})` | `(event flow: functionName)` | `(service: Service.method)`
>
> See `## Cross-References` section in each analysis document for detailed source-level couplings.

#### 1. Dashboard
- **English**: Dashboard
- **German**: Dashboard
- **i18n Key**: `Dashboard` (hardcoded, should be `menu.dashboard`)
- **Icon**: `fa-tachometer`
- **Color**: `color-dash`
- **Roles**: Always visible
- **Rights**: None
- **URL**: `/dash.html`
- **Analysis Doc**: [dashboard-main.md](01-dashboard/dashboard-main.md)
  - [basisweb-wizard.md](_interfaces/basisweb-wizard.md) (event flow: `loadBasisweb`)
  - [consultation-details-js.md](_shared-components/consultation-details-js.md) (event flow: `ConsultationDetails.open()`)
  - [consultation-template.md](01-dashboard/consultation-template.md) (event flow: `consultationWithTemplateBtn` click)
  - [consultation-wizard.md](01-dashboard/consultation-wizard.md) (event flow: `loadConsultation` outgoing)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Calendar | Calendar | Kalender | `/monthView.html` | `fa-calendar-alt` | `i18n.calendar` → `calendar.title` | — | [calendar-view.md](01-dashboard/calendar-view.md), [month-view.md](01-dashboard/month-view.md) | [workflows.md](../wireframes/planning/workflows.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |
  | Week View | Week View | Wochenansicht | `/weekView.html` | `fa-calendar-alt` | `i18n.weekView` → `weekView.title` | `EXPERT_WEEK` | [week-view.md](01-dashboard/week-view.md) | [workflows.md](../wireframes/planning/workflows.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |
  | Worklog | Worklog | Arbeitsprotokoll | `/expertWorkMonthly.html` | `fa-file-chart-line` | `i18n.Worklog` → `worklog.title` | — | [worklog.md](01-dashboard/worklog.md) | [workflows.md](../wireframes/accounting/workflows.md) | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) |
  | Video Library | Video Library | Videobibliothek | `https://learn.videoclinic.de/` | `fa-video` | `i18n.VideoLibrary` → `videoLibrary.title` | — | [support-and-video.md](01-dashboard/video-library.md) | — | [data-dictionary-academy.md](_data-dictionaries/data-dictionary-academy.md) |

#### 2. Appointments
- **English**: Appointments
- **German**: Termine
- **i18n Key**: `i18n.AppointmentType.APPOINTMENT` → `appointment.type.APPOINTMENT`
- **Icon**: `fa-user-md`
- **Color**: `color-appointment`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/appointment.html`
- **Analysis Doc**: [appointment-list.md](02-appointments/appointment-list.md)
  - [appointment-assign-user.md](_shared-components/appointment-assign-user.md) (include: `{{> assignUserDlg}}`)
  - [appointment-details-scheduling.md](_shared-components/appointment-details-scheduling.md) (include: `{{> appointmentDetails}}`)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Appointment Plan | Appointment Plan | Terminplan | `/appointmentPlan.html` | `fa-calendar-check` | `i18n.appointmentPlan` → `appointmentPlan.title` | — | [appointment-list.md](02-appointments/appointment-list.md), [appointment-details-scheduling.md](_shared-components/appointment-details-scheduling.md) | [workflows.md](../wireframes/planning/workflows.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |
  | Patient Data | Patient Data | Patientendaten | `/patientData.html` | `fa-user` | `i18n.PatientDataType` → `patientData.title` | — | [patient-data.md](02-appointments/patient-data.md) | — | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |

#### 3. Shifts
- **English**: Shifts
- **German**: Dienste
- **i18n Key**: `i18n.AppointmentType.SHIFT` → `appointment.type.SHIFT`
- **Icon**: `fa-user-injured`
- **Color**: `color-shift`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/shift.html`
- **Analysis Doc**: [shift-and-plan.md](03-shifts/shift-and-plan.md)
  - [appointment-assign-user.md](_shared-components/appointment-assign-user.md)
  - [appointment-details-scheduling.md](_shared-components/appointment-details-scheduling.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Shift Plan | Shift Plan | Dienstplan | `/shiftPlan.html` | `fa-calendar-check` | `i18n.shiftPlan` → `shiftPlan.title` | — | [shift-and-plan.md](03-shifts/shift-and-plan.md) | [workflows.md](../wireframes/planning/workflows.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |

#### 4. Treatments
- **English**: Treatments
- **German**: Therapien
- **i18n Key**: `i18n.Treatment` → `treatment.title`
- **Icon**: `fa-people-arrows`
- **Color**: `color-treatment`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/treatment.html`
- **Analysis Doc**: [treatment-and-category.md](04-treatments/treatment-and-category.md)
  - [appointment-assign-user.md](_shared-components/appointment-assign-user.md)
  - [appointment-details-scheduling.md](_shared-components/appointment-details-scheduling.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Treatment Plan | Treatment Plan | Therapieplan | `/treatmentPlan.html` | `fa-calendar-check` | `i18n.treatmentPlan` → `treatmentPlan.title` | — | [treatment-plan.md](04-treatments/treatment-plan.md) | — | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | Treatment Plan History | Treatment Plan History | Therapieplan-Historie | `/treatmentPlan.html?history=true` | `fa-calendar` | `i18n.treatmentPlanHistory` → `treatmentPlan.history` | — | [treatment-plan.md](04-treatments/treatment-plan.md) | — | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |

#### 5. Council
- **English**: Council
- **German**: Besprechung
- **i18n Key**: `i18n.AppointmentType.COUNCIL` → `appointment.type.COUNCIL`
- **Icon**: `fa-user-friends`
- **Color**: `color-council`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/council.html`
- **Analysis Doc**: [council-and-plan.md](05-council/council-and-plan.md)
  - [appointment-assign-user.md](_shared-components/appointment-assign-user.md)
  - [appointment-details-scheduling.md](_shared-components/appointment-details-scheduling.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Council Plan | Council Plan | Besprechungsplan | `/councilPlan.html` | `fa-calendar-check` | `i18n.councilPlanArea` → `councilPlan.title` | — | [council-and-plan.md](05-council/council-and-plan.md) | [workflows.md](../wireframes/planning/workflows.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |

#### 6. Consultations
- **English**: Consultations
- **German**: Konsultationen
- **i18n Key**: `i18n.consultation` → `consultation.title`
- **Icon**: `fa-heartbeat`
- **Color**: `color-consultation`
- **Roles**: STANDARD, LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/consultation.html`
- **Analysis Doc**: [consultation-list.md](06-consultations/consultation-list.md)
- **Submenu**: None (single-page module)
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Consultation List | Consultation List | Konsultationsliste | `/consultation.html` | `fa-heartbeat` | `consultation.title` | `STANDARD`, `LEITER_INTERN`, `ADMIN_INTERN`, `ADMIN` | [consultation-list.md](06-consultations/consultation-list.md) | [workflows.md](../wireframes/treatment/workflows.md) | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | Details Header | Consultation Details | Konsultationsdetails | `#consultationDetailsDlg` | `fa-heartbeat` | `consultation.title` | — | [consultation-details-header.md](06-consultations/consultation-details-header.md) | [workflows.md](../wireframes/treatment/workflows.md) | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | Standard Form | Documentation | Dokumentation | `#tabStandard` | `fa-notes-medical` | `consultation.documentation` | — | [consultation-details-standard.md](06-consultations/consultation-details-standard.md) | [workflows.md](../wireframes/treatment/workflows.md) | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | Onboarding Form | Onboarding | Onboarding | `#tabOnboarding` | `fa-file-exclamation` | `consultation.onboarding` | — | [consultation-details-onboarding.md](06-consultations/consultation-details-onboarding.md) | [workflows.md](../wireframes/treatment/workflows.md) | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | Incarceration Form | Incarceration | Gewahrsamkeit | `#tabIncarceration` | `fa-file-exclamation` | `consultation.incarceration` | — | [consultation-details-incarceration.md](06-consultations/consultation-details-incarceration.md) | [workflows.md](../wireframes/treatment/workflows.md) | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | Treatment/Warning | Treatment / Warning | Behandlung / Warnhinweise | `#tabTreatment` / `#tabWarning` | `fa-people-arrows` / `fa-exclamation-triangle` | `consultation.treatment` / `consultation.warning` | — | [consultation-details-treatment-warning.md](06-consultations/consultation-details-treatment-warning.md) | [workflows.md](../wireframes/treatment/workflows.md) | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | View/Review | View / Review | Ansicht / Überprüfung | `#consultationDetailsViewDlg` / `#consultationDetailsReviewDlg` | `fa-heartbeat` | `action.view` / `consultation.review` | `CONSULTATION_REPORTING`, `CONSULTATION_ADMIN` | [consultation-view-review.md](06-consultations/consultation-view-review.md) | [workflows.md](../wireframes/treatment/workflows.md) | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |

#### 7. Appointment Admin
- **English**: Appointment Admin
- **German**: Terminverwaltung
- **i18n Key**: `i18n.appointmentAdminArea` → `appointment.admin.title`
- **Icon**: `fa-calendar`
- **Color**: `color-appointmentAdmin`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/appointmentAdmin.html`
- **Analysis Doc**: [appointment-admin.md](07-appointment-admin/appointment-admin.md)
  - [questionnaire-detail.md](07-appointment-admin/questionnaire-detail.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Closed Month | Closed Month | Geschlossener Monat | `/closedMonth.html` | `fa-calendar-exclamation` | `i18n.ClosedMonth` → `closedMonth.title` | — | [close-month.md](07-appointment-admin/closed-month.md) | [workflows.md](../wireframes/planning/workflows.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |
  | Questionnaire | Questionnaire | Fragebogen | `/questionaire.html` | `fa-user-headset` | `i18n.questionaire` → `questionnaire.title` | — | [questionnaire-list.md](07-appointment-admin/questionnaire-list.md), [questionnaire-detail.md](07-appointment-admin/questionnaire-detail.md) | — | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |

#### 8. Notifications
- **English**: Notifications
- **German**: Mitteilungen
- **i18n Key**: `i18n.notification` → `notification.title`
- **Icon**: `fa-comments`
- **Color**: `color-notify`
- **Roles**: None
- **Rights**: `NOTIFICATION_READ`, `SELF_ASSIGNMENT`
- **URL**: `/notification.html`
- **Analysis Doc**: [notification.md](08-notifications/notification.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Trash | Trash | Papierkorb | (none, filter) | `fa-comment-times` | `i18n.notification.folder.TRASH` → `notification.folder.TRASH` | — | [notification.md](08-notifications/notification.md) | [workflows.md](../wireframes/system/workflows.md) | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |

#### 9. Customers
- **English**: Customers
- **German**: Kunden
- **i18n Key**: `i18n.notification.customers` → `customer.plural`
- **Icon**: `fa-hospital-user`
- **Color**: `color-customer`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, KUNDE_ADMIN, ADMIN
- **Rights**: None
- **URL**: `/customer.html`
- **Analysis Doc**: [customer-list-detail.md](09-customers/customer-list-detail.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Onboarding Customer | Onboarding Customer | Kunden-Onboarding | `/onboardingCustomer.html` | `fa-hospital-user` | `i18n.onboardingCustomerArea` → `onboarding.customer.title` | — | [onboarding-flow.md](09-customers/onboarding-customer.md) | — | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) |
  | Invoices | Invoices | Rechnungen | `/invoice.html` | `fa-file-invoice` | `i18n.invoiceArea` → `invoice.plural` | — | [invoice-list.md](09-customers/invoice-list.md), [invoice-details.md](09-customers/invoice-details.md) | [workflows.md](../wireframes/accounting/workflows.md) | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) |
  | Invoice Receivers | Invoice Receivers | Rechnungsempfänger | `/invoiceReceiver.html` | `fa-file-invoice` | `i18n.invoice.paymentContact` → `invoice.paymentContact` | — | [invoice-receiver.md](09-customers/invoice-receiver.md) | [workflows.md](../wireframes/accounting/workflows.md) | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) |
  | Customer Users | Users | Benutzer | `/customerUser.html` | `fa-user-tie` | `i18n.user` → `user.plural` | — | [location-and-users.md](09-customers/locations.md) | — | [data-dictionary-customer.md](_data-dictionaries/data-dictionary-customer.md) |
  | Locations | Locations | Standorte | `/customerLocation.html` | `fa-clinic-medical` | `i18n.location` → `location.plural` | — | [location-and-users.md](09-customers/locations.md) | [workflows.md](../wireframes/customer/workflows.md) | [data-dictionary-customer.md](_data-dictionaries/data-dictionary-customer.md) |
  | Rooms | Rooms | Räume | `/room.html` | `fa-building` | `i18n.rooms` → `room.plural` | — | [room.md](09-customers/rooms.md) | [workflows.md](../wireframes/customer/workflows.md) | [data-dictionary-customer.md](_data-dictionaries/data-dictionary-customer.md) |
  | Onboarding Location | Onboarding Location | Standort-Onboarding | `/onboardingLocation.html` | `fa-clinic-medical` | `i18n.onboardingLocationArea` → `onboarding.location.title` | — | [onboarding-flow.md](09-customers/onboarding-customer.md) | — | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) |

#### 10. Staff
- **English**: Staff
- **German**: Mitarbeiter
- **i18n Key**: `i18n.employee.dialogtitle` → `employee.title`
- **Icon**: `fa-user-md`
- **Color**: `color-user`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/staff.html`
- **Analysis Doc**: [staff-list.md](./10-staff/staff-list.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Onboarding | Onboarding | Onboarding | `/onboarding.html` | `fa-layer-group` | `Onboarding` → `onboarding.title` | — | [onboarding-flow.md](09-customers/onboarding-customer.md) | — | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) |
  | User Management | Users | Benutzer | `/adminUser.html` | `fa-users` | `i18n.user` → `user.plural` | — | [user-management.md](10-staff/user-management.md) | — | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) |
  | Expert Weekly Assignments | Expert Weekly Assignments | Experten-Wochenzuteilungen | `/expertWorkWeeklyAssignments.html` | `fa-tally` | `i18n.expertWorkWeeklyAssignments` → `expertWork.weeklyAssignments` | — | [worklog.md](01-dashboard/worklog.md) | — | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) |

#### 11. Administration
- **English**: Administration
- **German**: Administration
- **i18n Key**: `Administration` (hardcoded, should be `administration.title`)
- **Icon**: `fa-user-cog`
- **Color**: `admin`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/admin.html`
- **Analysis Doc**: [admin-landing.md](./11-administration/admin-landing.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | Job IDs | Job IDs | Leistungsnummern | `/job.html` | `fa-briefcase-medical` | `i18n.action.jobIds` → `job.action.jobIds` | — | [job-configuration.md](11-administration/job-ids.md) | [workflows.md](../wireframes/accounting/workflows.md) | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) |
  | Async Job Queue | Async Job Queue | Asynchrone Warteschlange | `/asyncJobQueue.html` | `fa-stream` | `i18n.AsyncJobQueue` → `asyncJobQueue.title` | — | [system.md#entity-async-job-queue](_mongodb-mapping/system.md#entity-async-job-queue) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Job Price List | Job Price List | Leistungsliste | `/jobPriceList.html` | `fa-th-list` | `i18n.jobPriceList` → `jobPriceList.title` | — | [accounting-config.md#e-job-price-list](11-administration/job-price-list.md#e-job-price-list) | — | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) |
  | Products | Products | Produkte | `/product.html` | `fa-shopping-bag` | `i18n.menu.products` → `menu.products` | — | [accounting-config.md#f-product](11-administration/job-price-list.md#f-product) | — | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) |
  | Skills | Skills | Fähigkeiten | `/skill.html` | `fa-graduation-cap` | `i18n.skills` → `skills.plural` | — | [skill.md](11-administration/skills.md) | — | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) |
  | Exclusion Criteria | Exclusion Criteria | Ausschlusskriterien | `/exclusionCriteria.html` | `fa-comment-slash` | `i18n.exclusionCriteria` → `exclusionCriteria.plural` | — | [system-config.md#b-exclusion-criteria](11-administration/exclusion-criteria.md#b-exclusion-criteria) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Export Templates | Export Templates | Exportvorlagen | `/exportTemplate.html` | `fa-file-export` | `i18n.exportTemplate` → `exportTemplate.title` | — | [templates-files.md#2-export-template](11-administration/export-templates.md#2-export-template) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Warnings | Warnings | Warnungen | `/warning.html` | `fa-exclamation-triangle` | `i18n.consultation.warning` → `consultation.warning.plural` | — | [warning-management.md](11-administration/warnings.md) | — | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | Treatment Categories | Treatment Categories | Therapiekategorien | `/treatmentCategory.html` | `fa-triangle` | `i18n.TreatmentCategory` → `treatmentCategory.plural` | — | [treatment-and-category.md](04-treatments/treatment-and-category.md) | — | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) |
  | Equipment | Equipment | Geräte | `/equipment.html` | `fa-tablet-alt` | `i18n.menu.devices` → `menu.devices` | — | [equipment.md](11-administration/equipment.md) | [workflows.md](../wireframes/customer/workflows.md) | [data-dictionary-customer.md](_data-dictionaries/data-dictionary-customer.md) |
  | Onboarding Steps | Onboarding Steps | Onboarding-Schritte | `/onboardingStep.html` | `fa-layer-group` | `i18n.menu.onboardingStep` → `menu.onboardingStep` | — | [onboarding-flow.md](09-customers/onboarding-customer.md) | — | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) |

#### 12. Systemadmin
- **English**: Systemadmin
- **German**: Systemadministration
- **i18n Key**: `Systemadmin` (hardcoded, should be `system.admin.title`)
- **Icon**: `fa-cogs`
- **Color**: `sysadmin`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/sysadmin.html`
- **Analysis Doc**: [admin-landing.md](12-systemadmin/change-log.md)
- **Submenu**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Wireframe Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|--------------|-----------------|
  | MOTD | MOTD | Tagesnachricht | `/motd.html` | `fa-newspaper` | `i18n.motd` → `motd.title` | — | [motd-template.md](12-systemadmin/motd.md) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Login Notification | Login Notification | Login-Benachrichtigung | `/loginNotification.html` | `fa-comment-exclamation` | `i18n.loginNotification` → `loginNotification.title` | — | [system-config.md#i-login-notification](11-administration/exclusion-criteria.md#i-login-notification) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Notification Templates | Notification Templates | Benachrichtigungsvorlagen | `/notificationTemplate.html` | `fa-file-code` | `i18n.notificationTemplate` → `notificationTemplate.plural` | — | [templates-files.md#3-notification-template](11-administration/export-templates.md#3-notification-template) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Location Types | Location Types | Standorttypen | `/locationType.html` | `fa-house` | `i18n.LocationType` → `locationType.plural` | — | [system-config.md#a-location-type](11-administration/exclusion-criteria.md#a-location-type) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Storno Groups | Storno Groups | Stornogruppen | `/stornoGroup.html` | `fa-funnel-dollar` | `i18n.stornoGroup` → `stornoGroup.plural` | — | [accounting-config.md#c-storno-group-cancellation-group](11-administration/job-price-list.md#c-storno-group-cancellation-group) | — | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) |
  | Work Hours | Work Hours | Arbeitszeiten | `/workHour.html` | `fa-user-clock` | `i18n.workHours` → `workHours.title` | — | [workhour.md](12-systemadmin/work-hours.md) | — | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |
  | CDR | CDR | CDR (Verbindungsdaten) | `/CdrCall.html` | `fa-boxes` | `CDR` → `cdr.title` | — | [cdr-call.md](12-systemadmin/cdr.md) | [workflows.md](../wireframes/planning/workflows.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |
  | CDR Assignment | CDR Assignment | CDR-Zuteilung | `/CdrCallAssignment.html` | `fa-arrows-alt-h` | `CDR Assignment` → `cdr.assignment` | — | [cdr-call.md](12-systemadmin/cdr.md) | [workflows.md](../wireframes/planning/workflows.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) |
  | Log | Log | Protokoll | `/log.html` | `fa-stream` | `Log` → `log.title` | — | [system.md#entity-logs](_mongodb-mapping/system.md#entity-logs) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Support Categories | Support Categories | Support-Kategorien | `/supportCategory.html` | `fa-user-headset` | `i18n.supportCategory` → `supportCategory.plural` | — | [system-config.md#d-support-category](11-administration/exclusion-criteria.md#d-support-category) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | BasisWeb Appointments | BasisWeb Appointments | BasisWeb-Anmeldungen | `/basisWebAppointment.html` | `fa-user-headset` | `BasisWeb-Anmeldungen` → `basisWeb.appointments` | — | [interfaces.md#entity-basis-web-appointment](_mongodb-mapping/interfaces.md#entity-basis-web-appointment) | — | [data-dictionary-interfaces.md](_data-dictionaries/data-dictionary-interfaces.md) |
  | Change Log | Change Log | Änderungsprotokoll | `/changelog.html` | `fa-hourglass` | `Change-Log` → `changelog.title` | — | [admin-landing.md#8-page-changelog-changeloghtmlm](12-systemadmin/change-log.md#8-page-changelog-changeloghtmlm) | — | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |

#### 13. Global Menu (`#globalMenu`)
- **English**: Global Menu
- **German**: Globales Menü
- **i18n Key**: — (not sitemap-driven, always rendered)
- **Icon**: `fa-user`
- **Color**: — (not sitemap-driven)
- **Roles**: Always visible (individual items may have permission gates)
- **Rights**: `USERS_CREATE` (Role Switch only)
- **URL**: N/A (sidebar user menu)
- **Analysis Doc**: —
- **Items**:
  
  | Item | English | German | URL | Icon | i18n Key | Roles/Rights | Analysis Doc | Data Dictionary |
  |------|---------|--------|-----|------|----------|--------------|-------------|-----------------|
  | Search Toggle | Full Text Search | Volltextsuche | — | `fa-search` | — | Always visible | — | — |
  | Search Input | Search | Suchen | — | (text input) | `label.search` → `search.placeholder` | `{{#search}}` | — | — |
  | Settings | Settings | Einstellungen | `/profile.html` | `fa-cog` | `administration.settings` → `administration.settings` | Always visible | [profile-form.md](_shared-components/profile-form.md), [profile-expert-availability.md](_shared-components/profile-expert-availability.md), [profile-staff.md](_shared-components/profile-staff.md), [totp-onboarding.md](_shared-components/totp-onboarding.md) | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) |
  | Security | Security | Sicherheit | `/userSecurity.html` | `fa-id-card` | `administration.security` → `administration.security` | Always visible | [profile-dialogs.md](_shared-components/profile-dialogs.md) | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) |
  | Role Switch | (Dynamic role label) | (Dynamische Rollenbezeichnung) | `#roleSwitchDlg` | `fa-user-tag` | `role.{ROLE}` | `roleSwitch=true` (authority: `USERS_CREATE`) | [includes-shared-components.md](_shared-components/includes-shared-components.md) | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Bug Report | Bug Report | Fehlerbericht | — | (from include) | — | Always visible | [includes-shared-components.md](_shared-components/includes-shared-components.md) | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) |
  | Logout | Logout | Abmelden | `/logout` | `fa-sign-out` | `logout` → `logout` | Always visible | — | — |
  | Version Display | App Version-Build | App-Version-Buildzeit | — | — | `application.version`-`application.buildtime` | Always visible | — | — |

#### Shell-Level Permission Gates

Beyond role-based menu visibility, the following template-level permission conditions control shell UI elements that live outside the sitemap hierarchy:

| Permission / Condition | Scope | Description |
|------------------------|-------|-------------|
| `roleSwitch` (authority: `USERS_CREATE`) | Role switch menu item + dialog | Only users who can create/modify users see the role switch option |
| `{{#search}}` | Full-text search input | Search feature visibility (always shown in current implementation) |
| `{{#maintenance}}` | Maintenance toast | Shown when `UserService.isMaintenance` returns true |
| `{{#roleSwitch}}` | Role switch menu item | Same as `roleSwitch` variable — gated by `USERS_CREATE` permission |

### 2.5 Role Matrix

| Role | Dashboard | Appointments | Shifts | Treatments | Council | Consultations | Appt Admin | Notifications | Customers | Staff | Admin | Sysadmin |
|------|-----------|--------------|--------|------------|---------|---------------|------------|---------------|-----------|-------|-------|----------|
| **STANDARD** | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ (with rights) | ✗ | ✗ | ✗ | ✗ |
| **LEITER_INTERN** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (with rights) | ✓ | ✓ | ✓ | ✓ |
| **ADMIN_INTERN** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (with rights) | ✓ | ✓ | ✓ | ✓ |
| **ADMIN** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (with rights) | ✓ | ✓ | ✓ | ✓ |
| **KUNDE_ADMIN** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ (with rights) | ✓ | ✗ | ✗ | ✗ |
| **REGISTERED** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

### 2.6 Rights Matrix

| Right | Description | Modules Using |
|-------|-------------|---------------|
| `EXPERT_WEEK` | Access to expert week view | Dashboard → Week View |
| `NOTIFICATION_READ` | Read notifications | Notifications |
| `SELF_ASSIGNMENT` | Self-assign notifications | Notifications |

### 2.7 Auxiliary & Cross-Referenced Analysis Documents

> **Standardized Cross-Reference Chapter**: Each analysis document contains a `## Cross-References` section that documents:
> - **Source Includes**: Mustache partials (`{{> partialName}}`) and script includes from brownfield source
> - **Service Calls**: Backend service invocations via `Service.method(params)` patterns
> - **Event Flows**: jQuery events (`$(document).trigger()`) and direct function calls
>
> Cross-reference types: `include` | `service` | `event`

These analysis documents describe features, dialogs, sub-flows, and shared components that are not directly represented as main menu items in the sitemap navigation (and thus are absent from Section 2), but are cross-referenced and integrated by other pages:

| Auxiliary File | Data Dictionary | Cross-Referenced By & Usage Context |
|---------------|-----------------|-------------------------------------|
| [totp-onboarding.md](_shared-components/totp-onboarding.md) | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) | [includes-customization.md](_shared-components/includes-customization.md) (TOTP onboarding flow in login), [user-management.md](10-staff/user-management.md) (actions/switches), [includes-shared-components.md](_shared-components/includes-shared-components.md), [profile-form.md](_shared-components/profile-form.md), [profile-staff.md](_shared-components/profile-staff.md) |
| [appointment-assign-user.md](_shared-components/appointment-assign-user.md) | — | [appointment-list.md](02-appointments/appointment-list.md) (include: `{{> assignUserDlg}}`), [shift-and-plan.md](03-shifts/shift-and-plan.md), [treatment-and-category.md](04-treatments/treatment-and-category.md), [council-and-plan.md](05-council/council-and-plan.md) |
| [appointment-details-patient.md](_shared-components/appointment-details-patient.md) | — | [appointment-details-scheduling.md](_shared-components/appointment-details-scheduling.md) (split sibling: same source `appointment/details.html`) |
| [appointment-details-scheduling.md](_shared-components/appointment-details-scheduling.md) | — | [appointment-list.md](02-appointments/appointment-list.md) (include: `{{> appointmentDetails}}`), [shift-and-plan.md](03-shifts/shift-and-plan.md), [treatment-and-category.md](04-treatments/treatment-and-category.md), [council-and-plan.md](05-council/council-and-plan.md), [month-view.md](01-dashboard/month-view.md), [week-view.md](01-dashboard/week-view.md), [calendar-view.md](01-dashboard/calendar-view.md) |
| [basisweb-wizard.md](_interfaces/basisweb-wizard.md) | — | [dashboard-main.md](01-dashboard/dashboard-main.md) (event flow: `loadBasisweb`), [consultation-wizard.md](01-dashboard/consultation-wizard.md) |
| [consultation-details-js.md](_shared-components/consultation-details-js.md) | — | [dashboard-main.md](01-dashboard/dashboard-main.md) (event flow: `ConsultationDetails.open()`), [consultation-wizard.md](01-dashboard/consultation-wizard.md), [basisweb-wizard.md](_interfaces/basisweb-wizard.md), [consultation-template.md](01-dashboard/consultation-template.md) |
| [consultation-template.md](01-dashboard/consultation-template.md) | — | [dashboard-main.md](01-dashboard/dashboard-main.md) (event flow: `consultationWithTemplateBtn` click) |
| [consultation-wizard.md](01-dashboard/consultation-wizard.md) | — | [dashboard-main.md](01-dashboard/dashboard-main.md) (event flow: `loadConsultation` outgoing) |
| [contact.md](_shared-components/contact.md) | [data-dictionary-customer.md](_data-dictionaries/data-dictionary-customer.md) | [medication.md](_shared-components/medication.md), [patient-data.md](02-appointments/patient-data.md), [room.md](09-customers/rooms.md), [equipment.md](11-administration/equipment.md) |
| [dashboard-admin.md](12-systemadmin/dashboard-admin.md) | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) | [system/dashboard/readme.md](_shared-components/readme.md) |
| [dashboard-selfservice.md](01-dashboard/dashboard-selfservice.md) | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) | [system/dashboard/readme.md](_shared-components/readme.md) |
| [dialogs-planning.md](01-dashboard/dialogs-planning.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) | [dialogs-treatment.md](_shared-components/dialogs-treatment.md), [dialogs-system.md](_shared-components/dialogs-system.md), [dialogs-user-management.md](_shared-components/dialogs-user-management.md) |
| [dialogs-system.md](_shared-components/dialogs-system.md) | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) | [dialogs-planning.md](01-dashboard/dialogs-planning.md), [dialogs-treatment.md](_shared-components/dialogs-treatment.md), [dialogs-user-management.md](_shared-components/dialogs-user-management.md), [system/dashboard/readme.md](_shared-components/readme.md) |
| [dialogs-treatment.md](_shared-components/dialogs-treatment.md) | [data-dictionary-treatment.md](_data-dictionaries/data-dictionary-treatment.md) | [dialogs-planning.md](01-dashboard/dialogs-planning.md), [dialogs-system.md](_shared-components/dialogs-system.md), [dialogs-user-management.md](_shared-components/dialogs-user-management.md) |
| [dialogs-user-management.md](_shared-components/dialogs-user-management.md) | [data-dictionary-user-management.md](_data-dictionaries/data-dictionary-user-management.md) | [dialogs-planning.md](01-dashboard/dialogs-planning.md), [dialogs-treatment.md](_shared-components/dialogs-treatment.md), [dialogs-system.md](_shared-components/dialogs-system.md) |
| [group-management.md](_shared-components/group-management.md) | — | [sysconfig-import.md](_shared-components/sysconfig-import.md) |
| [invoice-details.md](09-customers/invoice-details.md) | [data-dictionary-accounting.md](_data-dictionaries/data-dictionary-accounting.md) | — |
| [medication.md](_shared-components/medication.md) | — | [patient-data.md](02-appointments/patient-data.md), [contact.md](_shared-components/contact.md), [room.md](09-customers/rooms.md), [equipment.md](11-administration/equipment.md) |
| [month-view.md](01-dashboard/month-view.md) | [data-dictionary-planning.md](_data-dictionaries/data-dictionary-planning.md) | [profile-expert-availability.md](_shared-components/profile-expert-availability.md) |
| [profile-expert-availability.md](_shared-components/profile-expert-availability.md) | — | [month-view.md](01-dashboard/month-view.md), [week-view.md](01-dashboard/week-view.md), [treatment-plan.md](04-treatments/treatment-plan.md), [profile-form.md](_shared-components/profile-form.md) |
| [profile-staff.md](_shared-components/profile-staff.md) | — | [onboarding-flow.md](09-customers/onboarding-customer.md), [profile-dialogs.md](_shared-components/profile-dialogs.md), [appointment-assign-user.md](_shared-components/appointment-assign-user.md) |
| [questionnaire-detail.md](07-appointment-admin/questionnaire-detail.md) | — | [dialogs-treatment.md](_shared-components/dialogs-treatment.md), [consultation-details-header.md](06-consultations/consultation-details-header.md), [appointment-admin.md](07-appointment-admin/appointment-admin.md) |
| [shift-dialog.md](01-dashboard/shift-dialog.md) | — | [month-view.md](01-dashboard/month-view.md) (include: `{{> shiftDlg}}`), [week-view.md](01-dashboard/week-view.md), [calendar-view.md](01-dashboard/calendar-view.md) |
| [sysconfig-import.md](_shared-components/sysconfig-import.md) | [data-dictionary-system.md](_data-dictionaries/data-dictionary-system.md) | [group-management.md](_shared-components/group-management.md) |
| [user-video-history.md](_shared-components/user-video-history.md) | [data-dictionary-academy.md](_data-dictionaries/data-dictionary-academy.md) | [templates-files.md](11-administration/export-templates.md), [worklog.md](01-dashboard/worklog.md), [invoice-receiver.md](09-customers/invoice-receiver.md) |

---

## 3. HTMLM Header Metadata

### 3.1 Field Definitions

```json
[
  {"field":"content","method":"content","params":[]},
  {"field":"maintenance", "method":"serviceCall","params":[{"service":"UserService","method":"isMaintenance","param":[]}]},
  {"field":"role", "method":"serviceCall","params":[{"service":"UserService","method":"getRole","param":[]}]},
  {"field":"unreadMessages", "method":"serviceCall","params":[{"service":"InfoService","method":"getUnreadMessages","param":[]}]},
  {"field":"bugReport", "method":"template","params":["_include/bugReport/bugReport.html"]},
  {"field":"roleSwitch", "method":"authority","params":["USERS_CREATE"]},
  {"field":"isCustomer", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"KUNDE\"]"]}]},
  {"field":"isEmployee", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\", \"STANDARD\"]"]}]},
  {"field":"isAnEmployee", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\",\"STANDARD\", \"REGISTERED\"]"]}]},
  {"field":"isACustomer", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"KUNDE\",\"ADMIN_KUNDE\",\"ADMIN_INTERN\",\"ADMIN\"]"]}]},
  {"field":"isCustomerAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"ADMIN_KUNDE\"]"]}]},
  {"field":"isAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\"]"]}]},
  {"field":"isAnAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"ADMIN_KUNDE\",\"ADMIN_INTERN\",\"ADMIN\"]"]}]},
  {"field":"isStandard", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"STANDARD\"]"]}]}
]
```

### 3.2 Field Type Classification

| Field | Method | Parameters | Type | Purpose |
|-------|--------|------------|------|---------|
| `content` | `content` | `[]` | **Template Include** | Main page content injected from routed page |
| `maintenance` | `serviceCall` | `UserService.isMaintenance` | **boolean** | System maintenance mode flag |
| `role` | `serviceCall` | `UserService.getRole` | **string** | Current user's active role |
| `unreadMessages` | `serviceCall` | `InfoService.getUnreadMessages` | **number** | Count of unread notifications |
| `bugReport` | `template` | `_include/bugReport/bugReport.html` | **Template Include** | Bug report dialog HTML |
| `roleSwitch` | `authority` | `USERS_CREATE` | **boolean** | Permission to switch roles |
| `isCustomer` | `serviceCall` | Role: KUNDE | **boolean** | User has customer role only |
| `isEmployee` | `serviceCall` | Internal roles | **boolean** | User is internal employee |
| `isAnEmployee` | `serviceCall` | Internal + REGISTERED | **boolean** | User is any employee |
| `isACustomer` | `serviceCall` | Customer roles | **boolean** | User has any customer role |
| `isCustomerAdmin` | `serviceCall` | ADMIN_KUNDE | **boolean** | User is customer admin |
| `isAdmin` | `serviceCall` | Internal admin roles | **boolean** | User is internal administrator |
| `isAnAdmin` | `serviceCall` | All admin roles | **boolean** | User has any admin role |
| `isStandard` | `serviceCall` | STANDARD | **boolean** | User has standard role only |

### 3.3 Permission Matrix

| Variable | Role Check | Visible When |
|----------|------------|--------------|
| `roleSwitch` | Authority: `USERS_CREATE` | User can create/modify users |
| `isCustomer` | `role === "KUNDE"` | Customer-only view |
| `isEmployee` | Internal roles (excludes REGISTERED) | Internal staff view |
| `isAnEmployee` | Internal + REGISTERED | Any employee view |
| `isACustomer` | All customer roles | Customer-related features |
| `isCustomerAdmin` | `ADMIN_KUNDE` | Customer admin features |
| `isAdmin` | Internal admin roles | Internal admin features |
| `isAnAdmin` | All admin roles | Any admin features |
| `isStandard` | `STANDARD` | Standard user features |

---

## 4. Body Data Attributes

```html
<body data-service="{{prefix}}/service" 
      data-role="{{role}}" 
      data-reqid="{{csrf}}" 
      data-unread="{{unreadMessages}}" 
      data-user="{{userName}}" 
      data-standard="{{isStandard}}" 
      data-admin="{{isAdmin}}" 
      data-customer="{{isCustomer}}" 
      data-customerAdmin="{{isCustomerAdmin}}">
```

### 4.1 Attribute Mapping

| Attribute | Runtime Value | Purpose |
|-----------|---------------|---------|
| `data-service` | `{{prefix}}/service` | Base URL for RPC service calls |
| `data-role` | `{{role}}` | Current user's active role (for CSS/JS) |
| `data-reqid` | `{{csrf}}` | CSRF token for POST requests |
| `data-unread` | `{{unreadMessages}}` | Notification badge count |
| `data-user` | `{{userName}}` | Current username |
| `data-standard` | `{{isStandard}}` | Standard role flag (for RBAC) |
| `data-admin` | `{{isAdmin}}` | Admin role flag (for RBAC) |
| `data-customer` | `{{isCustomer}}` | Customer role flag (for RBAC) |
| `data-customerAdmin` | `{{isCustomerAdmin}}` | Customer admin flag (for RBAC) |

### 4.2 React Migration

These bootstrap attributes map to:
- **React Query** initial data for notifications
- **Auth context** for role/permission state
- **TanStack Router** loader functions for initial data
- **CSRF handling** via fetch interceptors

---

## 5. Global Navigation Sidebar (`#globalNav`)

### 5.1 Structure Overview

```
#globalNav (nav, id="globalNav", class="full")
├── #logo (span)
│   ├── logo256.png (200px, desktop)
│   └── logo64.png (48px, icon/collapsed)
├── #mainNav (div)
│   └── ul.nav.flex-column.colored
│       └── {{#sitemap}} ← Server-generated menu
│           └── li.menuitem.bg-{{color}}.{{#active}}active{{/active}}
│               ├── .mainItem.d-flex.justify-content-between.align-items-center
│               │   ├── a href="{{prefix}}{{url}}" title="{{title}}"
│               │   │   ├── i.fa.fa-fw.fa-{{icon}}
│               │   │   └── span.full {{i18n title}}
│               │   └── span.opener (toggle submenu)
│               │       └── i.fa.fa-bars
│               └── ul.submenu
│                   └── {{#sub}}
│                       └── li.bg-{{color}}
│                           └── .subItem.{{#active}}active{{/active}}
│                               └── a href="{{prefix}}{{url}}" id="{{id}}"
│                                   ├── i.fa.fa-fw.fa-{{icon}}
│                                   └── span.full {{i18n title}}
└── #globalMenu (ul, right side)
    ├── Search toggle (icon)
    ├── Full-text search input (expandable)
    ├── User dropdown menu
    └── Version display
```

### 5.2 Logo Section

```html
<span id="logo">
  <img src="logo256.png" alt="Videoclinic" class="desktop-logo" />
  <img src="logo64.png" alt="Videoclinic" class="icon-logo" />
</span>
```

| Element | Source | Size | Display Context |
|---------|--------|------|-----------------|
| Desktop Logo | `logo256.png` | 200px width | Expanded sidebar (>768px) |
| Icon Logo | `logo64.png` | 48px width | Collapsed sidebar (<768px) |

**React Migration**: Replace with SVG logo component with responsive sizing. Store in `/public/assets/` or import as React component.

### 5.3 Main Navigation Structure (mainNav)

The main navigation is **runtime-generated** from the server-side sitemap defined in `index.json`. Each menu item follows this structure:

```html
<li class="menuitem bg-{{color}} {{#active}}active{{/active}}">
  <div class="mainItem d-flex justify-content-between align-items-center">
    <a href="{{prefix}}{{url}}" title="{{title}}">
      <i class="fa fa-fw fa-{{icon}}" aria-hidden="true"></i>
      <span class="full">{{i18n title}}</span>
    </a>
    <span class="opener"><i class="fa fa-bars"></i></span>
  </div>
  <ul class="submenu">
    {{#sub}}
    <li class="bg-{{color}}">
      <div class="subItem {{#active}}active{{/active}}">
        <a href="{{prefix}}{{url}}" id="{{id}}">
          <i class="fa fa-fw fa-{{icon}}" aria-hidden="true"></i>
          <span class="full">{{i18n title}}</span>
        </a>
      </div>
    </li>
    {{/sub}}
  </ul>
</li>
```

### 5.4 Global Menu (globalMenu)

The right-side user menu contains utility functions and user-specific actions:

```html
<ul class="nav flex-column" id="globalMenu">
  <!-- Search toggle -->
  <li class="icon">
    <a href="#" class="dopdown-toggle" title="Full Text Search"> 
      <i class="fa fa-fw fa-search"></i>
    </a>
  </li>
  
  <!-- Full-text search input (expandable) -->
  {{#search}}
  <li class="full">
    <div class="input-group" style="margin-left:3px">
      <span id="clearSiteSearch" class="input-group-text"><i class="fa fa-search"></i></span>
      <input type="password" style="display: none"/>
      <input type="text" id="siteSearch" autocomplete="off" class="form-control" placeholder="{{i18n.label.search}}"/>
    </div>
  </li>
  {{/search}}
  
  <!-- User dropdown menu -->
  <li class="dropdown">
    <a href="#" class="dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-haspopup="true">
      <i class="fas fa-fw fa-user" title="{{role}}"></i> 
      <span class="full">{{user.displayName}}</span>
    </a>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="profile.html">
        <i class="fa fa-fw fa-cog" aria-hidden="true"></i> 
        {{i18n.administration.settings}}
      </a>
      <a class="dropdown-item" href="userSecurity.html">
        <i class="fa fa-fw fa-id-card" aria-hidden="true"></i> 
        {{i18n.administration.security}}
      </a>
      {{#roleSwitch}}
      <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#roleSwitchDlg" href="#" id="roleSwitchBtn">
        <i class="far fa-fw fa-user-tag" aria-hidden="true"></i> 
        {{role}}
      </a>
      {{/roleSwitch}}
      {{>bugReport}}
      <a class="dropdown-item" href="logout" id="logout">
        <i class="fa fa-fw fa-sign-out" aria-hidden="true"></i> 
        {{i18n.logout}}
      </a>
    </div>
  </li>
  
  <!-- Version display -->
  <li id="version">
    <a style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
      {{i18n.application.version}}-{{i18n.application.buildtime}}
    </a>
  </li>
</ul>
```

### 5.5 Role Switch Dialog Options

The role switch dialog contains hardcoded German role labels that need i18n keys:

| Role Value | German Label | Suggested i18n Key | English Translation |
|------------|--------------|-------------------|---------------------|
| `REGISTERED` | Neu Registriert | `role.REGISTERED` | Newly Registered |
| `STANDARD` | Standard | `role.STANDARD` | Standard |
| `LEITER_INTERN` | Interner Leiter | `role.LEITER_INTERN` | Internal Manager |
| `ADMIN_INTERN` | Interner Admin | `role.ADMIN_INTERN` | Internal Admin |
| `KUNDE` | Kunde | `role.KUNDE` | Customer |
| `ADMIN_KUNDE` | Kunde Admin | `role.ADMIN_KUNDE` | Customer Admin |
| `ADMIN` | System-Admin | `role.ADMIN` | System Admin |

### 5.6 Sitemap-Driven Navigation

```mustache
{{#sitemap}}
  <li class="menuitem bg-{{color}} {{#active}}active{{/active}}">
    <div class="mainItem d-flex justify-content-between align-items-center">
      <a href="{{prefix}}{{url}}" title="{{title}}">
        <i class="fa fa-fw fa-{{icon}}" aria-hidden="true"></i>
        <span class="full">{{i18n title}}</span>
      </a>
      <span class="opener"><i class="fa fa-bars"></i></span>
    </div>
    <ul class="submenu">
    {{#sub}}
      <li class="bg-{{color}}">
        <div class="subItem {{#active}}active{{/active}}">
          <a href="{{prefix}}{{url}}" title="{{title}}" id="{{id}}">
            <i class="fa fa-fw fa-{{icon}}" aria-hidden="true"></i>
            <span class="full">{{i18n title}}</span>
          </a>
        </div>
      </li>
    {{/sub}}
    </ul>
  </li>
{{/sitemap}}
```

### 5.7 Sitemap Item Properties

| Property | Type | Mustache Syntax | Description |
|----------|------|-----------------|-------------|
| `color` | `string` | `bg-{{color}}` | Background color class suffix (e.g. `color-appointment`) |
| `url` | `string` | `{{prefix}}{{url}}` | Relative URL path from app root |
| `title` | `string` | `{{i18n title}}` | i18n key for menu item label |
| `icon` | `string` | `fa-{{icon}}` | FontAwesome icon name (without `fa-` prefix) |
| `active` | `boolean` | `{{#active}}active{{/active}}` | Highlights menu item as current location |
| `sub[]` | `Array<SitemapItem>` | `{{#sub}}...{{/sub}}` | Nested submenu items (same structure) |
| `id` | `string` | `id="{{id}}"` | DOM element ID for submenu items |

### 5.8 Color Mapping

Each module has a corresponding `bg-color-{module}` CSS class defined in `_include/categories.css`:

| Color Class | Hex Value | Module |
|-------------|-----------|--------|
| `bg-color-appointment` | `#17a2b8` | Appointments |
| `bg-color-consultation` | `#28a745` | Consultations |
| `bg-color-treatment` | `#20c997` | Treatments |
| `bg-color-shift` | `#fd7e14` | Shifts |
| `bg-color-council` | `#6f42c1` | Council |
| `bg-color-patient` | `#e83e8c` | Patients |
| `bg-color-staff` | `#007bff` | Staff |
| `bg-color-customer` | `#6c757d` | Customers |
| `bg-color-room` | `#20c997` | Rooms |
| `bg-color-equipment` | `#17a2b8` | Equipment |
| `bg-color-invoice` | `#ffc107` | Invoices |
| `bg-color-admin` | `#343a40` | Administration |
| `bg-color-support` | `#dc3545` | Support |

---

## 6. User Dropdown Menu (`#globalMenu`)

### 6.1 Structure

```html
<ul class="nav flex-column" id="globalMenu">
  <!-- Search toggle -->
  <li class="icon">
    <a href="#" class="dopdown-toggle" title="Full Text Search"> 
      <i class="fa fa-fw fa-search"></i>
    </a>
  </li>
  
  <!-- Full-text search input (expandable) -->
  {{#search}}
  <li class="full">
    <div class="input-group" style="margin-left:3px">
      <span id="clearSiteSearch" class="input-group-text"><i class="fa fa-search"></i></span>
      <input type="password" style="display: none"/>  ← Prevents browser password autofill
      <input type="text" id="siteSearch" autocomplete="off" class="form-control" placeholder="{{i18n.label.search}}"/>
    </div>
  </li>
  {{/search}}
  
  <!-- User dropdown menu -->
  <li class="dropdown">
    <a href="#" class="dropdown-toggle" data-bs-toggle="dropdown" role="button" aria-haspopup="true">
      <i class="fas fa-fw fa-user" title="{{role}}"></i> 
      <span class="full">{{user.displayName}}</span>
    </a>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="profile.html">
        <i class="fa fa-fw fa-cog" aria-hidden="true"></i> 
        {{i18n.administration.settings}}
      </a>
      <a class="dropdown-item" href="userSecurity.html">
        <i class="fa fa-fw fa-id-card" aria-hidden="true"></i> 
        {{i18n.administration.security}}
      </a>
      {{#roleSwitch}}
      <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#roleSwitchDlg" href="#" id="roleSwitchBtn">
        <i class="far fa-fw fa-user-tag" aria-hidden="true"></i> 
        {{role}}
      </a>
      {{/roleSwitch}}
      {{>bugReport}}
      <a class="dropdown-item" href="logout" id="logout">
        <i class="fa fa-fw fa-sign-out" aria-hidden="true"></i> 
        {{i18n.logout}}
      </a>
    </div>
  </li>
  
  <!-- Version display -->
  <li id="version">
    <a style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
      {{i18n.application.version}}-{{i18n.application.buildtime}}
    </a>
  </li>
</ul>
```

### 6.2 User Display

```html
<i class="fas fa-fw fa-user" title="{{role}}"></i> 
<span class="full">{{user.displayName}}</span>
```

- **Icon**: Generic user icon with `title` showing current role
- **Display Name**: User's full name from `user.displayName`
- **Class**: `full` ensures text is shown in expanded nav state

---

## 7. Shared Infrastructure Dialogs

### 7.1 Loading Spinner (`#spinner`)

```html
<div class="modal fade" role="dialog" id="spinner" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body" style="text-align:center">
        <i class="fas fa-circle-notch fa-spin fa-3x"></i>
      </div>
    </div>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| **Type** | Bootstrap modal |
| **Trigger** | JavaScript (show/hide on async operations) |
| **Content** | Font Awesome spinning icon (`fa-circle-notch`) |
| **Size** | `fa-3x` (3em icon) |
| **Alignment** | Centered modal (`modal-dialog-centered`) |
| **Purpose** | Global loading overlay during service calls |

**React Migration**: Replace with React Query `isLoading` states + Suspense boundaries. No global overlay needed — use per-component loading states.

---

### 7.2 Role Switch Dialog (`#roleSwitchDlg`)

```html
<div class="modal fade" role="dialog" id="roleSwitchDlg" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body" style="text-align:center">
        Current Role: {{role}}<br/>
        <form>
          <select id="roleSwitchSelection">
            <option value="">---</option>
            <option value="REGISTERED">Neu Registriert</option>
            <option value="STANDARD">Standard</option>
            <option value="LEITER_INTERN">Interner Leiter</option>
            <option value="ADMIN_INTERN">Interner Admin</option>
            <option value="KUNDE">Kunde</option>
            <option value="ADMIN_KUNDE">Kunde Admin</option>
            <option value="ADMIN">System-Admin</option>
          </select>
        </form>
      </div>
    </div>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| **Type** | Bootstrap modal |
| **Trigger** | User menu → Role Switch link (gated by `roleSwitch` permission) |
| **Content** | Role selection dropdown (7 options) |
| **Options** | REGISTERED, STANDARD, LEITER_INTERN, ADMIN_INTERN, KUNDE, ADMIN_KUNDE, ADMIN |
| **Current Role Display** | `{{role}}` variable from HTMLM header |
| **Action** | Submit selection to switch active role |

**Hardcoded Strings** (need i18n keys):
- "Neu Registriert" → `role.REGISTERED`
- "Standard" → `role.STANDARD`
- "Interner Leiter" → `role.LEITER_INTERN`
- "Interner Admin" → `role.ADMIN_INTERN`
- "Kunde" → `role.KUNDE`
- "Kunde Admin" → `role.ADMIN_KUNDE`
- "System-Admin" → `role.ADMIN`

**React Migration**: Shadcn `Dialog` + `Select` component. Role switch via auth context update + server session update.

---

### 7.3 Upload Dialog (`#uploadDlg`)

```html
<div class="modal fade" role="dialog" id="uploadDlg" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Upload</h5></div>
      <div class="modal-body" style="text-align:center">
        <input type="file" id="uploadDlgLoadFile" style="display:none" multiple/>
        <button class="btn btn-sm btn-primary" id="uploadDlgBtn" onclick="document.getElementById('uploadDlgLoadFile').click()">
          Select a file
        </button>
        <div class="progress" id="uploadDlgProgress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 100%"></div>
        </div>
        <div id="uploadDlgStatus"></div>
      </div>
    </div>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| **Type** | Bootstrap modal |
| **Trigger** | JavaScript (generic upload action) |
| **File Input** | Hidden, triggered by button click, supports `multiple` |
| **Progress Bar** | Bootstrap `progress-bar-striped progress-bar-animated` |
| **Status Display** | `#uploadDlgStatus` div for messages |
| **Purpose** | Generic file upload with progress tracking |

**React Migration**: Shadcn `Dialog` + `Progress` component. Use `react-dropzone` or native file input with `fetch` upload and `XMLHttpRequest` for progress tracking.

---

## 8. Maintenance Mode Alert

```html
{{#maintenance}}
<div role="alert" aria-live="assertive" aria-atomic="true" class="toast" style="opacity:1;right:20px;bottom:20px;position:absolute;min-width:20%">
  <div class="toast-header">
    <svg class="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img">
      <rect width="100%" height="100%" fill="#ff3a00"></rect>
    </svg>
    <strong class="mr-auto">{{i18n.error.maintenance.title}}</strong>
    <small><i class="fa fa-hard-hat fa-2x"></i></small>
  </div>
  <div class="toast-body">{{.}}</div>
</div>
{{/maintenance}}
```

| Property | Value |
|----------|-------|
| **Type** | Bootstrap toast (persistent, auto-shown) |
| **Condition** | `{{#maintenance}}` — rendered only when `maintenance=true` |
| **Position** | Bottom-right corner (`right:20px;bottom:20px;position:absolute`) |
| **Icon** | Hard hat (`fa-hard-hat`) |
| **Color** | Red (`#ff3a00` rect fill) |
| **Title** | `{{i18n.error.maintenance.title}}` |
| **Body** | `{{.}}` — maintenance message from server |
| **Purpose** | Alert users when system is in maintenance mode |

**React Migration**: Sonner toast or Shadcn `Toast` component. Poll `UserService.isMaintenance` on app mount and show persistent toast when true.

---

## 9. Full-Text Search

```html
<li class="full">
  <div class="input-group" style="margin-left:3px">
    <span id="clearSiteSearch" class="input-group-text"><i class="fa fa-search"></i></span>
    <input type="password" style="display: none"/>  ← Prevents browser password autofill
    <input type="text" id="siteSearch" autocomplete="off" class="form-control" placeholder="{{i18n.label.search}}"/>
  </div>
</li>
```

| Property | Value |
|----------|-------|
| **Type** | Expandable text input |
| **Toggle** | Search icon in `#globalMenu` |
| **Autocomplete** | `off` (prevents browser suggestions) |
| **Password Field Trick** | Hidden `type="password"` field prevents browser password autofill |
| **Placeholder** | `{{i18n.label.search}}` |
| **Purpose** | Global full-text search across all entities |

**React Migration**: Shadcn `Command` palette (`cmd+k` pattern). Fuzzy search across entities with keyboard shortcuts.

---

## 10. Click Actions

| Action ID | Element | Title/Tooltip | English Translation | Purpose |
|-----------|---------|---------------|---------------------|---------|
| `clearSiteSearch` | `#clearSiteSearch` span | — | Clear search | Clears search input |
| `uploadDlgBtn` | `#uploadDlgBtn` button | "Select a file" | Select a file | Opens file picker |
| `roleSwitchBtn` | `#roleSwitchBtn` link | — | Switch role | Opens role switch dialog |
| `logout` | `#logout` link | — | Logout | Logs out user |

---

## 11. Special Components

### 11.1 Navigation Pattern

| Component Type | Context | Data Bindings | Notes |
|----------------|---------|---------------|-------|
| **Sidebar Navigation** | `#globalNav` | `{{sitemap}}` from server | Two-level hierarchy (main + submenu), accordion expansion |
| **User Dropdown** | `#globalMenu` | `user.displayName`, `role` | Bootstrap dropdown, always visible |
| **Search Toggle** | `#globalMenu` | — | Expands search input on click |
| **Version Display** | `#globalMenu` | `application.version`, `application.buildtime` | Ellipsis overflow for long versions |

### 11.2 Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (>768px)** | Full sidebar with icons + labels, expanded user menu |
| **Mobile (<768px)** | Collapsed sidebar (icons only), hamburger menu trigger |

**CSS Classes**: `full` class on spans shows/hides text based on nav state.

---

## 12. Status Visualization

| State | Icon | Color | Meaning |
|-------|------|-------|---------|
| **Active Menu Item** | — | `bg-{color}` (module-specific) | Current page/route |
| **Loading** | `fa-circle-notch fa-spin` | Teal (default FA) | Async operation in progress |
| **Maintenance Mode** | `fa-hard-hat` | Red (`#ff3a00`) | System under maintenance |
| **Unread Messages** | Badge on bell icon | Dynamic | Count from `InfoService.getUnreadMessages` |

---

## 13. Naming and Translation

### 13.1 i18n Keys Used

| Key | German | English | Notes |
|-----|--------|---------|-------|
| `application.name` | Videoclinic | Videoclinic | App name |
| `application.version` | 1.0.0 | 1.0.0 | Version number |
| `application.buildtime` | — | — | Build timestamp |
| `label.search` | Suchen | Search | Search placeholder |
| `administration.settings` | Einstellungen | Settings | User settings |
| `administration.security` | Sicherheit | Security | Security settings |
| `logout` | Abmelden | Logout | Logout action |
| `error.maintenance.title` | Wartungsarbeiten | Maintenance | Maintenance toast title |

### 13.2 Hardcoded Strings (German)

| String | Location | Suggested Key | English |
|--------|----------|---------------|---------|
| "Neu Registriert" | Role switch select | `role.REGISTERED` | Newly Registered |
| "Standard" | Role switch select | `role.STANDARD` | Standard |
| "Interner Leiter" | Role switch select | `role.LEITER_INTERN` | Internal Manager |
| "Interner Admin" | Role switch select | `role.ADMIN_INTERN` | Internal Admin |
| "Kunde" | Role switch select | `role.KUNDE` | Customer |
| "Kunde Admin" | Role switch select | `role.ADMIN_KUNDE` | Customer Admin |
| "System-Admin" | Role switch select | `role.ADMIN` | System Admin |
| "Select a file" | Upload dialog button | `action.selectFile` | Select a file |
| "Upload" | Upload dialog title | `dialog.upload` | Upload |
| "Current Role:" | Role switch dialog | `role.current` | Current Role: |
| "---" | Role switch default option | — | (placeholder) |

---

## 14. React Migration Summary

| Shell Component | Legacy Implementation | Modern React Approach | Priority |
|-----------------|----------------------|----------------------|----------|
| **Sidebar Nav** | `{{sitemap}}` Mustache iteration | TanStack Router `useMatches()` + recursive `SidebarMenu` component | **High** |
| **User Menu** | Bootstrap dropdown | Shadcn `DropdownMenu` with auth context | **High** |
| **Role Switch** | Modal with `<select>` | Shadcn `Dialog` + `Select`; role switch via auth context + server session | **Medium** |
| **Loading Spinner** | Bootstrap modal overlay | React Query `isLoading` + Suspense boundaries; per-component states | **Low** |
| **Upload Dialog** | Bootstrap modal + file input | Shadcn `Dialog` + `react-dropzone`; progress via `XMLHttpRequest` | **Medium** |
| **Maintenance Toast** | Bootstrap toast (server-driven) | Sonner `Toast` + polling `UserService.isMaintenance` | **Low** |
| **Full-Text Search** | Text input in nav | Shadcn `Command` palette (`cmd+k` pattern) | **Medium** |
| **Bug Report** | Included template | Separate dialog component with `html2canvas` integration | **Low** |
| **Permission Gates** | `{{#variable}}` Mustache blocks | `userHasPermission()` checks + conditional rendering | **High** |
| **Notification Badge** | `data-unread` attribute | React Query polling `InfoService.getUnreadMessages` | **Medium** |

---

## 15. Wireframe Mapping

| Wireframe | Description | Status |
|-----------|-------------|--------|
| `specs/wireframes/system/shell/app-shell-layout.pen` | Full application shell (1440px) with sidebar, top bar, content area | ⏳ Pending |
| `specs/wireframes/system/shell/global-navigation.pen` | Sidebar navigation detail (expanded/collapsed states) | ⏳ Pending |
| `specs/wireframes/system/shell/user-menu.pen` | User dropdown with all menu items | ⏳ Pending |

**See**: `specs/planning/create-wireframes.md` — Batch 2 Extension for execution details.

---

## 17. Sitemap Extraction Task

**TODO**: Extract the complete navigation structure from the legacy codebase:

1. **Search for sitemap generation** in Java services (likely `NavigationService` or similar)
1. **Document all menu items** with:
   - Main menu label (i18n key)
   - URL path
   - Icon name
   - Color class
   - Permission/role gates
   - Submenu items (same structure)
1. **Create `shell/sitemap.md`** reference file in Starlight docs

**Estimated effort**: 2-4 hours (requires Java code analysis)

---

## 19. Wireframe Correlation

Each analysis document correlates with wireframes in `specs/wireframes/` using the same domain and file names:

- Analysis: [planning/appointment/appointment-list.md](02-appointments/appointment-list.md) ↔ Wireframe: [planning/appointment/appointment-list.pen](../wireframes/planning/appointment/appointment-list.pen) / [.png](../wireframes/planning/appointment/appointment-list.png)
