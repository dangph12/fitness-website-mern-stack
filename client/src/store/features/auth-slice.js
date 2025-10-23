import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import axiosInstance from '~/lib/axios-instance';

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async () => {
    try {
      const accessToken =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken');

      if (!accessToken) {
        return null;
      }

      const decoded = jwtDecode(accessToken);
      return { accessToken, user: decoded };
    } catch (error) {
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      return null;
    }
  }
);

// Thêm action mới để fetch full user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/api/auth/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    userProfile: null, // Thêm state cho full user profile
    loading: true,
    profileLoading: false, // Thêm loading riêng cho profile
    error: null,
    profileError: null
  },
  reducers: {
    loadUser: (state, action) => {
      const { accessToken, isRemember } = action.payload;
      if (!accessToken) {
        state.user = null;
        return;
      }
      try {
        // if token exists in localStorage, overwrite it
        const existsInLocalStorage = localStorage.getItem('accessToken');

        if (existsInLocalStorage) {
          localStorage.setItem('accessToken', accessToken);
          sessionStorage.removeItem('accessToken');
        } else {
          if (isRemember) {
            localStorage.setItem('accessToken', accessToken);
            sessionStorage.removeItem('accessToken');
          } else {
            sessionStorage.setItem('accessToken', accessToken);
            localStorage.removeItem('accessToken');
          }
        }

        const decoded = jwtDecode(accessToken);
        state.user = decoded;
      } catch (error) {
        state.user = null;
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
      }
    },
    clearProfileError: state => {
      state.profileError = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(initializeAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          const wasInLocalStorage = localStorage.getItem('accessToken');
          if (wasInLocalStorage) {
            localStorage.setItem('accessToken', action.payload.accessToken);
          } else {
            sessionStorage.setItem('accessToken', action.payload.accessToken);
          }
        } else {
          state.user = null;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      // Handle fetchUserProfile
      .addCase(fetchUserProfile.pending, state => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      .addCase(logout.pending, state => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.userProfile = null;
        state.error = null;
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
      })
      .addCase(logout.rejected, state => {
        state.loading = false;
        state.user = null;
        state.userProfile = null;
        state.error = null;
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
      });
  }
});

export const { loadUser, clearProfileError } = authSlice.actions;

export default authSlice.reducer;
