import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import React from 'react';

import { DataTablePagination } from '~/components/admin/data-table-pagination';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';

import { membershipsColumns } from './memberships-columns';
import MembershipsDetailsDialog from './memberships-details-dialog';
import MembershipsFilters from './memberships-filters';
import { useMemberships } from './memberships-provider';

const MembershipsTable = () => {
  const { payments, loading, error } = useMemberships();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({
    cancellationReason: true,
    completedAt: true,
    previousMembership: true
  });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: payments,
    columns: membershipsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <p className='text-destructive'>{error}</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <MembershipsFilters />

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
                  colSpan={membershipsColumns.length}
                  className='h-24 text-center'
                >
                  No membership payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} loading={loading} showSelection />

      <MembershipsDetailsDialog />
    </div>
  );
};

export default MembershipsTable;
