import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearFoods, fetchFoods } from '../../../store/features/food-slice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../ui/table';
import { DataTablePagination } from '../data-table-pagination';
import { DataTableViewOptions } from '../data-table-view-options';
import { FoodsColumns } from './foods-columns';
import { FoodsFilters } from './foods-filters';
import { FoodsPrimaryButtons } from './foods-primary-buttons';
import { useFoodsContext } from './foods-provider';

export function FoodsTable() {
  const dispatch = useDispatch();
  const { foods, loading, error } = useSelector(state => state.foods);
  const { selectedFoods, setSelectedFoods } = useFoodsContext();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  // Extract data and pagination info from foods slice
  const foodsData = foods?.foods || foods || [];
  const totalCount = foods?.totalCount || foods?.total || foodsData.length;
  const currentPage = foods?.currentPage || pagination.pageIndex + 1;
  const totalPages =
    foods?.totalPages || Math.ceil(totalCount / pagination.pageSize);

  // Fetch foods when pagination, sorting, or filters change
  useEffect(() => {
    dispatch(clearFoods());

    dispatch(
      fetchFoods({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting[0]?.id || 'createdAt',
        sortOrder: sorting[0]?.desc ? 'asc' : 'desc',
        filterParams: filters
      })
    );
  }, [dispatch, pagination.pageIndex, pagination.pageSize, sorting, filters]);

  const table = useReactTable({
    data: foodsData,
    columns: FoodsColumns,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: Math.max(0, currentPage - 1),
        pageSize: pagination.pageSize
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: updater => {
      const currentPageIndex = Math.max(0, currentPage - 1);
      const currentSize = pagination.pageSize;

      const newState =
        typeof updater === 'function'
          ? updater({ pageIndex: currentPageIndex, pageSize: currentSize })
          : updater;

      const newPage = newState.pageIndex || 0;
      const newSize = newState.pageSize || currentSize;

      // Update local pagination state
      setPagination({
        pageIndex: newPage,
        pageSize: newSize
      });

      // Clear row selection when changing pages
      setRowSelection({});
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  // Update selected foods when row selection changes
  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedFoodsList = selectedRows.map(row => row.original);
    setSelectedFoods(selectedFoodsList);
  }, [rowSelection, setSelectedFoods, table]);

  const handleFiltersChange = newFilters => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setRowSelection({});
  };

  const handleClearFilters = () => {
    setFilters({});
    setColumnFilters([]);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setRowSelection({});
  };

  if (loading && foodsData.length === 0) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2'></div>
          <p>Loading foods...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='text-center text-red-500'>
          <p>Error loading foods: {error}</p>
          <button
            onClick={() =>
              dispatch(fetchFoods({ page: 1, limit: pagination.pageSize }))
            }
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Header with Filters and Actions */}
      <div className='flex items-center justify-between'>
        <FoodsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
        <div className='flex items-center space-x-2'>
          <DataTableViewOptions table={table} />
          <FoodsPrimaryButtons selectedFoods={selectedFoods} />
        </div>
      </div>

      {/* Table */}
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
                  colSpan={FoodsColumns.length}
                  className='h-24 text-center'
                >
                  {loading ? 'Loading foods...' : 'No foods found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        loading={loading}
        showSelection={true}
      />
    </div>
  );
}
