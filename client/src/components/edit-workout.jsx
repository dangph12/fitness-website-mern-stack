import React, { useEffect, useMemo, useState } from 'react';
import { FaBook, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import {
  fetchWorkoutById,
  updateWorkout
} from '~/store/features/workout-slice';

import ExerciseLibrary from './exercise-library';

const asObjId = ex => (typeof ex === 'object' && ex?._id ? ex._id : ex);

const EditWorkout = () => {
  const { workoutId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentWorkout, loading, error } = useSelector(
    state => state.workouts
  );
  const userId = useSelector(state => state.auth.user.id);

  const [exercises, setExercises] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (workoutId) dispatch(fetchWorkoutById(workoutId));
  }, [dispatch, workoutId]);

  useEffect(() => {
    if (!currentWorkout) return;

    setTitle(currentWorkout.title || '');
    setImage(null);
    setImageUrl(currentWorkout.image || '');

    const mapped =
      (currentWorkout.exercises || []).map(it => ({
        exercise:
          typeof it.exercise === 'object'
            ? {
                _id: it.exercise._id,
                title: it.exercise.title,
                tutorial: it.exercise.tutorial
              }
            : { _id: it.exercise, title: 'Exercise', tutorial: '' },
        sets: Array.isArray(it.sets) ? it.sets.map(n => Number(n) || 1) : [1]
      })) || [];

    setExercises(mapped);
  }, [currentWorkout]);

  const totalSets = useMemo(
    () => exercises.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0),
    [exercises]
  );
  const totalReps = useMemo(
    () =>
      exercises.reduce(
        (acc, ex) =>
          acc + (ex.sets || []).reduce((a, b) => a + (Number(b) || 0), 0),
        0
      ),
    [exercises]
  );

  const handleAddExercise = ex => {
    const exists = exercises.some(e => asObjId(e.exercise) === ex._id);
    if (exists) {
      toast.info('Exercise already in workout');
      return;
    }
    setExercises(prev => [
      ...prev,
      {
        exercise: { _id: ex._id, title: ex.title, tutorial: ex.tutorial },
        sets: [1]
      }
    ]);
  };

  const handleRemoveExercise = idx => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const handleInputChange = (exerciseIndex, setIndex, value) => {
    setExercises(prev =>
      prev.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const next = [...ex.sets];
        const v = Math.max(1, Number(value) || 1);
        next[setIndex] = v;
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be <= 5MB');
      return;
    }
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleUpdateWorkout = () => {
    if (!title.trim()) {
      toast.error('Workout title is required');
      return;
    }
    if (!exercises.length) {
      toast.error('Please add at least one exercise');
      return;
    }

    const updateData = new FormData();
    updateData.append('title', title);

    if (image) updateData.append('image', image);
    updateData.append('user', userId);
    updateData.append('isPublic', 'true');

    exercises.forEach((item, index) => {
      updateData.append(
        `exercises[${index}][exercise]`,
        asObjId(item.exercise)
      );
      item.sets.forEach((set, setIndex) => {
        updateData.append(
          `exercises[${index}][sets][${setIndex}]`,
          String(Number(set) || 1)
        );
      });
    });

    dispatch(updateWorkout({ workoutId, updateData }))
      .unwrap?.()
      .then(() => {
        toast.success('Workout updated successfully!');
        navigate('/workouts');
      })
      .catch(() => toast.error('Failed to update workout.'));
  };

  if (loading && !currentWorkout) {
    return (
      <div className='flex h-screen items-center justify-center text-gray-500'>
        Loading workout...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center text-red-600'>
        Error: {error}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 xl:grid-cols-[13fr_7fr] gap-6 p-6'>
      <div className='space-y-6'>
        <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='flex items-center justify-between border-b border-slate-200 px-6 py-4'>
            <div>
              <h2 className='text-xl font-semibold tracking-tight'>
                Edit Workout
              </h2>
              <p className='text-xs text-slate-500'>
                Update title, image and exercise sets/reps.
              </p>
            </div>
            <div className='flex items-center gap-2 text-xs text-slate-600'>
              <span className='rounded-full bg-slate-100 px-2 py-1'>
                {exercises.length} exercises
              </span>
              <span className='rounded-full bg-slate-100 px-2 py-1'>
                {totalSets} sets
              </span>
              <span className='rounded-full bg-slate-100 px-2 py-1'>
                {totalReps} reps
              </span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
            <div>
              <label className='mb-1 block text-sm font-medium text-slate-700'>
                Workout Title
              </label>
              <input
                type='text'
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder='e.g. Upper Body Strength'
                className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-slate-700'>
                Workout Image
              </label>
              <div className='relative h-44 overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 group'>
                <input
                  type='file'
                  accept='image/*'
                  className='absolute inset-0 z-10 cursor-pointer opacity-0'
                  onChange={handleImageChange}
                />
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt='Workout'
                      className='absolute inset-0 h-full w-full object-cover'
                    />
                    <div className='absolute inset-0 hidden items-center justify-center bg-black/40 text-white backdrop-blur-[1px] group-hover:flex'>
                      Replace Image
                    </div>
                  </>
                ) : (
                  <div className='grid h-full place-items-center text-center text-slate-500'>
                    <div>
                      <p className='font-medium'>Drop or click to upload</p>
                      <p className='text-xs'>PNG, JPG (max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='sticky bottom-0 flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-white/80 px-6 py-4 backdrop-blur sm:flex-row'>
            <div className='text-xs text-slate-500'>
              Make sure every exercise has at least one set.
            </div>
            <button
              onClick={handleUpdateWorkout}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-sm transition ${
                loading
                  ? 'cursor-not-allowed bg-slate-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              <FaBook />
              {loading ? 'Updating...' : 'Update Workout'}
            </button>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white shadow-sm p-6'>
          {exercises.length === 0 ? (
            <div className='rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500'>
              No exercises yet. Use the library on the right to add some.
            </div>
          ) : (
            <div className='grid gap-4'>
              {exercises.map((ex, exerciseIndex) => (
                <div
                  key={`${asObjId(ex.exercise)}-${exerciseIndex}`}
                  className='relative rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm'
                >
                  <button
                    onClick={() => handleRemoveExercise(exerciseIndex)}
                    className='absolute right-3 top-3 rounded-md bg-red-500 p-2 text-white hover:bg-red-600'
                    title='Remove exercise'
                  >
                    <FaTrash />
                  </button>

                  <div className='mb-3 flex items-center gap-3'>
                    <div className='relative h-14 w-14 overflow-hidden rounded-md ring-1 ring-slate-200'>
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
                        className='absolute inset-0 h-full w-full object-cover'
                        onMouseEnter={e => {
                          const t = ex.exercise?.tutorial;
                          if (t && t.endsWith('.gif')) e.currentTarget.src = t;
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
                      <p className='font-semibold'>
                        {ex.exercise?.title || 'Exercise'}
                      </p>
                      <p className='text-xs text-slate-500'>
                        {ex.sets.length} set(s) •{' '}
                        {ex.sets.reduce((a, b) => a + (Number(b) || 0), 0)} reps
                      </p>
                    </div>
                  </div>

                  <div className='mb-2 grid grid-cols-[80px_1fr_36px_36px_36px] items-center gap-2 px-1 text-sm font-medium text-slate-600'>
                    <span className='text-center'>Set</span>
                    <span>Reps</span>
                    <span className='text-center'>-</span>
                    <span className='text-center'>+</span>
                    <span />
                  </div>

                  {ex.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className='mb-2 grid grid-cols-[80px_1fr_36px_36px_36px] items-center gap-2'
                    >
                      <span className='rounded-md border border-slate-300 bg-white py-2 text-center'>
                        {setIndex + 1}
                      </span>

                      <input
                        type='number'
                        min={1}
                        value={set}
                        onChange={e =>
                          handleInputChange(
                            exerciseIndex,
                            setIndex,
                            Math.max(1, Number(e.target.value) || 1)
                          )
                        }
                        className='rounded-md border border-slate-300 bg-white px-3 py-2 text-center outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
                      />

                      <button
                        onClick={() =>
                          handleInputChange(
                            exerciseIndex,
                            setIndex,
                            Math.max(1, Number(set) - 1)
                          )
                        }
                        className='rounded-md p-2 text-red-600 ring-1 ring-slate-300 hover:bg-red-50'
                        title='Decrease reps'
                      >
                        <FaMinus />
                      </button>

                      <button
                        onClick={() =>
                          handleInputChange(
                            exerciseIndex,
                            setIndex,
                            Number(set) + 1
                          )
                        }
                        className='rounded-md p-2 text-emerald-600 ring-1 ring-slate-300 hover:bg-emerald-50'
                        title='Increase reps'
                      >
                        <FaPlus />
                      </button>

                      <button
                        onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                        disabled={ex.sets.length <= 1}
                        className={`rounded-md p-2 ${
                          ex.sets.length <= 1
                            ? 'cursor-not-allowed text-slate-300 ring-1 ring-slate-200'
                            : 'text-red-500 hover:bg-red-50 ring-1 ring-slate-300'
                        }`}
                        title='Remove set'
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddSet(exerciseIndex)}
                    className='mt-1 text-left text-blue-600 hover:underline'
                  >
                    + Add Set
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className='xl:sticky xl:top-6 h-fit'>
        <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='border-b border-slate-100 px-6 py-4'>
            <h3 className='text-lg font-semibold'>Exercise Library</h3>
            <p className='text-xs text-slate-500'>
              Thêm bài tập vào routine của bạn.
            </p>
          </div>
          <div className='p-5 h-[82vh] overflow-auto'>
            <ExerciseLibrary handleAddExercise={handleAddExercise} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default EditWorkout;
