---
title: 'Analyse Ui Elements'
---

# UI Elements Analysis: Site Shell and Navigation

**Source Files**:
- `brownfield/web/src/main/webapp/site.htmlm` (application shell)
- `brownfield/web/src/main/webapp/index.json` (sitemap definition)

**Analysis Date**: 2026-03-30  
**Target**: React 19 + Shadcn/ui + TanStack Router + Tailwind CSS 4

---

## 1. Overview

This document consolidates the analysis of the application shell (`site.htmlm`) and navigation structure (`index.json` sitemap) for the Videoclinic legacy application. The shell provides:

- **Global navigation sidebar** (sitemap-driven, 12 main menu items with 47 submenu items)
- **User dropdown menu** (settings, security, role switch, bug report, logout)
- **Shared infrastructure dialogs** (loading spinner, upload dialog, role switch modal)
- **Maintenance mode alert** (toast notification)
- **Permission/authority checks** (role-based visibility)

---

## 2. Sitemap Structure

The sitemap is defined in `index.json` under `site.sitemap` as a JSON array of navigation items.

### 2.1 Sitemap JSON Schema

```typescript
interface SitemapItem {
  url: string;           // URL path (or external URL)
  id: string;            // DOM element ID
  title: string;         // i18n key or hardcoded label
  icon: string;          // FontAwesome icon name (without 'fa-' prefix)
  color?: string;        // CSS color class suffix (e.g. 'color-appointment')
  roles?: string[];      // Role-based visibility gates
  rights?: string[];     // Permission-based visibility gates
  sub?: SitemapItem[];   // Nested submenu items
}
```

### 2.2 Complete Sitemap

See `specs/analysis/includes/site-shell.md` Chapter 2 for the complete sitemap structure with:
- All 12 main menu items
- All 47 submenu items
- Role and rights permissions
- i18n keys
- Analysis document references

---

## 3. Global Navigation Sidebar (`#globalNav`)

### 3.1 Logo Section

| Element | Source | Size | Context |
|---------|--------|------|---------|
| Desktop Logo | `logo256.png` | 200px | Expanded sidebar (>768px) |
| Icon Logo | `logo64.png` | 48px | Collapsed sidebar (<768px) |

**React Migration**: SVG logo component with responsive sizing.

### 3.2 Main Navigation (mainNav)

The main navigation is runtime-generated from the sitemap. Each menu item has:

- **Icon**: FontAwesome icon (`fa-{icon}`)
- **Color**: Module-specific color class (`bg-{color}`)
- **Active State**: Highlighted when current route matches
- **Submenu**: Accordion-style expandable list
- **Role Gates**: Visibility controlled by user roles
- **Rights Gates**: Visibility controlled by permissions

### 3.3 Main Menu Items Summary

