---
title: 'Analysis Wireframes Mapping'
---

# Analysis → Wireframes Mapping

This table maps each analysis document in `specs/analysis/` to its brownfield source in `brownfield/web/src/main/webapp/` and its corresponding wireframe artifact(s) in `specs/wireframes/`.

Legend:
- **`.pen`** — Pencil wireframe source file
- **`.png`** — Exported wireframe image(s)
- **`workflows.md`** — Mermaid workflow diagram
- *(no wireframe)* — Analysis doc has no corresponding wireframe yet
- All brownfield paths are relative to `brownfield/web/src/main/webapp/`

---

## Academy

| Analysis File | Brownfield Source | Wireframe File(s) |
|---|---|---|
| `academy/support-video/support-and-video.md` | `supportTicket/`, `video/`, `videoLibrary/`, `videoCategory/` | `academy/support-video/support-ticket.pen` (.png), `video-category.pen` (.png), `video-library.pen` (.png), `video-management.pen` (.png) |
| `academy/video-history/user-video-history.md` | `userVideoHistory/` | *(no wireframe)* |

## Accounting

| Analysis File | Brownfield Source | Wireframe File(s) |
|---|---|---|
| `accounting/config/accounting-config.md` | `stornoGroup/`, `jobPriceList/`, `product/`, `closedMonth/`, `expertWorkMonthly/` | `accounting/config/accounting-config.pen` (.png) |
| `accounting/invoice/invoice-list.md` | `invoice/index.htmlm`, `invoice/index.js`, `invoice/messages.i18n.js` | `accounting/invoice/invoice-list.pen` (.png) |
| `accounting/invoice/invoice-details.md` | `invoice/invoiceDetails.html`, `invoice/invoiceDetails.js`, `invoice/invoiceDlg.js`, `invoice/emailDialog.js`, `invoice/tpl/print.mustache`, `invoice/messages.i18n.js` | `accounting/invoice/invoice-details.pen` (.png) |
| `accounting/invoice-receiver/invoice-receiver.md` | `invoiceReceiver/` | `accounting/invoice-receiver/invoice-receiver.pen` (.png) |
| `accounting/admin-job/job-configuration.md` | `admin/job.htmlm`, `admin/job.js` | `accounting/admin-job/job-configuration.pen` (.png) |
| `accounting/admin-workhour/workhour.md` | `admin/workHour.htmlm`, `admin/workHour.js` | *(no wireframe)* |
| `accounting/worklog/worklog.md` | `worklog/` | `accounting/worklog/worklog.pen` (.png) |

## Customer

| Analysis File | Brownfield Source | Wireframe File(s) |
|---|---|---|
| `customer/customer-core/customer-list-detail.md` | `customer/index.htmlm`, `customer/index.js`, `customer/messages.i18n.js`, `contact/messages.i18n.js`, `customer/zipCodeLookup.js` | `customer/customer-core/customer-list.pen` (.png) |
| `customer/customer-core/location-and-users.md` | `customer/location.htmlm`, `customer/location.js`, `customer/locationCreate.mustache`, `customer/locationCreate.js`, `customer/user.htmlm`, `customer/user.js`, `customer/zipCodeLookup.js`, `admin/password.mustache`, `admin/password.js`, `customer/messages.i18n.js`, `profile/profile.js` | `customer/customer-core/location-management.pen` (.png) |
| `customer/contact/contact.md` | `contact/` | `customer/contact/contact-management.pen` (.png) |
| `customer/equipment/equipment.md` | `equipment/` | `customer/equipment/equipment-management.pen` (.png) |
| `customer/room/room.md` | `room/` | `customer/room/room-management.pen` (.png) |

## Interfaces

| Analysis File | Brownfield Source | Wireframe File(s) |
|---|---|---|
| `interfaces/dashboard/06-basisweb-wizard.md` | `dash/basisWebWizard.html`, `dash/basisWebWizard.js` | `interfaces/dashboard/basisweb-wizard.pen` (.png) |

## Planning

