import { getUiState } from '@bearstudio/ui-state';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { TableProperties } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { DataListErrorState, DataListLoadingState } from '@/components/ui/datalist';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
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
import { AppointmentDetails } from './appointment-details';
import { AppointmentsMongoTable } from './appointments-table';

export const PageAppointmentsMongo = (props: {
  search: {
    searchTerm?: string;
    limit?: number;
    page?: number;
    sortBy?: any;
    sortOrder?: 'asc' | 'desc';
  };
}) => {
  const router = useRouter();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const appointmentsQuery = useQuery({
    ...orpc.appointmentMongo.list.queryOptions({
      input: {
        searchTerm: props.search.searchTerm,
        limit: props.search.limit,
        page: props.search.page,
        sortBy: props.search.sortBy,
        sortOrder: props.search.sortOrder,
      },
    }),
    placeholderData: keepPreviousData,
  });

  const appointmentDetailQuery = useQuery(
    orpc.appointmentMongo.get.queryOptions({
      input: { id: selectedAppointmentId ?? '' },
      enabled: !!selectedAppointmentId,
    })
  );

  const ui = getUiState((set) => {
    if (appointmentsQuery.status === 'pending') return set('pending');
    if (appointmentsQuery.status === 'error') return set('error');
    return set('default', {
      items: appointmentsQuery.data?.items ?? [],
      total: appointmentsQuery.data?.total ?? 0,
    });
  });

  const pagination = useMemo(
    () => ({
      pageIndex: routePageToPageIndex(props.search.page),
      pageSize: props.search.limit ?? 25,
    }),
    [props.search.page, props.search.limit]
  );

  const pageCount = useMemo(
    () => calculatePageCount(appointmentsQuery.data?.total ?? 0, pagination.pageSize),
    [appointmentsQuery.data?.total, pagination.pageSize]
  );

  const sorting = useMemo(
    () =>
      props.search.sortBy
        ? [{ id: props.search.sortBy, desc: props.search.sortOrder === 'desc' }]
        : [],
    [props.search.sortBy, props.search.sortOrder]
  );

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      const nextPageCount = calculatePageCount(
        appointmentsQuery.data?.total ?? 0,
        newPagination.pageSize
      );
      const safePageIndex = clampPageIndex(newPagination.pageIndex, nextPageCount);

      router.navigate({
        to: '.',
        search: (prev: any) => ({
          ...prev,
          limit: newPagination.pageSize,
          page: pageIndexToRoutePage(safePageIndex, nextPageCount),
        }),
        replace: true,
      });
    },
    [router, appointmentsQuery.data?.total]
  );

  const handleSortingChange = useCallback(
    (newSorting: { id: string; desc: boolean }[]) => {
      const sort = newSorting[0];
      router.navigate({
        to: '.',
        search: (prev: any) => ({
          ...prev,
          sortBy: sort?.id as any,
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
        search: (prev: any) => ({ ...prev, searchTerm: String(value), page: 1 }),
        replace: true,
      });
    },
    [router]
  );

  const handleInspect = useCallback((appointment: any) => {
    setSelectedAppointmentId(appointment.id);
  }, []);

  return (
    <PageLayout>
      <PageLayoutTopBar>
        <PageLayoutTopBarTitle>Appointments (Mongo DB)</PageLayoutTopBarTitle>
      </PageLayoutTopBar>
      <PageLayoutContent noContainer className="h-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          {/* Table panel */}
          <ResizablePanel defaultSize={50} minSize={35} className="h-full">
            <div className="h-full p-4">
              {ui
                .match('pending', () => <DataListLoadingState />)
                .match('error', () => (
                  <DataListErrorState retry={() => appointmentsQuery.refetch()} />
                ))
                .match('default', ({ items, total }) => (
                  <AppointmentsMongoTable
                    data={items as any}
                    isLoading={appointmentsQuery.isLoading || appointmentsQuery.isFetching}
                    total={total}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    sorting={sorting}
                    onSortingChange={handleSortingChange}
                    globalFilter={props.search.searchTerm ?? ''}
                    onGlobalFilterChange={handleGlobalFilterChange}
                    pageCount={pageCount}
                    onRowClick={handleInspect}
                    selectedId={selectedAppointmentId}
                  />
                ))
                .exhaustive()}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Detail panel */}
          <ResizablePanel defaultSize={50} minSize={28} className="h-full">
            {selectedAppointmentId ? (
              <div className="h-full overflow-auto">
                {appointmentDetailQuery.isLoading ? (
                  <DataListLoadingState />
                ) : appointmentDetailQuery.data ? (
                  <AppointmentDetails appointment={appointmentDetailQuery.data} />
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Appointment not found.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <TableProperties className="size-10 opacity-30" />
                <p className="text-sm font-medium">No item selected</p>
                <p className="text-xs opacity-70">Click a row to view details</p>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </PageLayoutContent>
    </PageLayout>
  );
};
