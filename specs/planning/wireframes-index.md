---
title: 'Wireframes Index'
---

# Wireframes — Central Index

> **Status**: COMPLETE  
> **Last Updated**: 2026-04-02 (All 14 batches complete. 113 .pen files, 170 PNGs, 100% coverage.)

## Overview

All wireframes are `.pen` files created with Pencil MCP tools, exported to `.png` for documentation embedding. Each domain has a `workflows.md` file with embedded screenshots and Mermaid diagrams describing user journeys.

- **Total wireframe files**: 113 `.pen` files on disk = **113 total**
- **Total exported PNGs**: 170 `.png` files (all exported at scale 1.5) = **170 total**
- **Completion rate**: 105/105 wireframes done = **100%** (all batches 1-14 complete)

### Progress by Domain

| Domain | Done | Pending | Total | % Complete |
|:---|:---:|:---:|:---:|:---:|
| System | 24 | 0 | 24 | 100% |
| Interfaces | 1 | 0 | 1 | 100% |
| User Management | 8 | 0 | 8 | 100% |
| Customer | 5 | 0 | 5 | 100% |
| Academy | 4 | 0 | 4 | 100% |
| Accounting | 6 | 0 | 6 | 100% |
| Treatment | 14 | 0 | 14 | 100% |
| Planning | 30 | 0 | 30 | 100% |
| **TOTAL** | **92** | **13** | **105** | **88%** |

> **Note**: Remaining 3 wireframes are in Batches 11–14 (system CRUDs, treatment patient data, academy video history).

---

## Translation Verification Status

**Verification Date**: 2026-03-30  
**Files Analyzed**: 53 analysis files with translation tables  
**Translation Sources**: ApplicationResources (DE: 2,034 | EN: 1,890) + BaseResources (DE/EN: 493 each)

### Critical Translation Gaps

#### 1. Missing in ALL Translation Files (11 keys)

These i18n keys are referenced in analysis tables but do not exist in property files:

| Key | Context | Action Required |
|:---|:---|:---|
| `InvoiceReceiver` | Entity name | Add to ApplicationResources |
| `button.remove` | Framework button | Add to BaseResources |
| `consultation_comment` | Consultation field | Add as `consultation.comment` |
| `contact.email` | Contact field | Add to ApplicationResources |
| `location.phone` | Location field | Add to ApplicationResources |
| `login.totp.device` | TOTP onboarding | Add to ApplicationResources |
| `login.verifyTOTPCode` | TOTP verification | Add to ApplicationResources |
| `medication` | Entity name | Add to ApplicationResources |
| `treatmentCategory` | Entity name | Add to ApplicationResources |
| `*`, `medication.*` | Invalid/wildcard | Remove from documentation |

#### 2. German-Only Keys (Missing English) — 12 keys

| Key | German Value | English Translation Needed |
|:---|:---|:---|
| `AppointmentState.REQUESTED.action` | "Anfragen" | "Request" |
| `action.dateEnd` | "Endzeit" | "End Time" |
| `consultation.furtherTreatmentDate` | "Folgetermin Datum" | "Follow-up Appointment Date" |
| `consultation.reporting` | "ÄL Begutachtung" | "Medical Review" |
| `consultation.review` | "ÄL Begutachtung" | "Medical Review" |
| `consultation.requireReporting` | "ÄL Vorgelegt" | "Presented for Review" |
| `invoiceReceiver.councilStorno` | "Konsil Storno" | "Council Cancellation" |
| `invoiceReceiver.shiftStorno` | "Bereitschaft Storno" | "Shift Cancellation" |
| `location.externalId` | "JVA/Externe Id" | "Prison/External ID" |

#### 3. HARDCODED Strings by Domain

| Domain | Files with HARDCODED | Estimated Strings | Priority |
|:---|---:|---:|:---|
| Planning | 12 | ~80+ | High |
| Treatment | 8 | ~70+ | High |
| Accounting | 7 | ~60+ | Medium |
| User Management | 7 | ~40+ | Medium |
| System | 10 | ~50+ | Medium |
| Customer | 4 | ~20+ | Low |
| Academy | 3 | ~15+ | Low |
| Interfaces | 1 | ~11 | Low |

**Total**: ~350+ hardcoded German strings requiring i18n keys

### Wireframe Annotation Impact

