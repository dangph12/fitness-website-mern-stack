import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch foods with filter + sort + pagination
export const fetchFoods = createAsyncThunk(
  'foods/fetchFoods',
  async ({ page, limit, sortBy, sortOrder, filterParams }) => {
    try {
      const response = await axiosInstance.get('/api/foods', {
        params: { page, limit, sortBy, sortOrder, ...filterParams }
      });

      return {
        foods: response.data.data.foods ?? response.data.data.meals ?? [],
        totalCount:
          response.data.data.totalFoods ?? response.data.data.totalMeals ?? 0,
        currentPage: page,
        totalPages: response.data.data.totalPages ?? 1
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

// Fetch by ID
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

const foodSlice = createSlice({
  name: 'foods',
  initialState: {
    foods: {
      foods: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 1
    },
    currentFood: null,
    loading: false,
    error: null
  },
  reducers: {
    clearFoods: state => {
      state.foods = { foods: [], totalCount: 0, currentPage: 1, totalPages: 1 };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFoods.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.currentPage === 1) {
          state.foods.foods = action.payload.foods;
        } else {
          state.foods.foods = [
            ...state.foods.foods,
            ...action.payload.foods.filter(
              newItem =>
                !state.foods.foods.some(oldItem => oldItem._id === newItem._id)
            )
          ];
        }

        state.foods.totalCount = action.payload.totalCount;
        state.foods.currentPage = action.payload.currentPage;
        state.foods.totalPages = action.payload.totalPages;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchFoodById.fulfilled, (state, action) => {
        state.currentFood = action.payload;
      })

      .addCase(createFood.fulfilled, (state, action) => {
        state.foods.foods.unshift(action.payload);
        state.foods.totalCount++;
      })

      .addCase(updateFood.fulfilled, (state, action) => {
        const index = state.foods.foods.findIndex(
          f => f._id === action.payload._id
        );
        if (index !== -1) state.foods.foods[index] = action.payload;
      })

      .addCase(deleteFood.fulfilled, (state, action) => {
        state.foods.foods = state.foods.foods.filter(
          f => f._id !== action.payload
        );

        state.foods.totalCount--;
      });
  }
});

export const { clearFoods } = foodSlice.actions;
export default foodSlice.reducer;
