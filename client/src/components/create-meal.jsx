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

  const [selected, setSelected] = useState(() => ({
    dayId: null,
    mealId: null
  }));

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
      mealType: 'Snack',
      image: null,
      previewUrl: null,
      foods: []
    };

    setDays(prev =>
      prev.map(d =>
        d.id === dayId
          ? {
              ...d,
              meals: [...d.meals, newMeal]
            }
          : d
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
                m.id === mealId
                  ? {
                      ...m,
                      image: file,
                      previewUrl: previewUrl
                    }
                  : m
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
          return toast.warning(
            `Meal "${m.title || m.mealType}" on ${d.date.toDateString()} is empty. Please add foods or remove the meal.`
          );
        }
      }
    }

    const mealDataArray = days
      .map(d =>
        d.meals.map(m => ({
          title: m.title || `${m.mealType} ${d.date.toDateString()}`,
          mealType: m.mealType,
          user: userId || '',
          scheduledAt: d.date.toISOString().split('T')[0],
          image: m.image,
          foods: m.foods.map(f => ({
            food: f.food,
            quantity: String(Number(f.quantity) || 0)
          }))
        }))
      )
      .flat();

    setSaving(true);
    try {
      await dispatch(createMultipleMeals(mealDataArray));
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
    <div className='max-w-full mx-auto p-4 md:p-8 bg-slate-50 min-h-screen'>
      <header className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 p-4 bg-white rounded-xl shadow-lg'>
        <div className='flex items-center gap-4 mb-4 sm:mb-0'>
          <GiFood className='text-emerald-600 text-4xl' />
          <div>
            <h1 className='text-3xl font-bold text-slate-800'>
              Plan Your Meal Schedule
            </h1>
            <p className='text-md text-slate-500'>
              Create multiple meals across different days and save them at once.
            </p>
          </div>
        </div>

        <div className='flex items-center gap-6 p-3 border rounded-xl bg-slate-100'>
          <div className='text-sm text-slate-700'>
            <div className='font-semibold'>
              <GiFood className='inline mr-1 text-emerald-600' /> Total Meals:{' '}
              <b className='text-emerald-600'>{totalMealsCount}</b>
            </div>
            <div className='font-semibold'>
              <FaDrumstickBite className='inline mr-1 text-emerald-600' /> Total
              Foods: <b className='text-emerald-600'>{totalFoodsCount}</b>
            </div>
          </div>
          <button
            onClick={handleSubmitAll}
            disabled={saving}
            className={`px-6 py-3 rounded-xl text-white font-semibold shadow-md transition-colors flex items-center gap-2 ${
              saving
                ? 'bg-slate-400'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
            }`}
          >
            <FaSave />
            {saving ? 'Saving...' : `Create ${totalMealsCount} Meal(s)`}
          </button>
        </div>
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-8 space-y-6'>
          <div className='rounded-2xl border bg-white p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
            <div className='flex flex-wrap items-center gap-4'>
              <label className='text-md text-slate-700 font-medium flex items-center gap-2'>
                <FaCalendarAlt className='text-emerald-600' /> Add New Day:
              </label>
              <input
                type='date'
                className='border rounded-lg px-3 py-2 text-slate-700 focus:ring-emerald-500 focus:border-emerald-500'
                onChange={e => addDay(new Date(e.target.value))}
              />
              <button
                onClick={() => addDay(new Date())}
                className='px-4 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition flex items-center gap-1'
              >
                <FaPlus className='text-xs' /> Today
              </button>
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
              <FaSyncAlt /> Reset Schedule
            </button>
          </div>

          <div className='space-y-6'>
            {days.map(day => (
              <div
                key={day.id}
                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-xl'
              >
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b mb-4'>
                  <div className='flex items-center gap-3'>
                    <FaCalendarAlt className='text-2xl text-slate-500' />
                    <h2 className='text-xl font-bold text-slate-800'>
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

                  <div className='flex items-center gap-3 mt-3 sm:mt-0'>
                    <button
                      onClick={() => addMeal(day.id)}
                      className='flex items-center gap-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition'
                    >
                      <FaPlus className='text-xs' /> Add Meal
                    </button>
                    <button
                      onClick={() => removeDay(day.id)}
                      className='flex items-center gap-1 px-3 py-2 text-red-500 rounded-lg text-sm hover:bg-red-50 transition'
                      title='Remove entire day'
                    >
                      <FaTrash className='text-xs' /> Remove Day
                    </button>
                  </div>
                </div>

                <div className='space-y-4'>
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
                        className={`rounded-xl p-5 border cursor-pointer transition-all w-full ${
                          isSelected
                            ? 'ring-4 ring-emerald-300 border-emerald-400 bg-emerald-50 shadow-lg'
                            : 'bg-white hover:shadow-md border-slate-200'
                        }`}
                      >
                        <div className='flex items-center justify-between mb-3'>
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

                        <div className='space-y-3 mb-4'>
                          <div className='flex gap-3'>
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
                              className='flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm appearance-none cursor-pointer'
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
                              className='flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm'
                            />
                          </div>

                          <div className='relative group'>
                            {meal.previewUrl && (
                              <>
                                <img
                                  src={meal.previewUrl}
                                  alt='Meal Preview'
                                  className='w-full h-40 object-cover rounded-lg mb-2 shadow-md'
                                />
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    updateMealImage(day.id, meal.id, null);
                                  }}
                                  title='Remove image'
                                  className='absolute top-4 right-4 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100'
                                >
                                  <FaTimes className='text-sm' />
                                </button>
                              </>
                            )}
                            <label className='flex items-center gap-2 cursor-pointer bg-white border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 px-3 py-4 rounded-lg text-sm text-slate-600 w-full justify-center transition'>
                              <FaImage />{' '}
                              {meal.image?.name ||
                                'Upload Meal Image (Optional)'}
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
                        </div>

                        <div className='flex items-center justify-between py-2 border-t border-b border-slate-200 mb-3'>
                          <div className='font-bold text-2xl text-emerald-600 flex items-center gap-2'>
                            <FaFire />
                            {mealTotalCalories.toFixed(0)} cal
                          </div>
                          <div className='text-sm text-slate-600 flex gap-4'>
                            <span className='flex items-center gap-1'>
                              <FaDrumstickBite className='text-blue-500' />
                              <b className='text-slate-800'>P:</b>{' '}
                              {mealTotalProtein.toFixed(1)}g
                            </span>
                            <span className='flex items-center gap-1'>
                              <GiCupcake className='text-yellow-500' />
                              <b className='text-slate-800'>C:</b>{' '}
                              {mealTotalCarb.toFixed(1)}g
                            </span>
                            <span className='flex items-center gap-1'>
                              <FaWeight className='text-red-500' />
                              <b className='text-slate-800'>F:</b>{' '}
                              {mealTotalFat.toFixed(1)}g
                            </span>
                          </div>
                        </div>

                        <div className='mt-4 space-y-2 max-h-56 overflow-y-auto pr-2'>
                          {meal.foods.length === 0 ? (
                            <div className='p-4 border-2 border-dashed border-slate-300 rounded-lg text-center text-sm text-slate-500 bg-white'>
                              <FaTag className='inline mr-2' />
                              No foods yet. Select this meal and use the Food
                              Library on the right to add items.
                            </div>
                          ) : (
                            <div className='space-y-2'>
                              {meal.foods.map(f => (
                                <div
                                  key={f.food}
                                  className='flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm'
                                >
                                  <div className='flex items-center gap-3'>
                                    <img
                                      src={
                                        globalFoods.find(g => g._id === f.food)
                                          ?.image || '/placeholder-food.png'
                                      }
                                      alt={f.title}
                                      className='w-10 h-10 object-cover rounded-full border'
                                    />
                                    <div>
                                      <div className='font-medium text-slate-800 text-sm'>
                                        {f.title}
                                      </div>
                                      <div className='text-xs text-slate-500 flex items-center gap-2'>
                                        <FaFire className='text-red-400' />
                                        {(
                                          (f.calories ?? 0) * (f.quantity ?? 0)
                                        ).toFixed(0)}{' '}
                                        cal
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
                                      className='w-16 border rounded-lg px-2 py-1 text-sm text-center focus:ring-emerald-500'
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
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='lg:col-span-4'>
          <div className='sticky top-8 space-y-4'>
            <div className='rounded-2xl border border-emerald-300 bg-white p-5 shadow-lg'>
              <h4 className='text-lg font-bold text-slate-800 mb-2 flex items-center gap-2'>
                <FaDrumstickBite className='text-emerald-600' /> Food Library
              </h4>
              <div className='text-sm text-slate-600 flex items-center mb-3 p-2 bg-emerald-50 rounded-lg'>
                <FaChevronRight className='text-emerald-600 mr-2' />
                Add foods by clicking the **+** button in the list below.
              </div>
              <div className='text-md text-slate-700 font-medium'>
                Selected Meal:
                <div className='px-3 py-1 bg-slate-100 rounded-md mt-1 font-bold text-emerald-700'>
                  {selectedMeal
                    ? `${selectedMeal.mealType} - ${days
                        .find(d => d.id === selected.dayId)
                        ?.date.toLocaleDateString()}`
                    : 'No meal selected'}
                </div>
              </div>
            </div>

            <div className='rounded-2xl border bg-white p-0 shadow-lg max-h-[60vh] overflow-y-auto'>
              <FoodLibrary handleAddFood={handleAddFoodToSelected} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
