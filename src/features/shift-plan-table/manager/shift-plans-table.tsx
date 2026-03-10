import type { ColumnDef } from '@tanstack/react-table';
import { EyeIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { Outputs } from '@/server/router';

type ShiftPlanRow = Outputs['shiftPlanMongo']['list']['items'][number];

export interface ShiftPlansMongoTableProps {
  data: ShiftPlanRow[];
  isLoading: boolean;
  total: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  sorting: { id: string; desc: boolean }[];
  onSortingChange: (sorting: { id: string; desc: boolean }[]) => void;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onInspect: (shiftPlan: ShiftPlanRow) => void;
}

const getDayLabel = (day: string | null | undefined) => {
  const dayMap: Record<string, string> = {
    MO: 'Monday',
    TU: 'Tuesday',
    WE: 'Wednesday',
    TH: 'Thursday',
    FR: 'Friday',
    SA: 'Saturday',
    SU: 'Sunday',
  };
  return day ? dayMap[day] || day : '—';
};

const getPriceTypeVariant = (priceType: string | null | undefined) => {
  switch (priceType) {
    case 'WEEKDAY':
      return 'secondary';
    case 'WEEKNIGHT':
      return 'warning';
    case 'WEEKENDDAY':
      return 'positive';
    case 'WEEKENDNIGHT':
      return 'negative';
    default:
      return 'secondary';
  }
};

const formatTime = (time: number | null | undefined) => {
  if (!time) return '—';
  const timeStr = time.toString().padStart(4, '0');
  return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
};

export function ShiftPlansMongoTable({
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
}: ShiftPlansMongoTableProps) {
  const columns: ColumnDef<ShiftPlanRow>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: true,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        cell: (info) => info.getValue() || '—',
      },
      {
        accessorKey: 'day',
        header: 'Day',
        enableSorting: true,
        cell: (info) => {
          const day = info.getValue() as string;
          return <Badge variant="secondary">{getDayLabel(day)}</Badge>;
        },
      },
      {
        accessorKey: 'timeStart',
        header: 'Start Time',
        enableSorting: true,
        cell: (info) => formatTime(info.getValue() as number),
      },
      {
        accessorKey: 'timeEnd',
        header: 'End Time',
        enableSorting: false,
        cell: (info) => formatTime(info.getValue() as number),
      },
      {
        accessorKey: 'job.title',
        header: 'Job',
        enableSorting: false,
        cell: (info) => info.getValue() || '—',
      },
      {
        accessorKey: 'priceType',
        header: 'Price Type',
        enableSorting: true,
        cell: (info) => {
          const priceType = info.getValue() as string;
          return <Badge variant={getPriceTypeVariant(priceType)}>{priceType || '—'}</Badge>;
        },
      },
      {
        accessorKey: 'scheduling',
        header: 'Scheduling',
        enableSorting: false,
        cell: (info) => {
          const scheduling = info.getValue() as string;
          const multiplier = info.row.original.schedulingMulitplier;
          return scheduling ? `${scheduling}${multiplier ? ` (×${multiplier})` : ''}` : '—';
        },
      },
      {
        accessorKey: 'minPatients',
        header: 'Min Patients',
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
            title="Inspect Shift Plan"
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
      searchPlaceholder="Search shift plans..."
    />
  );
}
