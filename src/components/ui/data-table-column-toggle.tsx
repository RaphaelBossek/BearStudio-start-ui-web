import type { Table } from '@tanstack/react-table';
import { Settings2Icon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerContent,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
  ResponsiveDrawerTrigger,
} from '@/components/ui/responsive-drawer';

interface DataTableColumnToggleProps<TData> {
  table: Table<TData>;
}

export function DataTableColumnToggle<TData>({ table }: DataTableColumnToggleProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide());

  const showMore = columns.length > 9;
  const visibleColumns = showMore ? columns.slice(0, 8) : columns;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto hidden h-8 lg:flex items-center justify-center rounded-md border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <Settings2Icon className="mr-2 h-4 w-4" />
          Columns
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {visibleColumns.map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuGroup>
          {showMore && (
            <ResponsiveDrawer>
              <ResponsiveDrawerTrigger className="w-full justify-start px-2 py-1.5 text-sm font-normal text-primary hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer">
                More...
              </ResponsiveDrawerTrigger>
              <ResponsiveDrawerContent>
                <ResponsiveDrawerHeader>
                  <ResponsiveDrawerTitle>Column Selection</ResponsiveDrawerTitle>
                </ResponsiveDrawerHeader>
                <ResponsiveDrawerBody className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    {columns.map((column) => (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`col-${column.id}`}
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        />
                        <Label htmlFor={`col-${column.id}`} className="capitalize">
                          {column.id}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ResponsiveDrawerBody>
              </ResponsiveDrawerContent>
            </ResponsiveDrawer>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
