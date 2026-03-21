import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/ui/search-input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { asString } from '../types';

type Column = {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
};

type FilterableTableProps = {
  title: string;
  rows: Record<string, unknown>[];
  columns: Column[];
};

export const FilterableTable = ({ title, rows, columns }: FilterableTableProps) => {
  const [search, setSearch] = useState('');

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const lower = search.toLowerCase();
    return rows.filter((row) =>
      columns.some((column) =>
        String(row[column.key] ?? '')
          .toLowerCase()
          .includes(lower)
      )
    );
  }, [columns, rows, search]);

  return (
    <div className="space-y-3">
      <SearchInput
        value={search}
        onChange={(value) => setSearch(value ?? '')}
        placeholder={`Filter ${title}...`}
      />
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground h-20"
                >
                  No entries
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => (
                <TableRow key={`${title}-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={`${title}-${index}-${column.key}`}>
                      {column.render ? column.render(row) : asString(row[column.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
