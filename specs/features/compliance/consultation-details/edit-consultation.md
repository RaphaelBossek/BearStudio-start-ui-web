# Feature: Edit Consultation Details

## Status: In Progress
**Created:** 2026-03-21
**Last Updated:** 2026-03-21

## Dependencies
- Requires: [View Consultation Details](view-consultation.md) (Done)
- Requires: Expanded Neon annotation schema with section-level JSONB columns
- Requires: Better Auth session with Doctor role
- Requires: [Audit Trail](audit-trail.md) (Planned)

## Timeline & Resources
- **Timeline:** 1-2 sprints
- **Required Resources:** Frontend developer, Backend developer

## View Classification
- [x] **Target User**: Doctor -> `/manager/*` route
- [x] **Navigation**: Same page as view (toggle edit mode)

## Current Implementation State
The following has been scaffolded but needs rework per user decisions:
- `EditableField` component exists with text/textarea/number/boolean/select support
- All 16 section components accept `isEditMode` prop
- `consultation-data-page.tsx` has `useForm` with `react-hook-form` + zod validation
- **TO CHANGE:** Current `handleSave` writes to MongoDB; must be changed to Neon-only writes
- **TO CHANGE:** Current MongoDB `update` procedure should be removed from ORPC router
- **TO ADD:** Expanded Neon annotation schema (section-level JSONB columns)
- **TO ADD:** Server-side merge of MongoDB + Neon data in `get` endpoint
- **TO ADD:** Role and state checks on edit endpoints

## Functional Requirements
- FR-E1: Toggle edit mode via "Edit" button in the top bar.
- FR-E2: In edit mode, all scalar fields within visible sections become editable inline using `EditableField`.
- FR-E3: Cancel discards all unsaved changes and resets form to last-saved state.
- FR-E4: Save persists all changed fields as Neon annotation overrides in a single API call.
- FR-E5: Only Doctors can enter edit mode.
- FR-E6: Edit button hidden/disabled for consultations in CLOSED state.
- FR-E7: Each save produces audit log entries for changed fields.
- FR-E8: Validation uses hybrid strictness: enums validated, optionals allowed empty, required fields enforced.

## Technical Requirements

### Backend (Neon Annotation Expansion)
- TR-E1: Expand the `ConsultationAnnotation` Prisma model in `schema.prisma` (Neon) with structured JSONB columns:
  ```
  bodyOverride        Json?   @db.JsonB
  baseOverride        Json?   @db.JsonB
  onboardingOverride  Json?   @db.JsonB
  incarcerationOverride Json? @db.JsonB
  treatmentOverride   Json?   @db.JsonB
  standardOverride    Json?   @db.JsonB
  referralOverride    Json?   @db.JsonB
  warningsOverride    Json?   @db.JsonB
  bookNumberOverride  String?
  dateOverride        DateTime?
  typeOverride        String?
  noWarningsOverride  Boolean?
  ```
- TR-E2: Create/update `consultationAnnotation.upsert` ORPC procedure to accept section-level override objects.
- TR-E3: Implement server-side deep merge in `consultationDataMongo.get`:
  1. Fetch MongoDB source data by ID.
  2. Fetch Neon annotation by consultation ID.
  3. For each section, overlay annotation JSONB on MongoDB source (annotation wins).
  4. Return merged result.
- TR-E4: Add role check: verify session user has Doctor role before allowing upsert.
- TR-E5: Add state check: reject upsert if consultation state is CLOSED (fetch state from MongoDB, compare).
- TR-E6: **Remove** the existing `consultationDataMongo.update` procedure (no direct MongoDB writes).
- TR-E7: Zod validation on all annotation upsert inputs matching the expanded schema.

### Frontend
- TR-E8: `EditableField` component reads/writes via `react-hook-form` context (already scaffolded).
- TR-E9: `handleSave` sends section-level override objects to `consultationAnnotation.upsert`.
- TR-E10: On save success, refetch consultation data (server-side merge returns updated values).
- TR-E11: Disable "Edit" button for CLOSED consultations (check `consultation.state`).
- TR-E12: Show loading spinner on Save button during mutation.

## User Interface/Experience Requirements
- UI-E1: Edit mode: field labels remain static; value cells switch from text to input/select/checkbox.
- UI-E2: EditableField max-width constrained to `max-w-md` for readability.
- UI-E3: Validation errors shown inline below the field in red text.
- UI-E4: Top bar shows "Cancel" and "Save" buttons in edit mode; "Edit" button in read mode.
- UI-E5: Saving shows "Saving..." text on the button with disabled state.

## User Stories

### US-E1: Enter edit mode
- **As a** Doctor, **I want to** click "Edit" to switch the consultation view to editable mode **so that** I can modify clinical data inline.
  - **Acceptance Criteria:**
    - [ ] "Edit" button visible for Doctor role when consultation state is not CLOSED.
    - [ ] All scalar fields in visible sections switch to editable inputs.
    - [ ] Form is pre-populated with current effective values (merged MongoDB + Neon).
  - **Definition of Done:**
    - [ ] TypeScript compiles without errors.
    - [ ] Biome lint passes.

### US-E2: Save edited consultation
- **As a** Doctor, **I want to** save my edits **so that** changes are persisted as Neon annotation overrides.
  - **Acceptance Criteria:**
    - [ ] Save sends only changed sections to the API.
    - [ ] API persists section-level JSONB overrides in Neon.
    - [ ] After save, view refreshes with server-merged data.
    - [ ] Audit log entry created for each changed field.
  - **Definition of Done:**
    - [ ] API returns correct merged data after save.
    - [ ] Neon annotation row updated/created correctly.

### US-E3: Cancel edit
- **As a** Doctor, **I want to** cancel my edits **so that** unsaved changes are discarded.
  - **Acceptance Criteria:**
    - [ ] Cancel resets form to pre-edit values.
    - [ ] No API call made on cancel.
    - [ ] View returns to read-only mode.

### US-E4: State-based edit restriction
- **As a** system, **I want to** prevent editing CLOSED consultations **so that** finalized records cannot be modified.
  - **Acceptance Criteria:**
    - [ ] "Edit" button hidden when state is CLOSED.
    - [ ] API rejects upsert requests for CLOSED consultations with 403.

### US-E5: Hybrid validation
- **As a** Doctor, **I want to** see validation errors for invalid enum values but be allowed to leave optional fields empty **so that** I maintain data quality without being blocked by unnecessary requirements.
  - **Acceptance Criteria:**
    - [ ] Enum fields (e.g., gender, generalState) show error for unrecognized values.
    - [ ] Optional text fields accept empty strings.
    - [ ] Number fields accept empty (treated as undefined).

## Edge Cases
- User loses network during save -> Show error message, form retains edited values for retry.
- Two doctors edit same consultation -> Last-write-wins; no conflict resolution.
- Annotation exists for a section that was deleted from MongoDB template -> Annotation data still served; merge logic handles gracefully.
- CLOSED consultation transitioned to OPEN by admin -> Edit button re-appears on next page load.
- Very large consultation (all sections filled) -> Form should not degrade performance; lazy section rendering if needed.
