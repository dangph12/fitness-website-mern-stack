import React, { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { fetchExercises } from '~/store/features/exercise-slice';

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
    <div className=''>
      <h3 className='text-xl font-semibold mb-4'>Exercise Library</h3>

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

      <ScrollArea className='max-h-full overflow-y-auto'>
        <div className='space-y-4'>
          {exercises.map(exercise => (
            <div
              key={exercise._id}
              className='flex items-center justify-between bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition duration-300'
            >
              <div className='flex items-center space-x-4'>
                <img
                  src={
                    exercise.tutorial.endsWith('.gif')
                      ? exercise.tutorial.replace(
                          '/upload/',
                          '/upload/f_jpg/so_0/'
                        )
                      : exercise.tutorial
                  }
                  onMouseEnter={e => (e.currentTarget.src = exercise.tutorial)}
                  onMouseLeave={e =>
                    (e.currentTarget.src = exercise.tutorial.replace(
                      '/upload/',
                      '/upload/f_jpg/so_0/'
                    ))
                  }
                  className='w-30 h-30 object-cover rounded-md'
                />
                <div className='text-left'>
                  <h4 className='font-medium text-gray-800'>
                    {exercise.title}
                  </h4>
                  <div className='flex space-x-2 mt-2'>
                    <span className='bg-gray-300 px-2 py-1 rounded-full text-sm text-gray-700'>
                      {exercise.difficulty}
                    </span>
                    <span className='bg-gray-300 px-2 py-1 rounded-full text-sm text-gray-700'>
                      {exercise.type}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAddExercise(exercise)}
                className='bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center'
              >
                <FaPlus />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ExerciseLibrary;
