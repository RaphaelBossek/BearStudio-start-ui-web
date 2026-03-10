import type { Table } from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/tailwind/utils';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  total: number;
}

export function DataTablePagination<TData>({ table, total }: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (pageCount <= maxVisible) {
      for (let i = 0; i < pageCount; i++) pages.push(i);
    } else {
      pages.push(0);
      if (pageIndex > 3) pages.push('ellipsis-start');

      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(pageCount - 2, pageIndex + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (pageIndex < pageCount - 4) pages.push('ellipsis-end');
      pages.push(pageCount - 1);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing <span className="font-medium">{total === 0 ? 0 : pageIndex * pageSize + 1}</span>-
        <span className="font-medium">{Math.min((pageIndex + 1) * pageSize, total)}</span> of{' '}
        <span className="font-medium">{total}</span> rows.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            </BreadcrumbItem>

            {getPageNumbers().map((page, i) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <BreadcrumbItem key={`ellipsis-${i}`}>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                );
              }

              const isCurrent = pageIndex === page;
              return (
                <BreadcrumbItem key={page}>
                  <Button
                    type="button"
                    variant={isCurrent ? 'default' : 'ghost'}
                    size="icon-xs"
                    onClick={() => table.setPageIndex(page as number)}
                    disabled={isCurrent}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {(page as number) + 1}
                  </Button>
                </BreadcrumbItem>
              );
            })}

            <BreadcrumbItem>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
