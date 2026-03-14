import { getUiState } from '@bearstudio/ui-state';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { DataListErrorState, DataListLoadingState } from '@/components/ui/datalist';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
      <PageLayoutContent className="pb-20">
        {ui
          .match('pending', () => <DataListLoadingState />)
          .match('error', () => <DataListErrorState retry={() => appointmentsQuery.refetch()} />)
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
              onInspect={handleInspect}
              pageCount={pageCount}
            />
          ))
          .exhaustive()}

        <Sheet
          open={!!selectedAppointmentId}
          onOpenChange={(open) => !open && setSelectedAppointmentId(null)}
        >
          <SheetContent className="sm:max-w-2xl overflow-hidden flex flex-col">
            <SheetHeader className="mb-4">
              <SheetTitle>Appointment Details</SheetTitle>
              <SheetDescription>
                Full inspection of the appointment document from MongoDB.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 mt-2">
              {appointmentDetailQuery.isLoading ? (
                <div className="flex items-center justify-center h-40">Loading details...</div>
              ) : appointmentDetailQuery.data ? (
                <AppointmentDetails appointment={appointmentDetailQuery.data} />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  Appointment not found.
                </div>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </PageLayoutContent>
    </PageLayout>
  );
};
