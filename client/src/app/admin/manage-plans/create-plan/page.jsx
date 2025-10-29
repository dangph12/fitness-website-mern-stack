import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { planValidationSchema } from '~/app/admin/manage-plans/validations/plan-validation';
import { ExerciseLibrary } from '~/components/admin/workouts/exercises-library-columns';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { getImageUrls } from '~/lib/utils';
import { createPlan } from '~/store/features/plan-slice';

const CreatePlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth.user.id);
  const { loading } = useSelector(state => state.plans);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(planValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: true,
      image: null,
      days: [{ dayName: 'Day 1', workouts: [] }]
    }
  });

  const days = watch('days') || [];
  const isPublic = watch('isPublic');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Calculate totals
  const totalWorkouts = days.reduce(
    (acc, day) => acc + (day.workouts?.length || 0),
    0
  );
  const totalExercises = days.reduce(
    (acc, day) =>
      acc +
      (day.workouts?.reduce(
        (wAcc, workout) => wAcc + (workout.exercises?.length || 0),
        0
      ) || 0),
    0
  );

  // Get selected exercise IDs for current day
  const selectedExerciseIds = useMemo(() => {
    const currentDay = days[selectedDay];
    if (!currentDay?.workouts?.length) return [];

    const ids = [];
    currentDay.workouts.forEach(workout => {
      workout.exercises?.forEach(ex => {
        const exId =
          typeof ex.exercise === 'object' ? ex.exercise._id : ex.exercise;
        if (exId) ids.push(exId);
      });
    });
    return ids;
  }, [days, selectedDay]);

  // Add new day
  const handleAddDay = () => {
    setValue('days', [
      ...days,
      { dayName: `Day ${days.length + 1}`, workouts: [] }
    ]);
  };

  // Remove day
  const handleRemoveDay = index => {
    const updated = days.filter((_, i) => i !== index);
    setValue('days', updated);
    if (selectedDay >= updated.length) {
      setSelectedDay(Math.max(0, updated.length - 1));
    }
  };

  // Update day title
  const handleDayTitleChange = (index, value) => {
    const updated = [...days];
    updated[index].dayName = value;
    setValue('days', updated);
  };

  // Add exercise to selected day
  const handleAddExercise = exercise => {
    const updated = [...days];
    const day = updated[selectedDay];

    // Create workout if none exists
    if (!day.workouts || day.workouts.length === 0) {
      day.workouts = [
        {
          title: `Workout ${selectedDay + 1}`,
          image: null,
          exercises: []
        }
      ];
    }

    const workout = day.workouts[0];

    // Check if exercise already exists
    const exists = workout.exercises.some(
      ex =>
        (ex.exercise && ex.exercise._id === exercise._id) ||
        ex.exercise === exercise._id
    );

    if (exists) {
      toast.info('Exercise already added');
      return;
    }

    // Add exercise with full data
    workout.exercises.push({
      exercise: {
        _id: exercise._id,
        title: exercise.title,
        tutorial: exercise.tutorial || exercise.image
      },
      sets: [12]
    });

    setValue('days', updated);
    toast.success('Exercise added');
  };

  // Remove workout from day
  const handleRemoveWorkout = (dayIndex, workoutIndex) => {
    const updated = [...days];
    updated[dayIndex].workouts.splice(workoutIndex, 1);
    setValue('days', updated);
    toast.success('Workout removed');
  };

  // Update workout title
  const handleWorkoutTitleChange = (dayIndex, workoutIndex, value) => {
    const updated = [...days];
    updated[dayIndex].workouts[workoutIndex].title = value;
    setValue('days', updated);
  };

  // Update workout image
  const handleWorkoutImageChange = (dayIndex, workoutIndex, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB.');
      return;
    }

    const updated = [...days];
    updated[dayIndex].workouts[workoutIndex].image = file;
    setValue('days', updated);
  };

  // Update exercise reps
  const handleRepsChange = (
    dayIndex,
    workoutIndex,
    exIndex,
    setIndex,
    value
  ) => {
    const updated = [...days];
    updated[dayIndex].workouts[workoutIndex].exercises[exIndex].sets[setIndex] =
      Math.max(1, Number(value) || 1);
    setValue('days', updated);
  };

  // Add set to exercise
  const handleAddSet = (dayIndex, workoutIndex, exIndex) => {
    const updated = [...days];
    updated[dayIndex].workouts[workoutIndex].exercises[exIndex].sets.push(12);
    setValue('days', updated);
  };

  // Remove set from exercise
  const handleRemoveSet = (dayIndex, workoutIndex, exIndex, setIndex) => {
    const updated = [...days];
    const sets =
      updated[dayIndex].workouts[workoutIndex].exercises[exIndex].sets;
    if (sets.length > 1) {
      sets.splice(setIndex, 1);
      setValue('days', updated);
    }
  };

  // Remove exercise from workout
  const handleRemoveExercise = (dayIndex, workoutIndex, exIndex) => {
    const updated = [...days];
    updated[dayIndex].workouts[workoutIndex].exercises.splice(exIndex, 1);
    setValue('days', updated);
    toast.success('Exercise removed');
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file!');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10MB.');
      return;
    }

    setValue('image', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setValue('image', null);
    setImageUrl('');
  };

  const onSubmit = async data => {
    console.log('=== CREATE FORM DATA DEBUG ===');
    console.log('Raw form data:', data);

    const formData = new FormData();
    formData.append('title', data.title.trim());
    formData.append('description', data.description?.trim() || '');
    formData.append('isPublic', String(data.isPublic));
    if (data.image) formData.append('image', data.image);
    formData.append('user', userId);

    // Flatten workouts from all days
    let workoutIndex = 0;
    data.days.forEach((day, dayIdx) => {
      console.log(`Day ${dayIdx + 1}:`, day);

      day.workouts.forEach((workout, wIdx) => {
        console.log(`  Workout ${wIdx + 1}:`, workout);

        formData.append(`workouts[${workoutIndex}][title]`, workout.title);
        formData.append(
          `workouts[${workoutIndex}][isPublic]`,
          String(data.isPublic)
        );
        formData.append(`workouts[${workoutIndex}][user]`, userId);

        if (workout.image && workout.image instanceof File) {
          console.log(`  Adding workout image for workout ${workoutIndex}`);
          formData.append(`workouts[${workoutIndex}][image]`, workout.image);
        }

        if (workout.exercises && workout.exercises.length > 0) {
          workout.exercises.forEach((exercise, exerciseIndex) => {
            const exId =
              typeof exercise.exercise === 'object'
                ? exercise.exercise._id
                : exercise.exercise;

            console.log(
              `    Exercise ${exerciseIndex}:`,
              exercise.exercise?.title || exId
            );

            formData.append(
              `workouts[${workoutIndex}][exercises][${exerciseIndex}][exercise]`,
              exId
            );

            if (exercise.sets && exercise.sets.length > 0) {
              exercise.sets.forEach((set, setIndex) => {
                formData.append(
                  `workouts[${workoutIndex}][exercises][${exerciseIndex}][sets][${setIndex}]`,
                  String(set)
                );
              });
              console.log(`      Sets:`, exercise.sets);
            }
          });
        }

        workoutIndex++;
      });
    });

    // Log all FormData entries
    console.log('=== FORM DATA ENTRIES ===');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, ':', `File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(key, ':', value);
      }
    }

    try {
      console.log('Sending create request...');
      const result = await dispatch(createPlan(formData)).unwrap();
      console.log('Success:', result);
      toast.success('Plan created successfully!');
      navigate('/admin/manage-plans');
    } catch (error) {
      console.error('Create error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create plan';
      toast.error(errorMessage);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-plans');
  };

  return (
    <div className='w-full max-w-[1600px] mx-auto space-y-6 px-6'>
      <div className='flex items-center gap-4'>
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
        <div className='grid grid-cols-1 xl:grid-cols-[2fr_450px] gap-6'>
          {/* Left Column - Plan Details */}
          <div className='space-y-6'>
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold'>Create New Plan</h2>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Add plan details, description, and workouts
                    </p>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Badge variant='secondary'>{days.length} days</Badge>
                    <Badge variant='secondary'>{totalWorkouts} workouts</Badge>
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

            {/* Days Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>Days</span>
                  <Button
                    type='button'
                    onClick={handleAddDay}
                    size='sm'
                    variant='outline'
                  >
                    + Add Day
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex gap-2 overflow-x-auto pb-2'>
                  {days.map((day, i) => {
                    const dayExercises =
                      day.workouts?.reduce(
                        (acc, w) => acc + (w.exercises?.length || 0),
                        0
                      ) || 0;

                    return (
                      <button
                        key={i}
                        type='button'
                        onClick={() => setSelectedDay(i)}
                        className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                          i === selectedDay
                            ? 'bg-blue-600 text-white shadow'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span className='font-medium'>Day {i + 1}</span>
                        <Badge
                          variant={i === selectedDay ? 'secondary' : 'outline'}
                          className='text-xs'
                        >
                          {dayExercises}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Day Workouts */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Input
                      value={days[selectedDay]?.dayName || ''}
                      onChange={e =>
                        handleDayTitleChange(selectedDay, e.target.value)
                      }
                      className='max-w-xs'
                      placeholder='Day name'
                    />
                  </div>
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    onClick={() => handleRemoveDay(selectedDay)}
                    disabled={days.length === 1}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Delete Day
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {days[selectedDay]?.workouts?.length === 0 ? (
                  <div className='border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground'>
                    <p>No workouts added yet</p>
                    <p className='text-sm mt-2'>
                      Use the exercise library to add exercises
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {days[selectedDay]?.workouts?.map(
                      (workout, workoutIndex) => (
                        <div
                          key={workoutIndex}
                          className='border rounded-lg p-4 space-y-3'
                        >
                          {/* Workout Header */}
                          <div className='flex items-start justify-between gap-3'>
                            <div className='flex-1 space-y-3'>
                              <Input
                                value={workout.title}
                                onChange={e =>
                                  handleWorkoutTitleChange(
                                    selectedDay,
                                    workoutIndex,
                                    e.target.value
                                  )
                                }
                                placeholder='Workout title'
                              />

                              {/* Workout Image Preview */}
                              {workout.image && (
                                <div className='relative border rounded-lg p-2 bg-muted/30'>
                                  <button
                                    type='button'
                                    onClick={() => {
                                      const updated = [...days];
                                      updated[selectedDay].workouts[
                                        workoutIndex
                                      ].image = null;
                                      setValue('days', updated);
                                    }}
                                    className='absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10'
                                  >
                                    <X className='h-3 w-3' />
                                  </button>
                                  <img
                                    src={
                                      workout.image instanceof File
                                        ? URL.createObjectURL(workout.image)
                                        : workout.image
                                    }
                                    alt='Workout preview'
                                    className='w-full h-32 object-cover rounded'
                                  />
                                  <p className='text-xs text-muted-foreground mt-1'>
                                    {workout.image instanceof File
                                      ? workout.image.name
                                      : 'Workout image'}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className='flex items-center gap-2'>
                              <label className='cursor-pointer'>
                                <input
                                  type='file'
                                  accept='image/*'
                                  className='hidden'
                                  onChange={e =>
                                    handleWorkoutImageChange(
                                      selectedDay,
                                      workoutIndex,
                                      e.target.files?.[0]
                                    )
                                  }
                                />
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  asChild
                                >
                                  <span>
                                    <Upload className='h-4 w-4 mr-2' />
                                    {workout.image ? 'Change' : 'Image'}
                                  </span>
                                </Button>
                              </label>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  handleRemoveWorkout(selectedDay, workoutIndex)
                                }
                                className='text-red-500 hover:text-red-700'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>

                          {/* Exercises List */}
                          {workout.exercises &&
                            workout.exercises.length > 0 && (
                              <div className='space-y-2'>
                                {workout.exercises.map((exercise, exIndex) => {
                                  const { previewUrl, animatedUrl } =
                                    getImageUrls(exercise.exercise?.tutorial);

                                  return (
                                    <div
                                      key={exIndex}
                                      className='border rounded-lg p-3 bg-muted/30'
                                    >
                                      {/* Exercise Header */}
                                      <div className='flex items-center gap-3 mb-3'>
                                        <div className='relative h-12 w-12 overflow-hidden rounded-md border flex-shrink-0'>
                                          {exercise.exercise?.tutorial ? (
                                            <img
                                              src={previewUrl}
                                              alt={exercise.exercise.title}
                                              className='h-full w-full object-cover'
                                              onMouseEnter={e => {
                                                e.currentTarget.src =
                                                  animatedUrl;
                                              }}
                                              onMouseLeave={e => {
                                                e.currentTarget.src =
                                                  previewUrl;
                                              }}
                                            />
                                          ) : (
                                            <div className='h-full w-full bg-muted flex items-center justify-center'>
                                              <span className='text-xs text-muted-foreground'>
                                                No img
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className='flex-1'>
                                          <p className='font-semibold'>
                                            {exercise.exercise?.title ||
                                              'Exercise'}
                                          </p>
                                          <p className='text-xs text-muted-foreground'>
                                            {exercise.sets?.length || 0} set(s)
                                          </p>
                                        </div>
                                        <Button
                                          type='button'
                                          variant='ghost'
                                          size='sm'
                                          onClick={() =>
                                            handleRemoveExercise(
                                              selectedDay,
                                              workoutIndex,
                                              exIndex
                                            )
                                          }
                                          className='text-red-500 hover:text-red-700'
                                        >
                                          <Trash2 className='h-4 w-4' />
                                        </Button>
                                      </div>

                                      {/* Sets */}
                                      <div className='space-y-2'>
                                        <div className='grid grid-cols-[80px_1fr_42px] gap-2 text-xs font-medium text-muted-foreground'>
                                          <span className='text-center'>
                                            Set
                                          </span>
                                          <span>Reps</span>
                                          <span />
                                        </div>

                                        {exercise.sets?.map((set, setIndex) => (
                                          <div
                                            key={setIndex}
                                            className='grid grid-cols-[80px_1fr_42px] gap-2'
                                          >
                                            <span className='rounded-md border bg-white py-2 text-center text-sm'>
                                              {setIndex + 1}
                                            </span>
                                            <Input
                                              type='number'
                                              min={1}
                                              value={set}
                                              onChange={e =>
                                                handleRepsChange(
                                                  selectedDay,
                                                  workoutIndex,
                                                  exIndex,
                                                  setIndex,
                                                  e.target.value
                                                )
                                              }
                                              className='text-center'
                                            />
                                            <Button
                                              type='button'
                                              variant='ghost'
                                              size='sm'
                                              onClick={() =>
                                                handleRemoveSet(
                                                  selectedDay,
                                                  workoutIndex,
                                                  exIndex,
                                                  setIndex
                                                )
                                              }
                                              disabled={
                                                exercise.sets.length === 1
                                              }
                                              className='text-red-500 hover:text-red-700'
                                            >
                                              <Trash2 className='h-4 w-4' />
                                            </Button>
                                          </div>
                                        ))}

                                        <Button
                                          type='button'
                                          variant='link'
                                          size='sm'
                                          onClick={() =>
                                            handleAddSet(
                                              selectedDay,
                                              workoutIndex,
                                              exIndex
                                            )
                                          }
                                          className='text-blue-600 p-0 h-auto'
                                        >
                                          + Add Set
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                      )
                    )}
                  </div>
                )}
                {errors.days && (
                  <p className='text-sm text-red-500 mt-2'>
                    {errors.days.message}
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
                {loading ? 'Creating...' : 'Create Plan'}
              </Button>
            </div>
          </div>

          {/* Right Column - Exercise Library */}
          <aside className='xl:sticky xl:top-6 h-fit'>
            <ExerciseLibrary
              onAddExercise={handleAddExercise}
              selectedExerciseIds={selectedExerciseIds}
            />
          </aside>
        </div>
      </form>
    </div>
  );
};

export default CreatePlan;
