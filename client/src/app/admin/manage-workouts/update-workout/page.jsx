import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, Minus, Plus, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { workoutValidationSchema } from '~/app/admin/manage-workouts/validations/workout-validation';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { fetchExercises } from '~/store/features/exercise-slice';
import {
  fetchWorkoutById,
  updateWorkout
} from '~/store/features/workout-slice';

const UpdateWorkout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth.user.id);
  const { currentWorkout, loading } = useSelector(state => state.workouts);
  const {
    exercises: allExercises,
    loading: loadingExercises,
    totalPages,
    totalExercises
  } = useSelector(state => state.exercises);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(workoutValidationSchema),
    defaultValues: {
      title: '',
      isPublic: true,
      image: null,
      exercises: []
    }
  });

  const exercises = watch('exercises') || [];
  const title = watch('title');
  const isPublic = watch('isPublic');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Exercise library state
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch workout data on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (id) {
      dispatch(fetchWorkoutById(id))
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(error => {
          toast.error('Failed to load workout');
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [id, dispatch]);

  // Populate form when currentWorkout is loaded
  useEffect(() => {
    if (currentWorkout && currentWorkout._id === id) {
      // Map exercises from currentWorkout
      const mappedExercises =
        currentWorkout.exercises?.map(ex => ({
          exercise: {
            _id: ex.exercise?._id || ex.exercise,
            title: ex.exercise?.title || '',
            tutorial: ex.exercise?.tutorial || ''
          },
          sets: ex.sets && ex.sets.length > 0 ? ex.sets : [1]
        })) || [];

      // Reset form with fetched data
      reset({
        title: currentWorkout.title || '',
        isPublic: currentWorkout.isPublic ?? true,
        image: null,
        exercises: mappedExercises
      });

      // Set image URL if exists
      if (currentWorkout.image) {
        setImageUrl(currentWorkout.image);
      }
    }
  }, [currentWorkout, id, reset]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setQuery(searchText.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch exercises
  useEffect(() => {
    dispatch(
      fetchExercises({
        page: currentPage,
        limit,
        filterParams: { title: query || undefined }
      })
    );
  }, [dispatch, currentPage, query]);

  // Calculate totals
  const totalSets = exercises.reduce(
    (acc, ex) => acc + (ex.sets?.length || 0),
    0
  );
  const totalReps = exercises.reduce(
    (acc, ex) =>
      acc + (ex.sets || []).reduce((a, b) => a + (Number(b) || 0), 0),
    0
  );

  const handleAddExercise = exercise => {
    const exists = exercises.some(e => e.exercise._id === exercise._id);
    if (exists) {
      toast.info('Exercise already added');
      return;
    }
    setValue('exercises', [
      ...exercises,
      {
        exercise: {
          _id: exercise._id,
          title: exercise.title,
          tutorial: exercise.tutorial
        },
        sets: [1]
      }
    ]);
    toast.success('Exercise added');
  };

  const handleRemoveExercise = exerciseIndex => {
    setValue(
      'exercises',
      exercises.filter((_, i) => i !== exerciseIndex)
    );
    toast.success('Exercise removed');
  };

  const handleInputChange = (exerciseIndex, setIndex, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex] = Math.max(
      1,
      Number(value) || 1
    );
    setValue('exercises', newExercises);
  };

  const handleAddSet = exerciseIndex => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push(1);
    setValue('exercises', newExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    if (newExercises[exerciseIndex].sets.length > 1) {
      newExercises[exerciseIndex].sets.splice(setIndex, 1);
      setValue('exercises', newExercises);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    const workoutData = new FormData();
    workoutData.append('title', data.title.trim());
    workoutData.append('isPublic', String(data.isPublic));

    // Only append image if a new file was selected
    if (data.image && data.image instanceof File) {
      workoutData.append('image', data.image);
    }

    workoutData.append('user', userId);

    data.exercises.forEach((exercise, index) => {
      workoutData.append(
        `exercises[${index}][exercise]`,
        exercise.exercise._id
      );
      exercise.sets.forEach((set, setIndex) => {
        workoutData.append(
          `exercises[${index}][sets][${setIndex}]`,
          String(Number(set) || 1)
        );
      });
    });

    try {
      await dispatch(
        updateWorkout({
          workoutId: id,
          updateData: workoutData
        })
      ).unwrap();
      toast.success('Workout updated successfully!');
      navigate('/admin/manage-workouts');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update workout';
      toast.error(errorMessage);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-workouts');
  };

  const handleSearchChange = e => {
    setSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-center h-64'>
          <p className='text-muted-foreground'>Loading workout...</p>
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
          Back to Workouts
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6'>
          {/* Left Column - Workout Details */}
          <div className='space-y-6'>
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold'>Update Workout</h2>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Update workout details and exercises
                    </p>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Badge variant='secondary'>
                      {exercises.length} exercises
                    </Badge>
                    <Badge variant='secondary'>{totalSets} sets</Badge>
                    <Badge variant='secondary'>{totalReps} reps</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Workout Title */}
                <div className='space-y-2'>
                  <Label htmlFor='title'>
                    Workout Title <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='title'
                    {...register('title')}
                    placeholder='e.g. Upper Body Strength Training'
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className='text-sm text-red-500'>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Status (isPublic) */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='isPublic'>
                        Workout Status <span className='text-red-500'>*</span>
                      </Label>
                      <p className='text-sm text-muted-foreground'>
                        Make this workout visible to all users
                      </p>
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

                {/* Workout Image */}
                <div className='space-y-2'>
                  <Label htmlFor='image'>Workout Image (Optional)</Label>
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
                          Click to upload workout image
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
                        className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10'
                      >
                        <X className='h-4 w-4' />
                      </button>
                      <img
                        src={imageUrl}
                        alt='Workout preview'
                        className='w-full max-h-64 object-cover rounded'
                      />
                      <div className='mt-2 text-center'>
                        <label
                          htmlFor='image'
                          className='text-sm text-blue-600 hover:text-blue-700 cursor-pointer'
                        >
                          Change Image
                        </label>
                        <input
                          id='image'
                          type='file'
                          accept='image/*'
                          onChange={handleImageChange}
                          className='hidden'
                        />
                      </div>
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

            {/* Exercises List Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Exercises
                  {exercises.length === 0 && (
                    <span className='text-sm font-normal text-muted-foreground ml-2'>
                      - Use the library on the right to add exercises
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exercises.length === 0 ? (
                  <div className='border-2 border-dashed rounded-lg p-10 text-center text-muted-foreground'>
                    <p>No exercises added yet</p>
                    <p className='text-sm mt-2'>
                      Select exercises from the library to get started
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {exercises.map((ex, exerciseIndex) => (
                      <div
                        key={`${ex.exercise._id}-${exerciseIndex}`}
                        className='border rounded-lg p-4 space-y-3'
                      >
                        {/* Exercise Header */}
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='relative h-16 w-16 overflow-hidden rounded-md border'>
                              <img
                                src={
                                  ex.exercise?.tutorial?.endsWith?.('.gif')
                                    ? ex.exercise.tutorial.replace(
                                        '/upload/',
                                        '/upload/f_jpg/so_0/'
                                      )
                                    : ex.exercise?.tutorial
                                }
                                alt={ex.exercise?.title || 'Exercise'}
                                className='h-full w-full object-cover'
                                onMouseEnter={e => {
                                  const t = ex.exercise?.tutorial;
                                  if (t && t.endsWith('.gif'))
                                    e.currentTarget.src = t;
                                }}
                                onMouseLeave={e => {
                                  const t = ex.exercise?.tutorial;
                                  if (t && t.endsWith('.gif'))
                                    e.currentTarget.src = t.replace(
                                      '/upload/',
                                      '/upload/f_jpg/so_0/'
                                    );
                                }}
                              />
                            </div>
                            <div>
                              <h4 className='font-semibold'>
                                {ex.exercise?.title || 'Exercise'}
                              </h4>
                              <p className='text-sm text-muted-foreground'>
                                {ex.sets.length} set(s) •{' '}
                                {ex.sets.reduce(
                                  (a, b) => a + (Number(b) || 0),
                                  0
                                )}{' '}
                                reps total
                              </p>
                            </div>
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => handleRemoveExercise(exerciseIndex)}
                            className='text-red-500 hover:text-red-700 hover:bg-red-50'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>

                        {/* Sets Grid */}
                        <div className='grid grid-cols-[60px_1fr_60px_60px_60px] gap-2 text-sm font-medium text-muted-foreground px-1'>
                          <span className='text-center'>Set</span>
                          <span>Reps</span>
                          <span className='text-center'>-</span>
                          <span className='text-center'>+</span>
                          <span className='text-center'>Del</span>
                        </div>

                        {ex.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className='grid grid-cols-[60px_1fr_60px_60px_60px] gap-2 items-center'
                          >
                            <Badge variant='outline' className='justify-center'>
                              {setIndex + 1}
                            </Badge>

                            <Input
                              type='number'
                              min={1}
                              value={set}
                              onChange={e =>
                                handleInputChange(
                                  exerciseIndex,
                                  setIndex,
                                  e.target.value
                                )
                              }
                              className='text-center'
                            />

                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleInputChange(
                                  exerciseIndex,
                                  setIndex,
                                  Math.max(Number(set) - 1, 1)
                                )
                              }
                            >
                              <Minus className='h-4 w-4' />
                            </Button>

                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleInputChange(
                                  exerciseIndex,
                                  setIndex,
                                  Number(set) + 1
                                )
                              }
                            >
                              <Plus className='h-4 w-4' />
                            </Button>

                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                handleRemoveSet(exerciseIndex, setIndex)
                              }
                              disabled={ex.sets.length <= 1}
                              className='text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => handleAddSet(exerciseIndex)}
                          className='w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Set
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.exercises && (
                  <p className='text-sm text-red-500 mt-2'>
                    {errors.exercises.message}
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
                {loading ? 'Updating...' : 'Update Workout'}
              </Button>
            </div>
          </div>

          {/* Right Column - Exercise Library */}
          <aside className='xl:sticky xl:top-6 h-fit'>
            <Card className='max-h-[calc(100vh-8rem)]'>
              <CardHeader>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle>Exercise Library</CardTitle>
                    <p className='text-sm text-muted-foreground'>
                      Page {currentPage} of {totalPages} • Total{' '}
                      {totalExercises}
                    </p>
                  </div>

                  <div className='relative'>
                    <Input
                      type='text'
                      placeholder='Search exercise name...'
                      value={searchText}
                      onChange={handleSearchChange}
                      className='pr-8'
                    />
                    {searchText && (
                      <button
                        type='button'
                        onClick={handleClearSearch}
                        className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    )}
                  </div>

                  {query && (
                    <Badge variant='secondary' className='text-xs'>
                      Searching: "{query}"
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className='h-[calc(100vh-22rem)] overflow-y-auto space-y-4'>
                {loadingExercises ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    Loading exercises...
                  </div>
                ) : allExercises.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    No exercises found
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {allExercises.map(exercise => (
                      <div
                        key={exercise._id}
                        className='flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'
                        onClick={() => handleAddExercise(exercise)}
                      >
                        <div className='relative h-16 w-16 overflow-hidden rounded-md border flex-shrink-0'>
                          <img
                            src={
                              exercise.tutorial?.endsWith?.('.gif')
                                ? exercise.tutorial.replace(
                                    '/upload/',
                                    '/upload/f_jpg/so_0/'
                                  )
                                : exercise.tutorial
                            }
                            alt={exercise.title}
                            className='h-full w-full object-cover'
                            onMouseEnter={e => {
                              if (exercise.tutorial?.endsWith('.gif')) {
                                e.currentTarget.src = exercise.tutorial;
                              }
                            }}
                            onMouseLeave={e => {
                              if (exercise.tutorial?.endsWith('.gif')) {
                                e.currentTarget.src = exercise.tutorial.replace(
                                  '/upload/',
                                  '/upload/f_jpg/so_0/'
                                );
                              }
                            }}
                          />
                        </div>

                        <div className='flex-1 min-w-0'>
                          <h4 className='font-semibold text-sm truncate'>
                            {exercise.title}
                          </h4>
                          <div className='flex items-center gap-2 mt-1'>
                            <Badge variant='secondary' className='text-xs'>
                              {exercise.level}
                            </Badge>
                            <Badge variant='outline' className='text-xs'>
                              {exercise.type}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          type='button'
                          size='sm'
                          onClick={e => {
                            e.stopPropagation();
                            handleAddExercise(exercise);
                          }}
                          className='flex-shrink-0'
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className='flex items-center justify-center gap-2 pt-4 border-t'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loadingExercises}
                    >
                      Previous
                    </Button>

                    <div className='flex items-center gap-1'>
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={page}
                              type='button'
                              variant={
                                currentPage === page ? 'default' : 'outline'
                              }
                              size='sm'
                              onClick={() => handlePageChange(page)}
                              disabled={loadingExercises}
                              className='w-8 h-8 p-0'
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loadingExercises}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </form>
    </div>
  );
};

export default UpdateWorkout;
