import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// fetch plans
export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async ({
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filterParams = {}
  }) => {
    try {
      const response = await axiosInstance.get('/api/plans', {
        params: { page, limit, sortBy, sortOrder, ...filterParams }
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }
);

// Fetch plan by ID
export const fetchPlanById = createAsyncThunk(
  'plans/fetchPlanById',
  async id => {
    try {
      const response = await axiosInstance.get(`/api/plans/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching plan by ID:', error);
      throw error;
    }
  }
);

// Create a new plan
export const createPlan = createAsyncThunk(
  'plans/createPlan',
  async planData => {
    try {
      const response = await axiosInstance.post('/api/plans', planData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Update plan
export const updatePlan = createAsyncThunk(
  'plans/updatePlan',
  async ({ id, updateData }) => {
    const response = await axiosInstance.put(`/api/plans/${id}`, updateData);
    return response.data.data;
  }
);

// Delete plan
export const deletePlan = createAsyncThunk('plans/deletePlan', async id => {
  try {
    await axiosInstance.delete(`/api/plans/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting plan:', error);
    throw error;
  }
});

// Plan slice
export const planSlice = createSlice({
  name: 'plans',
  initialState: {
    plans: [],
    currentPlan: null,
    totalPlans: 0,
    totalPages: 1,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPlans.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.plans || action.payload.items || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalPlans = action.payload.totalPlans || 0;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch plan by ID
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.currentPlan = action.payload;
      })

      // Create plan
      .addCase(createPlan.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.unshift(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create plan';
      })

      // Update plan
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(
          plan => plan._id === action.payload._id
        );
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        if (state.currentPlan?._id === action.payload._id) {
          state.currentPlan = action.payload;
        }
      })

      // Delete plan
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(plan => plan._id !== action.payload);
      });
  }
});

export default planSlice.reducer;
