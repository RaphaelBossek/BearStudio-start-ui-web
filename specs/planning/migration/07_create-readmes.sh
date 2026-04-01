#!/bin/bash
set -e

# Script 07: Create README files for new directories
# Run after migration to add documentation context to new directories

echo "=========================================="
echo "Script 07: Create README Files"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../.." || exit 1

if [ ! -d "specs" ]; then
  echo "❌ Error: specs directory not found"
  exit 1
fi

# Create analysis README
cat > specs/analysis/README.md << 'EOF'
# Analysis Domain Documentation

This directory contains domain-driven analysis documentation for the application.

## Structure

The analysis directory is organized by business domain rather than technical layer:

- **dashboard/** - Dashboard views (standard, admin, self-service)
- **appointments/** - Core appointment management
- **shifts/** - Shift planning and availability
- **treatments/** - Treatment workflows
- **council/** - Council planning
- **consultations/** - Consultation types and forms
- **appointment-admin/** - Appointment administration
- **notifications/** - Notification system
- **customers/** - Customer management
- **staff/** - Staff management and profiles
- **administration/** - Administrative configuration
- **system-admin/** - System administration
- **includes/** - Shared components and templates
- **permissions/** - RBAC matrix and permission gates
- **orphan/** - Orphaned content with context
- **i18n/** - Internationalization documentation

## Navigation

Start with [SITE-NAVIGATION.md](./SITE-NAVIGATION.md) for the complete sitemap.

## Correlation with Wireframes

Each analysis document correlates with wireframes in `specs/wireframes/` using the same domain and file names:

- Analysis: `appointments/list.md` ↔ Wireframe: `appointments/list.png`

## Progress Tracking

| Domain | Analysis | Wireframes | Features | Domains |
|--------|----------|------------|----------|---------|
| Dashboard | ✅ | ✅ | 🔄 | 🔄 |
| Appointments | ✅ | ✅ | 🔄 | 🔄 |
| Shifts | ✅ | ✅ | 🔄 | 🔄 |
| Consultations | ✅ | ✅ | 🔄 | 🔄 |
| Customers | ✅ | ✅ | 🔄 | 🔄 |
| Staff | ✅ | ✅ | 🔄 | 🔄 |

✅ Complete | 🔄 In Progress | ⏳ Pending
EOF

# Create wireframes README
cat > specs/wireframes/README.md << 'EOF'
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
EOF

# Create features README
cat > specs/features/README.md << 'EOF'
# Features Directory

This directory contains **Functional Requirements (FR)** organized by domain.

## FR vs NFR Split

- **Functional Requirements (FR)**: Located here in `features/{domain}/`
  - Describe what the system should do
  - User stories and acceptance criteria
  - Domain-specific workflows

- **Non-Functional Requirements (NFR)**: Located in `domains/{domain}/permissions.md`
  - Performance, security, compliance requirements
  - Reliability, scalability constraints
  - Domain-specific quality attributes

## Domain Structure

- **appointments/** - Scheduling, collision detection, assignment
- **shifts/** - Shift planning, availability management
- **treatments/** - Treatment workflows
- **consultations/** - Consultation types, wizards
- **customers/** - Customer management flows
- **staff/** - Profile, onboarding flows
- **administration/** - Admin CRUD flows
- **system-admin/** - System configuration flows
- **includes/** - Search, navigation, user dropdown

## Template

Each feature file should include:

```markdown
# Feature: {Feature Name}

## User Stories

## Acceptance Criteria

## Edge Cases

## Related Documents

- Analysis: `../analysis/{domain}/{file}.md`
- Wireframes: `../wireframes/{domain}/{file}.png`
- Domain Model: `../domains/{domain}/entity-model.md`
```
EOF

# Create domains README
cat > specs/domains/README.md << 'EOF'
# Domains Directory

This directory contains domain-driven design documentation organized by business domain.

## Purpose

Each domain folder contains:

- **entity-model.md** - Domain entities, classes, relationships
- **state-machines.md** - State machines and transitions
- **workflows.md** - Business workflows and processes
- **permissions.md** - Domain-specific permission gates + NFRs

## Domains

- **appointments/** - Appointment domain
- **consultations/** - Consultation domain
- **customers/** - Customer domain
- **staff/** - Staff domain

## Entity Model Format

```markdown
# Entity: {EntityName}

## Properties

## Relationships

## Business Rules
```

## State Machine Format

```markdown
# State Machine: {MachineName}

## States

## Transitions

## Guards
```

## NFR Categories

Non-Functional Requirements are documented per domain:

- **Performance** - Response times, throughput
- **Security** - Authentication, authorization, data protection
- **Compliance** - Regulatory requirements
- **Reliability** - Uptime, error handling
- **Scalability** - Growth patterns
EOF

# Create decisions README
cat > specs/decisions/README.md << 'EOF'
# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records documenting significant architectural choices.

## ADR Template

```markdown
# ADR-{NNN}: {Title}

## Status

{Proposed | Accepted | Deprecated | Superseded}

## Context

What is the issue that we're seeing that is motivating this decision?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?
```

## ADR Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| 001 | TanStack Router | Accepted | 2024 |
| 002 | Shadcn/ui | Accepted | 2024 |
| 003 | MongoDB to PostgreSQL | Accepted | 2024 |
| 004 | Unified Naming Convention | Accepted | 2026 |
| 005 | Domain-Driven Structure | Accepted | 2026 |
EOF

# Create migration README
cat > specs/migration/README.md << 'EOF'
# Migration Directory

This directory contains data migration guides and documentation.

## Contents

- **mongodb-reference.md** - Quick index to legacy MongoDB collections
- **schema-mapping.md** - MongoDB → PostgreSQL field-by-field mapping
- **data-migration.md** - Migration scripts, validation, rollback
- **denormalization-patterns.md** - What was embedded, what is normalized
- **cutover-plan.md** - Production migration strategy
- **migration-status.md** - Tracks progress per collection

## Migration Status

| Collection | Status | Migrated To | Notes |
|------------|--------|-------------|-------|
| appointments | 🔄 | appointments | In progress |
| consultations | 🔄 | consultations | In progress |
| users | 🔄 | users | In progress |

🔄 In Progress | ✅ Complete | ⏳ Pending
EOF

# Create testing README
cat > specs/testing/README.md << 'EOF'
# Testing Directory

This directory contains testing strategy and documentation.

## Testing Pyramid

```
        /\
       /  \
      / E2E \
     /--------\
    /Integration\
   /--------------\
  /    Unit Tests   \
 /--------------------\
```

## Contents

- **testing-strategy.md** - Unit/integration/E2E balance, coverage goals
- **e2e-scenarios.md** - Critical user journey tests in Gherkin
- **component-patterns.md** - React Testing Library patterns
- **test-data.md** - Fixtures, factories, mock data strategies

## Coverage Goals

| Test Type | Coverage Goal | Tools |
|-----------|---------------|-------|
| Unit | 80% | Vitest |
| Integration | 70% | Vitest, MSW |
| E2E | Critical paths | Playwright |
EOF

# Create orphan README (analysis)
cat > specs/analysis/orphan/README.md << 'EOF'
# Orphaned Analysis Content

This directory contains analysis documentation that has been moved from its original location because the feature is no longer part of the core application or has been relocated.

## Contents

### support-and-video.md

**Original Location**: `analysis/academy/support-video/01-support-and-video.md`

**Reason for Orphaning**: The Video Library feature is now an external link, not an integrated part of the application. The support ticket functionality has been moved to the dashboard.

**Related Wireframes**: See `specs/wireframes/orphan/` for related wireframes.

### user-video-history.md

**Original Location**: `analysis/academy/video-history/`

**Reason for Orphaning**: Same as above - video history is part of the external video library.

## Decision Log

This content was orphaned as part of the specs directory migration (2026-03-31) to align the documentation structure with the actual application features.
EOF

# Create orphan README (wireframes)
cat > specs/wireframes/orphan/README.md << 'EOF'
# Orphaned Wireframes

This directory contains wireframes that have been moved from their original location because the feature is no longer part of the core application.

## Contents

### Video Library Wireframes

- **video-library.pen/.png** - Video library main view
- **video-category.pen/.png** - Video category view

**Original Location**: `wireframes/academy/support-video/`

**Reason for Orphaning**: The Video Library feature is now an external link, not an integrated part of the application. These wireframes are retained for historical reference only.

### Support Ticket

- **support-ticket.pen/.png** - Support ticket dialog

**Note**: This wireframe has been moved to `wireframes/dashboard/support-ticket.*` as it's now part of the dashboard functionality.

## Analysis Correlation

Related analysis documentation is in `specs/analysis/orphan/`.
EOF

# Create components README
cat > specs/wireframes/components/README.md << 'EOF'
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
EOF

echo "✅ README files created successfully"
echo "=========================================="
