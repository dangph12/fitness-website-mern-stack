import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import logo from '~/assets/logo.png';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination';
import { deletePlan, fetchPlans } from '~/store/features/plan-slice';
import { fetchWorkoutById } from '~/store/features/workout-slice';

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

  const handleDeletePlan = planId => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      dispatch(deletePlan(planId))
        .unwrap()
        .then(() => toast.success('Deleted plan successfully!'))
        .catch(() => toast.error('Failed to delete plan.'));
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
      pages.push(
        <PaginationItem key='start-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={page === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < totalPages) {
      pages.push(
        <PaginationItem key='end-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return pages;
  };

  const handleViewDetails = planId => navigate(`/plans/plan-detail/${planId}`);

  const startIndex = useMemo(() => (page - 1) * limit, [page, limit]);

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8'>
      <div className='mx-auto w-full max-w-7xl px-4 lg:px-6 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>
              Plan List
            </h1>
            <p className='mt-1 text-slate-600'>
              Manage, review and refine your workout plans.
            </p>
          </div>
          <button
            onClick={handleCreatePlan}
            className='inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
          >
            <Plus size={18} /> Create Plan
          </button>
        </div>

        {error && (
          <div className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700'>
            {String(error)}
          </div>
        )}

        {loading ? (
          <LoadingTableSkeleton />
        ) : plans.length === 0 ? (
          <EmptyState onCreate={handleCreatePlan} />
        ) : (
          <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg'>
            <div className='overflow-x-auto'>
              <table className='w-full table-auto text-sm'>
                <thead className='bg-slate-900 text-white'>
                  <tr>
                    <Th>#</Th>
                    <Th>Image</Th>
                    <Th>Title</Th>
                    <Th>Description</Th>
                    <Th>Visibility</Th>
                    <Th>Created At</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-slate-100'>
                  {plans.map((plan, idx) => (
                    <tr
                      key={plan._id}
                      className='group hover:bg-slate-50 transition-colors'
                    >
                      <Td className='text-slate-500'>{startIndex + idx + 1}</Td>

                      <Td
                        onClick={() => handleViewDetails(plan._id)}
                        className='cursor-pointer align-middle'
                      >
                        <div className='relative size-20 md:size-24 overflow-hidden rounded-xl ring-1 ring-slate-200'>
                          <img
                            src={plan.image || logo}
                            alt={plan.title}
                            className='absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]'
                          />
                        </div>
                      </Td>

                      <Td className='font-medium'>
                        <button
                          onClick={() => handleViewDetails(plan._id)}
                          className='text-blue-700 hover:underline underline-offset-4'
                          title='View details'
                        >
                          {plan.title}
                        </button>
                      </Td>

                      <Td className='text-slate-600 max-w-[28rem]'>
                        <span className='line-clamp-2'>{plan.description}</span>
                      </Td>

                      <Td>
                        {plan.isPublic ? (
                          <span className='rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200'>
                            Public
                          </span>
                        ) : (
                          <span className='rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200'>
                            Private
                          </span>
                        )}
                      </Td>

                      <Td className='text-slate-500'>
                        {new Date(plan.createdAt).toLocaleString('en-GB')}
                      </Td>

                      <Td>
                        <div className='flex items-center gap-3'>
                          <button
                            onClick={() => handleEditPlan(plan._id)}
                            className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-200'
                            title='Edit Plan'
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
                            className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-200'
                            title='Delete Plan'
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className='mt-2'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                />
              </PaginationItem>
              {renderPaginationNumbers()}
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
      className={`whitespace-nowrap px-6 py-4 align-middle ${className}`}
    >
      {children}
    </td>
  );
}

function LoadingTableSkeleton() {
  return (
    <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg'>
      <div className='overflow-x-auto'>
        <table className='w-full table-auto text-sm'>
          <thead className='bg-slate-900 text-white'>
            <tr>
              {[
                '#',
                'Image',
                'Title',
                'Description',
                'Visibility',
                'Created At',
                'Actions'
              ].map(h => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className='animate-pulse'>
                <Td>
                  <Skel className='h-5 w-8 rounded' />
                </Td>
                <Td>
                  <Skel className='size-20 rounded-xl' />
                </Td>
                <Td>
                  <Skel className='h-5 w-40 rounded-full' />
                </Td>
                <Td>
                  <Skel className='h-5 w-[28rem] rounded' />
                </Td>
                <Td>
                  <Skel className='h-6 w-16 rounded-md' />
                </Td>
                <Td>
                  <Skel className='h-5 w-40 rounded' />
                </Td>
                <Td>
                  <div className='flex gap-3'>
                    <Skel className='h-10 w-10 rounded-full' />
                    <Skel className='h-10 w-10 rounded-full' />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Skel({ className = '' }) {
  return <div className={`bg-slate-200/70 ${className}`} />;
}

function EmptyState({ onCreate }) {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center'>
      <div className='mx-auto mb-3 size-14 rounded-full bg-slate-100 grid place-items-center'>
        <Loader2 className='h-6 w-6 text-slate-400' />
      </div>
      <h3 className='text-lg font-semibold text-slate-900'>No plans found</h3>
      <p className='mt-1 max-w-md text-sm text-slate-600'>
        Create your first plan to kickstart your training routine.
      </p>
      <button
        onClick={onCreate}
        className='mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700'
      >
        <Plus size={18} /> Create Plan
      </button>
    </div>
  );
}
