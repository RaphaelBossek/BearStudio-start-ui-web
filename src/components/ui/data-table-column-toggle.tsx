import type { Table } from '@tanstack/react-table';
import { Settings2Icon } from 'lucide-react';
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
} from '@/components/ui/responsive-drawer';

interface DataTableColumnToggleProps<TData> {
  table: Table<TData>;
}

export function DataTableColumnToggle<TData>({ table }: DataTableColumnToggleProps<TData>) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [, forceUpdate] = React.useReducer(() => ({}), {});

  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  const showMore = columns.length > 9;
  const visibleColumns = showMore ? columns.filter((column) => column.getIsVisible()) : columns;

  // React to table state changes internally to ensure the component is always fresh
  // even if the parent doesn't propagate the reference change properly in edge cases
  React.useEffect(() => {
    forceUpdate();
  }, [table.getState().columnVisibility]);

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
                  onCheckedChange={(value) => {
                    column.toggleVisibility(!!value);
                  }}
                  closeOnClick={false}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuGroup>
          {showMore && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="w-full justify-start cursor-pointer text-primary hover:bg-accent hover:text-accent-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDrawerOpen(true);
                }}
              >
                More...
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showMore && (
        <ResponsiveDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
                      onCheckedChange={(value) => {
                        column.toggleVisibility(!!value);
                      }}
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
    </div>
  );
}