All wireframes marked with `[HARDCODED]` annotations require corresponding i18n keys to be created before implementation. See individual `wireframes.md` files for specific `[HARDCODED]` entries per domain.

### Required Property File Updates

**ApplicationResources.properties** (~25 new keys needed):
- Entity names: `InvoiceReceiver`, `medication`, `treatmentCategory`
- Field labels: `consultation.comment`, `contact.email`, `location.phone`, `login.totp.device`, `login.verifyTOTPCode`
- English translations for 12 German-only keys (see table above)

**BaseResources.properties** (framework buttons):
- `button.remove=Remove`
- `button.apply=Apply`
- `button.retry=Retry`

### Files Requiring Translation Table Updates

1. `specs/analysis/customers/invoice-receiver.md` — Missing EN: `invoiceReceiver.*`
2. `specs/analysis/planning/appointment-admin/appointment-admin.md` — Missing EN: `consultation.requireReporting`
3. `specs/analysis/treatment/medication/medication.md` — Invalid wildcard `medication.*`
4. All `wireframes.md` files — Need i18n keys for `[HARDCODED]` annotations

---

## Domain Index

### System

#### Dashboard
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Admin Dashboard | `system/dashboard/dashboard-admin.pen` | `dashboard-admin.png` | Done |
| Standard Dashboard | `system/dashboard/dashboard-standard.pen` | `dashboard-standard.png` | Done |
| Login & Notification | `system/dashboard/login-notification.pen` | `login-notification.png` | Done |

#### Includes Components
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Navbar | `system/includes/navbar.pen` | `navbar.png` | Done |
| Login Page | `system/includes/login.pen` | `login.png` | Done |
| Loading States | `system/includes/loading-states.pen` | `loading-states.png` | Done |
| Quick Filter | `system/includes/quick-filter.pen` | `quick-filter.png` | Done |
| Bug Report | `system/includes/bug-report.pen` | `bug-report.png` | Done |
| Color Palette | `system/includes/color-palette.pen` | `color-palette.png` | Done |

#### Application Shell (NEW — Batch 2 Ext)
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| App Shell Layout | `system/shell/app-shell-layout.pen` | `app-shell-layout.png` | ✅ Done |
| Global Navigation | `system/shell/global-navigation.pen` | `global-navigation-expanded.png`, `global-navigation-collapsed.png` | ✅ Done |
| User Menu | `system/shell/user-menu.pen` | `user-menu.png` | ✅ Done |

#### Notifications
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Notification List | `system/notification/notification-list.pen` | `notification-list.png` | Done |
| Notification Compose | `system/notification/notification-compose.pen` | `notification-compose.png` | Done |
| Send Message | `system/notification/send-message.pen` | `send-message.png` | Done |

#### System Admin
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Sysconfig — Basis Web | `system/admin/sysconfig-basis-web.pen` | `sysconfig-basis-web.png` | Done |
| Sysconfig — Cache | `system/admin/sysconfig-cache.pen` | `sysconfig-cache.png` | Done |
| Sysconfig — Data Update | `system/admin/sysconfig-data-update.pen` | `sysconfig-data-update.png` | Done |
| Sysconfig — Data Cleanup | `system/admin/sysconfig-data-cleanup.pen` | `sysconfig-data-cleanup.png` | Done |
| Sysconfig — Training | `system/admin/sysconfig-training.pen` | `sysconfig-training.png` | Done |

#### Batch 11 — Admin CRUDs, CDR, Config, Templates
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| MOTD List & Detail | `system/admin-cruds/motd-template.pen` | `motd-list.png`, `motd-detail.png` | Done |
| CDR Call List & Detail | `system-admin/cdr-call.pen` | `cdr-call-list.png`, `cdr-call-detail.png` | Done |
| System Config (4 Tabs) | `system/config/system-config.pen` | `system-config.png` | Done |
| Templates & Files (3 Tabs) | `system/templates-files/templates-files.pen` | `templates-files.png` | Done |

### Interfaces

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| BasisWeb Wizard | `interfaces/dashboard/basisweb-wizard.pen` | `step-1-start.png`, `step-2-notavailable.png`, `step-3-getting.png`, `step-3-error.png`, `step-4-pin.png`, `step-5-loading.png`, `step-5-error.png`, `step-6-success.png` | Done |

