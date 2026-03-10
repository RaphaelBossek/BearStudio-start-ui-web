# User Story: User Management Table View

## Timeline & Resources

- **Estimation**: 5-8 Story Points
- **Role**: Admin / Manager

## Requirements

### Functional Requirements

1. **User List Fetching**: Implementation of oRPC endpoint to stream/fetch users with nested data.
2. **Dynamic Column Selection**: UI component to select which nested fields to display in the table.
3. **Array Truncation Logic**: Frontend/Backend transform to limit array display to 3 items.
4. **Detail Inspection View**: Implementation of a Drawer/Modal showing the full JSON or formatted tree of the user entity.

### Technical Requirements

1. **Prisma Schema Update**: Add `UserProfile`, `EmployeeProfile`, `EmployerProfile`, `TotpDevice`, etc., to `schema-mongodb.prisma`.
2. **oRPC Service**: Create `user.ts` router for MongoDB user operations.
3. **Transformation Layer**: Map MongoDB `BigInt` and `Date` types to JSON-serializable formats.

### UI/UX Requirements

1. **General Principles**: Follow the [Table View UI Principles](../../../rules/table-view.md).

## Acceptance Criteria

- [ ] `user.userProfile.displayName` correctly identifies the user.
- [ ] Toggling a nested field (e.g., `employeeProfile.bank`) adds/removes that column.
- [ ] Skills array in a column shows `Skill 1, Skill 2, Skill 3` and no more, even if 10 exist.
- [ ] Clicking "Inspect" opens a sidebar with the full user object.
- [ ] Search works for display name.

## Definition of Done

- [ ] Unit tests for data transformation logic.
- [ ] Manual verification of column toggling and detail view.
- [ ] PRD and `db-mapping.md` updated if necessary.
