import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch all meals
export const fetchMeals = createAsyncThunk(
  'meals/fetchMeals',
  async ({ page, limit, sortBy, sortOrder, filterParams }) => {
    const response = await axiosInstance.get('/api/meals', {
      params: { page, limit, sortBy, sortOrder, ...filterParams }
    });
    return response.data.data; // Assuming response.data.data contains the list of meals
  }
);

// Fetch meal by ID
export const fetchMealById = createAsyncThunk(
  'meals/fetchMealById',
  async id => {
    const response = await axiosInstance.get(`/api/meals/${id}`);
    return response.data.data;
  }
);

// Create meal
export const createMeal = createAsyncThunk(
  'meals/createMeal',
  async mealData => {
    const response = await axiosInstance.post('/api/meals', mealData);
    return response.data.data;
  }
);

// Update meal
export const updateMeal = createAsyncThunk(
  'meals/updateMeal',
  async ({ id, updateData }) => {
    const response = await axiosInstance.put(`/api/meals/${id}`, updateData);
    return response.data.data;
  }
);

// Delete meal
export const deleteMeal = createAsyncThunk('meals/deleteMeal', async id => {
  await axiosInstance.delete(`/api/meals/${id}`);
  return id; // Return the ID of the meal to delete it from the store
});

// Meal slice
export const mealSlice = createSlice({
  name: 'meals',
  initialState: {
    meals: [],
    currentMeal: null,
    loading: false,
    error: null
  },
  reducers: {
    setMeals: (state, action) => {
      state.meals = action.payload;
    },
    clearMeals: state => {
      state.meals = [];
      state.currentMeal = null;
    }
  },
  extraReducers: builder => {
    builder
      // Fetch all meals
      .addCase(fetchMeals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload; // Update meals with fetched data
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch meals'; // Error handling
      })

      // Fetch meal by ID
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.currentMeal = action.payload; // Set current meal based on ID
      })

      // Create meal
      .addCase(createMeal.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.meals.unshift(action.payload); // Add the newly created meal to the start of the list
      })
      .addCase(createMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create meal'; // Error handling
      })

      // Update meal
      .addCase(updateMeal.fulfilled, (state, action) => {
        const index = state.meals.findIndex(
          meal => meal._id === action.payload._id
        );
        if (index !== -1) {
          state.meals[index] = action.payload; // Update the meal in the list
        }
        if (state.currentMeal?._id === action.payload._id) {
          state.currentMeal = action.payload; // Update current meal if it matches
        }
      })

      // Delete meal
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.meals = state.meals.filter(meal => meal._id !== action.payload); // Remove the meal from the list
      });
  }
});

export const { setMeals, clearMeals } = mealSlice.actions;

export default mealSlice.reducer;
