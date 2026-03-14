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
      <PageLayoutContent className="pb-20">
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
              onInspect={handleInspect}
              pageCount={pageCount}
            />
          ))
          .exhaustive()}

        <Sheet open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
          <SheetContent className="sm:max-w-2xl overflow-hidden flex flex-col">
            <SheetHeader className="mb-4">
              <SheetTitle>User Details</SheetTitle>
              <SheetDescription>
                Full inspection of the user document from the legacy MongoDB.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 mt-2">
              {userDetailQuery.isLoading ? (
                <div className="flex items-center justify-center h-40">Loading details...</div>
              ) : userDetailQuery.data ? (
                <UserDetailsSettings user={userDetailQuery.data} />
              ) : (
                <div className="text-center py-10 text-muted-foreground">User not found.</div>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </PageLayoutContent>
    </PageLayout>
  );
};
