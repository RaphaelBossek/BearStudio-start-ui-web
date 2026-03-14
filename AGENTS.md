# AGENTS.md

The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in this file to help prevent future agents from having the same issue.

## Table View Implementation

For detailed guidelines on implementing tables with TanStack React Table (memoization patterns, pagination, sorting, and state management), see [specs/rules/table-view.md](./specs/rules/table-view.md).

Key takeaways for table views:
- Always memoize columns, pagination state, and handlers when using manual pagination with URL-based state
- Use `placeholderData: keepPreviousData` with React Query to prevent table unmounting during page transitions
- Pass `pageCount` explicitly to `DataTablePagination` — never derive it from `table.getPageCount()`
- Avoid nesting Drawers inside DropdownMenus — render as siblings with programmatic state control

## TanStack Router Route Breadcrumbs (Top Bar Navigation)

For app-level breadcrumbs (route hierarchy breadcrumbs, not table page-number breadcrumbs), use TanStack Router `staticData` + `useMatches`.

### Required Pattern

1. **Declare route breadcrumb metadata using typed `staticData`**
   - Add a global `declare module '@tanstack/react-router'` augmentation for `StaticDataRouteOption`.
   - Use this value contract for `staticData.breadcrumb`:
     - `string` (single label)
     - `string[]` (multiple labels emitted by one route)
     - `(match: AnyRouteMatch) => string | string[]` (dynamic label(s), e.g. params/search-driven)
   - Prefer translation keys (e.g. `layout:nav.dashboard`) over hardcoded labels.

2. **Use one shared breadcrumb renderer based on route matches**
   - Build a single reusable component that calls `useMatches()`.
   - For each match, read `match.staticData?.breadcrumb`; skip routes without breadcrumb metadata.
   - Resolve function values with the current `match`, normalize to array, and flatten in route order.
   - Render all but the last breadcrumb as links, and the last breadcrumb as current page.

3. **Dynamic breadcrumb behavior must come from route state, not ad-hoc UI state**
   - For path params, derive labels from `match.params` (example: `#${match.params.id}`).
   - For query-based flows, derive labels from validated `match.search` (example: step-based breadcrumbs).
   - Keep all route breadcrumb logic colocated in route `staticData`, not scattered in page components.

4. **Keep route breadcrumbs separate from table pagination controls**
   - Do not mix table page-number controls with route hierarchy breadcrumbs.
   - "Breadcrumb-style pagination slider" in table specs refers to pagination chips/sequence UI only.
   - Route breadcrumbs belong in top-bar/layout navigation and must be derived from TanStack Router matches.

5. **Localization and advanced path control**
   - Translation keys are recommended for labels.
   - If custom link targets are required later, evolve the breadcrumb value type to support object forms (e.g. `{ label, path }`) and update renderer/type in one change.

### Why This Matters

- Without route-level static metadata, top bar breadcrumbs cannot be consistently derived.
- Without `useMatches`, breadcrumb trees drift from real route hierarchy.
- Dynamic labels (params/search) break if not resolved from `match`.
- Mixing route breadcrumbs and table-pagination UI causes UX confusion and state bugs.
