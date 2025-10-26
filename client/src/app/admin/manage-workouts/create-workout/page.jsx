import { ArrowLeft, Minus, Plus, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import ExerciseLibrary from '~/components/exercise-library';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { createWorkout } from '~/store/features/workout-slice';

const CreateWorkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth.user.id);
  const { loading } = useSelector(state => state.workouts);

  const [exercises, setExercises] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
    setExercises(prev => [
      ...prev,
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
    setExercises(prev => prev.filter((_, i) => i !== exerciseIndex));
    toast.success('Exercise removed');
  };

  const handleInputChange = (exerciseIndex, setIndex, value) => {
    setExercises(prev =>
      prev.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const next = [...ex.sets];
        next[setIndex] = Math.max(1, Number(value) || 1);
        return { ...ex, sets: next };
      })
    );
  };

  const handleAddSet = exerciseIndex => {
    setExercises(prev =>
      prev.map((ex, i) =>
        i === exerciseIndex ? { ...ex, sets: [...ex.sets, 1] } : ex
      )
    );
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setExercises(prev =>
      prev.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        if (ex.sets.length <= 1) return ex;
        const next = [...ex.sets];
        next.splice(setIndex, 1);
        return { ...ex, sets: next };
      })
    );
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be <= 10MB');
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl('');
  };

  const handleSubmitWorkout = async () => {
    if (!title.trim()) {
      toast.error('Please fill in workout title!');
      return;
    }
    if (!exercises.length) {
      toast.error('Please add at least one exercise!');
      return;
    }

    const workoutData = new FormData();
    workoutData.append('title', title.trim());
    if (image) workoutData.append('image', image);
    workoutData.append('isPublic', 'true');
    workoutData.append('user', userId);

    exercises.forEach((exercise, index) => {
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
      await dispatch(createWorkout(workoutData)).unwrap();
      toast.success('Workout created successfully!');
      navigate('/admin/manage-workouts');
    } catch (error) {
      console.error('Create error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create workout';
      toast.error(errorMessage);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-workouts');
  };

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

      <div className='grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6'>
        {/* Left Column - Workout Details */}
        <div className='space-y-6'>
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold'>Create Workout</h2>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Name your workout, add an image, and select exercises
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
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder='e.g. Upper Body Strength Training'
                />
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
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemoveExercise(exerciseIndex)}
                          className='text-red-500 hover:text-red-700 hover:bg-red-50'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>

                      {/* Sets Grid Header */}
                      <div className='grid grid-cols-[60px_1fr_60px_60px_60px] gap-2 text-sm font-medium text-muted-foreground px-1'>
                        <span className='text-center'>Set</span>
                        <span>Reps</span>
                        <span className='text-center'>-</span>
                        <span className='text-center'>+</span>
                        <span className='text-center'>Del</span>
                      </div>

                      {/* Sets Rows */}
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
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              handleRemoveSet(exerciseIndex, setIndex)
                            }
                            disabled={ex.sets.length <= 1}
                            className='text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}

                      {/* Add Set Button */}
                      <Button
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
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex gap-4'>
            <Button variant='outline' onClick={handleGoBack} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitWorkout}
              disabled={loading}
              className='flex-1'
            >
              {loading ? 'Creating...' : 'Create Workout'}
            </Button>
          </div>
        </div>

        {/* Right Column - Exercise Library */}
        <aside className='xl:sticky xl:top-6 h-fit'>
          <Card className='max-h-[calc(100vh-8rem)]'>
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <p className='text-sm text-muted-foreground'>
                Click to add exercises to your workout
              </p>
            </CardHeader>
            <CardContent className='h-[calc(100vh-16rem)] overflow-y-auto'>
              <ExerciseLibrary handleAddExercise={handleAddExercise} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default CreateWorkout;
