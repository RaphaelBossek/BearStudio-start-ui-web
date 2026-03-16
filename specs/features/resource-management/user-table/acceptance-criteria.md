# Acceptance Criteria - User Management Table View

## Functional Suitability
- [ ] The table MUST load users from the `videoclinic` MongoDB `user` collection.
- [ ] The table MUST display `user.userProfile.displayName` as the primary reference column.
- [ ] Users MUST be able to toggle the visibility of nested document fields as individual columns.
- [ ] Columns for array fields MUST only show a maximum of the first 3 entries.
- [ ] Clicking a row MUST open the user detail pane in the `ResizablePanel` using the `SectionedScrollLayout` component.
- [ ] The Detailed View MUST display all information from the user document, including all nested levels.

## Usability
- [ ] The table MUST support full-text search.
- [ ] The table MUST support offset-based pagination.
- [ ] The table MUST support sorting on at least the `displayName` and creation/change dates.
- [ ] The Detailed View SHOULD be easily readable (e.g., using a Datalist or Tree component).

## Performance (ISO/IEC 25010)
- [ ] Data fetching MUST be optimized to handle the large nested documents efficiently.
- [ ] Table rendering SHOULD remains smooth even when many columns are enabled.

## Edge Cases
- [ ] Handle users with missing `userProfile` (fallback to `username` or `ID`).
- [ ] Handle empty arrays gracefully in columns.
- [ ] Handle very large nested values in the detail view without crashing the UI.
