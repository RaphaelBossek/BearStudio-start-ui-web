# User Story: Treatment Table View

## Timeline & Resources

- **Estimation**: 5-8 Story Points
- **Role**: Admin / Manager

## Requirements

### Functional Requirements

1. **Treatment List Fetching**: Implementation of oRPC endpoint to fetch treatments with denormalized snapshots (`assigned`, `job`, `customer`, `location`, `positions`).
2. **Dynamic Column Selection**: UI component to select which fields to display in the table (15+ fields require "more..." drawer).
3. **Detail Inspection View**: Implementation of a Drawer showing categorized tabs (General, Timing, Participants, Location/Job, Counts, Positions, Raw Data) of the treatment entity. The Positions tab renders all positions with their report details in a scrollable container supporting 90+ positions.
4. **Appointment Association**: Calendar icon to fetch and display associated appointments via `appointment.treatmentId` relationship.
5. **Search and Filtering**: Search by bookNumber, jNumber, customer name, location name, and assigned staff name.
6. **Status Visualization**: Color-coded badges for treatment states.

### Technical Requirements

1. **Prisma Schema**: Ensure `Treatment` model and all related types (`TreatmentUser`, `TreatmentJob`, `TreatmentCustomer`, `TreatmentLocation`, `TreatmentPosition`, `TreatmentReport`, etc.) are correctly mapped in `schema-mongodb.prisma`. `TreatmentJob` includes consultation boolean fields (`consultationStandard`, `consultationOnboarding`, `consultationOnboardingShort`, `consultationDocument`, `consultationIncarceration`) and string defaults (`defaultConsultation`, `defaultFurtherTreatment`).
2. **oRPC Service**: Create `treatment-mongo.ts` router with `list`, `get`, and `getAppointmentsByTreatmentId` procedures.
3. **Data Transformation**: Handle `BigInt` and `Date` serialization using `stringifyBigInt()` pattern for the frontend.
4. **Bidirectional Relationship**: Query appointments by `treatmentId` to display associated appointments.

### UI/UX Requirements

1. **General Principles**: Follow the [Table View UI Principles](../../../rules/table-view.md).
2. **State Badges**: Color-coded badges for treatment states:
   - `ACTIVE` = `positive` (blue)
   - `CLOSED`/`DONE` = `secondary` (green)
   - `CANCELED`/`STORNO` = `negative` (red)
   - `LOCKEDIN`/`REQUESTED` = `warning` (yellow)
3. **Default Sort**: `dateCreated: 'desc'` (most recent first).
4. **Sortable Columns**: `id`, `bookNumber`, `state`, `dateStart`, `dateCreated`.

## Acceptance Criteria

- [x] `treatment.bookNumber` and `treatment.state` are clearly visible by default.
- [x] Toggling columns works as expected without page reload.
- [x] Clicking "Inspect" (eye icon) opens a sidebar with categorized treatment details.
- [x] Clicking "Calendar" icon fetches and displays the first associated appointment.
- [x] Search works for bookNumber, jNumber, customer, location, and assigned staff.
- [x] Status badges correctly reflect the `state` field with appropriate colors.
- [x] Treatment count columns show `finished/total` format.

## Definition of Done

- [x] oRPC endpoints tested and working (`list`, `get`, `getAppointmentsByTreatmentId`).
- [x] Prisma schema updated with Treatment model and all related types.
- [x] Table renders correctly with real MongoDB data.
- [x] Detail view displays full object structure with categorized tabs (including Positions tab with per-position report details).
- [x] Appointment drawer displays appointment details when calendar icon clicked.
- [x] PRD updated with the new feature.
