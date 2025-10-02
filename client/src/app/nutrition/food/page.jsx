import React, { useEffect } from 'react';
import { FaCheckCircle, FaLeaf, FaWeight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { fetchFoodById } from '~/store/features/food-slice';

const FoodDetailPage = () => {
  const { foodId } = useParams();
  const dispatch = useDispatch();
  const { currentFood, loading, error } = useSelector(state => state.foods);

  useEffect(() => {
    dispatch(fetchFoodById(foodId));
  }, [dispatch, foodId]);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='loader text-xl text-gray-500'>Loading...</div>
      </div>
    );

  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='max-w-7xl mx-auto p-8'>
      {currentFood && (
        <div className='flex flex-col md:flex-row gap-12'>
          <div className='flex justify-center md:w-1/2'>
            <img
              src={currentFood.image}
              alt={currentFood.title}
              className='w-full h-96 object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105'
            />
          </div>

          <div className='md:w-1/2 flex flex-col justify-start'>
            <h1 className='text-4xl font-semibold text-gray-800 mb-6'>
              {currentFood.title}
            </h1>
            <p className='text-lg text-gray-600 mb-6'>
              <strong>Category:</strong> {currentFood.category || 'N/A'}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div className='flex items-center text-gray-700 space-x-2'>
                <FaLeaf className='text-green-500' />
                <p className='font-medium'>
                  Calories: {currentFood.calories} kcal
                </p>
              </div>

              <div className='flex items-center text-gray-700 space-x-2'>
                <FaWeight className='text-red-500' />
                <p className='font-medium'>Fat: {currentFood.fats} g</p>
              </div>

              <div className='flex items-center text-gray-700 space-x-2'>
                <FaCheckCircle className='text-blue-500' />
                <p className='font-medium'>
                  Proteins: {currentFood.proteins} g
                </p>
              </div>

              <div className='flex items-center text-gray-700 space-x-2'>
                <FaLeaf className='text-yellow-500' />
                <p className='font-medium'>Carbs: {currentFood.carbs} g</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetailPage;
