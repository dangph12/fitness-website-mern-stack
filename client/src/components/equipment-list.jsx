import React from 'react';
import { useSelector } from 'react-redux';

function EquipmentList() {
  const { equipments, loading, error } = useSelector(state => state.equipments);

  return (
    <div className='container mx-auto p-6'>
      {loading && <div className='text-center'>Loading...</div>}
      {error && <div className='text-center text-red-500'>{error}</div>}

      <div className='mb-8'>
        <h2 className='text-6xl font-bold text-black'>Equipment Database</h2>
        <p className='text-lg text-black-400 mt-2'>
          Browse our equipment list and find the perfect tools for your workout
          routine.
        </p>
      </div>

      <h3 className='text-3xl font-semibold text-gray-800 mb-8'>
        Select Equipment
      </h3>

      <div className='flex flex-wrap justify-center gap-6 py-4'>
        {equipments.map(equipment => (
          <div
            key={equipment._id}
            className='bg-white p-4 rounded-full text-center hover:scale-105 transform transition duration-300 ease-in-out'
          >
            <img
              src={equipment.image}
              alt={equipment.title}
              className='w-24 h-24 object-cover rounded-full mb-2 transition-transform duration-300 ease-in-out mx-auto'
            />

            <h3 className='text-lg font-medium text-blue-600'>
              {equipment.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EquipmentList;
