import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '/src/lib/axios-instance.js';
// Đổi tất cả action types
export const fetchMeals = createAsyncThunk(
  'adminMeals/fetchMeals', // Đổi từ 'meals/fetchMeals'
  async ({ page, limit, sortBy, sortOrder, filterParams }) => {
    const response = await axiosInstance.get('/api/meals', {
      params: { page, limit, sortBy, sortOrder, ...filterParams }
    });
    return response.data.data;
  }
);

export const fetchAdminMeals = createAsyncThunk(
  'adminMeals/fetchAdminMeals', // Đổi từ 'meals/fetchAdminMeals'
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/meals/admin');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch admin meals'
      );
    }
  }
);

export const fetchMealById = createAsyncThunk(
  'adminMeals/fetchMealById', // Đổi từ 'meals/fetchMealById'
  async id => {
    const response = await axiosInstance.get(`/api/meals/${id}`);
    return response.data.data;
  }
);

export const createMeal = createAsyncThunk(
  'adminMeals/createMeal', // Đổi từ 'meals/createMeal'
  async mealData => {
    const isFD =
      typeof FormData !== 'undefined' && mealData instanceof FormData;
    const response = await axiosInstance.post('/api/meals', mealData, {
      ...(isFD && { headers: { 'Content-Type': 'multipart/form-data' } })
    });
    return response.data.data;
  }
);

export const createMultipleMeals = createAsyncThunk(
  'adminMeals/createMultipleMeals', // Đổi từ 'meals/createMultipleMeals'
  async payload => {
    const isFD = typeof FormData !== 'undefined' && payload instanceof FormData;

    const res = isFD
      ? await axiosInstance.post('/api/meals/multiple', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      : await axiosInstance.post('/api/meals/multiple', { meals: payload });

    const data = res.data?.data;
    if (!Array.isArray(data)) throw new Error('Unexpected response format');
    return data;
  }
);

export const updateMeal = createAsyncThunk(
  'adminMeals/updateMeal', // Đổi từ 'meals/updateMeal'
  async ({ id, updateData }) => {
    const isFD =
      typeof FormData !== 'undefined' && updateData instanceof FormData;
    const response = await axiosInstance.put(`/api/meals/${id}`, updateData, {
      ...(isFD && { headers: { 'Content-Type': 'multipart/form-data' } })
    });
    return response.data.data;
  }
);

export const updateMultipleMeals = createAsyncThunk(
  'adminMeals/updateMultipleMeals', // Đổi từ 'meals/updateMultipleMeals'
  async (mealDataArray, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/api/meals/multiple', {
        meals: mealDataArray
      });
      const data = response.data?.data;
      if (!Array.isArray(data)) throw new Error('Unexpected response format');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update multiple meals'
      );
    }
  }
);

export const deleteMeal = createAsyncThunk(
  'adminMeals/deleteMeal', // Đổi từ 'meals/deleteMeal'
  async id => {
    await axiosInstance.delete(`/api/meals/${id}`);
    return id;
  }
);

export const cloneAdminMealToUser = createAsyncThunk(
  'adminMeals/cloneAdminMealToUser', // Đổi từ 'meals/cloneAdminMealToUser'
  async ({ mealId, body }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/meals/${mealId}/clone`, body);
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Clone admin meal failed'
      );
    }
  }
);

export const fetchMealsByUser = createAsyncThunk(
  'adminMeals/fetchMealsByUser', // Đổi từ 'meals/fetchMealsByUser'
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/meals/user/${userId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const adminMealSlice = createSlice({
  name: 'adminMeals', // Đổi từ 'meals'
  initialState: {
    meals: [],
    adminMeals: [],
    mealsByUser: [],
    currentMeal: null,
    loading: false,
    error: null,
    totalPages: 0,
    totalMeals: 0
  },
  reducers: {
    setMeals: (state, action) => {
      state.meals = action.payload;
    },
    clearMeals: state => {
      state.meals = [];
      state.currentMeal = null;
      state.totalPages = 0;
      state.totalMeals = 0;
    }
  },
  extraReducers: builder => {
    builder
      // ========= Fetch meals with pagination =========
      .addCase(fetchMeals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload?.meals || [];
        state.totalPages = action.payload?.totalPages || 0;
        state.totalMeals = action.payload?.totalMeals || 0;
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch meals';
      })

      // ========= Admin meals =========
      .addCase(fetchAdminMeals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.adminMeals = action.payload || [];
      })
      .addCase(fetchAdminMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch admin meals';
      })

      // ========= Fetch meal by ID =========
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.currentMeal = action.payload;
      })

      // ========= Create meal =========
      .addCase(createMeal.fulfilled, (state, action) => {
        state.meals = [action.payload, ...(state.meals || [])];
      })

      // ========= Create multiple =========
      .addCase(createMultipleMeals.fulfilled, (state, action) => {
        state.meals = [...action.payload, ...(state.meals || [])];
      })

      // ========= Update =========
      .addCase(updateMeal.fulfilled, (state, action) => {
        const index = (state.meals || []).findIndex(
          meal => meal._id === action.payload._id
        );
        if (index !== -1) state.meals[index] = action.payload;
        if (state.currentMeal?._id === action.payload._id)
          state.currentMeal = action.payload;
      })

      // ========= Update multiple =========
      .addCase(updateMultipleMeals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMultipleMeals.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach(updatedMeal => {
          const idx = (state.meals || []).findIndex(
            m => m._id === updatedMeal._id
          );
          if (idx !== -1) state.meals[idx] = updatedMeal;
        });
      })
      .addCase(updateMultipleMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update multiple meals';
      })

      // ========= Delete =========
      .addCase(deleteMeal.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.payload;

        state.meals = (state.meals || []).filter(
          meal => meal._id !== deletedId
        );

        state.adminMeals = (state.adminMeals || []).filter(
          meal => meal._id !== deletedId
        );

        state.mealsByUser = (state.mealsByUser || []).filter(
          meal => meal._id !== deletedId
        );

        if (state.currentMeal?._id === deletedId) {
          state.currentMeal = null;
        }
      })
      .addCase(deleteMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete meal';
      })

      .addCase(cloneAdminMealToUser.fulfilled, (state, action) => {
        state.mealsByUser = [action.payload, ...(state.mealsByUser || [])];
      })
      .addCase(cloneAdminMealToUser.rejected, (state, action) => {
        state.error = action.payload || 'Clone admin meal failed';
      })

      // ========= Meals by User =========
      .addCase(fetchMealsByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.mealsByUser = action.payload || [];
      })
      .addCase(fetchMealsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch meals by user';
      });
  }
});

export const { setMeals, clearMeals } = adminMealSlice.actions;
export default adminMealSlice.reducer;
