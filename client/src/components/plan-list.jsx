import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
    plans,
    totalPages = 1,
    totalPlans,
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

    if (start > 1)
      pages.push(
        <PaginationItem key='start-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>
      );

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

    if (end < totalPages)
      pages.push(
        <PaginationItem key='end-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>
      );

    return pages;
  };

  const handleViewDetails = planId => {
    navigate(`/plans/plan-detail/${planId}`);
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Plan List</h1>
        <button
          onClick={handleCreatePlan}
          className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors'
        >
          <Plus size={18} /> Create Plan
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-12 text-gray-500'>
          <Loader2 className='animate-spin mr-2' /> Loading plans...
        </div>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : plans.length === 0 ? (
        <p>No plans found.</p>
      ) : (
        <div className='bg-white rounded-xl shadow-sm overflow-x-auto'>
          <table className='w-full border-collapse text-sm'>
            <thead className='bg-gray-900 text-white'>
              <tr>
                <th className='p-3 text-left'>#</th>
                <th className='p-3 text-left'>Image</th>
                <th className='p-3 text-left'>Title</th>
                <th className='p-3 text-left'>Description</th>
                <th className='p-3 text-left'>Is Public</th>
                <th className='p-3 text-left'>Created At</th>
                <th className='p-3 text-left'>Actions</th>
              </tr>
            </thead>

            <tbody>
              {plans.map((plan, index) => (
                <tr key={plan._id} className='hover:bg-gray-50'>
                  <td className='p-3 text-gray-500'>{index + 1}</td>

                  <td
                    className='p-3'
                    onClick={() => handleViewDetails(plan._id)}
                  >
                    <img
                      src={plan.image || logo}
                      alt={plan.title}
                      className='w-30 h-30 object-cover rounded-md'
                    />
                  </td>

                  <td className='p-3 font-medium text-blue-600'>
                    {plan.title}
                  </td>

                  <td className='p-3 text-gray-600'>{plan.description}</td>

                  <td className='p-3'>
                    {plan.isPublic ? (
                      <span className='bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium'>
                        Public
                      </span>
                    ) : (
                      <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium'>
                        Private
                      </span>
                    )}
                  </td>

                  <td className='p-3 text-gray-500'>
                    {new Date(plan.createdAt).toLocaleString('en-GB')}
                  </td>

                  <td className='flex-1'>
                    <button
                      onClick={() => handleEditPlan(plan._id)}
                      className='bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-full mr-3'
                      title='Edit Plan'
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className='bg-red-100 text-red-600 hover:bg-red-200 p-3 rounded-full'
                      title='Delete Plan'
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className='mt-4'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {renderPaginationNumbers()}
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className='text-center text-sm text-gray-500'>
        Page {page} of {totalPages} • Total {totalPlans} plans
      </div>
    </div>
  );
};

export default PlanList;
