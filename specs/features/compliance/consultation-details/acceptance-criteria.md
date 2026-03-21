# Common Acceptance Criteria: Consultation Details

## Summary
Criteria indicating successful implementation of the consultation details CRUD feature across all user stories.

## General Criteria
- [ ] All consultation data reads merge MongoDB source data with Neon annotation overrides on the server side before returning to the client.
- [ ] All writes from the UI persist exclusively to Neon PostgreSQL (no direct MongoDB writes from the UI).
- [ ] The MongoDB `consultationData` collection is treated as immutable source of truth.
- [ ] Only authenticated users with the Doctor role can perform edit/create/archive operations.
- [ ] Consultations in CLOSED state are read-only (edit/archive buttons hidden or disabled).
- [ ] Consultations in OPEN, CREATED, REPORTED, TRANSMITTED, and VERIFIED states allow editing.
- [ ] Every mutation (create, edit, archive) produces an audit log entry in Neon with: user ID, timestamp, consultation ID, field path, old value, new value.
- [ ] Form validation uses hybrid strictness: enum fields validate against known values, optional fields can be empty, required fields are enforced.
- [ ] Last-write-wins strategy: no optimistic locking or conflict resolution required.

## Data Integrity Criteria
- [ ] Server-side merge correctly overlays Neon annotation values on top of MongoDB source values for every field.
- [ ] If a Neon annotation column is NULL for a section, the entire section falls back to MongoDB source data.
- [ ] Nested array overrides (e.g., diagnoses, prescriptions) replace the entire array from MongoDB when provided in annotations.
- [ ] Date fields are stored in ISO 8601 format in Neon annotations.
- [ ] BigInt MongoDB `_id` values are consistently serialized as strings across all API responses.

## UI/UX Criteria
- [ ] Detail view uses `SectionedScrollLayout` with section-based navigation consistent with existing implementation.
- [ ] Edit mode is toggled with a single "Edit" button in the top bar; all fields become editable simultaneously.
- [ ] Cancel discards all unsaved changes and resets to last-saved state.
- [ ] Save persists all changed fields in a single API call.
- [ ] Loading states displayed during save operations.
- [ ] Error states displayed with meaningful messages on save failure.
- [ ] Empty/missing fields display "---" in read-only mode.

## Performance Criteria
- [ ] Consultation list queries use the `consultation` collection (with compound index on `{ period, location._id }`).
- [ ] Detail view loads and merges data within 500ms for a typical consultation.
- [ ] Save operation completes within 1 second.

## Security Criteria
- [ ] All API endpoints require authenticated session (Better Auth).
- [ ] Role check enforced server-side (not just UI-based hiding).
- [ ] State check enforced server-side (reject edits to CLOSED consultations).
- [ ] No sensitive patient data exposed in client-side error messages.

## Further Suggestions
- **Further Suggestions for Acceptance Criteria:**
  - Consider adding rate limiting on the update endpoint to prevent bulk automated edits.
  - Consider field-level dirty tracking to only persist changed fields rather than full-section overrides.
  - Consider adding a "diff view" mode that highlights which fields have Neon overrides vs MongoDB source values.
- **Further Suggestions for Hypotheses:**
  - Doctors may want to "undo" an annotation override and revert to the original MongoDB value for specific fields.
  - A "review pending changes" step before save may reduce accidental modifications in medical records.
