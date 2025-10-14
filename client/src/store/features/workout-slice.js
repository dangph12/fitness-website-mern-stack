import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch workouts
// export const fetchWorkouts = createAsyncThunk(
//   'workouts/fetchWorkouts',
//   async ({
//     page = 1,
//     limit = 10,
//     sortBy = 'createdAt',
//     sortOrder = 'desc',
//     filterParams = {}
//   }) => {
//     try {
//       const response = await axiosInstance.get('/api/workouts', {
//         params: { page, limit, sortBy, sortOrder, ...filterParams }
//       });
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching workouts:', error);
//       throw error;
//     }
//   }
// );

export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchWorkouts',
  async () => {
    try {
      const response = await axiosInstance.get('/api/workouts'); // Fetch all workouts without page or limit
      return response.data.data;
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
      console.log('Creating workout with data:', workoutData);

      const response = await axiosInstance.post('/api/workouts', workoutData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating workout:', error);

      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      if (error.message) {
        console.error('Error message:', error.message);
      }

      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Update workout
export const updateWorkout = createAsyncThunk(
  'workouts/updateWorkout',
  async ({ id, updateData }) => {
    try {
      const response = await axiosInstance.put(
        `/api/workouts/${id}`,
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
      // Fetch workouts
      .addCase(fetchWorkouts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
