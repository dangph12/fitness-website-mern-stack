import React, { useEffect, useMemo, useState } from 'react';
import { FaEdit, FaGlobe, FaLock, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import logo from '~/assets/logo.png';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination';
import { deletePlan, fetchPlans } from '~/store/features/plan-slice';

const getCreatorLabel = u => u?.name || u?.email || 'Unknown';
const formatDate = iso => {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const Badge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
  >
    {children}
  </span>
);

const Skeleton = ({ className = '' }) => (
  <div className={`bg-slate-200/70 ${className}`} />
);

export default function PlanListPublic() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    plans = [],
    loading,
    error,
    totalPages = 1
  } = useSelector(s => s.plans);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchPlans({ page, limit: 4, title: search, isPublic: true }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [page, search, dispatch]);

  const publicPlans = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (plans || []).filter(
      p => p.isPublic === true && p.title?.toLowerCase().includes(q)
    );
  }, [plans, search]);

  const handleDelete = id => {
    const action = dispatch(deletePlan(id));
    (action.unwrap ? action.unwrap() : action)
      .then(() => toast.success('Plan deleted successfully!'))
      .catch(() => toast.error('Failed to delete plan'));
  };

  const handleView = id => navigate(`/plans/plan-detail/${id}`);

  return (
    <section className='mx-auto max-w-7xl px-4 lg:px-6 pt-8 pb-10'>
      <div className='mb-6 rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl'>
              Public Plans
            </h2>
            <p className='mt-1 text-slate-600'>
              <b>All plans shared publicly</b>
            </p>
          </div>

          <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center'>
            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder='Search public plans...'
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

      {error && (
        <div className='mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700'>
          {String(error)}
        </div>
      )}

      {loading && (
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`public-sk-${i}`}
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

      {!loading && publicPlans.length === 0 && (
        <div className='rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500'>
          No public plans found.
        </div>
      )}

      <div className='space-y-4'>
        {!loading &&
          publicPlans.map(p => (
            <article
              key={p._id}
              className='group flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md'
            >
              <button
                onClick={() => handleView(p._id)}
                className='relative h-28 w-28 overflow-hidden rounded-xl ring-2 ring-slate-200'
                title='View details'
              >
                <img
                  src={p.image || logo}
                  alt={p.title}
                  className='absolute inset-0 h-full w-full object-cover'
                />
              </button>

              <div className='flex-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h3 className='text-lg font-bold text-slate-900'>
                    {p.title}
                  </h3>

                  <Badge className='bg-indigo-50 text-indigo-700 ring-indigo-200'>
                    {getCreatorLabel(p.user)}
                  </Badge>

                  <Badge className='bg-emerald-50 text-emerald-700 ring-emerald-200'>
                    {p.workouts?.length || 0} workouts
                  </Badge>

                  <Badge
                    className={
                      p.isPublic
                        ? 'bg-blue-50 text-blue-700 ring-blue-200'
                        : 'bg-slate-100 text-slate-600 ring-slate-200'
                    }
                  >
                    {p.isPublic ? (
                      <>
                        <FaGlobe className='mr-1 text-blue-500' /> Public
                      </>
                    ) : (
                      <>
                        <FaLock className='mr-1 text-slate-500' /> Private
                      </>
                    )}
                  </Badge>

                  <span className='text-xs text-slate-500'>
                    {formatDate(p.createdAt)}
                  </span>
                </div>

                <p className='mt-2 line-clamp-2 text-sm text-slate-600'>
                  {p.description || 'No description available.'}
                </p>
              </div>

              <div className='flex items-center gap-2 self-start'>
                <Link to={`/plans/edit-plan/${p._id}`} title='Edit plan'>
                  <button className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-200'>
                    <FaEdit aria-hidden />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  title='Delete plan'
                  className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-200'
                >
                  <FaTrash aria-hidden />
                </button>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