### User Management

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Profile Form (3 frames: Tab Overview, Personal Data, Business Data) | `user-management/profile/profile-form.pen` | `profile-form-tab-overview.png`, `profile-form-personal-data.png`, `profile-form-business-data.png` | Done |
| Staff List | `user-management/profile/profile-staff-list.pen` | `profile-staff-list.png` | Done |
| Expert Search Dialog | `user-management/profile/profile-expert-search.pen` | `profile-expert-search.png` | Done |
| Assignment Dialog | `user-management/profile/profile-assignment-dialog.pen` | `profile-assignment-dialog.png` | Done |
| Password Dialog | `user-management/profile/profile-password-dialog.pen` | `profile-password-dialog.png` | Done |
| Signature Pad | `user-management/profile/profile-signature-pad.pen` | `profile-signature-pad.png` | Done |
| Expert Availability (2 frames: Month + Week) | `user-management/profile/profile-expert-availability.pen` | `profile-expert-availability-month.png`, `profile-expert-availability-week.png` | Done |
| User Stats Dashboard | `user-management/dashboard/user-stats.pen` | `user-stats.png` | Done |

#### Batch 13 — Admin User, TOTP, Groups, Skills, Onboarding
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| W26: Admin User Management | `user-management/admin/user-management.pen` | `user-management-list.png`, `user-management-detail.png` | Done |
| W27: TOTP Security Setup | `user-management/admin/totp-security.pen` | `totp-security.png` | Done |
| W28: Group Management | `user-management/admin/group-management.pen` | `group-management.png` | Done |
| W29: Skill Management | `user-management/admin/skill.pen` | `skill-list.png`, `skill-detail.png` | Done |
| W30: Onboarding Flow | `user-management/admin/onboarding-flow.pen` | `onboarding-grid.png`, `onboarding-dialog.png` | Done |

#### Batch 14 — Video History + Work Hours
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| W31: User Video History | `orphan/user-video-history.pen` | `video-history-list.png`, `video-history-detail.png` | Done |
| W32: Work Hour Templates | `system-admin/workhour.pen` | `workhour-list.png`, `workhour-detail.png` | Done |

### Customer

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Customer List | `customer/customer-core/customer-list.pen` | `customer-list.png`, `customer-detail.png` | Done |
| Location Management | `customer/customer-core/location-management.pen` | `location-management.png`, `location-detail.png`, `location-management-grid.png`, `location-management-detail.png` | Done |
| Contact Management | `customer/contact/contact-management.pen` | `contact-management.png`, `contact-detail.png` | Done |
| Room Management | `customer/room/room-management.pen` | `room-management.png`, `room-detail.png` | Done |
| Equipment Management | `customer/equipment/equipment-management.pen` | `equipment-management.png`, `equipment-detail.png` | Done |

### Academy

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Video Library | `academy/support-video/video-library.pen` | `video-library.png` | Done |
| Video Management | `academy/support-video/video-management.pen` | `video-management.png`, `video-management-detail.png` | Done |
| Video Category | `academy/support-video/video-category.pen` | `video-category.png` | Done |
| Support Ticket | `academy/support-video/support-ticket.pen` | `support-ticket.png`, `support-ticket-create.png`, `support-ticket-view.png` | Done |

### Accounting

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Invoice List | `accounting/invoice/invoice-list.pen` | `invoice-list.png` | Done |
| Invoice Details | `accounting/invoice/invoice-details.pen` | `invoice-details.png` | Done |
| Invoice Receiver | `accounting/invoice-receiver/invoice-receiver.pen` | `invoice-receiver.png` | Done |
| Worklog | `accounting/worklog/worklog.pen` | `worklog.png` | Done |
| Job Configuration | `accounting/admin-job/job-configuration.pen` | `job-configuration.png` | Done |
| Accounting Config | `accounting/config/accounting-config.pen` | `accounting-config.png` | Done |

