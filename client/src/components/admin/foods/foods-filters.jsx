import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';

export function FoodsFilters({ filters, onFiltersChange, onClearFilters }) {
  const categories = ['Meat', 'Fruits & Vegetables', 'Egg'];

  // Use local pending state - only apply on "Apply" click
  const [pending, setPending] = useState({
    title: filters.title || '',
    category: filters.category || '',
    caloriesRange: filters.caloriesRange || ''
  });

  // Keep pending synced when filters change from parent
  useEffect(() => {
    setPending({
      title: filters.title || '',
      category: filters.category || '',
      caloriesRange: filters.caloriesRange || ''
    });
  }, [filters]);

  const handleTitleChange = e => {
    setPending(prev => ({ ...prev, title: e.target.value }));
  };

  const handleCategoryChange = value => {
    setPending(prev => ({
      ...prev,
      category: value === 'all' ? '' : value
    }));
  };

  const handleCaloriesChange = value => {
    setPending(prev => ({
      ...prev,
      caloriesRange: value === 'all' ? '' : value
    }));
  };

  // Apply filters - send to parent
  const applyFilters = () => {
    const newFilters = {};

    if (pending.title && pending.title.trim()) {
      newFilters.title = pending.title.trim();
    }

    if (pending.category) {
      newFilters.category = pending.category;
    }

    if (pending.caloriesRange) {
      newFilters.caloriesRange = pending.caloriesRange;
    }

    onFiltersChange(newFilters);
  };

  // Reset filters
  const handleReset = () => {
    setPending({
      title: '',
      category: '',
      caloriesRange: ''
    });
    onClearFilters();
  };

  const hasActiveFilters = Boolean(
    (pending.title && pending.title.trim()) ||
      pending.category ||
      pending.caloriesRange
  );

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
      <div className='relative flex-1 max-w-sm'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search foods...'
          value={pending.title}
          onChange={handleTitleChange}
          className='pl-8'
        />
      </div>

      <Select
        value={pending.category || 'all'}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Category' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Categories</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='flex items-center gap-2'>
        <Button onClick={applyFilters} size='lg' disabled={!hasActiveFilters}>
          Apply Filters
        </Button>

        {hasActiveFilters && (
          <Button variant='ghost' onClick={handleReset} size='sm'>
            <X className='mr-2 h-4 w-4' />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