| # | Label (EN) | Label (DE) | i18n Key | Icon | Color | Roles | Submenu Count | Analysis Doc |
|---|------------|------------|----------|------|-------|-------|---------------|--------------|
| 1 | Dashboard | Dashboard | `Dashboard` | `tachometer` | `color-dash` | — | 4 | `specs/analysis/dashboard/dashboard-main.md` |
| 2 | Appointments | Termine | `i18n.AppointmentType.APPOINTMENT` | `user-md` | `color-appointment` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 2 | `specs/analysis/appointments/appointment-list.md` |
| 3 | Shifts | Dienste | `i18n.AppointmentType.SHIFT` | `user-injured` | `color-shift` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 1 | `specs/analysis/shifts/shift-and-plan.md` |
| 4 | Treatments | Therapien | `i18n.Treatment` | `people-arrows` | `color-treatment` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 2 | `specs/analysis/treatments/treatment-and-category.md` |
| 5 | Council | Besprechung | `i18n.AppointmentType.COUNCIL` | `user-friends` | `color-council` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 1 | **TODO** |
| 6 | Consultations | Konsultationen | `i18n.consultation` | `heartbeat` | `color-consultation` | STANDARD, LEITER_INTERN, ADMIN | 0 | `specs/analysis/consultations/consultation-list.md` |
| 7 | Appointment Admin | Terminverwaltung | `i18n.appointmentAdminArea` | `calendar` | `color-appointmentAdmin` | LEITER_INTERN, ADMIN, ADMIN_INTERN | 2 | `specs/analysis/planning/appointment-admin/appointment-admin.md` |
| 8 | Notifications | Mitteilungen | `i18n.notification` | `comments` | `color-notify` | — | NOTIFICATION_READ, SELF_ASSIGNMENT | 1 | `specs/analysis/notifications/notification.md` |
| 9 | Customers | Kunden | `i18n.notification.customers` | `hospital-user` | `color-customer` | LEITER_INTERN, ADMIN_INTERN, KUNDE_ADMIN, ADMIN | 7 | `specs/analysis/customers/customer-list-detail.md` |
| 10 | Staff | Mitarbeiter | `i18n.employee.dialogtitle` | `user-md` | `color-user` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 3 | `specs/analysis/staff/profile-form.md` |
| 11 | Administration | Administration | `Administration` | `user-cog` | `admin` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 11 | `specs/analysis/staff/user-management.md` |
| 12 | Systemadmin | Systemadministration | `Systemadmin` | `cogs` | `sysadmin` | LEITER_INTERN, ADMIN_INTERN, ADMIN | 13 | `specs/analysis/system-admin/admin-landing.md` |

### 3.4 Color Mapping

Each module has a corresponding `bg-color-{module}` CSS class:

| Color Class | Hex Value | Module |
|-------------|-----------|--------|
| `bg-color-dash` | (TBD) | Dashboard |
| `bg-color-appointment` | `#17a2b8` | Appointments |
| `bg-color-shift` | `#fd7e14` | Shifts |
| `bg-color-treatment` | `#20c997` | Treatments |
| `bg-color-council` | `#6f42c1` | Council |
| `bg-color-consultation` | `#28a745` | Consultations |
| `bg-color-appointmentAdmin` | (TBD) | Appointment Admin |
| `bg-color-notify` | (TBD) | Notifications |
| `bg-color-customer` | `#6c757d` | Customers |
| `bg-color-user` | `#007bff` | Staff |
| `bg-color-admin` | `#343a40` | Administration |
| `bg-color-sysadmin` | (TBD) | Systemadmin |

**Source**: `_include/categories.css`

---

## 4. User Dropdown Menu (`#globalMenu`)

### 4.1 Menu Items

| Item | Icon | i18n Key | Permission | Target | Analysis Doc |
|------|------|----------|------------|--------|--------------|
| Search Toggle | `fa-search` | — | Always visible | Expands search | — |
| Search Input | (text) | `label.search` | Always visible | Full-text search | — |
| Settings | `fa-cog` | `administration.settings` | Always visible | `/profile.html` | `specs/analysis/staff/profile-form.md` |
| Security | `fa-id-card` | `administration.security` | Always visible | `/userSecurity.html` | `specs/analysis/staff/profile-dialogs.md` |
| Role Switch | `fa-user-tag` | `role.{ROLE}` | `USERS_CREATE` | Opens dialog | `specs/analysis/includes/includes-shared-components.md` |
| Bug Report | (include) | — | Always visible | Opens dialog | `specs/analysis/includes/includes-shared-components.md` |
| Logout | `fa-sign-out` | `logout` | Always visible | `/logout` | — |
| Version | — | `application.version`-`application.buildtime` | Always visible | Display only | — |

### 4.2 Role Switch Dialog

Hardcoded role labels (need i18n keys):