| Analysis File | Brownfield Source | Wireframe File(s) |
|---|---|---|
| `planning/appointment/appointment-list.md` | `appointment/index.htmlm`, `appointment/index.js` | `planning/appointment/appointment-list.pen` (.png) |
| `planning/appointment/appointment-details-scheduling.md` | `appointment/details.html`, `appointment/details.js` | `planning/appointment/appointment-details.pen` (.png), `appointment-details-assigned.pen` (.png), `appointment-details-patients.pen` (.png), `appointment-details-referenced.pen` (.png), `appointment-details-suggestions.pen` (.png), `appointment-state-legend.pen` (.png) |
| `planning/appointment/appointment-assign-user.md` | `appointment/assignUser.html`, `appointment/assignUser.js` | `planning/appointment/appointment-assign-user.pen` (.png) |
| `planning/appointment-admin/appointment-admin.md` | `appointmentAdmin/index.htmlm`, `appointmentAdmin/index.js`, `appointmentAdmin/messages.i18n.js` | `planning/appointment-admin/inline-consultation.pen` (.png), `calculation.pen` (.png), `qm-dialog.pen` (.png), `export-dialog.pen` (.png), `email-dialog.pen` (.png), `print-preview.pen` (.png), `job-status.pen` (.png), `state-legend.pen` (.png) |
| `planning/appointment-support/appointment-plan.md` | `appointmentPlan/`, `CdrCall/`, `CdrCallAssignment/` | `planning/appointment-support/cdr-call-list.pen` (.png), `cdr-call-detail.pen` (.png), `cdr-assignment-crud.pen` (.png), `close-month.pen` (.png), `cdr-status-legend.pen` (.png) |
| `planning/council/council-and-plan.md` | `council/`, `councilPlan/` | `planning/council/council-list.pen` (.png), `council-plan-detail.pen` (.png), `apply-plan.pen` (.png) |
| `planning/shift/shift-and-plan.md` | `shift/`, `shiftPlan/` | `planning/shift/shift-list.pen` (.png), `shift-plan-detail.pen` (.png), `apply-plan.pen` (.png), `state-legend.pen` (.png) |
| `planning/dashboard/dashboard-selfservice.md` | `dash/index.htmlm` (lines 305–484), `dash/dash.js` | `planning/dashboard/calendar.pen` (.png), `planning/dashboard/expert-availability.pen` (.png) |
| `planning/dashboard/dialogs-planning.md` | `dash/index.htmlm` (lines 624–896), `dash/dash.js` | `planning/dashboard/adhoc-appointment.pen` (.png), `end-shift.pen` (.png) |
| `planning/dashboard/08-shift-dialog.md` | `dash/` (shiftDlg, requestActionDlg) | `planning/dashboard/shift-dialog.pen` (.png) |
| `planning/dashboard/09-calendar-view.md` | `dash/calendar.htmlm`, `dash/calendar.js`, `dash/dash.css`, `dash/messages.i18n.js` | `planning/dashboard/calendar.pen` (.png) |
| `planning/dashboard/10-week-view.md` | `dash/weekView.htmlm`, `dash/weekView.js`, `profile/expertWeek.js` | `planning/dashboard/expert-availability.pen` (.png) |
| `planning/dashboard/11-month-view.md` | `dash/` (monthView.htmlm, expertdaysMonthTable) | `planning/dashboard/expert-availability.pen` (.png) |

## System

| Analysis File | Brownfield Source | Wireframe File(s) |
|---|---|---|
| `system/dashboard/dashboard-main.md` | `dash/index.htmlm`, `dash/dash.js` | `system/dashboard/dashboard-standard.pen` (.png) |
| `system/dashboard/dashboard-admin.md` | `dash/index.htmlm` (lines 487–618), `dash/dash.js` | `system/dashboard/dashboard-admin.pen` (.png) |
| `system/dashboard/dialogs-system.md` | `dash/index.htmlm` (lines 624–896), `dash/dash.js` | `system/dashboard/login-notification.pen` (.png) |
| `system/admin-system/admin-landing.md` | `admin/index.htmlm`, `admin/sysadmin.htmlm`, `admin/nav.js`, `admin/changelog.htmlm`, `admin/group.htmlm`, `admin/sysconfig.htmlm`, `admin/import.htmlm`, `admin/messages.i18n.js` | `system/admin/sysconfig-basis-web.pen` (.png), `sysconfig-cache.pen` (.png), `sysconfig-data-cleanup.pen` (.png), `sysconfig-data-update.pen` (.png), `sysconfig-training.pen` (.png) |
| `system/admin-system/sysconfig-import.md` | `admin/sysconfig.htmlm`, `admin/sysconfig.js`, `admin/import.htmlm`, `admin/import.js`, `admin/group.htmlm`, `admin/group.js`, `admin/sysadmin.htmlm` | `system/admin/sysconfig-data-update.pen` (.png) |
| `system/admin-cruds/motd-template.md` | `admin/motd.htmlm`, `admin/motd.js`, `admin/template.htmlm`, `admin/template.js` | *(no wireframe)* |
| `system/cdr-call/cdr-call.md` | `cdrCall/`, `cdrCallAssignment/` | *(no wireframe)* |
| `system/config/system-config.md` | `locationType/`, `exclusionCriteria/`, `supportCategory/`, `loginNotification/` | *(no wireframe)* |
| `system/includes/includes-shared-components.md` | `_include/` | `system/includes/bug-report.pen` (.png), `color-palette.pen` (.png), `loading-states.pen` (.png), `quick-filter.pen` (.png) |
| `system/includes/includes-customization.md` | `_include/customOverride.js`, `_include/customOverride.i18n.js`, `_include/categories.css`, `_include/instance.css`, `_include/login.js`, `_include/bugReport/` | `system/includes/login.pen` (.png) |
| `system/includes/site-shell.md` | `site.htmlm`, `index.json` | `system/shell/app-shell-layout.pen` (.png), `global-navigation.pen` (.png), `user-menu.pen` (.png) |
| `system/notification/notification.md` | `notification/index.htmlm`, `notification/index.js`, `notification/messages.i18n.js`, `notification/sendMessage.mustache`, `notification/sendMessage.js` | `system/notification/notification-list.pen` (.png), `notification-compose.pen` (.png), `send-message.pen` (.png) |
| `system/templates-files/templates-files.md` | `exportTemplate/`, `notificationTemplate/`, `userFile/` | *(no wireframe)* |

