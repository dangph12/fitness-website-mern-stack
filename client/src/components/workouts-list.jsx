import React, { useEffect, useMemo, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { fetchExerciseById } from '~/store/features/exercise-slice';
import { deleteWorkout, fetchWorkouts } from '~/store/features/workout-slice';

import logo from '../assets/logo.png';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './ui/pagination';

const WorkoutList = () => {
  const dispatch = useDispatch();
  const {
    workouts = [],
    loading,
    error,
    totalPages = 1
  } = useSelector(state => state.workouts);
  const { exercises = [] } = useSelector(state => state.exercises);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchWorkouts({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (!workouts || workouts.length === 0) return;

    const existingIds = new Set(exercises?.map(ex => ex?._id?.toString()));
    const idsToFetch = new Set();

    workouts.forEach(workout => {
      workout?.exercises?.forEach(ex => {
        const id = ex?.exercise?.toString();
        if (id && !existingIds.has(id)) idsToFetch.add(id);
      });
    });

    idsToFetch.forEach(id => dispatch(fetchExerciseById(id)));
  }, [dispatch, workouts]);

  const handleDelete = workoutId => {
    const action = dispatch(deleteWorkout(workoutId));
    if (action.unwrap) {
      action
        .unwrap()
        .then(() => toast.success('Workout deleted successfully!'))
        .catch(() => toast.error('Failed to delete workout'));
    } else {
      action
        .then(() => toast.success('Workout deleted successfully!'))
        .catch(() => toast.error('Failed to delete workout'));
    }
  };

  const handleViewDetails = workoutId => {
    navigate(`/workouts/workout-detail/${workoutId}`);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`;
  };

  const exerciseMap = useMemo(() => {
    const m = new Map();
    exercises.forEach(ex => m.set(ex._id?.toString(), ex));
    return m;
  }, [exercises]);

  const getMusclesAndEquipment = exerciseId => {
    const exercise = exerciseMap.get(exerciseId?.toString());
    if (exercise) {
      const muscles =
        exercise.muscles
          ?.map(mu => mu?.title)
          .filter(Boolean)
          .join(', ') || 'No muscles data';
      const equipment =
        exercise.equipments
          ?.map(eq => eq?.title)
          .filter(Boolean)
          .join(', ') || 'No equipment data';
      return { muscles, equipment };
    }
    return { muscles: 'Loading...', equipment: 'Loading...' };
  };

  const filteredWorkouts = workouts.filter(w =>
    w.title?.toLowerCase?.().includes(searchQuery.toLowerCase())
  );

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

        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg'>
          <div className='overflow-x-auto'>
            <table className='min-w-full table-auto'>
              <thead className='bg-slate-900 text-white'>
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
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className='animate-pulse'>
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

                {!loading && filteredWorkouts?.length === 0 && (
                  <tr>
                    <td colSpan={7} className='p-10 text-center text-slate-500'>
                      No workouts found. Try adjusting your search.
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredWorkouts?.map(workout => (
                    <tr
                      key={workout._id}
                      className='group bg-white transition-colors hover:bg-slate-50'
                    >
                      <Td
                        onClick={() => handleViewDetails(workout._id)}
                        className='cursor-pointer align-middle'
                      >
                        <div className='relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 overflow-hidden rounded-xl ring-2 ring-slate-200'>
                          <img
                            src={workout.image || logo}
                            alt={workout.title}
                            className='absolute inset-0 w-full h-full object-cover'
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
                        <div className='flex flex-wrap gap-2'>
                          {workout.exercises?.map(ex => {
                            const { muscles } = getMusclesAndEquipment(
                              ex.exercise
                            );
                            return (
                              <Badge key={`${workout._id}-${ex._id}-muscle`}>
                                {muscles}
                              </Badge>
                            );
                          })}
                        </div>
                      </Td>

                      <Td>
                        <div className='flex flex-wrap gap-2'>
                          {workout.exercises?.map(ex => {
                            const { equipment } = getMusclesAndEquipment(
                              ex.exercise
                            );
                            return (
                              <Badge key={`${workout._id}-${ex._id}-equip`}>
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

        {totalPages > 1 && (
          <Pagination className='mt-6'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
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
