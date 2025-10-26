import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { fetchFoods } from '~/store/features/food-slice';

const FoodList = ({ selectedFoods, setSelectedFoods }) => {
  const dispatch = useDispatch();
  const {
    foods = [],
    loading,
    error
  } = useSelector(state => state.foods.foods || {});

  const [quantities, setQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState('');
  const deferredSearch = useDeferredValue(searchText);
  const query = deferredSearch.trim().toLowerCase();

  useEffect(() => {
    if (!foods?.length) {
      dispatch(fetchFoods({ page: 1, limit: 50 }));
    }
  }, [dispatch, foods?.length]);

  const filteredFoods = useMemo(() => {
    if (!query) return foods;
    return foods.filter(f => (f.title || '').toLowerCase().includes(query));
  }, [foods, query]);

  const handleFoodSelect = (food, quantity) => {
    const exists = selectedFoods.some(f => f.food === food._id);
    if (exists) return;

    const selected = {
      food: food._id,
      title: food.title,
      image: food.image,
      calories: Number(food.calories) || 0,
      fat: Number(food.fat) || 0,
      carbohydrates: Number(food.carbohydrate) || 0,
      protein: Number(food.protein) || 0,
      quantity: Number(quantity) || 1
    };

    setSelectedFoods(prev => [...prev, selected]);
    setIsModalOpen(false);
  };

  const handleQuantityChange = (food, event) => {
    const v = event.target.value;
    setQuantities(prev => ({
      ...prev,
      [food._id]: v
    }));
  };

  const handleRemoveFood = foodId => {
    setSelectedFoods(prev => prev.filter(f => f.food !== foodId));
  };

  if (loading) {
    return (
      <div className='rounded-2xl w-full'>
        <div className='animate-pulse space-y-3'>
          <div className='h-10 bg-slate-200 rounded w-40' />
          <div className='h-24 bg-slate-200 rounded' />
          <div className='h-24 bg-slate-200 rounded' />
        </div>
      </div>
    );
  }
  if (error)
    return (
      <div className='text-red-500'>Error fetching foods: {String(error)}</div>
    );

  return (
    <div className='rounded-2xl w-full'>
      <button
        onClick={() => setIsModalOpen(true)}
        className='inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition'
      >
        <FaPlus className='w-4 h-4' />
        Add Food
      </button>

      {selectedFoods.length > 0 ? (
        <div className='mt-5'>
          <h4 className='font-semibold text-lg mb-3'>Selected Foods</h4>
          <div className='space-y-4'>
            {selectedFoods.map((food, index) => (
              <div
                key={food.food}
                className='flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition'
              >
                <div className='flex items-center gap-4 min-w-0'>
                  <img
                    src={food.image}
                    alt={food.title}
                    className='w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0'
                  />
                  <div className='min-w-0'>
                    <p className='font-medium text-slate-900 truncate'>
                      {food.title}
                    </p>
                    <div className='mt-1 flex items-center gap-2'>
                      <button
                        onClick={() => {
                          const next = [...selectedFoods];
                          const q = Number(next[index].quantity) || 1;
                          next[index].quantity = Math.max(1, q - 1);
                          setSelectedFoods(next);
                        }}
                        className='h-8 w-8 grid place-items-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100'
                        aria-label='Decrease'
                      >
                        −
                      </button>
                      <input
                        type='number'
                        min={1}
                        value={food.quantity}
                        onChange={e => {
                          const next = [...selectedFoods];
                          next[index].quantity = Math.max(
                            1,
                            Number(e.target.value) || 1
                          );
                          setSelectedFoods(next);
                        }}
                        className='w-20 text-center rounded-md border border-slate-300 py-1.5 outline-none focus:ring-2 focus:ring-slate-200'
                      />
                      <button
                        onClick={() => {
                          const next = [...selectedFoods];
                          const q = Number(next[index].quantity) || 0;
                          next[index].quantity = q + 1;
                          setSelectedFoods(next);
                        }}
                        className='h-8 w-8 grid place-items-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100'
                        aria-label='Increase'
                      >
                        +
                      </button>
                      <span className='text-xs text-slate-500 ml-1'>units</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveFood(food.food)}
                  className='inline-flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition'
                >
                  <FaTrash className='w-4 h-4' />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='text-center text-slate-500 my-5'>No foods selected</div>
      )}

      {isModalOpen && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-[1px] flex justify-center items-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-3xl relative max-h-[85vh] overflow-hidden'>
            <div className='flex items-center justify-between p-4 border-b border-slate-200'>
              <h3 className='text-lg font-semibold text-slate-900'>
                Select a Food
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-slate-500 hover:text-slate-700 text-xl leading-none'
                aria-label='Close'
              >
                &times;
              </button>
            </div>

            <div className='p-4 border-b border-slate-200'>
              <div className='relative'>
                <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                <input
                  type='text'
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder='Search by food name…'
                  className='w-full pl-9 pr-9 py-2.5 rounded-md border border-slate-300 outline-none focus:ring-2 focus:ring-slate-200'
                />
                {searchText && (
                  <button
                    onClick={() => setSearchText('')}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                    aria-label='Clear'
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <p className='mt-2 text-xs text-slate-500'>
                Showing {filteredFoods.length} of {foods.length} foods
              </p>
            </div>

            <div className='overflow-auto p-4 space-y-4 max-h-[65vh]'>
              {filteredFoods.length > 0 ? (
                filteredFoods.map(food => (
                  <div
                    key={food._id}
                    className='flex items-center justify-between p-4 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition'
                  >
                    <div className='flex items-center gap-4 min-w-0'>
                      <div className='relative size-16 overflow-hidden rounded-lg border border-slate-200 shrink-0'>
                        <img
                          src={
                            food.image instanceof File
                              ? URL.createObjectURL(food.image)
                              : food.image || ''
                          }
                          alt={food.title}
                          className='absolute inset-0 h-full w-full object-cover'
                        />
                      </div>
                      <div className='min-w-0'>
                        <p className='font-semibold text-slate-900 truncate'>
                          {food.title}
                        </p>
                        <p className='text-xs text-slate-500 mt-0.5'>
                          {food.category} • {food.calories ?? 0} kcal /{' '}
                          {food.unit ?? 100}g • {food.fat ?? 0} g fat
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <input
                        type='number'
                        min='1'
                        value={quantities[food._id] ?? 1}
                        onChange={e => handleQuantityChange(food, e)}
                        className='w-20 text-center rounded-md border border-slate-300 py-1.5 outline-none focus:ring-2 focus:ring-slate-200'
                      />
                      <button
                        onClick={() =>
                          handleFoodSelect(food, quantities[food._id] ?? 1)
                        }
                        className='bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition'
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center text-slate-500 py-10'>
                  No foods match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList;
