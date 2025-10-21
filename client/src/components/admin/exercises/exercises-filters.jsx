import { Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';

import { useExercises } from './exercises-provider';

export const ExercisesFilters = () => {
  const {
    filters = {},
    handleFiltersChange,
    clearFilters,
    musclesMap = {},
    equipmentsMap = {}
  } = useExercises();

  // Use local pending state and only apply on "Apply" click to avoid infinite loops
  const [pending, setPending] = useState({
    title: filters.title || filters.search || '',
    difficulty: filters.difficulty || '',
    type: filters.type || '',
    muscles: filters.muscles || '',
    equipments: filters.equipments || ''
  });

  // keep pending synced when provider filters change (e.g. reset from elsewhere)
  useEffect(() => {
    setPending({
      title: filters.title || filters.search || '',
      difficulty: filters.difficulty || '',
      type: filters.type || '',
      muscles: filters.muscles || '',
      equipments: filters.equipments || ''
    });
  }, [filters]);

  // Convert maps to arrays for dropdowns
  const musclesList = Object.entries(musclesMap).map(([id, name]) => ({
    id,
    name
  }));
  const equipmentsList = Object.entries(equipmentsMap).map(([id, name]) => ({
    id,
    name
  }));

  const handleTitleChange = e =>
    setPending(p => ({ ...p, title: e.target.value }));
  const handleDifficultyChange = value =>
    setPending(p => ({ ...p, difficulty: value === 'all' ? '' : value }));
  const handleTypeChange = value =>
    setPending(p => ({ ...p, type: value === 'all' ? '' : value }));
  const handleMusclesChange = value =>
    setPending(p => ({ ...p, muscles: value === 'all' ? '' : value }));
  const handleEquipmentsChange = value =>
    setPending(p => ({ ...p, equipments: value === 'all' ? '' : value }));

  const applyFilters = () => {
    // Backend expects title param (not 'search'), so map title accordingly
    handleFiltersChange({
      title: pending.title ? String(pending.title).trim() : '',
      difficulty: pending.difficulty || '',
      type: pending.type || '',
      muscles: pending.muscles || '',
      equipments: pending.equipments || ''
    });
  };

  const handleReset = () => {
    setPending({
      title: '',
      difficulty: '',
      type: '',
      muscles: '',
      equipments: ''
    });
    clearFilters();
  };

  const hasActiveFilters = Boolean(
    (pending.title && pending.title.trim()) ||
      pending.difficulty ||
      pending.type ||
      pending.muscles ||
      pending.equipments
  );

  return (
    <div className='space-y-4'>
      {/* First Row: Search, Difficulty, Type */}
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by title...'
            value={pending.title}
            onChange={handleTitleChange}
            className='pl-8 w-[250px]'
          />
        </div>

        <Select
          value={pending.difficulty || 'all'}
          onValueChange={handleDifficultyChange}
        >
          <SelectTrigger className='w-[130px]'>
            <SelectValue placeholder='Difficulty' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Levels</SelectItem>
            <SelectItem value='Beginner'>Beginner</SelectItem>
            <SelectItem value='Intermediate'>Intermediate</SelectItem>
            <SelectItem value='Advanced'>Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select value={pending.type || 'all'} onValueChange={handleTypeChange}>
          <SelectTrigger className='w-[130px]'>
            <SelectValue placeholder='Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Types</SelectItem>
            <SelectItem value='Strength'>Strength</SelectItem>
            <SelectItem value='Stretching'>Stretching</SelectItem>
            <SelectItem value='Power'>Power</SelectItem>
            <SelectItem value='Olympic'>Olympic</SelectItem>
            <SelectItem value='Explosive'>Explosive</SelectItem>
            <SelectItem value='Mobility'>Mobility</SelectItem>
            <SelectItem value='Dynamic'>Dynamic</SelectItem>
            <SelectItem value='Yoga'>Yoga</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={pending.muscles || 'all'}
          onValueChange={handleMusclesChange}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Target Muscle' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Muscles</SelectItem>
            {musclesList.length === 0 ? (
              <SelectItem value='none' disabled>
                No muscles available
              </SelectItem>
            ) : (
              musclesList.map(muscle => (
                <SelectItem key={muscle.id} value={muscle.id}>
                  {muscle.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select
          value={pending.equipments || 'all'}
          onValueChange={handleEquipmentsChange}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Equipment' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Equipment</SelectItem>
            {equipmentsList.length === 0 ? (
              <SelectItem value='none' disabled>
                No equipment available
              </SelectItem>
            ) : (
              equipmentsList.map(equipment => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Button
          onClick={applyFilters}
          className='h-8 px-3'
          disabled={!hasActiveFilters}
        >
          Apply Filters
        </Button>

        <Button
          variant='ghost'
          onClick={handleReset}
          className='h-8 px-2 lg:px-3'
        >
          Reset
          <X className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};
