import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable, formatCellValue } from '@/components/ui/data-table';
import { DataListErrorState, DataListLoadingState } from '@/components/ui/datalist';
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutTopBar,
  PageLayoutTopBarTitle,
} from '@/layout/manager/page-layout';
import { orpc } from '@/lib/orpc/client';
import {
  calculatePageCount,
  clampPageIndex,
  pageIndexToRoutePage,
  routePageToPageIndex,
} from '@/lib/pagination';
import { ConsultationStateBadge } from './components/consultation-state-badge';
import { ConsultationTypeBadge } from './components/consultation-type-badge';
import { CreateConsultationDialog } from './components/create-consultation-dialog';
import type { ConsultationListItem } from './types';

type SearchParams = {
  searchTerm?: string;
  limit?: number;
  page?: number;
  sortBy?: 'id' | 'date' | 'bookNumber' | 'state' | 'type';
  sortOrder?: 'asc' | 'desc';
};

const formatDate = (value: unknown) => {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const ConsultationDataListPage = ({ search }: { search: SearchParams }) => {
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const consultationQuery = useQuery({
    ...orpc.consultationListMongo.list.queryOptions({
      input: {
        page: search.page,
        limit: search.limit,
        searchTerm: search.searchTerm,
        sortBy: search.sortBy,
        sortOrder: search.sortOrder,
      },
    }),
    placeholderData: keepPreviousData,
  });

  const data = consultationQuery.data?.items ?? [];
  const total = consultationQuery.data?.total ?? 0;

  const pagination = useMemo(
    () => ({
      pageIndex: routePageToPageIndex(search.page),
      pageSize: search.limit ?? 25,
    }),
    [search.page, search.limit]
  );

  const pageCount = useMemo(
    () => calculatePageCount(total, pagination.pageSize),
    [total, pagination.pageSize]
  );

  const sorting = useMemo(
    () =>
      search.sortBy
        ? [
            {
              id: search.sortBy,
              desc: search.sortOrder === 'desc',
            },
          ]
        : [],
    [search.sortBy, search.sortOrder]
  );

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      const nextPageCount = calculatePageCount(total, newPagination.pageSize);
      const safePageIndex = clampPageIndex(newPagination.pageIndex, nextPageCount);

      router.navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          limit: newPagination.pageSize,
          page: pageIndexToRoutePage(safePageIndex, nextPageCount),
        }),
        replace: true,
      });
    },
    [router, total]
  );

  const handleSortingChange = useCallback(
    (newSorting: { id: string; desc: boolean }[]) => {
      const sort = newSorting[0];

      router.navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          sortBy: sort?.id as SearchParams['sortBy'],
          sortOrder: sort?.desc ? 'desc' : 'asc',
          page: 1,
        }),
        replace: true,
      });
    },
    [router]
  );

  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      router.navigate({
        to: '.',
        search: (prev) => ({ ...prev, searchTerm: String(value), page: 1 }),
        replace: true,
      });
    },
    [router]
  );

  const handleRowClick = useCallback(
    (row: ConsultationListItem) => {
      router.navigate({
        to: '/manager/consultations/$id',
        params: { id: String(row.id ?? '') },
      });
    },
    [router]
  );

  const columns: ColumnDef<ConsultationListItem>[] = useMemo(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        enableSorting: true,
        cell: (info) => <ConsultationTypeBadge type={info.getValue()} />,
      },
      {
        accessorKey: 'state',
        header: 'State',
        enableSorting: true,
        cell: (info) => <ConsultationStateBadge state={info.getValue()} />,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        enableSorting: true,
        cell: (info) => formatDate(info.getValue()),
      },
      {
        accessorKey: 'bookNumber',
        header: 'Book Number',
        enableSorting: true,
        cell: (info) => formatCellValue(info.getValue()),
      },
      {
        accessorKey: 'doctor.name',
        header: 'Doctor',
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
        accessorKey: 'id',
        header: 'ID',
        enableSorting: true,
        cell: (info) => formatCellValue(info.getValue()),
      },
    ],
    []
  );

  return (
    <PageLayout>
      <PageLayoutTopBar
        endActions={
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="mr-1.5 size-4" />
            New Consultation
          </Button>
        }
      >
        <PageLayoutTopBarTitle>Consultations</PageLayoutTopBarTitle>
      </PageLayoutTopBar>
      <PageLayoutContent noContainer className="h-full p-4">
        {consultationQuery.status === 'pending' ? (
          <DataListLoadingState />
        ) : consultationQuery.status === 'error' ? (
          <DataListErrorState retry={() => consultationQuery.refetch()} />
        ) : (
          <DataTable
            columns={columns}
            data={data as ConsultationListItem[]}
            total={total}
            isLoading={consultationQuery.isLoading || consultationQuery.isFetching}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            globalFilter={search.searchTerm ?? ''}
            onGlobalFilterChange={handleGlobalFilterChange}
            pageCount={pageCount}
            searchPlaceholder="Search by book number..."
            onRowClick={handleRowClick}
          />
        )}
      </PageLayoutContent>

      <CreateConsultationDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </PageLayout>
  );
};
