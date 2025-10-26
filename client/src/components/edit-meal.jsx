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
    if (!file.type?.startsWith('image/'))
      return toast.warning('Must be an image file.');
    setImage(file);
  };

  const totals = useMemo(
    () =>
      selectedFoods.reduce(
        (acc, item) => {
          const qty = Number(item.quantity) || 0;
          acc.calories += item.calories * qty;
          acc.fat += item.fat * qty;
          acc.carbohydrates += item.carbohydrate * qty;
          acc.protein += item.protein * qty;
          return acc;
        },
        { calories: 0, fat: 0, carbohydrates: 0, protein: 0 }
      ),
    [selectedFoods]
  );

  const handleUpdateMeal = async () => {
    if (!title.trim()) return toast.error('Meal title is required.');

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('mealType', mealType);
      formData.append('user', userId);

      if (image instanceof File) formData.append('image', image);

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
    } catch {
      toast.error('Failed to update meal.');
    } finally {
      setSubmitting(false);
    }
  };

  if (mealLoading)
    return (
      <div className='p-10 text-center text-slate-500 animate-pulse'>
        Loading meal...
      </div>
    );
  if (error)
    return <div className='p-10 text-center text-red-500'>{error}</div>;

  return (
    <div className='max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-lg'>
      <h1 className='text-4xl font-bold text-center text-slate-900 mb-12 flex items-center justify-center gap-3'>
        <FaLeaf className='text-emerald-600' />
        Refine Your Meal
      </h1>

      <div className='flex flex-col lg:flex-row-reverse gap-10'>
        <div className='w-full lg:w-1/2'>
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
            <h2 className='text-base font-semibold text-slate-700 mb-3 text-center'>
              Meal Image
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
                <MdFileUpload className='text-emerald-600 text-lg' /> Change
                Image
              </span>
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full file:mr-4 file:rounded-md file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-700
                       rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200'
            />
          </div>
        </div>

        <div className='w-full lg:w-1/2 space-y-6'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              <span className='inline-flex items-center gap-2'>
                <FaClipboardList className='text-blue-600' /> Meal Name
              </span>
            </label>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Ex: High Protein Breakfast Bowl'
              className='w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200'
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
              className='w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200'
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
              <option>Brunch</option>
              <option>Dessert</option>
            </select>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            <div className='rounded-xl bg-orange-50 border border-orange-200 p-4 text-center'>
              <FaFire className='text-orange-600 text-2xl mx-auto mb-1' />
              <p className='text-xs text-slate-600'>Calories</p>
              <p className='text-xl font-bold text-slate-800'>
                {Math.round(totals.calories)}{' '}
                <span className='text-sm'>kcal</span>
              </p>
            </div>

            <div className='rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-center'>
              <FaLeaf className='text-yellow-600 text-2xl mx-auto mb-1' />
              <p className='text-xs text-slate-600'>Protein</p>
              <p className='text-xl font-bold text-slate-800'>
                {totals.protein.toFixed(1)} <span className='text-sm'>g</span>
              </p>
            </div>

            <div className='rounded-xl bg-green-50 border border-green-200 p-4 text-center'>
              <FaDrumstickBite className='text-green-600 text-2xl mx-auto mb-1' />
              <p className='text-xs text-slate-600'>Fat</p>
              <p className='text-xl font-bold text-slate-800'>
                {totals.fat.toFixed(1)} <span className='text-sm'>g</span>
              </p>
            </div>

            <div className='rounded-xl bg-teal-50 border border-teal-200 p-4 text-center'>
              <FaDrumstickBite className='text-teal-600 text-2xl mx-auto mb-1' />
              <p className='text-xs text-slate-600'>Carbs</p>
              <p className='text-xl font-bold text-slate-800'>
                {totals.carbohydrates.toFixed(1)}{' '}
                <span className='text-sm'>g</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
        <h3 className='text-2xl font-semibold text-slate-900 mb-4 text-center'>
          Foods in this Meal
        </h3>
        <FoodList
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
        />
        <p className='mt-3 text-xs text-center text-slate-500'>
          *Adjust quantities to update nutrition values.
        </p>
      </div>

      <div className='mt-6'>
        <button
          onClick={handleUpdateMeal}
          disabled={submitting}
          className={`w-full rounded-lg px-4 py-3 text-white text-lg font-medium shadow transition
        ${submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {submitting ? 'Saving Changes...' : 'Save Meal Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditMeal;
