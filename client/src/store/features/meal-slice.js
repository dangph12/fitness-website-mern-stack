import {
  createAsyncThunk,
  createSlice
} from '/node_modules/.vite/deps/@reduxjs_toolkit.js?v=8a52d1ed';
import axiosInstance from '/src/lib/axios-instance.js';

// Fetch all meals
export const fetchMeals = createAsyncThunk(
  'meals/fetchMeals',
  async ({ page, limit, sortBy, sortOrder, filterParams }) => {
    const response = await axiosInstance.get('/api/meals', {
      params: { page, limit, sortBy, sortOrder, ...filterParams }
    });
    return response.data.data.meals;
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

// Create single meal
export const createMeal = createAsyncThunk(
  'meals/createMeal',
  async mealData => {
    try {
      const response = await axiosInstance.post('/api/meals', mealData);
      return response.data.data;
    } catch (error) {
      console.error(
        'Error creating meal:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
);

// Create multiple meals (new API)
export const createMultipleMeals = createAsyncThunk(
  'meals/createMultipleMeals',
  async mealDataArray => {
    try {
      const response = await axiosInstance.post('/api/meals/multiple', {
        meals: mealDataArray
      });

      if (!Array.isArray(response.data.data)) {
        throw new Error('Unexpected response format');
      }

      return response.data.data;
    } catch (error) {
      console.error(
        'Error creating multiple meals:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
);

// Update meal
export const updateMeal = createAsyncThunk(
  'meals/updateMeal',
  async ({ id, updateData }) => {
    const response = await axiosInstance.put(`/api/meals/${id}`, updateData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }
);

// Delete meal
export const deleteMeal = createAsyncThunk('meals/deleteMeal', async id => {
  await axiosInstance.delete(`/api/meals/${id}`);
  return id;
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
        state.meals = action.payload || [];
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch meals';
      })

      // Fetch meal by ID
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.currentMeal = action.payload;
      })

      // Create meal
      .addCase(createMeal.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.meals.unshift(action.payload);
      })
      .addCase(createMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create meal';
      })

      // Create multiple meals (new action)
      .addCase(createMultipleMeals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMultipleMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = [...action.payload, ...state.meals];
      })
      .addCase(createMultipleMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create multiple meals';
      })

      // Update meal
      .addCase(updateMeal.fulfilled, (state, action) => {
        const index = state.meals.findIndex(
          meal => meal._id === action.payload._id
        );
        if (index !== -1) {
          state.meals[index] = action.payload;
        }
        if (state.currentMeal?._id === action.payload._id) {
          state.currentMeal = action.payload;
        }
      })

      // Delete meal
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.meals = state.meals.filter(meal => meal._id !== action.payload);
      });
  }
});

export const { setMeals, clearMeals } = mealSlice.actions;

export default mealSlice.reducer;