| Role | German | Suggested Key | English |
|------|--------|---------------|---------|
| REGISTERED | Neu Registriert | `role.REGISTERED` | Newly Registered |
| STANDARD | Standard | `role.STANDARD` | Standard |
| LEITER_INTERN | Interner Leiter | `role.LEITER_INTERN` | Internal Manager |
| ADMIN_INTERN | Interner Admin | `role.ADMIN_INTERN` | Internal Admin |
| KUNDE | Kunde | `role.KUNDE` | Customer |
| ADMIN_KUNDE | Kunde Admin | `role.ADMIN_KUNDE` | Customer Admin |
| ADMIN | System-Admin | `role.ADMIN` | System Admin |

---

## 5. Permission System

### 5.1 Role Matrix

| Role | Dashboard | Appointments | Shifts | Treatments | Council | Consultations | Appt Admin | Notifications | Customers | Staff | Admin | Sysadmin |
|------|-----------|--------------|--------|------------|---------|---------------|------------|---------------|-----------|-------|-------|----------|
| **STANDARD** | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ (with rights) | ✗ | ✗ | ✗ | ✗ |
| **LEITER_INTERN** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (with rights) | ✓ | ✓ | ✓ | ✓ |
| **ADMIN_INTERN** | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ (with rights) | ✓ | ✓ | ✓ | ✓ |
| **ADMIN** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (with rights) | ✓ | ✓ | ✓ | ✓ |
| **KUNDE_ADMIN** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ (with rights) | ✓ | ✗ | ✗ | ✗ |

### 5.2 Rights/Permissions

| Right | Description | Used By |
|-------|-------------|---------|
| `EXPERT_WEEK` | Access to expert week view | Dashboard → Week View submenu |
| `NOTIFICATION_READ` | Read notifications | Notifications menu |
| `SELF_ASSIGNMENT` | Self-assign notifications | Notifications menu |
| `USERS_CREATE` | Create/modify users | Role switch menu item |

---

## 6. Shared Infrastructure Dialogs

### 6.1 Loading Spinner (`#spinner`)

- **Type**: Bootstrap modal
- **Content**: `fa-circle-notch fa-spin` icon
- **React Migration**: React Query `isLoading` states + Suspense boundaries

### 6.2 Role Switch Dialog (`#roleSwitchDlg`)

- **Type**: Bootstrap modal with `<select>` dropdown
- **Options**: 7 hardcoded role options
- **React Migration**: Shadcn `Dialog` + `Select` component

### 6.3 Upload Dialog (`#uploadDlg`)

- **Type**: Bootstrap modal with file input
- **Features**: Progress bar, multi-file support
- **React Migration**: Shadcn `Dialog` + `react-dropzone`

### 6.4 Maintenance Mode Alert

- **Type**: Bootstrap toast (persistent)
- **Trigger**: `UserService.isMaintenance` service call
- **React Migration**: Sonner `Toast` + polling

---

## 7. Full-Text Search

- **Location**: `#globalMenu` (expandable input)
- **Trigger**: Search icon toggle
- **Behavior**: Expands/collapses on click
- **React Migration**: Shadcn `Command` palette (`cmd+k` pattern)

---

## 8. React Migration Strategy

### 8.1 Component Breakdown

| Legacy Component | React Component | Priority |
|------------------|-----------------|----------|
| Sidebar Nav | `SidebarMenu` (recursive) | **High** |
| User Menu | `DropdownMenu` | **High** |
| Role Switch | `Dialog` + `Select` | **Medium** |
| Search | `Command` palette | **Medium** |
| Loading Spinner | Per-component `isLoading` | **Low** |
| Upload Dialog | `Dialog` + file input | **Medium** |
| Maintenance Toast | `Toast` + polling | **Low** |

### 8.2 State Management

- **Navigation State**: TanStack Router `useMatches()` + route config
- **User State**: Auth context (role, permissions, displayName)
- **Notifications**: React Query polling `InfoService.getUnreadMessages`
- **Maintenance Mode**: React Query polling `UserService.isMaintenance`

### 8.3 Routing Integration

