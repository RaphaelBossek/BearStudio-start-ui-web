# Non-Submenu Analysis Elements

This document tracks analysis markdown files in `specs/analysis/` that are not referenced in the sitemap navigation tables of `readme.md` and are also not cross-referenced by any file that IS referenced in `readme.md`.

## Source Files Excluded

The following directories and files were excluded from this analysis:

- `i18n/` subdirectory
- `mongodb-mapping/` subdirectory
- `data-dictionary-*.md`
- `readme.md` (the main readme itself)

## Methodology

1. **Step 1**: List all `.md` files in `specs/analysis/` excluding `i18n/`, `mongodb-mapping/`, `data-dictionary-*.md`, and `readme.md`
2. **Step 2**: Extract all `.md` filename references from `readme.md`
3. **Step 3**: Compute the set difference to find files NOT referenced in `readme.md`
4. **Step 4**: For each unreferenced file, search within all analysis files (excluding `i18n/` and `mongodb-mapping/` subdirectories) to find cross-references from files that ARE referenced in `readme.md` (data-dictionary files are included in the search space since they may cross-reference other files)
5. **Step 5**: Filter to keep only files that are neither referenced in `readme.md` nor cross-referenced by any file referenced in `readme.md`

## Orphan Files (Not Referenced Anywhere)

The following files are not referenced in `readme.md` and are not cross-referenced by any file that is referenced in `readme.md`:

| File | Path |
|------|------|
| [appointment-assign-user.md](../analysis/planning/appointment/appointment-assign-user.md) | `specs/analysis/planning/appointment/` |
| [appointment-details-patient.md](../analysis/treatment/appointment-patient/appointment-details-patient.md) | `specs/analysis/treatment/appointment-patient/` |
| [appointment-details-scheduling.md](../analysis/planning/appointment/appointment-details-scheduling.md) | `specs/analysis/planning/appointment/` |
| [basisweb-wizard.md](../analysis/interfaces/dashboard/basisweb-wizard.md) | `specs/analysis/interfaces/dashboard/` |
| [consultation-details-js.md](../analysis/treatment/consultation/consultation-details-js.md) | `specs/analysis/treatment/consultation/` |
| [consultation-template.md](../analysis/treatment/dashboard/consultation-template.md) | `specs/analysis/treatment/dashboard/` |
| [consultation-wizard.md](../analysis/treatment/dashboard/consultation-wizard.md) | `specs/analysis/treatment/dashboard/` |
| [profile-expert-availability.md](../analysis/user-management/profile/profile-expert-availability.md) | `specs/analysis/user-management/profile/` |
| [profile-staff.md](../analysis/user-management/profile/profile-staff.md) | `specs/analysis/user-management/profile/` |
| [questionnaire-detail.md](../analysis/treatment/questionnaire/questionnaire-detail.md) | `specs/analysis/treatment/questionnaire/` |
| [shift-dialog.md](../analysis/planning/dashboard/shift-dialog.md) | `specs/analysis/planning/dashboard/` |
| [totp-onboarding.md](../analysis/user-management/admin/totp-onboarding.md) | `specs/analysis/user-management/admin/` |
| [wireframes-index.md](../analysis/wireframes-index.md) | `specs/analysis/` |

## Files Not Referenced in readme.md but Cross-Referenced

These files are not in the sitemap navigation tables of `readme.md`, but ARE cross-referenced by other analysis files that are referenced in `readme.md`:

| File | Cross-Referenced By |
|------|---------------------|
| [contact.md](../analysis/customer/contact/contact.md) | [data-dictionary-customer.md](../analysis/customer/data-dictionary-customer.md), [medication.md](../analysis/treatment/medication/medication.md), [patient-data.md](../analysis/treatment/patient-data/patient-data.md), [room.md](../analysis/customer/room/room.md), [equipment.md](../analysis/customer/equipment/equipment.md) |
| [dashboard-admin.md](../analysis/system/admin/dashboard-admin.md) | [data-dictionary-system.md](../analysis/system/data-dictionary-system.md), [system/dashboard/readme.md](../analysis/system/dashboard/readme.md) |
| [dashboard-selfservice.md](../analysis/system/dashboard/dashboard-selfservice.md) | [data-dictionary-system.md](../analysis/system/data-dictionary-system.md), [system/dashboard/readme.md](../analysis/system/dashboard/readme.md) |
| [dialogs-planning.md](../analysis/planning/dashboard/dialogs-planning.md) | [data-dictionary-planning.md](../analysis/planning/data-dictionary-planning.md), [dialogs-treatment.md](../analysis/treatment/dashboard/dialogs-treatment.md), [dialogs-system.md](../analysis/system/dashboard/dialogs-system.md), [dialogs-user-management.md](../analysis/user-management/dashboard/dialogs-user-management.md) |
| [dialogs-system.md](../analysis/system/dashboard/dialogs-system.md) | [data-dictionary-system.md](../analysis/system/data-dictionary-system.md), [dialogs-planning.md](../analysis/planning/dashboard/dialogs-planning.md), [dialogs-treatment.md](../analysis/treatment/dashboard/dialogs-treatment.md), [dialogs-user-management.md](../analysis/user-management/dashboard/dialogs-user-management.md), [system/dashboard/readme.md](../analysis/system/dashboard/readme.md) |
| [dialogs-treatment.md](../analysis/treatment/dashboard/dialogs-treatment.md) | [data-dictionary-treatment.md](../analysis/treatment/data-dictionary-treatment.md), [dialogs-planning.md](../analysis/planning/dashboard/dialogs-planning.md), [dialogs-system.md](../analysis/system/dashboard/dialogs-system.md), [dialogs-user-management.md](../analysis/user-management/dashboard/dialogs-user-management.md) |
| [dialogs-user-management.md](../analysis/user-management/dashboard/dialogs-user-management.md) | [data-dictionary-user-management.md](../analysis/user-management/data-dictionary-user-management.md), [dialogs-planning.md](../analysis/planning/dashboard/dialogs-planning.md), [dialogs-treatment.md](../analysis/treatment/dashboard/dialogs-treatment.md), [dialogs-system.md](../analysis/system/dashboard/dialogs-system.md) |
| [group-management.md](../analysis/user-management/admin/group-management.md) | [sysconfig-import.md](../analysis/system/admin/sysconfig-import.md) |
| [invoice-details.md](../analysis/accounting/invoice/invoice-details.md) | [data-dictionary-accounting.md](../analysis/accounting/data-dictionary-accounting.md) |
| [medication.md](../analysis/treatment/medication/medication.md) | [patient-data.md](../analysis/treatment/patient-data/patient-data.md), [contact.md](../analysis/customer/contact/contact.md), [room.md](../analysis/customer/room/room.md), [equipment.md](../analysis/customer/equipment/equipment.md) |
| [month-view.md](../analysis/planning/dashboard/month-view.md) | [data-dictionary-planning.md](../analysis/planning/data-dictionary-planning.md), [profile-expert-availability.md](../analysis/user-management/profile/profile-expert-availability.md) |
| [sysconfig-import.md](../analysis/system/admin/sysconfig-import.md) | [data-dictionary-system.md](../analysis/system/data-dictionary-system.md), [group-management.md](../analysis/user-management/admin/group-management.md) |
| [user-video-history.md](../analysis/orphan/user-video-history.md) | [data-dictionary-academy.md](../analysis/academy/data-dictionary-academy.md), [templates-files.md](../analysis/system/templates-files/templates-files.md), [worklog.md](../analysis/accounting/worklog/worklog.md), [invoice-receiver.md](../analysis/accounting/invoice-receiver/invoice-receiver.md) |
