import React, { useEffect } from 'react';
import { FaCheckCircle, FaDumbbell, FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { fetchWorkoutById } from '~/store/features/workout-slice';

import logo from '../assets/logo.png';

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')}/${String(
    date.getMonth() + 1
  ).padStart(2, '0')}/${date.getFullYear()}`;
};

const calculateTotalReps = sets => {
  if (!sets || sets.length === 0) return 0;
  return sets.reduce((acc, cur) => acc + cur, 0);
};

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentWorkout, loading, error } = useSelector(
    state => state.workouts
  );

  useEffect(() => {
    dispatch(fetchWorkoutById(workoutId));
  }, [dispatch, workoutId]);

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100 text-gray-500'>
        Loading Workout Details...
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100 text-red-600'>
        Error loading workout: {error}
      </div>
    );

  if (!currentWorkout)
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100 text-gray-500'>
        No workout found.
      </div>
    );

  const handleTutorialClick = exerciseId => {
    navigate(`/exercise/${exerciseId}`);
  };

  const exercises = currentWorkout?.exercises || [];

  const ExerciseRow = ({ exerciseItem }) => {
    const { exercise, sets } = exerciseItem;
    return (
      <div
        className='flex items-center justify-between p-4 rounded-lg bg-white hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer border border-gray-300 shadow-sm'
        onClick={() => handleTutorialClick(exercise._id)}
      >
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 rounded-md overflow-hidden bg-gray-200'>
            {exercise.tutorial ? (
              <img
                src={exercise.tutorial}
                alt={exercise.title}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <FaDumbbell className='text-gray-500 text-xl' />
              </div>
            )}
          </div>

          <div>
            <h4 className='text-black font-semibold'>{exercise.title}</h4>
            <p className='text-sm text-gray-600'>
              Difficulty: {exercise.difficulty || 'Unknown'}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2 text-sm text-gray-700'>
          <FaCheckCircle className='text-green-500' />
          <p>
            {sets.length} Sets — Total Reps: {calculateTotalReps(sets)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className='bg-white text-black min-h-screen'>
      <header className='relative pt-40 pb-16 overflow-hidden bg-gray-100'>
        <div className='absolute inset-0 z-0 opacity-30'>
          <img
            src={currentWorkout.image || logo}
            alt='Workout Background'
            className='w-full h-full object-cover'
          />
        </div>

        <div className='relative max-w-6xl mx-auto px-6 z-20'>
          <h1 className='text-5xl font-extrabold text-gray-900 mb-2'>
            {currentWorkout.title}
          </h1>

          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4'>
            <div className='flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-600'>
              <p>
                Routine by:{' '}
                <span className='font-medium'>
                  {currentWorkout.user?.name || 'Unknown'}
                </span>
              </p>
              <p>
                Last updated:{' '}
                <span className='font-medium'>
                  {formatDate(currentWorkout.updatedAt)}
                </span>
              </p>
            </div>

            <div className='flex justify-center sm:justify-end'>
              <button className='flex items-center bg-transparent border border-gray-400 hover:border-blue-500 hover:text-blue-600 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-200 mb-20'>
                <FaEdit className='mr-2' />
                Edit Routine
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-6 py-10'>
        <h2 className='text-2xl font-semibold text-gray-900 mb-6 p-4 border-b border-gray-300'>
          Routine detail
        </h2>

        <div className='bg-gray-50 p-6 rounded-xl border border-gray-300 shadow-md'>
          <div className='flex justify-between items-center pb-4 border-b border-gray-300 mb-4'>
            <h3 className='text-lg font-semibold text-gray-800'>
              Workout Plan
            </h3>
            <p className='text-gray-500 text-sm'>
              {exercises.length}{' '}
              {exercises.length === 1 ? 'exercise' : 'exercises'}
            </p>
          </div>

          <div className='space-y-4'>
            {exercises.map(exerciseItem => (
              <ExerciseRow
                key={exerciseItem.exercise._id}
                exerciseItem={exerciseItem}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutDetail;
