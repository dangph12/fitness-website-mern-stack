import { Filter, X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';

import { useMemberships } from './memberships-provider';

const MembershipsFilters = () => {
  const { filters, handleFilterChange } = useMemberships();

  // Local state for filters before applying
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    status: filters.status || '',
    targetMembership: filters.targetMembership || ''
  });

  const handleLocalChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    handleFilterChange('search', localFilters.search);
    handleFilterChange('status', localFilters.status);
    handleFilterChange('targetMembership', localFilters.targetMembership);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      search: '',
      status: '',
      targetMembership: ''
    };
    setLocalFilters(clearedFilters);
    handleFilterChange('search', '');
    handleFilterChange('status', '');
    handleFilterChange('targetMembership', '');
  };

  const hasChanges =
    localFilters.search !== filters.search ||
    localFilters.status !== filters.status ||
    localFilters.targetMembership !== filters.targetMembership;

  const hasActiveFilters =
    filters.status || filters.targetMembership || filters.search;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center'>
        <Input
          placeholder='Search by user name, email, or order code...'
          value={localFilters.search}
          onChange={e => handleLocalChange('search', e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleApplyFilters();
            }
          }}
          className='max-w-sm'
        />

        <div className='flex items-center gap-2'>
          <Select
            value={localFilters.status || undefined}
            onValueChange={value => handleLocalChange('status', value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='pending'>Pending</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='cancelled'>Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {localFilters.status && (
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => handleLocalChange('status', '')}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Select
            value={localFilters.targetMembership || undefined}
            onValueChange={value =>
              handleLocalChange('targetMembership', value)
            }
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by membership' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='vip'>VIP</SelectItem>
              <SelectItem value='premium'>Premium</SelectItem>
            </SelectContent>
          </Select>
          {localFilters.targetMembership && (
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => handleLocalChange('targetMembership', '')}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>

        {/* Apply Filter Button */}
        <Button
          variant='default'
          size='sm'
          onClick={handleApplyFilters}
          disabled={!hasChanges}
          className='h-9'
        >
          <Filter className='mr-2 h-4 w-4' />
          Apply Filters
        </Button>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleClearAll}
            className='h-9'
          >
            <X className='mr-2 h-4 w-4' />
            Clear All
          </Button>
        )}
      </div>

      {/* Active filters indicator */}
      {/* {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Search: {filters.search}
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Status: {filters.status}
            </span>
          )}
          {filters.targetMembership && (
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              Membership: {filters.targetMembership.toUpperCase()}
            </span>
          )}
        </div>
      )} */}
    </div>
  );
};

export default MembershipsFilters;
