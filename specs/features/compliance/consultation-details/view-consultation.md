# Feature: View Consultation Details

## Status: Done
**Created:** 2026-03-21
**Last Updated:** 2026-03-21

## Dependencies
- Requires: MongoDB `consultationData` collection accessible via Prisma
- Requires: ORPC router with `get` procedure
- Requires: Better Auth session for access control

## Timeline & Resources
- **Timeline:** Complete (already implemented)
- **Required Resources:** Frontend developer

## View Classification
- [x] **Target User**: Admin/Manager/Staff (Doctor) -> `/manager/*` route
- [x] **Navigation**: Already integrated in manager sidebar
  - Section: Application
  - Icon: `ClipboardListIcon`
  - Label: Consultation Data

## Functional Requirements
- FR-V1: Display all consultation data fields organized into logical sections.
- FR-V2: Show/hide sections dynamically based on consultation type (STANDARD, ONBOARDING, INCARCERATION, TREATMENT, DOCUMENT, EXTERNAL, ONBOARDING_SHORT).
- FR-V3: Display BasisWEB history and medication sections only when `basisWebDataId` is present.
- FR-V4: Display attachments section only when attachments array is non-empty.
- FR-V5: Display consultation type and state badges in the top bar.
- FR-V6: Show annotation overrides (comment, requireReporting) merged with source data.

## Technical Requirements
- TR-V1: Fetch consultation by ID from MongoDB via `consultationDataMongo.get` ORPC procedure.
- TR-V2: Fetch annotation from Neon via `consultationAnnotation.get` ORPC procedure.
- TR-V3: Merge annotation overrides client-side (current implementation; will migrate to server-side in edit story).
- TR-V4: Serialize BigInt `_id` values as strings in all API responses.
- TR-V5: Use `SectionedScrollLayout` with memoized `sections` array per AGENTS.md guidelines.

## User Interface/Experience Requirements
- UI-V1: SectionedScrollLayout with sticky nav sidebar and scroll-spy.
- UI-V2: Read-only DataList rows with label (w-52) and value columns.
- UI-V3: Enum values displayed as-is (e.g., `WELL`, `REDUCED`).
- UI-V4: Date fields formatted as `dd.MM.yyyy` (de-DE locale).
- UI-V5: Time fields (seconds-since-midnight) formatted as `HH:mm`.
- UI-V6: Boolean fields displayed as `Yes` / `No`.
- UI-V7: Missing/null values displayed as `---`.

## User Stories

### US-V1: View full consultation detail
- **As a** Doctor, **I want to** view all fields of a consultation record organized by section **so that** I can review the complete clinical documentation.
  - **Acceptance Criteria:**
    - [x] All 16 section types render correctly for their respective consultation types.
    - [x] Sections are filtered based on consultation type.
    - [x] Loading, error, and not-found states are handled.
  - **Definition of Done:**
    - [x] TypeScript compiles without errors.
    - [x] Biome lint passes.

### US-V2: View with annotation overrides
- **As a** Doctor, **I want to** see annotation overrides applied on top of source data **so that** I see the effective current values.
  - **Acceptance Criteria:**
    - [x] Comment field shows annotation override when present, source value otherwise.
    - [x] Require reporting field shows annotation override when present.
  - **Definition of Done:**
    - [x] Client-side merge logic tested with both null and non-null annotation values.

## Edge Cases
- Consultation not found -> Shows "Consultation not found" message.
- Network error on fetch -> Shows error state with retry button.
- BigInt serialization -> All BigInt values converted to string before JSON response.
- Missing nested objects (e.g., no `onboarding` on a STANDARD consultation) -> Section hidden via type filtering.
