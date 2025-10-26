import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// GET /api/favorites/user/:userId
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/favorites/user/${userId}`);
      return res.data?.data ?? { favorites: [] };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch favorites'
      );
    }
  }
);

// POST /api/favorites  body: { user, workout }
export const addFavoriteItems = createAsyncThunk(
  'favorites/addFavoriteItems',
  async ({ userId, workouts }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/favorites`, {
        user: userId,
        workout: workouts
      });
      return res.data?.data ?? null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add favorite item'
      );
    }
  }
);

// DELETE /api/favorites/:favoriteId
export const removeFavoriteItems = createAsyncThunk(
  'favorites/removeFavoriteItems',
  async ({ favoriteId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/favorites/${favoriteId}`);
      return { favoriteId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove favorite item'
      );
    }
  }
);

const favouriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorite: { favorites: [] },
    loading: false,
    error: null
  },
  reducers: {
    clearFavorite: state => {
      state.favorite = { favorites: [] };
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
        state.favorite = action.payload || { favorites: [] };
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
      .addCase(addFavoriteItems.fulfilled, state => {
        state.loading = false;
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
        const id = action.payload?.favoriteId;
        if (id) {
          state.favorite = {
            ...state.favorite,
            favorites: (state.favorite?.favorites || []).filter(
              f => f._id !== id
            )
          };
        }
      })
      .addCase(removeFavoriteItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearFavorite } = favouriteSlice.actions;
export default favouriteSlice.reducer;
