import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { fetchExercises } from '~/store/features/exercise-slice'; // Redux action for fetching exercises

import { ScrollArea } from './ui/scroll-area';

const ExerciseLibrary = ({ handleAddExercise }) => {
  const dispatch = useDispatch();
  const { exercises, loading, error } = useSelector(state => state.exercises);

  useEffect(() => {
    dispatch(fetchExercises({ page: 1, limit: 100 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='loader'>Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-500'>{error}</div>;
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h3 className='text-xl font-semibold mb-4'>Exercise Library</h3>

      {/* Filter options */}
      <div className='flex justify-between mb-4'>
        <div className='flex items-center'>
          <button className='text-gray-700 px-4 py-2 border rounded-md mr-2'>
            Any Muscle
          </button>
          <button className='text-gray-700 px-4 py-2 border rounded-md'>
            All Equipment
          </button>
        </div>
        <div>
          <input
            type='text'
            placeholder='Search exercise name'
            className='p-2 border rounded-md'
          />
        </div>
      </div>

      {/* Exercise list with scrollable container */}
      <ScrollArea className='max-h-96 overflow-y-auto'>
        <div className='space-y-4'>
          {exercises.map(exercise => (
            <div
              key={exercise._id}
              className='flex items-center justify-between bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition duration-300'
            >
              <div className='flex items-center space-x-4'>
                {/* Exercise Image */}
                <img
                  src={exercise.tutorial}
                  alt={exercise.title}
                  className='w-16 h-16 object-cover rounded-md'
                />
                {/* Exercise Title */}
                <div className='text-left'>
                  <h4 className='font-medium text-gray-800'>
                    {exercise.title}
                  </h4>
                  <p className='text-sm text-gray-600'>{exercise.difficulty}</p>
                  <p className='text-sm text-gray-600'>{exercise.type}</p>
                </div>
              </div>

              {/* Add Exercise Button */}
              <button
                onClick={() => handleAddExercise(exercise)}
                className='bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center'
              >
                <FaPlus className='mr-2' />
                Add Exercise
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExerciseLibrary;
