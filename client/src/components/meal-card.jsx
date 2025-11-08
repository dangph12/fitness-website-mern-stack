import React, { useEffect, useState } from 'react';
import { FaAppleAlt, FaCheese, FaDrumstickBite, FaFire } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { fetchFoods } from '~/store/features/food-slice';

import { ScrollArea } from './ui/scroll-area';

export default function MealCard({ meal }) {
  const dispatch = useDispatch();

  const foodsSlice = useSelector(state => {
    const data = state.foods?.foods;
    return data?.foods || data?.meals || [];
  });

  const [detailedFoods, setDetailedFoods] = useState([]);

  useEffect(() => {
    if (!foodsSlice || foodsSlice.length === 0) {
      dispatch(fetchFoods({ page: 1, limit: 500 }));
    }
  }, [foodsSlice, dispatch]);

  useEffect(() => {
    const mappedFoods = meal.foods.map(f => {
      const foodInfo = foodsSlice.find(
        item => item._id === f.food || item._id === f.food?._id
      );

      return {
        ...f,
        name: foodInfo?.title || 'Unknown Food',
        image: foodInfo?.image || '',
        calories: foodInfo?.calories || 0,
        protein: foodInfo?.protein || 0,
        carb: foodInfo?.carbohydrate || 0,
        fat: foodInfo?.fat || 0,
        scheduledAt: f.scheduledAt || meal.scheduledAt
      };
    });

    setDetailedFoods(mappedFoods);
  }, [meal.foods, foodsSlice, meal.scheduledAt]);

  const totals = detailedFoods.reduce(
    (acc, f) => {
      acc.calories += f.calories * f.quantity;
      acc.protein += f.protein * f.quantity;
      acc.carb += f.carb * f.quantity;
      acc.fat += f.fat * f.quantity;
      return acc;
    },
    { calories: 0, protein: 0, carb: 0, fat: 0 }
  );

  const formatDate = iso => new Date(iso).toLocaleDateString();

  return (
    <div className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h3 className='text-xl font-extrabold text-gray-800'>{meal.title}</h3>
          <p className='text-sm mt-1'>
            <span className='font-semibold text-emerald-600'>
              {meal.mealType}
            </span>{' '}
            •{' '}
            <span className='font-semibold text-gray-700'>
              {meal.scheduledAt && formatDate(meal.scheduledAt)}
            </span>
          </p>
        </div>
      </div>

      <div className='space-y-4'>
        {detailedFoods.map((f, i) => (
          <ScrollArea key={i} className='p-3 bg-gray-50 rounded-xl shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 flex-shrink-0'>
                {f.image ? (
                  <img
                    src={f.image}
                    alt={f.name}
                    className='w-full h-full object-cover rounded-xl'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-lg font-bold'>
                    ?
                  </div>
                )}
              </div>

              <div className='flex-1'>
                <h4 className='font-semibold text-gray-700'>{f.name}</h4>
                <p className='text-xs text-gray-500'>
                  Qty: {f.quantity} •{' '}
                  {f.scheduledAt && formatDate(f.scheduledAt)}
                </p>

                <div className='flex gap-2 mt-1 text-sm flex-wrap'>
                  <span className='flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full'>
                    <FaFire /> {f.calories * f.quantity} kcal
                  </span>
                  <span className='flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full'>
                    <FaDrumstickBite /> {f.protein * f.quantity}g
                  </span>
                  <span className='flex items-center gap-1 bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full'>
                    <FaAppleAlt /> {f.carb * f.quantity}g
                  </span>
                  <span className='flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full'>
                    <FaCheese /> {f.fat * f.quantity}g
                  </span>
                </div>
              </div>
            </div>
          </ScrollArea>
        ))}
      </div>

      <div className='mt-4 flex gap-3 flex-wrap text-sm font-semibold'>
        <span className='flex items-center gap-1 bg-red-200 text-red-700 px-3 py-1 rounded-full'>
          <FaFire /> {totals.calories} kcal
        </span>
        <span className='flex items-center gap-1 bg-green-200 text-green-700 px-3 py-1 rounded-full'>
          <FaDrumstickBite /> P: {totals.protein}g
        </span>
        <span className='flex items-center gap-1 bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full'>
          <FaAppleAlt /> C: {totals.carb}g
        </span>
        <span className='flex items-center gap-1 bg-blue-200 text-blue-700 px-3 py-1 rounded-full'>
          <FaCheese /> F: {totals.fat}g
        </span>
      </div>
    </div>
  );
}
