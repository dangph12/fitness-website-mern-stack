import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';

import { DataTablePagination } from '../data-table-pagination';
import { DataTableViewOptions } from '../data-table-view-options';
import { useWorkoutsColumns } from './workouts-columns';
import { WorkoutsDialogs } from './workouts-dialogs';
import { WorkoutsFilters } from './workouts-filters';
import { WorkoutsPrimaryButtons } from './workouts-primary-buttons';
import { useWorkouts } from './workouts-provider';

export function WorkoutsTable() {
  const {
    workouts,
    loading,
    pagination,
    selectedWorkouts,
    setSelectedWorkouts,
    fetchPage,
    handleSortingChange
  } = useWorkouts();

  const columns = useWorkoutsColumns();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Derive data from provider
  const workoutsData = workouts || [];
  const totalCount = pagination?.totalWorkouts || workoutsData.length;
  const derivedPageSize = pagination?.pageSize || 10;
  const derivedCurrentPage = pagination?.currentPage || 1;
  const totalPages =
    pagination?.totalPages ||
    Math.max(1, Math.ceil(totalCount / derivedPageSize));

  // Server-side pagination table
  const table = useReactTable({
    data: workoutsData,
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
    onPaginationChange: updater => {
      const currentPageIndex = Math.max(0, derivedCurrentPage - 1);
      const currentSize = derivedPageSize;

      const newState =
        typeof updater === 'function'
          ? updater({ pageIndex: currentPageIndex, pageSize: currentSize })
          : updater;

      const newPage = (newState.pageIndex || 0) + 1;
      const newSize = newState.pageSize || currentSize;

      if (newPage !== derivedCurrentPage || newSize !== derivedPageSize) {
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

  // Update selected workouts when row selection changes
  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedWorkoutIds = selectedRows.map(row => row.original._id);
    setSelectedWorkouts(selectedWorkoutIds);
  }, [rowSelection, setSelectedWorkouts, table]);

  // Handle sorting change
  useEffect(() => {
    if (sorting.length > 0) {
      const sort = sorting[0];
      handleSortingChange(sort.id, sort.desc ? 'desc' : 'asc');
    }
  }, [sorting, handleSortingChange]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <WorkoutsFilters />
        <div className='flex items-center space-x-2'>
          <DataTableViewOptions table={table} />
          <WorkoutsPrimaryButtons selectedWorkouts={selectedWorkouts} />
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
                  {loading ? 'Loading workouts...' : 'No workouts found.'}
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

      <WorkoutsDialogs />
    </div>
  );
}
