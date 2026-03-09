import { getUiState } from '@bearstudio/ui-state';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
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
  const { t } = useTranslation(['common']);
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const usersQuery = useQuery(
    orpc.userMongo.list.queryOptions({
      input: {
        searchTerm: props.search.searchTerm,
        limit: props.search.limit,
        page: props.search.page,
        sortBy: props.search.sortBy,
        sortOrder: props.search.sortOrder,
      },
    })
  );

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

  const pagination = {
    pageIndex: (props.search.page ?? 1) - 1,
    pageSize: props.search.limit ?? 25,
  };

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
              onPaginationChange={(newPagination) => {
                router.navigate({
                  to: '.',
                  search: (prev: any) => ({
                    ...prev,
                    limit: newPagination.pageSize,
                    page: newPagination.pageIndex + 1,
                  }),
                  replace: true,
                });
              }}
              hasNextPage={
                (props.search.page ?? 1) - 1 < Math.ceil(total / pagination.pageSize) - 1
              }
              hasPrevPage={(props.search.page ?? 1) > 1}
              onNextPage={() => {
                router.navigate({
                  to: '.',
                  search: (prev: any) => ({ ...prev, page: (props.search.page ?? 1) + 1 }),
                  replace: true,
                });
              }}
              onPrevPage={() => {
                router.navigate({
                  to: '.',
                  search: (prev: any) => ({
                    ...prev,
                    page: Math.max(1, (props.search.page ?? 1) - 1),
                  }),
                  replace: true,
                });
              }}
              sorting={
                props.search.sortBy
                  ? [{ id: props.search.sortBy, desc: props.search.sortOrder === 'desc' }]
                  : []
              }
              onSortingChange={(newSorting) => {
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
              }}
              globalFilter={props.search.searchTerm ?? ''}
              onGlobalFilterChange={(value) => {
                router.navigate({
                  to: '.',
                  search: (prev: any) => ({ ...prev, searchTerm: String(value), page: 1 }),
                  replace: true,
                });
              }}
              onInspect={(user) => {
                setSelectedUserId(user.id);
              }}
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
