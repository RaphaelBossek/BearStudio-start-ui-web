# User Management Table View

## Problem Space & Motivation
Managers and administrators need a central interface to view and inspect user data from the legacy `videoclinic` MongoDB. The current system lacks a comprehensive user list that allows for deep inspection of nested profiles (User, Employee, Employer) and security-related data (TOTP, Login history). The data is complex and deeply nested, making a standard flat table insufficient.

## Job to be Done (JTBD)
**When** I am auditng or managing system users,
**I want to** view a flexible table of all users with the ability to toggle visibility of nested fields,
**So that** I can focus on the specific information I need (e.g., billing details, qualifications, or security status) and quickly jump into a detailed view for any specific user.

## Proposed Solution
- **Dynamic Data Table**: A TanStack Table implementation that allows selecting nested fields as columns.
- **Nested Field Mapping**: Support for `userProfile`, `employeeProfile`, `employerProfile`, `totpDevice`, and `totpActivity`.
- **Reference Column**: `user.userProfile.displayName` will serve as the primary identifier/reference in the table.
- **Array Handling**: For fields containing arrays (e.g., `invalidLogins`, `successfulLogins`, `skills`, `customers`), the table view will display a maximum of the first 3 entries to maintain layout integrity.
- **Detailed View**: A sidebar (Drawer) or Modal that provides a formatted, tree-like view of the entire User document and all its nested elements for deep inspection.
- **Search & Filter**: Full-text search on `displayName` and other key fields.
- **Pagination & Sorting**: Offset-based pagination and sorting on relevant columns.

## Out of Scope
- Editing user data (View-only for this phase).
- Managing user roles or permissions (beyond viewing them).
- Password resets or security actions (inspection only).

## Dependencies
- Requires: Connection to `videoclinic` MongoDB (via Prisma).
- Requires: Expanded `prisma/schema-mongodb.prisma` to include all nested user types.

## Links
- [Acceptance Criteria](./acceptance-criteria.md)
- [User Stories](./user-story-user-table.md)