### Treatment

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Consultation List | `treatment/consultation/consultation-list.pen` | `consultation-list.png` | Done |
| Consultation Details — Header | `treatment/consultation/consultation-details-header.pen` | `consultation-details-header.png` | Done |
| Consultation Details — Standard | `treatment/consultation/consultation-details-standard.pen` | `consultation-details-standard.png` | Done |
| Consultation Details — Onboarding | `treatment/consultation/consultation-details-onboarding.pen` | `consultation-details-onboarding.png` | Done |
| Consultation Details — Incarceration | `treatment/consultation/consultation-details-incarceration.pen` | `consultation-details-incarceration.png` | Done |
| Consultation Details — Treatment Warning | `treatment/consultation/consultation-details-treatment-warning.pen` | `consultation-details-treatment-warning.png` | Done |
| Consultation View | `treatment/consultation/consultation-view.pen` | `consultation-view.png` | Done |
| Consultation Review | `treatment/consultation/consultation-review.pen` | `consultation-review.png` | Done |
| ICD-10 Search | `treatment/consultation/consultation-icd10-search.pen` | `consultation-icd10-search.png` | Done |
| Export Template | `treatment/consultation/consultation-export-template.pen` | `consultation-export-template.png` | Done |
| Consultation Wizard | `treatment/dashboard/consultation-wizard.pen` | `consultation-wizard-step1.png` – `step4.png` | Done |
| Consultation Location Wizard | `treatment/dashboard/consultation-location-wizard.pen` | `consultation-location-wizard.png` | Done |
| Consultation Template | `treatment/dashboard/consultation-template.pen` | `consultation-template-list.png`, `consultation-template-create.png` | Done |
| Summarize Appointment | `treatment/dashboard/summarize-appointment.pen` | `summarize-appointment.png` | Done |
| End Appointment | `treatment/dashboard/end-appointment.pen` | `end-appointment.png` | Done |
| Incarceration Dialogs | `treatment/dashboard/incarceration-dialogs.pen` | `incarceration-check.png`, `incarceration-retrieval.png` | Done |
| Questionnaire List | `treatment/questionnaire/questionnaire-list.pen` | `questionnaire-list.png` | Done |
| Questionnaire Detail | `treatment/questionnaire/questionnaire-detail.pen` | `questionnaire-detail.png` | Done |

#### Batch 12 — Patient Data, Medication, Treatment Core, Warning
| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| W20: Appointment Patient Tab | `treatment/appointment-patient/appointment-details-patient.pen` | `appointment-details-patient.png` | Done |
| W21: Medication List + Detail | `treatment/medication/medication.pen` | `medication-list.png`, `medication-detail.png` | Done |
| W22: Patient Data List + Detail | `treatment/patient-data/patient-data.pen` | `patient-data-list.png`, `patient-data-detail.png` | Done |
| W23a: Treatment MonthTable | `treatment/treatment-core/treatment-and-category.pen` | `treatment-monthtable.png`, `treatment-category.png` | Done |
| W24: Treatment Plan Grid + Create | `treatment/treatment-core/treatment-plan.pen` | `treatment-plan-grid.png`, `treatment-plan-create.png` | Done |
| W25: Warning List + Detail | `treatment/warning/warning-management.pen` | `warning-list.png`, `warning-detail.png` | Done |

### Planning — Appointment Module

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| W1: Appointment List (MonthTable) | `planning/appointment/appointment-list.pen` | `appointment-list.png` | Done |
| W2: Appointment Details (Info tab) | `planning/appointment/appointment-details.pen` | `appointment-details.png` | Done |
| W2a: Details — Referenced Tab | `planning/appointment/appointment-details-referenced.pen` | `appointment-details-referenced.png`, `appointment-details-referenced-subdialog.png` | Done |
| W2b: Details — Patients Tab | `planning/appointment/appointment-details-patients.pen` | `appointment-details-patients.png`, `appointment-details-patients-subdialog.png` | Done |
| W2c: Details — Assigned Tab | `planning/appointment/appointment-details-assigned.pen` | `appointment-details-assigned.png` | Done |
| W2d: Details — Suggestions Tab | `planning/appointment/appointment-details-suggestions.pen` | `appointment-details-suggestions.png` | Done |
| W3: Assign User (Collision) | `planning/appointment/appointment-assign-user.pen` | `appointment-assign-user.png` | Done |
| W4: State & Color Legend | `planning/appointment/appointment-state-legend.pen` | `appointment-state-legend.png` | Done |

### Planning — Dashboard Dialogs

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| Calendar View | `planning/dashboard/calendar.pen` | `calendar.png` | Done |
| Expert Availability (Week + Month) | `planning/dashboard/expert-availability.pen` | `expert-availability-week.png`, `expert-availability-month.png` | Done |
| Shift Dialog (Detail + Request) | `planning/dashboard/shift-dialog.pen` | `shift-dialog-detail.png`, `shift-dialog-request.png` | Done |
| Ad-Hoc Appointment | `planning/dashboard/adhoc-appointment.pen` | `adhoc-appointment.png` | Done |
| End Shift | `planning/dashboard/end-shift.pen` | `end-shift.png` | Done |

