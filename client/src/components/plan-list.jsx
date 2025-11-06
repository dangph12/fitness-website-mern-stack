import { Edit, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
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

const PlanList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    plans = [],
    totalPages = 1,
    totalPlans = 0,
    loading,
    error
  } = useSelector(state => state.plans);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [searchQuery, setSearchQuery] = useState('');

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  useEffect(() => {
    dispatch(fetchPlans({ page, limit }));
  }, [dispatch, page]);

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCreatePlan = () => navigate('/plans/rountine-builder');
  const handleEditPlan = planId => navigate(`/plans/edit-plan/${planId}`);
  const handleViewDetails = planId => navigate(`/plans/plan-detail/${planId}`);

  const handleDeletePlan = planId => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      dispatch(deletePlan(planId))
        .unwrap()
        .then(() => toast.success('Deleted plan successfully!'))
        .catch(() => toast.error('Failed to delete plan.'));
    }
  };

  const filteredPlans = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let visible = plans.filter(p => p.isPublic === false);
    if (q) {
      visible = visible.filter(p => p.title?.toLowerCase().includes(q));
    }
    return visible;
  }, [plans, searchQuery]);

  const startIndex = (page - 1) * limit;

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-6 space-y-6'>
        <div className='flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
              <span className='bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent'>
                Plan List
              </span>
            </h1>
            <p className='mt-1 text-slate-600'>
              Manage, review and refine your workout plans.
            </p>
            <div className='mt-3 h-[3px] w-24 rounded-full bg-gradient-to-r from-emerald-500/80 via-teal-500/80 to-sky-500/80' />
          </div>

          <div className='flex w-full items-center gap-3 sm:w-auto'>
            <div className='relative w-full sm:w-80'>
              <Search
                className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-teal-500'
                size={18}
                aria-hidden
              />
              <input
                type='text'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Search plans by title...'
                aria-label='Search plans'
                className='w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none
                   focus:border-teal-400 focus:ring-2 focus:ring-teal-100'
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-md p-1
                     text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  aria-label='Clear search'
                  title='Clear search'
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={handleCreatePlan}
              className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600
                 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition
                 hover:from-emerald-700 hover:via-teal-700 hover:to-sky-700 active:translate-y-[1px]'
            >
              <Plus size={18} />
              Create Plan
            </button>
          </div>
        </div>

        {error && (
          <div className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700'>
            {String(error)}
          </div>
        )}

        {loading ? (
          <LoadingTableSkeleton />
        ) : filteredPlans.length === 0 ? (
          <EmptyState onCreate={handleCreatePlan} />
        ) : (
          <>
            <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl'>
              <table className='w-full border-collapse text-sm'>
                <thead>
                  <tr className='bg-gradient-to-r from-slate-900 to-slate-800 text-left text-xs font-semibold uppercase tracking-wide text-white'>
                    <th className='px-6 py-4'>#</th>
                    <th className='px-6 py-4'>Image</th>
                    <th className='px-6 py-4'>Title</th>
                    <th className='px-6 py-4'>Description</th>
                    <th className='px-6 py-4'>Visibility</th>
                    <th className='px-6 py-4 whitespace-nowrap'>Created</th>
                    <th className='px-6 py-4 text-center'>Actions</th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-slate-100'>
                  {filteredPlans.map((plan, idx) => (
                    <tr
                      key={plan._id}
                      className='hover:bg-slate-50 transition-colors'
                    >
                      <td className='px-6 py-4 text-slate-500'>
                        {startIndex + idx + 1}
                      </td>

                      <td
                        className='px-6 py-4 cursor-pointer'
                        onClick={() => handleViewDetails(plan._id)}
                      >
                        <div className='h-14 w-20 overflow-hidden rounded-xl ring-1 ring-slate-200'>
                          <img
                            src={plan.image || logo}
                            className='h-full w-full object-cover transition hover:scale-105'
                          />
                        </div>
                      </td>

                      <td className='px-6 py-4 font-medium text-slate-900 max-w-[14rem]'>
                        <button
                          onClick={() => handleViewDetails(plan._id)}
                          className='truncate hover:underline text-blue-600'
                        >
                          {plan.title}
                        </button>
                      </td>

                      <td className='px-6 py-4 max-w-[30rem] text-slate-600'>
                        <span className='line-clamp-2'>{plan.description}</span>
                      </td>

                      <td className='px-6 py-4'>
                        {plan.isPublic ? (
                          <span className='rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200'>
                            Public
                          </span>
                        ) : (
                          <span className='rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-300'>
                            Private
                          </span>
                        )}
                      </td>

                      <td className='px-6 py-4 text-slate-500 whitespace-nowrap'>
                        {new Date(plan.createdAt).toLocaleDateString('en-GB')}
                      </td>

                      <td className='px-6 py-4'>
                        <div className='flex justify-center gap-3'>
                          <button
                            onClick={() => handleEditPlan(plan._id)}
                            className='rounded-full bg-amber-100 p-2 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-200 transition'
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
                            className='rounded-full bg-rose-100 p-2 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-200 transition'
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!searchQuery && totalPages > 1 && (
          <Pagination className='mt-2'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(page + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <div className='text-center text-sm text-slate-500'>
          Page {page} of {totalPages} • Total {totalPlans} plans
        </div>
      </div>
    </div>
  );
};

export default PlanList;

function LoadingTableSkeleton() {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500'>
      <Loader2 className='mx-auto h-8 w-8 animate-spin' />
      Loading...
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center'>
      <h3 className='text-lg font-semibold text-slate-900'>No plans found</h3>
      <p className='mt-1 text-sm text-slate-600'>
        Create your first plan to get started.
      </p>
      <button
        onClick={onCreate}
        className='mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700'
      >
        <Plus size={18} /> Create Plan
      </button>
    </div>
  );
}
