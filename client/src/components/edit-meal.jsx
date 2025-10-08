import React, { useEffect, useState } from 'react';
import {
  FaClipboardList,
  FaDrumstickBite,
  FaFire,
  FaHamburger
} from 'react-icons/fa';
import { MdFileUpload } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { fetchMealById, updateMeal } from '~/store/features/meal-slice';

import FoodList from './food-list';

const EditMeal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentMeal,
    loading: mealLoading,
    error
  } = useSelector(state => state.meals);
  const userId = useSelector(state => state.auth.user.id);

  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [image, setImage] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMealById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentMeal) {
      setTitle(currentMeal.title || '');
      setMealType(currentMeal.mealType || 'Breakfast');
      setImage(currentMeal.image || null);
      setSelectedFoods(
        currentMeal.foods.map(food => ({
          foodId: food.foodId._id,
          title: food.foodId.title,
          image: food.foodId.image,
          calories: food.foodId.calories,
          fats: food.foodId.fats,
          quantity: food.quantity
        }))
      );
    }
  }, [currentMeal]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      toast.warning('Please select a valid image file.');
      setImage(null);
    }
  };

  const handleUpdateMeal = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('mealType', mealType);
    formData.append('userId', userId);
    formData.append('image', image);

    selectedFoods.forEach((food, index) => {
      formData.append(`foods[${index}][foodId]`, food.foodId);
      formData.append(`foods[${index}][quantity]`, food.quantity);
    });

    try {
      await dispatch(updateMeal({ id, updateData: formData }));
      toast.success('Meal updated successfully!');
      navigate('/nutrition');
    } catch (err) {
      console.error('Error updating meal:', err);
      toast.error('Failed to update meal!');
    } finally {
      setLoading(false);
    }
  };

  const totalNutrients = selectedFoods.reduce(
    (totals, food) => {
      const qty = Number(food.quantity) || 1;
      totals.calories += (food.calories || 0) * qty;
      totals.fats += (food.fats || 0) * qty;
      return totals;
    },
    { calories: 0, fats: 0 }
  );

  if (mealLoading) return <div>Loading meal data...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg'>
      <h1 className='text-4xl font-semibold text-center text-gray-800 mb-10'>
        Edit Meal
      </h1>

      <div className='flex flex-col lg:flex-row-reverse gap-10'>
        <div className='flex flex-col w-full lg:w-1/2 border border-gray-200 rounded-xl p-6 bg-gray-50'>
          <h2 className='text-lg font-semibold text-gray-700 mb-3 text-center'>
            Current Meal Image
          </h2>

          {image ? (
            <img
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt='Meal'
              className='w-full h-80 object-cover rounded-lg shadow-md mb-6 border border-gray-300'
            />
          ) : (
            currentMeal?.image && (
              <img
                src={currentMeal.image}
                alt='Meal'
                className='w-full h-80 object-cover rounded-lg shadow-md mb-6 border border-gray-300'
              />
            )
          )}

          <label className='block text-lg font-medium text-gray-700 mb-2 flex items-center'>
            <MdFileUpload className='mr-2 text-green-500' /> Upload New Image
          </label>
          <input
            type='file'
            onChange={handleImageChange}
            className='w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6'
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
        />
      </div>

      <div className='mt-6'>
        <button
          type='button'
          onClick={handleUpdateMeal}
          className={`w-full p-4 text-white rounded-lg ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Updating Meal...' : 'Update Meal'}
        </button>
      </div>
    </div>
  );
};

export default EditMeal;
