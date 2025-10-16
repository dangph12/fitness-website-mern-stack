import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FaDumbbell, FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { fetchExerciseById } from '~/store/features/exercise-slice';
import { fetchPlanById } from '~/store/features/plan-slice';

import logo from '../assets/logo.png';

const calculateTotalReps = sets => (sets ? sets.reduce((a, b) => a + b, 0) : 0);
const calculateTotalSets = sets => (sets ? sets.length : 0);

const PlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPlan, loading, error } = useSelector(state => state.plans);

  const [detailedExercises, setDetailedExercises] = useState([]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (planId) dispatch(fetchPlanById(planId));
  }, [dispatch, planId]);

  useEffect(() => {
    if (!currentPlan?.workouts) return;
    currentPlan.workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (!detailedExercises[ex.exercise]) {
          dispatch(fetchExerciseById(ex.exercise)).then(res => {
            setDetailedExercises(prev => ({
              ...prev,
              [ex.exercise]: res.payload
            }));
          });
        }
      });
    });
  }, [currentPlan, dispatch, detailedExercises]);

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

        <div className='relative max-w-6xl mx-auto px-6 z-20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
          <div>
            <h1 className='text-5xl font-extrabold text-gray-900 mb-2'>
              {currentPlan.title}
            </h1>
            <p className='text-gray-700 mb-4'>{currentPlan.description}</p>
            <div className='flex items-center space-x-4 text-sm text-gray-600'>
              <p>
                Owner:{' '}
                <span className='font-medium'>{currentPlan.user?.name}</span>
              </p>
              <p>
                Last updated:{' '}
                <span className='font-medium'>
                  {new Date(currentPlan.updatedAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/plans/edit-plan/${planId}`)}
            className='flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
          >
            <FaEdit className='mr-2' /> Edit Plan
          </button>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-6 py-10 space-y-10'>
        {currentPlan.workouts.map((workout, dayIndex) => (
          <div key={workout._id}>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2'>
              Day {dayIndex + 1}: {workout.title}
            </h2>

            <div className='space-y-4'>
              {workout?.exercises?.map(ex => {
                const detail = detailedExercises[ex.exercise];
                return (
                  <div
                    key={ex._id}
                    className='flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-300 shadow-sm'
                  >
                    <div className='w-24 h-24 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center'>
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
                        <FaDumbbell className='text-gray-600 text-xl' />
                      )}
                    </div>

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
                            Sets: {ex.sets.length} | Total Reps:{' '}
                            {calculateTotalReps(ex.sets)}
                          </p>
                          <div className='flex mt-1 space-x-1'>
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
        ))}
      </main>
    </div>
  );
};

export default PlanDetail;
