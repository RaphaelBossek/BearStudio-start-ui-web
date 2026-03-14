# Table View UI Principles

This document defines the general requirements and UI principles for all data table views within the application.

## Core Technology Stack

- **Library**: [@tanstack/react-table](https://tanstack.com/table)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (specifically the `Table` component)

## Functional Requirements

### 1. Data Retrieval and Navigation

- **Pagination**: Implement offset-based pagination (`page` and `limit` parameters).
- **Page Sizes**: Support configurable page sizes (e.g., 25, 50, 100).
- **Sorting**: Enable column-based sorting for all relevant data fields.
- **Search & Filtering**:
  - Provide full-text search (e.g., by name, title) and status-based filtering.
  - **Visibility**: Search and filter controls must ALWAYS be visible above the table.
  - **Scope**: Search/filtering applies ONLY to the columns currently visible in the UI.
  - **Data Depth**: Search/filtering must query ALL rows (server-side), not just the visible page.
- **Navigation Controls**:
  - The bottom navigation bar (Next/Prev, Page Size) must ALWAYS be visible.
  - **Pagination Slider**: Include page-number chips/slider (e.g., `1, 2, 3, ... 9, 10`) below the table.
  - **Logic**: The slider must dynamically update based on the current page size and the total number of pages.

### 2. Interaction and Visibility

- **Column Selection**:
  - Include a dropdown menu to toggle column visibility.
  - **Default State**: All available columns must be selected by default unless explicitly specified otherwise.
  - **Overflow (> 9 columns)**: If more than 9 columns exist, add a "more..." option at the bottom of the dropdown.
  - **"more..." Action**: Selecting "more..." opens a **Drawer** (or Modal) containing a checklist of all available columns.
- **No Page Reloads**: Column toggling and other table interactions must happen without full page refreshes.
- **Detail Inspection**: Every row should provide an "Inspect" action that opens a **Drawer** displaying the full, formatted JSON/Tree structure of the entity.

## Data Presentation Principles

### 1. Formatting

- **Status Badges**: Use color-coded badges for entity states (e.g., `ACTIVE`=Blue, `DONE`=Green, `STORNO`=Red).
- **Array Truncation**: Truncate array displays (e.g., tags, skills) to a maximum of **3 items**.
- **Human-Readable Data**: Transform raw data (e.g., 1-24 hour arrays) into readable formats (e.g., `8-11, 13-15`).

### 2. Layout and UX

- **Responsive Design**: Tables must be scrollable and readable on desktop and tablets.
- **Sidebar Compatibility**: Ensure the table remains usable within multi-pane/sidebar layouts.

## Rules for Coding Agents

When implementing or modifying a table view, follow these strict rules to maintain consistency:

1. **Framework**: Use `@tanstack/react-table` + `shadcn/ui`.
2. **Data Fetching**: Always use `oRPC` with offset-based pagination.
3. **Default Visibility**: Enable ALL columns by default.
4. **Column Selection UI**:
   - Use the standard dropdown for <= 9 columns.
   - Implement the "more..." Drawer for > 9 columns.
5. **Always Visible UI**: Ensure search, filters, and pagination controls (including the breadcrumb slider) are NOT hidden during scrolling or data fetching.
6. **Server-side Scope**: Filters must trigger a backend query that searches matching rows across the entire dataset, but filtered results are restricted to data present in visible columns.

## Route Breadcrumb Clarification (TanStack Router)

The pagination slider in table views is **not** the app-level route breadcrumb.

- Route breadcrumbs (top bar navigation hierarchy) must be driven by TanStack Router `staticData.breadcrumb` + `useMatches()`.
- Table pagination chips (`1, 2, 3, ...`) remain part of table pagination UX and are independent from route hierarchy navigation.
- Do not derive route breadcrumbs from table pagination state.

---

## TanStack Table Implementation Details

When using TanStack React Table v8 with manual pagination controlled by URL search params, it's **critical** to properly memoize all props and callbacks to avoid unexpected state updates and UI inconsistencies.

### Required Memoization Pattern

**In parent page components:**
```typescript
// Memoize pagination state
const pagination = useMemo(() => ({
  pageIndex: (props.search.page ?? 1) - 1,
  pageSize: props.search.limit ?? 25,
}), [props.search.page, props.search.limit]);

// Memoize sorting state
const sorting = useMemo(() =>
  props.search.sortBy
    ? [{ id: props.search.sortBy, desc: props.search.sortOrder === 'desc' }]
    : []
, [props.search.sortBy, props.search.sortOrder]);

// Memoize all navigation handlers
const handlePaginationChange = useCallback((newPagination) => {
  router.navigate({ /* ... */ });
}, [router]);

const handleSortingChange = useCallback((newSorting) => {
  router.navigate({ /* ... */ });
}, [router]);

const handleGlobalFilterChange = useCallback((value) => {
  router.navigate({ /* ... */ });
}, [router]);
```

**In table wrapper components:**
```typescript
// Memoize columns — CRITICAL: inline column definitions recreate the array every render,
// causing React Table to reinitialize and reset pageIndex to 0.
const columns: ColumnDef<Row>[] = useMemo(() => [
  // ... column definitions ...
  {
    id: 'actions',
    cell: (info) => <Button onClick={() => onInspect(info.row.original)} />,
  },
], [onInspect]); // include any callbacks used inside column cells

// Memoize pageCount calculation
const pageCount = useMemo(
  () => Math.ceil(total / pagination.pageSize),
  [total, pagination.pageSize]
);
```

**In parent page components — also memoize inspect/action callbacks:**
```typescript
// Memoize inspect handler so columns array stays stable
const handleInspect = useCallback((item: ItemType) => {
  setSelectedId(item.id);
}, []);
```

**In DataTable component:**
```typescript
// Memoize change handlers with stable dependencies
const handlePaginationChange = React.useCallback((updater) => {
  const next = typeof updater === 'function' ? updater(pagination ?? { pageIndex: 0, pageSize: 10 }) : updater;
  onPaginationChange?.(next);
}, [pagination, onPaginationChange]);

const handleSortingChange = React.useCallback((updater) => {
  const next = typeof updater === 'function' ? updater(sorting ?? []) : updater;
  onSortingChange?.(next);
}, [sorting, onSortingChange]);
```

### Pagination Invariants and Guard Rails

Memoization alone is not enough. All manual pagination flows must enforce these invariants:

1. **UI state is 0-based, URL/API state is 1-based**
   - Table state: `pageIndex` starts at `0`
   - Route/search state: `page` starts at `1`
   - Conversion must always be explicit in both directions.

2. **Never navigate with invalid page indexes**
   - Clamp before navigation:
     - `safePageIndex = max(0, min(requestedPageIndex, pageCount - 1))`
   - Convert only after clamping:
     - `page = safePageIndex + 1`
   - This prevents accidental `page=0` in URL when previous-page is triggered at boundaries.

3. **Clamp in both UI and parent navigation handler**
   - In pagination UI component, guard `handlePageChange` against `< 0` and `>= pageCount`
   - In parent `handlePaginationChange`, re-clamp defensively before `router.navigate`
   - Defensive double-checking prevents regressions when future components call pagination directly.

4. **Always provide deterministic `pageCount` for manual pagination**
   - Compute from backend total and current page size.
   - Pass it to the table so `getCanPreviousPage` and `getCanNextPage` stay reliable.

5. **When filters/search/sort/page-size change, reset page to first page**
   - Keep URL and table aligned by forcing `page=1` for those state transitions.

### React Query `keepPreviousData` Requirement (Critical)

When paginating via URL parameters (e.g., clicking next page changes `?page=2`), the underlying `useQuery` hook will transition to `'pending'` state if `keepPreviousData` is not used.

If your table is conditionally rendered based on the query status (e.g., hiding the table to show a loading spinner), **the table will unmount and remount**. When it remounts while the query is pending, the `total` items will temporarily be `0`, making `pageCount` evaluate to `0`. The pagination logic's safety guard (`clampPageIndex`) will forcefully clamp the requested page index down to `0` (which maps back to `page=1` in the URL), **hijacking the user's navigation and locking them on the first page**.

**Always use `placeholderData: keepPreviousData`** so the table stays mounted with previous data and `total` count intact while fetching the next page.

**Correct implementation:**
```typescript
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const usersQuery = useQuery({
  ...orpc.user.list.queryOptions({
    input: {
      page: props.search.page,
      limit: props.search.limit,
    },
  }),
  placeholderData: keepPreviousData, // ← CRITICAL to prevent unmount and page clamping
});
```

**Incorrect implementation:**
```typescript
// ❌ DANGEROUS: Will unmount table on page change, resetting page to 1
const usersQuery = useQuery(
  orpc.user.list.queryOptions({
    input: { page: props.search.page }
  })
);
```

### Why Memoization Matters

Without proper memoization:
1. **URL jumps to page 0 on initial load** - Unstable handler references cause React Table to call `onPaginationChange` during initialization
2. **Breadcrumb navigation fails** - Clicking page numbers (e.g., 2 → 3 → 2) doesn't work because React doesn't detect state changes with new object references
3. **Chevron buttons don't update UI** - Previous/Next navigation updates the URL but the breadcrumb display doesn't reflect the new page
4. **Unnecessary re-renders** - Every render creates new objects/functions, causing React Table to reinitialize

### Common Symptoms
- Clicking pagination buttons has no effect
- URL shows one page but breadcrumb highlights a different page
- Page resets to 1 unexpectedly
- Breadcrumb buttons are disabled when they shouldn't be

### DataTablePagination — `pageCount` Must Be Passed Explicitly

**Do NOT derive `pageCount` from `table.getPageCount()` inside `DataTablePagination`.**

When `manualPagination: true` and the table is created with `pageCount: -1` (TanStack sentinel for "unknown"), `table.getPageCount()` returns `-1`. The utility function `normalizePageCount(-1)` returns `0` (because `-1 <= 0`), and `clampPageIndex(anyPage, 0)` returns `0` unconditionally via its zero-guard.

**Symptom:** Clicking any page-number button in the breadcrumb pagination always resets the table to page 1 regardless of which page was clicked.

**Fix:** Pass `pageCount` as an explicit prop from `DataTable` → `DataTablePagination`, derived from the backend total (e.g. `Math.ceil(total / pageSize)`). Never read it from `table.getPageCount()` in the pagination component.

```typescript
// ✅ Correct — DataTable forwards the externally-computed pageCount
<DataTablePagination
  table={table}
  total={total}
  pagination={pagination ?? { pageIndex: 0, pageSize: 10 }}
  pageCount={pageCount ?? 0}         // ← must come from parent, not table.getPageCount()
  onPaginationChange={onPaginationChange}
/>

// ✅ Correct — DataTablePagination uses the explicit prop
const safePageCount = normalizePageCount(pageCount); // pageCount is a prop, not table.getPageCount()

// ❌ Wrong — do NOT do this
const pageCount = normalizePageCount(table.getPageCount()); // returns 0 under manual pagination
```

### Nested Drawers in Dropdowns (DataTableColumnToggle)

1. **Avoid Event Bubbling Collisions**: When implementing a `Drawer` or `Dialog` related to a `DropdownMenu` (e.g., the "more..." option in `DataTableColumnToggle`), **do NOT** nest the `Drawer` component directly inside the `DropdownMenuContent`.
   - In React, events bubble up the React component tree regardless of the DOM tree (Portals).
   - Clicking a `Checkbox` inside the Drawer will bubble the click event up to the `DropdownMenuContent`.
   - The dropdown menu will interpret the click as a command to close itself, immediately unmounting both the menu and the nested Drawer.
   - **Fix:** Render the `Drawer` as a sibling to the `DropdownMenu` and open it programmatically (`setIsDrawerOpen(true)`) from an `onClick` handler inside a `DropdownMenuItem`.

2. **Column Visibility State Syncing**: TanStack React Table's internal state updates do not inherently force a re-render of external sibling components unless explicitly handled.
   - For `DataTableColumnToggle` to faithfully reflect changes made elsewhere (or from its own unbatched callbacks), use a `useEffect` subscription to `table.getState().columnVisibility` that triggers a `forceUpdate`.
