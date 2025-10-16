import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch workouts with filters (page, limit, sortBy, sortOrder, title)
export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchWorkouts',
  async ({
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    title = ''
  }) => {
    try {
      const response = await axiosInstance.get('/api/workouts/filter', {
        params: { page, limit, sortBy, sortOrder, title } // Passing filter params to the backend
      });
      return response.data.data; // returning the workouts data
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  }
);

// Fetch workout by ID
export const fetchWorkoutById = createAsyncThunk(
  'workouts/fetchWorkoutById',
  async id => {
    try {
      const response = await axiosInstance.get(`/api/workouts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching workout by ID:', error);
      throw error;
    }
  }
);

// Create a new workout
export const createWorkout = createAsyncThunk(
  'workouts/createWorkout',
  async workoutData => {
    try {
      const response = await axiosInstance.post('/api/workouts', workoutData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Update workout
export const updateWorkout = createAsyncThunk(
  'workouts/updateWorkout',
  async ({ workoutId, updateData }) => {
    try {
      const response = await axiosInstance.put(
        `/api/workouts/${workoutId}`,
        updateData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  }
);

// Delete workout
export const deleteWorkout = createAsyncThunk(
  'workouts/deleteWorkout',
  async id => {
    try {
      await axiosInstance.delete(`/api/workouts/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  }
);

// Workout slice
export const workoutSlice = createSlice({
  name: 'workouts',
  initialState: {
    workouts: [],
    currentWorkout: null,
    totalWorkouts: 0,
    totalPages: 1,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch workouts with filters
      .addCase(fetchWorkouts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.workouts = Array.isArray(data?.workouts) ? data.workouts : [];
        state.totalWorkouts = data?.totalWorkouts || 0;
        state.totalPages = data?.totalPages || 1;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch workouts';
      })

      // Fetch workout by ID
      .addCase(fetchWorkoutById.fulfilled, (state, action) => {
        state.currentWorkout = action.payload;
      })

      // Create workout
      .addCase(createWorkout.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts.unshift(action.payload);
      })
      .addCase(createWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create workout';
      })

      // Update workout
      .addCase(updateWorkout.fulfilled, (state, action) => {
        const index = state.workouts.findIndex(
          workout => workout._id === action.payload._id
        );
        if (index !== -1) {
          state.workouts[index] = action.payload;
        }
        if (state.currentWorkout?._id === action.payload._id) {
          state.currentWorkout = action.payload;
        }
      })

      // Delete workout
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.workouts = state.workouts.filter(
          workout => workout._id !== action.payload
        );
      });
  }
});

export default workoutSlice.reducer;
