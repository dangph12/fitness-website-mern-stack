import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchExercises } from '~/store/features/exercise-slice';
import { fetchMuscles } from '~/store/features/muscles-slice';

const MuscleList = () => {
  const dispatch = useDispatch();
  const { muscles, loading, error } = useSelector(state => state.muscles);
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  useEffect(() => {
    dispatch(fetchMuscles());
  }, [dispatch]);

  const toggleSelectMuscle = muscleId => {
    setSelectedMuscles(prev =>
      prev.includes(muscleId)
        ? prev.filter(id => id !== muscleId)
        : [...prev, muscleId]
    );
  };

  useEffect(() => {
    if (selectedMuscles.length > 0) {
      dispatch(
        fetchExercises({
          page: 1,
          limit: 12,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          filterParams: { muscles: selectedMuscles }
        })
      );
    } else {
      dispatch(fetchExercises({ page: 1, limit: 12 }));
    }
  }, [selectedMuscles, dispatch]);

  if (loading) return <div className='text-center'>Loading muscles...</div>;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-8'>
        <h2 className='text-6xl font-bold text-black'>Exercise Database</h2>
        <p className='text-lg text-black-400 mt-2'>
          Find the perfect workouts from the JEFIT exercise database by muscle
          group, equipment, or try something new.
        </p>
      </div>

      <h3 className='text-3xl font-semibold text-gray-800'>Select by Muscle</h3>

      <div className='flex justify-center gap-4 overflow-x-auto p-10'>
        {muscles.map(muscle => {
          const isSelected = selectedMuscles.includes(muscle._id);
          return (
            <div
              key={muscle._id}
              onClick={() => toggleSelectMuscle(muscle._id)}
              className={`bg-white rounded-lg p-4 text-center shadow-md cursor-pointer transition-all ${
                isSelected ? 'ring-4 ring-blue-400' : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={muscle.image}
                alt={muscle.title}
                className='w-24 h-24 object-cover rounded-lg mb-2 mx-auto transition-transform duration-300 hover:scale-110'
              />
              <h3 className='text-lg font-medium text-blue-600 whitespace-nowrap'>
                {muscle.title}
              </h3>
            </div>
          );
        })}
      </div>
      {selectedMuscles.length > 0 && (
        <div className='text-center mt-4 text-gray-600'>
          Selected:{' '}
          {selectedMuscles.length === 1
            ? '1 muscle'
            : `${selectedMuscles.length} muscles`}
        </div>
      )}
    </div>
  );
};

export default MuscleList;
