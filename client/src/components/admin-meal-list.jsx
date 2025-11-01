import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaFireAlt,
  FaLeaf,
  FaTimes,
  FaUser,
  FaUserShield,
  FaUtensils
} from 'react-icons/fa';
import { GiAvocado, GiBreadSlice, GiFruitBowl } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { fetchAdminMeals } from '~/store/features/meal-slice';

import { ScrollArea, ScrollBar } from './ui/scroll-area';

export default function AdminMealList() {
  const dispatch = useDispatch();
  const { adminMeals, loading, error } = useSelector(state => state.meals);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminMeals())
      .unwrap()
      .catch(() => toast.error('Failed to load admin meals.'));
  }, [dispatch]);

  const fmt = n => (isFinite(n) ? Number(n).toFixed(1) : '0.0');

  const calcTotal = foods => {
    if (!foods) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return foods.reduce(
      (acc, item) => {
        const f = item.food || {};
        const qty = Number(item.quantity) || 0;
        acc.calories += (Number(f.calories) || 0) * qty;
        acc.protein += (Number(f.protein) || 0) * qty;
        acc.carbs += (Number(f.carbohydrate) || 0) * qty;
        acc.fat += (Number(f.fat) || 0) * qty;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const openMeal = meal => {
    setSelectedMeal(meal);
    document.body.style.overflow = 'hidden';
  };

  const closeMeal = () => {
    setSelectedMeal(null);
    document.body.style.overflow = '';
  };

  if (loading)
    return (
      <div className='text-center p-8 text-slate-500 animate-pulse'>
        Loading admin meals...
      </div>
    );

  if (error)
    return <div className='text-center text-red-500 py-8'>{error}</div>;

  if (!adminMeals?.length)
    return (
      <div className='text-center text-slate-500 py-10'>
        No admin meals available.
      </div>
    );

  return (
    <section className='mt-5 px-6 mb-20'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-slate-900 flex items-center gap-2'>
          <FaUtensils className='text-rose-500' /> Admin Meal Templates
        </h2>
        <p className='text-sm text-slate-500'>
          {adminMeals.length} templates available
        </p>
      </div>

      <ScrollArea className='w-full border border-slate-200 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner'>
        <div className='flex gap-6 p-6 w-max'>
          {adminMeals.map(meal => {
            const total = calcTotal(meal.foods);
            return (
              <button
                key={meal._id}
                onClick={() => openMeal(meal)}
                className='w-[280px] min-w-[280px] h-[380px] text-left rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col'
              >
                {meal.image ? (
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className='w-full h-40 object-cover'
                  />
                ) : (
                  <div className='w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400'>
                    <FaUtensils size={28} />
                  </div>
                )}

                <div className='p-4 flex-1 flex flex-col'>
                  <h3 className='font-semibold text-slate-900 text-base line-clamp-2 min-h-[44px]'>
                    {meal.title}
                  </h3>
                  <p className='text-xs text-slate-500 uppercase tracking-wide mt-1'>
                    {meal.mealType || 'Meal'}
                  </p>

                  <div className='grid grid-cols-2 gap-2 mt-3'>
                    <div className='h-9 flex items-center justify-center text-xs text-orange-700 bg-orange-50 px-2 rounded-md border border-orange-100'>
                      <FaFireAlt size={12} className='mr-1' />{' '}
                      {fmt(total.calories)} kcal
                    </div>
                    <div className='h-9 flex items-center justify-center text-xs text-green-700 bg-green-50 px-2 rounded-md border border-green-100'>
                      <FaLeaf size={12} className='mr-1' /> {fmt(total.protein)}{' '}
                      g Protein
                    </div>
                    <div className='h-9 flex items-center justify-center text-xs text-teal-700 bg-teal-50 px-2 rounded-md border border-teal-100'>
                      <GiBreadSlice size={13} className='mr-1' />{' '}
                      {fmt(total.carbs)} g Carbs
                    </div>
                    <div className='h-9 flex items-center justify-center text-xs text-yellow-700 bg-yellow-50 px-2 rounded-md border border-yellow-100'>
                      <GiAvocado size={13} className='mr-1' /> {fmt(total.fat)}{' '}
                      g Fat
                    </div>
                  </div>

                  <div className='mt-auto' />
                </div>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {selectedMeal && (
        <div
          className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center p-6 overflow-y-auto'
          onClick={closeMeal}
        >
          <div
            onClick={e => e.stopPropagation()}
            className='max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative flex flex-col my-auto'
          >
            <button
              onClick={closeMeal}
              className='absolute top-4 right-4 text-slate-500 hover:text-rose-500 transition'
            >
              <FaTimes size={24} />
            </button>

            {selectedMeal.image ? (
              <img
                src={selectedMeal.image}
                alt={selectedMeal.title}
                className='w-full h-72 object-cover border-b border-slate-200'
              />
            ) : (
              <div className='w-full h-72 bg-slate-100 flex items-center justify-center text-slate-400 border-b border-slate-200'>
                <FaUtensils size={40} />
              </div>
            )}

            <ScrollArea className='p-8'>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='col-span-1 lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 min-h-[120px] flex flex-col justify-center'>
                  <h2 className='text-3xl font-bold text-slate-900 flex items-center gap-3'>
                    <FaUtensils className='text-rose-500' />{' '}
                    {selectedMeal.title}
                  </h2>
                  <p className='text-slate-500 mt-2 text-sm'>
                    Type: {selectedMeal.mealType}
                  </p>
                </div>

                <div className='bg-white border border-slate-200 rounded-2xl p-6 min-h-[180px] flex flex-col'>
                  <h3 className='text-lg font-semibold text-slate-800 mb-4'>
                    Nutrition
                  </h3>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div className='h-10 flex items-center justify-center bg-orange-50 rounded-md border border-orange-100'>
                      <FaFireAlt className='text-orange-600 mr-2' />
                      {fmt(calcTotal(selectedMeal.foods).calories)} kcal
                    </div>
                    <div className='h-10 flex items-center justify-center bg-green-50 rounded-md border border-green-100'>
                      <FaLeaf className='text-green-600 mr-2' />
                      {fmt(calcTotal(selectedMeal.foods).protein)} g Protein
                    </div>
                    <div className='h-10 flex items-center justify-center bg-teal-50 rounded-md border border-teal-100'>
                      <GiBreadSlice className='text-teal-600 mr-2' />
                      {fmt(calcTotal(selectedMeal.foods).carbs)} g Carbs
                    </div>
                    <div className='h-10 flex items-center justify-center bg-yellow-50 rounded-md border border-yellow-100'>
                      <GiAvocado className='text-yellow-600 mr-2' />
                      {fmt(calcTotal(selectedMeal.foods).fat)} g Fat
                    </div>
                  </div>
                  <div className='mt-auto' />
                </div>

                <div className='bg-white border border-slate-200 rounded-2xl p-6 min-h-[180px] flex flex-col'>
                  <h3 className='text-lg font-semibold text-slate-800 mb-4'>
                    Created by
                  </h3>
                  <div className='flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200'>
                    <FaUserShield className='text-indigo-600 text-lg' />
                    <div className='space-y-1'>
                      <p className='font-medium text-slate-800'>
                        {selectedMeal.user?.name}
                      </p>
                      <p className='text-xs text-slate-500 flex items-center gap-2'>
                        <FaEnvelope /> {selectedMeal.user?.email}
                      </p>
                      <p className='text-xs text-slate-500'>
                        Role: {selectedMeal.user?.role} • Membership:{' '}
                        {selectedMeal.user?.membershipLevel}
                      </p>
                    </div>
                  </div>
                  <div className='mt-auto' />
                </div>

                <div className='bg-white border border-slate-200 rounded-2xl p-6 min-h-[180px] flex flex-col'>
                  <h3 className='text-lg font-semibold text-slate-800 mb-4'>
                    Meta
                  </h3>
                  <div className='space-y-3 text-sm text-slate-700'>
                    <div className='flex items-center gap-2'>
                      <FaCalendarAlt className='text-slate-400' />
                      Created:{' '}
                      {new Date(selectedMeal.createdAt).toLocaleString(
                        'en-GB',
                        {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <FaClock className='text-slate-400' />
                      Updated:{' '}
                      {new Date(selectedMeal.updatedAt).toLocaleString(
                        'en-GB',
                        {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }
                      )}
                    </div>
                  </div>
                  <div className='mt-auto' />
                </div>

                <div className='col-span-1 lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 min-h-[260px]'>
                  <h3 className='text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2'>
                    <GiFruitBowl className='text-emerald-500' /> Foods in this
                    meal
                  </h3>
                  <div className='border border-slate-200 rounded-xl max-h-64 overflow-y-auto'>
                    <div className='divide-y divide-slate-100'>
                      {selectedMeal.foods?.length ? (
                        selectedMeal.foods.map((f, i) => (
                          <div
                            key={i}
                            className='flex justify-between items-center px-5 py-3 text-sm hover:bg-slate-50'
                          >
                            <div className='flex items-center gap-3'>
                              <img
                                src={f.food?.image}
                                alt={f.food?.title}
                                className='w-12 h-12 rounded-lg border object-cover'
                              />
                              <div>
                                <p className='font-medium text-slate-800'>
                                  {f.food?.title}
                                </p>
                                <p className='text-xs text-slate-500'>
                                  {f.food?.category} • {f.food?.calories} kcal /{' '}
                                  {f.food?.unit}g
                                </p>
                              </div>
                            </div>
                            <span className='text-slate-600 font-medium'>
                              × {f.quantity || 1}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className='text-center text-slate-400 py-4'>
                          No foods listed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <ScrollBar orientation='vertical' />
            </ScrollArea>
          </div>
        </div>
      )}
    </section>
  );
}
