import { useLayoutEffect, useMemo, useState } from 'react';
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
  const userId = useSelector(state => state.auth.user?.id);
  const { foods } = useSelector(state => state.foods.foods || {});

  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [image, setImage] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const totals = useMemo(() => {
    return selectedFoods.reduce(
      (acc, item) => {
        const qty = Math.max(0, Number(item.quantity) || 0);

        acc.calories += (Number(item.calories) || 0) * qty;
        acc.fat += (Number(item.fat) || 0) * qty;
        acc.carbohydrates += (Number(item.carbohydrate) || 0) * qty;
        acc.protein += (Number(item.protein) || 0) * qty;

        return acc;
      },
      { calories: 0, fat: 0, carbohydrates: 0, protein: 0 }
    );
  }, [selectedFoods]);

  const handleCreateMeal = async () => {
    if (!title.trim()) {
      toast.warning('Please enter meal title.');
      return;
    }
    if (!Array.isArray(selectedFoods) || selectedFoods.length === 0) {
      toast.warning('Please select some foods before creating the meal!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('mealType', mealType);
    formData.append('user', userId);
    if (image instanceof File) formData.append('image', image);

    selectedFoods.forEach((food, index) => {
      formData.append(`foods[${index}][food]`, food.food);
      formData.append(
        `foods[${index}][quantity]`,
        String(Number(food.quantity) || 0)
      );
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
    const file = e.target.files?.[0];
    if (file && file.type?.startsWith('image/')) {
      setImage(file);
    } else {
      toast.warning('Please select a valid image file.');
      setImage(null);
    }
  };

  const fmt0 = n => (isFinite(n) ? Math.round(Number(n)) : 0);
  const fmt1 = n => (isFinite(n) ? Number(n).toFixed(1) : '0.0');

  return (
    <div className='max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-lg'>
      <h1 className='text-3xl sm:text-4xl font-semibold text-center text-slate-900 mb-8'>
        Create Meal
      </h1>

      {error && (
        <div className='text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center mb-6'>
          {error}
        </div>
      )}

      <div className='flex flex-col lg:flex-row-reverse gap-8 lg:gap-10'>
        <div className='w-full lg:w-1/2'>
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
            <h2 className='text-base font-semibold text-slate-700 mb-3 text-center'>
              Meal Image
            </h2>

            <div className='overflow-hidden rounded-xl border border-slate-200 shadow-sm'>
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt='Meal Preview'
                  className='w-full h-72 object-cover'
                />
              ) : (
                <div className='w-full h-72 bg-slate-200 grid place-items-center text-slate-500'>
                  No Image Selected
                </div>
              )}
            </div>

            <label className='block text-sm font-medium text-slate-700 mt-5 mb-2'>
              <span className='inline-flex items-center gap-2'>
                <MdFileUpload className='text-green-600 text-lg' /> Upload Image
              </span>
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700
                         rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
            />
          </div>
        </div>

        <div className='w-full lg:w-1/2 space-y-6'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              <span className='inline-flex items-center gap-2'>
                <FaClipboardList className='text-blue-600' /> Meal Title
              </span>
            </label>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Enter meal title...'
              className='w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              <span className='inline-flex items-center gap-2'>
                <FaHamburger className='text-yellow-500' /> Meal Type
              </span>
            </label>
            <select
              value={mealType}
              onChange={e => setMealType(e.target.value)}
              className='w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
            >
              <option value='Breakfast'>Breakfast</option>
              <option value='Lunch'>Lunch</option>
              <option value='Dinner'>Dinner</option>
              <option value='Snack'>Snack</option>
              <option value='Brunch'>Brunch</option>
              <option value='Dessert'>Dessert</option>
            </select>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4'>
              <div className='flex items-center gap-3'>
                <div className='grid place-items-center rounded-lg bg-orange-100 h-10 w-10'>
                  <FaFire className='text-orange-600' />
                </div>
                <div>
                  <p className='text-xs font-medium text-orange-800/80'>
                    Total Calories
                  </p>
                  <p className='text-2xl font-bold text-orange-700'>
                    {fmt0(totals.calories)}{' '}
                    <span className='text-sm font-medium'>kcal</span>
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4'>
              <div className='flex items-center gap-3'>
                <div className='grid place-items-center rounded-lg bg-green-100 h-10 w-10'>
                  <FaDrumstickBite className='text-green-600' />
                </div>
                <div>
                  <p className='text-xs font-medium text-green-800/80'>
                    Total Fat
                  </p>
                  <p className='text-2xl font-bold text-green-700'>
                    {fmt1(totals.fat)}{' '}
                    <span className='text-sm font-medium'>g</span>
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4'>
              <div className='flex items-center gap-3'>
                <div className='grid place-items-center rounded-lg bg-teal-100 h-10 w-10'>
                  <FaDrumstickBite className='text-teal-600' />
                </div>
                <div>
                  <p className='text-xs font-medium text-teal-800/80'>
                    Total Carbohydrates
                  </p>
                  <p className='text-2xl font-bold text-teal-700'>
                    {fmt1(totals.carbohydrates)}{' '}
                    <span className='text-sm font-medium'>g</span>
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-white p-4'>
              <div className='flex items-center gap-3'>
                <div className='grid place-items-center rounded-lg bg-yellow-100 h-10 w-10'>
                  <FaDrumstickBite className='text-yellow-600' />
                </div>
                <div>
                  <p className='text-xs font-medium text-yellow-800/80'>
                    Total Protein
                  </p>
                  <p className='text-2xl font-bold text-yellow-700'>
                    {fmt1(totals.protein)}{' '}
                    <span className='text-sm font-medium'>g</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
        <h3 className='text-xl sm:text-2xl font-semibold text-slate-900 mb-4 text-center'>
          Foods in this Meal
        </h3>

        <FoodList
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
          foods={foods}
        />

        <p className='mt-3 text-xs text-center text-slate-500'>
          *Total calories, fat, carbohydrates, and protein change based on the{' '}
          <b>quantity</b> of each food.
        </p>
      </div>

      <div className='mt-6'>
        <button
          type='button'
          onClick={handleCreateMeal}
          disabled={loading}
          className={`w-full rounded-lg px-4 py-3 text-white shadow transition
            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Creating Meal...' : 'Create Meal'}
        </button>
      </div>
    </div>
  );
};

export default CreateMeal;
