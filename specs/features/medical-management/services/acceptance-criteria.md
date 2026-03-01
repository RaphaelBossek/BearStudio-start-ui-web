# Acceptance Criteria: Service Management

## Functional AC
- [ ] Users can create a service with three different titles: internal, expert-facing, and billing-facing.
- [ ] Ability to assign a color and sort index to each service.
- [ ] Users can select a billing modality (Patients, Time, or Expert+Time).
- [ ] Users can assign a specialty (Fachrichtung) from a predefined list.
- [ ] The system allows setting one "Consultation Type" as the default.
- [ ] Admin can configure if "Any" or "All" selected skills are required for an expert to perform this service.

## Edge Cases
- [ ] Deactivating a service that is currently used in active schedules.
- [ ] Validation for required fields.
- [ ] Uniqueness check for internal service names.
