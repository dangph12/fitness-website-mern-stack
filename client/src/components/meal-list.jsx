import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaEdit,
  FaFireAlt,
  FaLeaf,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUtensils,
  FaUtensilSpoon
} from 'react-icons/fa';
import { FiCalendar, FiCoffee } from 'react-icons/fi';
import { GiAvocado, GiBreadSlice } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { deleteMeal, fetchMealsByUser } from '~/store/features/meal-slice';

import { Calendar } from './ui/calendar';
import { ScrollArea } from './ui/scroll-area';

export default function MealsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.user.id);
  const {
    mealsByUser = [],
    loadingByUser,
    errorByUser
  } = useSelector(state => state.meals);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMealSmall, setSelectedMealSmall] = useState(null);
  const userSelectedRef = useRef(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMealsByUser(userId))
        .unwrap()
        .catch(() => toast.error('Failed to load meals.'));
    }
  }, [dispatch, userId]);

  const fmt = n => (isFinite(n) ? Number(n).toFixed(1) : '0.0');

  const getTotals = foods =>
    foods?.reduce(
      (acc, item) => {
        const f = item.food || {};
        const qty = Number(item.quantity) || 0;
        acc.calories += (Number(f.calories) || 0) * qty;
        acc.protein += (Number(f.protein) || 0) * qty;
        acc.carbohydrates += (Number(f.carbohydrate) || 0) * qty;
        acc.fat += (Number(f.fat) || 0) * qty;
        return acc;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    ) || { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };

  const toLocalKey = v => {
    if (!v) return null;
    const d = v instanceof Date ? v : new Date(v);
    if (isNaN(d)) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const mealsByDate = useMemo(() => {
    const map = {};
    for (const m of mealsByUser) {
      const raw = m.scheduledAt || m.scheduleAt || m.createdAt; // ✅ fix
      const key = toLocalKey(raw);
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(m);
    }
    return map;
  }, [mealsByUser]);

  const markedDays = useMemo(
    () => Object.keys(mealsByDate).sort(),
    [mealsByDate]
  );

  useEffect(() => {
    if (!userSelectedRef.current && !selectedDate && markedDays.length > 0) {
      setSelectedDate(markedDays[0]);
    }
  }, [markedDays, selectedDate]);

  const toKeyDate = value => {
    if (!value) return null;
    if (value instanceof Date && !isNaN(value)) return toLocalKey(value);
    if (typeof value === 'number') return toLocalKey(new Date(value));
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      const parsed = new Date(value);
      if (!isNaN(parsed)) return toLocalKey(parsed);
      const parts = value.split(/[^\d]+/).filter(Boolean);
      if (parts.length === 3) {
        if (parts[0].length === 4)
          return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return null;
  };

  const handleSelectDate = value => {
    userSelectedRef.current = true;
    const key = toKeyDate(value);
    setSelectedDate(key);
  };

  const handleDayClick = value => {
    userSelectedRef.current = true;
    const key = toKeyDate(value);
    setSelectedDate(key);
  };

  const handleDeleteMeal = id => {
    if (!window.confirm('Delete this meal?')) return;
    dispatch(deleteMeal(id))
      .unwrap()
      .then(() => toast.success('Meal deleted'))
      .catch(() => toast.error('Delete failed.'));
  };

  const openMealModal = meal => {
    setSelectedMeal(meal);
    document.body.style.overflow = 'hidden';
  };

  const closeMealModal = () => {
    setSelectedMeal(null);
    document.body.style.overflow = '';
  };

  const openSmallModal = meal => {
    setSelectedMealSmall(meal);
  };

  const closeSmallModal = () => {
    setSelectedMealSmall(null);
  };

  const mealsOfDay = selectedDate ? mealsByDate[selectedDate] || [] : [];

  if (loadingByUser)
    return (
      <div className='text-center p-10 text-slate-500 animate-pulse'>
        Loading meals...
      </div>
    );

  if (errorByUser) return <p className='text-center text-red-500'>{error}</p>;

  if (!mealsByUser.length)
    return (
      <div className='text-center p-16 text-slate-600'>
        <h2 className='text-2xl font-semibold mb-2'>No meals yet</h2>
        <p>Add your first meal to start tracking nutrition!</p>
      </div>
    );

  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>
      <div className='relative mb-8'>
        <div className='text-center'>
          <h1 className='inline-flex items-center gap-3 text-4xl font-extrabold tracking-tight text-slate-900'>
            <span className='rounded-xl p-2 ring-1 ring-emerald-200'>
              <FiCoffee className='text-emerald-600' />
            </span>
            <span className='bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent'>
              Your Meal Calendar
            </span>
          </h1>

          <div className='mx-auto mt-3 h-[2px] w-28 rounded-full bg-gradient-to-r from-emerald-500/80 to-sky-500/80' />

          <p className='mt-3 inline-flex items-center justify-center gap-2 text-base text-slate-600'>
            <FiCalendar className='text-emerald-600' />
            Pick a date to view your meals.
          </p>
        </div>

        <button
          onClick={() => navigate('/nutrition/create-meal')}
          className='absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 
               px-4 py-2 rounded-lg text-white font-medium bg-emerald-600 hover:bg-emerald-700 shadow'
        >
          <FaPlus className='text-sm' />
          Create Meal
        </button>
      </div>

      <div className='bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10'>
        <Calendar
          selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : null}
          onSelect={handleSelectDate}
          onDayClick={handleDayClick}
          className='w-full'
          modifiers={{
            hasMeal: date => {
              const key = toKeyDate(date);
              return !!key && markedDays.includes(key);
            }
          }}
          modifiersClassNames={{
            hasMeal:
              'relative cursor-pointer after:absolute after:bottom-[6px] after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:bg-rose-500 after:rounded-full',
            selected: 'bg-rose-50 text-rose-700 rounded-lg'
          }}
        />
      </div>

      {selectedDate && (
        <div>
          <h2 className='mb-4 flex items-center gap-3 text-2xl font-semibold text-slate-900'>
            <FaUtensils className='text-emerald-600' />
            <span className='bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent'>
              Meals for
            </span>
            <span className='rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700'>
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                'en-GB',
                {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }
              )}
            </span>
          </h2>

          {mealsOfDay.length === 0 ? (
            <p className='text-slate-500 italic'>
              No meals scheduled for this day.
            </p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {mealsOfDay.map(meal => {
                const totals = getTotals(meal.foods);
                return (
                  <div
                    key={meal._id}
                    className='group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden'
                  >
                    <button
                      onClick={() => openMealModal(meal)}
                      className='block w-full h-44 overflow-hidden'
                      aria-label={`Open details for ${meal.title}`}
                    >
                      {meal.image ? (
                        <img
                          src={meal.image}
                          alt={meal.title}
                          className='w-full h-44 object-cover group-hover:scale-105 transition duration-300 rounded-2xl'
                        />
                      ) : (
                        <div className='w-full h-44 bg-slate-100 flex items-center justify-center text-slate-400'>
                          <FaUtensils size={36} />
                        </div>
                      )}
                    </button>

                    <div className='p-4'>
                      <div className='flex justify-between items-center'>
                        <h3 className='font-semibold text-lg text-slate-900 flex items-center gap-2'>
                          <FaUtensils className='text-rose-500' />
                          {meal.title}
                        </h3>

                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => openSmallModal(meal)}
                            className='text-sm text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100'
                          >
                            Details
                          </button>

                          <span className='text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full border border-rose-100'>
                            {meal.mealType || 'Meal'}
                          </span>
                        </div>
                      </div>

                      <div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
                        <div className='flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200'>
                          <FaFireAlt /> {fmt(totals.calories)} kcal
                        </div>
                        <div className='flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-lg border border-green-200'>
                          <FaLeaf /> {fmt(totals.protein)} g Protein
                        </div>
                        <div className='flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200'>
                          <GiBreadSlice /> {fmt(totals.carbohydrates)} g Carbs
                        </div>
                        <div className='flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200'>
                          <GiAvocado /> {fmt(totals.fat)} g Fat
                        </div>
                      </div>

                      <div className='mt-4 flex gap-2'>
                        <button
                          onClick={() =>
                            navigate(`/nutrition/edit-meal/${meal._id}`)
                          }
                          className='flex-1 py-2 rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 transition text-sm font-medium flex items-center justify-center gap-1'
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(meal._id)}
                          className='flex-1 py-2 rounded-lg text-white bg-rose-500 hover:bg-rose-600 transition text-sm font-medium flex items-center justify-center gap-1'
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedMeal && (
        <div className='fixed inset-0 z-50 flex items-start justify-center pt-12 px-4'>
          <div
            className='fixed inset-0 bg-black/60 backdrop-blur-sm'
            onClick={closeMealModal}
          />
          <div className='relative z-10 bg-white w-full max-w-[1250px] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh]'>
            <button
              onClick={closeMealModal}
              className='absolute top-5 right-5 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/95 border border-slate-200 hover:bg-white transition'
              aria-label='Close'
            >
              <FaTimes />
            </button>

            <div className='flex flex-col md:flex-row h-full'>
              <div className='md:w-[44%] w-full p-6 flex items-start justify-center'>
                {selectedMeal.image ? (
                  <img
                    src={selectedMeal.image}
                    alt={selectedMeal.title}
                    className='w-full max-h-[520px] object-cover rounded-2xl shadow-sm'
                    style={{ marginRight: 20 }}
                  />
                ) : (
                  <div className='w-full h-[420px] bg-slate-100 flex items-center justify-center text-slate-400 rounded-2xl'>
                    <FaUtensils size={56} />
                  </div>
                )}
              </div>

              <div className='flex-1 flex flex-col'>
                <ScrollArea
                  className='flex-1 px-6 pb-6'
                  style={{ maxHeight: 'calc(92vh - 30px)' }}
                >
                  <div className='p-6 overflow-hidden'>
                    <h2 className='text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3'>
                      <FaUtensils className='text-indigo-500' />
                      {selectedMeal.title}
                    </h2>
                    <p className='text-sm text-slate-600 mt-1 capitalize'>
                      {selectedMeal.mealType}
                    </p>

                    {selectedMeal.user && (
                      <div className='mt-4 inline-flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 shadow-sm'>
                        <div className='w-12 h-12 rounded-full bg-white overflow-hidden flex items-center justify-center border'>
                          {selectedMeal.user.avatar ? (
                            <img
                              src={selectedMeal.user.avatar}
                              alt={
                                selectedMeal.user.name ||
                                selectedMeal.user.email
                              }
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='text-slate-500 font-medium'>
                              {(
                                selectedMeal.user.name ||
                                selectedMeal.user.email ||
                                'U'
                              )
                                .slice(0, 1)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className='text-sm font-medium text-slate-800'>
                            {selectedMeal.user.name || selectedMeal.user.email}
                          </div>
                          <div className='text-xs text-slate-500'>
                            {selectedMeal.user.role
                              ? selectedMeal.user.role
                              : 'User'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className='px-6 pb-6 overflow-y-auto flex-1'
                    style={{ maxHeight: 'calc(92vh - 100px)' }}
                  >
                    <div className='mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4'>
                      {[
                        {
                          label: 'Calories',
                          value: getTotals(selectedMeal.foods).calories,
                          unit: 'kcal',
                          icon: <FaFireAlt className='text-orange-500' />,
                          bg: 'bg-orange-50',
                          border: 'border-orange-200',
                          text: 'text-orange-800'
                        },
                        {
                          label: 'Protein',
                          value: getTotals(selectedMeal.foods).protein,
                          unit: 'g',
                          icon: <FaLeaf className='text-green-600' />,
                          bg: 'bg-green-50',
                          border: 'border-green-200',
                          text: 'text-green-800'
                        },
                        {
                          label: 'Carbs',
                          value: getTotals(selectedMeal.foods).carbohydrates,
                          unit: 'g',
                          icon: <GiBreadSlice className='text-teal-600' />,
                          bg: 'bg-teal-50',
                          border: 'border-teal-200',
                          text: 'text-teal-800'
                        },
                        {
                          label: 'Fat',
                          value: getTotals(selectedMeal.foods).fat,
                          unit: 'g',
                          icon: <GiAvocado className='text-yellow-600' />,
                          bg: 'bg-yellow-50',
                          border: 'border-yellow-200',
                          text: 'text-yellow-800'
                        }
                      ].map(stat => (
                        <div
                          key={stat.label}
                          className={`rounded-2xl ${stat.bg} border ${stat.border} p-4 text-center`}
                        >
                          <div className='flex items-center justify-center gap-2 text-sm font-semibold opacity-90'>
                            {stat.icon}{' '}
                            <span className={stat.text}>{stat.label}</span>
                          </div>
                          <p className={`text-xl font-bold mt-1 ${stat.text}`}>
                            {fmt(stat.value)} {stat.unit}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className='mt-6'>
                      <h3 className='text-lg font-medium text-slate-700 mb-4'>
                        Foods in this meal
                      </h3>
                      <div className='space-y-4'>
                        {selectedMeal.foods?.map((item, idx) => {
                          const f = item.food || {};
                          const qty = Number(item.quantity) || 0;
                          return (
                            <div
                              key={idx}
                              className='flex items-center gap-4 p-4 border border-slate-100 rounded-xl'
                            >
                              <img
                                src={f.image}
                                alt={f.title}
                                className='w-20 h-20 rounded-lg object-cover'
                              />
                              <div className='flex-1 min-w-0'>
                                <p className='font-semibold text-slate-900 truncate'>
                                  {f.title}
                                </p>
                                <div className='flex flex-wrap gap-2 mt-2'>
                                  <span className='flex items-center gap-1 text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 text-xs font-medium'>
                                    <FaFireAlt className='text-orange-500' />{' '}
                                    {fmt(f.calories)} kcal
                                  </span>
                                  <span className='flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200 text-xs font-medium'>
                                    <FaLeaf className='text-green-600' />{' '}
                                    {fmt(f.protein)} g Protein
                                  </span>
                                  <span className='flex items-center gap-1 text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 text-xs font-medium'>
                                    <GiBreadSlice className='text-teal-600' />{' '}
                                    {fmt(f.carbohydrate)} g Carbs
                                  </span>
                                  <span className='flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-200 text-xs font-medium'>
                                    <GiAvocado className='text-yellow-600' />{' '}
                                    {fmt(f.fat)} g Fat
                                  </span>
                                </div>
                              </div>
                              <div className='text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-full'>
                                × {qty}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className='mt-6 flex gap-3'>
                      <button
                        onClick={() => {
                          closeMealModal();
                          navigate(`/nutrition/edit-meal/${selectedMeal._id}`);
                        }}
                        className='flex-1 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium'
                      >
                        <FaEdit className='inline mr-2' /> Edit meal
                      </button>

                      <button
                        onClick={() => {
                          closeMealModal();
                          handleDeleteMeal(selectedMeal._id);
                        }}
                        className='flex-1 py-2 rounded-lg text-white bg-rose-600 hover:bg-rose-700 transition text-sm font-medium'
                      >
                        <FaTrash className='inline mr-2' /> Delete meal
                      </button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMealSmall && (
        <div className='fixed inset-0 z-40 flex items-center justify-center p-4'>
          <div
            className='fixed inset-0 bg-black/40'
            onClick={closeSmallModal}
          />
          <div className='relative z-10 bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden'>
            <div className='p-4'>
              <div className='flex items-start gap-3'>
                <div className='w-20 h-20 rounded-lg overflow-hidden bg-slate-100'>
                  {selectedMealSmall.image ? (
                    <img
                      src={selectedMealSmall.image}
                      alt={selectedMealSmall.title}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-slate-400'>
                      <FaUtensils />
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold'>
                    {selectedMealSmall.title}
                  </h3>
                  <p className='text-sm text-slate-500 mt-1'>
                    {selectedMealSmall.mealType || 'Meal'}
                  </p>

                  <div className='mt-3 flex flex-wrap gap-2 text-sm'>
                    <div className='flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200'>
                      <FaFireAlt />{' '}
                      {fmt(getTotals(selectedMealSmall.foods).calories)} kcal
                    </div>
                    <div className='flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-lg border border-green-200'>
                      <FaLeaf />{' '}
                      {fmt(getTotals(selectedMealSmall.foods).protein)} g
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeSmallModal}
                  className='text-slate-500 hover:text-slate-700'
                >
                  <FaTimes />
                </button>
              </div>

              <div className='mt-4'>
                <button
                  onClick={() => {
                    closeSmallModal();
                    navigate(`/nutrition/edit-meal/${selectedMealSmall._id}`);
                  }}
                  className='w-full py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition text-sm font-medium mb-2'
                >
                  <FaEdit className='inline mr-2' /> Edit
                </button>
                <button
                  onClick={() => {
                    closeSmallModal();
                    handleDeleteMeal(selectedMealSmall._id);
                  }}
                  className='w-full py-2 rounded-lg text-white bg-rose-600 hover:bg-rose-700 transition text-sm font-medium'
                >
                  <FaTrash className='inline mr-2' /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
