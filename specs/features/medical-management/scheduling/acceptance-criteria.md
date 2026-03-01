# Acceptance Criteria: Consultation Scheduling

## Functional AC
- [ ] Users can create a consultation slot with all required fields (Service, Weekday, Start Date, Expert, etc.).
- [ ] The system correctly calculates recurring dates based on the "Recurrence Type" selected (e.g., every 2nd Tuesday).
- [ ] Experts cannot be overbooked (warning or prevention when times overlap).
- [ ] Locations cannot be double-booked for the same time slot.
- [ ] Users can add comments to specific schedule entries.

## Edge Cases
- [ ] Handling month-end recurrences when the month has fewer than 31 days.
- [ ] Deleting a series vs. deleting a single occurrence.
- [ ] Validation for start time being before end time.
- [ ] Validation for "Last Recurrence Date" being after "Start Date".