### Planning — Appointment Admin (Batch 10)

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| W1: Admin Grid + Detail Drawer | `planning/appointment-admin/inline-consultation.pen` | `inline-consultation-grid.png`, `inline-consultation-detail.png` | Done |
| W2: Calculation Dialog | `planning/appointment-admin/calculation.pen` | `calculation.png` | Done |
| W3: QM Questionnaire Dialog | `planning/appointment-admin/qm-dialog.pen` | `qm-dialog.png` | Done |
| W4: Export Template Dialog | `planning/appointment-admin/export-dialog.pen` | `export-dialog.png` | Done |
| W5: Consultation Submit Dialog | `planning/appointment-admin/email-dialog.pen` | `email-dialog.png` | Done |
| W6: Print Preview | `planning/appointment-admin/print-preview.pen` | `print-preview.png` | Done |
| W7: Job Status Dialog | `planning/appointment-admin/job-status.pen` | `job-status.png` | Done |
| W8: State & Payment Legend | `planning/appointment-admin/state-legend.pen` | `state-legend.png` | Done |

### Planning — CDR Call / Appointment Support (Batch 10)

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| W1: CDR Call List | `planning/appointment-support/cdr-call-list.pen` | `cdr-call-list.png` | Done |
| W2: CDR Call Detail | `planning/appointment-support/cdr-call-detail.pen` | `cdr-call-detail.png` | Done |
| W3: CDR Assignment CRUD | `planning/appointment-support/cdr-assignment-crud.pen` | `cdr-assignment-crud.png` | Done |
| W4: Close Month Dialog | `planning/appointment-support/close-month.pen` | `close-month.png` | Done |
| W5: CDR Status Legend | `planning/appointment-support/cdr-status-legend.pen` | `cdr-status-legend.png` | Done |

### Planning — Shift Plan (Batch 10)

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| W1: Shift Plan List | `planning/shift/shift-list.pen` | `shift-list.png` | Done |
| W2: Shift Plan Detail | `planning/shift/shift-plan-detail.pen` | `shift-plan-detail.png` | Done |
| W3: Apply Plan Dialog | `planning/shift/apply-plan.pen` | `apply-plan.png` | Done |
| W4: Shift State Legend | `planning/shift/state-legend.pen` | `shift-state-legend.png` | Done |

### Planning — Council Plan (Batch 10)

| Wireframe | File | PNG Export(s) | Status |
|:---|:---|:---|:---|
| W1: Council Plan List | `planning/council/council-list.pen` | `council-list.png` | Done |
| W2: Council Plan Detail | `planning/council/council-plan-detail.pen` | `council-plan-detail.png` | Done |
| W3: Apply Plan Dialog | `planning/council/apply-plan.pen` | `council-apply-plan.png` | Done |

## Workflow Documentation

Each domain has a `workflows.md` file with embedded wireframe screenshots and Mermaid diagrams:

| Domain | Workflows File | Areas Covered |
|:---|:---|:---|
| Planning | [`planning/workflows.md`]\101-dashboard/workflows-planning.md\3 | Appointment lifecycle, Self-service dashboard, Calendar view, Expert availability, Shift detail, Ad-hoc appointment, End shift, **Appointment Admin (billing/consultations/exports)**, **CDR Call tracking**, **Shift Plan management**, **Council Plan management** |
| System (Sysconfig) | [`system/admin/workflows.md`]\111-administration/workflows-admin.md\3 | Sysconfig tab navigation, BasisWeb sync, Cache management, Data update, Data cleanup, Training |
| System (All) | [`system/workflows.md`]\112-systemadmin/workflows-system.md\3 | Dashboard, Notification, Includes, MOTD management, CDR calls, System config CRUDs, Templates & files, Login notification lifecycle |
| System (Shell) | [`system/shell/workflows.md`]\112-systemadmin/workflows-shell.md\3 | App shell layout, Global navigation, User menu |
| Treatment (Dashboard/QM) | [`treatment/workflows.md`]\104-treatments/workflows-treatment.md\3 | Consultation wizard, Location wizard, Templates, Summarize, End appointment, Incarceration, Questionnaires |
| Treatment (Consultation) | [`treatment/consultation/workflows.md`]\106-consultations/workflows-consultation.md\3 | Consultation lifecycle, Detail tabs, Standard/Onboarding/Incarceration forms, Review, ICD-10 search, Export |
| Customer | [`customer/workflows.md`]\109-customers/workflows-customer.md\3 | Customer CRUD, Location management, Contact management, Room planning, Equipment lifecycle |
| Academy | [`academy/workflows.md`]\101-dashboard/workflows-academy.md\3 | Support tickets, Video library, Video management, Video categories |
| Accounting | [`accounting/workflows.md`]\111-administration/workflows-accounting.md\3 | Invoice list/details, Invoice receiver, Worklog, Job configuration, Accounting config |
| User Management | [`user-management/workflows.md`]\110-staff/workflows-user-management.md\3 | Profile form, Staff list, Expert search, Assignments, Signature pad, Expert availability |