## Treatment

| Analysis File | Brownfield Source | Wireframe File(s) |
|---|---|---|
| `treatment/consultation/consultation-list.md` | `consultation/index.htmlm`, `consultation/index.js` | `treatment/consultation/consultation-list.pen` (.png) |
| `treatment/consultation/consultation-details-header.md` | `consultation/details.html`, `consultation/details.js`, `consultation/details.ts` | `treatment/consultation/consultation-details-header.pen` (.png) |
| `treatment/consultation/consultation-details-standard.md` | `consultation/detailDataStandard.html` | `treatment/consultation/consultation-details-standard.pen` (.png) |
| `treatment/consultation/consultation-details-onboarding.md` | `consultation/detailDataOnboarding.html`, `consultation/detailDataOnboardingShort.html` | `treatment/consultation/consultation-details-onboarding.pen` (.png) |
| `treatment/consultation/consultation-details-incarceration.md` | `consultation/detailDataIncarceration.html` | `treatment/consultation/consultation-details-incarceration.pen` (.png) |
| `treatment/consultation/06-consultation-details-treatment-warning.md` | `consultation/detailDataTreatment.html`, `consultation/detailDataWarning.html`, `consultation/index.htmlm`, `consultation/details.html` | `treatment/consultation/consultation-details-treatment-warning.pen` (.png) |
| `treatment/consultation/07-consultation-view-review.md` | `consultation/view.mustache`, `consultation/view.i18n.js`, `consultation/viewDetails.html`, `consultation/viewDetails.js`, `consultation/reviewDetails.html`, `consultation/reviewDetails.js`, `consultation/details.js` | `treatment/consultation/consultation-view.pen` (.png), `consultation-review.pen` (.png) |
| `treatment/consultation/08-consultation-details-js.md` | `consultation/details.js`, `consultation/details.ts` | `treatment/consultation/consultation-icd10-search.pen` (.png), `consultation-export-template.pen` (.png) |
| `treatment/dashboard/dialogs-treatment.md` | `dash/index.htmlm` (lines 624–896), `dash/dash.js` | `treatment/dashboard/end-appointment.pen` (.png), `summarize-appointment.pen` (.png), `incarceration-dialogs.pen` (.png) |
| `treatment/dashboard/consultation-wizard.md` | `dash/consultationWizard.html`, `dash/consultationWizard.js` | `treatment/dashboard/consultation-wizard.pen` (.png), `consultation-location-wizard.pen` (.png) |
| `treatment/dashboard/07-consultation-template.md` | `dash/` (ExpertConsultationTemplateService) | `treatment/dashboard/consultation-template.pen` (.png) |
| `treatment/questionnaire/questionnaire-list.md` | `questionaire/index.htmlm`, `questionaire/index.js` | `treatment/questionnaire/questionnaire-list.pen` (.png) |
| `treatment/questionnaire/questionnaire-detail.md` | `questionaire/details.htmlm`, `questionaire/detailQM.html`, `questionaire/details.js`, `questionaire/index.htmlm` | `treatment/questionnaire/questionnaire-detail.pen` (.png) |
| `treatment/appointment-patient/appointment-details-patient.md` | `appointment/details.html` (patient sections) | *(no wireframe)* |
| `treatment/medication/medication.md` | `medication/` | *(no wireframe)* |
| `treatment/patient-data/patient-data.md` | `patientData/` | *(no wireframe)* |
| `treatment/treatment-core/treatment-and-category.md` | `treatment/`, `treatmentCategory/` | *(no wireframe)* |
| `treatment/treatment-core/treatment-plan.md` | `treatmentPlan/` | *(no wireframe)* |
| `treatment/warning/warning-management.md` | `warning/index.htmlm`, `warning/index.js`, `warning/messages.i18n.js` | *(no wireframe)* |

