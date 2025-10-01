import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { fetchMealById, updateMeal } from '~/store/features/meal-slice';

import FoodList from './food-list';

const EditMeal = () => {
  const { id } = useParams(); // Get meal ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the current meal data from the Redux store
  const { currentMeal, loading, error } = useSelector(state => state.meals);

  // Get the authenticated user's id from the auth slice
  const userId = useSelector(state => state.auth.user.id);

  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [image, setImage] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]); // State for selected foods

  // Fetch meal data when the component mounts
  useEffect(() => {
    dispatch(fetchMealById(id)); // Fetch the meal by its ID
  }, [dispatch, id]);

  // Set initial values in the form when meal data is fetched
  useEffect(() => {
    if (currentMeal) {
      setTitle(currentMeal.title || '');
      setMealType(currentMeal.mealType || 'Breakfast');
      setImage(currentMeal.image || null);
      // Pre-populate selected foods from currentMeal's foods
      setSelectedFoods(
        currentMeal.foods.map(food => ({
          foodId: food.foodId._id,
          title: food.foodId.title,
          quantity: food.quantity
        }))
      );
    }
  }, [currentMeal]);

  // Handle update meal
  const handleUpdateMeal = async () => {
    const updatedMeal = {
      title,
      mealType,
      image,
      foods: selectedFoods,
      userId
    };

    try {
      await dispatch(updateMeal({ id, updateData: updatedMeal }));
      alert('Meal updated successfully!');
      navigate('/nutrition'); // Navigate back to the meals list page after update
    } catch (err) {
      console.error('Error updating meal:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg'>
      <h1 className='text-4xl font-semibold text-center text-gray-800 mb-8'>
        Edit Meal
      </h1>

      {/* Form removed, handle update directly via button */}
      <div className='space-y-6'>
        <div>
          <label className='block text-lg font-medium text-gray-700 mb-3'>
            Meal Title
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
          <label className='block text-lg font-medium text-gray-700 mb-3'>
            Meal Type
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

        {/* Food List for selected foods */}
        <FoodList
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
        />

        {/* Display current image or image preview */}
        {image && (
          <div className='mb-4'>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Current Image
            </label>
            <img
              src={image}
              alt='Current Meal'
              className='w-32 h-32 object-cover rounded-lg mb-4'
            />
          </div>
        )}

        <div>
          <label className='block text-lg font-medium text-gray-700 mb-3'>
            Meal Image
          </label>
          <input
            type='file'
            onChange={e => setImage(URL.createObjectURL(e.target.files[0]))}
            className='w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Update Meal Button */}
        <div className='mt-6'>
          <button
            type='button' // Ensure it's not type='submit'
            onClick={handleUpdateMeal}
            className={`w-full p-4 text-white rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Updating Meal...' : 'Update Meal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMeal;
