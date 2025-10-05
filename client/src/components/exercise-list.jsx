import React from 'react';
import { useSelector } from 'react-redux';

const ExerciseList = () => {
  const { exercises, loading, error } = useSelector(state => state.exercises);

  if (loading) return <div className='text-center'>Loading exercises...</div>;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  if (!exercises || exercises.length === 0)
    return (
      <div className='text-center text-gray-500 mt-6'>
        No exercises found. Please select muscle or equipment.
      </div>
    );

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-8'>
        <h2 className='text-4xl font-bold mb-6 text-gray-800'>
          Exercise Results
        </h2>

        <p className='text-lg text-black-400'>
          Filter and refine your search to find the perfect exercise for your
          fitness goals
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {exercises.map(exercise => (
          <div
            key={exercise._id}
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer'
          >
            <img
              src={
                exercise.tutorial.endsWith('.gif')
                  ? exercise.tutorial.replace('/upload/', '/upload/f_jpg/so_0/')
                  : exercise.tutorial
              }
              onMouseEnter={e => (e.currentTarget.src = exercise.tutorial)}
              onMouseLeave={e =>
                (e.currentTarget.src = exercise.tutorial.replace(
                  '/upload/',
                  '/upload/f_jpg/so_0/'
                ))
              }
              alt={exercise.title}
              className='w-full h-48 object-cover rounded-md transition-all duration-200'
            />
            <div className='p-4'>
              <h3 className='text-lg font-semibold mb-1'>{exercise.title}</h3>
              <p className='text-blue-500 text-sm mb-1'>
                {exercise.muscles?.map(m => m.title).join(', ') || 'General'}
              </p>
              <p className='text-gray-600 text-sm'>
                {exercise.equipments?.map(e => e.title).join(', ') ||
                  'No equipment'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;
