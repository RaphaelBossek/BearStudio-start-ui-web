import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
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
  pageCount?: number;
}

const columns: ColumnDef<ExpertWeekRow>[] = [
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
];

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
  pageCount,
}: ExpertWeeksTableProps) {
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
      searchPlaceholder="Search experts..."
    />
  );
}
