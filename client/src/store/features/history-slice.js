import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch user history
export const fetchHistoryByUser = createAsyncThunk(
  'history/fetchHistoryByUser',
  async userId => {
    const response = await axiosInstance.get(`/api/histories/user/${userId}`);
    return response.data.data;
  }
);

// Add history record
export const addHistory = createAsyncThunk(
  'history/addHistory',
  async (historyData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/histories', historyData);
      return response.data.data;
    } catch (error) {
      console.error('Error add history:', error);
      return rejectWithValue(
        error.response?.data || error.message || 'Something went wrong'
      );
    }
  }
);

// Remove history record
export const removeHistory = createAsyncThunk(
  'history/removeHistory',
  async historyId => {
    await axiosInstance.delete(`/api/histories/${historyId}`);
    return historyId;
  }
);

const initialState = {
  history: [],
  loading: false,
  error: null
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Fetch History By User
    builder
      .addCase(fetchHistoryByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistoryByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistoryByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add History Record
      .addCase(addHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history.push(action.payload);
      })
      .addCase(addHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Remove History Record
      .addCase(removeHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = state.history.filter(
          history => history._id !== action.payload
        );
      })
      .addCase(removeHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default historySlice.reducer;
