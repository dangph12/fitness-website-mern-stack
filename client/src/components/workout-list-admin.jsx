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
import { fetchExerciseById } from '~/store/features/exercise-slice';
import { fetchUsers } from '~/store/features/users-slice';
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

  const { exercises = [] } = useSelector(s => s.exercises || {});
  const {
    users = [],
    loading: usersLoading,
    error: usersError
  } = useSelector(s => s.users || {});

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchWorkouts({ page, limit: 8, title: search }));
  }, [dispatch, page, search]);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 200 }));
  }, [dispatch]);

  const usersMap = useMemo(() => {
    const m = new Map();
    (users || []).forEach(u => m.set(String(u._id), u));
    return m;
  }, [users]);

  const adminWorkouts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (workouts || []).filter(w => {
      const userId = String(typeof w.user === 'object' ? w.user?._id : w.user);
      const u = usersMap.get(userId);
      if (!u) return false;
      const isAdmin = String(u.role || '').toLowerCase() === 'admin';
      if (!isAdmin) return false;
      return w.title?.toLowerCase?.().includes(q);
    });
  }, [workouts, usersMap, search]);

  useEffect(() => {
    if (!adminWorkouts.length) return;
    const have = new Set(exercises.map(ex => ex?._id?.toString()));
    const need = new Set();
    adminWorkouts.forEach(w =>
      w?.exercises?.forEach(row => {
        const exId =
          typeof row?.exercise === 'string' ? row.exercise : row?.exercise?._id;
        const id = exId ? String(exId) : null;
        if (id && !have.has(id)) need.add(id);
      })
    );
    need.forEach(id => dispatch(fetchExerciseById(id)));
  }, [dispatch, adminWorkouts, exercises]);

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
    const ex = exerciseMap.get(String(id)) || fallbackObj;
    if (!ex) return { muscles: 'Loading...', equipment: 'Loading...' };

    const muscles =
      (ex.muscles || [])
        .map(mu => (typeof mu === 'string' ? mu : mu?.title))
        .filter(Boolean)
        .join(', ') || 'No muscles data';
    const equipment =
      (ex.equipments || [])
        .map(eq => (typeof eq === 'string' ? eq : eq?.title))
        .filter(Boolean)
        .join(', ') || 'No equipment data';
    return { muscles, equipment };
  };

  const handleDelete = id => {
    const action = dispatch(deleteWorkout(id));
    (action.unwrap ? action.unwrap() : action)
      .then(() => toast.success('Workout deleted successfully!'))
      .catch(() => toast.error('Failed to delete workout'));
  };

  const handleView = id => navigate(`/workouts/workout-detail/${id}`);

  const loadingAny = loading || usersLoading;
  const errorAny = error || usersError;

  return (
    <section className='mx-auto max-w-7xl px-4 lg:px-6 pt-8 pb-10'>
      <div className='mb-6 rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl'>
              Admin Workouts
            </h2>
            <p className='mt-1 text-slate-600'>
              Chỉ hiển thị các workout do <b>Admin</b> tạo (lọc theo Users
              slice).
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
            const userId = String(
              typeof w.user === 'object' ? w.user?._id : w.user
            );
            const u = usersMap.get(userId);

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
                      {getCreatorLabel(u)}
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
