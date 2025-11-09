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
    <div className='bg-white min-h-screen text-slate-900'>
      <header className='relative pt-36 pb-20 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200'>
        <div className='absolute inset-0 opacity-20 pointer-events-none'>
          <img
            src={currentPlan.image || logo}
            alt='Plan Background'
            className='w-full h-full object-cover'
          />
        </div>

        <div className='relative max-w-6xl mx-auto px-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8'>
          <div className='flex flex-col gap-4'>
            <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight'>
              {currentPlan.title}
            </h1>

            <p className='text-slate-600 max-w-xl leading-relaxed'>
              {currentPlan.description}
            </p>

            <div className='flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500'>
              <span>
                Owner:{' '}
                <b className='text-slate-700'>{currentPlan.user?.name}</b>
              </span>
              <span>
                Created:{' '}
                <b>{new Date(currentPlan.createdAt).toLocaleDateString()}</b>
              </span>
              <span>
                Updated:{' '}
                <b>{new Date(currentPlan.updatedAt).toLocaleDateString()}</b>
              </span>
            </div>

            <div className='mt-4 max-w-lg'>
              <div className='flex justify-between text-sm text-slate-600 mb-1'>
                <span>Progress</span>
                <span>{progressPct}%</span>
              </div>
              <div className='h-2 bg-slate-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-blue-600 rounded-full transition-all'
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/plans/edit-plan/${planId}`)}
            className='flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition'
          >
            <FaEdit className='text-sm' /> Edit Plan
          </button>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-6 py-10 space-y-10'>
        <button
          onClick={handleStartPlan}
          className='flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-emerald-700 transition'
        >
          <FaPlay className='text-sm' /> Start Plan
        </button>

        {currentPlan.workouts.map((workout, dayIndex) => {
          const doneAt = workoutDoneAt.get(workout._id);
          const isDone = Boolean(doneAt);

          return (
            <div
              key={workout._id}
              className={`rounded-2xl p-6 shadow-sm border transition hover:shadow-md ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/70'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className='flex items-center gap-3 mb-5'>
                <h2 className='text-xl font-semibold px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 inline-block'>
                  Day {dayIndex + 1}: {workout.title}
                </h2>

                {isDone && (
                  <span className='inline-flex items-center gap-2 text-sm rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 border border-emerald-200'>
                    <FaCheckCircle className='text-sm' />
                    Completed{' '}
                    {doneAt ? `• ${new Date(doneAt).toLocaleString()}` : ''}
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
                      className='flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition'
                    >
                      {/* Thumbnail */}
                      <button
                        type='button'
                        className='w-20 h-20 rounded-lg overflow-hidden bg-slate-200 ring-1 ring-slate-300'
                        onClick={() => openExercise(exId)}
                      >
                        {detail?.tutorial ? (
                          <img
                            src={detail.tutorial.replace(
                              '/upload/',
                              '/upload/f_jpg/so_0/'
                            )}
                            onMouseEnter={e =>
                              (e.currentTarget.src = detail.tutorial)
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.src = detail.tutorial.replace(
                                '/upload/',
                                '/upload/f_jpg/so_0/'
                              ))
                            }
                            className='w-full h-full object-cover'
                            alt={detail?.title}
                          />
                        ) : (
                          <FaDumbbell className='text-slate-500 text-xl m-auto' />
                        )}
                      </button>

                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold'>
                          {detail?.title || 'Loading...'}
                        </h3>

                        {detail && (
                          <>
                            <p className='text-sm text-slate-600'>
                              Difficulty: {detail.difficulty} • Type:{' '}
                              {detail.type}
                            </p>
                            <p className='text-xs text-slate-500 mt-1'>
                              Sets: {ex.sets.length} • Total Reps: {reps}
                            </p>

                            <div className='flex flex-wrap gap-1 mt-2'>
                              {detail.muscles?.map(m => (
                                <img
                                  key={m._id}
                                  src={m.image}
                                  alt={m.title}
                                  className='w-5 h-5 rounded-full border'
                                />
                              ))}
                              {detail.equipments?.map(eq => (
                                <img
                                  key={eq._id}
                                  src={eq.image}
                                  alt={eq.title}
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
