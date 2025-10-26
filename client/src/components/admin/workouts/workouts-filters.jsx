import { Search, X } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';

import { useWorkouts } from './workouts-provider';

export function WorkoutsFilters() {
  const {
    pendingFilters,
    appliedFilters,
    onPendingFiltersChange,
    applyFilters,
    clearFilters
  } = useWorkouts();

  const hasFilters =
    appliedFilters.title || appliedFilters.isPublic || appliedFilters.userName;
  const hasChanges =
    JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap'>
        <Input
          placeholder='Search by workout title...'
          value={pendingFilters.title}
          onChange={e => onPendingFiltersChange({ title: e.target.value })}
          className='h-8 w-full sm:w-[200px]'
        />

        <Input
          placeholder='Search by user name...'
          value={pendingFilters.userName}
          onChange={e => onPendingFiltersChange({ userName: e.target.value })}
          className='h-8 w-full sm:w-[200px]'
        />

        <Select
          value={pendingFilters.isPublic || 'all'}
          onValueChange={value =>
            onPendingFiltersChange({ isPublic: value === 'all' ? '' : value })
          }
        >
          <SelectTrigger className='h-8 w-full sm:w-[150px]'>
            <SelectValue placeholder='All Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='true'>Public</SelectItem>
            <SelectItem value='false'>Private</SelectItem>
          </SelectContent>
        </Select>

        <div className='flex gap-2'>
          <Button
            onClick={applyFilters}
            className='h-8 px-3'
            disabled={!hasChanges}
          >
            <Search className='mr-2 h-4 w-4' />
            Apply
          </Button>

          {hasFilters && (
            <Button
              variant='ghost'
              onClick={clearFilters}
              className='h-8 px-2 lg:px-3'
            >
              Reset
              <X className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
