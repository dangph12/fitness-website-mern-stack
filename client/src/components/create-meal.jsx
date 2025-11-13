import React, { useLayoutEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaChevronRight,
  FaDrumstickBite,
  FaExchangeAlt,
  FaFire,
  FaImage,
  FaPlus,
  FaSave,
  FaSyncAlt,
  FaTag,
  FaTimes,
  FaTrash,
  FaUtensils,
  FaWeight
} from 'react-icons/fa';
import { GiCupcake, GiMeal as GiFood, GiMeal } from 'react-icons/gi';
import { MdOutlineFastfood } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { createMultipleMeals } from '~/store/features/meal-slice';

import FoodLibrary from './food-list';

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const mealTypeIcons = {
  Breakfast: <MdOutlineFastfood className='text-yellow-600' />,
  Lunch: <FaDrumstickBite className='text-green-600' />,
  Dinner: <GiMeal className='text-indigo-600' />,
  Snack: <GiCupcake className='text-pink-600' />,
  Brunch: <FaCalendarAlt className='text-orange-600' />,
  Dessert: <GiCupcake className='text-red-600' />
};

const ymd = d => {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

function buildMealsFormDataFromDays(days, userId) {
  const fd = new FormData();
  let mealIndex = 0;

  days.forEach(d => {
    const scheduledAt = ymd(d.date);

    d.meals.forEach(m => {
      const base = `meals[${mealIndex}]`;

      fd.append(
        `${base}[title]`,
        m.title || `${m.mealType} ${d.date.toDateString()}`
      );
      fd.append(`${base}[mealType]`, m.mealType || 'Breakfast');
      fd.append(`${base}[user]`, userId || '');
      fd.append(`${base}[scheduledAt]`, scheduledAt);

      (m.foods || []).forEach((f, j) => {
        fd.append(`${base}[foods][${j}][food]`, String(f.food));
        fd.append(
          `${base}[foods][${j}][quantity]`,
          String(Number(f.quantity) || 0)
        );
      });

      if (m.image instanceof File) {
        fd.append('images', m.image);
      } else if (typeof m.image === 'string' && m.image.trim()) {
        fd.append(`${base}[image]`, m.image.trim());
      }

      mealIndex += 1;
    });
  });

  return fd;
}

export default function CreateMealSchedule() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(
    state => state.auth.user?._id || state.auth.user?.id
  );

  const foodsState = useSelector(state => state.foods);
  const globalFoods = Array.isArray(foodsState?.foods?.foods)
    ? foodsState.foods.foods
    : [];

  const [days, setDays] = useState(() => {
    const today = new Date();
    const dId = genId();
    const mId = genId();
    return [
      {
        id: dId,
        date: today,
        meals: [
          {
            id: mId,
            title: '',
            mealType: 'Breakfast',
            image: null,
            previewUrl: null,
            foods: []
          }
        ]
      }
    ];
  });

  const [selected, setSelected] = useState({ dayId: null, mealId: null });
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (days.length > 0 && days[0].meals.length > 0) {
      setSelected({ dayId: days[0].id, mealId: days[0].meals[0].id });
    }
  }, []);

  const addDay = date => {
    const d = {
      id: genId(),
      date: date || new Date(),
      meals: [
        {
          id: genId(),
          title: '',
          mealType: 'Breakfast',
          image: null,
          previewUrl: null,
          foods: []
        }
      ]
    };
    setDays(prev => {
      const next = [...prev, d];
      setSelected({ dayId: d.id, mealId: d.meals[0].id });
      return next;
    });
  };

  const removeDay = dayId => {
    setDays(prev => {
      const next = prev.filter(d => d.id !== dayId);
      if (next.length === 0) {
        const d = {
          id: genId(),
          date: new Date(),
          meals: [
            {
              id: genId(),
              title: '',
              mealType: 'Breakfast',
              image: null,
              previewUrl: null,
              foods: []
            }
          ]
        };
        setSelected({ dayId: d.id, mealId: d.meals[0].id });
        return [d];
      }
      setSelected({ dayId: next[0].id, mealId: next[0].meals[0].id });
      return next;
    });
  };

  const addMeal = dayId => {
    const newMeal = {
      id: genId(),
      title: '',
      mealType: 'Breakfast',
      image: null,
      previewUrl: null,
      foods: []
    };
    setDays(prev =>
      prev.map(d =>
        d.id === dayId ? { ...d, meals: [...d.meals, newMeal] } : d
      )
    );
    setSelected({ dayId, mealId: newMeal.id });
  };

  const removeMeal = (dayId, mealId) => {
    setDays(prev =>
      prev.map(d => {
        if (d.id !== dayId) return d;
        const nextMeals = d.meals.filter(m => m.id !== mealId);

        const currentMealIndex = d.meals.findIndex(m => m.id === mealId);
        let nextSelectedMealId = null;
        if (nextMeals.length > 0) {
          const nextMealToSelect =
            nextMeals[Math.max(0, currentMealIndex - 1)] || nextMeals[0];
          nextSelectedMealId = nextMealToSelect.id;
        }

        const updatedDay = {
          ...d,
          meals: nextMeals.length
            ? nextMeals
            : [
                {
                  id: genId(),
                  title: '',
                  mealType: 'Breakfast',
                  image: null,
                  previewUrl: null,
                  foods: []
                }
              ]
        };

        if (nextMeals.length > 0) {
          setSelected({ dayId, mealId: nextSelectedMealId });
        } else {
          setSelected({ dayId, mealId: updatedDay.meals[0].id });
        }
        return updatedDay;
      })
    );
  };

  const updateMealField = (dayId, mealId, field, value) => {
    setDays(prev =>
      prev.map(d =>
        d.id !== dayId
          ? d
          : {
              ...d,
              meals: d.meals.map(m =>
                m.id === mealId ? { ...m, [field]: value } : m
              )
            }
      )
    );
  };

  const updateMealImage = (dayId, mealId, file) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;
    setDays(prev =>
      prev.map(d =>
        d.id !== dayId
          ? d
          : {
              ...d,
              meals: d.meals.map(m =>
                m.id === mealId ? { ...m, image: file, previewUrl } : m
              )
            }
      )
    );
  };

  const handleAddFoodToSelected = foodItem => {
    if (!foodItem) return;
    if (!selected.mealId)
      return toast.warning('Please select a meal card first.');

    setDays(prev =>
      prev.map(d => {
        if (d.id !== selected.dayId) return d;
        return {
          ...d,
          meals: d.meals.map(m => {
            if (m.id !== selected.mealId) return m;
            const idx = m.foods.findIndex(f => f.food === foodItem._id);
            if (idx !== -1) {
              const clone = [...m.foods];
              clone[idx] = {
                ...clone[idx],
                quantity: Number(clone[idx].quantity || 0) + 1
              };
              return { ...m, foods: clone };
            }
            const newFood = {
              food: foodItem._id,
              title: foodItem.title || foodItem.name || '',
              image: foodItem.image || null,
              calories: foodItem.calories ?? 0,
              protein: foodItem.protein ?? 0,
              fat: foodItem.fat ?? 0,
              carbohydrate: foodItem.carbohydrate ?? 0,
              quantity: 1
            };
            return { ...m, foods: [...m.foods, newFood] };
          })
        };
      })
    );
    toast.success(`${foodItem.title || 'Food'} added`);
  };

  const updateFoodQty = (dayId, mealId, foodId, qty) => {
    setDays(prev =>
      prev.map(d =>
        d.id !== dayId
          ? d
          : {
              ...d,
              meals: d.meals.map(m =>
                m.id !== mealId
                  ? m
                  : {
                      ...m,
                      foods: m.foods.map(f =>
                        f.food === foodId
                          ? { ...f, quantity: Math.max(0, Number(qty) || 0) }
                          : f
                      )
                    }
              )
            }
      )
    );
  };

  const removeFoodFromMeal = (dayId, mealId, foodId) => {
    setDays(prev =>
      prev.map(d =>
        d.id !== dayId
          ? d
          : {
              ...d,
              meals: d.meals.map(m =>
                m.id !== mealId
                  ? m
                  : { ...m, foods: m.foods.filter(f => f.food !== foodId) }
              )
            }
      )
    );
    toast.info('Food item removed.');
  };

  const handleSubmitAll = async () => {
    for (const d of days) {
      for (const m of d.meals) {
        if (!m.foods || m.foods.length === 0) {
          toast.warning(
            `Meal "${m.title || m.mealType}" on ${d.date.toDateString()} is empty. Please add foods or remove the meal.`
          );
          return;
        }
      }
    }

    const fd = buildMealsFormDataFromDays(days, userId);

    setSaving(true);
    try {
      await dispatch(createMultipleMeals(fd)).unwrap();
      toast.success('Meal schedule created successfully!');
      navigate('/nutrition');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create meal schedule');
    } finally {
      setSaving(false);
    }
  };

  const dateToShort = d => {
    try {
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return d.toISOString().split('T')[0];
    }
  };

  const totalMealsCount = days.reduce((s, d) => s + d.meals.length, 0);
  const totalFoodsCount = days.reduce(
    (s, d) => s + d.meals.reduce((ss, m) => ss + m.foods.length, 0),
    0
  );

  const selectedMeal = days
    .find(d => d.id === selected.dayId)
    ?.meals.find(m => m.id === selected.mealId);

  const getMealTotal = (meal, macroKey) =>
    meal.foods.reduce(
      (s, it) => s + (Number(it[macroKey]) || 0) * (Number(it.quantity) || 0),
      0
    );

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-5 md:px-10'>
      <header className='flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white rounded-3xl shadow-xl p-6 mb-10'>
        <div className='flex items-center gap-4'>
          <GiFood className='text-emerald-600 text-4xl' />
          <div>
            <h1 className='text-3xl font-extrabold text-slate-800'>
              Plan Your Meal Schedule
            </h1>
            <p className='text-slate-500 text-sm'>
              Create multiple meals across different days and save them all.
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-4 mt-4 lg:mt-0'>
          <div className='bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm text-emerald-800 flex items-center gap-3'>
            <div className='flex items-center gap-1'>
              <FaUtensils className='text-emerald-600' />
              <span>{totalMealsCount} meals</span>
            </div>
            <div className='flex items-center gap-1'>
              <FaDrumstickBite className='text-emerald-600' />
              <span>{totalFoodsCount} foods</span>
            </div>
          </div>
          <button
            onClick={handleSubmitAll}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md ${
              saving
                ? 'bg-slate-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90'
            }`}
          >
            <FaSave /> {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </header>

      <div className='bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-8 flex flex-wrap justify-between items-center gap-4'>
        <div className='flex flex-wrap items-center gap-3'>
          <FaCalendarAlt className='text-emerald-600 text-lg' />
          <label className='text-slate-700 font-medium'>Add New Day:</label>
          <button
            onClick={() => addDay(new Date())}
            className='px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow hover:opacity-90 flex items-center gap-1'
          >
            <FaPlus className='text-xs' /> Today
          </button>
          <input
            type='date'
            className='border rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-emerald-400 outline-none'
            onChange={e => addDay(new Date(e.target.value))}
          />
        </div>
        <button
          onClick={() => {
            const d = {
              id: genId(),
              date: new Date(),
              meals: [
                {
                  id: genId(),
                  title: '',
                  mealType: 'Breakfast',
                  image: null,
                  previewUrl: null,
                  foods: []
                }
              ]
            };
            setDays([d]);
            setSelected({ dayId: d.id, mealId: d.meals[0].id });
            toast.info('Schedule has been reset to today.');
          }}
          className='px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition flex items-center gap-1'
        >
          <FaSyncAlt /> Reset
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-8 space-y-8'>
          {days.map(day => (
            <div
              key={day.id}
              className='bg-white rounded-3xl border border-slate-200 p-6 shadow-lg'
            >
              <div className='flex justify-between items-center border-b pb-3 mb-5'>
                <div className='flex items-center gap-3'>
                  <FaCalendarAlt className='text-emerald-600 text-xl' />
                  <h2 className='text-lg font-semibold text-slate-800'>
                    {day.date.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h2>
                  <span className='text-sm text-slate-500'>
                    ({dateToShort(day.date)})
                  </span>
                </div>
                <button
                  onClick={() => removeDay(day.id)}
                  className='text-red-500 hover:text-red-700 text-sm flex items-center gap-1'
                >
                  <FaTrash /> Remove Day
                </button>
              </div>

              <div className='space-y-6'>
                {day.meals.map(meal => {
                  const isSelected =
                    selected.dayId === day.id && selected.mealId === meal.id;
                  const mealTotalCalories = getMealTotal(meal, 'calories');
                  const mealTotalProtein = getMealTotal(meal, 'protein');
                  const mealTotalCarb = getMealTotal(meal, 'carbohydrate');
                  const mealTotalFat = getMealTotal(meal, 'fat');

                  return (
                    <div
                      key={meal.id}
                      onClick={() =>
                        setSelected({ dayId: day.id, mealId: meal.id })
                      }
                      className={`rounded-2xl p-5 border transition-all w-full ${
                        isSelected
                          ? 'ring-4 ring-emerald-300 border-emerald-400 bg-emerald-50 shadow-lg'
                          : 'bg-white hover:shadow-md border-slate-200'
                      }`}
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-2'>
                          {mealTypeIcons[meal.mealType] || (
                            <GiMeal className='text-lg text-slate-600' />
                          )}
                          <h3 className='font-semibold text-slate-800 text-lg'>
                            {meal.title || meal.mealType}
                          </h3>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeMeal(day.id, meal.id);
                          }}
                          className='text-red-400 hover:text-red-600 transition p-1'
                          title='Remove meal'
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className='flex flex-col md:flex-row gap-3 mb-4'>
                        <select
                          value={meal.mealType}
                          onClick={e => e.stopPropagation()}
                          onChange={e =>
                            updateMealField(
                              day.id,
                              meal.id,
                              'mealType',
                              e.target.value
                            )
                          }
                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-gray-400 outline-none bg-white text-gray-800'
                        >
                          {Object.keys(mealTypeIcons).map(t => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <input
                          placeholder='Meal title (optional)'
                          value={meal.title}
                          onClick={e => e.stopPropagation()}
                          onChange={e =>
                            updateMealField(
                              day.id,
                              meal.id,
                              'title',
                              e.target.value
                            )
                          }
                          className='flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-300 outline-none'
                        />
                      </div>

                      <div className='relative group mb-4'>
                        {meal.previewUrl && (
                          <>
                            <img
                              src={meal.previewUrl}
                              alt='Meal Preview'
                              className='w-full h-44 object-cover rounded-xl mb-2 shadow-md'
                            />
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                updateMealImage(day.id, meal.id, null);
                              }}
                              title='Remove image'
                              className='absolute top-4 right-4 p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100'
                            >
                              <FaTimes className='text-sm' />
                            </button>
                          </>
                        )}
                        <label className='flex items-center gap-2 cursor-pointer bg-white border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 px-3 py-4 rounded-lg text-sm text-slate-600 w-full justify-center transition'>
                          <FaImage />{' '}
                          {meal.image?.name || 'Upload Meal Image (Optional)'}
                          <input
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onClick={e => e.stopPropagation()}
                            onChange={e =>
                              updateMealImage(
                                day.id,
                                meal.id,
                                e.target.files?.[0]
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className='flex items-center flex-wrap gap-x-6 gap-y-2 py-2 border-y border-slate-200 mb-4'>
                        <span className='font-bold md:text-2xl text-xl flex items-center gap-2 text-red-600'>
                          <FaFire />
                          {mealTotalCalories.toFixed(0)} cal
                        </span>

                        <span className='font-bold md:text-2xl text-xl flex items-center gap-2 text-teal-700'>
                          <FaDrumstickBite />
                          P: {mealTotalProtein.toFixed(1)}g
                        </span>

                        <span className='font-bold md:text-2xl text-xl flex items-center gap-2 text-amber-700'>
                          <GiCupcake />
                          C: {mealTotalCarb.toFixed(1)}g
                        </span>

                        <span className='font-bold md:text-2xl text-xl flex items-center gap-2 text-indigo-700'>
                          <FaWeight />
                          F: {mealTotalFat.toFixed(1)}g
                        </span>
                      </div>

                      <div className='mt-2 space-y-2 max-h-56 overflow-y-auto pr-1'>
                        {meal.foods.length === 0 ? (
                          <div className='p-4 border-2 border-dashed border-slate-300 rounded-lg text-center text-sm text-slate-500 bg-white'>
                            <FaTag className='inline mr-2' />
                            No foods yet. Select this meal and use the Food
                            Library on the right to add items.
                          </div>
                        ) : (
                          meal.foods.map(f => {
                            const imgSrc = f.image || '/placeholder-food.png';
                            const kcal = (
                              (f.calories ?? 0) * (f.quantity ?? 0)
                            ).toFixed(0);
                            return (
                              <div
                                key={f.food}
                                className='flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm'
                              >
                                <div className='flex items-center gap-3'>
                                  <img
                                    src={imgSrc}
                                    alt={f.title}
                                    className='w-10 h-10 object-cover rounded-full border'
                                  />
                                  <div>
                                    <div className='font-medium text-slate-800 text-sm'>
                                      {f.title}
                                    </div>
                                    <div className='text-xs text-slate-500 flex items-center gap-2'>
                                      <FaFire className='text-red-400' />
                                      {kcal} cal
                                    </div>
                                  </div>
                                </div>

                                <div className='flex items-center gap-2'>
                                  <FaExchangeAlt className='text-slate-400' />
                                  <input
                                    type='number'
                                    min={0}
                                    value={f.quantity}
                                    onClick={e => e.stopPropagation()}
                                    onChange={e =>
                                      updateFoodQty(
                                        day.id,
                                        meal.id,
                                        f.food,
                                        e.target.value
                                      )
                                    }
                                    className='w-20 border rounded-lg px-2 py-1 text-sm text-center focus:ring-2 focus:ring-emerald-300 outline-none'
                                  />
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      removeFoodFromMeal(
                                        day.id,
                                        meal.id,
                                        f.food
                                      );
                                    }}
                                    className='text-red-400 hover:text-red-600 p-1'
                                    title='Remove food item from meal'
                                  >
                                    <FaTimes className='text-sm' />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => addMeal(day.id)}
                  className='mt-2 w-full border-2 border-dashed border-emerald-300 text-emerald-700 py-3 rounded-xl hover:bg-emerald-50 transition flex items-center justify-center gap-2'
                >
                  <FaPlus className='text-xs' /> Add Meal
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='lg:col-span-4'>
          <div className='sticky top-8 space-y-4'>
            <div className='rounded-3xl border border-emerald-300 bg-white p-5 shadow-xl'>
              <h4 className='text-lg font-bold text-slate-800 mb-2 flex items-center gap-2'>
                <FaDrumstickBite className='text-emerald-600' /> Food Library
              </h4>
              <div className='text-sm text-slate-600 flex items-center mb-3 p-2 bg-emerald-50 rounded-lg'>
                <FaChevronRight className='text-emerald-600 mr-2' />
                Add foods by clicking the <b className='mx-1'>+</b> button in
                the list below.
              </div>
              <div className='text-sm text-slate-700'>
                Selected Meal:
                <div className='px-3 py-1 bg-slate-100 rounded-md mt-1 font-semibold text-emerald-700'>
                  {selectedMeal
                    ? `${selectedMeal.mealType} – ${days
                        .find(d => d.id === selected.dayId)
                        ?.date.toLocaleDateString()}`
                    : 'No meal selected'}
                </div>
              </div>
            </div>

            <div className='rounded-3xl border bg-white p-0 shadow-xl max-h-full overflow-y-auto'>
              <FoodLibrary handleAddFood={handleAddFoodToSelected} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value }) {
  return (
    <span className='inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md'>
      {icon}
      <b className='text-slate-800'>{label}:</b> {value}
    </span>
  );
}
