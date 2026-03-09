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

type UserMongoRow = Outputs['userMongo']['list']['items'][number];

export interface UsersMongoTableProps {
  data: UserMongoRow[];
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
  onInspect: (user: UserMongoRow) => void;
}

export function UsersMongoTable({
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
}: UsersMongoTableProps) {
  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: 'userProfile.displayName',
        header: 'Display Name',
        enableSorting: true,
        cell: (info) => info.getValue() || '—',
      },
      {
        accessorKey: 'username',
        header: 'Username',
        enableSorting: true,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableSorting: true,
        cell: (info) => <Badge variant="secondary">{info.getValue() as string}</Badge>,
      },
      {
        accessorKey: 'enabled',
        header: 'Status',
        enableSorting: false,
        cell: (info) => (
          <Badge variant={info.getValue() ? 'positive' : 'negative'}>
            {info.getValue() ? 'Enabled' : 'Disabled'}
          </Badge>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        enableSorting: true,
        cell: (info) => {
          const val = info.getValue() as string | null;
          return val ? new Date(val).toLocaleString() : 'Never';
        },
      },
      {
        accessorKey: 'successfulLogins',
        header: 'Success Logins (Last 3)',
        enableSorting: false,
        cell: (info) => {
          const events = info.getValue() as any[];
          if (!events?.length) return '—';
          return (
            <div className="flex flex-col gap-1 text-[10px] leading-tight">
              {events.map((ev, i) => (
                <div key={i}>
                  {ev.ip} - {ev.date ? new Date(ev.date).toLocaleDateString() : '?'}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'invalidLogins',
        header: 'Invalid Logins (Last 3)',
        enableSorting: false,
        cell: (info) => {
          const events = info.getValue() as any[];
          if (!events?.length) return '—';
          return (
            <div className="flex flex-col gap-1 text-[10px] leading-tight text-destructive">
              {events.map((ev, i) => (
                <div key={i}>
                  {ev.ip} - {ev.date ? new Date(ev.date).toLocaleDateString() : '?'}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInspect(info.row.original)}
            title="Inspect User"
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
        username: false,
        successfulLogins: false,
        invalidLogins: false,
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
            placeholder="Search users..."
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
                    Loading users...
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
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {total} users.
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
