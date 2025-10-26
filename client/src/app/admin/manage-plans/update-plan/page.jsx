import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { planValidationSchema } from '~/app/admin/manage-plans/validations/plan-validation';
import { WorkoutLibrary } from '~/components/admin/plans/workout-library';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { fetchPlanById, updatePlan } from '~/store/features/plan-slice';

const UpdatePlan = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth.user.id);
  const { loading, currentPlan } = useSelector(state => state.plans);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(planValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: true,
      image: null,
      workouts: []
    }
  });

  const workouts = watch('workouts') || [];
  const isPublic = watch('isPublic');
  const [imageUrl, setImageUrl] = useState('');
  const [isImageChanged, setIsImageChanged] = useState(false);

  // Fetch plan data on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (id) {
      dispatch(fetchPlanById(id));
    }
  }, [id, dispatch]);

  // Populate form when plan data is loaded
  useEffect(() => {
    if (currentPlan && currentPlan._id === id) {
      reset({
        title: currentPlan.title || '',
        description: currentPlan.description || '',
        isPublic: currentPlan.isPublic ?? true,
        image: currentPlan.image || null,
        workouts: (currentPlan.workouts || []).map(workout => ({
          _id: workout._id,
          title: workout.title,
          image: workout.image,
          exercises: (workout.exercises || []).map(ex => ({
            exercise: ex.exercise?._id || ex.exercise,
            exerciseTitle: ex.exercise?.title || 'Exercise',
            sets: ex.sets || [12, 12]
          }))
        }))
      });

      if (currentPlan.image) {
        setImageUrl(currentPlan.image);
      }
    }
  }, [currentPlan, id, reset]);

  // Calculate totals
  const totalExercises = workouts.reduce(
    (acc, workout) => acc + (workout.exercises?.length || 0),
    0
  );

  // Get selected workout IDs for library
  const selectedWorkoutIds = workouts.map(w => w._id);

  const handleAddWorkout = workout => {
    const exists = workouts.some(w => w._id === workout._id);
    if (exists) {
      toast.info('Workout already added');
      return;
    }

    // Save full exercise data including title
    const workoutData = {
      _id: workout._id,
      title: workout.title,
      image: workout.image,
      exercises: (workout.exercises || []).map(ex => ({
        exercise: ex.exercise?._id || ex.exercise,
        exerciseTitle: ex.exercise?.title || 'Exercise',
        sets: ex.sets || [12, 12]
      }))
    };

    setValue('workouts', [...workouts, workoutData]);
    toast.success('Workout added');
  };

  const handleRemoveWorkout = workoutIndex => {
    setValue(
      'workouts',
      workouts.filter((_, i) => i !== workoutIndex)
    );
    toast.success('Workout removed');
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue('image', file);
    setIsImageChanged(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setValue('image', null);
    setImageUrl('');
    setIsImageChanged(true);
  };

  const onSubmit = async data => {
    const planData = new FormData();
    planData.append('title', data.title.trim());
    planData.append('description', data.description?.trim() || '');
    planData.append('isPublic', String(data.isPublic));
    planData.append('user', userId);

    // Only append image if it was changed
    if (isImageChanged && data.image) {
      planData.append('image', data.image);
    }

    // Append workouts
    data.workouts.forEach((workout, workoutIndex) => {
      planData.append(`workouts[${workoutIndex}][title]`, workout.title);
      planData.append(`workouts[${workoutIndex}][isPublic]`, 'true');
      planData.append(`workouts[${workoutIndex}][user]`, userId);

      if (workout.exercises && workout.exercises.length > 0) {
        workout.exercises.forEach((exercise, exerciseIndex) => {
          planData.append(
            `workouts[${workoutIndex}][exercises][${exerciseIndex}][exercise]`,
            exercise.exercise || exercise._id
          );

          if (exercise.sets && exercise.sets.length > 0) {
            exercise.sets.forEach((set, setIndex) => {
              planData.append(
                `workouts[${workoutIndex}][exercises][${exerciseIndex}][sets][${setIndex}]`,
                set
              );
            });
          }
        });
      }
    });

    try {
      await dispatch(updatePlan({ id, updateData: planData })).unwrap();
      toast.success('Plan updated successfully!');
      navigate('/admin/manage-plans');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update plan';
      toast.error(errorMessage);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-plans');
  };

  // Show loading state while fetching plan
  if (loading && !currentPlan) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Loading plan...</p>
        </div>
      </div>
    );
  }

  // Show error if plan not found
  if (!currentPlan && !loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-xl font-semibold'>Plan not found</p>
          <Button onClick={handleGoBack} className='mt-4'>
            Back to Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleGoBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Plans
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6'>
          {/* Left Column - Plan Details */}
          <div className='space-y-6'>
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold'>Update Plan</h2>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Modify plan details, description, and workouts
                    </p>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Badge variant='secondary'>
                      {workouts.length} workouts
                    </Badge>
                    <Badge variant='secondary'>
                      {totalExercises} exercises
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Plan Title */}
                <div className='space-y-2'>
                  <Label htmlFor='title'>
                    Plan Title <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='title'
                    {...register('title')}
                    placeholder='e.g. 28-days Workout with F-Fitness'
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className='text-sm text-red-500'>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Plan Description */}
                <div className='space-y-2'>
                  <Label htmlFor='description'>Description (Optional)</Label>
                  <Textarea
                    id='description'
                    {...register('description')}
                    placeholder='Describe your plan...'
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className='text-sm text-red-500'>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Status (isPublic) */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='isPublic'>
                        Plan Status <span className='text-red-500'>*</span>
                      </Label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Switch
                        id='isPublic'
                        checked={isPublic}
                        onCheckedChange={checked =>
                          setValue('isPublic', checked)
                        }
                      />
                      <Badge
                        variant={isPublic ? 'default' : 'secondary'}
                        className={
                          isPublic ? 'bg-green-100 text-green-800' : ''
                        }
                      >
                        {isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>
                  {errors.isPublic && (
                    <p className='text-sm text-red-500'>
                      {errors.isPublic.message}
                    </p>
                  )}
                </div>

                {/* Plan Image */}
                <div className='space-y-2'>
                  <Label htmlFor='image'>Plan Image (Optional)</Label>
                  {!imageUrl ? (
                    <div className='border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors'>
                      <input
                        id='image'
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='hidden'
                      />
                      <label
                        htmlFor='image'
                        className='cursor-pointer flex flex-col items-center space-y-2'
                      >
                        <Upload className='h-10 w-10 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          Click to upload plan image
                        </span>
                        <span className='text-xs text-gray-500'>
                          PNG, JPG, WEBP (max 10MB)
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className='relative border rounded-lg p-4'>
                      <button
                        type='button'
                        onClick={removeImage}
                        className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                      >
                        <X className='h-4 w-4' />
                      </button>
                      <img
                        src={imageUrl}
                        alt='Plan preview'
                        className='w-full max-h-64 object-cover rounded'
                      />
                    </div>
                  )}
                  {errors.image && (
                    <p className='text-sm text-red-500'>
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Workouts List Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Workouts
                  {workouts.length === 0 && (
                    <span className='text-sm font-normal text-muted-foreground ml-2'>
                      - Use the library on the right to add workouts
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workouts.length === 0 ? (
                  <div className='border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground'>
                    <p>No workouts added yet</p>
                    <p className='text-sm mt-2'>
                      Select workouts from the library to get started
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {workouts.map((workout, workoutIndex) => (
                      <div
                        key={`${workout._id}-${workoutIndex}`}
                        className='border rounded-lg p-4 space-y-3'
                      >
                        {/* Workout Header */}
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center gap-3 flex-1'>
                            <div className='relative h-16 w-16 overflow-hidden rounded-md border flex-shrink-0'>
                              {workout.image ? (
                                <img
                                  src={workout.image}
                                  alt={workout.title || 'Workout'}
                                  className='h-full w-full object-cover'
                                />
                              ) : (
                                <div className='h-full w-full bg-muted flex items-center justify-center'>
                                  <span className='text-xs text-muted-foreground'>
                                    No img
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className='flex-1 min-w-0'>
                              <h4 className='font-semibold'>
                                {workoutIndex + 1}. {workout.title || 'Workout'}
                              </h4>
                              <p className='text-sm text-muted-foreground'>
                                {workout.exercises?.length || 0} exercise(s)
                              </p>
                            </div>
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => handleRemoveWorkout(workoutIndex)}
                            className='text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>

                        {/* Exercises List */}
                        {workout.exercises && workout.exercises.length > 0 && (
                          <div className='mt-3 pt-3 border-t'>
                            <p className='text-xs font-semibold text-muted-foreground uppercase mb-2'>
                              Exercises ({workout.exercises.length})
                            </p>
                            <div className='space-y-2'>
                              {workout.exercises.map((exercise, exIndex) => (
                                <div
                                  key={`${exercise.exercise}-${exIndex}`}
                                  className='flex items-start gap-2 p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors'
                                >
                                  <span className='text-xs font-medium text-muted-foreground mt-0.5 w-6 flex-shrink-0'>
                                    {exIndex + 1}.
                                  </span>
                                  <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium'>
                                      {exercise.exerciseTitle || 'Exercise'}
                                    </p>
                                    <div className='flex items-center gap-2 mt-1'>
                                      <Badge
                                        variant='secondary'
                                        className='text-xs'
                                      >
                                        {exercise.sets?.length || 0} sets
                                      </Badge>
                                      {exercise.sets &&
                                        exercise.sets.length > 0 && (
                                          <span className='text-xs text-muted-foreground'>
                                            {exercise.sets.join(' • ')} reps
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {errors.workouts && (
                  <p className='text-sm text-red-500 mt-2'>
                    {errors.workouts.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleGoBack}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading} className='flex-1'>
                {loading ? 'Updating...' : 'Update Plan'}
              </Button>
            </div>
          </div>

          {/* Right Column - Workout Library */}
          <aside className='xl:sticky xl:top-6 h-fit'>
            <WorkoutLibrary
              onAddWorkout={handleAddWorkout}
              selectedWorkoutIds={selectedWorkoutIds}
            />
          </aside>
        </div>
      </form>
    </div>
  );
};

export default UpdatePlan;
