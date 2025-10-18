import { Activity, Clock, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import {
  fetchHistoryByUser,
  removeHistory
} from '~/store/features/history-slice';

import logo from '../assets/logo.png';

const fmtDateTime = d =>
  new Date(d).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

const HistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.user?.id);
  const {
    history = [],
    loading,
    error
  } = useSelector(state => state.histories);

  useEffect(() => {
    if (userId) dispatch(fetchHistoryByUser(userId));
  }, [dispatch, userId]);

  const handleRemove = historyId => {
    if (
      window.confirm('Are you sure you want to remove this history record?')
    ) {
      dispatch(removeHistory(historyId));
      toast.success('Delete history successful!');
    }
  };

  const workoutHistory = (history || []).filter(h => h.workout);
  const planHistory = (history || []).filter(h => h.plan);

  if (loading) {
    return (
      <div className='max-w-6xl mx-auto p-6'>
        <div className='mb-8'>
          <div className='h-8 w-48 bg-slate-200 rounded animate-pulse' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='rounded-2xl border border-slate-200 overflow-hidden'
            >
              <div className='h-40 bg-slate-200 animate-pulse' />
              <div className='p-4 space-y-3'>
                <div className='h-5 bg-slate-200 rounded animate-pulse w-2/3' />
                <div className='h-4 bg-slate-200 rounded animate-pulse w-1/3' />
                <div className='h-10 bg-slate-200 rounded animate-pulse' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-6xl mx-auto p-6'>
        <div className='rounded-xl bg-red-50 border border-red-200 p-4 text-red-700'>
          Error loading history: {error}
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-10'>
      {/* Workout History */}
      <section>
        <div className='mb-5 flex items-end justify-between'>
          <h2 className='text-2xl font-semibold'>
            Workout History
            <span className='ml-2 align-middle text-sm text-slate-500'>
              ({workoutHistory.length})
            </span>
          </h2>
        </div>

        {workoutHistory.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-300 p-10 text-center'>
            <p className='text-slate-600'>No workout history found.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {workoutHistory.map(h => (
              <div
                key={h._id}
                className='group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition'
              >
                <button
                  type='button'
                  className='block w-full'
                  onClick={() =>
                    navigate(`/workouts/workout-detail/${h.workout._id}`)
                  }
                  title='View workout'
                >
                  {h.workout.image ? (
                    <img
                      src={h.workout.image}
                      alt={h.workout.title}
                      className='w-full h-40 object-cover'
                      onError={e => {
                        e.currentTarget.src = logo;
                      }}
                    />
                  ) : (
                    <div className='w-full h-40 bg-slate-100 grid place-items-center'>
                      <img
                        src={logo}
                        alt='default'
                        className='w-12 h-12 opacity-70'
                      />
                    </div>
                  )}
                </button>

                <div className='p-4'>
                  <h3
                    onClick={() =>
                      navigate(`/workouts/workout-detail/${h.workout._id}`)
                    }
                    className='text-lg font-semibold text-slate-900 line-clamp-1 cursor-pointer hover:underline'
                    title={h.workout.title}
                  >
                    {h.workout.title}
                  </h3>

                  <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700'>
                      <Clock className='size-3.5' /> {h.time} min
                    </span>
                    <span className='inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700'>
                      <Activity className='size-3.5' />{' '}
                      {fmtDateTime(h.createdAt)}
                    </span>
                  </div>

                  <div className='mt-4 flex justify-end'>
                    <button
                      onClick={() => handleRemove(h._id)}
                      className='inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-100 transition'
                      title='Remove from history'
                    >
                      <Trash2 className='size-4' /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Plan History */}
      <section>
        <div className='mb-5 flex items-end justify-between'>
          <h2 className='text-2xl font-semibold'>
            Plan History
            <span className='ml-2 align-middle text-sm text-slate-500'>
              ({planHistory.length})
            </span>
          </h2>
        </div>

        {planHistory.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-300 p-10 text-center'>
            <p className='text-slate-600'>No plan history found.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {planHistory.map(h => (
              <div
                key={h._id}
                className='group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition'
              >
                <button
                  type='button'
                  className='block w-full'
                  onClick={() => navigate(`/plans/plan-detail/${h.plan._id}`)}
                  title='View plan'
                >
                  <img
                    src={h.plan.image || logo}
                    alt={h.plan.title}
                    className='w-full h-40 object-cover'
                    onError={e => {
                      e.currentTarget.src = logo;
                    }}
                  />
                </button>

                <div className='p-4'>
                  <h3
                    onClick={() => navigate(`/plans/plan-detail/${h.plan._id}`)}
                    className='text-lg font-semibold text-slate-900 line-clamp-1 cursor-pointer hover:underline'
                    title={h.plan.title}
                  >
                    {h.plan.title}
                  </h3>

                  {h.plan.description && (
                    <p className='mt-1 text-sm text-slate-600 line-clamp-2'>
                      {h.plan.description}
                    </p>
                  )}

                  <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700'>
                      <Clock className='size-3.5' /> {fmtDateTime(h.createdAt)}
                    </span>
                    <span className='inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700'>
                      Duration: {h.time} min
                    </span>
                  </div>

                  <div className='mt-4 flex justify-end'>
                    <button
                      onClick={() => handleRemove(h._id)}
                      className='inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-100 transition'
                      title='Remove from history'
                    >
                      <Trash2 className='size-4' /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HistoryPage;
