// ...existing code...
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

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

import { useExercisesColumns } from './exercises-columns';
import { ExercisesFilters } from './exercises-filters';
import { ExercisesPrimaryButtons } from './exercises-primary-buttons';
import { useExercises } from './exercises-provider';

export const ExercisesTable = () => {
  const {
    exercises,
    loading,
    pagination,
    selectedExercises,
    setSelectedExercises,
    fetchPage,
    handleSortingChange
  } = useExercises();

  const columns = useExercisesColumns();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // derive data & paging info from provider/slice
  const exercisesData = exercises?.exercises || exercises || [];
  const totalCount =
    exercises?.totalExercises || exercises?.total || exercisesData.length;
  const derivedPageSize = pagination?.pageSize || 10;
  const derivedCurrentPage = pagination?.currentPage || 1;
  const totalPages =
    pagination?.totalPages ||
    Math.max(1, Math.ceil(totalCount / derivedPageSize));

  // NOTE: Server-side pagination: drive react-table pagination from provider state
  const table = useReactTable({
    data: exercisesData,
    columns,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: Math.max(0, derivedCurrentPage - 1),
        pageSize: derivedPageSize
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    // when pagination changes in the table UI, call provider.fetchPage (server side)
    onPaginationChange: updater => {
      const currentPageIndex = Math.max(0, derivedCurrentPage - 1);
      const currentSize = derivedPageSize;

      const newState =
        typeof updater === 'function'
          ? updater({ pageIndex: currentPageIndex, pageSize: currentSize })
          : updater;

      const newPage = (newState.pageIndex || 0) + 1;
      const newSize = newState.pageSize || currentSize;

      // if page or size changed, request provider to fetch
      if (newPage !== derivedCurrentPage || newSize !== derivedPageSize) {
        // if page size changed, reset to page 1 (common UX)
        if (newSize !== derivedPageSize) {
          fetchPage(1, newSize);
        } else {
          fetchPage(newPage, newSize);
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true
  });

  // Update selected exercises when row selection changes
  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedExerciseIds = selectedRows.map(row => row.original._id);
    setSelectedExercises(selectedExerciseIds);
    // keep dependency on rowSelection so it runs when selection changes
  }, [rowSelection, setSelectedExercises, table]);

  // Handle sorting change -> inform provider
  useEffect(() => {
    if (sorting.length > 0) {
      const sort = sorting[0];
      handleSortingChange(sort.id, sort.desc ? 'desc' : 'asc');
    }
  }, [sorting, handleSortingChange]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <ExercisesFilters />
        <div className='flex items-center space-x-2'>
          <DataTableViewOptions table={table} />
          <ExercisesPrimaryButtons selectedExercises={selectedExercises} />
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
            {table.getRowModel().rows?.length ? (
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
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {loading ? 'Loading exercises...' : 'No exercises found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        loading={loading}
        showSelection={true}
      />
    </div>
  );
};
// ...existing code...
