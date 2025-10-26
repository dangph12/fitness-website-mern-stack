import { useLayoutEffect, useMemo, useState } from 'react';
import { FaDrumstickBite, FaFire } from 'react-icons/fa';
import { GiMeal } from 'react-icons/gi';
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
    if (!title.trim()) return toast.warning('Please enter a meal title.');
    if (!selectedFoods.length) return toast.warning('Add at least one food.');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('mealType', mealType);
    formData.append('user', userId);
    if (image) formData.append('image', image);

    selectedFoods.forEach((food, index) => {
      formData.append(`foods[${index}][food]`, food.food);
      formData.append(
        `foods[${index}][quantity]`,
        String(Number(food.quantity) || 0)
      );
    });

    setLoading(true);
    try {
      await dispatch(createMeal(formData));
      toast.success('Meal saved successfully! 🍽️');
      navigate('/nutrition');
    } catch {
      toast.error('Something went wrong.');
    }
    setLoading(false);
  };

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/'))
      return toast.warning('Select a valid image.');
    setImage(file);
  };

  const fmt0 = n => (isFinite(n) ? Math.round(Number(n)) : 0);
  const fmt1 = n => (isFinite(n) ? Number(n).toFixed(1) : '0.0');

  return (
    <div className='max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl'>
      <h1 className='text-4xl font-bold text-center text-slate-900 mb-10 flex justify-center items-center gap-3'>
        Build Your Meal
        <GiMeal className='text-emerald-600 text-4xl' />
      </h1>

      <div className='flex flex-col lg:flex-row gap-10'>
        <div className='w-full lg:w-1/2 space-y-6'>
          <div>
            <label className='block mb-2 text-sm font-medium text-slate-700'>
              Meal Name
            </label>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-200 outline-none'
              placeholder='e.g. High Protein Breakfast'
            />
          </div>

          <div>
            <label className='block mb-2 text-sm font-medium text-slate-700'>
              Meal Type
            </label>
            <select
              value={mealType}
              onChange={e => setMealType(e.target.value)}
              className='w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-200 outline-none'
            >
              {[
                'Breakfast',
                'Lunch',
                'Dinner',
                'Snack',
                'Brunch',
                'Dessert'
              ].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-4 text-center text-sm font-medium'>
            <StatBlock
              icon={<FaFire />}
              label='Calories'
              value={`${fmt0(totals.calories)} kcal`}
              color='orange'
            />
            <StatBlock
              icon={<FaDrumstickBite />}
              label='Protein'
              value={`${fmt1(totals.protein)} g`}
              color='yellow'
            />
            <StatBlock
              icon={<FaDrumstickBite />}
              label='Fat'
              value={`${fmt1(totals.fat)} g`}
              color='green'
            />
            <StatBlock
              icon={<FaDrumstickBite />}
              label='Carbs'
              value={`${fmt1(totals.carbohydrates)} g`}
              color='teal'
            />
          </div>
        </div>

        <div className='w-full lg:w-1/2 space-y-5'>
          <div className='rounded-2xl border border-slate-200 bg-white shadow-sm p-6'>
            <h2 className='text-center text-lg font-semibold text-slate-700 mb-4'>
              Meal Image
            </h2>

            <div className='overflow-hidden rounded-xl border border-slate-200 shadow-sm'>
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  className='w-full h-72 object-cover'
                />
              ) : (
                <div className='w-full h-72 bg-slate-100 grid place-items-center text-slate-400'>
                  No Image Selected
                </div>
              )}
            </div>

            <label className='block mt-5 text-sm font-medium text-slate-700 cursor-pointer'>
              <span className='inline-flex items-center gap-2'>
                <MdFileUpload className='text-emerald-600 text-lg' /> Upload
                Image
              </span>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
            </label>
          </div>
        </div>
      </div>

      <div className='mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
        <h3 className='text-2xl font-semibold text-center text-slate-900 mb-6'>
          Foods in This Meal
        </h3>

        <FoodList
          selectedFoods={selectedFoods}
          setSelectedFoods={setSelectedFoods}
          foods={foods}
        />

        <p className='mt-3 text-xs text-center text-slate-500'>
          Nutritional totals update automatically based on <b>quantity</b>.
        </p>
      </div>

      <div className='mt-8'>
        <button
          onClick={handleCreateMeal}
          disabled={loading}
          className={`w-full rounded-xl py-3 text-white font-semibold shadow-md transition
          ${loading ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {loading ? 'Saving...' : 'Save Meal'}
        </button>
      </div>
    </div>
  );
};

export default CreateMeal;

const StatBlock = ({ icon, label, value, color }) => (
  <div className={`rounded-xl border p-4 bg-${color}-50 border-${color}-200`}>
    <div className='flex items-center justify-center gap-2 text-slate-700'>
      {icon} <span>{label}</span>
    </div>
    <p className='text-xl font-bold text-slate-800 mt-1'>{value}</p>
  </div>
);
