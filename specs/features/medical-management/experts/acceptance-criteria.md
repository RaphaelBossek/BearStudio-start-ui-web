# Acceptance Criteria: Expert Profiles

## Functional AC
- [ ] Experts can toggle their availability between Yes, No, and Unknown in the calendar.
- [ ] Profile completeness indicator (warns if billing or qualification data is missing).
- [ ] Experts can upload and delete certificates for their skills.
- [ ] Changing status to "Sick Leave" requires mandatory Start and End dates.
- [ ] Validation of IBAN and Tax ID formats.
- [ ] The calendar correctly displays shifts based on the service type (Readiness vs. Consultation vs. Therapy).

## Edge Cases
- [ ] Preventing profile deactivation if the expert has future scheduled assignments.
- [ ] Handling time zone differences for shift start/end times if applicable.
- [ ] Ensuring only one billing address per "Address Type" can be active.