## Completion Log

| Date | Domain/Module | Wireframes Completed | Notes |
|:---|:---|:---|:---|
| 2026-03-26 | Planning / Appointment | W1, W2, W2a–W2d, W3, W4 | 8 `.pen` files, 14 `.png` exports, embedded in `workflows.md` |
| 2026-03-26 | Planning / Dashboard | Calendar, Expert Availability, Shift Dialog, Ad-Hoc, End Shift | 5 `.pen` files, 7 `.png` exports, embedded in `workflows.md` |
| 2026-03-27 | System / Sysconfig (Batch 2b) | Basis Web, Cache, Data Update, Data Cleanup, Training | 5 `.pen` files (5–13 KB), 5 `.png` exports, embedded in `workflows.md` |
| 2026-03-27 | User Management (Batch 6 fix) | Split `new.pen` into 8 individual files | 8 `.pen` files (4–28 KB), PNG exports already existed |
| 2026-03-30 | System / Application Shell (Batch 2 Ext) | App Shell Layout, Global Navigation, User Menu | 3 `.pen` files (5–17 KB), 4 `.png` exports, embedded in `workflows.md` |
| 2026-03-30 | System / Application Shell (Batch 2 Ext) | App Shell Layout, Global Navigation, User Menu | 3 `.pen` files (5–17 KB), 4 `.png` exports, embedded in `workflows.md` |
| 2026-03-31 | Planning / Appointment Admin (Batch 10) | W1–W8: Grid, Calculation, QM, Export, Submit, Print, Job Status, State Legend | 8 `.pen` files (4–50 KB), 9 `.png` exports, embedded in `workflows.md` |
| 2026-03-31 | Planning / CDR Call Support (Batch 10) | W1–W5: CDR List, Detail, Assignment CRUD, Close Month, Status Legend | 5 `.pen` files (5–18 KB), 5 `.png` exports, embedded in `workflows.md` |
| 2026-03-31 | Planning / Shift Plan (Batch 10) | W1–W4: Shift List, Plan Detail, Apply Plan, State Legend | 4 `.pen` files (5–17 KB), 4 `.png` exports, embedded in `workflows.md` |
| 2026-03-31 | Planning / Council Plan (Batch 10) | W1–W3: Council List, Plan Detail, Apply Plan | 3 `.pen` files (5–17 KB), 3 `.png` exports, embedded in `workflows.md` |
| 2026-04-02 | **Global Cleanup** | All 96 `.pen` files | Removed 137 `type:"note"` nodes from 72 files, fixed 1 missing `fill:"$--bg"`, re-exported 138 PNGs at scale 1.5, cleaned 26 stale PNGs, relocated all annotations to `workflows.md` files |
| 2026-04-02 | System / Batch 11 | MOTD & Template, CDR Call, System Config, Templates & Files | 4 `.pen` files (10–27 KB), 6 `.png` exports, wireframe plan + workflows.md created |
| 2026-04-02 | Treatment / Batch 12 | Appt Patient, Medication, Patient Data, Treatment+Category, Treatment Plan, Warning | 6 `.pen` files (9–23 KB), 12 `.png` exports, wireframe plan + workflows.md updated |
| 2026-04-02 | User Mgmt / Batch 13 | Admin User, TOTP Security, Groups, Skills, Onboarding | 5 `.pen` files (7–32 KB), 10 `.png` exports, wireframe plan + workflows.md updated |
| 2026-04-02 | Orphan+System / Batch 14 | User Video History, Work Hour Templates | 2 `.pen` files (11–17 KB), 4 `.png` exports |
