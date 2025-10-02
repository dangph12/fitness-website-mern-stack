import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch all muscles
export const fetchMuscles = createAsyncThunk(
  'muscles/fetchMuscles',
  async (_, { rejectWithValue }) => {
    // No parameters needed here
    try {
      const response = await axiosInstance.get('/api/muscles'); // Make a simple GET request without params
      return response.data.data; // Return muscles data
    } catch (error) {
      console.error('Error fetching muscles:', error); // Log the error
      return rejectWithValue(
        error.response ? error.response.data : 'Error fetching muscles'
      ); // Return error if failed
    }
  }
);

// Fetch muscle by ID
export const fetchMuscleById = createAsyncThunk(
  'muscles/fetchMuscleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/muscles/${id}`);
      return response.data.data; // Return the muscle data
    } catch (error) {
      console.error('Error fetching muscle by ID:', error);
      return rejectWithValue(
        error.response
          ? error.response.data
          : 'An unknown error occurred while fetching muscle'
      ); // Provide detailed error message
    }
  }
);

// Create muscle
export const createMuscle = createAsyncThunk(
  'muscles/createMuscle',
  async (muscleData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/muscles', muscleData);
      return response.data.data; // Return the created muscle data
    } catch (error) {
      console.error('Error creating muscle:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to create muscle'
      ); // Provide error message
    }
  }
);

// Update muscle
export const updateMuscle = createAsyncThunk(
  'muscles/updateMuscle',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/muscles/${id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data; // Return the updated muscle data
    } catch (error) {
      console.error('Error updating muscle:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to update muscle'
      ); // Provide error message
    }
  }
);

// Delete muscle
export const deleteMuscle = createAsyncThunk(
  'muscles/deleteMuscle',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/muscles/${id}`);
      return id; // Return the ID of the deleted muscle
    } catch (error) {
      console.error('Error deleting muscle:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to delete muscle'
      ); // Provide error message
    }
  }
);

// Muscle slice
const muscleSlice = createSlice({
  name: 'muscles',
  initialState: {
    muscles: [],
    currentMuscle: null,
    loading: false,
    error: null
  },
  reducers: {
    setMuscles: (state, action) => {
      state.muscles = action.payload;
    },
    clearMuscles: state => {
      state.muscles = [];
      state.currentMuscle = null;
    }
  },
  extraReducers: builder => {
    builder
      // Fetch all muscles
      .addCase(fetchMuscles.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMuscles.fulfilled, (state, action) => {
        state.loading = false;
        state.muscles = action.payload; // Store muscles data in state
      })
      .addCase(fetchMuscles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch muscles'; // Error handling
        console.error('Error fetching muscles:', action.payload); // Log the error to the console
      })
      // Fetch muscle by ID
      .addCase(fetchMuscleById.fulfilled, (state, action) => {
        state.currentMuscle = action.payload; // Update the current muscle
      })
      // Create muscle
      .addCase(createMuscle.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMuscle.fulfilled, (state, action) => {
        state.loading = false;
        state.muscles.unshift(action.payload); // Add newly created muscle to the list
      })
      .addCase(createMuscle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create muscle'; // Error handling
      })
      // Update muscle
      .addCase(updateMuscle.fulfilled, (state, action) => {
        const index = state.muscles.findIndex(
          muscle => muscle._id === action.payload._id
        );
        if (index !== -1) {
          state.muscles[index] = action.payload; // Update the muscle in the list
        }
        if (state.currentMuscle?._id === action.payload._id) {
          state.currentMuscle = action.payload; // Update the current muscle if it's being edited
        }
      })
      // Delete muscle
      .addCase(deleteMuscle.fulfilled, (state, action) => {
        state.muscles = state.muscles.filter(
          muscle => muscle._id !== action.payload // Remove the deleted muscle
        );
      });
  }
});

export const { setMuscles, clearMuscles } = muscleSlice.actions;

export default muscleSlice.reducer;
