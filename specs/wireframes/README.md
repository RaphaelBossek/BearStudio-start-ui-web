---
title: 'Wireframes'
---

---
---

# Wireframes Domain Documentation

This directory contains wireframes organized by business domain, mirroring the structure of `analysis/`.

## Structure

- **academy/** - Academy wireframes (support video, video library)
- **accounting/** - Accounting wireframes (invoice, worklog, invoice-receiver, admin-job, config)
- **customer/** - Customer wireframes (customer-core, contact, room, equipment)
- **interfaces/** - Interface wireframes (basisweb wizard)
- **planning/** - Planning wireframes (appointment, appointment-admin, appointment-support, council, dashboard, shift)
- **system/** - System wireframes (includes, shell, notification, admin-cruds, admin, config, templates-files, dashboard)
- **treatment/** - Treatment wireframes (consultation, dashboard, questionnaire, appointment-patient, medication, patient-data, treatment-core, warning)
- **user-management/** - User management wireframes (profile, dashboard, admin)
- **orphan/** - Orphaned wireframes with context
- **components/** - Shared reusable components

## Cross-Cutting Directories (analysis only)

These directories exist only in `specs/analysis/` and have no wireframe equivalents:

| Directory | Purpose |
|:---|:---|
| `i18n/` | Translation analysis, domain-specific i18n docs, hardcoded strings, missing keys |
| `mongodb-mapping/` | MongoDB-to-Prisma schema mapping documentation |
| `permissions/` | Permission analysis (currently empty) |

## Component Mapping

| Component | Location | Usage |
|-----------|----------|-------|
| MonthTable | `components/custom-components.md` | Appointments, Shifts |
| SectionedScrollLayout | `components/custom-components.md` | Consultations, Details views |
| DataTable | `components/shadcn-usage.md` | All list views |

## Design Tokens

See [design-tokens.md](./components/design-tokens.md) for colors, spacing, typography.

## State Colors

See [state-colors.md](./components/state-colors.md) for appointment state color palette.

## Correlation with Analysis

Each wireframe correlates with analysis documents in `specs/analysis/` using the same domain and file names:

- Wireframe: `planning/appointment/list.png` ↔ Analysis: `planning/appointment/list.md`
