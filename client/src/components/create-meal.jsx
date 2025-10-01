import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createMeal } from '~/store/features/meal-slice';

import FoodList from './food-list';

const CreateMeal = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user.id);
  const { foods } = useSelector(state => state.foods.foods);

  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [image, setImage] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateMeal = async () => {
    if (selectedFoods.length === 0) {
      alert('Please select some foods before creating the meal!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('mealType', mealType);
    formData.append('userId', userId);
    formData.append('image', image);

    selectedFoods.forEach((food, index) => {
      formData.append(`foods[${index}][foodId]`, food.foodId);
      formData.append(`foods[${index}][quantity]`, food.quantity);
    });

    setLoading(true);
    setError(null);

    try {
      await dispatch(createMeal(formData));
      alert('Meal created successfully!');

      setTitle('');
      setMealType('Breakfast');
      setImage(null);
      setSelectedFoods([]);
    } catch (err) {
      setError('Failed to create meal');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = e => {
    setImage(e.target.files[0]);
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-6 text-center'>Create Meal</h1>

      {error && <div className='text-red-500 text-center mb-4'>{error}</div>}

      <form className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Meal Title
          </label>
          <input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className='w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Meal Type
          </label>
          <select
            value={mealType}
            onChange={e => setMealType(e.target.value)}
            required
            className='w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='Breakfast'>Breakfast</option>
            <option value='Lunch'>Lunch</option>
            <option value='Dinner'>Dinner</option>
            <option value='Snack'>Snack</option>
            <option value='Brunch'>Brunch</option>
            <option value='Dessert'>Dessert</option>
          </select>
        </div>

        <FoodList
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
          foods={foods}
        />

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Meal Image
          </label>
          <input
            type='file'
            onChange={handleImageChange}
            required
            className='w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {image && (
          <div className='mt-4'>
            <h3 className='text-sm font-medium text-gray-700 mb-2'>
              Preview Image
            </h3>
            <img
              src={URL.createObjectURL(image)}
              alt='Meal preview'
              className='w-full h-auto rounded-lg'
            />
          </div>
        )}

        <button
          type='button'
          onClick={handleCreateMeal}
          className={`w-full p-3 text-white rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Meal'}
        </button>
      </form>
    </div>
  );
};

export default CreateMeal;
