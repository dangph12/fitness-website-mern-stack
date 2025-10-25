import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';

import { Button } from '../ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

export function DataTablePagination({ table, loading, showSelection = false }) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;

  // For server-side pagination, get the actual row count from data
  const totalRows =
    table.options.pageCount * pageSize ||
    table.getFilteredRowModel().rows.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;

  // Generate page numbers to display
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [1];

  return (
    <div className='flex items-center justify-between px-2 py-4'>
      {showSelection && (
        <div className='flex-1 text-sm text-muted-foreground'>
          {selectedRows} of {table.getRowModel().rows.length} row(s) selected.
        </div>
      )}

      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium whitespace-nowrap'>
            <span className='hidden sm:inline'>Rows per page</span>
            <span className='sm:hidden'>Per page</span>
          </p>
          <Select
            value={`${pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}
            disabled={loading}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map(size => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center justify-center text-sm font-medium whitespace-nowrap'>
          <span className='hidden sm:inline'>
            Page {currentPage} of {totalPages || 1}
          </span>
          <span className='sm:hidden'>
            {currentPage}/{totalPages || 1}
          </span>
        </div>

        {/* Shadcn UI Pagination */}
        <Pagination>
          <PaginationContent>
            {/* First page button */}
            <PaginationItem>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage() || loading}
              >
                <span className='sr-only'>Go to first page</span>
                <DoubleArrowLeftIcon className='h-4 w-4' />
              </Button>
            </PaginationItem>

            {/* Previous page */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || loading}
                className={`${!table.getCanPreviousPage() || loading ? 'pointer-events-none opacity-50' : ''}`}
              />
            </PaginationItem>

            {/* Page numbers */}
            {totalPages > 1 &&
              visiblePages.map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => table.setPageIndex(page - 1)}
                      isActive={page === currentPage}
                      disabled={loading}
                      className={
                        loading ? 'pointer-events-none opacity-50' : ''
                      }
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

            {/* Next page */}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || loading}
                className={`${!table.getCanNextPage() || loading ? 'pointer-events-none opacity-50' : ''}`}
              />
            </PaginationItem>

            {/* Last page button */}
            <PaginationItem>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage() || loading}
              >
                <span className='sr-only'>Go to last page</span>
                <DoubleArrowRightIcon className='h-4 w-4' />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
