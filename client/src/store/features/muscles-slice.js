import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch all muscles
export const fetchMuscles = createAsyncThunk(
  'muscles/fetchMuscles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/muscles');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching muscles:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Error fetching muscles'
      );
    }
  }
);

// Fetch muscle by ID
export const fetchMuscleById = createAsyncThunk(
  'muscles/fetchMuscleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/muscles/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching muscle by ID:', error);
      return rejectWithValue(
        error.response
          ? error.response.data
          : 'An unknown error occurred while fetching muscle'
      );
    }
  }
);

// Create muscle
export const createMuscle = createAsyncThunk(
  'muscles/createMuscle',
  async (muscleData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/muscles', muscleData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating muscle:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to create muscle'
      );
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
      return response.data.data;
    } catch (error) {
      console.error('Error updating muscle:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to update muscle'
      );
    }
  }
);

// Delete muscle
export const deleteMuscle = createAsyncThunk(
  'muscles/deleteMuscle',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/muscles/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting muscle:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to delete muscle'
      );
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
      state.muscles = [action.payload, ...state.muscles];
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
        state.muscles = action.payload;
      })
      .addCase(fetchMuscles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch muscles';
        console.error('Error fetching muscles:', action.payload);
      })
      // Fetch muscle by ID
      .addCase(fetchMuscleById.fulfilled, (state, action) => {
        state.currentMuscle = action.payload;
      })
      // Create muscle
      .addCase(createMuscle.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMuscle.fulfilled, (state, action) => {
        state.loading = false;
        state.muscles = [action.payload, ...state.muscles];
      })
      .addCase(createMuscle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create muscle';
      })
      // Update muscle
      .addCase(updateMuscle.fulfilled, (state, action) => {
        const index = state.muscles.findIndex(
          muscle => muscle._id === action.payload._id
        );
        if (index !== -1) {
          state.muscles[index] = action.payload;
        }
        if (state.currentMuscle?._id === action.payload._id) {
          state.currentMuscle = action.payload;
        }
      })
      // Delete muscle
      .addCase(deleteMuscle.fulfilled, (state, action) => {
        state.muscles = state.muscles.filter(
          muscle => muscle._id !== action.payload
        );
      });
  }
});

export const { setMuscles, clearMuscles } = muscleSlice.actions;

export default muscleSlice.reducer;
