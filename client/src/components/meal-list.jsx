import React, { useEffect, useState } from 'react';
import { FaFireAlt, FaLeaf } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { deleteMeal, fetchMeals } from '~/store/features/meal-slice';

import UserCard from './user-card';

const MealsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { meals, loading, error } = useSelector(state => state.meals);
  const userId = useSelector(state => state.auth.user?.id);

  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMeals({ page: 1, limit: 10 }));
    }
    console.log(meals);
  }, [dispatch, userId]);

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
        if (food?.food && food.food.calories && food.food.fats) {
          totals.calories += food.food.calories * food.quantity || 0;
          totals.fats += food.food.fats * food.quantity || 0;
        }
        return totals;
      },
      { calories: 0, fats: 0 }
    );
  };

  const handleDeleteMeal = mealId => {
    if (!userId) {
      toast.error('Bạn chưa đăng nhập, không thể xóa meal!');
      navigate('/auth/login');
      return;
    }

    if (window.confirm('Are you sure you want to delete this meal?')) {
      dispatch(deleteMeal(mealId));
      toast.success('Meal deleted successfully!');
    }
  };

  if (!userId) {
    return (
      <div className='flex justify-center items-center'>
        <div className='text-center'>
          <p className='text-xl text-red-500 font-semibold mb-4'>
            Bạn chưa đăng nhập!
          </p>
          <button
            onClick={() => navigate('/auth/login')}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mb-4'
          >
            Đăng nhập để xem Meals
          </button>
        </div>
      </div>
    );
  }

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
        {meals.map(meal => {
          const totals = getTotalNutrients(meal.foods);
          return (
            <div
              key={meal._id}
              className='bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl'
            >
              <img
                src={meal.image}
                alt={meal.title}
                className='w-full h-48 object-cover rounded-t-lg cursor-pointer'
                onClick={() => handleSelectMeal(meal)}
              />
              <div className='p-4'>
                <h2 className='text-xl font-semibold'>{meal.title}</h2>
                <p className='text-sm text-gray-500 mt-1'>{meal.mealType}</p>

                <div className='mt-3 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-md p-3 text-center'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                    <FaFireAlt className='text-orange-500 text-lg' />
                    <span>
                      Calories:{' '}
                      <span className='text-blue-600'>{totals.calories}</span>{' '}
                      kcal
                    </span>
                  </div>

                  <div className='flex items-center gap-2 mt-1 text-sm font-semibold text-gray-700'>
                    <FaLeaf className='text-green-600 text-lg' />
                    <span>
                      Fat: <span className='text-blue-600'>{totals.fats}</span>{' '}
                      g
                    </span>
                  </div>
                </div>

                <div className='mt-4 flex justify-between space-x-4'>
                  <button
                    className='w-full bg-gradient-to-r from-yellow-300 to-yellow-400 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105'
                    onClick={() => navigate(`/nutrition/edit-meal/${meal._id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className='w-full bg-gradient-to-r from-red-400 to-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105'
                    onClick={() => handleDeleteMeal(meal._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMeal && (
        <div className='fixed inset-0 bg-opacity-30 backdrop-blur-xs flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative max-h-[80vh] overflow-auto'>
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
            <UserCard user={selectedMeal.user} />{' '}
            <div className='mt-7'>
              <h3 className='text-xl font-semibold mb-2'>Foods in this Meal</h3>
              <ul className='space-y-4'>
                {selectedMeal.foods.map(food => (
                  <li
                    key={food._id}
                    className='flex items-center space-x-4 border border-gray-300 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer'
                    onClick={() => handleSelectFood(food.food._id)} // Chú ý sử dụng food.foodId thay vì foodId
                  >
                    <img
                      src={food.food.image}
                      alt={food.food.title}
                      className='w-16 h-16 object-cover rounded-full'
                    />
                    <div className='flex-1'>
                      <p className='font-medium'>{food.food.title}</p>
                      <p className='text-sm text-gray-600'>
                        Quantity: {food.quantity} units
                      </p>
                      <p className='text-sm text-gray-500'>
                        Calories: {food.food.calories} kcal
                      </p>
                      <p className='text-sm text-gray-500'>
                        Fat: {food.food.fats} g
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
