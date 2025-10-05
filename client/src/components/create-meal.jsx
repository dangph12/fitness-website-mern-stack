import React, { useState } from 'react';
import {
  FaClipboardList,
  FaDrumstickBite,
  FaFire,
  FaHamburger
} from 'react-icons/fa';
import { MdFileUpload } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { createMeal } from '~/store/features/meal-slice';

import FoodList from './food-list';

const CreateMeal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.user.id);
  const { foods } = useSelector(state => state.foods.foods);

  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [image, setImage] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalNutrients = selectedFoods.reduce(
    (totals, food) => {
      const qty = Number(food.quantity) || 1;
      totals.calories += (food.calories || 0) * qty;
      totals.fats += (food.fats || 0) * qty;
      return totals;
    },
    { calories: 0, fats: 0 }
  );

  const handleCreateMeal = async () => {
    if (selectedFoods.length === 0) {
      toast.warning('Please select some foods before creating the meal!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('mealType', mealType);
    formData.append('userId', userId);
    if (image) formData.append('image', image);

    selectedFoods.forEach((food, index) => {
      formData.append(`foods[${index}][foodId]`, food.foodId);
      formData.append(`foods[${index}][quantity]`, food.quantity);
    });

    setLoading(true);
    setError(null);

    try {
      await dispatch(createMeal(formData));
      toast.success('Meal created successfully!');
      navigate('/nutrition');
    } catch (err) {
      console.error('Error creating meal:', err);
      toast.error('Failed to create meal');
      setError('Failed to create meal');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      toast.warning('Please select a valid image file.');
      setImage(null);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg'>
      <h1 className='text-4xl font-semibold text-center text-gray-800 mb-10'>
        Create Meal
      </h1>

      {error && (
        <div className='text-red-500 text-center mb-6 text-lg'>{error}</div>
      )}

      <div className='flex flex-col lg:flex-row-reverse gap-10'>
        <div className='flex flex-col w-full lg:w-1/2 border border-gray-200 rounded-xl p-6 bg-gray-50'>
          <h2 className='text-lg font-semibold text-gray-700 mb-3 text-center'>
            Meal Image
          </h2>

          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt='Meal Preview'
              className='w-full h-80 object-cover rounded-lg shadow-md mb-6 border border-gray-300'
            />
          ) : (
            <div className='flex items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-lg'>
              No Image Selected
            </div>
          )}

          <label className='block text-lg font-medium text-gray-700 mb-2 flex items-center mt-5'>
            <MdFileUpload className='mr-2 text-green-500' /> Upload Image
          </label>
          <input
            type='file'
            onChange={handleImageChange}
            className='w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='w-full lg:w-1/2 space-y-6'>
          <div>
            <label className='block text-lg font-medium text-gray-700 mb-3 flex items-center'>
              <FaClipboardList className='mr-2 text-blue-600' /> Meal Title
            </label>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className='w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
            />
          </div>

          <div>
            <label className='block text-lg font-medium text-gray-700 mb-3 flex items-center'>
              <FaHamburger className='mr-2 text-yellow-500' /> Meal Type
            </label>
            <select
              value={mealType}
              onChange={e => setMealType(e.target.value)}
              required
              className='w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
            >
              <option value='Breakfast'>Breakfast</option>
              <option value='Lunch'>Lunch</option>
              <option value='Dinner'>Dinner</option>
              <option value='Snack'>Snack</option>
              <option value='Brunch'>Brunch</option>
              <option value='Dessert'>Dessert</option>
            </select>
          </div>

          <div className='flex justify-around items-center mt-6 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg p-4 text-center shadow-sm'>
            <div className='flex items-center gap-3'>
              <FaFire className='text-red-500 text-2xl' />
              <div>
                <p className='text-gray-700 text-sm font-semibold'>
                  Total Calories
                </p>
                <p className='text-blue-700 font-bold text-xl'>
                  {totalNutrients.calories.toFixed(0)} kcal
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <FaDrumstickBite className='text-yellow-500 text-2xl' />
              <div>
                <p className='text-gray-700 text-sm font-semibold'>Total Fat</p>
                <p className='text-blue-700 font-bold text-xl'>
                  {totalNutrients.fats.toFixed(1)} g
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-10 border border-gray-200 rounded-xl p-8 bg-gray-50'>
        <h3 className='text-2xl font-semibold text-gray-800 mb-5 text-center'>
          Foods in this Meal
        </h3>

        <FoodList
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
          foods={foods}
        />
      </div>

      <div className='mt-6'>
        <button
          type='button'
          onClick={handleCreateMeal}
          className={`w-full p-4 text-white rounded-lg ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition duration-300 ease-in-out`}
          disabled={loading}
        >
          {loading ? 'Creating Meal...' : 'Create Meal'}
        </button>
      </div>
    </div>
  );
};

export default CreateMeal;
