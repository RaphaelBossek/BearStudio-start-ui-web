# Specs Directory Migration Plan

> **Generated**: 2026-03-31  
> **Source**: `specs/analysis/system/includes/03-site-shell.md` sitemap structure  
> **Goal**: Streamline folder structure, reduce nesting, standardize file names, update all cross-references

---

## 1. Executive Summary

This migration reorganizes the `specs/` directory to align with the application's sitemap structure from `03-site-shell.md`. The new structure:

- **Reduces subdirectory depth** from 4-5 levels to 2-3 levels
- **Consolidates related modules** under domain-based folders
- **Standardizes markdown file names** (removes numeric prefixes where redundant)
- **Transforms `wireframe-plan.md` files** into consistent format
- **Updates all internal references** between markdown files
- **Makes `03-site-shell.md` the top-level navigation document**
- **Aligns wireframes/ directory structure** to match analysis/ domains exactly
- **Removes orphaned PNG files** not referenced in any documentation
- **Restructures features/** into functional requirements (domain-aligned) + NFRs (distributed to domains)

### Key Changes

| Aspect | Before | After |
|--------|--------|-------|
| Max directory depth | 5 levels | 3 levels |
| Analysis subfolders | 50 directories | 13 domain folders (includes orphan/) |
| Wireframe subfolders | 41 directories | 13 domain folders (matching analysis/) |
| File naming | Mixed (`01-name.md`, `name.md`) | Standardized (`list.md`, `details.md`, etc.) |
| Top-level nav | Scattered README files | Single `SITE-NAVIGATION.md` |
| Orphaned PNGs | ~3 files | 0 (cleaned up) |
| Features structure | Mixed FR/NFR | FR in domain folders, NFR in domains/{domain}/permissions.md |

---

## 2. New Directory Structure

**IMPORTANT**: All relative links in documentation use the file's own directory as base.
Example: From `analysis/SITE-NAVIGATION.md`, link to `analysis/dashboard/README.md` as `./dashboard/README.md`

### 2.1 Design Principles

The new structure follows these principles:

1. **Unified Naming** — Wireframes use identical base names as analysis documents
   - Analysis: `appointments/list.md` ↔ Wireframe: `appointments/list.png`
   - Enables instant correlation and simpler automation

2. **Domain-Driven** — Organized by business domain, not technical layer
   - All appointment-related specs together (analysis + wireframes + domain docs)
   - Reduces context switching when working on a feature

3. **Parallel Structure** — `wireframes/` mirrors `analysis/` exactly
   - Same domain names, same file names
   - Cross-references use simple relative paths

4. **Living Documentation** — New directories for ongoing documentation
   - `domains/` — Entity models, state machines, workflows, NFRs
   - `decisions/` — Architecture Decision Records (ADRs)
   - `permissions/` — RBAC matrix and permission gates
   - `i18n/` — Translation inventory and hardcoded strings
   - `components/` — Component library and design tokens
   - `migration/` — Data migration guides
   - `testing/` — Testing strategy and E2E scenarios
   - `features/` — Functional requirements (domain-aligned)
   - `glossary.md` — Domain terminology

5. **Automated Validation** — CI checks for broken links, orphaned files, correlations

### 2.2 Complete Directory Tree

```
specs/
├── README.md (updated to reference SITE-NAVIGATION.md)
├── MIGRATION-PLAN.md (this document)
├── analysis/ (consolidated into domain folders)
│   ├── README.md (top-level domain overview with progress tracking)
│   ├── SITE-NAVIGATION.md (MASTER NAVIGATION - sitemap with all links)
│   ├── dashboard/ (NEW - combines all dashboard views)
│   │   ├── README.md
│   │   ├── standard.md (from system/dashboard/01-dashboard-main.md)
│   │   ├── admin.md (from system/dashboard/03-dashboard-admin.md)
│   │   ├── self-service.md (from planning/dashboard/02-dashboard-selfservice.md)
│   │   ├── dialogs.md (merged from multiple dialog docs)
│   │   └── user-dropdown.md (NEW - Settings, Security, Role Switch, Bug Report from 03-site-shell.md)
│   │
│   ├── appointments/ (NEW - core appointment management)
│   │   ├── README.md
│   │   ├── list.md (from planning/appointment/01-appointment-list.md)
│   │   ├── details.md (from planning/appointment/02-appointment-details-scheduling.md)
│   │   ├── assign-user.md (from planning/appointment/03-appointment-assign-user.md)
│   │   ├── plan.md (from planning/appointment-support/01-appointment-plan.md)
│   │   └── patient-data.md (from treatment/patient-data/01-patient-data.md)
│   │
│   ├── shifts/ (NEW)
│   │   ├── README.md
│   │   ├── list.md (from planning/shift/01-shift-and-plan.md)
│   │   └── plan.md (from planning/shift/wireframe-plan.md content)
│   │
│   ├── treatments/ (NEW)
│   │   ├── README.md
│   │   ├── list.md (from treatment/treatment-core/01-treatment-and-category.md)
│   │   ├── plan.md (from treatment/treatment-core/02-treatment-plan.md)
│   │   └── patient-data.md (moved from appointments/)
│   │
│   ├── council/ (NEW)
│   │   ├── README.md
│   │   ├── list.md (from planning/council/01-council-and-plan.md)
│   │   └── plan.md
│   │
│   ├── consultations/ (NEW)
│   │   ├── README.md
│   │   ├── list.md (from treatment/consultation/01-consultation-list.md)
│   │   ├── details-header.md (from treatment/consultation/02-consultation-details-header.md)
│   │   ├── standard-form.md (from treatment/consultation/03-consultation-details-standard.md)
│   │   ├── onboarding-form.md (from treatment/consultation/04-consultation-details-onboarding.md)
│   │   ├── incarceration-form.md (from treatment/consultation/05-consultation-details-incarceration.md)
│   │   ├── treatment-warning.md (from treatment/consultation/06-consultation-details-treatment-warning.md)
│   │   ├── view-review.md (from treatment/consultation/07-consultation-view-review.md)
│   │   └── details-js.md (from treatment/consultation/08-consultation-details-js.md)
│   │
│   ├── appointment-admin/ (NEW)
│   │   ├── README.md
│   │   ├── admin.md (from planning/appointment-admin/01-appointment-admin.md)
│   │   └── closed-month.md (from accounting/config/01-accounting-config.md)
│   │
│   ├── notifications/ (NEW)
│   │   ├── README.md
│   │   └── list.md (from system/notification/01-notification.md)
│   │
│   ├── customers/ (NEW - consolidated customer domain)
│   │   ├── README.md
│   │   ├── list.md (from customer/customer-core/01-customer-list-detail.md)
│   │   ├── locations-users.md (from customer/customer-core/02-location-and-users.md)
│   │   ├── onboarding-customer.md (from user-management/onboarding/01-onboarding-flow.md)
│   │   ├── invoices.md (from accounting/invoice/01-invoice-list.md)
│   │   ├── invoice-details.md (from accounting/invoice/02-invoice-details.md)
│   │   ├── invoice-receivers.md (from accounting/invoice-receiver/01-invoice-receiver.md)
│   │   ├── rooms.md (from customer/room/01-room.md)
│   │   └── onboarding-location.md
│   │
│   ├── staff/ (NEW - staff management)
│   │   ├── README.md
│   │   ├── profile.md (from user-management/profile/*.md merged)
│   │   ├── user-management.md (from user-management/admin-user/02-user-management.md)
│   │   ├── onboarding.md (from user-management/onboarding/01-onboarding-flow.md)
│   │   └── expert-assignments.md (from planning/dashboard/expertWorkWeeklyAssignments)
│   │
│   ├── administration/ (NEW - admin configuration)
│   │   ├── README.md
│   │   ├── jobs.md (from accounting/admin-job/03-job-configuration.md)
│   │   ├── job-queue.md (NEW - async job queue)
│   │   ├── job-prices.md (from accounting/config/01-accounting-config.md)
│   │   ├── products.md (from accounting/config/01-accounting-config.md)
│   │   ├── skills.md (from user-management/admin-skill/04-skill.md)
│   │   ├── exclusion-criteria.md
│   │   ├── export-templates.md
│   │   ├── warnings.md (from treatment/warning/01-warning-management.md)
│   │   ├── treatment-categories.md (from treatment/treatment-core/01-treatment-and-category.md)
│   │   ├── equipment.md (from customer/equipment/01-equipment.md)
│   │   └── onboarding-steps.md
│   │
│   ├── system-admin/ (NEW - system administration)
│   │   ├── README.md
│   │   ├── admin-landing.md (from system/admin-system/01-admin-landing.md)
│   │   ├── motd.md (from system/admin-cruds/04-motd-template.md)
│   │   ├── login-notification.md
│   │   ├── notification-templates.md
│   │   ├── location-types.md
│   │   ├── storno-groups.md
│   │   ├── work-hours.md (from accounting/admin-workhour/04-workhour.md)
│   │   ├── cdr.md (from system/cdr-call/01-cdr-call.md)
│   │   ├── cdr-assignment.md (from system/cdr-call/01-cdr-call.md)
│   │   ├── logs.md
│   │   ├── support-categories.md
│   │   ├── basisweb-appointments.md
│   │   └── changelog.md
│   │
│   ├── includes/ (RETAIN - shared components)
│   │   ├── README.md
│   │   ├── site-shell.md (from system/includes/03-site-shell.md - BECOMES TOP LEVEL NAV)
│   │   ├── shared-components.md (from system/includes/01-includes-shared-components.md)
│   │   ├── customization.md (from system/includes/02-includes-customization.md)
│   │   ├── templates-files.md (from system/templates-files/01-templates-files.md)
│   │   └── global-components.md (NEW - Search, Loading Spinner, global nav components)
│   │
│   └── orphan/ (NEW - orphaned content with README explaining WHY)
│       ├── README.md (explains external Video Library, support ticket moved to dashboard)
│       ├── support-and-video.md (from academy/)
│       └── user-video-history.md (from academy/)
│
├── wireframes/ (parallel structure to analysis/ - mirrors domain folders)
│   ├── README.md (wireframes domain overview with component mapping)
│   │
│   ├── dashboard/ (NEW - combines all dashboard views)
│   │   ├── README.md
│   │   ├── calendar.pen (from planning/dashboard/calendar.pen)
│   │   ├── calendar.png
│   │   ├── availability-week.pen (from planning/dashboard/expert-availability.pen)
│   │   ├── availability-week.png
│   │   ├── availability-month.pen (from planning/dashboard/expert-availability.pen)
│   │   ├── availability-month.png
│   │   ├── shift-dialog.pen (from planning/dashboard/shift-dialog.pen)
│   │   ├── shift-dialog.png
│   │   ├── adhoc-appointment.pen (from interfaces/dashboard/basisweb-wizard.pen)
│   │   ├── adhoc-appointment.png
│   │   ├── end-shift.pen (from planning/dashboard/end-shift.pen)
│   │   ├── end-shift.png
│   │   └── support-ticket.pen (from academy/support-video/support-ticket.pen)
│   │   └── support-ticket.png
│   │
│   ├── appointments/ (NEW - core appointment wireframes)
│   │   ├── README.md
│   │   ├── list.pen (from planning/appointment/appointment-list.pen)
│   │   ├── list.png
│   │   ├── details.pen (from planning/appointment/appointment-details.pen)
│   │   ├── details.png
│   │   ├── details-referenced.pen (from planning/appointment/appointment-details-referenced.pen)
│   │   ├── details-referenced.png
│   │   ├── details-patients.pen (from planning/appointment/appointment-details-patients.pen)
│   │   ├── details-patients.png
│   │   ├── details-assigned.pen (from planning/appointment/appointment-details-assigned.pen)
│   │   ├── details-assigned.png
│   │   ├── details-suggestions.pen (from planning/appointment/appointment-details-suggestions.pen)
│   │   ├── details-suggestions.png
│   │   ├── assign-user.pen (from planning/appointment/appointment-assign-user.pen)
│   │   ├── assign-user.png
│   │   └── state-legend.pen (from planning/appointment/appointment-state-legend.pen)
│   │   └── state-legend.png
│   │
│   ├── shifts/ (NEW)
│   │   ├── README.md
│   │   ├── shift-list.pen (from planning/shift/shift-list.pen)
│   │   ├── shift-list.png
│   │   ├── shift-plan-detail.pen (from planning/shift/shift-plan-detail.pen)
│   │   ├── shift-plan-detail.png
│   │   └── apply-plan.pen (from planning/shift/apply-plan.pen)
│   │   └── apply-plan.png
│   │
│   ├── treatments/ (NEW)
│   │   ├── README.md
│   │   └── (wireframes TBD - not yet created)
│   │
│   ├── council/ (NEW)
│   │   ├── README.md
│   │   ├── council-list.pen (from planning/council/council-list.pen)
│   │   ├── council-list.png
│   │   └── council-plan-detail.pen (from planning/council/council-plan-detail.pen)
│   │   └── council-plan-detail.png
│   │
│   ├── consultations/ (NEW - most comprehensive wireframes)
│   │   ├── README.md
│   │   ├── list.pen (from treatment/consultation/consultation-list.pen)
│   │   ├── list.png
│   │   ├── details-header.pen (from treatment/consultation/consultation-details-header.pen)
│   │   ├── details-header.png
│   │   ├── standard-form.pen (from treatment/consultation/consultation-details-standard.pen)
│   │   ├── standard-form.png
│   │   ├── onboarding-form.pen (from treatment/consultation/consultation-details-onboarding.pen)
│   │   ├── onboarding-form.png
│   │   ├── incarceration-form.pen (from treatment/consultation/consultation-details-incarceration.pen)
│   │   ├── incarceration-form.png
│   │   ├── treatment-warning.pen (from treatment/consultation/consultation-details-treatment-warning.pen)
│   │   ├── treatment-warning.png
│   │   ├── view.pen (from treatment/consultation/consultation-view.pen)
│   │   ├── view.png
│   │   ├── review.pen (from treatment/consultation/consultation-review.pen)
│   │   ├── review.png
│   │   ├── icd10-search.pen (from treatment/consultation/consultation-icd10-search.pen)
│   │   ├── icd10-search.png
│   │   ├── export-template.pen (from treatment/consultation/consultation-export-template.pen)
│   │   ├── export-template.png
│   │   ├── wizard.pen (from treatment/dashboard/consultation-wizard.pen)
│   │   ├── wizard.png
│   │   └── location-wizard.pen (from treatment/dashboard/consultation-location-wizard.pen)
│   │   └── location-wizard.png
│   │
│   ├── appointment-admin/ (NEW)
│   │   ├── README.md
│   │   ├── inline-consultation-grid.pen (from planning/appointment-admin/inline-consultation-grid.png source)
│   │   ├── inline-consultation-grid.png
│   │   ├── inline-consultation.pen (from planning/appointment-admin/inline-consultation.pen)
│   │   ├── inline-consultation.png
│   │   ├── close-month.pen (from planning/appointment-support/close-month.pen)
│   │   ├── close-month.png
│   │   ├── calculation.pen (from planning/appointment-admin/calculation.pen)
│   │   ├── calculation.png
│   │   ├── email-dialog.pen (from planning/appointment-admin/email-dialog.pen)
│   │   ├── email-dialog.png
│   │   ├── export-dialog.pen (from planning/appointment-admin/export-dialog.pen)
│   │   ├── export-dialog.png
│   │   ├── job-status.pen (from planning/appointment-admin/job-status.pen)
│   │   ├── job-status.png
│   │   ├── print-preview.pen (from planning/appointment-admin/print-preview.pen)
│   │   ├── print-preview.png
│   │   ├── qm-dialog.pen (from planning/appointment-admin/qm-dialog.pen)
│   │   ├── qm-dialog.png
│   │   └── state-legend.pen (from planning/appointment-admin/state-legend.pen)
│   │   └── state-legend.png
│   │
│   ├── notifications/ (NEW)
│   │   ├── README.md
│   │   ├── notification-list.pen (from system/notification/notification-list.pen)
│   │   ├── notification-list.png
│   │   ├── notification-compose.pen (from system/notification/notification-compose.pen)
│   │   ├── notification-compose.png
│   │   └── send-message.pen (from system/notification/send-message.pen)
│   │   └── send-message.png
│   │
│   ├── customers/ (NEW - consolidated customer domain)
│   │   ├── README.md
│   │   ├── customer-list.pen (from customer/customer-core/customer-list.pen)
│   │   ├── customer-list.png
│   │   ├── customer-detail.pen (from customer/customer-core/customer-detail.png source)
│   │   ├── customer-detail.png
│   │   ├── location-management.pen (from customer/customer-core/location-management.pen)
│   │   ├── location-management.png
│   │   ├── location-detail.pen (from customer/customer-core/location-detail.png source)
│   │   ├── location-detail.png
│   │   ├── room-list-view.pen (from customer/room/room-list-view.pen)
│   │   ├── room-list-view.png
│   │   ├── room-detail.pen (from customer/room/room-detail.png source)
│   │   ├── room-detail.png
│   │   ├── equipment-list.pen (from customer/equipment/equipment-list.png source)
│   │   ├── equipment-list.png
│   │   └── equipment-detail.pen (from customer/equipment/equipment-detail.pen)
│   │   └── equipment-detail.png
│   │
│   ├── staff/ (NEW - staff management)
│   │   ├── README.md
│   │   ├── profile-form.pen (from user-management/profile/profile-form.pen)
│   │   ├── profile-form.png
│   │   ├── profile-staff-list.pen (from user-management/profile/profile-staff-list.pen)
│   │   ├── profile-staff-list.png
│   │   ├── profile-expert-availability.pen (from user-management/profile/profile-expert-availability.pen)
│   │   ├── profile-expert-availability-week.png
│   │   ├── profile-expert-availability-month.png
│   │   ├── profile-expert-search.pen (from user-management/profile/profile-expert-search.pen)
│   │   ├── profile-expert-search.png
│   │   ├── profile-assignment-dialog.pen (from user-management/profile/profile-assignment-dialog.pen)
│   │   ├── profile-assignment-dialog.png
│   │   ├── profile-password-dialog.pen (from user-management/profile/profile-password-dialog.pen)
│   │   ├── profile-password-dialog.png
│   │   └── profile-signature-pad.pen (from user-management/profile/profile-signature-pad.pen)
│   │   └── profile-signature-pad.png
│   │
│   ├── administration/ (NEW - admin configuration)
│   │   ├── README.md
│   │   ├── job-configuration.pen (from accounting/admin-job/job-configuration.pen)
│   │   ├── job-configuration.png
│   │   ├── accounting-config.pen (from accounting/config/accounting-config.pen)
│   │   ├── accounting-config.png
│   │   ├── invoice-list.pen (from accounting/invoice/invoice-list.pen)
│   │   ├── invoice-list.png
│   │   ├── invoice-details.pen (from accounting/invoice/invoice-details.pen)
│   │   ├── invoice-details.png
│   │   ├── invoice-receiver.pen (from accounting/invoice-receiver/invoice-receiver.pen)
│   │   ├── invoice-receiver.png
│   │   └── worklog.pen (from accounting/worklog/worklog.pen)
│   │   └── worklog.png
│   │
│   ├── system-admin/ (NEW - system administration)
│   │   ├── README.md
│   │   ├── dashboard-admin.pen (from system/dashboard/dashboard-admin.pen)
│   │   ├── dashboard-admin.png
│   │   ├── dashboard-standard.pen (from system/dashboard/dashboard-standard.pen)
│   │   ├── dashboard-standard.png
│   │   ├── login-notification.pen (from system/dashboard/login-notification.pen)
│   │   ├── login-notification.png
│   │   ├── cdr-call-list.pen (from system/cdr-call/cdr-call-list.pen source)
│   │   ├── cdr-call-list.png
│   │   └── cdr-assignment-crud.pen (from system/cdr-call/cdr-assignment-crud.pen)
│   │   └── cdr-assignment-crud.png
│   │
│   ├── includes/ (RETAIN - shared components)
│   │   ├── README.md
│   │   ├── navbar.pen (from system/includes/navbar.pen)
│   │   ├── navbar.png
│   │   ├── user-menu.pen (from system/includes/user-menu.pen)
│   │   ├── user-menu.png
│   │   ├── bug-report.pen (from academy/support-video/support-ticket.pen)
│   │   ├── bug-report.png
│   │   ├── loading-states.pen (from system/includes/loading-states.pen)
│   │   ├── loading-states.png
│   │   ├── quick-filter.pen (from system/includes/quick-filter.pen)
│   │   ├── quick-filter.png
│   │   └── color-palette.pen (from system/includes/color-palette.pen)
│   │   └── color-palette.png
│   │
│   └── orphan/ (NEW - orphaned video library wireframes)
│       ├── README.md (explains WHY video library is orphaned - external link)
│       ├── video-library.pen (from academy/support-video/)
│       ├── video-library.png
│       ├── video-category.pen
│       └── video-category.png
│
├── mongodb-mapping/ (RETAIN - MongoDB schema reference)
│   ├── README.md (index with collection tables, migration status)
│   ├── planning.md (appointment, shift, expert availability schemas)
│   ├── treatment.md (consultations, treatments, patient data schemas)
│   ├── user-management.md (users, groups, sessions schemas)
│   ├── customer.md (customers, locations, rooms schemas)
│   ├── accounting.md (invoices, jobs, worklog schemas)
│   ├── academy.md (videos, categories schemas)
│   ├── news.md (notifications, MOTD schemas)
│   ├── interfaces.md (BasisWeb integration schemas)
│   ├── external-data.md (ICD-10, medications schemas)
│   ├── capabilities.md (skills schemas)
│   ├── system.md (system collections schemas)
│   ├── deprecated.md (legacy collections schemas)
│   └── analysis-consultation-vs-consultationData.md (CQRS pattern)
│
├── features/ (RESTRUCTURED - Functional Requirements only, domain-aligned)
│   ├── README.md (explains FR vs NFR split)
│   ├── appointments/ (FR: scheduling, collision detection)
│   ├── shifts/ (FR: shift planning, availability)
│   ├── treatments/ (FR: treatment workflows)
│   ├── consultations/ (FR: consultation types, wizards)
│   ├── customers/ (FR: customer management flows)
│   ├── staff/ (FR: profile, onboarding flows)
│   ├── administration/ (FR: admin CRUD flows)
│   ├── system-admin/ (FR: system config flows)
│   └── includes/ (FR: search, navigation, user dropdown)
│
├── domains/ (NEW - Domain-driven design documentation with NFRs)
│   ├── README.md (domain overview with entity relationships)
│   │
│   ├── appointments/
│   │   ├── README.md (domain context and boundaries)
│   │   ├── entity-model.md (Appointment, AppointmentAssignment, PatientAppointment classes)
│   │   ├── state-machines.md (12-state appointment machine, 12-state assignment machine)
│   │   ├── workflows.md (appointment lifecycle, collision detection, assignment flows)
│   │   └── permissions.md (domain-specific permission gates + NFRs for appointments)
│   │
│   ├── consultations/
│   │   ├── README.md
│   │   ├── entity-model.md (Consultation, Prescription, ActiveIngredient, Warning)
│   │   ├── state-machines.md (6-state consultation machine)
│   │   ├── workflows.md (consultation wizard, ICD-10 search, incarceration check)
│   │   └── permissions.md (includes NFRs: compliance, reliability for consultations)
│   │
│   ├── customers/
│   │   ├── README.md
│   │   ├── entity-model.md (Customer, CustomerLocation, Room, Contact, Invoice)
│   │   ├── workflows.md (customer onboarding, location management, invoicing)
│   │   └── permissions.md (includes NFRs for customer domain)
│   │
│   ├── staff/
│   │   ├── README.md
│   │   ├── entity-model.md (User, Profile, Skill, Group, Availability)
│   │   ├── workflows.md (profile management, expert availability, onboarding)
│   │   └── permissions.md (includes NFRs for staff domain)
│   │
│   └── (other domains follow same pattern with NFRs in permissions.md)
│
├── decisions/ (NEW - Architecture Decision Records)
│   ├── README.md (ADR index and status)
│   ├── ADR-001-tanstack-router.md (Why TanStack Router over React Router)
│   ├── ADR-002-shadcn-ui.md (Why Shadcn/ui over Material-UI, Chakra, etc.)
│   ├── ADR-003-mongodb-to-postgres.md (Database migration strategy)
│   ├── ADR-004-unified-naming.md (Wireframe naming convention)
│   └── ADR-005-domain-driven-structure.md (Why domain-driven organization)
│
├── permissions/ (NEW - RBAC documentation)
│   ├── README.md (permissions overview)
│   ├── rbac-matrix.md (roles × modules matrix)
│   ├── permission-gates.md (fine-grained permissions: SELF_ASSIGNMENT, APPOINTMENT_ADHOC, etc.)
│   └── role-definitions.md (STANDARD, LEITER_INTERN, ADMIN, KUNDE, etc.)
│
├── i18n/ (NEW - Translation documentation)
│   ├── README.md (i18n strategy)
│   ├── translation-inventory.md (all translation keys by domain)
│   ├── hardcoded-strings.md (German strings needing i18n keys, prioritized)
│   ├── translation-guide.md (naming conventions, gender handling, length considerations)
│   └── missing-keys.md (gaps in translation coverage)
│
├── components/ (NEW - Component library documentation)
│   ├── README.md (component overview)
│   ├── shadcn-usage.md (which Shadcn components used where, with examples)
│   ├── custom-components.md (MonthTable, SectionedScrollLayout, etc.)
│   ├── design-tokens.md (colors, spacing, typography, module-based theming)
│   └── state-colors.md (appointment state color palette with hex values)
│
├── migration/ (NEW - Data migration guides)
│   ├── README.md (migration overview)
│   ├── mongodb-reference.md (quick index to legacy MongoDB collections with status)
│   ├── schema-mapping.md (MongoDB → PostgreSQL field-by-field mapping)
│   ├── data-migration.md (migration scripts, validation, rollback)
│   ├── denormalization-patterns.md (what was embedded, what is normalized)
│   ├── cutover-plan.md (production migration strategy)
│   └── migration-status.md (tracks progress per collection)
│
├── testing/ (NEW - Testing strategy)
│   ├── README.md (testing pyramid)
│   ├── testing-strategy.md (unit/integration/E2E balance, coverage goals)
│   ├── e2e-scenarios.md (critical user journey tests in Gherkin)
│   ├── component-patterns.md (React Testing Library patterns)
│   └── test-data.md (fixtures, factories, mock data strategies)
│
├── glossary.md (NEW - Domain terminology)
│   ├── Appointment Types (APPOINTMENT, SHIFT, COUNCIL, TREATMENT)
│   ├── Appointment States (READY, STARTED, ACTIVE, DONE, CLOSED, ARCHIVED, STORNO, etc.)
│   ├── Roles (STANDARD, LEITER_INTERN, ADMIN_INTERN, ADMIN, KUNDE, ADMIN_KUNDE, REGISTERED)
│   └── Acronyms (CDR, MOTD, QM, RBAC, HSP, etc.)
│
├── rules/ (RETAIN - Implementation rules)
│   ├── table-view.md (TanStack React Table patterns)
│   ├── detail-view.md (SectionedScrollLayout patterns)
│   └── (future rules as needed)
│
└── STRUCTURE.md (NEW - Created in Phase 15 - describes final structure)
```
# Migration Plan Addendum - Updated Structure

> **Date**: 2026-03-31  
> **Purpose**: Incorporate all confirmed decisions into MIGRATION-PLAN.md  
> **Status**: Ready for integration

---

## Summary of Confirmed Decisions

All items A-L have been confirmed by the user:

| Item | Decision | Action Taken |
|------|----------|--------------|
| A | Remove duplicate mongodb-mapping/ | ✅ Removed from directory tree |
| B | Merge sections 2.6 & 2.7 | To be merged |
| C | Renumber sections after merge | To be renumbered |
| D | Features/ structure as proposed | New structure defined below |
| D2 | NFR Location: Option B (distributed to domains) | NFRs in domains/{domain}/permissions.md |
| E | Search → includes/global-components.md | Documented in global-components.md |
| F | Add final phase for STRUCTURE.md | Phase 15 added |
| G | Add README.md to orphan/ | Template created below |
| H | Add new script phases (separate scripts) | Scripts listed below |
| I | Bug Report → wireframes/includes/bug-report.* | Moved from academy |
| J | Both academy files → analysis/orphan/ (flat) | Moved |
| K | Scripts kept separate | migrate-directory.sh, update-references.sh, check-orphans.sh, validate-migration.sh |
| L | Features migration: manual (Option B) | Manual content creation phase |

---

## Updated Directory Structure Sections

### Analysis Directory - New Additions

```
analysis/
├── dashboard/
│   └── user-dropdown.md (NEW - consolidates Settings, Security, Role Switch, Bug Report)
├── includes/
│   └── global-components.md (NEW - Search, Loading Spinner, global navigation)
└── orphan/ (NEW - flat structure)
    ├── README.md (explains WHY content is orphaned)
    ├── support-and-video.md (from academy/)
    └── user-video-history.md (from academy/)
```

### Wireframes Directory - New Additions

```
wireframes/
├── dashboard/
│   └── support-ticket.pen, support-ticket.png (from academy/support-video/)
├── includes/
│   └── bug-report.pen, bug-report.png (NEW - from academy/support-video/)
└── orphan/ (NEW - flat structure)
    ├── README.md (explains WHY video library is orphaned - external link)
    └── (video library wireframes)
```

### Features Directory - Restructured

```
features/
├── README.md (explains FR vs NFR split)
├── appointments/ (FR: scheduling, collision detection)
├── shifts/ (FR: shift planning, availability)
├── treatments/ (FR: treatment workflows)
├── consultations/ (FR: consultation types, wizards)
├── customers/ (FR: customer management flows)
├── staff/ (FR: profile, onboarding flows)
├── administration/ (FR: admin CRUD flows)
├── system-admin/ (FR: system config flows)
└── includes/ (FR: search, navigation, user dropdown)

Note: NFRs moved to domains/{domain}/permissions.md
```

### Domains Directory - With NFRs

```
domains/
├── appointments/
│   ├── entity-model.md
│   ├── state-machines.md
│   ├── workflows.md
│   └── permissions.md (includes NFRs: performance, security for appointments)
├── consultations/
│   └── permissions.md (includes NFRs: compliance, reliability for consultations)
└── ... (all domains with NFRs in permissions.md)
```

---

## New Scripts to Create

### 1. update-references.sh

**Purpose**: Update all internal markdown references after file moves

**High Priority** - Estimated token savings: High (100+ links)

```bash
#!/bin/bash
# Update all internal references in markdown files

# Pattern 1: Old paths to new paths
find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/planning/appointment/|specs/analysis/appointments/|g' {} \;

# Pattern 2: Numeric prefix removal
find specs -name "*.md" -type f -exec sed -i \
  's|/01-|/|g; s|/02-|/|g; s|/03-|/|g; s|/04-|/|g; s|/05-|/|g' {} \;

# Pattern 3: Wireframe plan references
find specs -name "*.md" -type f -exec sed -i \
  's|wireframe-plan\.md|wireframes.md|g' {} \;

echo "Reference updates complete"
```

### 2. check-orphans.sh

**Purpose**: Detect orphaned PNG files not referenced in any markdown

**Medium Priority** - Estimated token savings: Medium

```bash
#!/bin/bash
# Find orphaned PNG files

cd specs/wireframes
orphans=0

for file in $(find . -name "*.png" -type f); do
  if ! grep -r "$(basename $file)" . --include="*.md" > /dev/null 2>&1; then
    echo "ORPHANED: $file"
    orphans=$((orphans + 1))
  fi
done

if [ $orphans -eq 0 ]; then
  echo "✅ No orphaned files found"
  exit 0
else
  echo "❌ Found $orphans orphaned files"
  exit 1
fi
```

### 3. validate-migration.sh

**Purpose**: Final validation of migration completeness

**Medium Priority** - Estimated token savings: Medium

```bash
#!/bin/bash
# Validate migration completeness

errors=0

# Check all domains exist
for domain in dashboard appointments shifts treatments consultations council appointment-admin notifications customers staff administration system-admin includes orphan; do
  if [ ! -d "specs/analysis/$domain" ]; then
    echo "❌ Missing: analysis/$domain"
    errors=$((errors + 1))
  fi
  if [ ! -d "specs/wireframes/$domain" ]; then
    echo "❌ Missing: wireframes/$domain"
    errors=$((errors + 1))
  fi
done

# Check for broken markdown links
echo "Checking for broken links..."
# (implementation omitted for brevity)

if [ $errors -eq 0 ]; then
  echo "✅ Migration validation passed"
  exit 0
else
  echo "❌ Found $errors errors"
  exit 1
fi
```

---

## Updated Phase Structure

| Phase | Content | Script | Manual/Auto |
|-------|---------|--------|-------------|
| Phase 1-6 | File moves (analysis, wireframes, mongodb-mapping) | `migrate-directory.sh` | Auto |
| Phase 7 | Features/ restructuring (FR + NFR split) | Manual | Manual |
| Phase 8 | Orphan moves (academy → orphan/) | `migrate-directory.sh` | Auto |
| Phase 9 | Create orphan READMEs (explain WHY) | Manual | Manual |
| Phase 10 | Update all references | `update-references.sh` | Auto |
| Phase 11 | Check orphans | `check-orphans.sh` | Auto |
| Phase 12 | Validate migration | `validate-migration.sh` | Auto |
| Phase 13-14 | Content creation (domains/, decisions/, etc.) | Manual | Manual |
| Phase 15 | Create STRUCTURE.md (final structure doc) | Manual | Manual |

---

## Orphan README.md Template

```markdown
# Orphaned Content

> **Date Moved**: 2026-03-31  
> **Reason**: Content relates to external systems or deprecated features

## Why This Content is Here

These documents were moved to `orphan/` because:

1. **External Dependencies**: The Video Library (`https://learn.videoclinic.de/`) is an external link, not an internal feature
2. **Support Ticket Integration**: The support ticket functionality is being relocated to `dashboard/user-dropdown.md` as it's part of the user support workflow

## Content Status

| File | Original Location | Status |
|------|-------------------|--------|
| `support-and-video.md` | `academy/support-video/` | Pending decision on video platform |
| `user-video-history.md` | `academy/video-history/` | Pending decision on video platform |

## Next Steps

- [ ] Decide on video platform migration strategy
- [ ] Determine if support ticket should remain in dashboard or move to includes
- [ ] Update or remove orphaned content based on decisions

---

**Back to**: [`../README.md`](../README.md)
```

---

## Features/ Functional Requirements Mapping

| New Location | Source (Current features/) | Content to Extract |
|--------------|---------------------------|-------------------|
| `features/appointments/` | `scheduling/` | Appointment scheduling logic, collision detection rules |
| `features/shifts/` | `scheduling/` | Shift planning workflows, availability management |
| `features/treatments/` | `medical-management/` | Treatment workflows, state transition rules |
| `features/consultations/` | `medical-management/` | Consultation type logic, wizard flows, ICD-10 integration |
| `features/customers/` | (review files) | Customer management flows |
| `features/staff/` | `ui/` (profile screens) | Profile UI behaviors, onboarding step flows |
| `features/system-admin/` | (review files) | System configuration flows |
| `features/includes/` | `ui/` (global) | Search behavior, navigation logic, user dropdown interactions |

**NFRs** moved to `domains/{domain}/permissions.md`:
- Performance requirements
- Reliability/uptime requirements
- Security requirements (encryption, access control)
- Compliance requirements (GDPR, medical regulations)

---

## Integration Instructions

To integrate this addendum into MIGRATION-PLAN.md:

1. **Replace Section 2.2** with updated directory tree (includes orphan/, user-dropdown.md, global-components.md)
2. **Merge Sections 2.6 & 2.7** into single section 2.6 "Wireframes Directory Alignment & Unified Naming"
3. **Renumber sections** sequentially (2.4, 2.5, 2.6, etc.)
4. **Add new Section 2.8**: "Features Directory Restructuring" with FR/NFR split explanation
5. **Add new Section 2.9**: "Orphan Directory" with explanation and README template
6. **Update Phase Structure** in Section 5 with new phases (10-15)
7. **Add new Section 6.5**: "Script Descriptions" with update-references.sh, check-orphans.sh, validate-migration.sh
8. **Update Section 9** (Appendix) with features/ mapping table

---

**End of Addendum**
