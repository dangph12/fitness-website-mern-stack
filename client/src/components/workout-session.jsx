import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useStopwatch } from 'react-timer-hook';

import { fetchWorkoutById } from '~/store/features/workout-slice';

import logo from '../assets/logo.png';

const WorkoutSession = () => {
  const { workoutId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentWorkout, loading } = useSelector(state => state.workouts);

  const [completedSets, setCompletedSets] = useState({});

  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: true
  });

  useEffect(() => {
    if (workoutId) dispatch(fetchWorkoutById(workoutId));
  }, [dispatch, workoutId]);

  const handleLogNextSet = (exerciseId, setIndex) => {
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: { ...(prev[exerciseId] || {}), [setIndex]: true }
    }));
  };

  if (loading || !currentWorkout) {
    return (
      <div className='flex justify-center items-center h-screen text-gray-500'>
        Loading workout...
      </div>
    );
  }

  const formatTime = () => {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-between'>
      <header className='flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10'>
        <div>
          <h2 className='text-sm text-gray-600'>
            {currentWorkout.title || 'Workout Session'}
          </h2>
          <p className='text-5xl font-bold text-black mt-1'>{formatTime()}</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className='bg-black text-white px-4 py-2 rounded-full text-sm font-semibold'
        >
          FINISH
        </button>
      </header>

      <div className='flex justify-center mb-6'>
        <img
          src={currentWorkout.image || logo}
          alt='Workout'
          className='w-full h-48 object-cover rounded-lg shadow-lg'
        />
      </div>

      <main className='flex-1 overflow-y-auto px-4 pb-28'>
        <div className='mb-6 flex justify-between items-center'>
          <p className='text-sm text-gray-600'>
            Created by:{' '}
            <span className='font-semibold text-black'>
              {currentWorkout.user.name}
            </span>
          </p>
          <p className='text-sm text-gray-500'>
            Created on:{' '}
            <span className='font-medium text-gray-800'>
              {new Date(currentWorkout.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>

        {currentWorkout.exercises.map((exItem, idx) => {
          const ex = exItem.exercise;
          const sets = exItem.sets || [];
          const doneCount = Object.keys(completedSets[ex._id] || {}).length;

          return (
            <div
              key={ex._id || idx}
              className='mb-6 bg-white rounded-xl p-4 border border-gray-300 shadow-sm max-w-4xl mx-auto'
            >
              <div className='flex justify-between items-center mb-3'>
                <div className='flex items-center gap-3'>
                  {ex.tutorial ? (
                    <img
                      src={ex.tutorial}
                      alt={ex.title}
                      className='w-14 h-14 rounded-lg object-cover border'
                    />
                  ) : (
                    <div className='w-14 h-14 bg-gray-200 rounded-md' />
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
              </div>

              <div className='space-y-2'>
                {sets.map((set, setIndex) => {
                  const isDone = completedSets[ex._id]?.[setIndex];
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
                          {set || 8} <span className='text-xs'>REPS</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className='text-center mt-2 text-gray-500 text-sm hover:text-gray-700 cursor-pointer'>
                + Add a set
              </div>
            </div>
          );
        })}
      </main>

      <footer className='fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow-lg'>
        <button
          onClick={() => {
            const next = currentWorkout.exercises.find(ex =>
              ex.sets.some((_, i) => !completedSets[ex.exercise._id]?.[i])
            );
            if (!next) return;
            const nextEx = next.exercise._id;
            const nextSetIndex = next.sets.findIndex(
              (_, i) => !completedSets[nextEx]?.[i]
            );
            handleLogNextSet(nextEx, nextSetIndex);
          }}
          className='w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-blue-700 transition'
        >
          LOG NEXT SET
        </button>
      </footer>
    </div>
  );
};

export default WorkoutSession;
