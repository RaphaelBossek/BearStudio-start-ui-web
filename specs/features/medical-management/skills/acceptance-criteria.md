# Acceptance Criteria: Skill Management

## Functional AC
- [ ] Users can create a skill and categorize it as Specialty, Training, Education, or Language.
- [ ] Users can toggle the "Active" status of a skill or exclusion criterion.
- [ ] Users can specify if a certificate is mandatory for a particular skill.
- [ ] Users can assign a numeric weighting to exclusion criteria.
- [ ] Deactivating a skill should trigger a warning if it is currently assigned to experts or required by services.

## Edge Cases
- [ ] Validation for numeric weighting (e.g., must be within a specific range if applicable).
- [ ] Handling deletion of skills that are referenced in historical service logs.
