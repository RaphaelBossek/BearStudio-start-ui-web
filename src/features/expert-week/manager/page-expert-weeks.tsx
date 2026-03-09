import { getUiState } from '@bearstudio/ui-state';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { DataListErrorState, DataListLoadingState } from '@/components/ui/datalist';
import { ExpertWeeksTable } from '@/features/expert-week/manager/expert-weeks-table';
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutTopBar,
  PageLayoutTopBarTitle,
} from '@/layout/manager/page-layout';
import { orpc } from '@/lib/orpc/client';

export const PageExpertWeeks = (props: {
  search: {
    searchTerm?: string;
    limit?: number;
    page?: number;
    sortBy?: 'dateCreated' | 'dateChanged' | 'userDisplayName';
    sortOrder?: 'asc' | 'desc';
  };
}) => {
  const { t } = useTranslation(['common']);
  const router = useRouter();

  const expertWeeksQuery = useQuery(
    orpc.expertWeek.list.queryOptions({
      input: {
        searchTerm: props.search.searchTerm,
        limit: props.search.limit,
        page: props.search.page,
        sortBy: props.search.sortBy,
        sortOrder: props.search.sortOrder,
      },
    })
  );

  const ui = getUiState((set) => {
    if (expertWeeksQuery.status === 'pending') return set('pending');
    if (expertWeeksQuery.status === 'error') return set('error');
    return set('default', {
      items: expertWeeksQuery.data?.items ?? [],
      total: expertWeeksQuery.data?.total ?? 0,
    });
  });

  const pagination = {
    pageIndex: (props.search.page ?? 1) - 1,
    pageSize: props.search.limit ?? 25,
  };

  return (
    <PageLayout>
      <PageLayoutTopBar>
        <PageLayoutTopBarTitle>{t('manager.list.title', 'Expert Weeks')}</PageLayoutTopBarTitle>
      </PageLayoutTopBar>
      <PageLayoutContent className="pb-20">
        {ui
          .match('pending', () => <DataListLoadingState />)
          .match('error', () => <DataListErrorState retry={() => expertWeeksQuery.refetch()} />)
          .match('default', ({ items, total }) => (
            <ExpertWeeksTable
              data={items}
              isLoading={expertWeeksQuery.isLoading || expertWeeksQuery.isFetching}
              total={total}
              pagination={pagination}
              onPaginationChange={(newPagination) => {
                router.navigate({
                  to: '.',
                  search: (prev) => ({
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
                  search: (prev) => ({ ...prev, page: (props.search.page ?? 1) + 1 }),
                  replace: true,
                });
              }}
              onPrevPage={() => {
                router.navigate({
                  to: '.',
                  search: (prev) => ({ ...prev, page: Math.max(1, (props.search.page ?? 1) - 1) }),
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
                  search: (prev) => ({
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
                  search: (prev) => ({ ...prev, searchTerm: String(value) }),
                  replace: true,
                });
              }}
            />
          ))
          .exhaustive()}
      </PageLayoutContent>
    </PageLayout>
  );
};
