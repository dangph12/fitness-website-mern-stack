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

import { useMeals } from './meals-provider';

export function MealsFilters() {
  const { filters, updateFilters } = useMeals();

  const [pending, setPending] = useState({
    search: filters.search || '',
    mealType: filters.mealType || 'all'
  });

  useEffect(() => {
    setPending({
      search: filters.search || '',
      mealType: filters.mealType || 'all'
    });
  }, [filters.search, filters.mealType]);

  const handleApply = () => {
    updateFilters({
      search: pending.search,
      mealType: pending.mealType === 'all' ? '' : pending.mealType,
      page: 1
    });
  };

  const handleReset = () => {
    setPending({
      search: '',
      mealType: 'all'
    });
    updateFilters({
      search: '',
      mealType: '',
      page: 1
    });
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const isFiltered = filters.mealType !== '' || filters.search !== '';
  const hasChanges =
    pending.search !== filters.search ||
    (pending.mealType === 'all' ? '' : pending.mealType) !== filters.mealType;

  return (
    <div className='flex items-center gap-2'>
      <Input
        placeholder='Search meals...'
        value={pending.search}
        onChange={e =>
          setPending(prev => ({ ...prev, search: e.target.value }))
        }
        onKeyPress={handleKeyPress}
        className='h-8 w-[150px] lg:w-[250px]'
      />

      <Select
        value={pending.mealType}
        onValueChange={value =>
          setPending(prev => ({ ...prev, mealType: value }))
        }
      >
        <SelectTrigger className='h-8 w-[130px]'>
          <SelectValue placeholder='All Types' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Types</SelectItem>
          <SelectItem value='Breakfast'>Breakfast</SelectItem>
          <SelectItem value='Lunch'>Lunch</SelectItem>
          <SelectItem value='Dinner'>Dinner</SelectItem>
          <SelectItem value='Snack'>Snack</SelectItem>
          <SelectItem value='Brunch'>Brunch</SelectItem>
          <SelectItem value='Dessert'>Dessert</SelectItem>
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
