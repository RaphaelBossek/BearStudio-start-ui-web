# Feature: Audit Trail

## Status: Planned
**Created:** 2026-03-21
**Last Updated:** 2026-03-21

## Dependencies
- Requires: Better Auth session (user identity)
- Requires: Neon PostgreSQL for audit storage

## Timeline & Resources
- **Timeline:** 1 sprint
- **Required Resources:** Backend developer, Frontend developer

## View Classification
- [x] **Target User**: Doctor / Admin -> `/manager/*` route
- [x] **Navigation**: Audit history tab/section within consultation detail view
  - Section: Within consultation detail view as an additional section
  - Icon: `HistoryIcon`
  - Label: Change History

## Functional Requirements
- FR-AU1: Every create, edit, and archive action on a consultation produces audit log entries.
- FR-AU2: Each audit entry captures: user ID, user name, timestamp, consultation ID, action type (CREATE, UPDATE, ARCHIVE, UNARCHIVE), field path, old value, new value.
- FR-AU3: Audit entries are stored in Neon PostgreSQL.
- FR-AU4: A "Change History" section in the detail view displays audit entries in reverse chronological order.
- FR-AU5: Audit entries are read-only (cannot be edited or deleted by any user).

## Technical Requirements

### Backend
- TR-AU1: Create `ConsultationAuditLog` Prisma model in Neon schema:
  ```prisma
  model ConsultationAuditLog {
    id               String   @id @default(cuid())
    consultationId   String
    userId           String
    userName         String
    action           String   // CREATE, UPDATE, ARCHIVE, UNARCHIVE
    fieldPath        String?  // e.g., "onboarding.generalState"
    oldValue         String?  // JSON-serialized
    newValue         String?  // JSON-serialized
    createdAt        DateTime @default(now())

    @@index([consultationId, createdAt])
  }
  ```
- TR-AU2: Create ORPC procedure `consultationAuditLog.list` that fetches audit entries by consultation ID, paginated.
- TR-AU3: Integrate audit logging into the `consultationAnnotation.upsert` handler:
  1. Before write, fetch existing annotation.
  2. Compute diff between old and new values.
  3. Create one audit entry per changed field.
- TR-AU4: Integrate audit logging into create and archive operations similarly.

### Frontend
- TR-AU5: Add "Change History" section to `SectionedScrollLayout` in the detail page.
- TR-AU6: Display audit entries as a timeline with: user name, action, field, old -> new values, timestamp.
- TR-AU7: Paginate audit entries if > 50 for a single consultation.

## User Stories

### US-AU1: View change history
- **As a** Doctor, **I want to** see the complete change history of a consultation **so that** I know who changed what and when.
  - **Acceptance Criteria:**
    - [ ] Change History section visible in detail view.
    - [ ] Entries sorted by most recent first.
    - [ ] Each entry shows user, action, field, values, and timestamp.
  - **Definition of Done:**
    - [ ] API returns paginated audit entries.
    - [ ] UI renders timeline correctly.

### US-AU2: Audit entry on edit
- **As a** system, **I want to** automatically log every field change when a doctor saves edits **so that** we maintain full traceability.
  - **Acceptance Criteria:**
    - [ ] Each changed field produces a separate audit entry.
    - [ ] Old and new values stored as JSON strings.
    - [ ] Entries created atomically with the annotation upsert (same transaction).

## Edge Cases
- Save with no changes -> No audit entries created.
- Very large diff (e.g., replacing entire standard section) -> One entry per top-level changed field within the section.
- User account deleted after audit entries created -> Audit entries remain with historical user name.
- Audit table grows very large -> Consider date-based partitioning and retention policies.
