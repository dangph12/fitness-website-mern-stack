import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, GripVertical, Plus, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { workoutValidationSchema } from '~/app/admin/manage-workouts/validations/workout-validation';
import { ExerciseLibrary } from '~/components/admin/workouts/exercises-library-columns';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
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
  const isPublic = watch('isPublic');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
      // Map exercises from currentWorkout to match create workout format
      const mappedExercises =
        currentWorkout.exercises?.map(ex => {
          const exerciseObj =
            typeof ex.exercise === 'object' ? ex.exercise : null;

          return {
            exercise: exerciseObj?._id || ex.exercise,
            exerciseTitle: exerciseObj?.title || 'Unknown Exercise',
            exerciseImage: exerciseObj?.image || '',
            exerciseDifficulty: exerciseObj?.difficulty || '',
            exerciseType: exerciseObj?.type || '',
            sets: ex.sets && ex.sets.length > 0 ? ex.sets : [8]
          };
        }) || [];

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

  // Get selected exercise IDs for library
  const selectedExerciseIds = exercises.map(ex => ex.exercise);

  const handleAddExercise = exercise => {
    const exists = exercises.some(ex => ex.exercise === exercise._id);
    if (exists) {
      toast.info('Exercise already added');
      return;
    }

    const exerciseData = {
      exercise: exercise._id,
      exerciseTitle: exercise.title,
      exerciseImage: exercise.image,
      exerciseDifficulty: exercise.difficulty,
      exerciseType: exercise.type,
      sets: [8] // Default sets
    };

    setValue('exercises', [...exercises, exerciseData]);
    toast.success('Exercise added');
  };

  const handleRemoveExercise = exerciseIndex => {
    setValue(
      'exercises',
      exercises.filter((_, i) => i !== exerciseIndex)
    );
    toast.success('Exercise removed');
  };

  const handleSetChange = (exerciseIndex, setIndex, value) => {
    const updatedExercises = [...exercises];
    const numValue = parseInt(value) || 0;
    updatedExercises[exerciseIndex].sets[setIndex] = numValue;
    setValue('exercises', updatedExercises);
  };

  const handleAddSet = exerciseIndex => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push(8);
    setValue('exercises', updatedExercises);
    toast.success('Set added');
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    if (updatedExercises[exerciseIndex].sets.length > 1) {
      updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
      setValue('exercises', updatedExercises);
      toast.success('Set removed');
    } else {
      toast.error('At least one set is required');
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

    // Append exercises
    data.exercises.forEach((exercise, exerciseIndex) => {
      workoutData.append(
        `exercises[${exerciseIndex}][exercise]`,
        exercise.exercise
      );

      exercise.sets.forEach((set, setIndex) => {
        workoutData.append(
          `exercises[${exerciseIndex}][sets][${setIndex}]`,
          set
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

  // Get difficulty badge color
  const getDifficultyColor = difficulty => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto p-6'>
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
                  <Badge variant='secondary' className='text-sm'>
                    {exercises.length} exercises
                  </Badge>
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
                    placeholder='e.g. Upper Body Strength'
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
                    <Label htmlFor='isPublic'>
                      Workout Status <span className='text-red-500'>*</span>
                    </Label>
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
                        className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                      >
                        <X className='h-4 w-4' />
                      </button>
                      <img
                        src={imageUrl}
                        alt='Workout preview'
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
                    {exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={`${exercise.exercise}-${exerciseIndex}`}
                        className='border rounded-lg p-4 space-y-3'
                      >
                        {/* Exercise Header */}
                        <div className='flex items-start gap-3'>
                          {/* Drag Handle */}
                          <div className='mt-2 cursor-move text-muted-foreground hover:text-foreground'>
                            <GripVertical className='h-5 w-5' />
                          </div>

                          {/* Exercise Image */}
                          <div className='relative h-16 w-16 overflow-hidden rounded-md border flex-shrink-0'>
                            {exercise.exerciseImage ? (
                              <img
                                src={exercise.exerciseImage}
                                alt={exercise.exerciseTitle}
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

                          {/* Exercise Info */}
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between gap-2'>
                              <div className='flex-1 min-w-0'>
                                <h4 className='font-semibold text-base'>
                                  {exerciseIndex + 1}. {exercise.exerciseTitle}
                                </h4>
                                <div className='flex items-center gap-2 mt-1.5 flex-wrap'>
                                  <Badge
                                    variant='secondary'
                                    className={`text-xs ${getDifficultyColor(exercise.exerciseDifficulty)}`}
                                  >
                                    {exercise.exerciseDifficulty}
                                  </Badge>
                                  <Badge variant='outline' className='text-xs'>
                                    {exercise.exerciseType}
                                  </Badge>
                                </div>
                              </div>

                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  handleRemoveExercise(exerciseIndex)
                                }
                                className='text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>

                            {/* Sets Management */}
                            <div className='mt-3 pt-3 border-t'>
                              <div className='flex items-center justify-between mb-2'>
                                <p className='text-xs font-semibold text-muted-foreground uppercase'>
                                  Sets & Reps
                                </p>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={() => handleAddSet(exerciseIndex)}
                                  className='h-7 text-xs'
                                >
                                  <Plus className='h-3 w-3 mr-1' />
                                  Add Set
                                </Button>
                              </div>

                              <div className='space-y-2'>
                                {exercise.sets.map((set, setIndex) => (
                                  <div
                                    key={setIndex}
                                    className='flex items-center gap-2'
                                  >
                                    <span className='text-sm font-medium text-muted-foreground w-16'>
                                      Set {setIndex + 1}:
                                    </span>
                                    <Input
                                      type='number'
                                      min='1'
                                      value={set}
                                      onChange={e =>
                                        handleSetChange(
                                          exerciseIndex,
                                          setIndex,
                                          e.target.value
                                        )
                                      }
                                      className='w-20 h-8'
                                    />
                                    <span className='text-sm text-muted-foreground'>
                                      reps
                                    </span>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      onClick={() =>
                                        handleRemoveSet(exerciseIndex, setIndex)
                                      }
                                      disabled={exercise.sets.length === 1}
                                      className='h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto'
                                    >
                                      <X className='h-4 w-4' />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
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

export default UpdateWorkout;
