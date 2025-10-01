import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router'; // Import useNavigate

import { fetchMeals } from '~/store/features/meal-slice';

import UserCard from './user-card';

const MealsList = () => {
  const dispatch = useDispatch();
  const { meals, loading, error } = useSelector(state => state.meals);

  const [selectedMeal, setSelectedMeal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMeals({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSelectMeal = meal => {
    setSelectedMeal(meal);
  };

  const handleSelectFood = foodId => {
    navigate(`/nutrition/food/${foodId}`);
  };

  const handleCloseDetails = () => {
    setSelectedMeal(null);
  };

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='loader'>Loading...</div>
      </div>
    );
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-8'>Meals List</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {meals.map(meal => (
          <div
            key={meal._id}
            className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300'
            onClick={() => handleSelectMeal(meal)}
          >
            <img
              src={meal.image}
              alt={meal.title}
              className='w-full h-48 object-cover rounded-t-lg'
            />
            <div className='p-4'>
              <h2 className='text-xl font-semibold'>{meal.title}</h2>
              <p className='text-sm text-gray-500 mt-2'>{meal.mealType}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <div className='fixed inset-0 bg-opacity-30 backdrop-blur-xs flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative'>
            <button
              onClick={handleCloseDetails}
              className='absolute top-4 right-4 text-2xl text-gray-700 hover:text-gray-900'
            >
              &times;
            </button>

            <h2 className='text-2xl font-semibold text-center mb-4'>
              {selectedMeal.title}
            </h2>
            <img
              src={selectedMeal.image}
              alt={selectedMeal.title}
              className='w-full h-64 object-cover rounded-lg mb-4'
            />
            <p className='text-center text-lg text-gray-600 mb-6'>
              {selectedMeal.mealType}
            </p>

            <UserCard user={selectedMeal.userId} />

            <h3 className='text-xl font-semibold mb-2'>Foods in this Meal</h3>
            <ul className='space-y-4'>
              {selectedMeal.foods.map(food => (
                <li
                  key={food._id}
                  className='flex items-center space-x-4 border border-gray-300 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer'
                  onClick={() => handleSelectFood(food.foodId._id)} // Navigate to food details
                >
                  <img
                    src={food.foodId.image}
                    alt={food.foodId.title}
                    className='w-16 h-16 object-cover rounded-full'
                  />
                  <div className='flex-1'>
                    <p className='font-medium'>{food.foodId.title}</p>
                    <p className='text-sm text-gray-600'>
                      Quantity: {food.quantity} units
                    </p>
                    <p className='text-sm text-gray-500'>
                      Calories: {food.foodId.calories} kcal
                    </p>
                    <p className='text-sm text-gray-500'>
                      Fat: {food.foodId.fats} g
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsList;
