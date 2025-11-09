import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  FaClipboardList,
  FaDrumstickBite,
  FaFire,
  FaHamburger,
  FaLeaf,
  FaTrash
} from 'react-icons/fa';
import { MdFileUpload } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { fetchMealById, updateMeal } from '~/store/features/meal-slice';

import FoodLibrary from './food-list';

const EditMeal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentMeal,
    loading: mealLoading,
    error
  } = useSelector(s => s.meals);
  const userId = useSelector(s => s.auth.user?._id || s.auth.user?.id);

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
    if (!currentMeal?._id) return;

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
        (acc, it) => {
          const qty = Number(it.quantity) || 0;
          acc.calories += (Number(it.calories) || 0) * qty;
          acc.protein += (Number(it.protein) || 0) * qty;
          acc.fat += (Number(it.fat) || 0) * qty;
          acc.carbohydrates += (Number(it.carbohydrate) || 0) * qty;
          return acc;
        },
        { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
      ),
    [selectedFoods]
  );

  const handleQtyChange = (foodId, value) => {
    const n = Math.max(1, Number(value) || 1);
    setSelectedFoods(prev =>
      prev.map(f =>
        String(f.food) === String(foodId) ? { ...f, quantity: n } : f
      )
    );
  };

  const handleRemoveFood = foodId => {
    setSelectedFoods(prev =>
      prev.filter(f => String(f.food) !== String(foodId))
    );
  };

  const handleAddFoodFromLibrary = foodItem => {
    if (!foodItem?._id) return;
    setSelectedFoods(prev => {
      const idx = prev.findIndex(
        it => String(it.food) === String(foodItem._id)
      );
      if (idx !== -1) {
        const clone = [...prev];
        clone[idx] = {
          ...clone[idx],
          quantity: Number(clone[idx].quantity || 0) + 1
        };
        return clone;
      }
      return [
        ...prev,
        {
          food: String(foodItem._id),
          title: foodItem.title || '',
          image: foodItem.image || '',
          calories: Number(foodItem.calories) || 0,
          fat: Number(foodItem.fat) || 0,
          carbohydrate: Number(foodItem.carbohydrate ?? foodItem.carbs) || 0,
          protein: Number(foodItem.protein) || 0,
          quantity: 1
        }
      ];
    });
  };

  const selectedFoodIds = useMemo(
    () => selectedFoods.map(f => String(f.food)),
    [selectedFoods]
  );

  const handleUpdateMeal = async () => {
    if (!title.trim()) return toast.error('Meal title is required.');
    if (!selectedFoods.length)
      return toast.error('Please add at least one food.');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('mealType', mealType);
      if (userId) formData.append('user', userId);
      if (image instanceof File) formData.append('image', image);

      selectedFoods.forEach((f, i) => {
        formData.append(`foods[${i}][food]`, String(f.food));
        formData.append(
          `foods[${i}][quantity]`,
          String(Number(f.quantity) || 0)
        );
      });

      await dispatch(updateMeal({ id, updateData: formData })).unwrap();
      toast.success('Meal updated successfully!');
      navigate('/nutrition');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update meal.');
    } finally {
      setSubmitting(false);
    }
  };

  if (mealLoading) {
    return (
      <div className='p-10 text-center text-slate-500 animate-pulse'>
        Loading meal...
      </div>
    );
  }
  if (error) {
    return <div className='p-10 text-center text-red-500'>{error}</div>;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50'>
      <div className='max-w-7xl mx-auto p-6 sm:p-8'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-extrabold text-slate-800 flex items-center justify-center gap-3'>
            <span className='p-2 bg-emerald-100 text-emerald-700 rounded-xl'>
              <i className='fas fa-utensils'></i>
            </span>
            Edit Your Meal
          </h1>
          <div className='w-24 h-1 bg-emerald-500 mx-auto mt-3 rounded-full'></div>
          <p className='text-slate-500 mt-2 text-sm'>
            Customize your meal’s details and nutrition values.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          <div className='lg:col-span-7 space-y-6'>
            <SectionCard title='Basics'>
              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <LabelWithIcon
                    icon={<FaClipboardList className='text-blue-600' />}
                    text='Meal Name'
                  />
                  <input
                    type='text'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder='Ex: High Protein Breakfast Bowl'
                    className='w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200'
                  />
                </div>
                <div>
                  <LabelWithIcon
                    icon={<FaHamburger className='text-yellow-500' />}
                    text='Meal Type'
                  />
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
              </div>
            </SectionCard>

            <SectionCard title='Nutrition Summary'>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                <StatCard
                  icon={<FaFire className='text-orange-600' />}
                  label='Calories'
                  value={`${Math.round(totals.calories)} kcal`}
                  bg='bg-orange-50'
                  border='border-orange-200'
                />
                <StatCard
                  icon={<FaLeaf className='text-yellow-600' />}
                  label='Protein'
                  value={`${totals.protein.toFixed(1)} g`}
                  bg='bg-yellow-50'
                  border='border-yellow-200'
                />
                <StatCard
                  icon={<FaDrumstickBite className='text-green-600' />}
                  label='Fat'
                  value={`${totals.fat.toFixed(1)} g`}
                  bg='bg-green-50'
                  border='border-green-200'
                />
                <StatCard
                  icon={<FaDrumstickBite className='text-teal-600' />}
                  label='Carbs'
                  value={`${totals.carbohydrates.toFixed(1)} g`}
                  bg='bg-teal-50'
                  border='border-teal-200'
                />
              </div>
            </SectionCard>

            <SectionCard title='Foods in this Meal'>
              {selectedFoods.length ? (
                <div className='space-y-3 max-h-80 overflow-y-auto pr-1'>
                  {selectedFoods.map(f => (
                    <div
                      key={String(f.food)}
                      className='flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200'
                    >
                      <div className='flex items-center gap-3'>
                        <img
                          src={f.image || '/placeholder-food.png'}
                          alt={f.title}
                          className='w-12 h-12 rounded-lg object-cover border'
                        />
                        <div>
                          <p className='font-medium text-slate-800'>
                            {f.title}
                          </p>
                          <p className='text-xs text-slate-500'>
                            {f.calories} kcal • P {f.protein}g • C{' '}
                            {f.carbohydrate}g • F {f.fat}g
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <input
                          type='number'
                          min={1}
                          value={f.quantity}
                          onChange={e =>
                            handleQtyChange(f.food, e.target.value)
                          }
                          className='w-20 border rounded-lg px-2 py-1 text-sm text-center focus:ring-2 focus:ring-emerald-300 outline-none'
                        />
                        <button
                          onClick={() => handleRemoveFood(f.food)}
                          className='px-2 py-2 rounded-md text-white bg-rose-500 hover:bg-rose-600'
                          title='Remove'
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='p-4 border-2 border-dashed border-slate-300 rounded-lg text-center text-sm text-slate-500 bg-white'>
                  No foods yet. Use the Food Library to add.
                </div>
              )}
              <p className='mt-3 text-xs text-slate-400'>
                *Adjust quantities to update nutrition values.
              </p>
            </SectionCard>
          </div>

          <div className='lg:col-span-5'>
            <div className='sticky top-6 space-y-6'>
              <SectionCard title='Meal Image'>
                <div className='overflow-hidden rounded-xl border border-slate-200 shadow-sm'>
                  {image || currentMeal?.image ? (
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image || currentMeal.image
                      }
                      alt='Meal'
                      className='w-full h-64 object-cover'
                    />
                  ) : (
                    <div className='w-full h-64 bg-slate-100 grid place-items-center text-slate-500'>
                      No image
                    </div>
                  )}
                </div>

                <label className='block text-sm font-medium text-slate-700 mt-4 mb-2'>
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
              </SectionCard>

              <FoodLibrary
                handleAddFood={handleAddFoodFromLibrary}
                selectedFoodIds={selectedFoodIds}
              />

              {currentMeal?.user && (
                <SectionCard title='Created by'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-900'>
                      {currentMeal.user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className='font-medium text-slate-800'>
                        {currentMeal.user.name}
                      </p>
                      <p className='text-xs text-slate-500'>
                        {currentMeal.user.email}
                      </p>
                      <p className='text-xs text-slate-400'>
                        Role: {currentMeal.user.role} • Membership:{' '}
                        {currentMeal.user.membershipLevel}
                      </p>
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <button
            onClick={handleUpdateMeal}
            disabled={submitting}
            className={`w-full rounded-lg px-4 py-3 text-white text-lg font-medium shadow transition ${
              submitting
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {submitting ? 'Saving Changes...' : 'Save Meal Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

function SectionCard({ title, children }) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
      {title && (
        <h2 className='text-base font-semibold text-slate-800 mb-4'>{title}</h2>
      )}
      {children}
    </div>
  );
}
function LabelWithIcon({ icon, text }) {
  return (
    <label className='block text-sm font-medium text-slate-700 mb-2'>
      <span className='inline-flex items-center gap-2'>
        {icon} {text}
      </span>
    </label>
  );
}
function StatCard({ icon, label, value, bg, border }) {
  return (
    <div
      className={`rounded-xl ${bg} border ${border} p-4 text-center flex flex-col items-center justify-center`}
    >
      <div className='mb-2 w-12 h-12 rounded-full flex items-center justify-center bg-white/60'>
        <span className='text-2xl'>{icon}</span>
      </div>
      <p className='text-xs text-slate-600'>{label}</p>
      <p className='text-xl font-bold text-slate-800'>{value}</p>
    </div>
  );
}

export default EditMeal;
