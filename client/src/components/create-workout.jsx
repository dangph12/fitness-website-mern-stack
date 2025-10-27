import React, { useEffect, useMemo, useState } from 'react';
import {
  FaBook,
  FaGlobeAmericas,
  FaLock,
  FaMinus,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { createWorkout } from '~/store/features/workout-slice';

import ExerciseLibrary from './exercise-library';

const CreateWorkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth.user.id);
  const { loading } = useSelector(state => state.workouts);

  const [exercises, setExercises] = useState([]);
  const [title, setTitle] = useState('My Workout');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const totalReps = useMemo(
    () =>
      exercises.reduce(
        (acc, ex) =>
          acc + (ex.sets || []).reduce((a, b) => a + (Number(b) || 0), 0),
        0
      ),
    [exercises]
  );

  const handleAddExercise = exercise => {
    const exists = exercises.some(e => e.exercise._id === exercise._id);
    if (exists) return toast.info('Exercise already added');
    setExercises(prev => [...prev, { exercise: exercise, sets: [1] }]);
  };

  const handleRemoveExercise = index => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (exerciseIndex, setIndex, value) => {
    setExercises(prev =>
      prev.map((ex, i) =>
        i === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((s, si) =>
                si === setIndex ? Math.max(1, Number(value) || 1) : s
              )
            }
          : ex
      )
    );
  };

  const handleAddSet = i =>
    setExercises(prev =>
      prev.map((ex, idx) => (idx === i ? { ...ex, sets: [...ex.sets, 1] } : ex))
    );

  const handleRemoveSet = (i, j) =>
    setExercises(prev =>
      prev.map((ex, idx) => {
        if (idx !== i || ex.sets.length <= 1) return ex;
        return { ...ex, sets: ex.sets.filter((_, si) => si !== j) };
      })
    );

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/'))
      return toast.error('Invalid image file');
    if (file.size > 5 * 1024 * 1024) return toast.error('Max size 5MB');
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSubmitWorkout = () => {
    if (!title.trim()) return toast.error('Please fill in title!');
    if (!exercises.length) return toast.error('Add at least one exercise!');

    const workoutData = new FormData();
    workoutData.append('title', title);
    if (image) workoutData.append('image', image);
    workoutData.append('isPublic', String(isPublic));
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

    dispatch(createWorkout(workoutData))
      .unwrap?.()
      .then(() => {
        toast.success('Workout created successfully!');
        navigate('/workouts');
      })
      .catch(() => toast.error('Failed to create workout'));
  };

  return (
    <div className='grid grid-cols-1 xl:grid-cols-[13fr_7fr] gap-6 p-6'>
      <div className='space-y-6'>
        <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <div className='flex items-center justify-between border-b border-slate-200 px-6 py-4'>
            <div>
              <h2 className='text-xl font-semibold tracking-tight'>
                Create Workout
              </h2>
              <p className='text-xs text-slate-500'>
                Name it, add an image, add exercises & sets.
              </p>
            </div>

            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm transition
                ${
                  isPublic
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }
              `}
            >
              {isPublic ? (
                <>
                  <FaGlobeAmericas className='h-4 w-4' /> Public
                </>
              ) : (
                <>
                  <FaLock className='h-4 w-4' /> Private
                </>
              )}
            </button>
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
                className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200'
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
                  className='absolute inset-0 cursor-pointer opacity-0'
                  onChange={handleImageChange}
                />
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      className='absolute inset-0 w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 hidden items-center justify-center bg-black/40 text-white group-hover:flex'>
                      Replace Image
                    </div>
                  </>
                ) : (
                  <div className='grid h-full place-items-center text-sm text-slate-500'>
                    Upload Image (max 5MB)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='sticky bottom-0 flex justify-end border-t border-slate-200 bg-white/80 px-6 py-4 backdrop-blur'>
            <button
              onClick={handleSubmitWorkout}
              disabled={loading}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow-sm transition 
                ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              <FaBook />
              {loading ? 'Creating...' : 'Create Workout'}
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
              {exercises.map((ex, i) => (
                <div
                  key={i}
                  className='relative rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm'
                >
                  <button
                    onClick={() => handleRemoveExercise(i)}
                    className='absolute right-3 top-3 rounded-md bg-red-500 p-2 text-white hover:bg-red-600'
                  >
                    <FaTrash />
                  </button>

                  <div className='mb-3 flex items-center gap-3'>
                    <div className='h-14 w-14 overflow-hidden rounded-md ring-1 ring-slate-200'>
                      <img
                        src={ex.exercise.tutorial}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div>
                      <p className='font-semibold'>{ex.exercise.title}</p>
                      <p className='text-xs text-slate-500'>
                        {ex.sets.length} sets • {totalReps} reps
                      </p>
                    </div>
                  </div>

                  {ex.sets.map((set, j) => (
                    <div
                      key={j}
                      className='grid grid-cols-[80px_1fr_36px_36px_36px] gap-2 mb-2'
                    >
                      <span className='rounded-md border border-slate-300 py-2 text-center bg-white'>
                        {j + 1}
                      </span>

                      <input
                        type='number'
                        min={1}
                        value={set}
                        onChange={e => handleInputChange(i, j, e.target.value)}
                        className='rounded-md border border-slate-300 bg-white px-3 py-2 text-center'
                      />

                      <button
                        onClick={() =>
                          handleInputChange(i, j, Math.max(1, set - 1))
                        }
                        className='rounded-md p-2 text-red-600 ring-1 ring-slate-300 hover:bg-red-50'
                      >
                        <FaMinus />
                      </button>

                      <button
                        onClick={() => handleInputChange(i, j, Number(set) + 1)}
                        className='rounded-md p-2 text-emerald-600 ring-1 ring-slate-300 hover:bg-emerald-50'
                      >
                        <FaPlus />
                      </button>

                      <button
                        onClick={() => handleRemoveSet(i, j)}
                        disabled={ex.sets.length <= 1}
                        className={`rounded-md p-2 ${
                          ex.sets.length <= 1
                            ? 'text-slate-300 ring-1 ring-slate-200 cursor-not-allowed'
                            : 'text-red-500 ring-1 ring-slate-300 hover:bg-red-50'
                        }`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddSet(i)}
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
            <p className='text-xs text-slate-500'>Pick exercises to include.</p>
          </div>
          <div className='p-5 h-[82vh] overflow-auto'>
            <ExerciseLibrary handleAddExercise={handleAddExercise} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CreateWorkout;
