# Feature: Create New Consultation

## Status: Planned
**Created:** 2026-03-21
**Last Updated:** 2026-03-21

## Dependencies
- Requires: [Edit Consultation Details](edit-consultation.md) (the form infrastructure)
- Requires: `expertConsultationTemplate` MongoDB collection accessible via Prisma
- Requires: [Audit Trail](audit-trail.md) (Planned)

## Timeline & Resources
- **Timeline:** 1 sprint
- **Required Resources:** Frontend developer, Backend developer

## View Classification
- [x] **Target User**: Doctor -> `/manager/*` route
- [x] **Navigation**: "New Consultation" button on the consultation list page
  - Section: Application
  - Icon: `PlusIcon`
  - Label: New Consultation

## Functional Requirements
- FR-C1: User clicks "New Consultation" from the list page.
- FR-C2: A dialog/drawer presents the user with consultation type selection and available templates.
- FR-C3: User selects a consultation type (STANDARD, ONBOARDING, INCARCERATION, TREATMENT, DOCUMENT, EXTERNAL, ONBOARDING_SHORT).
- FR-C4: User optionally selects an `expertConsultationTemplate` to pre-fill fields.
- FR-C5: A new consultation is created in Neon annotations with a generated ID and the selected type.
- FR-C6: The user is redirected to the detail view in edit mode for the new consultation.
- FR-C7: Only Doctors can create new consultations.

## Technical Requirements

### Backend
- TR-C1: Add ORPC procedure `consultationAnnotation.create` that:
  1. Generates a unique consultation ID.
  2. Creates a Neon annotation row with type, initial section data from template (if selected).
  3. Returns the new consultation ID.
- TR-C2: Add ORPC procedure `expertConsultationTemplate.list` to fetch available templates from MongoDB.
- TR-C3: Role check: only Doctor role can call create.
- TR-C4: Audit log entry for consultation creation.

### Frontend
- TR-C5: "New Consultation" button on list page header.
- TR-C6: Type selection step using radio group or select.
- TR-C7: Template picker showing available templates filtered by type.
- TR-C8: After creation, navigate to `/manager/consultation-data/{id}` with edit mode active.

## User Interface/Experience Requirements
- UI-C1: Creation flow presented as a Dialog or Drawer (not a full-page form).
- UI-C2: Step 1: Select consultation type (required).
- UI-C3: Step 2: Select template (optional, "Blank" option available).
- UI-C4: Confirm button creates the consultation and redirects.

## User Stories

### US-C1: Create consultation from template
- **As a** Doctor, **I want to** create a new consultation by selecting a type and template **so that** I have a pre-filled form to complete.
  - **Acceptance Criteria:**
    - [ ] Type selection is required.
    - [ ] Template list fetched from `expertConsultationTemplate` collection.
    - [ ] Template pre-fills body, onboarding, and standard sections.
    - [ ] New consultation appears in list after creation.
  - **Definition of Done:**
    - [ ] API endpoint creates annotation row in Neon.
    - [ ] Audit log entry created.

### US-C2: Create blank consultation
- **As a** Doctor, **I want to** create a blank consultation without a template **so that** I can fill in all fields manually.
  - **Acceptance Criteria:**
    - [ ] "Blank" option available in template picker.
    - [ ] Creates consultation with only type set, all other fields empty.
    - [ ] Redirects to detail view in edit mode.

## Edge Cases
- Template has outdated fields not in current schema -> Ignore unknown fields during pre-fill.
- Network error during creation -> Show error, stay on list page.
- Duplicate rapid clicks on "Create" -> Debounce or disable button after first click.
- No templates available for selected type -> Allow blank creation only.
