import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

export const fetchFoods = createAsyncThunk(
  'foods/fetchFoods',
  async ({ page, limit, sortBy, sortOrder, filterParams }) => {
    try {
      console.log({ page, limit, sortBy, sortOrder, filterParams });
      const response = await axiosInstance.get('/api/foods', {
        params: { page, limit, sortBy, sortOrder, ...filterParams }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching foods:', error);
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
    foods: {
      foods: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    currentFood: null,
    loading: false,
    error: null
  },
  reducers: {
    setFoods: (state, action) => {
      state.foods = action.payload;
    },
    clearFoods: state => {
      state.foods = {
        foods: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0
      };
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
      .addCase(fetchFoodById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFood = action.payload;
      })
      .addCase(fetchFoodById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch food';
      })
      // Create food
      .addCase(createFood.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFood.fulfilled, (state, action) => {
        state.loading = false;
        // Add to the beginning of foods array
        if (Array.isArray(state.foods.foods)) {
          state.foods.foods.unshift(action.payload);
          state.foods.totalCount = (state.foods.totalCount || 0) + 1;
        }
      })
      .addCase(createFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create food';
      })
      // Update food
      .addCase(updateFood.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFood.fulfilled, (state, action) => {
        state.loading = false;
        // Update in foods array
        if (Array.isArray(state.foods.foods)) {
          const index = state.foods.foods.findIndex(
            food => food._id === action.payload._id
          );
          if (index !== -1) {
            state.foods.foods[index] = action.payload;
          }
        }
        // Update currentFood if it's the same
        if (state.currentFood?._id === action.payload._id) {
          state.currentFood = action.payload;
        }
      })
      .addCase(updateFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update food';
      })
      // Delete food
      .addCase(deleteFood.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFood.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from foods array
        if (Array.isArray(state.foods.foods)) {
          state.foods.foods = state.foods.foods.filter(
            food => food._id !== action.payload
          );
          state.foods.totalCount = Math.max(
            0,
            (state.foods.totalCount || 0) - 1
          );
        }
      })
      .addCase(deleteFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete food';
      });
  }
});

export const { setFoods, clearFoods } = foodSlice.actions;

export default foodSlice.reducer;
