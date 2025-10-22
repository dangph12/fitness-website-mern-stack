import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaDumbbell, FaEdit, FaPlay } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { fetchExerciseById } from '~/store/features/exercise-slice';
import { fetchHistoryByUser } from '~/store/features/history-slice';
import { fetchPlanById } from '~/store/features/plan-slice';

import logo from '../assets/logo.png';

const getExerciseId = exerciseField =>
  typeof exerciseField === 'string' ? exerciseField : exerciseField?._id;

const repsOf = set => {
  if (typeof set === 'number' || typeof set === 'string') {
    const n = parseInt(set, 10);
    return Number.isFinite(n) ? n : 0;
  }
  if (set && typeof set === 'object') {
    const n = Number(set.reps);
    Number(set.rep);
    Number(set.repeat);
    Number(set.count);
    Number(set.r);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const totalReps = sets =>
  Array.isArray(sets) ? sets.reduce((s, it) => s + repsOf(it), 0) : 0;

const PlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentPlan, loading, error } = useSelector(s => s.plans);
  const { history = [] } = useSelector(s => s.histories);
  const userId = useSelector(s => s.auth.user?.id);

  const [exerciseDetails, setExerciseDetails] = useState({});

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (planId) dispatch(fetchPlanById(planId));
  }, [dispatch, planId]);

  useEffect(() => {
    if (userId) dispatch(fetchHistoryByUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (!currentPlan?.workouts) return;
    currentPlan.workouts.forEach(w =>
      w?.exercises?.forEach(ex => {
        const id = getExerciseId(ex?.exercise);
        if (id && !exerciseDetails[id]) {
          dispatch(fetchExerciseById(id)).then(res => {
            const p = res?.payload;
            if (p?._id) setExerciseDetails(prev => ({ ...prev, [p._id]: p }));
          });
        }
      })
    );
  }, [currentPlan, dispatch, exerciseDetails]);

  const isPlanCompleted = useMemo(
    () => history.some(h => h.plan && h.plan._id === planId),
    [history, planId]
  );

  const workoutDoneAt = useMemo(() => {
    const map = new Map();
    for (const h of history) {
      const when = new Date(h.createdAt);
      if (h.workout && h.workout._id) {
        const id = h.workout._id;
        const prev = map.get(id);
        if (!prev || when > prev) map.set(id, when);
      }
      if (h.plan && h.plan._id === planId && Array.isArray(h.plan.workouts)) {
        for (const wkId of h.plan.workouts) {
          if (typeof wkId !== 'string') continue;
          const prev = map.get(wkId);
          if (!prev || when > prev) map.set(wkId, when);
        }
      }
    }
    return map;
  }, [history, planId]);

  const completedWorkoutsCount = useMemo(() => {
    if (!currentPlan?.workouts) return 0;
    return currentPlan.workouts.filter(w => workoutDoneAt.has(w._id)).length;
  }, [currentPlan, workoutDoneAt]);

  const totalWorkouts = currentPlan?.workouts?.length || 0;
  const progressPct =
    totalWorkouts > 0
      ? Math.round((completedWorkoutsCount / totalWorkouts) * 100)
      : 0;

  const handleStartPlan = () => navigate(`/plans/plan-session/${planId}`);

  const openExercise = exerciseId => navigate(`/exercise/${exerciseId}`);

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen text-gray-500'>
        Loading Plan...
      </div>
    );
  if (error)
    return (
      <div className='flex justify-center items-center h-screen text-red-600'>
        Error loading plan: {error}
      </div>
    );
  if (!currentPlan)
    return (
      <div className='flex justify-center items-center h-screen text-gray-500'>
        No plan found.
      </div>
    );

  return (
    <div className='bg-white min-h-screen text-black'>
      <header className='relative pt-40 pb-16 overflow-hidden bg-gray-100'>
        <div className='absolute inset-0 z-0 opacity-30'>
          <img
            src={currentPlan.image || logo}
            alt='Plan Background'
            className='w-full h-full object-cover'
          />
        </div>

        <div className='relative max-w-6xl mx-auto px-6 z-20 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3'>
              <h1 className='text-5xl font-extrabold text-gray-900 mb-2'>
                {currentPlan.title}
              </h1>
              {isPlanCompleted && (
                <span className='inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700 border border-green-200'>
                  <FaCheckCircle /> Completed
                </span>
              )}
            </div>

            <p className='text-gray-700 mb-2 mt-2'>
              Description:{' '}
              <span className='font-medium'>{currentPlan.description}</span>
            </p>

            <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600'>
              <p>
                Owner:{' '}
                <span className='font-medium'>{currentPlan.user?.name}</span>
              </p>
              <p>
                Created:{' '}
                <span className='font-medium'>
                  {new Date(currentPlan.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p>
                Updated:{' '}
                <span className='font-medium'>
                  {new Date(currentPlan.updatedAt).toLocaleDateString()}
                </span>
              </p>
            </div>

            <div className='mt-4 w-full max-w-xl'>
              <div className='flex items-center justify-between text-sm mb-1'>
                <span className='text-gray-700'>
                  Progress: <b>{completedWorkoutsCount}</b> /{' '}
                  <b>{totalWorkouts}</b> workouts
                </span>
                <span className='text-gray-600'>{progressPct}%</span>
              </div>
              <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-blue-600'
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate(`/plans/edit-plan/${planId}`)}
              className='flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
            >
              <FaEdit className='mr-2' /> Edit Plan
            </button>
          </div>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-6 py-10 space-y-10'>
        <button
          onClick={handleStartPlan}
          className='flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-all'
        >
          <FaPlay className='mr-4 text-sm' />
          Start Plan
        </button>

        {currentPlan.workouts.map((workout, dayIndex) => {
          const doneAt = workoutDoneAt.get(workout._id);
          const isDone = Boolean(doneAt);

          return (
            <div
              key={workout._id}
              className={`rounded-2xl border p-5 ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className='flex items-center gap-3 mb-4'>
                <h2 className='text-2xl font-semibold text-gray-900'>
                  Day {dayIndex + 1}: {workout.title}
                </h2>
                {isDone && (
                  <span className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-200 text-sm'>
                    <FaCheckCircle />
                    Completed
                    {doneAt ? ` • ${new Date(doneAt).toLocaleString()}` : ''}
                  </span>
                )}
              </div>

              <div className='space-y-4'>
                {workout?.exercises?.map(ex => {
                  const exId = getExerciseId(ex?.exercise);
                  const detail = exerciseDetails[exId];
                  const reps = totalReps(ex.sets);

                  return (
                    <div
                      key={ex?._id || exId}
                      className='flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm'
                    >
                      <button
                        type='button'
                        className='w-24 h-24 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer ring-1 ring-gray-200'
                        onClick={() => openExercise(exId)}
                        title='View exercise'
                      >
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
                            alt={detail?.title || 'Exercise'}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <FaDumbbell className='text-gray-600 text-xl' />
                        )}
                      </button>

                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-black'>
                          {detail?.title || 'Loading...'}
                        </h3>
                        {detail && (
                          <>
                            <p className='text-sm text-gray-600'>
                              Difficulty: {detail.difficulty} | Type:{' '}
                              {detail.type}
                            </p>
                            <p className='text-sm text-gray-500 mt-1'>
                              Sets: {ex.sets.length} • Total Reps: {reps}
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
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default PlanDetail;
