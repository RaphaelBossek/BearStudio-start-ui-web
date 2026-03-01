# Requirements: Expert Profiles

## JTBD Hypothesis
**When** I am an expert,
**I want to** manage my profile and availability,
**So that** I can be scheduled for services and receive notifications about my assignments.

## Problem Space
Expert data is scattered across multiple locations (personal info, qualifications, billing, availability). A centralized profile is needed to manage everything from certifications to shift preferences.

## Success Metrics
- 100% of experts have completed profiles.
- Zero billing errors due to missing bank information.
- Accuracy in availability display for scheduling.

## Technical & Functional Requirements

### Personal & Account Info
- Name, First Name, Academic Title, Salutation.
- Secure login credentials.
- Account status: Active, Pre-registered, Sick leave, Inactive.
- Contact: Primary/Secondary Email, Phone (for readiness).
- Notifications: Email forwarding toggle.
- Signature image upload.

### Professional Info
- Career start dates: General, VideoClinic start/end.
- Specialty & Experience in Addiction Medicine (very high to very low).
- Qualification level: Onboarding, Beginner, Amateur, Professional.
- SecureBox credentials.

### Billing & Legal
- Debit numbers/accounts (GKTO/GKTK).
- EFN (Education Number).
- AVV Agreement date.
- VAT number, Tax ID.
- IBAN, BIC, Bank Name.
- Invoice addresses (Home, Office, etc.).
- Subscribed goods list.

### Qualifications
- List of skills with attainment dates.
- Document/certificate uploads for each skill.
- Assigned exclusion criteria.

### Availability & Calendar
- Shift types:
  - Readiness (Bereitschaft): Morning (8-13), Afternoon (13-18), Night (18-8 next day).
  - Consultation (Sprechstunde): Morning, Afternoon.
  - Therapy: (8-18), no shifts.
- Availability states: Unknown, Yes, No.
- Yearly calendar view for availability and scheduled assignments.
