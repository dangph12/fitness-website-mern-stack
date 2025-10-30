import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

export const fetchAiMeals = createAsyncThunk(
  'mealAi/fetchAiMeals',
  async (aiParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/ai/meals', aiParams, {
        timeout: 0
      });
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const mealAiSlice = createSlice({
  name: 'mealAi',
  initialState: {
    recommendedMeals: [],
    loading: false,
    error: null
  },
  reducers: {
    clearAiError: state => {
      state.error = null;
    },
    clearAiRecommendations: state => {
      state.recommendedMeals = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAiMeals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedMeals = action.payload;
      })
      .addCase(fetchAiMeals.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'AI meal generation failed';
      });
  }
});

export const { clearAiError, clearAiRecommendations } = mealAiSlice.actions;
export default mealAiSlice.reducer;
