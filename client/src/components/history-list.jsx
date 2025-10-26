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
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

const fmtDuration = sec => {
  if (!sec || sec <= 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

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

  const handleRemove = async historyId => {
    const filtered = history.filter(h => h._id !== historyId);
    dispatch({ type: 'histories/setHistory', payload: filtered });

    try {
      await dispatch(removeHistory(historyId)).unwrap();
      toast.success('History removed');
    } catch {
      toast.error('Failed. Restoring...');
      dispatch(fetchHistoryByUser(userId));
    }
  };

  const workoutHistory = Object.values(
    history
      .filter(h => h.workout?.id || h.workout?._id)
      .reduce((acc, h) => {
        const id = h.workout._id || h.workout.id;
        if (!acc[id] || new Date(h.createdAt) > new Date(acc[id].createdAt)) {
          acc[id] = h;
        }
        return acc;
      }, {})
  );

  const planHistory = Object.values(
    history
      .filter(h => h.plan?.id || h.plan?._id)
      .reduce((acc, h) => {
        const id = h.plan._id || h.plan.id;
        if (!acc[id] || new Date(h.createdAt) > new Date(acc[id].createdAt)) {
          acc[id] = h;
        }
        return acc;
      }, {})
  );

  if (loading)
    return (
      <div className='p-10 text-center text-slate-500'>
        Loading workout history...
      </div>
    );

  if (error)
    return (
      <div className='p-10 text-center text-red-600'>
        Error loading history: {error}
      </div>
    );

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-12'>
      <section>
        <div className='mb-4'>
          <h2 className='flex items-center gap-2 text-xl font-medium text-slate-800 tracking-tight'>
            <Activity className='w-5 h-5 text-indigo-500' />
            Workout History
            <span className='text-sm text-slate-500'>
              ({workoutHistory.length})
            </span>
          </h2>
          <p className='text-sm text-slate-500 tracking-wide'>
            Your recent completed workout sessions
          </p>
        </div>

        {workoutHistory.length === 0 ? (
          <div className='rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-600 text-sm'>
            No workout history yet.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-3'>
            {workoutHistory.map(h => (
              <div
                key={h._id}
                className='group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden'
              >
                <button
                  className='block w-full'
                  onClick={() =>
                    navigate(`/workouts/workout-detail/${h.workout._id}`)
                  }
                >
                  <img
                    src={h.workout.image || logo}
                    alt={h.workout.title}
                    className='w-full h-44 object-cover group-hover:scale-[1.03] transition duration-300'
                    onError={e => (e.currentTarget.src = logo)}
                  />
                </button>

                <div className='p-5 space-y-3'>
                  <h3
                    onClick={() =>
                      navigate(`/workouts/workout-detail/${h.workout._id}`)
                    }
                    className='text-lg font-medium text-slate-900 cursor-pointer hover:text-indigo-600 transition line-clamp-1'
                  >
                    {h.workout.title}
                  </h3>

                  <div className='flex justify-between text-sm text-slate-600'>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-4 h-4 text-slate-500' />
                      {fmtDuration(h.time)}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Activity className='w-4 h-4 text-slate-500' />
                      {fmtDateTime(h.createdAt)}
                    </span>
                  </div>

                  <div className='pt-2 border-t border-slate-200 flex justify-end'>
                    <button
                      onClick={() => handleRemove(h._id)}
                      className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 text-sm transition'
                    >
                      <Trash2 className='w-4 h-4' /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className='mb-4'>
          <h2 className='flex items-center gap-2 text-xl font-medium text-slate-800 tracking-tight'>
            <Clock className='w-5 h-5 text-teal-500' />
            Plan History
            <span className='text-sm text-slate-500'>
              ({planHistory.length})
            </span>
          </h2>
          <p className='text-sm text-slate-500 tracking-wide'>
            Training plans you've followed recently
          </p>
        </div>

        {planHistory.length === 0 ? (
          <div className='rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-600 text-sm'>
            No plan history yet.
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-3'>
            {planHistory.map(h => (
              <div
                key={h._id}
                className='group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden'
              >
                <button
                  className='block w-full'
                  onClick={() => navigate(`/plans/plan-detail/${h.plan._id}`)}
                >
                  <img
                    src={h.plan.image || logo}
                    alt={h.plan.title}
                    className='w-full h-44 object-cover group-hover:scale-[1.03] transition duration-300'
                    onError={e => (e.currentTarget.src = logo)}
                  />
                </button>

                <div className='p-5 space-y-3'>
                  <h3
                    onClick={() => navigate(`/plans/plan-detail/${h.plan._id}`)}
                    className='text-lg font-medium text-slate-900 cursor-pointer hover:text-indigo-600 transition line-clamp-1'
                  >
                    {h.plan.title}
                  </h3>

                  <span className='flex items-center gap-1 text-sm text-slate-600'>
                    <Activity className='w-4 h-4 text-slate-500' />
                    {fmtDateTime(h.createdAt)}
                  </span>

                  <span className='inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 w-fit'>
                    <Clock className='w-3 h-3' />
                    {fmtDuration(h.time)}
                  </span>

                  <div className='pt-2 border-t border-slate-200 flex justify-end'>
                    <button
                      onClick={() => handleRemove(h._id)}
                      className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 text-sm transition'
                    >
                      <Trash2 className='w-4 h-4' /> Remove
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
