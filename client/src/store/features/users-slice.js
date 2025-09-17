import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    { page = 1, limit = 10, name = '', role = '', gender = '' },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (name) {
        params.name = name;
      }
      if (role) {
        params.role = role;
      }
      if (gender) {
        params.gender = gender;
      }

      const response = await axiosInstance.get('/api/users', {
        params
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'users/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  totalPages: 0,
  totalUsers: 0,
  currentPage: 1,
  limit: 10,
  filters: {
    search: '',
    role: '',
    gender: ''
  },
  deleteLoading: false,
  deleteError: null,
  userDetailsLoading: false,
  userDetailsError: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.currentPage = 1;
    },
    clearFilters: state => {
      state.filters = {
        search: '',
        role: '',
        gender: ''
      };
      state.currentPage = 1;
    },
    clearSelectedUser: state => {
      state.selectedUser = null;
      state.userDetailsError = null;
    },
    clearErrors: state => {
      state.error = null;
      state.deleteError = null;
      state.userDetailsError = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle structured response with metadata
        if (
          action.payload &&
          typeof action.payload === 'object' &&
          action.payload.users
        ) {
          state.users = action.payload.users;
          state.totalPages = action.payload.totalPages;
          state.totalUsers = action.payload.totalUsers;
        } else if (Array.isArray(action.payload)) {
          // Fallback for direct array response
          state.users = action.payload;
          state.totalUsers = action.payload.length;
          state.totalPages = Math.ceil(action.payload.length / state.limit);
        } else {
          // Handle empty or invalid response
          state.users = [];
          state.totalPages = 0;
          state.totalUsers = 0;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.users = [];
      });

    builder
      .addCase(deleteUser.pending, state => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
        state.totalUsers = Math.max(0, state.totalUsers - 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });

    builder
      .addCase(fetchUserDetails.pending, state => {
        state.userDetailsLoading = true;
        state.userDetailsError = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetailsLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.userDetailsLoading = false;
        state.userDetailsError = action.payload;
      });
  }
});

export const {
  setFilters,
  setCurrentPage,
  setLimit,
  clearFilters,
  clearSelectedUser,
  clearErrors
} = usersSlice.actions;

export default usersSlice.reducer;
