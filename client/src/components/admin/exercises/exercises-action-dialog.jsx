import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import {
  createExercise,
  updateExercise
} from '~/store/features/exercise-slice';

import { useExercises } from './exercises-provider';

export const ExercisesActionDialog = ({
  open,
  onOpenChange,
  exercise = null,
  mode = 'create' // 'create' or 'edit'
}) => {
  const dispatch = useDispatch();
  const { refreshData } = useExercises();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: '',
    type: '',
    tutorial: '',
    instructions: '',
    muscles: '',
    equipments: ''
  });

  useEffect(() => {
    if (exercise && mode === 'edit') {
      setFormData({
        title: exercise.title || '',
        difficulty: exercise.difficulty || '',
        type: exercise.type || '',
        tutorial: exercise.tutorial || '',
        instructions: exercise.instructions || '',
        muscles: Array.isArray(exercise.muscles)
          ? exercise.muscles.join(', ')
          : '',
        equipments: Array.isArray(exercise.equipments)
          ? exercise.equipments.join(', ')
          : ''
      });
    } else {
      setFormData({
        title: '',
        difficulty: '',
        type: '',
        tutorial: '',
        instructions: '',
        muscles: '',
        equipments: ''
      });
    }
  }, [exercise, mode, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const exerciseData = {
        ...formData,
        muscles: formData.muscles
          .split(',')
          .map(m => m.trim())
          .filter(Boolean),
        equipments: formData.equipments
          .split(',')
          .map(e => e.trim())
          .filter(Boolean)
      };

      if (mode === 'edit' && exercise) {
        await dispatch(
          updateExercise({
            id: exercise._id,
            updateData: exerciseData
          })
        ).unwrap();
        toast.success('Exercise updated successfully');
      } else {
        await dispatch(createExercise(exerciseData)).unwrap();
        toast.success('Exercise created successfully');
      }

      refreshData();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || `Failed to ${mode} exercise`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Exercise' : 'Create New Exercise'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update the exercise information below.'
              : 'Fill in the details to create a new exercise.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Exercise Name *</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder='e.g. Push-ups'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='difficulty'>Difficulty *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={value => handleInputChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select difficulty' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Beginner'>Beginner</SelectItem>
                  <SelectItem value='Intermediate'>Intermediate</SelectItem>
                  <SelectItem value='Advanced'>Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='type'>Exercise Type *</Label>
              <Select
                value={formData.type}
                onValueChange={value => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Strength'>Strength</SelectItem>
                  <SelectItem value='Cardio'>Cardio</SelectItem>
                  <SelectItem value='Flexibility'>Flexibility</SelectItem>
                  <SelectItem value='Balance'>Balance</SelectItem>
                  <SelectItem value='Endurance'>Endurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tutorial'>Tutorial URL</Label>
              <Input
                id='tutorial'
                type='url'
                value={formData.tutorial}
                onChange={e => handleInputChange('tutorial', e.target.value)}
                placeholder='https://example.com/tutorial'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='instructions'>Instructions *</Label>
            <Textarea
              id='instructions'
              value={formData.instructions}
              onChange={e => handleInputChange('instructions', e.target.value)}
              placeholder='Step-by-step instructions for the exercise...'
              rows={4}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='muscles'>Target Muscles</Label>
            <Input
              id='muscles'
              value={formData.muscles}
              onChange={e => handleInputChange('muscles', e.target.value)}
              placeholder='e.g. chest, shoulders, triceps (comma separated)'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='equipments'>Equipment Needed</Label>
            <Input
              id='equipments'
              value={formData.equipments}
              onChange={e => handleInputChange('equipments', e.target.value)}
              placeholder='e.g. dumbbells, resistance bands (comma separated)'
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading
                ? mode === 'edit'
                  ? 'Updating...'
                  : 'Creating...'
                : mode === 'edit'
                  ? 'Update Exercise'
                  : 'Create Exercise'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
