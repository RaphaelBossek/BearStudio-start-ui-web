# Frontend Implementation Plan: Expert Week View

This plan outlines the frontend implementation for the Expert Week View, including the UI table, pagination, search functionality, and page routing.

## Proposed Changes

### 1. Dependencies
- **Install** `@tanstack/react-table` (`pnpm add @tanstack/react-table`) to power the data table.
- **Components Needed**: We will utilize existing `shadcn/ui` components (like `Table`, `Input`, `Button`, `DropdownMenu`, etc.) or install them using `npx shadcn@latest add <name> --yes` if any are missing.

---

### 2. Feature Components
`src/features/expert-week/manager`
#### [NEW] [expert-weeks-table.tsx](file:///home/raphael/src/vc/BearStudio-start-ui-web/src/features/expert-week/manager/expert-weeks-table.tsx)
- Reusable `DataTable` component built with `@tanstack/react-table`.
- **Columns**: `_id` (hidden by default), `type`, `userId` (`userDisplayName`), `slotsMo`...`slotsSu` (formatted using `formatSlotRanges`), `version` (hidden by default), `dateCreated`, `dateChanged`.
- **Features**: 
    - Full-text search input (debounced).
    - Sorting by clicking on column headers (dateCreated, dateChanged, userDisplayName).
    - Pagination controls (Page size selector: 25, 50, 100, Next/Prev).
    - Column visibility dropdown to show/hide `_id` and `version`.
- **Error State**: A dedicated error view featuring a "Reload" button that retries the query when the data fetch fails.

#### [NEW] [page-expert-weeks.tsx](file:///home/raphael/src/vc/BearStudio-start-ui-web/src/features/expert-week/manager/page-expert-weeks.tsx)
- The main feature container component. 
- Integrates the `orpc` endpoint (`orpc.expertWeek.list.useQuery`) to fetch the list of `expertWeek` entries.
- Passes data, loading state, error state, pagination, and sorting props down to `expert-weeks-table.tsx`.

---

### 3. Routing
`src/routes/manager`
#### [NEW] [expert-weeks/index.tsx](file:///home/raphael/src/vc/BearStudio-start-ui-web/src/routes/manager/expert-weeks/index.tsx)
- Register the new route for TanStack router (`/manager/expert-weeks`).
- Include `zod` validation for search middleware (search, limit, cursor, sortBy, sortOrder).
- Map to `PageExpertWeeks`.

---

### 4. Layout
`src/layout/manager`
#### [MODIFY] [nav-sidebar.tsx](file:///home/raphael/src/vc/BearStudio-start-ui-web/src/layout/manager/nav-sidebar.tsx)
- Add a new navigation entry for "Expert Weeks" pointing to `/manager/expert-weeks`.
- Locate this under the relevant navigation section.

---

## Verification Plan

### Automated Tests
1. Run `pnpm typecheck` to verify no TypeScript issues.
2. Run `pnpm lint:biome` to verify code format.

### Manual Verification
1. Access the app and log in if necessary.
2. Navigate to the App menu -> Manager area -> "Expert Weeks" sidebar link.
3. Validate the `expertWeek` list is displayed with correctly formatted time slots.
4. Test **pagination**: Check "25/50/100" elements and use the Next/Prev buttons.
5. Test **column visibility**: Toggle the visibility of the `_id` and `version` columns.
6. Test **search**: Enter text including a diacritic (e.g., 'ö' instead of 'o') into the global search. Ensure the user resolver fallback ("Unknown User #[userId]") is displayed appropriately for missing users.
7. Test **sorting**: Click headers (like `userDisplayName`) to see rows sort correctly.
8. Test **error flow**: Manually block network requests in DevTools for the API to verify the dedicated error component pops up with a working "Reload" button.
