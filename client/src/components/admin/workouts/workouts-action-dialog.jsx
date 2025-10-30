import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
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
import { ScrollArea } from '~/components/ui/scroll-area';
import { fetchAllExercises } from '~/store/features/exercise-slice';
import { createWorkout, updateWorkout } from '~/store/features/workout-slice';

import { useWorkouts } from './workouts-provider';

export const WorkoutsActionDialog = ({
  open,
  onOpenChange,
  workout = null,
  mode = 'create'
}) => {
  const dispatch = useDispatch();
  const { refreshData } = useWorkouts();
  const [loading, setLoading] = useState(false);
  const userId = useSelector(state => state.auth.user?.id);

  // Fix: Handle both array and object structure from exercise slice
  const exercisesState = useSelector(state => state.exercises);
  const exercises = Array.isArray(exercisesState)
    ? exercisesState
    : Array.isArray(exercisesState?.exercises)
      ? exercisesState.exercises
      : [];

  const [formData, setFormData] = useState({
    title: '',
    image: null,
    isPublic: false,
    selectedExercises: []
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (open) {
      dispatch(fetchAllExercises());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (workout && mode === 'edit') {
      setFormData({
        title: workout.title || '',
        image: null,
        isPublic: workout.isPublic || false,
        selectedExercises:
          workout.exercises?.map(ex => ({
            exerciseId:
              typeof ex.exercise === 'string' ? ex.exercise : ex.exercise?._id,
            sets: ex.sets || [10]
          })) || []
      });
      setImagePreview(workout.image || '');
    } else if (!workout && mode === 'create') {
      setFormData({
        title: '',
        image: null,
        isPublic: false,
        selectedExercises: []
      });
      setImagePreview('');
    }
  }, [workout, mode, open]);

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleExercise = exerciseId => {
    setFormData(prev => {
      const exists = prev.selectedExercises.find(
        ex => ex.exerciseId === exerciseId
      );
      if (exists) {
        return {
          ...prev,
          selectedExercises: prev.selectedExercises.filter(
            ex => ex.exerciseId !== exerciseId
          )
        };
      } else {
        return {
          ...prev,
          selectedExercises: [
            ...prev.selectedExercises,
            { exerciseId, sets: [10] }
          ]
        };
      }
    });
  };

  const updateSets = (exerciseId, sets) => {
    setFormData(prev => ({
      ...prev,
      selectedExercises: prev.selectedExercises.map(ex =>
        ex.exerciseId === exerciseId ? { ...ex, sets } : ex
      )
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a workout title');
      return;
    }

    if (formData.selectedExercises.length === 0) {
      toast.error('Please select at least one exercise');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      if (formData.image) {
        data.append('image', formData.image);
      }
      data.append('isPublic', String(formData.isPublic));
      data.append('user', userId);

      formData.selectedExercises.forEach((ex, index) => {
        data.append(`exercises[${index}][exercise]`, ex.exerciseId);
        ex.sets.forEach((set, setIndex) => {
          data.append(`exercises[${index}][sets][${setIndex}]`, String(set));
        });
      });

      if (mode === 'edit' && workout?._id) {
        await dispatch(
          updateWorkout({ workoutId: workout._id, updateData: data })
        ).unwrap();
        toast.success('Workout updated successfully');
      } else {
        await dispatch(createWorkout(data)).unwrap();
        toast.success('Workout created successfully');
      }

      refreshData();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Workout' : 'Create New Workout'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update the workout details below'
              : 'Fill in the details to create a new workout'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className='max-h-[60vh] pr-4'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Title *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder='Enter workout title'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='image'>Image</Label>
                <Input
                  id='image'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='mt-2 h-32 w-32 object-cover rounded'
                  />
                )}
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isPublic'
                  checked={formData.isPublic}
                  onCheckedChange={checked =>
                    setFormData(prev => ({ ...prev, isPublic: checked }))
                  }
                />
                <Label htmlFor='isPublic' className='cursor-pointer'>
                  Make this workout public
                </Label>
              </div>

              <div className='space-y-2'>
                <Label>Exercises * (Select at least one)</Label>
                <div className='border rounded-lg p-3 max-h-64 overflow-y-auto'>
                  {exercises.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>
                      No exercises available
                    </p>
                  ) : (
                    <div className='space-y-3'>
                      {exercises.map(exercise => {
                        const isSelected = formData.selectedExercises.find(
                          ex => ex.exerciseId === exercise._id
                        );
                        return (
                          <div
                            key={exercise._id}
                            className='border rounded p-2 space-y-2'
                          >
                            <div className='flex items-center space-x-2'>
                              <Checkbox
                                id={exercise._id}
                                checked={!!isSelected}
                                onCheckedChange={() =>
                                  toggleExercise(exercise._id)
                                }
                              />
                              <Label
                                htmlFor={exercise._id}
                                className='cursor-pointer flex-1'
                              >
                                {exercise.title}
                              </Label>
                            </div>
                            {isSelected && (
                              <div className='ml-6 space-y-1'>
                                <Label className='text-xs text-muted-foreground'>
                                  Sets (comma-separated reps)
                                </Label>
                                <Input
                                  value={isSelected.sets.join(', ')}
                                  onChange={e => {
                                    const sets = e.target.value
                                      .split(',')
                                      .map(s => parseInt(s.trim()) || 10);
                                    updateSets(exercise._id, sets);
                                  }}
                                  placeholder='e.g., 10, 12, 15'
                                  className='h-8'
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className='mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading
                ? 'Saving...'
                : mode === 'edit'
                  ? 'Update Workout'
                  : 'Create Workout'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
