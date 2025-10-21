import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useStopwatch } from 'react-timer-hook';

import { addHistory } from '~/store/features/history-slice';
import { fetchWorkoutById } from '~/store/features/workout-slice';

import logo from '../assets/logo.png';

const WorkoutSession = () => {
  const { workoutId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentWorkout, loading } = useSelector(state => state.workouts);
  const userId = useSelector(state => state.auth.user.id);

  const [completedSets, setCompletedSets] = useState({});

  const { seconds, minutes, hours } = useStopwatch({ autoStart: true });

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (workoutId) dispatch(fetchWorkoutById(workoutId));
  }, [dispatch, workoutId]);

  const handleLogNextSet = (exerciseId, setIndex) => {
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: { ...(prev[exerciseId] || {}), [setIndex]: true }
    }));
  };

  const handleFinishWorkout = () => {
    if (!currentWorkout) return;
    const historyData = {
      user: userId,
      workout: currentWorkout._id,
      plan: '',
      time: hours * 3600 + minutes * 60 + seconds
    };
    dispatch(addHistory(historyData));
    navigate('/history');
  };

  const formatTime = () =>
    `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (loading || !currentWorkout) {
    return (
      <div className='flex justify-center items-center h-screen text-gray-500'>
        Loading workout...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <header className='sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white px-6 py-4'>
        <div>
          <h2 className='text-2xl text-gray-600'>
            {currentWorkout.title || 'Workout Session'}
          </h2>
          <p className='mt-1 text-5xl font-bold text-black'>{formatTime()}</p>
        </div>

        <button
          onClick={handleFinishWorkout}
          className='rounded-full bg-black px-5 py-2 text-xl font-semibold text-white hover:bg-black/90'
        >
          FINISH WORKOUT
        </button>
      </header>

      <div className='px-4 py-4'>
        <img
          src={currentWorkout.image || logo}
          alt='Workout'
          className='w-full max-h-[360px] rounded-xl border border-slate-200 object-cover shadow-lg'
          onError={e => {
            e.currentTarget.src = logo;
          }}
        />
      </div>

      <div className='px-4'>
        <div className='mx-auto mb-4 flex max-w-4xl flex-wrap items-center justify-between gap-3'>
          <p className='text-sm text-gray-600'>
            Created by:{' '}
            <span className='font-semibold text-black'>
              {currentWorkout.user?.name || 'Unknown'}
            </span>
          </p>
          <p className='text-sm text-gray-500'>
            Created on:{' '}
            <span className='font-medium text-gray-800'>
              {new Date(currentWorkout.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>

      <main className='flex-1 space-y-6 px-4 pb-28'>
        {currentWorkout.exercises.map((exItem, idx) => {
          const ex = exItem.exercise;
          const sets = Array.isArray(exItem.sets) ? exItem.sets : [];
          const doneCount = Object.values(completedSets[ex._id] || {}).filter(
            Boolean
          ).length;

          return (
            <div
              key={ex._id || idx}
              className='mx-auto mb-6 max-w-4xl rounded-xl border border-gray-300 bg-white p-4 shadow-sm'
            >
              <div className='mb-3 flex items-center gap-3'>
                {ex.tutorial ? (
                  <img
                    src={
                      ex.tutorial.endsWith('.gif')
                        ? ex.tutorial.replace('/upload/', '/upload/f_jpg/so_0/')
                        : ex.tutorial
                    }
                    onMouseEnter={e => (e.currentTarget.src = ex.tutorial)}
                    onMouseLeave={e =>
                      (e.currentTarget.src = ex.tutorial.replace(
                        '/upload/',
                        '/upload/f_jpg/so_0/'
                      ))
                    }
                    alt={ex.title}
                    className='h-20 w-20 rounded-lg border object-cover'
                  />
                ) : (
                  <div className='h-14 w-14 rounded-md bg-gray-200' />
                )}

                <div>
                  <h3 className='font-semibold text-black'>
                    {ex.title || 'Unnamed Exercise'}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {doneCount}/{sets.length} Done
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                {sets.map((set, setIndex) => {
                  const isDone = completedSets[ex._id]?.[setIndex];
                  return (
                    <div
                      key={setIndex}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                        isDone
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        {isDone ? (
                          <FaCheckCircle className='text-lg' />
                        ) : (
                          <div className='h-4 w-4 rounded-full border-2 border-gray-400' />
                        )}
                        <span className='font-semibold'>
                          Set {setIndex + 1}
                        </span>
                      </div>
                      <span className='text-sm font-medium'>
                        {Number(set) || 8} <span className='text-xs'>REPS</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className='mt-2 cursor-pointer text-center text-sm text-gray-500 hover:text-gray-700'>
                + Add a set
              </div>
            </div>
          );
        })}
      </main>

      <footer className='fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 shadow-lg'>
        <button
          onClick={() => {
            const next = currentWorkout.exercises.find(ex =>
              ex.sets.some((_, i) => !completedSets[ex.exercise._id]?.[i])
            );
            if (!next) return;
            const nextExId = next.exercise._id;
            const nextSetIndex = next.sets.findIndex(
              (_, i) => !completedSets[nextExId]?.[i]
            );
            handleLogNextSet(nextExId, nextSetIndex);
          }}
          className='w-full rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700'
        >
          LOG NEXT SET
        </button>
      </footer>
    </div>
  );
};

export default WorkoutSession;
