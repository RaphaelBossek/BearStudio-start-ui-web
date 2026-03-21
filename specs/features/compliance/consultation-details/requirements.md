# Job: Consultation Details Management
---
## Status: In Progress
**Created:** 2026-03-21
**Last Updated:** 2026-03-21

## Problem Space & Context

### Current Baseline
The consultation details view is being migrated from a legacy Handlebars/Mustache-based HTML template (`consultation/details.html`) to a modern React-based UI. A read-only React detail view using `SectionedScrollLayout` with 16+ section components already exists and renders data from the MongoDB `consultationData` collection. An annotation overlay system in Neon PostgreSQL currently supports `commentOverride` and `requireReportingOverride` fields only.

The current implementation has:
- **Read-only detail page** (`consultation-data-page.tsx`) with section-based navigation
- **ORPC router** with `list` and `get` procedures querying `consultationData` (MongoDB)
- **Annotation system** for comment and requireReporting overrides (Neon)
- **EditableField component** scaffolded but not fully wired to Neon annotations
- **MongoDB update procedure** exists but should be **removed** (per user decision: Neon-only writes)

### User or Customer Pain Points
1. **No edit capability in new UI** - Doctors must fall back to the legacy system to modify consultation records.
2. **Limited annotation system** - Only 2 fields (comment, requireReporting) can be annotated; all other edits require direct MongoDB access.
3. **No creation workflow** - New consultations cannot be created from the React UI.
4. **No soft-delete/archive** - No way to archive consultations from the new interface.
5. **No audit trail** - Changes lack traceability of who changed what and when.
6. **List performance** - The list page queries `consultationData` (no compound index) instead of the indexed `consultation` collection.

### Impact on Business
- Inability to retire the legacy Handlebars system delays migration timeline.
- Lack of audit trail creates compliance risk in a medical documentation environment.
- Missing edit capabilities reduce staff productivity and force context-switching between old and new systems.

### Motivation
Replace the legacy consultation details view entirely with a fully featured React-based CRUD interface that saves all edits as Neon annotation overrides (preserving MongoDB as immutable source of truth), with full audit logging and role/state-based access control.

## The Job to be Done (Hypothesis)
> **When** a doctor needs to view, create, edit, or archive a consultation record, **I want to** perform all these operations directly in the new React UI with inline editing and template-based creation, **so that** the legacy Handlebars system can be fully retired while maintaining compliance with medical documentation standards.

### Desired Outcomes (Success Metrics)
- 100% of consultation CRUD operations performed in the new React UI (zero legacy fallback)
- All field edits persisted as Neon annotations with server-side merge on read
- Full audit log of every change (who, what, when, old value, new value)
- Consultation list queries use the indexed `consultation` collection
- Edit access restricted by role (Doctor) and consultation state (all except CLOSED)

## Proposed Solution
### Overview
1. **Expand the Neon annotation schema** with structured typed columns for each overridable section (bodyOverride, onboardingOverride, incarcerationOverride, etc.) as JSONB.
2. **Server-side merge** of MongoDB source data + Neon annotation overrides in the `get` API endpoint.
3. **Inline editing** using `react-hook-form` + `EditableField` components that switch between read-only and editable states.
4. **Template-based creation** flow using `expertConsultationTemplate` for pre-filling new consultations.
5. **Soft delete (archive)** via a boolean flag in annotations.
6. **Full audit log** table in Neon tracking every field-level change with before/after values.
7. **Role-based access**: Only authenticated Doctors can edit; state-based: all states except CLOSED.
8. **List optimization**: Add Prisma model for `consultation` collection and create a new list router using it.

### Out of Scope
- Direct writes to MongoDB `consultationData` collection from the UI (Neon-only writes)
- Syncing Neon annotations back to MongoDB (read projection remains as-is)
- Real-time collaborative editing (last-write-wins is acceptable)
- Offline support
- PDF export or print functionality
- Mobile-specific responsive layout (desktop-focused for medical staff)

## Realization (User Stories)
The following stories are derived from this Job to achieve the Desired Outcomes:
- View Consultation Details (Done) -> [view-consultation.md](view-consultation.md)
- Edit Consultation Details (In Progress) -> [edit-consultation.md](edit-consultation.md)
- Create New Consultation (Planned) -> [create-consultation.md](create-consultation.md)
- Archive Consultation (Planned) -> [archive-consultation.md](archive-consultation.md)
- Audit Trail (Planned) -> [audit-trail.md](audit-trail.md)
- List Optimization (Planned) -> [list-optimization.md](list-optimization.md)

## Common Acceptance Criteria
-> [acceptance-criteria.md](acceptance-criteria.md)

## Risks and Mitigations
- **Risk:** Neon annotation schema grows complex with deeply nested JSONB columns for each section.
  - **Mitigation:** Use structured typed columns (one JSONB per section) rather than a single monolithic JSON blob; validate with Zod before persisting.
- **Risk:** Server-side merge logic becomes a maintenance burden as fields evolve.
  - **Mitigation:** Use a generic deep-merge utility that overlay Neon values on MongoDB values; centralize in a single merge function.
- **Risk:** Audit log table grows large with high-frequency edits.
  - **Mitigation:** Partition audit logs by date; implement retention policies.
- **Risk:** Role and state restrictions may block legitimate edits (e.g., correcting a CLOSED consultation).
  - **Mitigation:** Provide an admin override escape hatch with separate permission and additional audit logging.
- **Risk:** Template-based creation may produce incomplete consultations if templates are outdated.
  - **Mitigation:** Validate template completeness on use; allow manual override of all pre-filled values.
