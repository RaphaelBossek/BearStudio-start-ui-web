import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTableColumnToggle } from './data-table-column-toggle';
import { DataTablePagination } from './data-table-pagination';
import { SearchInput } from './search-input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total?: number;
  isLoading?: boolean;
  searchPlaceholder?: string;
  // External state for manual pagination/sorting/filtering
  pagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  pageCount?: number;
}

/**
 * Formats a cell value for display, handling null/undefined cases.
 * Returns '—' for empty values, otherwise returns the string representation.
 */
export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  return String(value);
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total = 0,
  isLoading = false,
  searchPlaceholder = 'Search...',
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  globalFilter,
  onGlobalFilterChange,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const handleSortingChange = React.useCallback(
    (updater: any) => {
      const next = typeof updater === 'function' ? updater(sorting ?? []) : updater;

      onSortingChange?.(next);
    },
    [sorting, onSortingChange]
  );

  const handleColumnVisibilityChange = React.useCallback((updater: any) => {
    setColumnVisibility((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const handleColumnFiltersChange = React.useCallback((updater: any) => {
    setColumnFilters((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const handleGlobalFilterChange = React.useCallback(
    (updater: any) => {
      const next = typeof updater === 'function' ? updater(globalFilter) : updater;

      onGlobalFilterChange?.(next);
    },
    [globalFilter, onGlobalFilterChange]
  );

  const handlePaginationChange = React.useCallback(
    (updater: any) => {
      const next =
        typeof updater === 'function'
          ? updater(pagination ?? { pageIndex: 0, pageSize: 10 })
          : updater;

      onPaginationChange?.(next);
    },
    [pagination, onPaginationChange]
  );

  const safeColumns = React.useMemo(() => {
    return columns.map((col) => {
      if (
        'accessorKey' in col &&
        typeof col.accessorKey === 'string' &&
        col.accessorKey.includes('.')
      ) {
        if (!('accessorFn' in col) || !col.accessorFn) {
          const keys = col.accessorKey.split('.');
          return {
            ...col,
            id: col.id || col.accessorKey,
            accessorFn: (row: any) =>
              keys.reduce((acc: any, part: string) => (acc ? acc[part] : undefined), row),
          } as ColumnDef<TData, TValue>;
        }
      }
      return col;
    });
  }, [columns]);

  const table = useReactTable({
    data,
    columns: safeColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
      globalFilter,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: !!onPaginationChange,
    manualSorting: !!onSortingChange,
    manualFiltering: !!onGlobalFilterChange,
    autoResetPageIndex: false,
    pageCount: pageCount ?? -1,
  });

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 pt-1">
        <SearchInput
          placeholder={searchPlaceholder}
          value={globalFilter ?? ''}
          onChange={onGlobalFilterChange}
          className="max-w-sm"
        />
        <DataTableColumnToggle table={table} />
      </div>

      <div className="rounded-md border bg-card flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground italic"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground italic"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm pt-4 border-t">
        <DataTablePagination
          table={table}
          total={total}
          pagination={pagination ?? { pageIndex: 0, pageSize: 10 }}
          pageCount={pageCount ?? 0}
          onPaginationChange={onPaginationChange}
        />
      </div>
    </div>
  );
}
