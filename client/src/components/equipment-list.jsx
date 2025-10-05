import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEquipments } from '~/store/features/equipment-slice';
import { fetchExercises } from '~/store/features/exercise-slice';

const EquipmentList = () => {
  const dispatch = useDispatch();
  const { equipments, loading, error } = useSelector(state => state.equipments);
  const [selectedEquipments, setSelectedEquipments] = useState([]);

  useEffect(() => {
    dispatch(fetchEquipments());
  }, [dispatch]);

  const toggleSelectEquipment = equipmentId => {
    setSelectedEquipments(prev =>
      prev.includes(equipmentId)
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  useEffect(() => {
    if (selectedEquipments.length > 0) {
      dispatch(
        fetchExercises({
          page: 1,
          limit: 23,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          filterParams: { equipments: selectedEquipments }
        })
      );
    } else {
      dispatch(fetchExercises({ page: 1, limit: 12 }));
    }
  }, [selectedEquipments, dispatch]);

  if (loading) return <div className='text-center'>Loading equipments...</div>;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='container mx-auto p-5'>
      <h3 className='text-3xl font-semibold text-gray-800 mb-8'>
        Select Equipment
      </h3>

      <div className='flex flex-wrap justify-center gap-6'>
        {equipments.map(equipment => {
          const isSelected = selectedEquipments.includes(equipment._id);
          return (
            <div
              key={equipment._id}
              onClick={() => toggleSelectEquipment(equipment._id)}
              className={`bg-white p-4 rounded-lg text-center cursor-pointer shadow-md transition-all ${
                isSelected ? 'ring-4 ring-blue-400' : 'hover:scale-105'
              }`}
            >
              <img
                src={equipment.image}
                alt={equipment.title}
                className='w-24 h-24 object-cover rounded-full mb-2 mx-auto transition-transform duration-300 hover:scale-110'
              />
              <h3 className='text-lg font-medium text-blue-600'>
                {equipment.title}
              </h3>
            </div>
          );
        })}
      </div>
      {selectedEquipments.length > 0 && (
        <div className='text-center mt-4 text-gray-600'>
          Selected:{' '}
          {selectedEquipments.length === 1
            ? '1 equipment'
            : `${selectedEquipments.length} equipments`}
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
