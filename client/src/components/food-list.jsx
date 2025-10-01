// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchFoods } from '~/store/features/food-slice';

// const FoodList = ({ selectedFoods, setSelectedFoods }) => {
//   const dispatch = useDispatch();
//   const { foods = [], loading, error } = useSelector(state => state.foods);

//   useEffect(() => {
//     console.log('Fetched foods:', foods.foods);

//     if (!foods || foods.length === 0) {
//       dispatch(fetchFoods({ page: 1, limit: 23 }));
//     }
//   }, [dispatch, foods]);

//   const handleFoodSelect = food => {
//     const foodExists = selectedFoods.find(f => f.foodId === food._id);
//     if (foodExists) return;

//     setSelectedFoods([...selectedFoods, { foodId: food._id, quantity: 1 }]);
//   };

//   if (loading) {
//     return <div>Loading foods...</div>;
//   }

//   if (error) {
//     return <div>Error fetching foods: {error}</div>;
//   }

//   return (
//     <div>
//       <h3 className='text-lg font-semibold mb-4'>Select Foods</h3>
//       {foods.foods && foods.foods.length > 0 ? (
//         <div className='space-y-4'>
//           {foods.foods.map(food => (
//             <div
//               key={food._id}
//               className='flex items-center justify-between p-3 border border-gray-300 rounded-lg'
//             >
//               <div className='flex items-center space-x-4'>
//                 <img
//                   src={food.image}
//                   alt={food.title}
//                   className='w-12 h-12 object-cover rounded-md'
//                 />
//                 <span className='font-medium'>{food.title}</span>
//                 <span className='text-sm text-gray-500'>{food.category}</span>
//               </div>

//               <button
//                 onClick={() => handleFoodSelect(food)}
//                 className='bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600'
//               >
//                 Select
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div>No foods available</div>
//       )}
//     </div>
//   );
// };

// export default FoodList;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchFoods } from '~/store/features/food-slice';

const FoodList = ({ selectedFoods, setSelectedFoods }) => {
  const dispatch = useDispatch();
  const {
    foods = [],
    loading,
    error
  } = useSelector(state => state.foods.foods); // Default foods to an empty array
  const [quantities, setQuantities] = useState({}); // Store quantities for each food
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

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
      quantity: quantity || 1
    };
    setSelectedFoods([...selectedFoods, selectedFood]);
    setIsModalOpen(false); // Close the modal after selecting food
  };

  const handleQuantityChange = (food, event) => {
    const updatedQuantity = event.target.value;
    setQuantities({
      ...quantities,
      [food._id]: updatedQuantity
    });
  };

  const handleRemoveFood = foodId => {
    const updatedSelectedFoods = selectedFoods.filter(f => f.foodId !== foodId);
    setSelectedFoods(updatedSelectedFoods);
  };

  if (loading) {
    return <div>Loading foods...</div>;
  }

  if (error) {
    return <div>Error fetching foods: {error}</div>;
  }

  return (
    <div>
      <h3 className='text-2xl font-semibold mb-6 text-center'>Select Foods</h3>
      {/* Button to open the modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className='bg-green-500 text-white px-6 py-3 rounded-md mb-6'
      >
        + Add Food
      </button>

      {/* Selected Foods */}
      {selectedFoods.length > 0 ? (
        <div>
          <h4 className='font-medium text-lg mb-4'>Selected Foods:</h4>
          <div className='space-y-4'>
            {selectedFoods.map(food => (
              <div
                key={food.foodId}
                className='flex items-center justify-between p-4 border border-gray-300 rounded-lg'
              >
                <div className='flex items-center space-x-4'>
                  <span className='font-medium text-lg'>{food.title}</span>
                  <div className='text-sm text-gray-500'>
                    Quantity: {food.quantity}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFood(food.foodId)}
                  className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='text-center text-gray-500'>No foods selected</div>
      )}

      {/* Modal for selecting food */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-1/3'>
            <h3 className='text-xl font-semibold mb-4'>Select a Food</h3>
            <button
              onClick={() => setIsModalOpen(false)} // Close modal
              className='text-red-500 text-sm absolute top-2 right-2'
            >
              X
            </button>

            {foods.length > 0 ? (
              <div className='space-y-6'>
                {foods.map(food => (
                  <div
                    key={food._id}
                    className='flex items-center justify-between p-4 border border-gray-300 rounded-lg shadow-md'
                  >
                    {/* Food Image and Info */}
                    <div className='flex items-center space-x-4'>
                      <img
                        src={food.image}
                        alt={food.title}
                        className='w-16 h-16 object-cover rounded-lg border border-gray-200'
                      />
                      <div>
                        <span className='font-medium text-lg'>
                          {food.title}
                        </span>
                        <div className='text-sm text-gray-500'>
                          {food.category}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector and Select Button */}
                    <div className='flex items-center space-x-4'>
                      <input
                        type='number'
                        min='1'
                        value={quantities[food._id] || 1} // Default quantity is 1
                        onChange={e => handleQuantityChange(food, e)}
                        className='w-16 p-2 border border-gray-300 rounded-md text-center'
                      />
                      <button
                        onClick={() =>
                          handleFoodSelect(food, quantities[food._id] || 1)
                        } // Use selected quantity
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
