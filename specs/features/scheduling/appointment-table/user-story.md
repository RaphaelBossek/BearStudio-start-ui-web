# User Story: Appointment Table View

## Timeline & Resources
- **Estimation**: 5-8 Story Points
- **Role**: Admin / Manager

## Requirements

### Functional Requirements
1. **Appointment List Fetching**: Implementation of oRPC endpoint to fetch appointments with denormalized snapshots (`job`, `customer`, `location`).
2. **Dynamic Column Selection**: UI component to select which fields to display in the table.
3. **Detail Inspection View**: Implementation of a Drawer showing the formatted JSON/Tree of the appointment entity.
4. **Search and Filtering**: Search by title/expert and filter by status.

### Technical Requirements
1. **Prisma Schema**: Ensure `Appointment` and related types are correctly mapped in `schema-mongodb.prisma`.
2. **oRPC Service**: Create `appointment.ts` router for MongoDB appointment operations.
3. **Data Transformation**: Handle `BigInt` and `Date` serialization for the frontend.

### UI/UX Requirements
1. **Shadcn Table**: Robust implementation using TanStack Table and shadcn/ui.
2. **State Badges**: Color-coded badges for appointment states (e.g., `ACTIVE`=Blue, `DONE`=Green, `STORNO`=Red).
3. **Responsive Layout**: Sidebar-friendly table design.

## Acceptance Criteria
- [ ] `appointment.title` and `appointment.start` are clearly visible by default.
- [ ] Toggling columns works as expected without page reload.
- [ ] Clicking "Inspect" opens a sidebar with the full appointment object.
- [ ] Search works for appointment title.
- [ ] Status badges correctly reflect the `state` field.

## Definition of Done
- [ ] oRPC endpoints tested and working.
- [ ] Table renders correctly with real data.
- [ ] Detail view displays full object structure.
- [ ] PRD updated with the new feature.
