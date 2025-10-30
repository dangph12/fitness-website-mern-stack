import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useEffect } from 'react';

import { DataTablePagination } from '~/components/admin/data-table-pagination';
import { DataTableViewOptions } from '~/components/admin/data-table-view-options';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';

import { mealsColumns } from './meals-columns';
import { MealsFilters } from './meals-filters';
import { MealsPrimaryButtons } from './meals-primary-buttons';
import { useMeals } from './meals-provider';

export function MealsTable() {
  const {
    meals,
    loading,
    filters,
    updateFilters,
    totalPages,
    selectedMeals,
    setSelectedMeals
  } = useMeals();

  const table = useReactTable({
    data: meals || [],
    columns: mealsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: filters.page - 1,
        pageSize: filters.limit
      },
      sorting: [
        {
          id: filters.sortBy,
          desc: filters.sortOrder === 'desc'
        }
      ],
      rowSelection: selectedMeals.reduce((acc, id) => {
        const index = meals?.findIndex(m => m._id === id);
        if (index !== -1) acc[index] = true;
        return acc;
      }, {})
    },
    onPaginationChange: updater => {
      const newPagination =
        typeof updater === 'function'
          ? updater({
              pageIndex: filters.page - 1,
              pageSize: filters.limit
            })
          : updater;

      updateFilters({
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize
      });
    },
    onSortingChange: updater => {
      const newSorting =
        typeof updater === 'function'
          ? updater([
              {
                id: filters.sortBy,
                desc: filters.sortOrder === 'desc'
              }
            ])
          : updater;

      if (newSorting.length > 0) {
        updateFilters({
          sortBy: newSorting[0].id,
          sortOrder: newSorting[0].desc ? 'desc' : 'asc',
          page: 1
        });
      }
    },
    onRowSelectionChange: updater => {
      const newRowSelection =
        typeof updater === 'function'
          ? updater(
              selectedMeals.reduce((acc, id) => {
                const index = meals?.findIndex(m => m._id === id);
                if (index !== -1) acc[index] = true;
                return acc;
              }, {})
            )
          : updater;

      const selectedIds = Object.keys(newRowSelection)
        .filter(key => newRowSelection[key])
        .map(key => meals[parseInt(key)]._id);

      setSelectedMeals(selectedIds);
    },
    enableRowSelection: true
  });

  useEffect(() => {
    setSelectedMeals([]);
  }, [filters.page]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <MealsFilters />
        <div className='flex items-center gap-2'>
          <DataTableViewOptions table={table} />
          <MealsPrimaryButtons />
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={mealsColumns.length}
                  className='h-24 text-center'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={mealsColumns.length}
                  className='h-24 text-center'
                >
                  No meals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} loading={loading} showSelection />
    </div>
  );
}
