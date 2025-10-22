import React, { useEffect, useMemo, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiHome, FiLock, FiLogIn } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { fetchExerciseById } from '~/store/features/exercise-slice';
import {
  deleteWorkout,
  fetchWorkoutsByUser
} from '~/store/features/workout-slice';

import logo from '../assets/logo.png';

const LOGIN_PATH = '/auth/login';

const WorkoutList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth.user?.id);

  const {
    workoutsByUser = [],
    loadingByUser = false,
    errorByUser = null
  } = useSelector(state => state.workouts || {});
  const { exercises = [] } = useSelector(state => state.exercises || {});

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchWorkoutsByUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (!workoutsByUser?.length) return;
    const have = new Set(exercises.map(ex => ex?._id?.toString()));
    const need = new Set();
    workoutsByUser.forEach(w =>
      w?.exercises?.forEach(row => {
        const exId =
          typeof row?.exercise === 'string' ? row.exercise : row?.exercise?._id;
        const idStr = exId ? String(exId) : null;
        if (idStr && !have.has(idStr)) need.add(idStr);
      })
    );
    need.forEach(id => dispatch(fetchExerciseById(id)));
  }, [dispatch, workoutsByUser, exercises]);

  const handleDelete = async workoutId => {
    try {
      const action = dispatch(deleteWorkout(workoutId));
      await (action.unwrap ? action.unwrap() : action);
      toast.success('Workout deleted successfully!');
    } catch {
      toast.error('Failed to delete workout');
    }
  };

  const handleViewDetails = workoutId => {
    navigate(`/workouts/workout-detail/${workoutId}`);
  };

  const formatDate = iso => {
    const d = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  const exerciseMap = useMemo(() => {
    const m = new Map();
    exercises.forEach(ex => m.set(ex?._id?.toString(), ex));
    return m;
  }, [exercises]);

  const getMusclesAndEquipment = exerciseIdOrObj => {
    const id =
      typeof exerciseIdOrObj === 'string'
        ? exerciseIdOrObj
        : exerciseIdOrObj?._id;
    const fallbackObj =
      typeof exerciseIdOrObj === 'object' ? exerciseIdOrObj : undefined;
    const exercise = exerciseMap.get(String(id)) || fallbackObj;
    if (exercise) {
      const muscles =
        (exercise.muscles || [])
          .map(m => (typeof m === 'string' ? m : m?.title))
          .filter(Boolean)
          .join(', ') || 'No muscles data';
      const equipment =
        (exercise.equipments || [])
          .map(e => (typeof e === 'string' ? e : e?.title))
          .filter(Boolean)
          .join(', ') || 'No equipment data';
      return { muscles, equipment };
    }
    return { muscles: 'Loading...', equipment: 'Loading...' };
  };

  const filteredWorkouts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = (workoutsByUser || []).filter(w =>
      w.title?.toLowerCase?.().includes(q)
    );

    return list.slice().sort((a, b) => {
      const ta = new Date(a.createdAt).getTime() || 0;
      const tb = new Date(b.createdAt).getTime() || 0;
      if (tb - ta !== 0) return tb - ta;
      const ua = new Date(a.updatedAt).getTime() || 0;
      const ub = new Date(b.updatedAt).getTime() || 0;
      return ub - ua;
    });
  }, [workoutsByUser, searchQuery]);

  const loading = loadingByUser;
  const error = errorByUser;

  if (!userId) {
    return (
      <div className='min-h-[70vh] flex items-center justify-center px-4'>
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/40' />

        <div className='w-full max-w-md'>
          <div className='rounded-3xl bg-white/80 backdrop-blur p-8 shadow-xl ring-1 ring-slate-200'>
            <div className='flex flex-col items-center text-center'>
              <span className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200'>
                <FiLock className='h-6 w-6' aria-hidden />
              </span>

              <h2 className='text-2xl font-bold tracking-tight text-slate-900'>
                Sign in required
              </h2>
              <p className='mt-2 text-slate-600'>
                You need to be logged in to view your workout list.
              </p>

              <div className='mt-6 flex w-full flex-col gap-3 sm:flex-row'>
                <Link
                  to={LOGIN_PATH}
                  className='inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
                >
                  <FiLogIn className='h-4 w-4' aria-hidden />
                  Go to login
                </Link>

                <Link
                  to='/'
                  className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300'
                >
                  <FiHome className='h-4 w-4' aria-hidden />
                  Back to home
                </Link>
              </div>

              <p className='mt-4 text-xs text-slate-500'>
                Don’t have an account?{' '}
                <Link
                  to='/register'
                  className='font-medium text-emerald-700 hover:underline'
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-6'>
        <div className='mb-6 rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur'>
          <h4 className='text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl'>
            My Workout List
          </h4>
          <p className='mt-2 max-w-2xl text-slate-600 md:text-lg'>
            Filter and refine your search to find the perfect workout plan for
            your fitness goals
          </p>
        </div>

        <div className='mb-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative w-full sm:max-w-md'>
            <span className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400'>
              <SearchIcon />
            </span>
            <input
              type='text'
              placeholder='Search workouts...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
            />
          </div>

          <Link
            to='/workouts/create-workout'
            className='inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
          >
            <span className='mr-2 text-lg leading-none'>＋</span> Add Workout
          </Link>
        </div>

        {error && (
          <div className='mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700'>
            {String(error)}
          </div>
        )}

        <div className='rounded-2xl border border-slate-200 bg-white shadow-lg'>
          <div className='max-h-[75vh] overflow-y-auto overflow-x-auto'>
            <table className='min-w-full table-auto'>
              <thead className='sticky top-0 z-20 bg-slate-900 text-white'>
                <tr>
                  <Th>Image</Th>
                  <Th>Workout Name</Th>
                  <Th>Exercises</Th>
                  <Th>Muscles</Th>
                  <Th>Equipment</Th>
                  <Th>Created At</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`sk-${i}`} className='animate-pulse'>
                      <Td>
                        <Skeleton className='h-16 w-16 rounded-lg' />
                      </Td>
                      <Td>
                        <Skeleton className='h-6 w-40 rounded-full' />
                      </Td>
                      <Td>
                        <Skeleton className='h-6 w-28 rounded-full' />
                      </Td>
                      <Td>
                        <Skeleton className='h-6 w-56 rounded-md' />
                      </Td>
                      <Td>
                        <Skeleton className='h-6 w-56 rounded-md' />
                      </Td>
                      <Td>
                        <Skeleton className='h-6 w-36 rounded-md' />
                      </Td>
                      <Td>
                        <div className='flex gap-3'>
                          <Skeleton className='h-10 w-10 rounded-full' />
                          <Skeleton className='h-10 w-10 rounded-full' />
                        </div>
                      </Td>
                    </tr>
                  ))}

                {!loading && filteredWorkouts.length === 0 && (
                  <tr>
                    <td colSpan={7} className='p-10 text-center text-slate-500'>
                      No workouts found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredWorkouts.map(workout => (
                    <tr
                      key={workout._id}
                      className='bg-white transition-colors hover:bg-slate-50'
                    >
                      <Td
                        onClick={() => handleViewDetails(workout._id)}
                        className='cursor-pointer'
                      >
                        <div className='relative h-24 w-24 overflow-hidden rounded-xl ring-2 ring-slate-200 md:h-28 md:w-28 lg:h-32 lg:w-32'>
                          <img
                            src={workout.image || logo}
                            alt={workout.title}
                            className='absolute inset-0 h-full w-full object-cover'
                          />
                        </div>
                      </Td>
                      <Td>
                        <span className='inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200'>
                          {workout.title}
                        </span>
                      </Td>
                      <Td>
                        <span className='inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200'>
                          {workout.exercises?.length || 0} exercises
                        </span>
                      </Td>
                      <Td>
                        <div className='flex max-w-xl flex-wrap gap-2'>
                          {workout.exercises?.map(row => {
                            const { muscles } = getMusclesAndEquipment(
                              row.exercise
                            );
                            return (
                              <Badge key={`${workout._id}-${row._id}-m`}>
                                {muscles}
                              </Badge>
                            );
                          })}
                        </div>
                      </Td>
                      <Td>
                        <div className='flex max-w-xl flex-wrap gap-2'>
                          {workout.exercises?.map(row => {
                            const { equipment } = getMusclesAndEquipment(
                              row.exercise
                            );
                            return (
                              <Badge key={`${workout._id}-${row._id}-e`}>
                                {equipment}
                              </Badge>
                            );
                          })}
                        </div>
                      </Td>
                      <Td>
                        <span className='text-sm text-slate-700'>
                          {formatDate(workout.createdAt)}
                        </span>
                      </Td>
                      <Td>
                        <div className='flex items-center gap-3'>
                          <Link
                            to={`/workout/edit-workout/${workout._id}`}
                            title='Edit workout'
                          >
                            <button className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-200'>
                              <FaEdit aria-hidden />
                              <span className='sr-only'>Edit</span>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(workout._id)}
                            title='Delete workout'
                            className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-200'
                          >
                            <FaTrash aria-hidden />
                            <span className='sr-only'>Delete</span>
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;

function Th({ children }) {
  return (
    <th className='whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/90'>
      {children}
    </th>
  );
}
function Td({ children, className = '', onClick }) {
  return (
    <td
      onClick={onClick}
      className={`whitespace-nowrap px-6 py-4 align-middle text-slate-700 ${className}`}
    >
      {children}
    </td>
  );
}
function Badge({ children }) {
  return (
    <span className='inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200'>
      {children}
    </span>
  );
}
function Skeleton({ className = '' }) {
  return <div className={`bg-slate-200/70 ${className}`} />;
}
function SearchIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      viewBox='0 0 24 24'
      fill='currentColor'
    >
      <path
        fillRule='evenodd'
        d='M10.5 3.75a6.75 6.75 0 104.22 12.03l3.25 3.25a.75.75 0 101.06-1.06l-3.25-3.25A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z'
        clipRule='evenodd'
      />
    </svg>
  );
}
