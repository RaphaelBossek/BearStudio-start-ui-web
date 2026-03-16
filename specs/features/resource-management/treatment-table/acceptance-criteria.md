# Acceptance Criteria: Treatment Table View

## Functional Criteria
- [x] The table MUST fetch data from the `treatment` collection in MongoDB.
- [x] The table MUST support server-side pagination (page/limit).
- [x] The table MUST support server-side sorting by `id`, `bookNumber`, `state`, `dateStart`, and `dateCreated`.
- [x] The table MUST allow searching by `bookNumber`, `jNumber`, `customer.name`, `location.name`, and `assigned.name`.
- [x] The table MUST allow users to toggle the visibility of columns (15+ fields require "more..." drawer).
- [x] Clicking a row MUST open the treatment detail pane in the `ResizablePanel` using the `SectionedScrollLayout` component.
- [x] The table MUST display treatment progress as `finished/total` count.

## UI/UX Criteria
- [x] Use `@tanstack/react-table` for table logic.
- [x] Use shadcn/ui components for the table, dropdowns, and drawer.
- [x] The table MUST be responsive and handle horizontal scrolling on smaller screens.
- [x] Dates MUST be formatted in a human-readable way (e.g., `DD.MM.YYYY`).
- [x] Statuses (states) MUST be visually distinct using badges with different colors.
- [x] Default sort MUST be `dateCreated: 'desc'` (most recent first).

## Technical Criteria
- [x] Implement an oRPC endpoint `treatmentMongo.list` for paginated fetching.
- [x] Implement an oRPC endpoint `treatmentMongo.get` for fetching full treatment details.
- [x] Implement an oRPC endpoint `treatmentMongo.getAppointmentsByTreatmentId` for fetching associated appointments.
- [x] Prisma schema MUST include complete `Treatment` model with all related types.
- [x] Mapping of MongoDB types (BigInt, Date) to JSON-serializable formats MUST be consistent using `stringifyBigInt()`.
- [x] Router MUST be registered in `src/server/router.ts`.
- [x] Route MUST be created at `/manager/treatments-mongo/`.

## Data Model Criteria
- [x] `Treatment` model MUST include: `id`, `version`, `bookNumber`, `jNumber`, `type`, `state`, `hour`, `day`, `comment`, `archived`.
- [x] `Treatment` model MUST include date fields: `dateCreated`, `dateChanged`, `dateStart`, `dateStarted`, `dateInitial`, `dateStorno`, `closed`, `dateLastAppointment`.
- [x] `Treatment` model MUST include count fields: `countTotal`, `countFinished`, `countPlanned`, `reportCountInitial`, `reportCountRhytm`, `minutes`.
- [x] `Treatment` model MUST include related objects: `assigned`, `createdBy`, `changedBy`, `job`, `jobReport`, `jobReportPobatorik`, `customer`, `location`, `positions`.
- [x] `TreatmentJob` MUST include consultation boolean fields: `consultationStandard`, `consultationOnboarding`, `consultationOnboardingShort`, `consultationDocument`, `consultationIncarceration`, `defaultConsultation`, `defaultFurtherTreatment`.
- [x] `TreatmentPosition` MUST expose `report` (type `TreatmentReport`) with `date`, `type`, `consultationId`, `dateStart`, `dateEnd`, `job`.
- [x] `zTreatmentSchema` Zod schema MUST be the wire contract — no `as any[]` cast at the router boundary.
- [x] `TreatmentDetails` component MUST use the typed `Treatment` type (not `any`).
- [x] The detail pane MUST include a "Positions" section showing all positions with their report details in a scrollable container.

## Further Suggestions for Acceptance Criteria
- [ ] Filter by date range (dateStart/dateCreated).
- [ ] Filter by treatment state.
- [ ] Export current view to CSV/Excel.
- [ ] Show all appointments (not just first) in a list within the drawer.
