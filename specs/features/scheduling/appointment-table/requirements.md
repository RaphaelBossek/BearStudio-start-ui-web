# Requirements: Appointment Table View

## Problem Space
Managing appointments efficiently requires a clear, sortable, and filterable overview of all scheduled sessions, shifts, and treatments. Currently, users need a high-level view that allows them to quickly identify the status of appointments and dive into details when necessary.

## Pain Points
- Difficulty in tracking appointment statuses (READY, STARTED, DONE, etc.) at scale.
- Lack of a centralized view for both individual appointments and shifts.
- No easy way to inspect the full data of an appointment without navigating away from the list.

## Business Impact
- Improved operational efficiency for administrators and managers.
- Better visibility into expert utilization and patient scheduling.
- Reduced time spent searching for specific appointment details.

## JTBD Hypothesis
**When** I am managing the daily schedule,
**I want to** view a comprehensive table of all appointments with dynamic column selection,
**So that** I can monitor the state of the clinic in real-time and quickly access detailed information for any session.

## Proposed Solution
A dynamic data table for the `appointment` entity, mirroring the functionality of the User Management Table, including:
- Server-side pagination, sorting, and filtering via oRPC.
- Dynamic column visibility.
- A "Detail Inspection View" (Drawer/Modal) to view the full appointment object.

## Out of Scope
- Creating or editing appointments (this is handled by other features).
- Deleting appointments.
- Bulk actions (to be considered in future iterations).

## Links
- [User Story](user-story.md)
- [Acceptance Criteria](acceptance-criteria.md)
