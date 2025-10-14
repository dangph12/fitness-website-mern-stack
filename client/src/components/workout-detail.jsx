import React, { useEffect } from 'react';
import { FaCheckCircle, FaDumbbell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { fetchWorkoutById } from '~/store/features/workout-slice';

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

  if (loading) {
    return <div className='text-center text-gray-600'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>;
  }

  const formatDate = dateString => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  const calculateTotalReps = sets => {
    if (!sets || sets.length === 0) return 0;
    const totalSets = sets.reduce((acc, set) => acc + set, 0);
    const reps = sets[0];
    return totalSets * reps;
  };

  const handleTutorialClick = exerciseId => {
    navigate(`/exercise/${exerciseId}`);
  };

  return (
    <div className='bg-gray-900 text-white min-h-screen'>
      <div className='max-w-4xl mx-auto p-8 space-y-6'>
        <div className='flex items-center justify-between space-x-6'>
          <div>
            <h2 className='text-3xl font-bold'>{currentWorkout?.title}</h2>
            <p className='text-sm text-gray-400'>
              {currentWorkout?.description}
            </p>
            <p className='text-sm text-gray-400 mt-5'>
              Created by: {currentWorkout?.user?.name || 'Unknown'}
            </p>
            <p className='text-sm text-gray-400 mt-5'>
              {formatDate(currentWorkout?.createdAt)}{' '}
            </p>
          </div>
          <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'>
            Edit Routine
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto bg-white text-black p-8 shadow-lg rounded-lg space-y-6'>
        <h3 className='text-2xl font-semibold'>Exercises</h3>
        {currentWorkout?.exercises?.map((exercise, index) => (
          <div
            key={exercise._id}
            className='flex items-center space-x-6 p-4 border-b hover:bg-gray-50'
          >
            <div
              className='w-30 h-30 bg-gray-200 rounded-lg overflow-hidden cursor-pointer'
              onClick={() => handleTutorialClick(exercise.exercise._id)}
            >
              {exercise.exercise.tutorial && (
                <img
                  src={exercise.exercise.tutorial}
                  alt={exercise.exercise.title}
                  className='w-full h-full object-cover'
                />
              )}
            </div>

            <div className='flex-1'>
              <h4 className='text-l font-medium'>{exercise.exercise.title}</h4>
              <div className='mt-10 flex items-center space-x-4'>
                <span className='inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full'>
                  <FaCheckCircle className='mr-2' />
                  {`Sets: ${exercise.sets.join(', ')}`}
                </span>

                <span className='inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full'>
                  <FaDumbbell className='mr-2' />
                  {`Reps: ${calculateTotalReps(exercise.sets)}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutDetail;
