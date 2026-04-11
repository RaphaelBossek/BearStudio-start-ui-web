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

## Directory Structure

| Domain | Subdirectories | Description |
|--------|---------------|-------------|
| **[academy/](../academy/readme/)** | — | Support video, video library |
| **[accounting/](../accounting/readme/)** | `admin-job/`, `config/`, `invoice/`, `invoice-receiver/`, `worklog/` | Invoicing, job configuration, accounting config |
| **[customer/](../customer/readme/)** | `contact/`, `customer-core/`, `equipment/`, `room/` | Customer management, contacts, locations, rooms, equipment |
| **[interfaces/](../interfaces/readme/)** | `dashboard/` | BasisWeb wizard integration |
| **[planning/](../planning/readme/)** | `appointment/`, `appointment-admin/`, `appointment-support/`, `council/`, `dashboard/`, `shift/` | Appointments, shifts, councils, planning dashboards |
| **[system/](../system/readme/)** | `admin/`, `admin-cruds/`, `config/`, `dashboard/`, `includes/`, `notification/`, `templates-files/` | System config, admin, notifications, shared components |
| **[treatment/](../treatment/readme/)** | `appointment-patient/`, `consultation/`, `dashboard/`, `medication/`, `patient-data/`, `questionnaire/`, `treatment-core/`, `warning/` | Consultations, treatments, patient data |
| **[user-management/](../user-management/readme/)** | `admin/`, `dashboard/`, `profile/` | User profiles, admin, groups, skills, onboarding |
| **[components/](../components/readme/)** | — | Shared reusable components |
| **[orphan/](../orphan/readme/)** | — | Orphaned content with context |
| **[i18n/](../i18n/readme/)** | `domains/`, `scripts/` | Internationalization (cross-cutting) |
| **[mongodb-mapping/](../mongodb-mapping/readme/)** | — | MongoDB-to-Prisma schema mapping (cross-cutting) |
| **[permissions/](../permissions/readme/)** | — | RBAC matrix and permission gates (cross-cutting) |

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

- **Dashboard** (`/dash.html`): Dashboards for calendar, week view, worklog; video library support
  - [Calendar](./planning/dashboard/calendar-view.md)
  - [Week View](./planning/dashboard/week-view.md)
  - [Worklog](./accounting/worklog/worklog.md)
  - [Video Library](./orphan/support-and-video.md)

- **Appointments** (`/appointment.html`): Appointments, shifts, councils, planning dashboards
  - [Appointment Plan](./planning/appointment/appointment-plan.md)
  - [Patient Data](./treatment/patient-data/patient-data.md)

- **Shifts** (`/shift.html`): Appointments, shifts, councils, planning dashboards
  - [Shift Plan](./planning/shift/shift-and-plan.md)

- **Treatments** (`/treatment.html`): Consultations, treatments, patient data
  - [Treatment Plan](./treatment/treatment-core/treatment-plan.md)
  - [Treatment Plan History](./treatment/treatment-core/treatment-plan.md)

- **Council** (`/council.html`): Appointments, shifts, councils, planning dashboards
  - [Council Plan](./planning/council/council-and-plan.md)

- **Consultations** (`/consultation.html`): Consultations, treatments, patient data
  - [Consultation List](./treatment/consultation/consultation-list.md)

- **Appointment Admin** (`/appointmentAdmin.html`): Appointments, shifts, councils, planning dashboards
  - [Closed Month](./planning/appointment-admin/appointment-admin.md)
  - [Questionnaire](./treatment/questionnaire/questionnaire-list.md)

- **Notifications** (`/notification.html`): System config, admin, notifications, shared components
  - [Notification List](./system/notification/notification.md)

- **Customers** (`/customer.html`): Customer management, contacts, locations, rooms, equipment
  - [Onboarding Customer](./user-management/admin/onboarding-flow.md)
  - [Invoices](./accounting/invoice/invoice-list.md)
  - [Invoice Receivers](./accounting/invoice-receiver/invoice-receiver.md)
  - [Customer Users](./customer/customer-core/location-and-users.md)
  - [Locations](./customer/customer-core/location-and-users.md)
  - [Rooms](./customer/room/room.md)
  - [Onboarding Location](./user-management/admin/onboarding-flow.md)

- **Staff** (`/staff.html`): User profiles, admin, groups, skills, onboarding
  - [Onboarding](./user-management/admin/onboarding-flow.md)
  - [User Management](./user-management/admin/user-management.md)
  - [Expert Weekly Assignments](./accounting/worklog/worklog.md)

