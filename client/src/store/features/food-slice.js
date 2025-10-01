import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch all foods
// export const fetchFoods = createAsyncThunk(
//   'foods/fetchFoods',
//   async ({ page, limit, sortBy, sortOrder, filterParams }) => {
//     const response = await axiosInstance.get('/api/foods', {
//       params: { page, limit, sortBy, sortOrder, ...filterParams }
//     });
//     return response.data.data;
//   }
// );

export const fetchFoods = createAsyncThunk(
  'foods/fetchFoods',
  async ({ page, limit, sortBy, sortOrder, filterParams }) => {
    try {
      const response = await axiosInstance.get('/api/foods', {
        params: { page, limit, sortBy, sortOrder, ...filterParams }
      });
      console.log('Fetched foods:', response.data.data); // Log to check data
      return response.data.data; // Assuming response.data.data contains the list of foods
    } catch (error) {
      console.error('Error fetching foods:', error); // Log any errors
      throw error;
    }
  }
);

// Fetch food by ID
export const fetchFoodById = createAsyncThunk(
  'foods/fetchFoodById',
  async id => {
    const response = await axiosInstance.get(`/api/foods/${id}`);
    return response.data.data;
  }
);

// Create food
export const createFood = createAsyncThunk(
  'foods/createFood',
  async foodData => {
    const response = await axiosInstance.post('/api/foods', foodData);
    return response.data.data;
  }
);

// Update food
export const updateFood = createAsyncThunk(
  'foods/updateFood',
  async ({ id, updateData }) => {
    const response = await axiosInstance.put(`/api/foods/${id}`, updateData);
    return response.data.data;
  }
);

// Delete food
export const deleteFood = createAsyncThunk('foods/deleteFood', async id => {
  await axiosInstance.delete(`/api/foods/${id}`);
  return id;
});

// Food slice
export const foodSlice = createSlice({
  name: 'foods',
  initialState: {
    foods: [],
    currentFood: null,
    loading: false,
    error: null
  },
  reducers: {
    setFoods: (state, action) => {
      state.foods = action.payload;
    },
    clearFoods: state => {
      state.foods = [];
      state.currentFood = null;
    }
  },
  extraReducers: builder => {
    builder
      // Fetch all foods
      .addCase(fetchFoods.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch foods';
      })
      // Fetch food by ID
      .addCase(fetchFoodById.fulfilled, (state, action) => {
        state.currentFood = action.payload;
      })
      // Create food
      .addCase(createFood.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFood.fulfilled, (state, action) => {
        state.loading = false;
        state.foods.unshift(action.payload);
      })
      .addCase(createFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create food';
      })
      // Update food
      .addCase(updateFood.fulfilled, (state, action) => {
        const index = state.foods.findIndex(
          food => food._id === action.payload._id
        );
        if (index !== -1) {
          state.foods[index] = action.payload;
        }
        if (state.currentFood?._id === action.payload._id) {
          state.currentFood = action.payload;
        }
      })
      // Delete food
      .addCase(deleteFood.fulfilled, (state, action) => {
        state.foods = state.foods.filter(food => food._id !== action.payload);
      });
  }
});

export const { setFoods, clearFoods } = foodSlice.actions;

export default foodSlice.reducer;
