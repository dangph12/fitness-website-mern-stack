import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';

import { usePlans } from './plans-provider';

export function PlansFilters() {
  const { filters, updateFilters } = usePlans();

  // Local state for pending filters
  const [pending, setPending] = useState({
    search: filters.search || '',
    isPublic: filters.isPublic || 'all'
  });

  // Sync with filters when they change externally
  useEffect(() => {
    setPending({
      search: filters.search || '',
      isPublic: filters.isPublic || 'all'
    });
  }, [filters.search, filters.isPublic]);

  const handleApply = () => {
    updateFilters({
      search: pending.search,
      isPublic: pending.isPublic === 'all' ? '' : pending.isPublic,
      page: 1
    });
  };

  const handleReset = () => {
    setPending({
      search: '',
      isPublic: 'all'
    });
    updateFilters({
      search: '',
      isPublic: '',
      page: 1
    });
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const isFiltered = filters.isPublic !== '' || filters.search !== '';
  const hasChanges =
    pending.search !== filters.search ||
    (pending.isPublic === 'all' ? '' : pending.isPublic) !== filters.isPublic;

  return (
    <div className='flex items-center gap-2'>
      <Input
        placeholder='Search plans...'
        value={pending.search}
        onChange={e =>
          setPending(prev => ({ ...prev, search: e.target.value }))
        }
        onKeyPress={handleKeyPress}
        className='h-8 w-[150px] lg:w-[250px]'
      />

      <Select
        value={pending.isPublic}
        onValueChange={value =>
          setPending(prev => ({ ...prev, isPublic: value }))
        }
      >
        <SelectTrigger className='h-8 w-[130px]'>
          <SelectValue placeholder='All Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Status</SelectItem>
          <SelectItem value='true'>Public</SelectItem>
          <SelectItem value='false'>Private</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={handleApply}
        size='sm'
        className='h-8'
        disabled={!hasChanges}
      >
        <Search className='mr-2 h-4 w-4' />
        Apply
      </Button>

      {isFiltered && (
        <Button
          variant='ghost'
          onClick={handleReset}
          size='sm'
          className='h-8 px-2 lg:px-3'
        >
          Reset
          <X className='ml-2 h-4 w-4' />
        </Button>
      )}
    </div>
  );
}
