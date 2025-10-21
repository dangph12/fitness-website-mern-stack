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

import { MusclesColumns } from './muscles-columns';
import { MusclesFilters } from './muscles-filters';
import { MusclesPrimaryButtons } from './muscles-primary-buttons';
import { useMuscles } from './muscles-provider';

export const MusclesTable = () => {
  const { muscles, loading, selectedMuscles, setSelectedMuscles } =
    useMuscles();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const musclesData = Array.isArray(muscles) ? muscles : [];

  const table = useReactTable({
    data: musclesData,
    columns: MusclesColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  // Update selected muscles when row selection changes
  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedMuscleIds = selectedRows.map(row => row.original._id);
    setSelectedMuscles(selectedMuscleIds);
  }, [rowSelection, setSelectedMuscles, table]);

  // Reset row selection when muscles data changes (after delete)
  useEffect(() => {
    setRowSelection({});
  }, [muscles.length]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <MusclesFilters />
        <div className='flex items-center space-x-2'>
          <DataTableViewOptions table={table} />
          <MusclesPrimaryButtons selectedMuscles={selectedMuscles} />
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
                  colSpan={MusclesColumns.length}
                  className='h-24 text-center'
                >
                  {loading ? 'Loading muscles...' : 'No muscles found.'}
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
