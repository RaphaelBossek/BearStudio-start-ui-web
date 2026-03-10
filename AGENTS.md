# AGENTES.md

The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AgentsMD file to help prevent future agents from having the same issue.

## TanStack Table with Manual Pagination (URL-based state)

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

### Why This Matters

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

