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
import { TreatmentDetails } from './treatment-details';
import { TreatmentsMongoTable } from './treatments-table';

export const PageTreatmentsMongo = (props: {
  search: {
    searchTerm?: string;
    limit?: number;
    page?: number;
    sortBy?: any;
    sortOrder?: 'asc' | 'desc';
  };
}) => {
  const router = useRouter();
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);

  const treatmentsQuery = useQuery({
    ...orpc.treatmentMongo.list.queryOptions({
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

  const treatmentDetailQuery = useQuery(
    orpc.treatmentMongo.get.queryOptions({
      input: { id: selectedTreatmentId ?? '' },
      enabled: !!selectedTreatmentId,
    })
  );

  const ui = getUiState((set) => {
    if (treatmentsQuery.status === 'pending') return set('pending');
    if (treatmentsQuery.status === 'error') return set('error');
    return set('default', {
      items: treatmentsQuery.data?.items ?? [],
      total: treatmentsQuery.data?.total ?? 0,
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
    () => calculatePageCount(treatmentsQuery.data?.total ?? 0, pagination.pageSize),
    [treatmentsQuery.data?.total, pagination.pageSize]
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
        treatmentsQuery.data?.total ?? 0,
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
    [router, treatmentsQuery.data?.total]
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

  const handleInspect = useCallback((treatment: any) => {
    setSelectedTreatmentId(treatment.id);
  }, []);

  return (
    <PageLayout>
      <PageLayoutTopBar>
        <PageLayoutTopBarTitle>Treatments (Mongo DB)</PageLayoutTopBarTitle>
      </PageLayoutTopBar>
      <PageLayoutContent noContainer className="h-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          {/* Table panel */}
          <ResizablePanel defaultSize={50} minSize={35} className="h-full">
            <div className="h-full p-4">
              {ui
                .match('pending', () => <DataListLoadingState />)
                .match('error', () => (
                  <DataListErrorState retry={() => treatmentsQuery.refetch()} />
                ))
                .match('default', ({ items, total }) => (
                  <TreatmentsMongoTable
                    data={items as any}
                    isLoading={treatmentsQuery.isLoading || treatmentsQuery.isFetching}
                    total={total}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    sorting={sorting}
                    onSortingChange={handleSortingChange}
                    globalFilter={props.search.searchTerm ?? ''}
                    onGlobalFilterChange={handleGlobalFilterChange}
                    pageCount={pageCount}
                    onRowClick={handleInspect}
                    selectedId={selectedTreatmentId}
                  />
                ))
                .exhaustive()}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Detail panel */}
          <ResizablePanel defaultSize={50} minSize={28} className="h-full">
            {selectedTreatmentId ? (
              <div className="h-full overflow-auto">
                {treatmentDetailQuery.isLoading ? (
                  <DataListLoadingState />
                ) : treatmentDetailQuery.data ? (
                  <TreatmentDetails treatment={treatmentDetailQuery.data} />
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    Treatment not found.
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
