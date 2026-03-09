import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, SearchIcon, Settings2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import type { Outputs } from '@/server/router';

type AppointmentRow = Outputs['appointmentMongo']['list']['items'][number];

export interface AppointmentsMongoTableProps {
  data: AppointmentRow[];
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
  onInspect: (appointment: AppointmentRow) => void;
}

const getStateVariant = (state: string | null | undefined) => {
  switch (state) {
    case 'ACTIVE':
      return 'positive';
    case 'DONE':
    case 'CLOSED':
      return 'secondary';
    case 'CANCELED':
    case 'STORNO':
      return 'negative';
    case 'LOCKEDIN':
      return 'warning';
    case 'READY':
      return 'secondary';
    case 'REQUESTED':
      return 'warning';
    default:
      return 'secondary';
  }
};

export function AppointmentsMongoTable({
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
  onInspect,
}: AppointmentsMongoTableProps) {
  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: true,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        enableSorting: true,
        cell: (info) => info.getValue() || '—',
      },
      {
        accessorKey: 'start',
        header: 'Start',
        enableSorting: true,
        cell: (info) => {
          const val = info.getValue() as Date | string | null;
          return val
            ? new Date(val).toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—';
        },
      },
      {
        accessorKey: 'state',
        header: 'State',
        enableSorting: true,
        cell: (info) => {
          const state = info.getValue() as string;
          return <Badge variant={getStateVariant(state)}>{state || '—'}</Badge>;
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableSorting: true,
        cell: (info) => <Badge variant="secondary">{(info.getValue() as string) || '—'}</Badge>,
      },
      {
        accessorKey: 'job.title',
        header: 'Job',
        enableSorting: false,
        cell: (info) => info.getValue() || '—',
      },
      {
        accessorKey: 'customer.name',
        header: 'Customer',
        enableSorting: false,
        cell: (info) => info.getValue() || '—',
      },
      {
        accessorKey: 'location.name',
        header: 'Location',
        enableSorting: false,
        cell: (info) => info.getValue() || '—',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInspect(info.row.original)}
            title="Inspect Appointment"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
        ),
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
        type: false,
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
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <SearchInput
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Search appointments..."
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto hidden h-8 lg:flex items-center justify-center rounded-md border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
            <Settings2Icon className="mr-2 h-4 w-4" />
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
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

      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
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
                            <span className="text-muted-foreground">
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
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center text-muted-foreground italic"
                  >
                    Loading appointments...
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
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center text-muted-foreground italic"
                  >
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {total} appointments.
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
