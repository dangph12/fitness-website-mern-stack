import { Search } from 'lucide-react';

import { Input } from '~/components/ui/input';

import { useMuscles } from './muscles-provider';

export const MusclesFilters = () => {
  const { filters, setFilters } = useMuscles();

  return (
    <div className='flex items-center gap-2'>
      <div className='relative flex-1 max-w-sm'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search muscles...'
          value={filters.search}
          onChange={e =>
            setFilters(prev => ({ ...prev, search: e.target.value }))
          }
          className='pl-8'
        />
      </div>
    </div>
  );
};
