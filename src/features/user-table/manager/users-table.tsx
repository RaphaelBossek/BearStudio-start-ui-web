import type { ColumnDef } from '@tanstack/react-table';
import { EyeIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
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
  onInspect: (user: UserMongoRow) => void;
  pageCount?: number;
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
  onInspect,
  pageCount,
}: UsersMongoTableProps) {
  const columns: ColumnDef<UserMongoRow>[] = useMemo(
    () => [
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
            size="icon-xs"
            onClick={() => onInspect(info.row.original)}
            title="Inspect User"
          >
            <EyeIcon />
          </Button>
        ),
      },
    ],
    [onInspect]
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
    />
  );
}
