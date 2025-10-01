import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { deleteMeal, fetchMeals } from '~/store/features/meal-slice';

import UserCard from './user-card';

const MealsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { meals, loading, error } = useSelector(state => state.meals);
  const [selectedMeal, setSelectedMeal] = useState(null);

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

  const getTotalNutrients = foods => {
    return foods.reduce(
      (totals, food) => {
        totals.calories += food.foodId.calories * food.quantity;
        totals.fats += food.foodId.fats * food.quantity;
        return totals;
      },
      { calories: 0, fats: 0 }
    );
  };

  const handleDeleteMeal = mealId => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      dispatch(deleteMeal(mealId));
    }
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
            className='bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl'
          >
            <img
              src={meal.image}
              alt={meal.title}
              className='w-full h-48 object-cover rounded-t-lg'
              onClick={() => handleSelectMeal(meal)}
            />
            <div className='p-4'>
              <h2 className='text-xl font-semibold'>{meal.title}</h2>
              <p className='text-sm text-gray-500 mt-2'>{meal.mealType}</p>

              <div className='mt-4 flex justify-between space-x-4'>
                <button
                  className='w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105'
                  onClick={() => handleSelectMeal(meal)}
                >
                  Edit
                </button>

                <button
                  className='w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105'
                  onClick={() => handleDeleteMeal(meal._id)}
                >
                  Delete
                </button>
              </div>
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

            <div className='mt-7'>
              <h3 className='text-xl font-semibold mb-2'>Foods in this Meal</h3>
              <ul className='space-y-4'>
                {selectedMeal.foods.map(food => (
                  <li
                    key={food._id}
                    className='flex items-center space-x-4 border border-gray-300 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer'
                    onClick={() => handleSelectFood(food.foodId._id)}
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

            {selectedMeal.foods && (
              <div className='text-center mb-6 mt-3'>
                <div className='flex justify-center space-x-8 bg-gradient-to-r from-blue-400 to-blue-300 p-4 rounded-lg shadow-lg'>
                  <div className='text-white font-medium'>
                    <p className='text-xl'>Total Calories</p>
                    <p className='text-2xl'>
                      {getTotalNutrients(selectedMeal.foods).calories} kcal
                    </p>
                  </div>
                  <div className='text-white font-medium'>
                    <p className='text-xl'>Total Fat</p>
                    <p className='text-2xl'>
                      {getTotalNutrients(selectedMeal.foods).fats} g
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsList;
