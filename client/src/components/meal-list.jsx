import React, { useEffect, useMemo, useState } from 'react';
import {
  FaDrumstickBite,
  FaEdit,
  FaFireAlt,
  FaLeaf,
  FaTrash,
  FaUtensils
} from 'react-icons/fa';
import { GiAvocado, GiBreadSlice } from 'react-icons/gi';
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
      <div className='flex justify-center px-6 py-20 text-center'>
        <div className='max-w-md bg-white border border-slate-200 rounded-2xl p-10 shadow'>
          <h2 className='text-2xl font-semibold text-slate-900'>
            You are not logged in
          </h2>
          <p className='mt-2 text-slate-600'>
            Please sign in to view your meals.
          </p>

          <div className='mt-6 flex flex-col gap-3'>
            <button
              onClick={() => navigate('/auth/login')}
              className='px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition'
            >
              Log in
            </button>

            <button
              onClick={() => navigate('/auth/sign-up')}
              className='px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition'
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className='text-center p-10 text-slate-500'>Loading meals...</div>
    );
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  if (!meals.length) {
    return (
      <div className='text-center p-20 text-slate-600'>
        <h2 className='text-2xl font-semibold mb-2'>No meals yet</h2>
        <p>Create your first meal to start tracking nutrition!</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-12 text-center'>
        <h1 className='text-4xl font-bold text-slate-900 flex items-center justify-center gap-3'>
          <FaLeaf className='text-emerald-600' />
          Your Meals
        </h1>
        <p className='mt-2 text-slate-600'>
          Track, refine, and customize your daily nutrition.
        </p>
        <p className='mt-2 text-sm text-slate-500'>
          Total meals: <span className='font-semibold'>{meals.length}</span>
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {meals.map(meal => {
          const totals = getTotals(meal.foods);

          return (
            <div
              key={meal._id}
              className='group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden'
            >
              <button
                onClick={() => handleSelectMeal(meal)}
                className='block w-full'
              >
                <img
                  src={meal.image}
                  alt={meal.title}
                  className='w-full h-48 object-cover group-hover:scale-[1.05] transition duration-300'
                />
              </button>

              <div className='p-5'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
                    <FaUtensils className='text-indigo-500' />
                    {meal.title}
                  </h2>
                  <span className='text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200'>
                    {meal.mealType}
                  </span>
                </div>

                <div className='mt-4 grid grid-cols-2 gap-3 text-sm font-medium'>
                  <div className='flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 shadow-sm'>
                    <FaFireAlt className='text-orange-500' />
                    {fmt1(totals.calories)} kcal
                  </div>
                  <div className='flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 shadow-sm'>
                    <FaLeaf className='text-green-600' />
                    {fmt1(totals.protein)} g Protein
                  </div>
                  <div className='flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 shadow-sm'>
                    <FaLeaf className='text-teal-600' />
                    {fmt1(totals.carbohydrates)} g Carbs
                  </div>
                  <div className='flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 shadow-sm'>
                    <FaLeaf className='text-yellow-600' />
                    {fmt1(totals.fat)} g Fat
                  </div>
                </div>

                <div className='mt-6 grid grid-cols-2 gap-3'>
                  <button
                    onClick={() => navigate(`/nutrition/edit-meal/${meal._id}`)}
                    className='py-2.5 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow-md transition'
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    className='py-2.5 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-sm hover:shadow-md transition'
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMeal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-6 animate-fadeIn'>
          <div className='bg-white w-full max-w-[1100px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col'>
            <button
              onClick={handleCloseDetails}
              className='absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full bg-white/90 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm transition'
            >
              ✕
            </button>

            <div className='flex flex-col md:flex-row gap-8 p-8'>
              <div className='md:w-[42%] w-full'>
                <img
                  src={selectedMeal.image}
                  alt={selectedMeal.title}
                  className='w-full h-[340px] object-cover rounded-2xl border shadow-sm'
                />
              </div>

              <div className='flex-1'>
                <h2 className='text-3xl font-bold text-slate-900 flex items-center gap-3 leading-tight'>
                  <FaUtensils className='text-indigo-500' />
                  {selectedMeal.title}
                </h2>
                <p className='text-sm text-slate-600 mt-1 capitalize'>
                  {selectedMeal.mealType}
                </p>

                <div className='mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {[
                    {
                      label: 'Calories',
                      value: liveTotals.calories,
                      unit: 'kcal',
                      icon: <FaFireAlt className='text-orange-500' />,
                      bg: 'bg-orange-50',
                      border: 'border-orange-200',
                      text: 'text-orange-800'
                    },
                    {
                      label: 'Protein',
                      value: liveTotals.protein,
                      unit: 'g',
                      icon: <FaDrumstickBite className='text-green-600' />,
                      bg: 'bg-green-50',
                      border: 'border-green-200',
                      text: 'text-green-800'
                    },
                    {
                      label: 'Carbs',
                      value: liveTotals.carbohydrates,
                      unit: 'g',
                      icon: <GiBreadSlice className='text-teal-600' />,
                      bg: 'bg-teal-50',
                      border: 'border-teal-200',
                      text: 'text-teal-800'
                    },
                    {
                      label: 'Fat',
                      value: liveTotals.fat,
                      unit: 'g',
                      icon: <GiAvocado className='text-yellow-600' />,
                      bg: 'bg-yellow-50',
                      border: 'border-yellow-200',
                      text: 'text-yellow-800'
                    }
                  ].map(stat => (
                    <div
                      key={stat.label}
                      className={`rounded-2xl ${stat.bg} border ${stat.border} p-4 shadow-sm text-center transition hover:shadow-md`}
                    >
                      <div className='flex items-center justify-center gap-2 text-sm font-semibold opacity-90'>
                        {stat.icon}{' '}
                        <span className={stat.text}>{stat.label}</span>
                      </div>

                      <p
                        className={`text-xl font-bold mt-1 ${stat.text} whitespace-nowrap leading-tight tracking-tight`}
                      >
                        {fmt1(stat.value)} {stat.unit}
                      </p>
                    </div>
                  ))}
                </div>

                <div className='mt-8'>
                  <UserCard user={selectedMeal.user} />
                </div>
              </div>
            </div>

            <div className='px-8 pb-8 overflow-y-auto pr-3'>
              <h3 className='flex items-center gap-2 text-lg font-medium text-slate-700 mb-5 tracking-wide'>
                <FaUtensils className='text-slate-500 text-base' />
                Foods in this meal
              </h3>

              <div className='space-y-4'>
                {selectedMeal.foods.map((item, idx) => {
                  const f = item.food || {};
                  const qty = Number(item.quantity) || 0;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectFood(f._id)}
                      className='flex items-center gap-5 p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-lg transition cursor-pointer'
                    >
                      <img
                        src={f.image}
                        alt={f.title}
                        className='w-20 h-20 rounded-xl object-cover border shadow-sm'
                      />

                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-slate-900 truncate text-lg'>
                          {f.title}
                        </p>

                        <div className='flex flex-wrap gap-2 mt-2'>
                          <span className='flex items-center gap-1 text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 text-xs font-medium'>
                            <FaFireAlt className='text-orange-500' />{' '}
                            {fmt1(f.calories)} kcal
                          </span>

                          <span className='flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200 text-xs font-medium'>
                            <FaDrumstickBite className='text-green-600' />{' '}
                            {fmt1(f.protein)} g Protein
                          </span>

                          <span className='flex items-center gap-1 text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 text-xs font-medium'>
                            <GiBreadSlice className='text-teal-600' />{' '}
                            {fmt1(f.carbohydrate)} g Carbs
                          </span>

                          <span className='flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-200 text-xs font-medium'>
                            <GiAvocado className='text-yellow-600' />{' '}
                            {fmt1(f.fat)} g Fat
                          </span>
                        </div>
                      </div>

                      <span className='text-sm font-semibold text-slate-800 bg-slate-100 px-4 py-1.5 rounded-full shadow-sm'>
                        × {qty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsList;
