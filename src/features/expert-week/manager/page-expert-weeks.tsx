import { getUiState } from '@bearstudio/ui-state';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
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
import {
  calculatePageCount,
  clampPageIndex,
  pageIndexToRoutePage,
  routePageToPageIndex,
} from '@/lib/pagination';

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

  const expertWeeksQuery = useQuery({
    ...orpc.expertWeek.list.queryOptions({
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

  const ui = getUiState((set) => {
    if (expertWeeksQuery.status === 'pending') return set('pending');
    if (expertWeeksQuery.status === 'error') return set('error');
    return set('default', {
      items: expertWeeksQuery.data?.items ?? [],
      total: expertWeeksQuery.data?.total ?? 0,
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
    () => calculatePageCount(expertWeeksQuery.data?.total ?? 0, pagination.pageSize),
    [expertWeeksQuery.data?.total, pagination.pageSize]
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
        expertWeeksQuery.data?.total ?? 0,
        newPagination.pageSize
      );
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
    [router, expertWeeksQuery.data?.total]
  );

  const handleSortingChange = useCallback(
    (newSorting: { id: string; desc: boolean }[]) => {
      const sort = newSorting[0];
      router.navigate({
        to: '.',
        search: (prev) => ({
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
        search: (prev) => ({ ...prev, searchTerm: String(value), page: 1 }),
        replace: true,
      });
    },
    [router]
  );

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
              onPaginationChange={handlePaginationChange}
              sorting={sorting}
              onSortingChange={handleSortingChange}
              globalFilter={props.search.searchTerm ?? ''}
              onGlobalFilterChange={handleGlobalFilterChange}
              pageCount={pageCount}
            />
          ))
          .exhaustive()}
      </PageLayoutContent>
    </PageLayout>
  );
};
