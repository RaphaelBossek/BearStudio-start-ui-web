# Requirements: Service Management

## JTBD Hypothesis
**When** I am an administrator,
**I want to** define and categorize medical services (Dienstleistungen),
**So that** they can be correctly scheduled, billed, and assigned to experts with the right skills.

## Problem Space
Services need specific metadata for billing (Patients, Time, Expert+Time), medical categorization (Fachrichtung), and expert requirements (Skills). Without a structured definition, billing errors occur and unqualified experts might be assigned to services.

## Success Metrics
- 100% accuracy in billing modality assignment.
- Zero assignments of services to experts missing required skills.
- Consistent UI display of internal vs. invoice names.

## Technical & Functional Requirements
A service definition must include:
- **Title**:
  - Internal name (system)
  - Name shown to Expert
  - Name on Invoice
- **Short Name**: Abbreviated label.
- **Color**: UI representation.
- **Sort Order**: Position in lists.
- **Billing Modality**:
  - Patients (Readiness/Bereitschaft)
  - Time (Consultation/Therapy)
  - Expert + Time (Consilium)
- **Medical Specialty (Fachrichtung)**:
  - Allgemeinmedizin, Psychiatrie, Dermatologie, Substitution, Psychotherapie, Physiotherapie.
- **Consultation Types**:
  - Options: extern, Konsiliarbericht, Normale Konsultation, Komplette Zugangsuntersuchung, Kurze Zugangsuntersuchung, Gewahrsamstauglichkeit.
  - One must be selectable as default.
- **Pre-settings for follow-up**:
  - Einweisung, Wiedervorstellung, Folgetermin, Überweisung.
- **Required Skills**:
  - Selection of skills required for the expert.
  - Logic: "At least one" or "All" required skills.
