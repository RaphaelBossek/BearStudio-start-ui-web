import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon, Settings2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatSlotRanges } from '@/features/expert-week/utils/format-slots';
import type { Outputs } from '@/server/router';

type ExpertWeekRow = Outputs['expertWeek']['list']['items'][number];

export interface ExpertWeeksTableProps {
  data: ExpertWeekRow[];
  isLoading: boolean;
  total: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  sorting: { id: string; desc: boolean }[];
  onSortingChange: (sorting: { id: string; desc: boolean }[]) => void;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  hasNextPage?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  hasPrevPage?: boolean;
}

export function ExpertWeeksTable({
  data,
  isLoading,
  total,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  globalFilter,
  onGlobalFilterChange,
  hasNextPage,
  onNextPage,
  hasPrevPage,
  onPrevPage,
}: ExpertWeeksTableProps) {
  // Removed unused translation variable

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: false,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableSorting: false,
      },
      {
        accessorKey: 'userDisplayName',
        header: 'User',
        enableSorting: true,
        cell: (info) => info.getValue() || 'Unknown User',
      },
      {
        accessorKey: 'slotsMo',
        header: 'Monday',
        enableSorting: false,
        cell: (info) => formatSlotRanges(info.getValue() as number[]),
      },
      {
        accessorKey: 'slotsTu',
        header: 'Tuesday',
        enableSorting: false,
        cell: (info) => formatSlotRanges(info.getValue() as number[]),
      },
      {
        accessorKey: 'slotsWe',
        header: 'Wednesday',
        enableSorting: false,
        cell: (info) => formatSlotRanges(info.getValue() as number[]),
      },
      {
        accessorKey: 'slotsTh',
        header: 'Thursday',
        enableSorting: false,
        cell: (info) => formatSlotRanges(info.getValue() as number[]),
      },
      {
        accessorKey: 'slotsFr',
        header: 'Friday',
        enableSorting: false,
        cell: (info) => formatSlotRanges(info.getValue() as number[]),
      },
      {
        accessorKey: 'slotsSa',
        header: 'Saturday',
        enableSorting: false,
        cell: (info) => formatSlotRanges(info.getValue() as number[]),
      },
      {
        accessorKey: 'slotsSu',
        header: 'Sunday',
        enableSorting: false,
        cell: (info) => formatSlotRanges(info.getValue() as number[]),
      },
      {
        accessorKey: 'version',
        header: 'Version',
        enableSorting: false,
      },
      {
        accessorKey: 'dateCreated',
        header: 'Created At',
        enableSorting: true,
        cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      },
      {
        accessorKey: 'dateChanged',
        header: 'Updated At',
        enableSorting: true,
        cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      },
    ],
    state: {
      sorting,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      globalFilter,
    },
    initialState: {
      columnVisibility: {
        id: false,
        version: false,
        dateCreated: false,
        dateChanged: false,
      },
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const newSorting = updater(sorting);
        onSortingChange(newSorting);
      } else {
        onSortingChange(updater);
      }
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(total / pagination.pageSize),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchInput
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder="Search..."
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto hidden h-8 lg:flex items-center justify-center rounded-md border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground">
            <Settings2Icon className="mr-2 h-4 w-4" />
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-2">
                        <span>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getIsSorted() && (
                          <span className="text-muted-foreground w-4">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
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
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {total} rows.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                onPaginationChange({ pageIndex: 0, pageSize: Number(value) });
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[25, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" onClick={onPrevPage} disabled={!hasPrevPage}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" onClick={onNextPage} disabled={!hasNextPage}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
