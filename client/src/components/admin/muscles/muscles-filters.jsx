import { Search, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import { useMuscles } from './muscles-provider';

export const MusclesFilters = () => {
  const { filters, handleFiltersChange, clearFilters } = useMuscles();
  const [localSearch, setLocalSearch] = useState(filters.search);

  const handleApplyFilter = () => {
    handleFiltersChange({ search: localSearch });
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    clearFilters();
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleApplyFilter();
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <div className='relative flex-1 max-w-sm'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search muscles...'
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className='pl-8'
        />
      </div>

      <Button variant='default' size='sm' onClick={handleApplyFilter}>
        Apply
      </Button>

      {filters.search && (
        <Button variant='ghost' size='sm' onClick={handleClearFilters}>
          <X className='h-4 w-4 mr-1' />
          Clear
        </Button>
      )}
    </div>
  );
};
