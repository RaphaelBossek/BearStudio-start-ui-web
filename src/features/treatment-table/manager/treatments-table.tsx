import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataTable, formatCellValue } from '@/components/ui/data-table';
import type { Outputs } from '@/server/router';

type TreatmentRow = Outputs['treatmentMongo']['list']['items'][number];

export interface TreatmentsMongoTableProps {
  data: TreatmentRow[];
  isLoading: boolean;
  total: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  sorting: { id: string; desc: boolean }[];
  onSortingChange: (sorting: { id: string; desc: boolean }[]) => void;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  pageCount?: number;
  onRowClick?: (treatment: TreatmentRow) => void;
  selectedId?: string | null;
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
    case 'REQUESTED':
      return 'warning';
    default:
      return 'secondary';
  }
};

export function TreatmentsMongoTable({
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
}: TreatmentsMongoTableProps) {
  const columns: ColumnDef<TreatmentRow>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: true,
      },
      {
        accessorKey: 'bookNumber',
        header: 'Book Number',
        enableSorting: true,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'jNumber',
        header: 'J-Number',
        enableSorting: false,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'state',
        header: 'State',
        enableSorting: true,
        cell: (info) => {
          const state = info.getValue() as string;
          return <Badge variant={getStateVariant(state)}>{formatCellValue(state)}</Badge>;
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableSorting: false,
        cell: (info) => <Badge variant="secondary">{formatCellValue(info.getValue())}</Badge>,
      },
      {
        accessorKey: 'customer.name',
        header: 'Customer',
        enableSorting: false,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'location.name',
        header: 'Location',
        enableSorting: false,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'assigned.name',
        header: 'Assigned',
        enableSorting: false,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'dateStart',
        header: 'Start Date',
        enableSorting: true,
        cell: (info) => {
          const val = info.getValue() as Date | string | null;
          return val
            ? new Date(val).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '—';
        },
      },
      {
        accessorKey: 'dateCreated',
        header: 'Created',
        enableSorting: true,
        cell: (info) => {
          const val = info.getValue() as Date | string | null;
          return val
            ? new Date(val).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '—';
        },
      },
      {
        accessorKey: 'countFinished',
        header: 'Finished',
        enableSorting: false,
        cell: (info) => {
          const finished = info.getValue() as number | null;
          const total = info.row.original.countTotal as number | null;
          if (finished === null || finished === undefined) return '—';
          return total ? `${finished}/${total}` : String(finished);
        },
      },
    ],
    []
  );

  const computedPageCount = useMemo(
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
      pageCount={pageCount ?? computedPageCount}
      searchPlaceholder="Search treatments..."
      onRowClick={onRowClick}
      selectedId={selectedId}
    />
  );
}
