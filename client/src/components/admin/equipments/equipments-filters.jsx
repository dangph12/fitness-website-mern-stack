'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export function EquipmentsFilters({ table }) {
  const [pending, setPending] = useState({
    title: ''
  });

  // Sync with table filters
  useEffect(() => {
    const currentFilter = table.getColumn('title')?.getFilterValue() ?? '';
    setPending({ title: currentFilter });
  }, [table.getColumn('title')?.getFilterValue()]);

  const handleTitleChange = e => {
    setPending({ title: e.target.value });
  };

  const applyFilters = () => {
    table.getColumn('title')?.setFilterValue(pending.title);
  };

  const handleReset = () => {
    setPending({ title: '' });
    table.resetColumnFilters();
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const hasActiveFilters = Boolean(pending.title && pending.title.trim());
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex items-center space-x-2'>
      <div className='relative'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search by title...'
          value={pending.title}
          onChange={handleTitleChange}
          onKeyPress={handleKeyPress}
          className='pl-8 h-8 w-[150px] lg:w-[250px]'
        />
      </div>

      <Button
        onClick={applyFilters}
        size='sm'
        className='h-8'
        disabled={!hasActiveFilters}
      >
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
