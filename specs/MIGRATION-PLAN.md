# Specs Directory Migration Plan

> **Generated**: 2026-03-31  
> **Source**: `specs/analysis/includes/site-shell.md` sitemap structure  
> **Goal**: Streamline folder structure, reduce nesting, standardize file names, update all cross-references

---

## 1. Executive Summary

This migration reorganizes the `specs/` directory to align with the application's sitemap structure from `03-site-shell.md`. The new structure:

- **Reduces subdirectory depth** from 4-5 levels to 2-3 levels
- **Consolidates related modules** under domain-based folders
- **Standardizes markdown file names** (removes numeric prefixes where redundant)
- **Transforms `wireframes.md` files** into consistent format
- **Updates all internal references** between markdown files
- **Makes `03-site-shell.md` the top-level navigation document**
- **Aligns wireframes/ directory structure** to match analysis/ domains exactly
- **Removes orphaned PNG files** not referenced in any documentation
- **Restructures features/** into functional requirements (domain-aligned) + NFRs (distributed to domains)

### Key Changes

| Aspect | Before | After |
|--------|--------|-------|
| Max directory depth | 5 levels | 3 levels |
| Analysis subfolders | 50 directories | 17 domain folders (includes orphan/, i18n/, mongodb-mapping/, permissions/) |
| Wireframe subfolders | 41 directories | 14 domain folders (excludes components/) |
| File naming | Mixed (`01-name.md`, `name.md`) | Standardized (`list.md`, `details.md`, etc.) |
| Top-level nav | Scattered README files | Single `SITE-NAVIGATION.md` |
| Orphaned PNGs | ~3 files | 0 (cleaned up) |
| Features structure | Mixed FR/NFR | FR in domain folders, NFR in domains/{domain}/permissions.md |

---

## 2. New Directory Structure

**IMPORTANT**: All relative links in documentation use the file's own directory as base.
Example: From `analysis/SITE-NAVIGATION.md`, link to `analysis/dashboard/README.md` as `./dashboard/README.md`

### 2.0 Directory Cleanup Strategy

After all files are migrated from old directories to new consolidated domain folders, **all source directories must be deleted** to avoid confusion and maintain a clean structure.

**Cleanup Process:**
1. Run migration scripts to move all files to new locations
2. Validate all files have been moved successfully
3. Delete all empty source directories (see Section 6.4 for cleanup script)
4. Verify no broken links remain

**Directories to Delete After Migration:**
- All `analysis/accounting/*` subdirectories
- All `analysis/academy/*` subdirectories
- All `analysis/user-management/*` subdirectories
- All `analysis/planning/*` subdirectories
- All `analysis/system/*` subdirectories (except `includes/`)
- All `analysis/customer/*` subdirectories
- All `analysis/interfaces/*` subdirectories
- All `analysis/treatment/*` subdirectories
- All `wireframes/accounting/*` subdirectories
- All `wireframes/academy/*` subdirectories
- All `wireframes/user-management/*` subdirectories
- All `wireframes/planning/*` subdirectories
- All `wireframes/system/*` subdirectories (except `includes/`)
- All `wireframes/customer/*` subdirectories
- All `wireframes/interfaces/*` subdirectories
- All `wireframes/treatment/*` subdirectories
- Old `features/*` subdirectories (compliance/, performance/, resource-management/, security/, ui/, usability/)

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
   - `components/` — Component library and design tokens
   - `migration/` — Data migration guides
   - `testing/` — Testing strategy and E2E scenarios
   - `features/` — Functional requirements (domain-aligned)
   - `analysis/permissions/` — RBAC matrix and permission gates (moved under analysis/)
   - `analysis/i18n/` — Translation inventory and hardcoded strings
   - `analysis/glossary.md` — Domain terminology

5. **Automated Validation** — CI checks for broken links, orphaned files, correlations

### 2.2 Complete Directory Tree

```
specs/
├── README.md (updated to reference SITE-NAVIGATION.md)
├── MIGRATION-PLAN.md (this document)
├── analysis/ (consolidated into domain folders)
│   ├── README.md (top-level domain overview with progress tracking)
│   ├── SITE-NAVIGATION.md (MASTER NAVIGATION - sitemap with all links)
│   ├── glossary.md (NEW - Domain terminology: appointment types, states, roles, acronyms)
│   ├── i18n/ (NEW - Translation documentation from planning/translations/)
│   │   ├── README.md (i18n strategy and overview)
│   │   ├── translation-inventory.md (consolidated: 466 keys, coverage stats, missing translations)
│   │   ├── hardcoded-strings.md (German strings needing i18n keys, prioritized)
│   │   ├── translation-guide.md (naming conventions, gender handling, batched recheck workflows)
│   │   ├── missing-keys.md (gaps: 22 missing EN, 9 missing DE with auto-translate suggestions)
│   │   ├── domains/ (per-domain detailed inventories)
│   │   │   ├── treatment.md (155 keys, 94-97% coverage)
│   │   │   ├── customer.md (111 keys, 97-98% coverage)
│   │   │   ├── accounting.md (62 keys, 95-98% coverage)
│   │   │   ├── system.md (49 keys, 96-100% coverage)
│   │   │   ├── planning.md (57 keys, 95-100% coverage)
│   │   │   ├── user-management.md (18 keys, 89% coverage)
│   │   │   ├── interfaces.md (6 keys, 100% coverage)
│   │   │   └── academy.md (8 keys, 100% coverage)
│   │   └── scripts/
│   │       └── lookup-translations.sh (executable lookup script for batched rechecks)
│   │
│   ├── dashboard/ (NEW - combines all dashboard views)
│   │   ├── README.md
│   │   ├── standard.md (from system/dashboard/dashboard-main.md)
│   │   ├── admin.md (from system/dashboard/dashboard-admin.md)
│   │   ├── self-service.md (from planning/dashboard/dashboard-selfservice.md)
│   │   ├── dialogs.md (merged from multiple dialog docs)
│   │   └── user-dropdown.md (NEW - Settings, Security, Role Switch, Bug Report from 03-site-shell.md)
│   │
│   ├── appointments/ (NEW - core appointment management)
│   │   ├── README.md
│   │   ├── list.md (from planning/appointment/appointment-list.md)
│   │   ├── details.md (from planning/appointment/appointment-details-scheduling.md)
│   │   ├── assign-user.md (from planning/appointment/appointment-assign-user.md)
│   │   ├── plan.md (from planning/appointment-support/appointment-plan.md)
│   │   └── patient-data.md (from treatment/patient-data/patient-data.md)
│   │
│   ├── shifts/ (NEW)
│   │   ├── README.md
│   │   ├── list.md (from planning/shift/shift-and-plan.md)
│   │   └── plan.md (from planning/shift/wireframes.md content)
│   │
│   ├── treatments/ (NEW)
│   │   ├── README.md
│   │   ├── list.md (from treatment/treatment-core/treatment-and-category.md)
│   │   ├── plan.md (from treatment/treatment-core/treatment-plan.md)
│   │   └── patient-data.md (moved from appointments/)
│   │
│   ├── council/ (NEW)
│   │   ├── README.md
│   │   ├── list.md (from planning/council/council-and-plan.md)
│   │   └── plan.md
│   │
│   ├── consultations/ (NEW)
│   │   ├── README.md
│   │   ├── list.md (from treatment/consultation/consultation-list.md)
│   │   ├── details-header.md (from treatment/consultation/consultation-details-header.md)
│   │   ├── standard-form.md (from treatment/consultation/consultation-details-standard.md)
│   │   ├── onboarding-form.md (from treatment/consultation/consultation-details-onboarding.md)
│   │   ├── incarceration-form.md (from treatment/consultation/consultation-details-incarceration.md)
│   │   ├── treatment-warning.md (from treatment/consultation/06-consultation-details-treatment-warning.md)
│   │   ├── view-review.md (from treatment/consultation/07-consultation-view-review.md)
│   │   └── details-js.md (from treatment/consultation/08-consultation-details-js.md)
│   │
│   ├── appointment-admin/ (NEW)
│   │   ├── README.md
│   │   ├── admin.md (from planning/appointment-admin/appointment-admin.md)
│   │   └── closed-month.md (from accounting/config/accounting-config.md)
│   │
│   ├── notifications/ (NEW)
│   │   ├── README.md
│   │   └── list.md (from system/notification/notification.md)
│   │
│   ├── customers/ (NEW - consolidated customer domain)
│   │   ├── README.md
│   │   ├── list.md (from customer/customer-core/customer-list-detail.md)
│   │   ├── locations-users.md (from customer/customer-core/location-and-users.md)
│   │   ├── onboarding-customer.md (from user-management/onboarding/onboarding-flow.md)
│   │   ├── invoices.md (from accounting/invoice/invoice-list.md)
│   │   ├── invoice-details.md (from accounting/invoice/invoice-details.md)
│   │   ├── invoice-receivers.md (from accounting/invoice-receiver/invoice-receiver.md)
│   │   ├── rooms.md (from customer/room/room.md)
│   │   └── onboarding-location.md
│   │
│   ├── staff/ (NEW - staff management)
│   │   ├── README.md
│   │   ├── profile.md (from user-management/profile/*.md merged)
│   │   ├── user-management.md (from user-management/admin-user/user-management.md)
│   │   ├── onboarding.md (from user-management/onboarding/onboarding-flow.md)
│   │   └── expert-assignments.md (from planning/dashboard/expertWorkWeeklyAssignments)
│   │
│   ├── administration/ (NEW - admin configuration)
│   │   ├── README.md
│   │   ├── jobs.md (from accounting/admin-job/job-configuration.md)
│   │   ├── job-queue.md (NEW - async job queue)
│   │   ├── job-prices.md (from accounting/config/accounting-config.md)
│   │   ├── products.md (from accounting/config/accounting-config.md)
│   │   ├── skills.md (from user-management/admin-skill/skill.md)
│   │   ├── exclusion-criteria.md
│   │   ├── export-templates.md
│   │   ├── warnings.md (from treatment/warning/warning-management.md)
│   │   ├── treatment-categories.md (from treatment/treatment-core/treatment-and-category.md)
│   │   ├── equipment.md (from customer/equipment/equipment.md)
│   │   └── onboarding-steps.md
│   │
│   ├── system-admin/ (NEW - system administration)
│   │   ├── README.md
│   │   ├── admin-landing.md (from system/admin-system/admin-landing.md)
│   │   ├── motd.md (from system/admin-cruds/motd-template.md)
│   │   ├── login-notification.md
│   │   ├── notification-templates.md
│   │   ├── location-types.md
│   │   ├── storno-groups.md
│   │   ├── work-hours.md (from accounting/admin-workhour/workhour.md)
│   │   ├── cdr.md (from system/cdr-call/cdr-call.md)
│   │   ├── cdr-assignment.md (from system/cdr-call/cdr-call.md)
│   │   ├── logs.md
│   │   ├── support-categories.md
│   │   ├── basisweb-appointments.md
│   │   └── changelog.md
│   │
│   ├── includes/ (RETAIN - shared components)
│   │   ├── README.md
│   │   ├── site-shell.md (from system/includes/site-shell.md - BECOMES TOP LEVEL NAV)
│   │   ├── shared-components.md (from system/includes/includes-shared-components.md)
│   │   ├── customization.md (from system/includes/includes-customization.md)
│   │   ├── templates-files.md (from system/templates-files/templates-files.md)
│   │   └── global-components.md (NEW - Search, Loading Spinner, global nav components)
│   │
│   ├── permissions/ (NEW - RBAC matrix, permission gates, role definitions)
│   │   ├── README.md (permissions overview)
│   │   ├── rbac-matrix.md (roles × modules matrix)
│   │   ├── permission-gates.md (fine-grained permissions: SELF_ASSIGNMENT, APPOINTMENT_ADHOC, etc.)
│   │   └── role-definitions.md (STANDARD, LEITER_INTERN, ADMIN, KUNDE, etc.)
│   │
│   └── orphan/ (NEW - orphaned content with README explaining WHY)
│       ├── README.md (explains external Video Library, support ticket moved to dashboard)
│       ├── support-and-video.md (from analysis/academy/support-video/support-and-video.md)
│       └── user-video-history.md (from analysis/academy/video-history/)
│
├── wireframes/ (parallel structure to analysis/ - mirrors domain folders)
│   ├── README.md (wireframes domain overview with component mapping)
│   │
│   ├── components/ (NEW - Component library and design tokens)
│   │   ├── README.md (component overview)
│   │   ├── shadcn-usage.md (which Shadcn components used where, with examples)
│   │   ├── custom-components.md (MonthTable, SectionedScrollLayout, etc.)
│   │   ├── design-tokens.md (colors, spacing, typography, module-based theming)
│   │   └── state-colors.md (appointment state color palette with hex values)
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
│   │   └── support-ticket.pen (from wireframes/academy/support-video/support-ticket.pen)
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
│   │   ├── bug-report.pen (from wireframes/academy/support-video/support-ticket.pen)
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
│       ├── video-library.pen (from wireframes/academy/support-video/)
│       ├── video-library.png
│       ├── video-category.pen (from wireframes/academy/support-video/)
│       └── video-category.png (from wireframes/academy/support-video/)
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

All items A-L have been confirmed by the user through the decision log below:

| Item | Question | Options | Decision | Action Taken |
|------|----------|---------|----------|--------------|
| A | Should we keep the duplicate `mongodb-mapping/` directory that was created in both old and new structures? | **Option A**: Keep both for redundancy<br>**Option B**: Remove duplicate, keep single source of truth | **Option B** - Remove duplicate | ✅ Removed from directory tree |
| B | Should sections 2.6 (Analysis Directory Structure) and 2.7 (Wireframes Directory Structure) be merged into a single section? | **Option A**: Keep separate for clarity<br>**Option B**: Merge to reduce document length | **Option B** - Merge sections | To be merged |
| C | After merging sections 2.6 & 2.7, should we renumber the remaining sections? | **Option A**: Keep original numbering<br>**Option B**: Renumber sequentially | **Option B** - Renumber sections | To be renumbered |
| D | How should we structure the `features/` directory? | **Option A**: Keep existing structure<br>**Option B**: Restructure by domain (appointments/, shifts/, treatments/, etc.)<br>**Option C**: Flatten to single level | **Option B** - Domain-aligned structure | New structure defined below |
| D2 | Where should Non-Functional Requirements (NFRs) be documented? | **Option A**: Central `features/nfrs/` directory<br>**Option B**: Distributed to `domains/{domain}/permissions.md`<br>**Option C**: Separate `nfrs/` top-level directory | **Option B** - Distributed to domains | NFRs in domains/{domain}/permissions.md |
| E | Where should the Search component documentation be placed? | **Option A**: `features/search/`<br>**Option B**: `includes/global-components.md`<br>**Option C**: `components/search.md` | **Option B** - Global components | Documented in global-components.md |
| F | Should we add a final phase to create `STRUCTURE.md` documenting the final directory structure? | **Option A**: No, MIGRATION-PLAN.md is sufficient<br>**Option B**: Yes, add Phase 15 for STRUCTURE.md | **Option B** - Add Phase 15 | Phase 15 added |
| G | Should we add a `README.md` file to the `orphan/` directory explaining why content is orphaned? | **Option A**: No, orphaned content is self-explanatory<br>**Option B**: Yes, add README with context | **Option B** - Add README | Template created below |
| H | How should we handle migration scripts? | **Option A**: Single monolithic script<br>**Option B**: Separate scripts per phase (migrate, update-refs, check-orphans, validate)<br>**Option C**: No scripts, manual only | **Option B** - Separate scripts | Scripts listed below |
| I | Where should the Bug Report wireframe be placed? | **Option A**: Keep in `academy/support-video/`<br>**Option B**: Move to `wireframes/includes/bug-report.*`<br>**Option C**: Move to `wireframes/dashboard/` | **Option B** - Move to includes | Moved from academy |
| J | Where should the academy files (`support-and-video.md`, `user-video-history.md`) be placed? | **Option A**: Keep in `academy/` subdirectory<br>**Option B**: Move to `analysis/orphan/` (flat structure)<br>**Option C**: Delete as deprecated | **Option B** - Flat orphan structure | Moved |
| K | Should migration scripts be combined or kept separate? | **Option A**: Combine into single script<br>**Option B**: Keep separate for modularity and selective execution | **Option B** - Keep separate | migrate-directory.sh, update-references.sh, check-orphans.sh, validate-migration.sh |
| L | How should the features/ migration be handled? | **Option A**: Automated script to move files<br>**Option B**: Manual content creation and review<br>**Option C**: Hybrid approach | **Option B** - Manual migration | Manual content creation phase |

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

## 6. Migration Scripts

The migration scripts are located in `specs/planning/migration/` and should be executed in order:

| # | Script | Purpose |
|---|--------|---------|
| 1 | `01_migrate-directories.sh` | Move files to new consolidated domain folders (with numeric prefixes) |
| 2 | `02_rename-files.sh` | Rename files by removing numeric prefixes in destination |
| 3 | `03_update-references.sh` | Update all internal markdown references |
| 4 | `04_check-orphans.sh` | Detect orphaned PNG files |
| 5 | `05_validate-migration.sh` | Validate migration completeness |
| 6 | `06_cleanup-empty-dirs.sh` | Delete empty source directories |
| 7 | `07_create-readmes.sh` | Create README files for new directories |

### Execution Instructions

**IMPORTANT**: All scripts must be executed from the **project root directory** (`BearStudio-start-ui-web/`), NOT from `specs/planning/migration/`.

```bash
# From project root directory (BearStudio-start-ui-web/)
bash specs/planning/migration/01_migrate-directories.sh
bash specs/planning/migration/02_rename-files.sh
bash specs/planning/migration/03_update-references.sh
bash specs/planning/migration/04_check-orphans.sh
bash specs/planning/migration/05_validate-migration.sh  # Must pass before cleanup
bash specs/planning/migration/06_cleanup-empty-dirs.sh
bash specs/planning/migration/07_create-readmes.sh
```

**Why from project root?**: The scripts use `cd "$(dirname "$0")/../../.."` to navigate to the project root, then reference paths relative to `specs/`. Running from `specs/planning/migration/` directly will cause path resolution failures.

### Script Details

#### 01_migrate-directories.sh

**Purpose**: Move files from old directory structure to new consolidated domain folders

**High Priority** - Must run FIRST, before rename-files.sh

Creates new directories and moves:
- Analysis files to `specs/analysis/{domain}/` (keeping numeric prefixes)
- Wireframe files to `specs/wireframes/{domain}/` (copying .pen and .png files)
- Creates new top-level directories: `features/`, `domains/`, `decisions/`, `migration/`, `testing/`

#### 02_rename-files.sh

**Purpose**: Rename files by removing numeric prefixes in destination directories

**High Priority** - Must run AFTER migrate-directories.sh

Key renames:
- `01-dashboard-main.md` → `dashboard-main.md`
- `03-dashboard-admin.md` → `dashboard-admin.md`
- `01-appointment-list.md` → `appointment-list.md`
- All `NN-*.md` files → `*.md` (generic pattern)

**Conflict handling**: If a destination filename already exists, appends `-1`, `-2`, etc. (e.g., `list-1.md`, `list-2.md`)

#### 02_rename-files.sh

**Purpose**: Rename files by removing numeric prefixes in destination directories

**High Priority** - Must run AFTER migrate-directories.sh

Key renames:
- `01-dashboard-main.md` → `dashboard-main.md`
- `03-dashboard-admin.md` → `dashboard-admin.md`
- `01-appointment-list.md` → `appointment-list.md`
- All `NN-*.md` files → `*.md` (generic pattern)

**Conflict handling**: If a destination filename already exists, appends `-1`, `-2`, etc. (e.g., `list-1.md`, `list-2.md`)

#### 03_update-references.sh

**Purpose**: Update all internal markdown references after file moves

**High Priority** - Must run AFTER migrate-directories.sh

Updates:
- Old path references (e.g., `planning/appointment/` → `appointments/`)
- Wireframe path references
- Numeric prefix references in links

#### 04_check-orphans.sh

**Purpose**: Detect orphaned PNG files not referenced in any markdown

Reports PNG files that are not referenced in any `.md` file for manual review.

#### 05_validate-migration.sh

**Purpose**: Validate migration completeness

**Medium Priority** - Must pass before running cleanup

Checks:
- All domain directories exist
- No broken markdown links
- No files remaining in old locations

#### 06_cleanup-empty-dirs.sh

**Purpose**: Delete all empty source directories after migration

**High Priority** - Critical for clean structure

Removes old directory structures:
- `analysis/accounting/*`, `analysis/academy/*`, `analysis/customer/*`, etc.
- `wireframes/accounting/*`, `wireframes/academy/*`, etc.
- `features/compliance/*`, `features/performance/*`, etc.

#### 07_create-readmes.sh

**Purpose**: Create README.md files for all new directories

Creates documentation for:
- `analysis/README.md` - Domain overview
- `wireframes/README.md` - Component mapping
- `features/README.md` - FR vs NFR split
- `domains/README.md` - Entity model structure
- `decisions/README.md` - ADR index
- `migration/README.md` - Migration status
- `testing/README.md` - Testing strategy
- `wireframes/components/README.md` - Component library
- `analysis/orphan/README.md` - Orphan context
- `wireframes/orphan/README.md` - Orphaned wireframes

**Purpose**: Delete all empty source directories after migration

**High Priority** - Critical for clean structure

```bash
#!/bin/bash
set -e

# Clean up empty directories after migration

echo "Starting directory cleanup..."

if ! cd specs; then
  echo "❌ Error: Failed to change to specs directory"
  echo "Analysis: specs directory may not exist from current location"
  echo "Direction: Run 'pwd' to verify current directory, then 'ls -la' to check specs exists"
  exit 1
fi

# Analysis directories to clean (old structure)
echo "Cleaning empty analysis/ subdirectories..."
for old_dir in \
  analysis/accounting/admin-job \
  analysis/accounting/admin-workhour \
  analysis/accounting/config \
  analysis/accounting/invoice \
  analysis/accounting/invoice-receiver \
  analysis/accounting/worklog \
  analysis/academy/support-video \
  analysis/academy/video-history \
  analysis/customer/contact \
  analysis/customer/customer-core \
  analysis/customer/equipment \
  analysis/customer/room \
  analysis/interfaces/dashboard \
  analysis/planning/appointment \
  analysis/planning/appointment-admin \
  analysis/planning/appointment-support \
  analysis/planning/council \
  analysis/planning/dashboard \
  analysis/planning/shift \
  analysis/system/admin-cruds \
  analysis/system/admin-system \
  analysis/system/cdr-call \
  analysis/system/config \
  analysis/system/dashboard \
  analysis/system/notification \
  analysis/system/templates-files \
  analysis/treatment/appointment-patient \
  analysis/treatment/consultation \
  analysis/treatment/dashboard \
  analysis/treatment/medication \
  analysis/treatment/patient-data \
  analysis/treatment/questionnaire \
  analysis/treatment/treatment-core \
  analysis/treatment/warning \
  analysis/user-management/admin-group \
  analysis/user-management/admin-skill \
  analysis/user-management/admin-user \
  analysis/user-management/dashboard \
  analysis/user-management/onboarding \
  analysis/user-management/profile; do
  if [ -d "$old_dir" ]; then
    echo "  Checking: $old_dir"
    if [ -z "$(ls -A "$old_dir" 2>/dev/null)" ]; then
      if ! rmdir "$old_dir" 2>/dev/null; then
        echo "    ⚠ Failed to delete directory"
        echo "    Analysis: Directory may have subdirectories or permission issues"
        echo "    Direction: Run 'ls -la $old_dir' to inspect contents"
      else
        echo "    ✓ Deleted empty directory"
      fi
    else
      echo "    ⚠ Directory not empty - manual review required"
      echo "    Contents: $(ls -A "$old_dir" | head -5)"
    fi
  fi
done

# Wireframes directories to clean (old structure)
echo "Cleaning empty wireframes/ subdirectories..."
for old_dir in \
  wireframes/accounting/admin-job \
  wireframes/accounting/config \
  wireframes/accounting/invoice \
  wireframes/accounting/invoice-receiver \
  wireframes/accounting/worklog \
  wireframes/academy/support-video \
  wireframes/customer/contact \
  wireframes/customer/customer-core \
  wireframes/customer/equipment \
  wireframes/customer/room \
  wireframes/interfaces/dashboard \
  wireframes/planning/appointment \
  wireframes/planning/appointment-admin \
  wireframes/planning/appointment-support \
  wireframes/planning/council \
  wireframes/planning/dashboard \
  wireframes/planning/shift \
  wireframes/system/admin \
  wireframes/system/cdr-call \
  wireframes/system/dashboard \
  wireframes/system/includes \
  wireframes/system/notification \
  wireframes/system/shell \
  wireframes/treatment/consultation \
  wireframes/treatment/dashboard \
  wireframes/treatment/questionnaire \
  wireframes/user-management/dashboard \
  wireframes/user-management/profile; do
  if [ -d "$old_dir" ]; then
    echo "  Checking: $old_dir"
    if [ -z "$(ls -A "$old_dir" 2>/dev/null)" ]; then
      if ! rmdir "$old_dir" 2>/dev/null; then
        echo "    ⚠ Failed to delete directory"
        echo "    Analysis: Directory may have subdirectories or permission issues"
        echo "    Direction: Run 'ls -la $old_dir' to inspect contents"
      else
        echo "    ✓ Deleted empty directory"
      fi
    else
      echo "    ⚠ Directory not empty - manual review required"
      echo "    Contents: $(ls -A "$old_dir" | head -5)"
    fi
  fi
done

# Features directories to clean (old structure)
echo "Cleaning empty features/ subdirectories..."
for old_dir in \
  features/compliance/consultation-details \
  features/performance/database-optimization \
  features/performance/general \
  features/resource-management \
  features/security \
  features/usability; do
  if [ -d "$old_dir" ]; then
    echo "  Checking: $old_dir"
    if [ -z "$(ls -A "$old_dir" 2>/dev/null)" ]; then
      if ! rmdir "$old_dir" 2>/dev/null; then
        echo "    ⚠ Failed to delete directory"
        echo "    Analysis: Directory may have subdirectories or permission issues"
        echo "    Direction: Run 'ls -la $old_dir' to inspect contents"
      else
        echo "    ✓ Deleted empty directory"
      fi
    else
      echo "    ⚠ Directory not empty - manual review required"
      echo "    Contents: $(ls -A "$old_dir" | head -5)"
    fi
  fi
done

# Clean parent directories if they became empty
echo "Cleaning empty parent directories..."
if ! find analysis -type d -empty -delete 2>/dev/null; then
  echo "  ⚠ Warning: Failed to clean some analysis/ parent directories"
  echo "  Analysis: Check for permission issues or locked files"
fi
if ! find wireframes -type d -empty -delete 2>/dev/null; then
  echo "  ⚠ Warning: Failed to clean some wireframes/ parent directories"
  echo "  Analysis: Check for permission issues or locked files"
fi
if ! find features -type d -empty -delete 2>/dev/null; then
  echo "  ⚠ Warning: Failed to clean some features/ parent directories"
  echo "  Analysis: Check for permission issues or locked files"
fi

# Report
echo ""
echo "Cleanup complete!"
echo "Remaining directories:"
echo "  analysis/: $(find analysis -type d | wc -l)"
echo "  wireframes/: $(find wireframes -type d | wc -l)"
echo "  features/: $(find features -type d | wc -l)"

# Final verification
remaining_old_dirs=$(find analysis wireframes features -type d -name "admin-job" -o -name "appointment" -o -name "consultation" -o -name "dashboard" | grep -E "(accounting|planning|treatment|user-management)/" | wc -l)
if [ $remaining_old_dirs -gt 0 ]; then
  echo ""
  echo "⚠ Warning: Found $remaining_old_dirs old structure directories still present"
  echo "Analysis: Some old directories may still contain files"
  echo "Direction: Review remaining directories and manually verify they can be deleted"
  find analysis wireframes features -type d \( -name "admin-job" -o -name "appointment" -o -name "consultation" -o -name "dashboard" \) | grep -E "(accounting|planning|treatment|user-management)/" || true
fi
```

### 6.6 Script Execution Order

Scripts must be executed in the following order:

1. **01_migrate-directories.sh** - Move files to new locations (MUST run first)
2. **02_rename-files.sh** - Remove numeric prefixes from filenames
3. **03_update-references.sh** - Update all internal markdown references
4. **04_check-orphans.sh** - Verify no orphaned PNG files remain
5. **05_validate-migration.sh** - Validate all target directories exist and links work
6. **06_cleanup-empty-dirs.sh** - Delete all empty source directories (FINAL STEP)

**WARNING**: Do not run `06_cleanup-empty-dirs.sh` until you have verified that:
- All files have been successfully moved to their new locations
- All filenames have been renamed (numeric prefixes removed)
- All internal references have been updated
- No broken links exist in the documentation
- The migration validation passes

### 6.7 Error Handling and Recovery

All scripts now include `set -e` to exit immediately on error. When a script fails:

1. **Read the error message** - Each script provides:
   - ❌ What failed
   - Analysis: Why it might have failed
   - Direction: Commands to diagnose the issue

2. **Common recovery steps**:
   - Check file permissions: `ls -la <path>`
   - Verify directory exists: `test -d <path> && echo "exists" || echo "missing"`
   - Check disk space: `df -h`
   - Review recent changes: `git status`

3. **Before retrying**:
   - Fix the underlying issue identified in the error analysis
   - Re-run the failed script (it will be idempotent where possible)
   - If a script partially completed, review what changed before continuing

4. **If stuck**:
   - Run validation script to assess current state: `./validate-migration.sh`
   - Check git diff to see what changes were made: `git diff specs/`
   - Consider rolling back: `git checkout specs/` and restart from last known good state

### 6.7 Error Handling and Recovery

All scripts now include `set -e` to exit immediately on error. When a script fails:

1. **Read the error message** - Each script provides:
   - ❌ What failed
   - Analysis: Why it might have failed
   - Direction: Commands to diagnose the issue

2. **Common recovery steps**:
   - Check file permissions: `ls -la <path>`
   - Verify directory exists: `test -d <path> && echo "exists" || echo "missing"`
   - Check disk space: `df -h`
   - Review recent changes: `git status`

3. **Before retrying**:
   - Fix the underlying issue identified in the error analysis
   - Re-run the failed script (it will be idempotent where possible)
   - If a script partially completed, review what changed before continuing

4. **If stuck**:
   - Run validation script to assess current state: `./validate-migration.sh`
   - Check git diff to see what changes were made: `git diff specs/`
   - Consider rolling back: `git checkout specs/` and restart from last known good state

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

## Notes

### Integration Status

This addendum has been **fully integrated** into the main MIGRATION-PLAN.md document:

- ✅ Section 2.2 "Complete Directory Tree" updated with final file destinations
- ✅ Section 6.1-6.4 "Scripts to Create" added with all migration scripts
- ✅ Section 6.5 "Script Execution Order" added with warnings
- ✅ Domain count corrected to 17 folders for analysis/ (including orphan/, i18n/, mongodb-mapping/, permissions/) and 14 folders for wireframes/ (including components/)
- ✅ Wireframe source paths corrected to include full `wireframes/` prefix

### Remaining Tasks

The following sections mentioned in the original addendum are **NOT yet implemented**:

- ❌ Phase structure table (referenced but not created)
- ❌ Features/FR mapping documentation (manual content creation required per Item L)
- ❌ Domain README files (all 14 domains need README.md files)
- ❌ Actual file migrations (this document is a plan only)

---

## Phase 16: i18n Directory Migration

**Source**: `specs/planning/translations/`  
**Target**: `analysis/i18n/`  
**Status**: Ready for execution

### 16.1 Overview

Migrate comprehensive translation documentation from `specs/planning/translations/` to new `analysis/i18n/` directory with enhanced structure while preserving full detail level.

### 16.2 Source Files

| Source File | Content | Size |
|-------------|---------|------|
| `translation-summary.md` | Summary statistics, missing translations, auto-translate suggestions | 159 lines |
| `BATCHED-RECHECK-GUIDE.md` | Complete how-to guide for batched translation rechecks | 268 lines |
| `lookup-translations.sh` | Executable bash script for translation lookup | 98 lines |
| `i18n-keys-*.txt` (8 files) | Unique i18n keys per domain | 466 total keys |
| `lookup-*.csv` (8 files) | Translation status (DE/EN/source/status) per domain | ~1200 lines total |

### 16.3 Target Structure

```
analysis/i18n/
├── README.md (i18n strategy and overview)
├── translation-inventory.md (consolidated from translation-summary.md + all CSV data)
├── hardcoded-strings.md (prioritized list of German strings needing i18n keys)
├── translation-guide.md (naming conventions, gender handling, length considerations - from BATCHED-RECHECK-GUIDE.md)
├── missing-keys.md (gaps in translation coverage - generated from MISSING_EN/MISSING_DE in CSVs)
├── domains/ (per-domain detailed inventories)
│   ├── treatment.md (155 keys)
│   ├── customer.md (111 keys)
│   ├── accounting.md (62 keys)
│   ├── system.md (49 keys)
│   ├── planning.md (57 keys)
│   ├── user-management.md (18 keys)
│   ├── interfaces.md (6 keys)
│   └── academy.md (8 keys)
└── scripts/
    └── lookup-translations.sh (migrated from planning/translations/)
```

### 16.4 Content Preservation

All existing detail will be preserved:

- ✅ All 466 unique i18n keys with German/English translations
- ✅ Source attribution (ApplicationResources vs BaseResources)
- ✅ Missing translation flags (MISSING_EN, MISSING_DE)
- ✅ Coverage statistics per domain (currently 98% DE, 95% EN)
- ✅ Auto-translation suggestions for 22 missing English keys
- ✅ Auto-translation suggestions for 9 missing German keys
- ✅ Complete lookup script functionality
- ✅ Batched recheck workflows and commands
- ✅ Query examples for specific keys
- ✅ CI/CD integration examples

### 16.5 Migration Steps

1. **Create directory structure**
   ```bash
   mkdir -p analysis/i18n/domains analysis/i18n/scripts
   ```

2. **Copy executable script**
   ```bash
   cp specs/planning/translations/lookup-translations.sh analysis/i18n/scripts/
   chmod +x analysis/i18n/scripts/lookup-translations.sh
   ```

3. **Create README.md** with:
   - i18n strategy overview
   - Link to translation-inventory.md
   - Quick start guide for developers
   - Script usage examples

4. **Create translation-inventory.md** by consolidating:
   - Summary statistics table from translation-summary.md
   - All missing translation lists (MISSING_EN, MISSING_DE)
   - Translation sources breakdown
   - Key insights section
   - Query commands

5. **Create domain-specific files** in `domains/`:
   - Extract data from each `lookup-*.csv`
   - Format as markdown tables with key, German, English, source, status
   - Include per-domain coverage statistics

6. **Create hardcoded-strings.md**:
   - List German strings found in analysis files without i18n keys
   - Prioritize by domain and usage frequency
   - Suggest i18n key names following naming conventions

7. **Create translation-guide.md**:
   - Extract workflow from BATCHED-RECHECK-GUIDE.md
   - Document naming conventions (dot notation, camelCase)
   - Gender handling guidelines
   - Translation length considerations for UI

8. **Create missing-keys.md**:
   - Generate from all MISSING_EN and MISSING_DE entries
   - Organize by priority (High/Medium)
   - Include auto-translated suggestions
   - Track resolution status

9. **Update references** in other docs to point to new location

10. **Validate** by running lookup script against new structure

### 16.6 Missing Translations Summary

**Missing English (22 keys)** - High Priority:
- `location.externalId` (JVA/Externe Id)
- `AppointmentState.REQUESTED.action` (Anfragen)
- `action.dateEnd` (Endzeit)
- `invoiceReceiver.councilStorno` (Konsil Storno)
- `invoiceReceiver.shiftStorno` (Bereitschaft Storno)
- `consultation.furtherTreatmentDate` (Folgetermin Datum)
- `button.remove` (Remove - needs DE)

**Missing German (9 keys)** - High Priority:
- `InvoiceReceiver` (needs German)
- `contact.email` (E-Mail)
- `location.phone` (Telefon)
- `medication` (Medikation)
- `login.totp.device` (TOTP-Gerät)
- `login.verifyTOTPCode` (TOTP-Code überprüfen)

### 16.7 Integration with Other Phases

- **After Phase 2** (directory structure): i18n/ directory created under analysis/
- **Before Phase 15** (STRUCTURE.md): Complete migration and update references
- **Parallel to features/ migration**: Translation inventory supports FR documentation

### 16.8 Success Criteria

- [ ] All 466 keys documented in new structure
- [ ] All 8 domain files created with complete CSV data
- [ ] lookup-translations.sh executable and functional
- [ ] Missing translations clearly flagged with priorities
- [ ] Hardcoded strings inventory started
- [ ] Translation guide documented
- [ ] No broken references to old location

**Document Status**: Ready for execution

## Phase 16: i18n Directory Migration

**Source**: `specs/planning/translations/`  
**Target**: `analysis/i18n/`  
**Status**: Ready for execution

### 16.1 Overview

Migrate comprehensive translation documentation from `specs/planning/translations/` to new `analysis/i18n/` directory with enhanced structure while preserving full detail level.

### 16.2 Source Files

| Source File | Content | Size |
|-------------|---------|------|
| `translation-summary.md` | Summary statistics, missing translations, auto-translate suggestions | 159 lines |
| `BATCHED-RECHECK-GUIDE.md` | Complete how-to guide for batched translation rechecks | 268 lines |
| `lookup-translations.sh` | Executable bash script for translation lookup | 98 lines |
| `i18n-keys-*.txt` (8 files) | Unique i18n keys per domain | 466 total keys |
| `lookup-*.csv` (8 files) | Translation status (DE/EN/source/status) per domain | ~1200 lines total |

### 16.3 Target Structure

```
analysis/i18n/
├── README.md (i18n strategy and overview)
├── translation-inventory.md (consolidated from translation-summary.md + all CSV data)
├── hardcoded-strings.md (prioritized list of German strings needing i18n keys)
├── translation-guide.md (naming conventions, gender handling, length considerations - from BATCHED-RECHECK-GUIDE.md)
├── missing-keys.md (gaps in translation coverage - generated from MISSING_EN/MISSING_DE in CSVs)
├── domains/ (per-domain detailed inventories)
│   ├── treatment.md (155 keys)
│   ├── customer.md (111 keys)
│   ├── accounting.md (62 keys)
│   ├── system.md (49 keys)
│   ├── planning.md (57 keys)
│   ├── user-management.md (18 keys)
│   ├── interfaces.md (6 keys)
│   └── academy.md (8 keys)
└── scripts/
    └── lookup-translations.sh (migrated from planning/translations/)
```

### 16.4 Content Preservation

All existing detail will be preserved:

- ✅ All 466 unique i18n keys with German/English translations
- ✅ Source attribution (ApplicationResources vs BaseResources)
- ✅ Missing translation flags (MISSING_EN, MISSING_DE)
- ✅ Coverage statistics per domain (currently 98% DE, 95% EN)
- ✅ Auto-translation suggestions for 22 missing English keys
- ✅ Auto-translation suggestions for 9 missing German keys
- ✅ Complete lookup script functionality
- ✅ Batched recheck workflows and commands
- ✅ Query examples for specific keys
- ✅ CI/CD integration examples

### 16.5 Migration Steps

1. **Create directory structure**
   ```bash
   mkdir -p analysis/i18n/domains analysis/i18n/scripts
   ```

2. **Copy executable script**
   ```bash
   cp specs/planning/translations/lookup-translations.sh analysis/i18n/scripts/
   chmod +x analysis/i18n/scripts/lookup-translations.sh
   ```

3. **Create README.md** with:
   - i18n strategy overview
   - Link to translation-inventory.md
   - Quick start guide for developers
   - Script usage examples

4. **Create translation-inventory.md** by consolidating:
   - Summary statistics table from translation-summary.md
   - All missing translation lists (MISSING_EN, MISSING_DE)
   - Translation sources breakdown
   - Key insights section
   - Query commands

5. **Create domain-specific files** in `domains/`:
   - Extract data from each `lookup-*.csv`
   - Format as markdown tables with key, German, English, source, status
   - Include per-domain coverage statistics

6. **Create hardcoded-strings.md**:
   - List German strings found in analysis files without i18n keys
   - Prioritize by domain and usage frequency
   - Suggest i18n key names following naming conventions

7. **Create translation-guide.md**:
   - Extract workflow from BATCHED-RECHECK-GUIDE.md
   - Document naming conventions (dot notation, camelCase)
   - Gender handling guidelines
   - Translation length considerations for UI

8. **Create missing-keys.md**:
   - Generate from all MISSING_EN and MISSING_DE entries
   - Organize by priority (High/Medium)
   - Include auto-translated suggestions
   - Track resolution status

9. **Update references** in other docs to point to new location

10. **Validate** by running lookup script against new structure

### 16.6 Missing Translations Summary

**Missing English (22 keys)** - High Priority:
- `location.externalId` (JVA/Externe Id)
- `AppointmentState.REQUESTED.action` (Anfragen)
- `action.dateEnd` (Endzeit)
- `invoiceReceiver.councilStorno` (Konsil Storno)
- `invoiceReceiver.shiftStorno` (Bereitschaft Storno)
- `consultation.furtherTreatmentDate` (Folgetermin Datum)
- `button.remove` (Remove - needs DE)

**Missing German (9 keys)** - High Priority:
- `InvoiceReceiver` (needs German)
- `contact.email` (E-Mail)
- `location.phone` (Telefon)
- `medication` (Medikation)
- `login.totp.device` (TOTP-Gerät)
- `login.verifyTOTPCode` (TOTP-Code überprüfen)

### 16.7 Integration with Other Phases

- **After Phase 2** (directory structure): i18n/ directory created under analysis/
- **Before Phase 15** (STRUCTURE.md): Complete migration and update references
- **Parallel to features/ migration**: Translation inventory supports FR documentation

### 16.8 Success Criteria

- [ ] All 466 keys documented in new structure
- [ ] All 8 domain files created with complete CSV data
- [ ] lookup-translations.sh executable and functional
- [ ] Missing translations clearly flagged with priorities
- [ ] Hardcoded strings inventory started
- [ ] Translation guide documented
- [ ] No broken references to old location

**Document Status**: Ready for execution

**Document Status**: Ready for execution
