# User Story Breakdown: Expert Week Table

## Timeline & Resources
- **Timeline**: 1-2 days
- **Resources**: Backend Developer (Secondary Prisma setup, routing), Frontend Developer (Table view, parsing logic).

## Functional Requirements
- Connect to the secondary `videoclinic` MongoDB using Prisma (`expertWeek` and `user` collections).
- Create an oRPC list endpoint with limit, cursor/page parameter, sorting logic, and search filtering.
- Create a Next.js (TanStack) Router page containing the shadcn data-table.
- Display `userId` as the `UserProfile.displayName` (fallback to `Unknown User #[userId]`).
- Display arrays of `slotsMo`..`slotsSu` mapped to `HH-HH, HH-HH` format.
- Implement UI Controls: Page Size Selector (25, 50, 100), Next/Previous page, Global Search input (including displayName w/ diacritic support), Column Visibility Dropdown.
- Provide a dedicated Error State component with a reload button.

## Technical Requirements
- Configure dual-Prisma setup in `package.json` to generate `schema-mongodb`.
- Define `schema-mongodb.prisma` mappings for `ExpertWeek` and `User` (to fetch profile details).
- Utility functional pipeline for processing the `[8, 9, 10, 13, 14, 18, 19, 20, 21]` arrays into strings like `"8-11, 13-15, 18-22"`.

## UI/UX Requirements
- Consistent with existing layout (Sidebar Navigation for Manager/App).
- Provide feedback tags/skeletons while data is loading.

## Story 1: Database Setup and Basic Backend Query
**As a** backend developer
**I want to** configure Prisma to communicate with the `videoclinic` MongoDB and create a basic `list` endpoint
**So that** the frontend can request `expertWeek` schedules and user profiles.

**Acceptance Criteria:**
- `MONGODB_URL` is parsed by `schema-mongodb.prisma`.
- `expertWeek` and `user` models mapped correctly.
- Endpoint `expertWeek.list` returns `{ items, nextCursor, total }`.

## Story 2: Resolver for User Profiles & Time Formatting
**As a** backend developer
**I want to** format the returned MongoDB data (resolving the user's display name and formatting the hours arrays)
**So that** the frontend can directly render exactly what the user should see.

**Acceptance Criteria:**
- `userId` is exchanged for `UserProfile.displayName` (or combined names).
- Missing `user` records fall back to `"Unknown User #[userId]"`.
- If `slotsWe` is `[8, 9, 10]`, it is transformed to `"8-11"`.
- If `slotsWe` is `[]`, it is transformed to `"N/A"`.

## Story 3: Frontend Data Table Implementation
**As an** administrative user
**I want to** navigate to "Expert Weeks" and view the schedules in a modern table, and handle failures gracefully
**So that** I can effectively browse shifts and resolve transient errors.

**Acceptance Criteria:**
- Navigation item added.
- Table uses shadcn/ui components (`@tanstack/react-table`).
- `_id` and `version` columns can be shown/hidden via user controls, default hidden.
- Pagination controls are active and default to 25 rows (selectable up to 100).
- If the data fetch completely fails, a dedicated error state is shown instead of the table, featuring a "Reload" button.

## Story 4: Search and Sorting
**As an** administrative user
**I want to** filter text and sort the rows
**So that** I can easily find a specific expert or specific day patterns.

**Acceptance Criteria:**
- Input typing triggers a debounce search against text columns.
- Clicking column headers changes `sort_by` and `sort_direction` via API request.
