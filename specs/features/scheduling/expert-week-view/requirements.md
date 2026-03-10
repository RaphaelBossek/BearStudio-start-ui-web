# Expert Week View

## Problem Space & Motivation

The application currently lacks a way to view the weekly availability and shift definitions of experts stored in the secondary MongoDB database (`videoclinic` database, `expertWeek` collection). Administrators or managers need to see this data to understand when experts are scheduled for treatments or shifts.

## Job to be Done (JTBD)

**When** I am managing expert schedules,
**I want to** view a comprehensive list of all expert week schedules
**So that** I can easily search, filter, and review the availability of experts across different days of the week.

## Proposed Solution

- Add a read-only connection to the legacy MongoDB database using Prisma.
- Implement a backend endpoint (`orpc`) to fetch and search `expertWeek` data.
- The backend will also resolve the `userId` to the expert's `UserProfile.displayName` by querying the `user` collection.
- Create a new frontend page under the `app` layout with a data table component following the [Table View UI Principles](../../../rules/table-view.md).
- Transform the 1-24 hour integer arrays for weekdays into readable time ranges (e.g., `8-11, 13-15`).

## Out of Scope

- Editing, creating, or deleting `expertWeek` records (feature is strictly read-only).
- Modifying the underlying MongoDB schema.

## Links

- [Acceptance Criteria](./acceptance-criteria.md)
- [User Stories Breakdown](./user-story-expert-week-table.md)
