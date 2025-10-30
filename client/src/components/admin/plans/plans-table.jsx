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

import { plansColumns } from './plans-columns';
import { PlansFilters } from './plans-filters';
import { PlansPrimaryButtons } from './plans-primary-buttons';
import { usePlans } from './plans-provider';

export function PlansTable() {
  const {
    plans,
    loading,
    filters,
    updateFilters,
    totalPages,
    selectedPlans,
    setSelectedPlans
  } = usePlans();

  const table = useReactTable({
    data: plans || [],
    columns: plansColumns,
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
      rowSelection: selectedPlans.reduce((acc, id) => {
        const index = plans?.findIndex(p => p._id === id);
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
              selectedPlans.reduce((acc, id) => {
                const index = plans?.findIndex(p => p._id === id);
                if (index !== -1) acc[index] = true;
                return acc;
              }, {})
            )
          : updater;

      const selectedIds = Object.keys(newRowSelection)
        .filter(key => newRowSelection[key])
        .map(key => plans[parseInt(key)]._id);

      setSelectedPlans(selectedIds);
    },
    enableRowSelection: true
  });

  // Clear selection when changing pages
  useEffect(() => {
    setSelectedPlans([]);
  }, [filters.page]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <PlansFilters />
        <div className='flex items-center gap-2'>
          <DataTableViewOptions table={table} />
          <PlansPrimaryButtons />
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
                  colSpan={plansColumns.length}
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
                  colSpan={plansColumns.length}
                  className='h-24 text-center'
                >
                  No plans found.
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
