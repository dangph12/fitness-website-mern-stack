import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { fetchFoods } from '~/store/features/food-slice';

const FoodList = ({ selectedFoods, setSelectedFoods }) => {
  const dispatch = useDispatch();
  const {
    foods = [],
    loading,
    error
  } = useSelector(state => state.foods.foods);

  const [quantities, setQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (foods.length === 0) {
      dispatch(fetchFoods({ page: 1, limit: 23 }));
    }
  }, [dispatch, foods]);

  const handleFoodSelect = (food, quantity) => {
    const foodExists = selectedFoods.find(f => f.foodId === food._id);
    if (foodExists) return;

    const selectedFood = {
      foodId: food._id,
      title: food.title,
      image: food.image,
      quantity: quantity || 1
    };

    setSelectedFoods(prev => [...prev, selectedFood]);
    setIsModalOpen(false);
  };

  const handleQuantityChange = (food, event) => {
    const updatedQuantity = event.target.value;
    setQuantities(prev => ({
      ...prev,
      [food._id]: updatedQuantity
    }));
  };

  const handleRemoveFood = foodId => {
    setSelectedFoods(prev => prev.filter(f => f.foodId !== foodId));
  };

  if (loading) return <div>Loading foods...</div>;
  if (error) return <div>Error fetching foods: {error}</div>;

  return (
    <div className='rounded-2xl w-full'>
      <button
        onClick={() => setIsModalOpen(true)}
        className='bg-green-500 text-white px-6 py-3 rounded-md mb-6 flex items-center hover:bg-green-600 transition'
      >
        <FaPlus className='w-5 h-5 mr-2' />
        Add Food
      </button>

      {selectedFoods.length > 0 ? (
        <div>
          <h4 className='font-semibold text-lg mb-4'>Selected Foods:</h4>
          <div className='space-y-4'>
            {selectedFoods.map((food, index) => (
              <div
                key={food.foodId}
                className='flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-all'
              >
                <div className='flex items-center gap-4'>
                  {/* Ảnh món ăn */}
                  <img
                    src={food.image}
                    alt={food.title}
                    className='w-16 h-16 object-cover rounded-md border border-gray-200'
                  />

                  {/* Thông tin món ăn */}
                  <div>
                    <p className='font-medium text-gray-800'>{food.title}</p>
                    <div className='flex items-center gap-2 mt-1'>
                      {/* Nút giảm */}
                      <button
                        onClick={() => {
                          const updatedFoods = [...selectedFoods];
                          if (updatedFoods[index].quantity > 1) {
                            updatedFoods[index].quantity -= 1;
                            setSelectedFoods(updatedFoods);
                          }
                        }}
                        className='px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm font-bold'
                      >
                        −
                      </button>

                      {/* Số lượng */}
                      <span className='text-sm text-gray-700 font-medium w-8 text-center'>
                        {food.quantity}
                      </span>

                      {/* Nút tăng */}
                      <button
                        onClick={() => {
                          const updatedFoods = [...selectedFoods];
                          updatedFoods[index].quantity += 1;
                          setSelectedFoods(updatedFoods);
                        }}
                        className='px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm font-bold'
                      >
                        +
                      </button>

                      <span className='text-xs text-gray-500 ml-2'>units</span>
                    </div>
                  </div>
                </div>

                {/* Nút xóa */}
                <button
                  onClick={() => handleRemoveFood(food.foodId)}
                  className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2 transition'
                >
                  <FaTrash />
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='text-center text-gray-500 mb-5'>No foods selected</div>
      )}

      {isModalOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-70 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-auto relative'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='absolute top-3 right-3 text-gray-600 hover:text-red-500 text-lg font-bold'
            >
              ×
            </button>

            <h3 className='text-xl font-semibold mb-5 text-gray-800'>
              Select a Food
            </h3>

            {foods.length > 0 ? (
              <div className='space-y-5'>
                {foods.map(food => (
                  <div
                    key={food._id}
                    className='flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition'
                  >
                    <div className='flex items-center gap-4'>
                      <img
                        src={
                          food.image instanceof File
                            ? URL.createObjectURL(food.image)
                            : food.image || '/fallback.jpg'
                        }
                        alt={food.title}
                        className='w-16 h-16 object-cover rounded-md border border-gray-200'
                      />
                      <div>
                        <p className='font-semibold text-gray-800'>
                          {food.title}
                        </p>
                        <p className='text-sm text-gray-500'>{food.category}</p>
                        <p className='text-xs text-gray-400'>
                          {food.calories} kcal / {food.unit}g
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <input
                        type='number'
                        min='1'
                        value={quantities[food._id] || 1}
                        onChange={e => handleQuantityChange(food, e)}
                        className='w-16 p-2 border border-gray-300 rounded-md text-center'
                      />
                      <button
                        onClick={() =>
                          handleFoodSelect(food, quantities[food._id] || 1)
                        }
                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center text-gray-500'>
                No foods available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList;
