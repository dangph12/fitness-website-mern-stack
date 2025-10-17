import { Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import {
  fetchHistoryByUser,
  removeHistory
} from '~/store/features/history-slice';

import logo from '../assets/logo.png';

const HistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.user?.id);
  const { history, loading, error } = useSelector(state => state.histories);

  useEffect(() => {
    if (userId) {
      dispatch(fetchHistoryByUser(userId));
    }
  }, [dispatch, userId]);

  const handleRemove = historyId => {
    if (
      window.confirm('Are you sure you want to remove this history record?')
    ) {
      toast.success('Delete history successful !');
      dispatch(removeHistory(historyId));
    }
  };

  const workoutHistory = history.filter(h => h.workout !== null);
  const planHistory = history.filter(h => h.plan !== null);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen text-gray-500'>
        Loading history...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen text-red-600'>
        Error loading history: {error}
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <section className='mb-10'>
        <h2 className='text-2xl font-semibold mb-4'>Workout History</h2>
        {workoutHistory.length === 0 ? (
          <p className='text-gray-500'>No workout history found.</p>
        ) : (
          <div className='space-y-4'>
            {workoutHistory.map(h => (
              <div
                key={h._id}
                className='flex justify-between items-center p-4 bg-gray-50 border rounded-lg shadow-sm'
              >
                <div className='flex items-center gap-4'>
                  <div
                    className='w-20 h-20 cursor-pointer'
                    onClick={() =>
                      navigate(`/workouts/workout-detail/${h.workout._id}`)
                    }
                  >
                    {h.workout.image ? (
                      <img
                        src={h.workout.image}
                        alt={h.workout.title}
                        className='w-20 h-20 object-cover rounded-md'
                      />
                    ) : (
                      <div className='w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md'>
                        <img src={logo} alt='default' className='w-12 h-12' />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold'>{h.workout.title}</h3>
                    <p className='text-gray-600'>
                      Duration: {h.time} min | Completed At:{' '}
                      {new Date(h.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(h._id)}
                  className='text-red-500 hover:text-red-700'
                  title='Remove from history'
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className='text-2xl font-semibold mb-4'>Plan History</h2>
        {planHistory.length === 0 ? (
          <p className='text-gray-500'>No plan history found.</p>
        ) : (
          <div className='space-y-4'>
            {planHistory.map(h => (
              <div
                key={h._id}
                className='flex justify-between items-center p-4 bg-gray-50 border rounded-lg shadow-sm'
              >
                <div className='flex items-center gap-4'>
                  <div
                    className='w-20 h-20 cursor-pointer'
                    onClick={() => navigate(`/plans/plan-detail/${h.plan._id}`)}
                  >
                    <img
                      src={h.plan.image || logo}
                      alt={h.plan.title}
                      className='w-20 h-20 object-cover rounded-md'
                    />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold'>{h.plan.title}</h3>
                    <p className='text-gray-600'>{h.plan.description}</p>
                    <p className='text-gray-500 text-sm'>
                      Completed At: {new Date(h.createdAt).toLocaleString()} |
                      Duration: {h.time} min
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(h._id)}
                  className='text-red-500 hover:text-red-700'
                  title='Remove from history'
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HistoryPage;