- **Administration** (`/admin.html`): Invoicing, job configuration, accounting config; user profiles, admin, groups, skills, onboarding; consultations, treatments, patient data
  - [Job IDs](./accounting/admin-job/job-configuration.md)
  - [Async Job Queue](./mongodb-mapping/system.md#entity-async-job-queue)
  - [Job Price List](./accounting/config/accounting-config.md#e-job-price-list)
  - [Products](./accounting/config/accounting-config.md#f-product)
  - [Skills](./user-management/admin/skill.md)
  - [Exclusion Criteria](./system/config/system-config.md#b-exclusion-criteria)
  - [Export Templates](./system/templates-files/templates-files.md#2-export-template)
  - [Warnings](./treatment/warning/warning-management.md)
  - [Treatment Categories](./treatment/treatment-core/treatment-and-category.md)
  - [Equipment](./customer/equipment/equipment.md)
  - [Onboarding Steps](./user-management/admin/onboarding-flow.md)

- **Systemadmin** (`/sysadmin.html`): System config, admin, notifications, shared components; appointments, shifts, councils, planning dashboards
  - [MOTD](./system/admin-cruds/motd-template.md)
  - [Login Notification](./system/config/system-config.md#i-login-notification)
  - [Notification Templates](./system/templates-files/templates-files.md#3-notification-template)
  - [Location Types](./system/config/system-config.md#a-location-type)
  - [Storno Groups](./accounting/config/accounting-config.md#c-storno-group-cancellation-group)
  - [Work Hours](./planning/appointment-support/workhour.md)
  - [CDR](./planning/appointment-support/cdr-call.md)
  - [CDR Assignment](./planning/appointment-support/cdr-call.md)
  - [Log](./mongodb-mapping/system.md#entity-logs)
  - [Support Categories](./system/config/system-config.md#d-support-category)
  - [BasisWeb Appointments](./mongodb-mapping/interfaces.md#entity-basis-web-appointment)
  - [Change Log](./system/admin/admin-landing.md#8-page-changelog-changeloghtmlm)

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

### 2.4 Detailed Sitemap with Submenu Items

#### 1. Dashboard (`/dash.html`)
- **Icon**: `tachometer`
- **Color**: `color-dash`
- **Permissions**: None (always visible)
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Calendar | `/monthView.html` | `calendar-alt` | `i18n.calendar` | — |
  | Week View | `/weekView.html` | `calendar-alt` | `i18n.weekView` | EXPERT_WEEK |
  | Worklog | `/expertWorkMonthly.html` | `file-chart-line` | `i18n.Worklog` | — |
  | Video Library | `https://learn.videoclinic.de/` | `video` | `i18n.VideoLibrary` | — |

#### 2. Appointments (`/appointment.html`)
- **Icon**: `user-md`
- **Color**: `color-appointment`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Appointment Plan | `/appointmentPlan.html` | `calendar-check` | `i18n.appointmentPlan` | — |
  | Patient Data | `/patientData.html` | `user` | `i18n.PatientDataType` | — |

#### 3. Shifts (`/shift.html`)
- **Icon**: `user-injured`
- **Color**: `color-shift`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Shift Plan | `/shiftPlan.html` | `calendar-check` | `i18n.shiftPlan` | — |

#### 4. Treatments (`/treatment.html`)
- **Icon**: `people-arrows`
- **Color**: `color-treatment`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Treatment Plan | `/treatmentPlan.html` | `calendar-check` | `i18n.treatmentPlan` | — |
  | Treatment Plan History | `/treatmentPlan.html?history=true` | `calendar` | `i18n.treatmentPlanHistory` | — |

#### 5. Council (`/council.html`)
- **Icon**: `user-friends`
- **Color**: `color-council`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Council Plan | `/councilPlan.html` | `calendar-check` | `i18n.councilPlanArea` | — |

#### 6. Consultations (`/consultation.html`)
- **Icon**: `heartbeat`
- **Color**: `color-consultation`
- **Roles**: STANDARD, LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**: None (single-page module)

#### 7. Appointment Admin (`/appointmentAdmin.html`)
- **Icon**: `calendar`
- **Color**: `color-appointmentAdmin`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Closed Month | `/closedMonth.html` | `calendar-exclamation` | `i18n.ClosedMonth` | — |
  | Questionnaire | `/questionaire.html` | `user-headset` | `i18n.questionaire` | — |

#### 8. Notifications (`/notification.html`)
- **Icon**: `comments`
- **Color**: `color-notify`
- **Roles**: None
- **Rights**: NOTIFICATION_READ, SELF_ASSIGNMENT
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Trash | (none, ID: `notificationTrash`) | `comment-times` | `i18n.notification.folder.TRASH` | — |

#### 9. Customers (`/customer.html`)
- **Icon**: `hospital-user`
- **Color**: `color-customer`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, KUNDE_ADMIN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Onboarding Customer | `/onboardingCustomer.html` | `hospital-user` | `i18n.onboardingCustomerArea` | — |
  | Invoices | `/invoice.html` | `file-invoice` | `i18n.invoiceArea` | — |
  | Invoice Receivers | `/invoiceReceiver.html` | `file-invoice` | `i18n.invoice.paymentContact` | — |
  | Customer Users | `/customerUser.html` | `user-tie` | `i18n.user` | — |
  | Locations | `/customerLocation.html` | `clinic-medical` | `i18n.location` | — |
  | Rooms | `/room.html` | `building` | `i18n.rooms` | — |
  | Onboarding Location | `/onboardingLocation.html` | `clinic-medical` | `i18n.onboardingLocationArea` | — |

#### 10. Staff (`/staff.html`)
- **Icon**: `user-md`
- **Color**: `color-user`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Onboarding | `/onboarding.html` | `layer-group` | `Onboarding` | — |
  | User Management | `/adminUser.html` | `users` | `i18n.user` | — |
  | Expert Weekly Assignments | `/expertWorkWeeklyAssignments.html` | `tally` | `i18n.expertWorkWeeklyAssignments` | — |

#### 11. Administration (`/admin.html`)
- **Icon**: `user-cog`
- **Color**: `admin`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | Job IDs | `/job.html` | `briefcase-medical` | `i18n.action.jobIds` | — |
  | Async Job Queue | `/asyncJobQueue.html` | `stream` | `i18n.AsyncJobQueue` | — |
  | Job Price List | `/jobPriceList.html` | `th-list` | `i18n.jobPriceList` | — |
  | Products | `/product.html` | `shopping-bag` | `i18n.menu.products` | — |
  | Skills | `/skill.html` | `graduation-cap` | `i18n.skills` | — |
  | Exclusion Criteria | `/exclusionCriteria.html` | `comment-slash` | `i18n.exclusionCriteria` | — |
  | Export Templates | `/exportTemplate.html` | `file-export` | `i18n.exportTemplate` | — |
  | Warnings | `/warning.html` | `exclamation-triangle` | `i18n.consultation.warning` | — |
  | Treatment Categories | `/treatmentCategory.html` | `triangle` | `i18n.TreatmentCategory` | — |
  | Equipment | `/equipment.html` | `tablet-alt` | `i18n.menu.devices` | — |
  | Onboarding Steps | `/onboardingStep.html` | `layer-group` | `i18n.menu.onboardingStep` | — |

#### 12. Systemadmin (`/sysadmin.html`)
- **Icon**: `cogs`
- **Color**: `sysadmin`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Submenu**:
  
  | Item | URL | Icon | i18n Key | Permissions |
  |------|-----|------|----------|-------------|
  | MOTD | `/motd.html` | `newspaper` | `i18n.motd` | — |
  | Login Notification | `/loginNotification.html` | `comment-exclamation` | `i18n.loginNotification` | — |
  | Notification Templates | `/notificationTemplate.html` | `file-code` | `i18n.notificationTemplate` | — |
  | Location Types | `/locationType.html` | `house` | `i18n.LocationType` | — |
  | Storno Groups | `/stornoGroup.html` | `funnel-dollar` | `i18n.stornoGroup` | — |
  | Work Hours | `/workHour.html` | `user-clock` | `i18n.workHours` | — |
  | CDR | `/CdrCall.html` | `boxes` | `CDR` | — |
  | CDR Assignment | `/CdrCallAssignment.html` | `arrows-alt-h` | `CDR Assignment` | — |
  | Log | `/log.html` | `stream` | `Log` | — |
  | Support Categories | `/supportCategory.html` | `user-headset` | `i18n.supportCategory` | — |
  | BasisWeb Appointments | `/basisWebAppointment.html` | `user-headset` | `BasisWeb-Anmeldungen` | — |
  | Change Log | `/changelog.html` | `hour` | `Change-Log` | — |

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

### 5.4 Detailed Main Navigation Items

> **Note**: Analysis document references point to existing documentation. Items marked with **TODO** need analysis documents created.

#### 1. Dashboard
- **English**: Dashboard
- **German**: Dashboard
- **i18n Key**: `Dashboard` (hardcoded, should be `menu.dashboard`)
- **Icon**: `fa-tachometer`
- **Color**: `color-dash`
- **Roles**: Always visible
- **Rights**: None
- **URL**: `/dash.html`
- **Analysis Doc**: [dashboard-main.md](./dashboard/dashboard-main.md)
- **Submenu**:
  1. **Calendar**
     - English: Calendar
     - German: Kalender
     - i18n Key: `i18n.calendar` → `calendar.title`
     - Icon: `fa-calendar-alt`
     - URL: `/monthView.html`
      - Analysis Doc: [calendar-view.md](./planning/dashboard/calendar-view.md)
  2. **Week View**
     - English: Week View
     - German: Wochenansicht
     - i18n Key: `i18n.weekView` → `weekView.title`
     - Icon: `fa-calendar-alt`
     - URL: `/weekView.html`
      - Rights: `EXPERT_WEEK`
      - Analysis Doc: [week-view.md](./planning/dashboard/week-view.md)
  3. **Worklog**
     - English: Worklog
     - German: Arbeitsprotokoll
     - i18n Key: `i18n.Worklog` → `worklog.title`
     - Icon: `fa-file-chart-line`
      - URL: `/expertWorkMonthly.html`
      - Analysis Doc: [worklog.md](./accounting/worklog/worklog.md)
  4. **Video Library**
     - English: Video Library
     - German: Videobibliothek
     - i18n Key: `i18n.VideoLibrary` → `videoLibrary.title`
     - Icon: `fa-video`
      - URL: `https://learn.videoclinic.de/` (external)
      - Analysis Doc: [support-and-video.md](./orphan/support-and-video.md)

#### 2. Appointments
- **English**: Appointments
- **German**: Termine
- **i18n Key**: `i18n.AppointmentType.APPOINTMENT` → `appointment.type.APPOINTMENT`
- **Icon**: `fa-user-md`
- **Color**: `color-appointment`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/appointment.html`
- **Analysis Doc**: [appointment-list.md](./planning/appointment/appointment-list.md)
- **Submenu**:
  1. **Appointment Plan**
     - English: Appointment Plan
     - German: Terminplan
     - i18n Key: `i18n.appointmentPlan` → `appointmentPlan.title`
     - Icon: `fa-calendar-check`
     - URL: `/appointmentPlan.html`
      - Analysis Doc: [appointment-plan.md](./planning/appointment/appointment-plan.md)
  2. **Patient Data**
     - English: Patient Data
     - German: Patientendaten
     - i18n Key: `i18n.PatientDataType` → `patientData.title`
     - Icon: `fa-user`
     - URL: `/patientData.html`
      - Analysis Doc: [patient-data.md](./treatment/patient-data/patient-data.md)

#### 3. Shifts
- **English**: Shifts
- **German**: Dienste
- **i18n Key**: `i18n.AppointmentType.SHIFT` → `appointment.type.SHIFT`
- **Icon**: `fa-user-injured`
- **Color**: `color-shift`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/shift.html`
- **Analysis Doc**: [shift-and-plan.md](./planning/shift/shift-and-plan.md)
- **Submenu**:
  1. **Shift Plan**
     - English: Shift Plan
     - German: Dienstplan
     - i18n Key: `i18n.shiftPlan` → `shiftPlan.title`
     - Icon: `fa-calendar-check`
     - URL: `/shiftPlan.html`
      - Analysis Doc: [shift-and-plan.md](./planning/shift/shift-and-plan.md)

#### 4. Treatments
- **English**: Treatments
- **German**: Therapien
- **i18n Key**: `i18n.Treatment` → `treatment.title`
- **Icon**: `fa-people-arrows`
- **Color**: `color-treatment`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/treatment.html`
- **Analysis Doc**: [treatment-and-category.md](./treatment/treatment-core/treatment-and-category.md)
- **Submenu**:
  1. **Treatment Plan**
     - English: Treatment Plan
     - German: Therapieplan
     - i18n Key: `i18n.treatmentPlan` → `treatmentPlan.title`
     - Icon: `fa-calendar-check`
     - URL: `/treatmentPlan.html`
      - Analysis Doc: [treatment-plan.md](./treatment/treatment-core/treatment-plan.md)
   2. **Treatment Plan History**
      - English: Treatment Plan History
      - German: Therapieplan-Historie
      - i18n Key: `i18n.treatmentPlanHistory` → `treatmentPlan.history`
      - Icon: `fa-calendar`
      - URL: `/treatmentPlan.html?history=true`
      - Analysis Doc: [treatment-plan.md](./treatment/treatment-core/treatment-plan.md)

#### 5. Council
- **English**: Council
- **German**: Besprechung
- **i18n Key**: `i18n.AppointmentType.COUNCIL` → `appointment.type.COUNCIL`
- **Icon**: `fa-user-friends`
- **Color**: `color-council`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/council.html`
- **Analysis Doc**: [council-and-plan.md](./planning/council/council-and-plan.md)
- **Submenu**:
  1. **Council Plan**
     - English: Council Plan
     - German: Besprechungsplan
     - i18n Key: `i18n.councilPlanArea` → `councilPlan.title`
     - Icon: `fa-calendar-check`
     - URL: `/councilPlan.html`
     - Analysis Doc: [council-and-plan.md](./planning/council/council-and-plan.md)

#### 6. Consultations
- **English**: Consultations
- **German**: Konsultationen
- **i18n Key**: `i18n.consultation` → `consultation.title`
- **Icon**: `fa-heartbeat`
- **Color**: `color-consultation`
- **Roles**: STANDARD, LEITER_INTERN, ADMIN
- **Rights**: None
- **URL**: `/consultation.html`
- **Analysis Doc**: [consultation-list.md](./treatment/consultation/consultation-list.md)
- **Submenu**: None (single-page module)

#### 7. Appointment Admin
- **English**: Appointment Admin
- **German**: Terminverwaltung
- **i18n Key**: `i18n.appointmentAdminArea` → `appointment.admin.title`
- **Icon**: `fa-calendar`
- **Color**: `color-appointmentAdmin`
- **Roles**: LEITER_INTERN, ADMIN, ADMIN_INTERN
- **Rights**: None
- **URL**: `/appointmentAdmin.html`
- **Analysis Doc**: [appointment-admin.md](./planning/appointment-admin/appointment-admin.md)
- **Submenu**:
  1. **Closed Month**
     - English: Closed Month
     - German: Geschlossener Monat
     - i18n Key: `i18n.ClosedMonth` → `closedMonth.title`
     - Icon: `fa-calendar-exclamation`
      - URL: `/closedMonth.html`
      - Analysis Doc: [appointment-admin.md](./planning/appointment-admin/appointment-admin.md)
  2. **Questionnaire**
     - English: Questionnaire
     - German: Fragebogen
     - i18n Key: `i18n.questionaire` → `questionnaire.title`
     - Icon: `fa-user-headset`
      - URL: `/questionaire.html`
      - Analysis Doc: [questionnaire-list.md](./treatment/questionnaire/questionnaire-list.md)

#### 8. Notifications
- **English**: Notifications
- **German**: Mitteilungen
- **i18n Key**: `i18n.notification` → `notification.title`
- **Icon**: `fa-comments`
- **Color**: `color-notify`
- **Roles**: None
- **Rights**: NOTIFICATION_READ, SELF_ASSIGNMENT
- **URL**: `/notification.html`
- **Analysis Doc**: [notification.md](./system/notification/notification.md)
- **Submenu**:
  1. **Trash**
     - English: Trash
     - German: Papierkorb
     - i18n Key: `i18n.notification.folder.TRASH` → `notification.folder.TRASH`
     - Icon: `fa-comment-times`
      - URL: (none, folder filter within notification list)
      - Analysis Doc: [notification.md](./system/notification/notification.md)

#### 9. Customers
- **English**: Customers
- **German**: Kunden
- **i18n Key**: `i18n.notification.customers` → `customer.plural`
- **Icon**: `fa-hospital-user`
- **Color**: `color-customer`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, KUNDE_ADMIN, ADMIN
- **Rights**: None
- **URL**: `/customer.html`
- **Analysis Doc**: [customer-list-detail.md](./customer/customer-core/customer-list-detail.md)
- **Submenu**:
  1. **Onboarding Customer**
     - English: Onboarding Customer
     - German: Kunden-Onboarding
     - i18n Key: `i18n.onboardingCustomerArea` → `onboarding.customer.title`
     - Icon: `fa-hospital-user`
      - URL: `/onboardingCustomer.html`
      - Analysis Doc: [onboarding-flow.md](./user-management/admin/onboarding-flow.md)
  2. **Invoices**
     - English: Invoices
     - German: Rechnungen
     - i18n Key: `i18n.invoiceArea` → `invoice.plural`
     - Icon: `fa-file-invoice`
      - URL: `/invoice.html`
      - Analysis Doc: [invoice-list.md](./accounting/invoice/invoice-list.md)
  3. **Invoice Receivers**
     - English: Invoice Receivers
     - German: Rechnungsempfänger
     - i18n Key: `i18n.invoice.paymentContact` → `invoice.paymentContact`
     - Icon: `fa-file-invoice`
      - URL: `/invoiceReceiver.html`
      - Analysis Doc: [invoice-receiver.md](./accounting/invoice-receiver/invoice-receiver.md)
  4. **Customer Users**
     - English: Users
     - German: Benutzer
     - i18n Key: `i18n.user` → `user.plural`
     - Icon: `fa-user-tie`
      - URL: `/customerUser.html`
      - Analysis Doc: [location-and-users.md](./customer/customer-core/location-and-users.md)
  5. **Locations**
     - English: Locations
     - German: Standorte
     - i18n Key: `i18n.location` → `location.plural`
     - Icon: `fa-clinic-medical`
      - URL: `/customerLocation.html`
      - Analysis Doc: [location-and-users.md](./customer/customer-core/location-and-users.md)
  6. **Rooms**
     - English: Rooms
     - German: Räume
     - i18n Key: `i18n.rooms` → `room.plural`
     - Icon: `fa-building`
      - URL: `/room.html`
      - Analysis Doc: [room.md](./customer/room/room.md)
  7. **Onboarding Location**
     - English: Onboarding Location
     - German: Standort-Onboarding
     - i18n Key: `i18n.onboardingLocationArea` → `onboarding.location.title`
     - Icon: `fa-clinic-medical`
      - URL: `/onboardingLocation.html`
      - Analysis Doc: [onboarding-flow.md](./user-management/admin/onboarding-flow.md)

#### 10. Staff
- **English**: Staff
- **German**: Mitarbeiter
- **i18n Key**: `i18n.employee.dialogtitle` → `employee.title`
- **Icon**: `fa-user-md`
- **Color**: `color-user`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/staff.html`
- **Analysis Doc**: [staff-list.md](./staff/staff-list.md)
- **Submenu**:
  1. **Onboarding**
     - English: Onboarding
     - German: Onboarding
     - i18n Key: `Onboarding` (hardcoded, should be `onboarding.title`)
     - Icon: `fa-layer-group`
      - URL: `/onboarding.html`
      - Analysis Doc: [onboarding-flow.md](./user-management/admin/onboarding-flow.md)
  2. **User Management**
     - English: Users
     - German: Benutzer
     - i18n Key: `i18n.user` → `user.plural`
     - Icon: `fa-users`
      - URL: `/adminUser.html`
      - Analysis Doc: [user-management.md](./user-management/admin/user-management.md)
  3. **Expert Weekly Assignments**
     - English: Expert Weekly Assignments
     - German: Experten-Wochenzuteilungen
     - i18n Key: `i18n.expertWorkWeeklyAssignments` → `expertWork.weeklyAssignments`
     - Icon: `fa-tally`
      - URL: `/expertWorkWeeklyAssignments.html`
      - Analysis Doc: [worklog.md](./accounting/worklog/worklog.md)

#### 11. Administration
- **English**: Administration
- **German**: Administration
- **i18n Key**: `Administration` (hardcoded, should be `administration.title`)
- **Icon**: `fa-user-cog`
- **Color**: `admin`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/admin.html`
- **Analysis Doc**: [admin-landing.md](./admin/admin-landing.md)
- **Submenu**:
  1. **Job IDs**
     - English: Job IDs
     - German: Leistungsnummern
     - i18n Key: `i18n.action.jobIds` → `job.action.jobIds`
     - Icon: `fa-briefcase-medical`
     - URL: `/job.html`
      - Analysis Doc: [job-configuration.md](./accounting/admin-job/job-configuration.md)
  2. **Async Job Queue**
     - English: Async Job Queue
     - German: Asynchrone Warteschlange
     - i18n Key: `i18n.AsyncJobQueue` → `asyncJobQueue.title`
     - Icon: `fa-stream`
     - URL: `/asyncJobQueue.html`
      - Analysis Doc: [system.md#entity-async-job-queue](./mongodb-mapping/system.md#entity-async-job-queue)
   3. **Job Price List**
     - English: Job Price List
     - German: Leistungsliste
     - i18n Key: `i18n.jobPriceList` → `jobPriceList.title`
     - Icon: `fa-th-list`
     - URL: `/jobPriceList.html`
      - Analysis Doc: [accounting-config.md#e-job-price-list](./accounting/config/accounting-config.md#e-job-price-list)
   4. **Products**
      - Analysis Doc: [accounting-config.md#f-product](./accounting/config/accounting-config.md#f-product)
  5. **Skills**
     - English: Skills
     - German: Fähigkeiten
     - i18n Key: `i18n.skills` → `skills.plural`
     - Icon: `fa-graduation-cap`
      - URL: `/skill.html`
      - Analysis Doc: [skill.md](./user-management/admin/skill.md)
  6. **Exclusion Criteria**
     - English: Exclusion Criteria
     - German: Ausschlusskriterien
     - i18n Key: `i18n.exclusionCriteria` → `exclusionCriteria.plural`
     - Icon: `fa-comment-slash`
      - URL: `/exclusionCriteria.html`
      - Analysis Doc: [system-config.md#b-exclusion-criteria](./system/config/system-config.md#b-exclusion-criteria)
   7. **Export Templates**
      - Analysis Doc: [templates-files.md#2-export-template](./system/templates-files/templates-files.md#2-export-template)
  8. **Warnings**
     - English: Warnings
     - German: Warnungen
     - i18n Key: `i18n.consultation.warning` → `consultation.warning.plural`
     - Icon: `fa-exclamation-triangle`
      - URL: `/warning.html`
      - Analysis Doc: [warning-management.md](./treatment/warning/warning-management.md)
  9. **Treatment Categories**
     - English: Treatment Categories
     - German: Therapiekategorien
     - i18n Key: `i18n.TreatmentCategory` → `treatmentCategory.plural`
     - Icon: `fa-triangle`
      - URL: `/treatmentCategory.html`
      - Analysis Doc: [treatment-and-category.md](./treatment/treatment-core/treatment-and-category.md)
  10. **Equipment**
      - English: Equipment
      - German: Geräte
      - i18n Key: `i18n.menu.devices` → `menu.devices`
      - Icon: `fa-tablet-alt`
      - URL: `/equipment.html`
      - Analysis Doc: [equipment.md](./customer/equipment/equipment.md)
  11. **Onboarding Steps**
      - English: Onboarding Steps
      - German: Onboarding-Schritte
      - i18n Key: `i18n.menu.onboardingStep` → `menu.onboardingStep`
      - Icon: `fa-layer-group`
      - URL: `/onboardingStep.html`
      - Analysis Doc: [onboarding-flow.md](./user-management/admin/onboarding-flow.md)

#### 12. Systemadmin
- **English**: Systemadmin
- **German**: Systemadministration
- **i18n Key**: `Systemadmin` (hardcoded, should be `system.admin.title`)
- **Icon**: `fa-cogs`
- **Color**: `sysadmin`
- **Roles**: LEITER_INTERN, ADMIN_INTERN, ADMIN
- **Rights**: None
- **URL**: `/sysadmin.html`
- **Analysis Doc**: [admin-landing.md](./system/admin/admin-landing.md)
- **Submenu**:
  1. **MOTD**
     - English: MOTD (Message of the Day)
     - German: Tagesnachricht
     - i18n Key: `i18n.motd` → `motd.title`
      - Icon: `fa-newspaper`
      - URL: `/motd.html`
      - Analysis Doc: [motd-template.md](./system/admin-cruds/motd-template.md)
  2. **Login Notification**
     - English: Login Notification
     - German: Login-Benachrichtigung
     - i18n Key: `i18n.loginNotification` → `loginNotification.title`
      - Icon: `fa-comment-exclamation`
      - URL: `/loginNotification.html`
      - Analysis Doc: [system-config.md#i-login-notification](./system/config/system-config.md#i-login-notification)
  3. **Notification Templates**
     - English: Notification Templates
     - German: Benachrichtigungsvorlagen
     - i18n Key: `i18n.notificationTemplate` → `notificationTemplate.plural`
      - Icon: `fa-file-code`
      - URL: `/notificationTemplate.html`
      - Analysis Doc: [templates-files.md#3-notification-template](./system/templates-files/templates-files.md#3-notification-template)
  4. **Location Types**
     - English: Location Types
     - German: Standorttypen
     - i18n Key: `i18n.LocationType` → `locationType.plural`
      - Icon: `fa-house`
      - URL: `/locationType.html`
      - Analysis Doc: [system-config.md#a-location-type](./system/config/system-config.md#a-location-type)
  5. **Storno Groups**
     - English: Storno Groups
     - German: Stornogruppen
     - i18n Key: `i18n.stornoGroup` → `stornoGroup.plural`
      - Icon: `fa-funnel-dollar`
      - URL: `/stornoGroup.html`
      - Analysis Doc: [accounting-config.md#c-storno-group-cancellation-group](./accounting/config/accounting-config.md#c-storno-group-cancellation-group)
  6. **Work Hours**
     - English: Work Hours
     - German: Arbeitszeiten
     - i18n Key: `i18n.workHours` → `workHours.title`
      - Icon: `fa-user-clock`
      - URL: `/workHour.html`
      - Analysis Doc: [workhour.md](./planning/appointment-support/workhour.md)
  7. **CDR**
     - English: CDR (Call Detail Records)
     - German: CDR (Verbindungsdaten)
     - i18n Key**: `CDR` (hardcoded, should be `cdr.title`)
      - Icon: `fa-boxes`
      - URL: `/CdrCall.html`
      - Analysis Doc: [cdr-call.md](./planning/appointment-support/cdr-call.md)
   8. **CDR Assignment**
      - English: CDR Assignment
      - German: CDR-Zuteilung
      - i18n Key**: `CDR Assignment` (hardcoded, should be `cdr.assignment`)
      - Icon: `fa-arrows-alt-h`
      - URL: `/CdrCallAssignment.html`
      - Analysis Doc: [cdr-call.md](./planning/appointment-support/cdr-call.md)
   9. **Log**
      - English: Log
      - German: Protokoll
      - i18n Key**: `Log` (hardcoded, should be `log.title`)
      - Icon: `fa-stream`
      - URL: `/log.html`
      - Analysis Doc: [system.md#entity-logs](./mongodb-mapping/system.md#entity-logs)
   10. **Support Categories**
      - English: Support Categories
      - German: Support-Kategorien
      - i18n Key: `i18n.supportCategory` → `supportCategory.plural`
      - Icon: `fa-user-headset`
      - URL: `/supportCategory.html`
      - Analysis Doc: [system-config.md#d-support-category](./system/config/system-config.md#d-support-category)
   11. **BasisWeb Appointments**
      - English: BasisWeb Appointments
      - German: BasisWeb-Anmeldungen
      - i18n Key**: `BasisWeb-Anmeldungen` (hardcoded, should be `basisWeb.appointments`)
      - Icon: `fa-user-headset`
      - URL: `/basisWebAppointment.html`
      - Analysis Doc: [interfaces.md#entity-basis-web-appointment](./mongodb-mapping/interfaces.md#entity-basis-web-appointment)
   12. **Change Log**
      - English: Change Log
      - German: Änderungsprotokoll
      - i18n Key**: `Change-Log` (hardcoded, should be `changelog.title`)
      - Icon: `fa-hourglass`
      - URL: `/changelog.html`
      - Analysis Doc: [admin-landing.md#8-page-changelog-changeloghtmlm](./system/admin/admin-landing.md#8-page-changelog-changeloghtmlm)

### 5.5 Global Menu (globalMenu)

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

### 5.6 Global Menu Items

| Menu Item | English | German | i18n Key | Icon | Permission Gate | Target/Action | Analysis Doc |
|-----------|---------|--------|----------|------|-----------------|---------------|--------------|
| **Search Toggle** | Full Text Search | Volltextsuche | — | `fa-search` | Always visible | Expands search input | — |
| **Search Input** | Search | Suchen | `label.search` → `search.placeholder` | Text input | `{{#search}}` (always) | Full-text search across entities | — |
| **Settings** | Settings | Einstellungen | `administration.settings` → `administration.settings` | `fa-cog` | Always visible | `/profile.html` | `specs/analysis/staff/profile-form.md` |
| **Security** | Security | Sicherheit | `administration.security` → `administration.security` | `fa-id-card` | Always visible | `/userSecurity.html` | `specs/analysis/staff/profile-dialogs.md` |
| **Role Switch** | (Dynamic role label) | (Dynamische Rollenbezeichnung) | `role.{ROLE}` (hardcoded) | `fa-user-tag` | `roleSwitch=true` (authority: `USERS_CREATE`) | Opens `#roleSwitchDlg` | `specs/analysis/includes/includes-shared-components.md` |
| **Bug Report** | Bug Report | Fehlerbericht | — | (from include) | Always visible | Opens bug report dialog | `specs/analysis/includes/includes-shared-components.md` |
| **Logout** | Logout | Abmelden | `logout` → `logout` | `fa-sign-out` | Always visible | `/logout` endpoint | — |
| **Version Display** | App Version-Build | App-Version-Buildzeit | `application.version`-`application.buildtime` | — | Always visible | Display only | — |

### 5.7 Role Switch Dialog Options

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

### 5.8 Sitemap-Driven Navigation

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

### 5.9 Sitemap Item Properties

| Property | Type | Mustache Syntax | Description |
|----------|------|-----------------|-------------|
| `color` | `string` | `bg-{{color}}` | Background color class suffix (e.g. `color-appointment`) |
| `url` | `string` | `{{prefix}}{{url}}` | Relative URL path from app root |
| `title` | `string` | `{{i18n title}}` | i18n key for menu item label |
| `icon` | `string` | `fa-{{icon}}` | FontAwesome icon name (without `fa-` prefix) |
| `active` | `boolean` | `{{#active}}active{{/active}}` | Highlights menu item as current location |
| `sub[]` | `Array<SitemapItem>` | `{{#sub}}...{{/sub}}` | Nested submenu items (same structure) |
| `id` | `string` | `id="{{id}}"` | DOM element ID for submenu items |

### 5.10 Extracted Sitemap Structure

> **Note**: The actual sitemap is server-generated. Below is the structure extracted from analyzing navigation patterns across all analyzed modules.

| Main Menu Item | Icon | Color | Submenu Items |
|----------------|------|-------|---------------|
| Dashboard | `fa-home` | `dashboard` | (none) |
| Appointments | `fa-calendar` | `appointment` | List, Calendar, Week View, Month View |
| Consultations | `fa-heartbeat` | `consultation` | List, Templates, Quick Consultation |
| Treatments | `fa-stethoscope` | `treatment` | List, Plans, Categories |
| Shifts | `fa-user-clock` | `shift` | List, Shift Plans |
| Council | `fa-users` | `council` | List, Council Plans |
| Patients | `fa-user-injured` | `patient` | List, Quick Filter |
| Experts/Staff | `fa-user-md` | `staff` | List, Availability, Skills |
| Customers | `fa-building` | `customer` | List, Locations, Contacts |
| Rooms | `fa-door-open` | `room` | List, Room Plans |
| Equipment | `fa-toolbox` | `equipment` | List, Equipment Groups |
| Invoices | `fa-file-invoice-dollar` | `invoice` | List, Receivers, Worklog |
| Reports | `fa-chart-bar` | `report` | Various reports |
| Administration | `fa-cog` | `admin` | Users, Groups, Jobs, System Config |
| Support | `fa-headset` | `support` | Tickets, Video Library |

### 5.11 Color Mapping

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

### 5.2 Menu Items

| Menu Item | Icon | Permission Gate | Target/Action | Translation Key |
|-----------|------|-----------------|---------------|-----------------|
| Search Toggle | `fa-search` | Always visible | Expands search input | — |
| Search Input | (text input) | `{{#search}}` | Full-text search | `label.search` |
| Settings | `fa-cog` | Always visible | `profile.html` | `administration.settings` |
| Security | `fa-id-card` | Always visible | `userSecurity.html` | `administration.security` |
| Role Switch | `fa-user-tag` | `roleSwitch=true` | Opens `#roleSwitchDlg` | Dynamic role label |
| Bug Report | (from include) | Always visible | Opens bug report dialog | — |
| Logout | `fa-sign-out` | Always visible | `logout` endpoint | `logout` |

### 5.3 User Display

```html
<i class="fas fa-fw fa-user" title="{{role}}"></i> 
<span class="full">{{user.displayName}}</span>
```

- **Icon**: Generic user icon with `title` showing current role
- **Display Name**: User's full name from `user.displayName`
- **Class**: `full` ensures text is shown in expanded nav state

---

## 6. Shared Infrastructure Dialogs

### 6.1 Loading Spinner (`#spinner`)

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

### 6.2 Role Switch Dialog (`#roleSwitchDlg`)

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

### 6.3 Upload Dialog (`#uploadDlg`)

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

## 7. Maintenance Mode Alert

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

## 8. Full-Text Search

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

## 9. Click Actions

| Action ID | Element | Title/Tooltip | English Translation | Purpose |
|-----------|---------|---------------|---------------------|---------|
| `clearSiteSearch` | `#clearSiteSearch` span | — | Clear search | Clears search input |
| `uploadDlgBtn` | `#uploadDlgBtn` button | "Select a file" | Select a file | Opens file picker |
| `roleSwitchBtn` | `#roleSwitchBtn` link | — | Switch role | Opens role switch dialog |
| `logout` | `#logout` link | — | Logout | Logs out user |

---

## 10. Permissions

| Permission / Condition | Scope | Description |
|------------------------|-------|-------------|
| `roleSwitch` (authority: `USERS_CREATE`) | Role switch menu item + dialog | Only users who can create/modify users see the role switch option |
| `{{#search}}` | Full-text search input | Search feature visibility (always shown in current implementation) |
| `{{#maintenance}}` | Maintenance toast | Shown when `UserService.isMaintenance` returns true |
| `{{#roleSwitch}}` | Role switch menu item | Same as `roleSwitch` variable — gated by `USERS_CREATE` permission |

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

## 16. Related Analysis Documents

| Document | Description |
|----------|-------------|
| `specs/analysis/includes/includes-shared-components.md` | Shared components (navbar, siteloader, quick filter, job status) |
| `specs/analysis/includes/includes-customization.md` | Customization scripts and i18n overrides |
| `specs/analysis/notifications/notification.md` | Notification system (messaging, folders, polling) |
| `specs/analysis/dashboard/dashboard-standard.md` | Dashboard main view (MOTD, stats, scheduling) |

---

## 17. Sitemap Extraction Task

**TODO**: Extract the complete navigation structure from the legacy codebase:

1. **Search for sitemap generation** in Java services (likely `NavigationService` or similar)
2. **Document all menu items** with:
   - Main menu label (i18n key)
   - URL path
   - Icon name
   - Color class
   - Permission/role gates
   - Submenu items (same structure)
3. **Create `shell/sitemap.md`** reference file in Starlight docs

**Estimated effort**: 2-4 hours (requires Java code analysis)

---

## 18. Module Analysis & Wireframe Reference

Per-module breakdown with links to analysis documents and associated wireframes.

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

**Canonical**: `system/includes/`, `system/templates-files/`

| Feature | Analysis Doc | Wireframe |
|---------|-------------|-----------|
| Shared Components | `system/includes/includes-shared-components.md` | `system/includes/navbar.png`, `loading-states.png`, `quick-filter.png` |
| Customization | `system/includes/includes-customization.md` | `system/includes/login.png`, `bug-report.png` |
| Templates & Files | `system/templates-files/templates-files.md` | — |

---

## 19. Cross-Reference Index

### By Entity Type

| Entity | Primary Domain | Related Domains |
|--------|----------------|-----------------|
| Appointment | `planning/appointment/` | `planning/shift/`, `planning/council/`, `treatment/treatment-core/` |
| Consultation | `treatment/consultation/` | `treatment/`, `planning/appointment-admin/` |
| Customer | `customer/` | `user-management/` (customer users) |
| User/Staff | `user-management/` | `customer/` (assignment) |
| Invoice | `accounting/invoice/` | `accounting/admin-job/` (job pricing) |
| CDR Call | `planning/appointment-support/` | `planning/appointment-admin/` (assignment) |

---

## 20. Wireframe Correlation

Each analysis document correlates with wireframes in `specs/wireframes/` using the same domain and file names:

- Analysis: `planning/appointment/appointment-list.md` ↔ Wireframe: `planning/appointment/appointment-list.pen` / `.png`
