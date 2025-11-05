import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Lấy tất cả goals
export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/goals');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Lấy goal theo userId
export const fetchGoalByUser = createAsyncThunk(
  'goals/fetchGoalByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/goals/user/${userId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Cập nhật goal theo userId
export const updateGoalByUser = createAsyncThunk(
  'goals/updateGoalByUser',
  async ({ userId, goalData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/api/goals/user/${userId}`,
        goalData
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Xoá goal theo id
export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/goals/${goalId}`);
      return goalId;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

const goalSlice = createSlice({
  name: 'goals',
  initialState: {
    goals: [],
    userGoal: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // ===== Fetch all =====
      .addCase(fetchGoals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload || [];
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Fetch by user =====
      .addCase(fetchGoalByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoalByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoal = action.payload;
      })
      .addCase(fetchGoalByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Update =====
      .addCase(updateGoalByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoalByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoal = action.payload;
      })
      .addCase(updateGoalByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Delete =====
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(g => g._id !== action.payload);
        if (state.userGoal?._id === action.payload) state.userGoal = null;
      });
  }
});

export default goalSlice.reducer;