## User Management

| Analysis File | Brownfield Source | Wireframe File(s) |
|---|---|---|
| `user-management/profile/profile-form.md` | `profile/personal.htmlm`, `profile/personal.js`, `profile/profile.js`, `profile/userProfile.mustache`, `profile/messages.i18n.js` | `user-management/profile/profile-form.pen` (.png) |
| `user-management/profile/profile-staff.md` | `profile/staff.htmlm`, `profile/staff.js`, `profile/searchExpert.js` | `user-management/profile/profile-staff-list.pen` (.png) |
| `user-management/profile/profile-dialogs.md` | `profile/` (password, signature, employee search, DocFinder) | `user-management/profile/profile-password-dialog.pen` (.png), `profile-signature-pad.pen` (.png), `profile-assignment-dialog.pen` (.png) |
| `user-management/profile/profile-expert-availability.md` | `profile/expertDays.js`, `profile/expertWeek.js` | `user-management/profile/profile-expert-availability.pen` (.png), `profile-expert-search.pen` (.png) |
| `user-management/admin/user-management.md` | `admin/user.htmlm`, `admin/user.js` | *(no wireframe)* |
| `user-management/admin/totp-onboarding.md` | `admin/userSecurity.htmlm`, `admin/totpOnboarding.html`, `admin/totpOnboarding.js`, `admin/totp.css`, `admin/totpmessages.i18n.js`, `admin/userSecurity.js` | *(no wireframe)* |
| `user-management/admin/group-management.md` | `admin/group.htmlm`, `admin/group.js` | *(no wireframe)* |
| `user-management/admin/skill.md` | `admin/skill.htmlm`, `admin/skill.js` | *(no wireframe)* |
| `user-management/admin/onboarding-flow.md` | `onboarding/` | *(no wireframe)* |
| `user-management/dashboard/dialogs-user-management.md` | `dash/index.htmlm` (lines 624–896), `dash/dash.js` | `user-management/dashboard/user-stats.pen` (.png) |

---

## Summary: Analysis Files Without Wireframes

| Category | Analysis File | Brownfield Source |
|---|---|---|
| Academy | `video-history/user-video-history.md` | `userVideoHistory/` |
| Accounting | `admin-workhour/workhour.md` | `admin/workHour.htmlm`, `admin/workHour.js` |
| Planning | `appointment-admin/appointment-admin.md` | `appointmentAdmin/` |
| Planning | `appointment-support/appointment-plan.md` | `appointmentPlan/`, `CdrCall/`, `CdrCallAssignment/` |
| Planning | `council/council-and-plan.md` | `council/`, `councilPlan/` |
| Planning | `shift/shift-and-plan.md` | `shift/`, `shiftPlan/` |
| System | `admin-cruds/motd-template.md` | `admin/motd.htmlm`, `admin/template.htmlm` |
| System | `cdr-call/cdr-call.md` | `cdrCall/`, `cdrCallAssignment/` |
| System | `config/system-config.md` | `locationType/`, `exclusionCriteria/`, `supportCategory/`, `loginNotification/` |
| System | `templates-files/templates-files.md` | `exportTemplate/`, `notificationTemplate/`, `userFile/` |
| Treatment | `appointment-patient/appointment-details-patient.md` | `appointment/details.html` |
| Treatment | `medication/medication.md` | `medication/` |
| Treatment | `patient-data/patient-data.md` | `patientData/` |
| Treatment | `treatment-core/treatment-and-category.md` | `treatment/`, `treatmentCategory/` |
| Treatment | `treatment-core/treatment-plan.md` | `treatmentPlan/` |
| Treatment | `warning/warning-management.md` | `warning/` |
| User Mgmt | `admin/user-management.md` | `admin/user.htmlm`, `admin/user.js` |
| User Mgmt | `admin/totp-onboarding.md` | `admin/totpOnboarding.html`, `admin/userSecurity.htmlm` |
| User Mgmt | `admin/group-management.md` | `admin/group.htmlm`, `admin/group.js` |
| User Mgmt | `admin/skill.md` | `admin/skill.htmlm`, `admin/skill.js` |
| User Mgmt | `admin/onboarding-flow.md` | `onboarding/` |
