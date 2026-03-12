import { getUiState } from '@bearstudio/ui-state';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ShiftPlanDetails } from './shift-plan-details';
import { ShiftPlansMongoTable } from './shift-plans-table';

export const PageShiftPlansMongo = (props: {
  search: {
    searchTerm?: string;
    limit?: number;
    page?: number;
    sortBy?: any;
    sortOrder?: 'asc' | 'desc';
  };
}) => {
  const { t } = useTranslation(['common']);
  const router = useRouter();
  const [selectedShiftPlanId, setSelectedShiftPlanId] = useState<string | null>(null);

  const shiftPlansQuery = useQuery(
    orpc.shiftPlanMongo.list.queryOptions({
      input: {
        searchTerm: props.search.searchTerm,
        limit: props.search.limit,
        page: props.search.page,
        sortBy: props.search.sortBy,
        sortOrder: props.search.sortOrder,
      },
    })
  );

  const shiftPlanDetailQuery = useQuery(
    orpc.shiftPlanMongo.get.queryOptions({
      input: { id: selectedShiftPlanId ?? '' },
      enabled: !!selectedShiftPlanId,
    })
  );

  const ui = getUiState((set) => {
    if (shiftPlansQuery.status === 'pending') return set('pending');
    if (shiftPlansQuery.status === 'error') return set('error');
    return set('default', {
      items: shiftPlansQuery.data?.items ?? [],
      total: shiftPlansQuery.data?.total ?? 0,
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
    () => calculatePageCount(shiftPlansQuery.data?.total ?? 0, pagination.pageSize),
    [shiftPlansQuery.data?.total, pagination.pageSize]
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
        shiftPlansQuery.data?.total ?? 0,
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
    [router, shiftPlansQuery.data?.total]
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

  const handleInspect = useCallback((shiftPlan: any) => {
    setSelectedShiftPlanId(shiftPlan.id);
  }, []);

  return (
    <PageLayout>
      <PageLayoutTopBar>
        <PageLayoutTopBarTitle>Shift Plans (Mongo DB)</PageLayoutTopBarTitle>
      </PageLayoutTopBar>
      <PageLayoutContent className="pb-20">
        {ui
          .match('pending', () => <DataListLoadingState />)
          .match('error', () => <DataListErrorState retry={() => shiftPlansQuery.refetch()} />)
          .match('default', ({ items, total }) => (
            <ShiftPlansMongoTable
              data={items as any}
              isLoading={shiftPlansQuery.isLoading || shiftPlansQuery.isFetching}
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
          open={!!selectedShiftPlanId}
          onOpenChange={(open) => !open && setSelectedShiftPlanId(null)}
        >
          <SheetContent className="sm:max-w-2xl overflow-hidden flex flex-col">
            <SheetHeader className="mb-4">
              <SheetTitle>Shift Plan Details</SheetTitle>
              <SheetDescription>
                Full inspection of the shift plan document from MongoDB.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 mt-2">
              {shiftPlanDetailQuery.isLoading ? (
                <div className="flex items-center justify-center h-40">Loading details...</div>
              ) : shiftPlanDetailQuery.data ? (
                <ShiftPlanDetails shiftPlan={shiftPlanDetailQuery.data} />
              ) : (
                <div className="text-center py-10 text-muted-foreground">Shift plan not found.</div>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </PageLayoutContent>
    </PageLayout>
  );
};