The sitemap maps to TanStack Router routes:

```typescript
const routeConfig = {
  path: '/',
  children: [
    { path: 'dash.html', component: Dashboard, staticData: { breadcrumb: 'layout:nav.dashboard' } },
    { path: 'appointment.html', component: AppointmentList, staticData: { breadcrumb: 'menu.appointments' } },
    // ... etc
  ]
}
```

---

## 9. Missing Analysis Documents

The following sitemap items need analysis documents created:

| Menu Item | URL | Suggested Doc Path |
|-----------|-----|-------------------|
| Council | `/council.html` | `specs/analysis/council/council-list.md` |
| Council Plan | `/councilPlan.html` | `specs/analysis/council/council-plan.md` |
| Async Job Queue | `/asyncJobQueue.html` | `specs/analysis/system-admin/async-job-queue.md` |
| Exclusion Criteria | `/exclusionCriteria.html` | `specs/analysis/system/config/exclusion-criteria.md` |
| Export Templates | `/exportTemplate.html` | `specs/analysis/system/config/export-templates.md` |
| Onboarding Steps | `/onboardingStep.html` | `specs/analysis/staff/onboarding-steps.md` |
| Login Notification | `/loginNotification.html` | `specs/analysis/system/config/login-notification.md` |
| Notification Templates | `/notificationTemplate.html` | `specs/analysis/system/config/notification-templates.md` |
| Location Types | `/locationType.html` | `specs/analysis/system/config/06-location-types.md` |
| Storno Groups | `/stornoGroup.html` | `specs/analysis/administration/storno-groups.md` |
| Log | `/log.html` | `specs/analysis/system-admin/system-log.md` |
| Support Categories | `/supportCategory.html` | `specs/analysis/orphan/support-categories.md` |
| BasisWeb Appointments | `/basisWebAppointment.html` | `specs/analysis/interfaces/basisweb-appointments.md` |
| Change Log | `/changelog.html` | `specs/analysis/system-admin/changelog.md` |

---

## 10. Hardcoded Strings Requiring i18n Keys

### 10.1 Navigation Labels

| String | Location | Suggested Key | English |
|--------|----------|---------------|---------|
| `Dashboard` | main menu | `menu.dashboard` | Dashboard |
| `Administration` | main menu | `administration.title` | Administration |
| `Systemadmin` | main menu | `system.admin.title` | System Administration |
| `Onboarding` | submenu | `onboarding.title` | Onboarding |
| `CDR` | submenu | `cdr.title` | CDR (Call Detail Records) |
| `CDR Assignment` | submenu | `cdr.assignment` | CDR Assignment |
| `Log` | submenu | `log.title` | Log |
| `BasisWeb-Anmeldungen` | submenu | `basisWeb.appointments` | BasisWeb Appointments |
| `Change-Log` | submenu | `changelog.title` | Change Log |

### 10.2 Role Labels (Role Switch Dialog)

See Section 4.2 for complete list.

---

## 11. Related Documents

- `specs/analysis/includes/site-shell.md` — Detailed application shell analysis
- `specs/analysis/includes/includes-shared-components.md` — Shared components (navbar, dialogs)
- `specs/analysis/notifications/notification.md` — Notification system
- `specs/analysis/dashboard/dashboard-main.md` — Dashboard main view
- `brownfield/web/src/main/webapp/index.json` — Sitemap source file

---

## 12. TODO: Analysis Document Creation

Priority analysis documents to create:

1. **Council module** (`/council`, `/councilPlan`) — High priority (core planning feature)
2. **Async Job Queue** (`/asyncJobQueue`) — Medium priority (admin utility)
3. **System Log** (`/log.html`) — Medium priority (debugging tool)
4. **Config CRUDs** (locationType, stornoGroup, etc.) — Low priority (simple CRUDs)
5. **BasisWeb Integration** (`/basisWebAppointment`) — Medium priority (external interface)
