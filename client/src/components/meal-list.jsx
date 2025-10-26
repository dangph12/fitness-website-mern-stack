import React, { useEffect, useMemo, useState } from 'react';
import { FaFireAlt, FaLeaf } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { deleteMeal, fetchMeals } from '~/store/features/meal-slice';

import UserCard from './user-card';

const MealsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { meals = [], loading, error } = useSelector(state => state.meals);
  const userId = useSelector(state => state.auth.user?.id);

  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    if (userId) dispatch(fetchMeals({ page: 1, limit: 10 }));
  }, [dispatch, userId]);

  const handleSelectMeal = meal => setSelectedMeal(meal);
  const handleCloseDetails = () => setSelectedMeal(null);
  const handleSelectFood = foodId => navigate(`/nutrition/food/${foodId}`);

  const fmt1 = n => (isFinite(n) ? Number(n).toFixed(1) : '0.0');

  const getTotals = foods =>
    foods?.reduce(
      (acc, item) => {
        const cal = Number(item?.food?.calories) || 0;
        const fat = Number(item?.food?.fat) || 0;
        const carb = Number(item?.food?.carbohydrate) || 0;
        const prot = Number(item?.food?.protein) || 0;
        const qty = Number(item?.quantity) || 0;
        acc.calories += cal * qty;
        acc.fat += fat * qty;
        acc.carbohydrates += carb * qty;
        acc.protein += prot * qty;
        return acc;
      },
      { calories: 0, fat: 0, carbohydrates: 0, protein: 0 }
    ) ?? { calories: 0, fat: 0, carbohydrates: 0, protein: 0 };

  const cardTotals = foods => getTotals(foods);
  const liveTotals = useMemo(
    () => getTotals(selectedMeal?.foods || []),
    [selectedMeal]
  );

  const handleDeleteMeal = mealId => {
    if (!userId) {
      toast.error('You are not logged in, cannot delete meal!');
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
      <div className='flex justify-center px-6 py-16'>
        <div className='w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm'>
          <div className='mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-600'>
            <svg
              viewBox='0 0 24 24'
              className='h-6 w-6'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V6h2Z' />
            </svg>
          </div>
          <h3 className='text-2xl font-bold text-slate-900'>
            You are not logged in
          </h3>
          <p className='mt-2 text-slate-600'>
            Please log in to view and manage your{' '}
            <span className='font-semibold'>Meals</span>.
          </p>

          <div className='mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <button
              onClick={() => navigate('/auth/login')}
              className='inline-flex items-center justify-center rounded-xl bg-[#3067B6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#275397]'
            >
              Log in to view Meals
            </button>
            <button
              onClick={() => navigate('/')}
              className='inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
            >
              Back to home page
            </button>
          </div>

          <p className='mt-4 text-sm text-slate-500'>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/auth/sign-up')}
              className='font-semibold text-[#3067B6] hover:underline'
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='max-w-7xl mx-auto p-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='rounded-lg border border-slate-200 overflow-hidden'
            >
              <div className='h-48 bg-slate-200' />
              <div className='p-4 space-y-3'>
                <div className='h-5 bg-slate-200 rounded w-2/3' />
                <div className='h-4 bg-slate-200 rounded w-1/3' />
                <div className='h-16 bg-slate-200 rounded' />
                <div className='h-10 bg-slate-200 rounded' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className='text-center text-red-500'>{error}</div>;
  if (!meals.length) {
    return (
      <div className='max-w-7xl mx-auto p-6'>
        <h1 className='text-3xl font-semibold mb-4'>Meals List</h1>
        <div className='rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600'>
          No meals found. Create your first meal!
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-8 flex items-end justify-between flex-wrap gap-3'>
        <h1 className='text-3xl font-semibold'>Meals List</h1>
        <div className='text-sm text-slate-500'>
          Total meals: <span className='font-medium'>{meals.length}</span>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {meals.map(meal => {
          const totals = cardTotals(meal.foods || []);
          return (
            <div
              key={meal._id}
              className='bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition'
            >
              <button
                type='button'
                className='block w-full'
                onClick={() => handleSelectMeal(meal)}
                title='View details'
              >
                <img
                  src={meal.image}
                  alt={meal.title}
                  className='w-full h-48 object-cover'
                />
              </button>

              <div className='p-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold text-slate-900'>
                    {meal.title}
                  </h2>
                  <span className='text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200'>
                    {meal.mealType}
                  </span>
                </div>

                <div className='mt-4 grid grid-cols-2 gap-3'>
                  <div className='rounded-lg border border-orange-200 bg-orange-50 p-3'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-orange-800'>
                      <FaFireAlt className='text-orange-500 text-lg' />
                      <span>
                        Calories:{' '}
                        <span className='text-orange-600'>
                          {fmt1(totals.calories)}
                        </span>{' '}
                        kcal
                      </span>
                    </div>
                  </div>

                  <div className='rounded-lg border border-green-200 bg-green-50 p-3'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-green-800'>
                      <FaLeaf className='text-green-600 text-lg' />
                      <span>
                        Fat:{' '}
                        <span className='text-green-700'>
                          {fmt1(totals.fat)}
                        </span>{' '}
                        g
                      </span>
                    </div>
                  </div>

                  <div className='rounded-lg border border-teal-200 bg-teal-50 p-3'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-teal-800'>
                      <FaLeaf className='text-teal-600 text-lg' />
                      <span>
                        Carbohydrates:{' '}
                        <span className='text-teal-600'>
                          {fmt1(totals.carbohydrates)}
                        </span>{' '}
                        g
                      </span>
                    </div>
                  </div>

                  <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-3'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-yellow-800'>
                      <FaLeaf className='text-yellow-600 text-lg' />
                      <span>
                        Protein:{' '}
                        <span className='text-yellow-600'>
                          {fmt1(totals.protein)}
                        </span>{' '}
                        g
                      </span>
                    </div>
                  </div>
                </div>

                <div className='mt-4 grid grid-cols-2 gap-3'>
                  <button
                    className='w-full bg-gradient-to-r from-yellow-300 to-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition'
                    onClick={() => navigate(`/nutrition/edit-meal/${meal._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className='w-full bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition'
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
        <div className='fixed inset-0 bg-black/20 backdrop-blur-[1px] flex justify-center items-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-4xl relative max-h-[85vh] overflow-auto'>
            <button
              onClick={handleCloseDetails}
              className='absolute top-3 right-3 text-2xl text-slate-600 hover:text-slate-800 leading-none'
              aria-label='Close'
            >
              &times;
            </button>

            <div className='p-6'>
              <div className='flex flex-col md:flex-row gap-5'>
                <div className='md:w-2/5'>
                  <img
                    src={selectedMeal.image}
                    alt={selectedMeal.title}
                    className='w-full h-94 object-cover rounded-xl border border-slate-200'
                  />
                </div>

                <div className='md:flex-1'>
                  <h2 className='text-2xl font-semibold text-slate-900'>
                    {selectedMeal.title}
                  </h2>
                  <p className='text-sm text-slate-600 mt-1'>
                    {selectedMeal.mealType}
                  </p>

                  <div className='mt-4 grid grid-cols-2 gap-4'>
                    <div className='rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 text-white p-4 shadow'>
                      <p className='text-sm opacity-90'>Total Calories</p>
                      <p className='text-2xl font-bold'>
                        {fmt1(liveTotals.calories)} kcal
                      </p>
                    </div>
                    <div className='rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white p-4 shadow'>
                      <p className='text-sm opacity-90'>Total Fat</p>
                      <p className='text-2xl font-bold'>
                        {fmt1(liveTotals.fat)} g
                      </p>
                    </div>
                    <div className='rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 text-white p-4 shadow'>
                      <p className='text-sm opacity-90'>Total Carbohydrates</p>
                      <p className='text-2xl font-bold'>
                        {fmt1(liveTotals.carbohydrates)} g
                      </p>
                    </div>
                    <div className='rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-4 shadow'>
                      <p className='text-sm opacity-90'>Total Protein</p>
                      <p className='text-2xl font-bold'>
                        {fmt1(liveTotals.protein)} g
                      </p>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <UserCard user={selectedMeal.user} />
                  </div>
                </div>
              </div>

              {/* Foods (read-only quantities) */}
              <div className='mt-7'>
                <h3 className='text-xl font-semibold mb-3'>
                  Foods in this Meal
                </h3>
                <ul className='space-y-3'>
                  {selectedMeal.foods.map((item, idx) => {
                    const f = item.food || {};
                    const unit = f.unit || 1;
                    const qty = Number(item.quantity) || 0;
                    const cal = Number(f.calories) || 0;
                    const fat = Number(f.fat) || 0;
                    const carb = Number(f.carbohydrate) || 0;
                    const prot = Number(f.protein) || 0;

                    return (
                      <li
                        key={item._id || `${f._id}-${idx}`}
                        className='flex items-center gap-4 border border-slate-200 p-4 rounded-xl hover:shadow-sm transition'
                      >
                        <button
                          type='button'
                          onClick={() => handleSelectFood(f._id)}
                          className='relative size-16 overflow-hidden rounded-full ring-1 ring-slate-200 shrink-0'
                          title='View food details'
                        >
                          <img
                            src={f.image}
                            alt={f.title}
                            className='absolute inset-0 h-full w-full object-cover'
                          />
                        </button>

                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-slate-900 truncate'>
                            {f.title}
                          </p>
                          <p className='text-xs text-slate-500 mt-0.5'>
                            Per {unit}{' '}
                            {f.category?.toLowerCase() === 'meat'
                              ? 'g'
                              : 'unit'}{' '}
                            • {fmt1(cal)} kcal • {fmt1(fat)} g fat •{' '}
                            {fmt1(carb)} g carbs • {fmt1(prot)} g protein
                          </p>
                          <div className='mt-2'>
                            <span className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200'>
                              Quantity: {qty} units
                            </span>
                          </div>
                        </div>

                        <div className='text-right shrink-0'>
                          <p className='text-sm text-slate-600'>Calories</p>
                          <p className='font-semibold'>
                            {fmt1(cal * qty)} kcal
                          </p>
                          <p className='mt-1 text-sm text-slate-600'>Fat</p>
                          <p className='font-semibold'>{fmt1(fat * qty)} g</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className='text-center my-6'>
                <div className='inline-flex gap-8 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm'>
                  <div className='text-slate-800'>
                    <p className='text-sm'>Total Calories</p>
                    <p className='text-2xl font-bold'>
                      {fmt1(liveTotals.calories)} kcal
                    </p>
                  </div>
                  <div className='text-slate-800'>
                    <p className='text-sm'>Total Fat</p>
                    <p className='text-2xl font-bold'>
                      {fmt1(liveTotals.fat)} g
                    </p>
                  </div>
                  <div className='text-slate-800'>
                    <p className='text-sm'>Total Carbohydrates</p>
                    <p className='text-2xl font-bold'>
                      {fmt1(liveTotals.carbohydrates)} g
                    </p>
                  </div>
                  <div className='text-slate-800'>
                    <p className='text-sm'>Total Protein</p>
                    <p className='text-2xl font-bold'>
                      {fmt1(liveTotals.protein)} g
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsList;
