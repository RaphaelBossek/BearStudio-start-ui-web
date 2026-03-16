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
import { UserDetailsSettings } from './user-details-settings';
import { UsersMongoTable } from './users-table';

export const PageUsersMongo = (props: {
  search: {
    searchTerm?: string;
    limit?: number;
    page?: number;
    sortBy?: any;
    sortOrder?: 'asc' | 'desc';
  };
}) => {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const usersQuery = useQuery({
    ...orpc.userMongo.list.queryOptions({
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

  const userDetailQuery = useQuery(
    orpc.userMongo.get.queryOptions({
      input: { id: selectedUserId ?? '' },
      enabled: !!selectedUserId,
    })
  );

  const ui = getUiState((set) => {
    if (usersQuery.status === 'pending') return set('pending');
    if (usersQuery.status === 'error') return set('error');
    return set('default', {
      items: usersQuery.data?.items ?? [],
      total: usersQuery.data?.total ?? 0,
    });
  });

  const pagination = useMemo(
    () => ({
      pageIndex: routePageToPageIndex(props.search.page),
      pageSize: props.search.limit ?? 25,
    }),
    [props.search.page, props.search.limit]
  );

  const sorting = useMemo(
    () =>
      props.search.sortBy
        ? [{ id: props.search.sortBy, desc: props.search.sortOrder === 'desc' }]
        : [],
    [props.search.sortBy, props.search.sortOrder]
  );

  const pageCount = useMemo(
    () => calculatePageCount(usersQuery.data?.total ?? 0, pagination.pageSize),
    [usersQuery.data?.total, pagination.pageSize]
  );

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      const nextPageCount = calculatePageCount(usersQuery.data?.total ?? 0, newPagination.pageSize);
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
    [router, usersQuery.data?.total]
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
        search: (prev: any) => ({
          ...prev,
          searchTerm: String(value),
          page: 1,
        }),
        replace: true,
      });
    },
    [router]
  );

  const handleInspect = useCallback((user: any) => {
    setSelectedUserId(user.id);
  }, []);

  return (
    <PageLayout>
      <PageLayoutTopBar>
        <PageLayoutTopBarTitle>User Management (Legacy DB)</PageLayoutTopBarTitle>
      </PageLayoutTopBar>
      <PageLayoutContent noContainer className="h-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          {/* Table panel */}
          <ResizablePanel defaultSize={50} minSize={35} className="h-full">
            <div className="h-full p-4">
              {ui
                .match('pending', () => <DataListLoadingState />)
                .match('error', () => <DataListErrorState retry={() => usersQuery.refetch()} />)
                .match('default', ({ items, total }) => (
                  <UsersMongoTable
                    data={items as any}
                    isLoading={usersQuery.isLoading || usersQuery.isFetching}
                    total={total}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    sorting={sorting}
                    onSortingChange={handleSortingChange}
                    globalFilter={props.search.searchTerm ?? ''}
                    onGlobalFilterChange={handleGlobalFilterChange}
                    pageCount={pageCount}
                    onRowClick={handleInspect}
                    selectedId={selectedUserId}
                  />
                ))
                .exhaustive()}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Detail panel */}
          <ResizablePanel defaultSize={50} minSize={28} className="h-full">
            {selectedUserId ? (
              <div className="h-full overflow-auto">
                {userDetailQuery.isLoading ? (
                  <DataListLoadingState />
                ) : userDetailQuery.data ? (
                  <UserDetailsSettings user={userDetailQuery.data} />
                ) : (
                  <div className="text-center py-10 text-muted-foreground">User not found.</div>
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
