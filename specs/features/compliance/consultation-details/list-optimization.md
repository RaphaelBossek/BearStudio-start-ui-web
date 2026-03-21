# Feature: Consultation List Optimization

## Status: Planned
**Created:** 2026-03-21
**Last Updated:** 2026-03-21

## Dependencies
- Requires: MongoDB `consultation` collection (read projection with compound index)
- Requires: Prisma model for `consultation` collection

## Timeline & Resources
- **Timeline:** 0.5 sprint
- **Required Resources:** Backend developer

## View Classification
- [x] **Target User**: Doctor / Admin -> `/manager/*` route
- [x] **Navigation**: Existing consultation list page

## Functional Requirements
- FR-L1: The consultation list page queries the `consultation` collection instead of `consultationData`.
- FR-L2: Filtering and pagination leverage the compound index `{ period, "location._id" }`.
- FR-L3: All existing list features (search, type filter, state filter, sorting, pagination) work identically.
- FR-L4: List items link to the detail view which still fetches from `consultationData` + Neon merge.

## Technical Requirements

### Backend
- TR-L1: Add `Consultation` model to `prisma/schema-mongodb.prisma` mirroring the `consultation` collection structure (all fields from the CQRS read projection).
- TR-L2: Run `prisma generate` to create the client.
- TR-L3: Create new ORPC router `consultation-list-mongo.ts` with a `list` procedure querying the `consultation` collection.
- TR-L4: Support the same input parameters as the current `consultationDataMongo.list`: page, limit, searchTerm, type, state, sortBy, sortOrder.
- TR-L5: Ensure `BigInt` serialization is consistent with existing patterns.

### Frontend
- TR-L6: Update `consultation-data-list-page.tsx` to use the new `consultationListMongo.list` ORPC procedure.
- TR-L7: No changes to list column definitions or UI (this is a backend optimization).

## User Stories

### US-L1: Optimized list queries
- **As a** system, **I want to** query the indexed `consultation` collection for list views **so that** pagination and filtering are fast even with 100k+ records.
  - **Acceptance Criteria:**
    - [ ] List page uses `consultation` collection.
    - [ ] Pagination, sorting, and filtering work identically.
    - [ ] Response times under 200ms for typical paginated queries.
  - **Definition of Done:**
    - [ ] Prisma model created for `consultation`.
    - [ ] New list router tested with existing filters.
    - [ ] Old `consultationDataMongo.list` deprecated or removed.

## Edge Cases
- `consultation` and `consultationData` out of sync -> Accept eventual consistency; detail view always reads from `consultationData`.
- Missing fields in `consultation` vs `consultationData` (e.g., `paymentType`) -> Not needed for list display.
- New consultation created via Neon only (not in MongoDB) -> Will not appear in `consultation` list; consider fallback query or separate "draft" list.
