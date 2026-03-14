# Requirements: Treatment Table View

## Problem Space
Managing treatments efficiently requires a clear, sortable, and filterable overview of all treatment records. Currently, users need a centralized view to track treatment statuses, view associated appointments, and inspect full treatment data without navigating away from the list.

## Pain Points
- No centralized view to track treatment statuses (ACTIVE, DONE, CLOSED, CANCELED, etc.) at scale.
- Difficulty in finding treatments by book number, J-number, customer, location, or assigned staff.
- No easy way to view associated appointments for a treatment without complex navigation.
- Lack of visibility into treatment progress (finished vs total appointments).

## Business Impact
- Improved operational efficiency for administrators and managers tracking treatment progress.
- Better visibility into treatment assignments and customer relationships.
- Reduced time spent searching for specific treatment details or associated appointments.
- Streamlined workflow for viewing treatment-to-appointment relationships.

## JTBD Hypothesis
**When** I am managing treatments and their associated appointments,
**I want to** view a comprehensive table of all treatments with dynamic column selection and appointment access,
**So that** I can monitor treatment progress in real-time, find specific treatments quickly, and view their associated appointments.

## Proposed Solution
A dynamic data table for the `treatment` entity from MongoDB, mirroring the functionality of the Appointment Table, including:
- Server-side pagination, sorting, and filtering via oRPC.
- Dynamic column visibility with "more..." drawer (15+ fields).
- Search across bookNumber, jNumber, customer.name, location.name, and assigned.name.
- A "Detail Inspection View" (Drawer) to view the full treatment object with categorized tabs.
- Calendar icon to fetch and view associated appointments via the `treatmentId` relationship.

## Out of Scope
- Creating or editing treatments (this is handled by other features).
- Deleting treatments.
- Bulk actions on treatments.
- Advanced filtering by date ranges (future iteration).

## Links
- [User Story](user-story.md)
- [Acceptance Criteria](acceptance-criteria.md)
