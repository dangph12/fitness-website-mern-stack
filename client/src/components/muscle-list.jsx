import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMuscles } from '~/store/features/muscles-slice';

function MuscleList() {
  const dispatch = useDispatch();
  const { muscles, loading, error } = useSelector(state => state.muscles);

  useEffect(() => {
    dispatch(fetchMuscles());
  }, [dispatch]);

  return (
    <div className='container mx-auto p-6'>
      {loading && <div className='text-center'>Loading...</div>}
      {error && <div className='text-center text-red-500'>{error}</div>}

      <div className='mb-8'>
        <h2 className='text-6xl font-bold text-black'>Exercise Database</h2>
        <p className='text-lg text-black-400 mt-2'>
          Find the perfect workouts from the JEFIT exercise database by muscle
          group, equipment, or try something new.
        </p>
      </div>

      <h3 className='text-3xl font-semibold text-gray-800 mb-8'>
        Select by Muscle
      </h3>

      <div className='flex justify-center space-x-4 overflow-x-auto'>
        {muscles.map(muscle => (
          <div
            key={muscle._id}
            className='bg-white rounded-lg p-4 text-center hover:bg-gray-100 transition-all'
          >
            <img
              src={muscle.image}
              alt={muscle.title}
              className='w-24 h-24 object-cover rounded-lg mb-4 transition-transform duration-300 ease-in-out transform hover:scale-125'
            />
            <h3 className='text-lg font-medium text-blue-600'>
              {muscle.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MuscleList;
