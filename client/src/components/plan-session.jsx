import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaDumbbell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useStopwatch } from 'react-timer-hook';
import { toast } from 'sonner';

import { fetchExerciseById } from '~/store/features/exercise-slice';
import { addHistory } from '~/store/features/history-slice';
import { fetchPlanById } from '~/store/features/plan-slice';

import logo from '../assets/logo.png';

const getExerciseId = exerciseField =>
  typeof exerciseField === 'string' ? exerciseField : exerciseField?._id;

const getSetLabel = set => {
  if (typeof set === 'number' || typeof set === 'string') {
    const reps = parseInt(set, 10);
    return Number.isFinite(reps) && reps > 0 ? `${reps} REPS` : '0 REPS';
  }
  if (set && typeof set === 'object') {
    const reps = Number(set.reps);
    Number(set.rep);
    Number(set.repeat);
    Number(set.count);
    Number(set.r);
    return Number.isFinite(reps) && reps > 0 ? `${reps} REPS` : '0 REPS';
  }
  return '0 REPS';
};

const PlanSession = () => {
  const { planId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPlan, loading } = useSelector(state => state.plans);
  const { exercises } = useSelector(state => state.exercises);
  const userId = useSelector(state => state.auth.user.id);

  const [completedSets, setCompletedSets] = useState({});
  const [detailedExercises, setDetailedExercises] = useState({});
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const { seconds, minutes, hours } = useStopwatch({ autoStart: true });

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (planId) dispatch(fetchPlanById(planId));
  }, [dispatch, planId]);

  useEffect(() => {
    if (!currentPlan?.workouts?.length) return;
    currentPlan.workouts.forEach(workout => {
      workout?.exercises?.forEach(ex => {
        const id = getExerciseId(ex?.exercise);
        if (id && !detailedExercises[id]) {
          dispatch(fetchExerciseById(id)).then(res => {
            const payload = res?.payload;
            if (payload?._id) {
              setDetailedExercises(prev => ({
                ...prev,
                [payload._id]: payload
              }));
            }
          });
        }
      });
    });
  }, [currentPlan, dispatch, detailedExercises]);

  const formatTime = () =>
    `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleFinishPlan = () => {
    const timeSec = hours * 3600 + minutes * 60 + seconds;
    const historyData = {
      user: userId,
      workout: currentPlan._id,
      plan: currentPlan._id,
      time: timeSec
    };
    dispatch(addHistory(historyData));
    toast.success('Great job! Your session has been saved.');
    navigate('/history');
  };

  const findNextIncompleteFrom = dayStart => {
    if (!currentPlan?.workouts?.length) return null;
    for (let d = dayStart; d < currentPlan.workouts.length; d++) {
      const workout = currentPlan.workouts[d];
      for (const ex of workout.exercises || []) {
        const exId = getExerciseId(ex.exercise);
        if (!exId) continue;
        const key = `${d}-${exId}`;
        const sets = ex.sets || [];
        const idx = sets.findIndex((_, i) => !completedSets[key]?.[i]);
        if (idx !== -1) return { dayIndex: d, exerciseId: exId, setIndex: idx };
      }
    }
    return null;
  };

  const findNextIncompleteInDay = dayIdx =>
    findNextIncompleteFrom(dayIdx)?.dayIndex === dayIdx
      ? findNextIncompleteFrom(dayIdx)
      : null;

  const markSet = ({ dayIndex, exerciseId, setIndex }) => {
    const key = `${dayIndex}-${exerciseId}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [setIndex]: true }
    }));
    toast.success(`Logged set ${setIndex + 1} • Day ${dayIndex + 1}`);
  };

  const logNextSet = () => {
    if (!currentPlan?.workouts?.length) return;

    const nextInDay = findNextIncompleteInDay(currentDayIndex);
    if (nextInDay) {
      markSet(nextInDay);
      return;
    }

    const nextAny = findNextIncompleteFrom(currentDayIndex + 1);
    if (nextAny) {
      toast.custom(t => (
        <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-md max-w-sm'>
          <p className='font-semibold text-slate-900'>Move to next day?</p>
          <p className='mt-1 text-sm text-slate-600'>
            You’ve finished Day {currentDayIndex + 1}. Continue to Day{' '}
            {nextAny.dayIndex + 1}?
          </p>
          <div className='mt-3 flex justify-end gap-2'>
            <button
              onClick={() => toast.dismiss(t)}
              className='rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50'
            >
              Stay
            </button>
            <button
              onClick={() => {
                setCurrentDayIndex(nextAny.dayIndex);
                markSet(nextAny);
                toast.dismiss(t);
              }}
              className='rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700'
            >
              Go next
            </button>
          </div>
        </div>
      ));
      return;
    }

    toast.success('All sets completed in this plan. Nice work!');
  };

  const doneCountMap = useMemo(() => {
    const m = {};
    for (const key of Object.keys(completedSets)) {
      m[key] = Object.values(completedSets[key] || {}).filter(Boolean).length;
    }
    return m;
  }, [completedSets]);

  if (loading || !currentPlan)
    return (
      <div className='flex justify-center items-center h-screen text-gray-500'>
        Loading Plan...
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <header className='flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10'>
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

      <div className='px-4 py-4'>
        <img
          src={currentPlan.image || logo}
          alt='Plan'
          className='w-full max-h-[360px] object-cover rounded-xl shadow-lg border border-slate-200'
          onError={e => {
            e.currentTarget.src = logo;
          }}
        />
      </div>

      <div className='px-4'>
        <div className='mb-4 flex flex-wrap gap-3 items-center justify-between max-w-4xl mx-auto'>
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
          <span className='text-xs rounded-full bg-blue-50 text-blue-700 px-3 py-1 border border-blue-200'>
            Current Day: <b>{currentDayIndex + 1}</b>
          </span>
        </div>
      </div>

      <main className='flex-1 overflow-y-auto px-4 pb-28 space-y-6'>
        {currentPlan.workouts.map((workout, dayIndex) => {
          const isCurrent = dayIndex === currentDayIndex;
          return (
            <div
              key={workout._id}
              className={`max-w-4xl mx-auto rounded-2xl border shadow-sm p-4 ${
                isCurrent
                  ? 'border-blue-400 ring-1 ring-blue-100 bg-white'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <h3 className='font-semibold text-black mb-3'>
                Day {dayIndex + 1}: {workout.title}
                {isCurrent && (
                  <span className='ml-2 text-xs rounded-full bg-blue-600 text-white px-2 py-0.5 align-middle'>
                    Now
                  </span>
                )}
              </h3>

              {workout.exercises.map(exItem => {
                const exerciseId = getExerciseId(exItem.exercise);
                const detail = detailedExercises[exerciseId];
                const sets = exItem.sets || [];

                const key = `${dayIndex}-${exerciseId}`;
                const doneCount = doneCountMap[key] || 0;

                return (
                  <div
                    key={exerciseId || exItem._id}
                    className='mb-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm p-4'
                  >
                    <div className='flex items-start gap-4 mb-3'>
                      <div className='w-20 h-20 rounded-md overflow-hidden bg-gray-200'>
                        {detail?.tutorial ? (
                          <img
                            src={
                              detail.tutorial.endsWith('.gif')
                                ? detail.tutorial.replace(
                                    '/upload/',
                                    '/upload/f_jpg/so_0/'
                                  )
                                : detail.tutorial
                            }
                            onMouseEnter={e =>
                              (e.currentTarget.src = detail.tutorial)
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.src = detail.tutorial.replace(
                                '/upload/',
                                '/upload/f_jpg/so_0/'
                              ))
                            }
                            alt={detail.title}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <FaDumbbell className='text-gray-500 text-xl m-4' />
                        )}
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-lg font-semibold text-black'>
                          {detail?.title || 'Loading...'}
                        </h4>
                        {detail && (
                          <>
                            <p className='text-sm text-gray-600'>
                              Difficulty: {detail.difficulty} | Type:{' '}
                              {detail.type}
                            </p>
                            <p className='text-sm text-gray-500 mt-1'>
                              Done: {doneCount} / {sets.length}
                            </p>
                            <div className='flex mt-1 flex-wrap gap-1'>
                              {detail.muscles?.map(m => (
                                <img
                                  key={m._id}
                                  src={m.image}
                                  alt={m.title}
                                  title={m.title}
                                  className='w-5 h-5 rounded-full border'
                                />
                              ))}
                              {detail.equipments?.map(eq => (
                                <img
                                  key={eq._id}
                                  src={eq.image}
                                  alt={eq.title}
                                  title={eq.title}
                                  className='w-5 h-5 rounded border'
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      {sets.map((set, idx) => {
                        const isDone = (completedSets[key] || {})[idx] || false;
                        const label = getSetLabel(set);
                        return (
                          <div
                            key={idx}
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
                                Set {idx + 1}
                              </span>
                            </div>
                            <span className='text-sm font-medium'>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>

      <footer className='fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow-lg'>
        <div className='max-w-4xl mx-auto flex flex-col sm:flex-row gap-3'>
          <button
            onClick={logNextSet}
            className='flex-1 bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-blue-700 transition'
          >
            LOG NEXT SET
          </button>

          <div className='flex items-center gap-2 justify-center'>
            <span className='text-sm text-slate-600'>Jump to day:</span>
            <select
              value={currentDayIndex}
              onChange={e => {
                const idx = Number(e.target.value);
                setCurrentDayIndex(idx);
                toast.info(`Switched to Day ${idx + 1}`);
              }}
              className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
            >
              {currentPlan.workouts.map((_, i) => (
                <option key={i} value={i}>
                  Day {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlanSession;
