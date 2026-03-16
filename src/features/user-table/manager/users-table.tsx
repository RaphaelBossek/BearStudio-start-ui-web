import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatCellValue } from '@/components/ui/data-table';
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
  pageCount?: number;
  onRowClick?: (user: UserMongoRow) => void;
  selectedId?: string | null;
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
  pageCount,
  onRowClick,
  selectedId,
}: UsersMongoTableProps) {
  const columns: ColumnDef<UserMongoRow>[] = useMemo(
    () => [
      {
        accessorKey: 'userProfile.displayName',
        header: 'Display Name',
        enableSorting: true,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'username',
        header: 'Username',
        enableSorting: true,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableSorting: true,
        cell: (info) => <Badge variant="secondary">{formatCellValue(info.getValue())}</Badge>,
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
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      total={total}
      isLoading={isLoading}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      sorting={sorting}
      onSortingChange={onSortingChange}
      globalFilter={globalFilter}
      onGlobalFilterChange={onGlobalFilterChange}
      pageCount={pageCount}
      searchPlaceholder="Search users..."
      onRowClick={onRowClick}
      selectedId={selectedId}
    />
  );
}
