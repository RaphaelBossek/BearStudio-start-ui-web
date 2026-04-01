# Wireframes Domain Documentation

This directory contains wireframes organized by business domain, mirroring the structure of `analysis/`.

## Structure

- **components/** - Component library and design tokens
- **dashboard/** - Dashboard wireframes
- **appointments/** - Appointment wireframes
- **shifts/** - Shift wireframes
- **treatments/** - Treatment wireframes
- **council/** - Council wireframes
- **consultations/** - Consultation wireframes
- **appointment-admin/** - Appointment admin wireframes
- **notifications/** - Notification wireframes
- **customers/** - Customer wireframes
- **staff/** - Staff wireframes
- **administration/** - Administration wireframes
- **system-admin/** - System admin wireframes
- **includes/** - Shared component wireframes
- **orphan/** - Orphaned wireframes with context

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

- Wireframe: `appointments/list.png` ↔ Analysis: `appointments/list.md`
