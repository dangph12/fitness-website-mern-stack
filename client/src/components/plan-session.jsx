import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaDumbbell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useStopwatch } from 'react-timer-hook';

import { fetchExerciseById } from '~/store/features/exercise-slice';
import { addHistory } from '~/store/features/history-slice';
import { fetchPlanById } from '~/store/features/plan-slice';

import logo from '../assets/logo.png';

const getExerciseId = exerciseField =>
  typeof exerciseField === 'string' ? exerciseField : exerciseField?._id;

const PlanSession = () => {
  const { planId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPlan, loading } = useSelector(state => state.plans);
  const { exercises } = useSelector(state => state.exercises);
  const userId = useSelector(state => state.auth.user.id);

  const [completedSets, setCompletedSets] = useState({});

  const { seconds, minutes, hours } = useStopwatch({ autoStart: true });

  useEffect(() => {
    if (planId) {
      dispatch(fetchPlanById(planId));
    }
  }, [dispatch, planId]);

  useEffect(() => {
    if (!currentPlan?.workouts) return;
    currentPlan.workouts.forEach(workout => {
      workout.exercises.forEach(exItem => {
        const id = getExerciseId(exItem.exercise);
        if (id && !exercises[id]) {
          dispatch(fetchExerciseById(id));
        }
      });
    });
  }, [currentPlan, dispatch, exercises]);

  const handleLogNextSet = (exerciseId, setIndex) => {
    if (!exerciseId) return;
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: { ...(prev[exerciseId] || {}), [setIndex]: true }
    }));
  };

  const handleFinishPlan = () => {
    const historyData = {
      user: userId,
      workout: currentPlan._id,
      plan: currentPlan._id,
      time: hours * 3600 + minutes * 60 + seconds
    };
    dispatch(addHistory(historyData));
    navigate('/');
  };

  const formatTime = () =>
    `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (loading || !currentPlan) {
    return (
      <div className='flex justify-center items-center h-screen text-gray-500'>
        Loading Plan...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-between'>
      <header className='flex justify-between items-center px-6 py-4 border-b sticky top-0 z-10 bg-white'>
        <div>
          <h2 className='text-2xl text-gray-600'>
            {currentPlan.title || 'Plan Session'}
          </h2>
          <p className='text-5xl font-bold text-black mt-1'>{formatTime()}</p>
        </div>

        <button
          onClick={handleFinishPlan}
          className='bg-black text-white px-5 py-2 rounded-full text-xl font-semibold'
        >
          FINISH PLAN
        </button>
      </header>

      <div className='flex justify-center mb-6'>
        <img
          src={currentPlan.image || logo}
          alt='Plan'
          className='w-full h-100 object-cover rounded-lg shadow-lg max-w-3xl'
        />
      </div>

      <main className='flex-1 overflow-y-auto px-4 pb-28'>
        <div className='mb-6 flex justify-between items-center'>
          <p className='text-sm text-gray-600'>
            Created by:{' '}
            <span className='font-semibold text-black'>
              {currentPlan.user?.name || 'Unknown'}
            </span>
          </p>
          <p className='text-sm text-gray-500'>
            Created on:{' '}
            <span className='font-medium text-gray-800'>
              {new Date(currentPlan.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>

        {currentPlan.workouts.map((workout, dayIndex) => (
          <div
            key={workout._id}
            className='mb-6 bg-white rounded-xl p-4 border border-gray-300 shadow-sm max-w-4xl mx-auto'
          >
            <div className='flex justify-between items-center mb-3'>
              <h3 className='font-semibold text-black'>
                Day {dayIndex + 1}: {workout.title}
              </h3>
            </div>

            {workout.exercises.map(exerciseItem => {
              const exerciseId = getExerciseId(exerciseItem.exercise);
              const detail = exercises[exerciseId];
              const sets = exerciseItem.sets || [];

              const doneCount = Object.values(
                completedSets[exerciseId] || {}
              ).filter(Boolean).length;

              return (
                <div
                  key={exerciseId || exerciseItem._id}
                  className='mb-4 rounded-lg bg-gray-50 border border-gray-300 shadow-sm p-4'
                >
                  <div className='flex items-start gap-4 mb-3'>
                    <div className='w-20 h-20 rounded-md overflow-hidden bg-gray-200'>
                      {detail?.tutorial ? (
                        <img
                          src={detail.tutorial}
                          alt={detail.title}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <FaDumbbell className='text-gray-500 text-xl m-4' />
                      )}
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-black'>
                        {detail?.title || 'Exercise'}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {doneCount}/{sets.length} Done
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    {sets.map((set, setIndex) => {
                      const isDone =
                        completedSets[exerciseId]?.[setIndex] || false;

                      const reps =
                        typeof set === 'object' && set !== null
                          ? (set.reps ?? set.count ?? 8)
                          : typeof set === 'number'
                            ? set
                            : 8;

                      return (
                        <div
                          key={setIndex}
                          className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all ${
                            isDone
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className='flex items-center gap-3'>
                            {isDone ? (
                              <FaCheckCircle className='text-white text-lg' />
                            ) : (
                              <div className='w-4 h-4 border-2 border-gray-400 rounded-full' />
                            )}
                            <span className='font-semibold'>
                              Set {setIndex + 1}
                            </span>
                          </div>

                          <div className='flex items-center gap-6 text-sm font-medium'>
                            <span>
                              {reps} <span className='text-xs'>REPS</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </main>

      <footer className='fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow-lg'>
        <button
          onClick={() => {
            for (const workout of currentPlan.workouts) {
              for (const ex of workout.exercises) {
                const exerciseId = getExerciseId(ex.exercise);
                const sets = ex.sets || [];
                const nextSetIndex = sets.findIndex(
                  (_, i) => !completedSets[exerciseId]?.[i]
                );
                if (nextSetIndex !== -1) {
                  handleLogNextSet(exerciseId, nextSetIndex);
                  return;
                }
              }
            }
          }}
          className='w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-blue-700 transition'
        >
          LOG NEXT SET
        </button>
      </footer>
    </div>
  );
};

export default PlanSession;
