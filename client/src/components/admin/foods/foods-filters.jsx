import { Search, X } from 'lucide-react';

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

  const handleSearchChange = e => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      title: value || undefined // Use undefined instead of empty string
    });
  };

  const handleCategoryChange = value => {
    onFiltersChange({
      ...filters,
      category: value === 'all' ? undefined : value
    });
  };

  const handleCaloriesChange = value => {
    onFiltersChange({
      ...filters,
      caloriesRange: value === 'all' ? undefined : value
    });
  };

  const hasActiveFilters =
    filters.title || filters.category || filters.caloriesRange;

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
      <div className='relative flex-1 max-w-sm'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search foods...'
          value={filters.title || ''}
          onChange={handleSearchChange}
          className='pl-8'
        />
      </div>

      <Select
        value={filters.category || 'all'}
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

      <Select
        value={filters.caloriesRange || 'all'}
        onValueChange={handleCaloriesChange}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Calories Range' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Ranges</SelectItem>
          <SelectItem value='0-100'>0-100 cal</SelectItem>
          <SelectItem value='100-200'>100-200 cal</SelectItem>
          <SelectItem value='200-400'>200-400 cal</SelectItem>
          <SelectItem value='400+'>400+ cal</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant='ghost' onClick={onClearFilters} size='sm'>
          <X className='mr-2 h-4 w-4' />
          Clear
        </Button>
      )}
    </div>
  );
}
