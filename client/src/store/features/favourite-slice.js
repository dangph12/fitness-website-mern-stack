// src/store/features/favorite-slice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// GET /api/favorites/:userId
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/favorites/${userId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch favorites'
      );
    }
  }
);

// POST /api/favorites/:userId/items  body: { workouts: [id] }
export const addFavoriteItems = createAsyncThunk(
  'favorites/addFavoriteItems',
  async ({ userId, workouts }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/favorites/${userId}/items`, {
        workouts
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add favorite items'
      );
    }
  }
);

// DELETE /api/favorites/:userId/items  body: { workouts: [id] }
export const removeFavoriteItems = createAsyncThunk(
  'favorites/removeFavoriteItems',
  async ({ userId, workouts }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/api/favorites/${userId}/items`, {
        data: { workouts }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove favorite items'
      );
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorite: { user: null, workouts: [] },
    loading: false,
    error: null
  },
  reducers: {
    clearFavorite: state => {
      state.favorite = { user: null, workouts: [] };
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: builder => {
    builder
      // fetch
      .addCase(fetchFavorites.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorite = action.payload || { user: null, workouts: [] };
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add
      .addCase(addFavoriteItems.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteItems.fulfilled, (state, action) => {
        state.loading = false;
        state.favorite = action.payload || state.favorite;
      })
      .addCase(addFavoriteItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // remove
      .addCase(removeFavoriteItems.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteItems.fulfilled, (state, action) => {
        state.loading = false;
        state.favorite = action.payload || state.favorite;
      })
      .addCase(removeFavoriteItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
