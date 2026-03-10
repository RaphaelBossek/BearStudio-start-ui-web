import type { ColumnDef } from '@tanstack/react-table';
import { EyeIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
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
  onInspect,
}: AppointmentsMongoTableProps) {
  const columns: ColumnDef<AppointmentRow>[] = useMemo(
    () => [
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
            size="icon-xs"
            onClick={() => onInspect(info.row.original)}
            title="Inspect Appointment"
          >
            <EyeIcon />
          </Button>
        ),
      },
    ],
    [onInspect]
  );

  const pageCount = useMemo(
    () => Math.ceil(total / pagination.pageSize),
    [total, pagination.pageSize]
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
      searchPlaceholder="Search appointments..."
    />
  );
}
