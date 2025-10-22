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

  const [pending, setPending] = useState({
    title: filters.title || '',
    difficulty: filters.difficulty || '',
    type: filters.type || '',
    muscles: filters.muscles || '',
    equipments: filters.equipments || ''
  });

  useEffect(() => {
    setPending({
      title: filters.title || '',
      difficulty: filters.difficulty || '',
      type: filters.type || '',
      muscles: filters.muscles || '',
      equipments: filters.equipments || ''
    });
  }, [filters]);

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
    console.log('🔍 Applying filters:', {
      title: pending.title,
      muscles: pending.muscles,
      equipments: pending.equipments
    });

    // Only send non-empty values to avoid sending empty strings
    const filtersToSend = {};

    if (pending.title && pending.title.trim()) {
      filtersToSend.title = pending.title.trim();
    }
    if (pending.difficulty) {
      filtersToSend.difficulty = pending.difficulty;
    }
    if (pending.type) {
      filtersToSend.type = pending.type;
    }
    if (pending.muscles) {
      filtersToSend.muscles = pending.muscles;
    }
    if (pending.equipments) {
      filtersToSend.equipments = pending.equipments;
    }

    console.log('📤 Sending only active filters:', filtersToSend);
    handleFiltersChange(filtersToSend);
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

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      applyFilters();
    }
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
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by title...'
            value={pending.title}
            onChange={handleTitleChange}
            onKeyPress={handleKeyPress}
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
          className='h-10 px-4'
          disabled={!hasActiveFilters}
        >
          Apply
        </Button>

        {hasActiveFilters && (
          <Button variant='ghost' onClick={handleReset} className='h-10 px-3'>
            Reset
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
};
