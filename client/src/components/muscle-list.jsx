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
      <div className='mb-12 text-center lg:text-left'>
        <h2 className='text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'>
          Explore the{' '}
          <span className='relative inline-block'>
            <span className='absolute inset-0 bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 blur-lg opacity-25'></span>
            <span className='relative bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent'>
              Exercise Database
            </span>
          </span>
        </h2>

        <p className='mt-4 max-w-3xl text-base text-slate-600 sm:text-lg mx-auto lg:mx-0 leading-relaxed'>
          Discover the perfect workout by{' '}
          <span className='font-semibold text-slate-800'>muscle group</span>,{' '}
          <span className='font-semibold text-slate-800'>equipment</span>, or
          try a brand-new routine tailored to your goals.
        </p>

        <div className='mt-6 flex flex-wrap justify-center lg:justify-start gap-2 text-sm'>
          {[
            { label: '1,200+ exercises', color: 'from-sky-500 to-cyan-400' },
            {
              label: 'Beginner – Advanced',
              color: 'from-emerald-500 to-teal-400'
            },
            { label: 'Home & Gym', color: 'from-indigo-500 to-purple-400' }
          ].map((item, i) => (
            <span
              key={i}
              className={`rounded-full border border-slate-200 bg-gradient-to-r ${item.color} bg-clip-text text-transparent px-3 py-1.5 font-semibold shadow-sm hover:scale-[1.05] transition-transform`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className='mb-4 flex items-end justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-2xl font-semibold text-slate-900 sm:text-3xl'>
            <span className='inline-block h-2 w-2 rounded-full bg-sky-500' />
            Select by Muscle
          </h3>
          <p className='mt-1 text-sm text-slate-500'>
            Tap a muscle to filter routines
          </p>
        </div>

        <button
          type='button'
          onClick={() => setSelectedMuscles?.([])}
          className='hidden rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:inline-block'
        >
          Clear
        </button>
      </div>

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
