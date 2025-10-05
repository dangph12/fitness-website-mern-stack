import React from 'react';
import { FiX } from 'react-icons/fi';

const ExerciseFilterModal = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onApply
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40'
        onClick={onClose}
      ></div>

      <div className='fixed top-0 right-0 h-full w-[400px] bg-gray-900 text-white z-50 p-6 overflow-y-auto transition-transform duration-300 ease-out'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold'>Filters</h2>
          <button
            className='text-gray-300 hover:text-white text-2xl'
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>Muscle</label>
          <select
            className='w-full p-2 rounded bg-white text-black'
            value={filters.muscle}
            onChange={e =>
              setFilters(prev => ({ ...prev, muscle: e.target.value }))
            }
          >
            <option>All</option>
            <option value='68dbfb24b959a26b9a83fad4'>Abs</option>
            <option value='68dc003196c0756913d0a587'>Back</option>
          </select>
        </div>

        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>Difficulty</label>
          <select
            className='w-full p-2 rounded bg-white text-black'
            value={filters.difficulty}
            onChange={e =>
              setFilters(prev => ({ ...prev, difficulty: e.target.value }))
            }
          >
            <option>All</option>
            <option value='Beginner'>Beginner</option>
            <option value='Intermediate'>Intermediate</option>
            <option value='Advanced'>Advanced</option>
          </select>
        </div>

        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>Equipment</label>
          <select
            className='w-full p-2 rounded bg-white text-black'
            value={filters.equipment}
            onChange={e =>
              setFilters(prev => ({ ...prev, equipment: e.target.value }))
            }
          >
            <option>All</option>
            <option value='68e16c81f5caf5d27d7763c8'>Body Weight</option>
            <option value='68e16d38f5caf5d27d7763ce'>Machine</option>
          </select>
        </div>

        <div className='mb-4'>
          <label className='block mb-1 font-semibold'>Exercise Type</label>
          <select
            className='w-full p-2 rounded bg-white text-black'
            value={filters.type}
            onChange={e =>
              setFilters(prev => ({ ...prev, type: e.target.value }))
            }
          >
            <option>All</option>
            <option value='Strength'>Strength</option>
            <option value='Stretching'>Stretching</option>
            <option value='Power'>Power</option>
          </select>
        </div>

        <button
          onClick={() => {
            onApply();
            onClose();
          }}
          className='mt-4 bg-blue-600 hover:bg-blue-700 w-full py-2 rounded-md text-white font-semibold transition-all'
        >
          Apply Filters
        </button>
      </div>
    </>
  );
};

export default ExerciseFilterModal;
