import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  FaCheckCircle,
  FaDumbbell,
  FaEdit,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import {
  addFavoriteItems,
  fetchFavorites,
  removeFavoriteItems
} from '~/store/features/favourite-slice';
import { fetchHistoryByUser } from '~/store/features/history-slice';
import { fetchWorkoutById } from '~/store/features/workout-slice';

import logo from '../assets/logo.png';

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const repsOf = set => {
  if (typeof set === 'number' || typeof set === 'string') {
    const n = parseInt(set, 10);
    return Number.isFinite(n) ? n : 0;
  }
  if (set && typeof set === 'object') {
    const n = Number(set.reps);
    Number(set.rep);
    Number(set.repeat);
    Number(set.count);
    Number(set.r);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const calculateTotalReps = sets =>
  Array.isArray(sets) ? sets.reduce((s, it) => s + repsOf(it), 0) : 0;

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const userId = useSelector(state => state?.auth?.user?.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentWorkout, loading, error } = useSelector(
    state => state.workouts
  );
  const { history = [] } = useSelector(state => state.histories);

  const { favorite, loading: favLoading } = useSelector(
    state => state.favorites || {}
  );

  const [completedExerciseIds, setCompletedExerciseIds] = useState(new Set());

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (workoutId) dispatch(fetchWorkoutById(workoutId));
    if (userId) dispatch(fetchHistoryByUser(userId));
  }, [dispatch, workoutId, userId]);

  useEffect(() => {
    if (userId) dispatch(fetchFavorites(userId));
  }, [dispatch, userId]);

  const latestHistoryForWorkout = useMemo(() => {
    const records = history.filter(h => h?.workout?._id === workoutId);
    if (!records.length) return null;
    return records.reduce((latest, h) =>
      new Date(h.createdAt) > new Date(latest.createdAt) ? h : latest
    );
  }, [history, workoutId]);

  const isWorkoutCompleted = !!latestHistoryForWorkout;
  const lastCompletedAt = latestHistoryForWorkout?.createdAt || null;

  useEffect(() => {
    if (!latestHistoryForWorkout?.workout?.exercises) {
      setCompletedExerciseIds(new Set());
      return;
    }
    const ids = new Set(
      latestHistoryForWorkout.workout.exercises
        .map(ex =>
          typeof ex.exercise === 'string' ? ex.exercise : ex.exercise?._id
        )
        .filter(Boolean)
    );
    setCompletedExerciseIds(ids);
  }, [latestHistoryForWorkout]);

  const isFav = useMemo(() => {
    const list = favorite?.workouts || [];
    return list.some(w => {
      const id = typeof w === 'string' ? w : w?._id;
      return id?.toString?.() === workoutId?.toString?.();
    });
  }, [favorite?.workouts, workoutId]);

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100 text-gray-500'>
        Loading Workout Details...
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100 text-red-600'>
        Error loading workout: {error}
      </div>
    );

  if (!currentWorkout)
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100 text-gray-500'>
        No workout found.
      </div>
    );

  const handleTutorialClick = exerciseId => {
    navigate(`/exercise/${exerciseId}`);
  };

  const toggleFavorite = () => {
    if (!userId || !workoutId) return;
    if (isFav) {
      const p = dispatch(
        removeFavoriteItems({ userId, workouts: [workoutId] })
      );
      (p.unwrap ? p.unwrap() : p)
        .then(() => {
          toast.success('Removed from Favorites');
        })
        .catch(() => {
          toast.error('Failed to remove from Favorites');
        });
    } else {
      const p = dispatch(addFavoriteItems({ userId, workouts: [workoutId] }));
      (p.unwrap ? p.unwrap() : p)
        .then(() => {
          toast.success('Added to Favorites');
        })
        .catch(() => {
          toast.error('Failed to add to Favorites');
        });
    }
  };

  const exercises = currentWorkout?.exercises || [];

  const ExerciseRow = ({ exerciseItem }) => {
    const { exercise, sets } = exerciseItem;
    const exId = exercise?._id || exercise;
    const done = exId ? completedExerciseIds.has(exId) : false;

    return (
      <div
        className={`flex items-center justify-between p-4 rounded-lg bg-white hover:bg-gray-50 transition border shadow-sm cursor-pointer ${
          done ? 'border-emerald-300' : 'border-gray-300'
        }`}
        onClick={() => handleTutorialClick(exId)}
      >
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 rounded-md overflow-hidden bg-gray-200'>
            {exercise?.tutorial ? (
              <img
                src={
                  exercise.tutorial.endsWith('.gif')
                    ? exercise.tutorial.replace(
                        '/upload/',
                        '/upload/f_jpg/so_0/'
                      )
                    : exercise.tutorial
                }
                onMouseEnter={e => (e.currentTarget.src = exercise.tutorial)}
                onMouseLeave={e =>
                  (e.currentTarget.src = exercise.tutorial.replace(
                    '/upload/',
                    '/upload/f_jpg/so_0/'
                  ))
                }
                alt={exercise.title}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <FaDumbbell className='text-gray-500 text-xl' />
              </div>
            )}
          </div>

          <div>
            <h4 className='text-black font-semibold'>
              {exercise?.title || 'Exercise'}
            </h4>
            <p className='text-sm text-gray-600'>
              Difficulty: {exercise?.difficulty || 'Unknown'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 text-sm text-gray-700'>
          {done && (
            <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700 border border-emerald-200'>
              <FaCheckCircle /> Completed
            </span>
          )}
          <p>
            {sets.length} Sets — Total Reps: {calculateTotalReps(sets)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className='bg-white text-black min-h-screen'>
      <header className='relative pt-40 pb-16 overflow-hidden bg-gray-100'>
        <div className='absolute inset-0 z-0 opacity-30'>
          <img
            src={currentWorkout.image || logo}
            alt='Workout Background'
            className='w-full h-full object-cover'
            onError={e => {
              e.currentTarget.src = logo;
            }}
          />
        </div>

        <div className='relative max-w-6xl mx-auto px-6 z-20'>
          <div className='flex items-center gap-3 flex-wrap'>
            <h1 className='text-5xl font-extrabold text-gray-900 mb-2'>
              {currentWorkout.title}
            </h1>
            {isWorkoutCompleted && (
              <span className='inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700 border border-green-200'>
                <FaCheckCircle />
                Completed{' '}
                {lastCompletedAt ? `• ${formatDate(lastCompletedAt)}` : ''}
              </span>
            )}
          </div>

          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4'>
            <div className='flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-600'>
              <p>
                Routine by:{' '}
                <span className='font-medium'>
                  {currentWorkout.user?.name || 'Unknown'}
                </span>
              </p>
              <p>
                Last updated:{' '}
                <span className='font-medium'>
                  {formatDate(currentWorkout.updatedAt)}
                </span>
              </p>
            </div>

            <div className='flex justify-center sm:justify-end items-center gap-3'>
              <button
                onClick={toggleFavorite}
                disabled={favLoading}
                title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-medium transition
                  ${
                    isFav
                      ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                      : 'bg-white text-rose-600 border-rose-300 hover:bg-rose-50'
                  }`}
                aria-pressed={isFav}
                aria-label={
                  isFav ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                {isFav ? (
                  <FaHeart className='mr-2' />
                ) : (
                  <FaRegHeart className='mr-2' />
                )}
                {isFav ? 'Favorited' : 'Add to Favorites'}
              </button>

              <Link
                to={`/workout/edit-workout/${workoutId}`}
                className='flex items-center bg-gray-700 text-white hover:bg-gray-800 px-6 py-2 rounded-lg font-medium transition'
              >
                <FaEdit className='mr-2' />
                Edit Routine
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-6 py-10'>
        <div className='flex justify-between items-center mb-6 p-4 border-b border-gray-200'>
          <h2 className='text-2xl font-semibold text-gray-900'>
            Workout Detail
          </h2>

          <button
            onClick={() =>
              navigate(`/workouts/workout-session/${currentWorkout._id}`)
            }
            className={`px-5 py-2 rounded-lg font-medium transition ${
              isWorkoutCompleted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            title={isWorkoutCompleted ? 'Do again' : 'Start Workout'}
          >
            {isWorkoutCompleted ? 'Do Again' : 'Start Workout'}
          </button>
        </div>

        <div className='bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm'>
          <div className='flex justify-between items-center pb-4 border-b border-gray-200 mb-4'>
            <h3 className='text-lg font-semibold text-gray-800'>
              Workout Plan
            </h3>
            <p className='text-gray-500 text-sm'>
              {exercises.length}{' '}
              {exercises.length === 1 ? 'exercise' : 'exercises'}
            </p>
          </div>

          <div className='space-y-4'>
            {Array.isArray(exercises) &&
              exercises.map((item, idx) => {
                const ex = item?.exercise;
                const normalized =
                  typeof ex === 'object' && ex !== null
                    ? ex
                    : { _id: ex, title: 'Unnamed Exercise' };
                return (
                  <ExerciseRow
                    key={normalized._id || idx}
                    exerciseItem={{ ...item, exercise: normalized }}
                  />
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutDetail;
