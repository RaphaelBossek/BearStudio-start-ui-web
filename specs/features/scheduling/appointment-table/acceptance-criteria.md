# Acceptance Criteria: Appointment Table View

## Functional Criteria
- [ ] The table MUST fetch data from the `appointment` collection in MongoDB.
- [ ] The table MUST support server-side pagination (page/limit).
- [ ] The table MUST support server-side sorting by start date, state, and title.
- [ ] The table MUST allow searching by appointment title or assigned expert name.
- [ ] The table MUST allow users to toggle the visibility of columns (e.g., `_id`, `state`, `type`, `job.title`, `customer.name`).
- [ ] Clicking on an "Inspect" or "Detail" button MUST open a sidebar (Drawer) or Modal showing the full JSON representation of the appointment.

## UI/UX Criteria
- [ ] Use `@tanstack/react-table` for table logic.
- [ ] Use shadcn/ui components for the table, dropdowns, and drawer.
- [ ] The table MUST be responsive and handle horizontal scrolling on smaller screens.
- [ ] Dates MUST be formatted in a human-readable way (e.g., `DD.MM.YYYY HH:mm`).
- [ ] Statuses (states) SHOULD be visually distinct (e.g., using badges with different colors).

## Technical Criteria
- [ ] Implement an oRPC endpoint `appointment.list` for paginated fetching.
- [ ] Implement an oRPC endpoint `appointment.byId` or similar for fetching full details if not already in the list.
- [ ] Mapping of MongoDB types (BigInt, Date) to JSON-serializable formats MUST be consistent.

## Further Suggestions for Acceptance Criteria
- [ ] Filter by date range (Start/End).
- [ ] Filter by appointment state.
- [ ] Export current view to CSV/Excel.
