import React, { useEffect, useMemo, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination';
import { deleteWorkout, fetchWorkouts } from '~/store/features/workout-slice';

import logo from '../assets/logo.png';

const getCreatorLabel = u => {
  const nameOrEmail = u?.name || u?.email || '';
  return `Admin${nameOrEmail ? ' • ' + nameOrEmail : ''}`;
};

const roleBadgeClass = 'bg-indigo-50 text-indigo-700 ring-indigo-200';

const formatDate = iso => {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const Badge = ({ children }) => (
  <span className='inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200'>
    {children}
  </span>
);

const Skeleton = ({ className = '' }) => (
  <div className={`bg-slate-200/70 ${className}`} />
);

export default function WorkoutListAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    workouts = [],
    loading,
    error,
    totalPages = 1
  } = useSelector(s => s.workouts);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchWorkouts({ page, limit: 10, title: search }));
  }, [dispatch, page, search]);

  const adminWorkouts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (workouts || []).filter(w => {
      const user = w.user;
      if (!user) return false;
      return (
        user.role?.toLowerCase() === 'admin' &&
        w.title?.toLowerCase().includes(q)
      );
    });
  }, [workouts, search]);

  const handleDelete = id => {
    const action = dispatch(deleteWorkout(id));
    (action.unwrap ? action.unwrap() : action)
      .then(() => toast.success('Workout deleted successfully!'))
      .catch(() => toast.error('Failed to delete workout'));
  };

  const handleView = id => navigate(`/workouts/workout-detail/${id}`);

  const loadingAny = loading;
  const errorAny = error;

  // Function to get muscles and equipment from exercise ID
  const getMusclesAndEquipment = exercise => {
    const muscles =
      exercise.muscles?.map(mu => mu.title).join(', ') || 'No muscles data';
    const equipment =
      exercise.equipments?.map(eq => eq.title).join(', ') ||
      'No equipment data';
    return { muscles, equipment };
  };

  return (
    <section className='mx-auto max-w-7xl px-4 lg:px-6 pt-8 pb-10'>
      <div className='mb-6 rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl'>
              Admin Workouts
            </h2>
            <p className='mt-1 text-slate-600'>
              <b>Admin's Workouts</b>
            </p>
          </div>

          <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center'>
            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder='Search admin workouts...'
              className='w-full sm:w-80 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
            />

            {totalPages > 1 && (
              <div className='sm:ml-2'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={page === i + 1}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage(p => Math.min(p + 1, totalPages))
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      {errorAny && (
        <div className='mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700'>
          {String(errorAny)}
        </div>
      )}

      {loadingAny && (
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`admin-sk-${i}`}
              className='flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
            >
              <Skeleton className='h-28 w-28 rounded-xl' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-6 w-1/2 rounded' />
                <Skeleton className='h-4 w-1/3 rounded' />
                <Skeleton className='h-4 w-2/3 rounded' />
              </div>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <Skeleton className='h-10 w-10 rounded-full' />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loadingAny && adminWorkouts.length === 0 && (
        <div className='rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500'>
          No admin workouts found.
        </div>
      )}

      <div className='space-y-4'>
        {!loadingAny &&
          adminWorkouts.map(w => {
            return (
              <article
                key={w._id}
                className='group flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md'
              >
                <button
                  onClick={() => handleView(w._id)}
                  className='relative h-28 w-28 overflow-hidden rounded-xl ring-2 ring-slate-200'
                  title='Xem chi tiết'
                >
                  <img
                    src={w.image || logo}
                    alt={w.title}
                    className='absolute inset-0 h-full w-full object-cover'
                  />
                </button>

                <div className='flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h3 className='text-lg font-bold text-slate-900'>
                      {w.title}
                    </h3>

                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${roleBadgeClass}`}
                    >
                      {getCreatorLabel(w.user)}
                    </span>

                    <span className='inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200'>
                      {w.exercises?.length || 0} exercises
                    </span>

                    <span className='text-xs text-slate-500'>
                      {formatDate(w.createdAt)}
                    </span>
                  </div>

                  <div className='mt-2 flex flex-wrap gap-2'>
                    {w.exercises?.map(row => {
                      const { muscles } = getMusclesAndEquipment(row.exercise);
                      return (
                        <Badge key={`${w._id}-${row._id}-m`}>{muscles}</Badge>
                      );
                    })}
                  </div>
                  <div className='mt-1 flex flex-wrap gap-2'>
                    {w.exercises?.map(row => {
                      const { equipment } = getMusclesAndEquipment(
                        row.exercise
                      );
                      return (
                        <Badge key={`${w._id}-${row._id}-e`}>{equipment}</Badge>
                      );
                    })}
                  </div>
                </div>

                <div className='flex items-center gap-2 self-start'>
                  <Link
                    to={`/workout/edit-workout/${w._id}`}
                    title='Edit workout'
                  >
                    <button className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-200'>
                      <FaEdit aria-hidden />
                      <span className='sr-only'>Edit</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(w._id)}
                    title='Delete workout'
                    className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-200'
                  >
                    <FaTrash aria-hidden />
                    <span className='sr-only'>Delete</span>
                  </button>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
}
