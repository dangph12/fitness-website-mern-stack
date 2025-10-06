import { Cross2Icon } from '@radix-ui/react-icons';
import React, { useCallback, useMemo } from 'react';

import { Button } from '../ui/button';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableSearchInput } from './search';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'moderator', label: 'Moderator' }
];

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

export function DataTableToolbar({
  table,
  filters,
  onFiltersChange,
  onClearFilters
}) {
  const isFiltered = useMemo(() => {
    return filters?.search || filters?.role || filters?.gender;
  }, [filters?.search, filters?.role, filters?.gender]);

  const handleSearchChange = useCallback(
    event => {
      onFiltersChange({ search: event.target.value });
    },
    [onFiltersChange]
  );

  const handleSearchClear = useCallback(() => {
    onFiltersChange({ search: '' });
  }, [onFiltersChange]);

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Search Input - Fixed width để tránh layout shift */}
        <DataTableSearchInput
          placeholder='Filter users...'
          value={filters?.search || ''}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          className='h-8 w-[150px] lg:w-[250px] shrink-0'
        />

        {/* Filters Container - Flexible nhưng không wrap */}
        <div className='flex gap-x-2 flex-nowrap'>
          {table && (
            <>
              <DataTableFacetedFilter
                column={table.getColumn('role')}
                title='Role'
                options={roles}
              />
              <DataTableFacetedFilter
                column={table.getColumn('gender')}
                title='Gender'
                options={genders}
              />
            </>
          )}

          {/* Reset button trong cùng container để tránh wrap */}
          {isFiltered && (
            <Button
              variant='ghost'
              onClick={onClearFilters}
              className='h-8 px-2 lg:px-3 whitespace-nowrap'
            >
              Reset
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
      </div>

      {/* View Options */}
      {table && <DataTableViewOptions table={table} />}
    </div>
  );
}
