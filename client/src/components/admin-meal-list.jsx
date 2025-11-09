import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaClone,
  FaEnvelope,
  FaFireAlt,
  FaLeaf,
  FaTimes,
  FaUserShield,
  FaUtensils
} from 'react-icons/fa';
import { FiBookOpen } from 'react-icons/fi';
import { GiAvocado, GiBreadSlice, GiFruitBowl } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import {
  cloneAdminMealToUser,
  fetchAdminMeals
} from '~/store/features/meal-slice';

import { ScrollArea, ScrollBar } from './ui/scroll-area';

export default function AdminMealList() {
  const dispatch = useDispatch();

  const { adminMeals, loading, error } = useSelector(s => s.meals);
  const userId = useSelector(s => s.auth.user?._id || s.auth.user?.id);

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminMeals())
      .unwrap()
      .catch(() => toast.error('Failed to load admin meals.'));
  }, [dispatch]);

  const fmt = useCallback(
    n => (Number.isFinite(+n) ? Number(n).toFixed(1) : '0.0'),
    []
  );

  const calcTotal = useCallback(foods => {
    if (!Array.isArray(foods))
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return foods.reduce(
      (acc, item) => {
        const f = item?.food || {};
        const qty = Number(item?.quantity) || 0;
        acc.calories += (Number(f.calories) || 0) * qty;
        acc.protein += (Number(f.protein) || 0) * qty;
        acc.carbs += (Number(f.carbohydrate) || 0) * qty;
        acc.fat += (Number(f.fat) || 0) * qty;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, []);

  const totalsForList = useMemo(
    () => adminMeals.map(m => calcTotal(m.foods)),
    [adminMeals, calcTotal]
  );

  const selectedTotals = useMemo(
    () => calcTotal(selectedMeal?.foods),
    [selectedMeal, calcTotal]
  );

  const openMeal = meal => setSelectedMeal(meal);
  const closeMeal = () => setSelectedMeal(null);

  useEffect(() => {
    if (!selectedMeal) return;
    const onKey = e => e.key === 'Escape' && closeMeal();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedMeal]);

  const handleClone = async () => {
    if (!selectedMeal?._id) return;
    if (!userId) {
      toast.error('You must be logged in to clone.');
      return;
    }
    try {
      setCloning(true);
      const today = new Date().toISOString().slice(0, 10);
      const newMeal = await dispatch(
        cloneAdminMealToUser({
          mealId: selectedMeal._id,
          body: { userId, scheduledAt: today }
        })
      ).unwrap();

      toast.success(`Cloned: ${newMeal?.title || 'Meal'}`);
      closeMeal();
    } catch (e) {
      toast.error(typeof e === 'string' ? e : 'Clone failed');
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className='text-center p-8 text-slate-500 animate-pulse'>
        Loading admin meals...
      </div>
    );
  }
  if (error) {
    return <div className='text-center text-red-500 py-8'>{error}</div>;
  }
  if (!adminMeals?.length) {
    return (
      <div className='text-center text-slate-500 py-10'>
        No admin meals available.
      </div>
    );
  }

  return (
    <section className='mt-5 mb-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-0'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='flex items-center gap-2 text-2xl font-bold'>
            <span className='rounded-lg p-2 ring-1 ring-rose-200/60'>
              <FiBookOpen className='text-rose-500' />
            </span>
            <span className='bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent'>
              Template Library
            </span>
          </h2>

          <span className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 px-3 py-1 text-xs font-semibold text-white shadow-sm'>
            <span className='h-2 w-2 rounded-full bg-white/80' />
            {adminMeals.length} templates
          </span>
        </div>

        <ScrollArea className='w-full border border-slate-200 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-inner'>
          <div className='flex gap-6 p-6 w-max'>
            {adminMeals.map((meal, idx) => {
              const total = totalsForList[idx] || {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
              };
              return (
                <button
                  key={meal._id}
                  onClick={() => openMeal(meal)}
                  aria-label={`Open ${meal.title}`}
                  className='group relative w-[290px] min-w-[290px] h-[400px] rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-[0_4px_24px_rgba(16,185,129,0.25)] hover:-translate-y-2 transition-all duration-300 flex flex-col'
                >
                  {meal.image ? (
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className='w-full h-44 object-cover group-hover:scale-[1.06] transition duration-500'
                    />
                  ) : (
                    <div className='w-full h-44 bg-slate-100 flex items-center justify-center text-slate-400'>
                      <FaUtensils size={28} />
                    </div>
                  )}

                  <span className='absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-white/80 backdrop-blur border border-slate-200 text-slate-600 uppercase shadow-sm'>
                    {meal.mealType || 'Meal'}
                  </span>

                  <div className='p-4 flex-1 flex flex-col'>
                    <h3 className='font-semibold text-slate-900 text-base line-clamp-2 max-w-[90%]'>
                      {meal.title}
                    </h3>

                    <div className='grid grid-cols-2 gap-2 mt-4 text-xs'>
                      <div className='h-9 flex items-center justify-center gap-1 bg-orange-50 border border-orange-100 text-orange-700 rounded-md'>
                        <FaFireAlt size={12} /> {fmt(total.calories)} kcal
                      </div>
                      <div className='h-9 flex items-center justify-center gap-1 bg-green-50 border border-green-100 text-green-700 rounded-md'>
                        <FaLeaf size={12} /> {fmt(total.protein)} g Protein
                      </div>
                      <div className='h-9 flex items-center justify-center gap-1 bg-teal-50 border border-teal-100 text-teal-700 rounded-md'>
                        <GiBreadSlice size={13} /> {fmt(total.carbs)} g Carbs
                      </div>
                      <div className='h-9 flex items-center justify-center gap-1 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-md'>
                        <GiAvocado size={13} /> {fmt(total.fat)} g Fat
                      </div>
                    </div>

                    <div className='mt-auto pt-3 text-xs text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition'>
                      Click to preview & clone
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>

      {selectedMeal && (
        <div
          className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center p-6 overflow-y-auto'
          onClick={closeMeal}
          role='dialog'
          aria-modal='true'
        >
          <div
            onClick={e => e.stopPropagation()}
            className='max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative flex flex-col my-auto transition-all duration-300'
          >
            <div className='absolute top-4 right-4 flex items-center gap-2'>
              <button
                onClick={handleClone}
                disabled={cloning}
                title='Copy this template to my meals'
                className={`p-2 rounded-full border ${
                  cloning
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                } transition`}
                aria-busy={cloning}
              >
                <FaClone size={18} />
              </button>
              <button
                onClick={closeMeal}
                className='p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200 transition'
                title='Close'
              >
                <FaTimes size={18} />
              </button>
            </div>

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
                      {fmt(selectedTotals.calories)} kcal
                    </div>
                    <div className='h-10 flex items-center justify-center bg-green-50 rounded-md border border-green-100'>
                      <FaLeaf className='text-green-600 mr-2' />
                      {fmt(selectedTotals.protein)} g Protein
                    </div>
                    <div className='h-10 flex items-center justify-center bg-teal-50 rounded-md border border-teal-100'>
                      <GiBreadSlice className='text-teal-600 mr-2' />
                      {fmt(selectedTotals.carbs)} g Carbs
                    </div>
                    <div className='h-10 flex items-center justify-center bg-yellow-50 rounded-md border border-yellow-100'>
                      <GiAvocado className='text-yellow-600 mr-2' />
                      {fmt(selectedTotals.fat)} g Fat
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
