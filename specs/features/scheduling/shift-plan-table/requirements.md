# Requirements: Shift Plan Table View

## Problem Space
Managing recurring shift schedules for expert on-call duties requires clear visibility into shift configurations, time allocations, and pricing types. Administrators need to efficiently track and inspect shift plans that define when and how experts are scheduled for on-call availability.

## Pain Points
- No centralized view for managing recurring shift schedules across all experts.
- Difficulty in identifying shift patterns (day of week, time ranges, pricing types) at a glance.
- Lack of visibility into which shift plans are active vs. inactive.
- No easy way to inspect the full configuration of a shift plan, including assigned locations, jobs, and preferred expert lists.
- Cannot quickly search or filter shift plans by name, day of week, or status.

## Business Impact
- Improved operational efficiency for scheduling administrators and managers.
- Better visibility into expert on-call duty coverage patterns.
- Reduced time spent searching for specific shift plan configurations.
- Enhanced ability to identify gaps or conflicts in shift coverage.
- Faster onboarding of new administrators through clear visualization of shift structures.

## JTBD Hypothesis
**When** I am managing expert on-call schedules,
**I want to** view a comprehensive table of all shift plans with search, filtering, sorting, and detail inspection,
**So that** I can efficiently monitor shift coverage patterns, identify scheduling gaps, and quickly access detailed configuration for any shift plan.

## Proposed Solution
A dynamic data table for the `shiftPlan` entity that follows the established table view patterns, including:
- Server-side pagination, sorting, and filtering via oRPC.
- Dynamic column visibility with default columns optimized for shift management.
- Full-text search by shift plan name.
- Filtering by:
  - Status (active/inactive)
  - Day of week (MONDAY through SUNDAY)
  - Price type (WEEKDAY, WEEKNIGHT, WEEKENDDAY, WEEKENDNIGHT)
- A "Detail Inspection View" (Drawer) to view the full shift plan object including:
  - Time range configuration (start/end hours)
  - Assigned job and location details
  - Preferred expert list
  - Audit information (created/changed by, timestamps)
  - Version history tracking

## Out of Scope
- Creating or editing shift plans (CRUD operations to be considered in future iterations).
- Deleting shift plans.
- Bulk actions on multiple shift plans.
- Conflict detection or validation across shift plans.
- Integration with expert availability calendars.
- Automatic shift plan generation or optimization.

## Dependencies
- Requires: MongoDB Prisma schema with `ShiftPlan` model
- Requires: oRPC router endpoint for `shiftPlan` queries
- Follows patterns from: [Appointment Table](../appointment-table/requirements.md), [User Table](../../resource-management/user-table/requirements.md)

## Links
- [User Story](user-story.md)
- [Acceptance Criteria](acceptance-criteria.md)
