import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  FaClipboardList,
  FaDrumstickBite,
  FaFire,
  FaHamburger,
  FaLeaf
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
  const userId = useSelector(state => state.auth.user?.id);

  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [image, setImage] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (id) dispatch(fetchMealById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentMeal) return;
    setTitle(currentMeal.title || '');
    setMealType(currentMeal.mealType || 'Breakfast');
    setImage(currentMeal.image || null);

    const foods = (currentMeal.foods || []).map(f => ({
      food: f.food?._id,
      title: f.food?.title || '',
      image: f.food?.image || '',
      calories: Number(f.food?.calories) || 0,
      fat: Number(f.food?.fat) || 0,
      carbohydrate: Number(f.food?.carbohydrate) || 0,
      protein: Number(f.food?.protein) || 0,
      quantity: Number(f.quantity) || 1
    }));
    setSelectedFoods(foods);
  }, [currentMeal]);

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      toast.warning('Please select a valid image file.');
      return;
    }
    setImage(file);
  };

  const totals = useMemo(() => {
    return selectedFoods.reduce(
      (acc, item) => {
        const qty = Number(item.quantity) || 0;
        acc.calories += (Number(item.calories) || 0) * qty;
        acc.fat += (Number(item.fat) || 0) * qty;
        acc.carbohydrates += (Number(item.carbohydrate) || 0) * qty;
        acc.protein += (Number(item.protein) || 0) * qty;
        return acc;
      },
      { calories: 0, fat: 0, carbohydrates: 0, protein: 0 }
    );
  }, [selectedFoods]);

  const handleUpdateMeal = async () => {
    if (!title.trim()) {
      toast.error('Meal title is required.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('mealType', mealType);
      formData.append('user', userId);

      if (image instanceof File) {
        formData.append('image', image);
      }

      selectedFoods.forEach((f, i) => {
        formData.append(`foods[${i}][food]`, f.food);
        formData.append(
          `foods[${i}][quantity]`,
          String(Number(f.quantity) || 0)
        );
      });

      await dispatch(updateMeal({ id, updateData: formData }));
      toast.success('Meal updated successfully!');
      navigate('/nutrition');
    } catch (err) {
      console.error('Error updating meal:', err);
      toast.error('Failed to update meal!');
    } finally {
      setSubmitting(false);
    }
  };

  if (mealLoading) {
    return (
      <div className='max-w-6xl mx-auto p-8'>
        <div className='animate-pulse space-y-6'>
          <div className='h-10 bg-slate-200 rounded w-1/3'></div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='h-80 bg-slate-200 rounded-xl'></div>
            <div className='space-y-4'>
              <div className='h-12 bg-slate-200 rounded'></div>
              <div className='h-12 bg-slate-200 rounded'></div>
              <div className='h-20 bg-slate-200 rounded'></div>
            </div>
          </div>
          <div className='h-48 bg-slate-200 rounded-xl'></div>
          <div className='h-12 bg-slate-200 rounded'></div>
        </div>
      </div>
    );
  }

  if (error)
    return <div className='max-w-6xl mx-auto p-8 text-red-500'>{error}</div>;

  return (
    <div className='max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-lg'>
      <h1 className='text-3xl sm:text-4xl font-semibold text-center text-slate-900 mb-8'>
        Edit Meal
      </h1>

      <div className='flex flex-col lg:flex-row-reverse gap-8 lg:gap-10'>
        <div className='w-full lg:w-1/2'>
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
            <h2 className='text-base font-semibold text-slate-700 mb-3 text-center'>
              Current Meal Image
            </h2>

            <div className='overflow-hidden rounded-xl border border-slate-200 shadow-sm'>
              {image ? (
                <img
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt='Meal'
                  className='w-full h-72 object-cover'
                />
              ) : currentMeal?.image ? (
                <img
                  src={currentMeal.image}
                  alt='Meal'
                  className='w-full h-72 object-cover'
                />
              ) : (
                <div className='w-full h-72 bg-slate-200 grid place-items-center text-slate-500'>
                  No image
                </div>
              )}
            </div>

            <label className='block text-sm font-medium text-slate-700 mt-5 mb-2'>
              <span className='inline-flex items-center gap-2'>
                <MdFileUpload className='text-green-600 text-lg' /> Upload New
                Image
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
                    {Math.round(totals.calories)}{' '}
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
                    {totals.fat.toFixed(1)}{' '}
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
                    {totals.carbohydrates.toFixed(1)}{' '}
                    <span className='text-sm font-medium'>g</span>
                  </p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-white p-4'>
              <div className='flex items-center gap-3'>
                <div className='grid place-items-center rounded-lg bg-yellow-100 h-10 w-10'>
                  <FaLeaf className='text-yellow-600' />
                </div>
                <div>
                  <p className='text-xs font-medium text-yellow-800/80'>
                    Total Protein
                  </p>
                  <p className='text-2xl font-bold text-yellow-700'>
                    {totals.protein.toFixed(1)}{' '}
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
        />
        <p className='mt-3 text-xs text-center text-slate-500'>
          *Total calories, fat, carbohydrates, and protein change based on the{' '}
          <b>quantity</b> of each food.
        </p>
      </div>

      <div className='mt-6'>
        <button
          type='button'
          onClick={handleUpdateMeal}
          disabled={submitting}
          className={`w-full rounded-lg px-4 py-3 text-white shadow transition
          ${submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {submitting ? 'Updating Meal...' : 'Update Meal'}
        </button>
      </div>
    </div>
  );
};

export default EditMeal;
