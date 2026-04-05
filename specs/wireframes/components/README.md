---
title: 'Components'
---

# Component Library

This directory contains documentation about UI components used throughout the application.

## Contents

- **shadcn-usage.md** - Which Shadcn components are used where, with examples
- **custom-components.md** - Custom components (MonthTable, SectionedScrollLayout, etc.)
- **design-tokens.md** - Colors, spacing, typography, module-based theming
- **state-colors.md** - Appointment state color palette with hex values

## Custom Components

### MonthTable

A custom calendar component for displaying appointments in a month view.

**Location**: `src/components/month-table.tsx`

**Used In**: 
- Dashboard calendar
- Shift planning
- Appointment scheduling

### SectionedScrollLayout

A layout component for multi-section detail views with sticky navigation.

**Location**: `src/components/sectioned-scroll-layout.tsx`

**Used In**:
- Consultation details
- Treatment details
- Customer details

## Design Tokens

See [design-tokens.md](./design-tokens.md) for the complete design token system.
