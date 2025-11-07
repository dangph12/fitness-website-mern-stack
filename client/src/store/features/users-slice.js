import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    {
      page = 1,
      limit = 10,
      search = '',
      role = [],
      gender = [],
      membershipLevel = []
    },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (search && search.trim()) {
        const searchTerm = search.trim();
        params.name = searchTerm;
      }

      if (role && role.length > 0) {
        params.role = Array.isArray(role) ? role.join(',') : role;
      }

      if (gender && gender.length > 0) {
        params.gender = Array.isArray(gender) ? gender.join(',') : gender;
      }

      // Thêm membershipLevel filter
      if (membershipLevel && membershipLevel.length > 0) {
        params.membershipLevel = Array.isArray(membershipLevel)
          ? membershipLevel.join(',')
          : membershipLevel;
      }

      console.log('Fetching users with params:', params);

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

export const fetchUsersExact = createAsyncThunk(
  'users/fetchUsersExact',
  async (
    { name = '', email = '', role = '', gender = '' },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (name && name.trim()) params.name = name.trim();
      if (email && email.trim()) params.email = email.trim();
      if (role && role.trim()) params.role = role.trim();
      if (gender && gender.trim()) params.gender = gender.trim();

      const response = await axiosInstance.get('/api/users', { params });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Test failed');
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

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/users', userData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create user'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/users/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user'
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
    role: [],
    gender: [],
    membershipLevel: []
  },
  deleteLoading: false,
  deleteError: null,
  userDetailsLoading: false,
  userDetailsError: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null
};

const handleUsersResponse = (state, payload) => {
  if (payload && typeof payload === 'object') {
    if (payload.users && Array.isArray(payload.users)) {
      state.users = payload.users;
      state.totalPages = payload.totalPages || 1;
      state.totalUsers = payload.totalUsers || payload.users.length;
    } else if (Array.isArray(payload)) {
      state.users = payload;
      state.totalUsers = payload.length;
      state.totalPages = Math.ceil(payload.length / state.limit);
    } else {
      state.users = [];
      state.totalPages = 0;
      state.totalUsers = 0;
    }
  } else {
    state.users = [];
    state.totalPages = 0;
    state.totalUsers = 0;
  }
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
        role: [],
        gender: [],
        membershipLevel: []
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
    // Handle fetchUsers
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        handleUsersResponse(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.users = [];
        state.totalPages = 0;
        state.totalUsers = 0;
      });

    // Handle fetchUsersExact
    builder
      .addCase(fetchUsersExact.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersExact.fulfilled, (state, action) => {
        state.loading = false;
        handleUsersResponse(state, action.payload);
      })
      .addCase(fetchUsersExact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle delete
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

    // Handle fetchUserDetails
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

    // Handle createUser
    builder
      .addCase(createUser.pending, state => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false;
        if (action.payload) {
          state.users.unshift(action.payload);
          state.totalUsers += 1;
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      });

    // Handle updateUser
    builder
      .addCase(updateUser.pending, state => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (action.payload) {
          const index = state.users.findIndex(
            user => user._id === action.payload._id
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  }
});

export const {
  setFilters,
  setCurrentPage,
  setLimit,
  clearFilters,
  clearSelectedUser,
  clearErrors,
  clearCreateError,
  clearUpdateError
} = usersSlice.actions;

export default usersSlice.reducer;
