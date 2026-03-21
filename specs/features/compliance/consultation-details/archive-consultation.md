# Feature: Archive Consultation (Soft Delete)

## Status: Planned
**Created:** 2026-03-21
**Last Updated:** 2026-03-21

## Dependencies
- Requires: [View Consultation Details](view-consultation.md) (Done)
- Requires: Neon annotation schema with `archivedOverride` boolean
- Requires: [Audit Trail](audit-trail.md) (Planned)

## Timeline & Resources
- **Timeline:** 0.5 sprint
- **Required Resources:** Frontend developer, Backend developer

## View Classification
- [x] **Target User**: Doctor -> `/manager/*` route
- [x] **Navigation**: Archive action within the detail view top bar

## Functional Requirements
- FR-A1: An "Archive" button is available in the detail view top bar for non-CLOSED consultations.
- FR-A2: Clicking "Archive" shows a confirmation dialog.
- FR-A3: On confirmation, the consultation's `archivedOverride` is set to `true` in Neon.
- FR-A4: Archived consultations are visually distinguished in the list (e.g., dimmed, badge).
- FR-A5: Archived consultations can be "Unarchived" by Doctors.
- FR-A6: Only Doctors can archive/unarchive.

## Technical Requirements

### Backend
- TR-A1: Add `archivedOverride` Boolean column to `ConsultationAnnotation` Prisma model.
- TR-A2: Update `consultationAnnotation.upsert` to accept `archivedOverride`.
- TR-A3: Server-side merge: if `archivedOverride` is true, merge it into the response.
- TR-A4: Optionally add a `list` filter parameter to exclude/include archived consultations.
- TR-A5: Role check: only Doctor role.
- TR-A6: Audit log entry for archive/unarchive action.

### Frontend
- TR-A7: "Archive" button in top bar with confirmation dialog.
- TR-A8: "Unarchive" button visible when consultation is archived.
- TR-A9: List page: option to filter archived consultations.

## User Stories

### US-A1: Archive a consultation
- **As a** Doctor, **I want to** archive a consultation **so that** it is hidden from active lists without permanent deletion.
  - **Acceptance Criteria:**
    - [ ] Confirmation dialog before archiving.
    - [ ] After archive, consultation shows as archived in detail view.
    - [ ] Audit log entry created.

### US-A2: Unarchive a consultation
- **As a** Doctor, **I want to** unarchive a previously archived consultation **so that** it returns to the active list.
  - **Acceptance Criteria:**
    - [ ] "Unarchive" button visible on archived consultations.
    - [ ] After unarchive, consultation returns to normal state.
    - [ ] Audit log entry created.

## Edge Cases
- Archive a CLOSED consultation -> Allowed (archive is orthogonal to state).
- Unarchive then edit -> Proceed normally if state allows editing.
- Bulk archive from list view -> Out of scope for initial release.
