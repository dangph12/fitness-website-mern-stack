import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch all body records
export const fetchBodyRecords = createAsyncThunk(
  'bodyRecords/fetchBodyRecords',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axiosInstance.get(
        `/api/body-records${queryString ? `?${queryString}` : ''}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching body records:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Error fetching body records'
      );
    }
  }
);

// Fetch body record by ID
export const fetchBodyRecordById = createAsyncThunk(
  'bodyRecords/fetchBodyRecordById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/body-records/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching body record by ID:', error);
      return rejectWithValue(
        error.response
          ? error.response.data
          : 'An unknown error occurred while fetching body record'
      );
    }
  }
);

// Create body record - backend automatically calculates BMI and finds bodyClassification
export const createBodyRecord = createAsyncThunk(
  'bodyRecords/createBodyRecord',
  async (bodyRecordData, { rejectWithValue }) => {
    try {
      if (!bodyRecordData.height || !bodyRecordData.weight) {
        return rejectWithValue({
          message: 'Both height and weight are required to create a body record'
        });
      }

      if (!bodyRecordData.user) {
        return rejectWithValue({
          message: 'User ID is required'
        });
      }

      const payload = {
        user: bodyRecordData.user,
        height: Number(bodyRecordData.height),
        weight: Number(bodyRecordData.weight)
      };

      const response = await axiosInstance.post('/api/body-records', payload);
      return response.data.data;
    } catch (error) {
      console.error('Error creating body record:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to create body record'
      );
    }
  }
);

// Update body record
// export const updateBodyRecord = createAsyncThunk(
//   'bodyRecords/update',
//   async ({ id, data }) => {
//     const res = await axiosInstance.put(`/api/body-records/${id}`, data);
//     return res.data.data;
//   }
// );
export const updateBodyRecord = createAsyncThunk(
  'bodyRecords/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const payload = {
        user: String(data.user),
        height: Number(data.height),
        weight: Number(data.weight)
      };
      if (data.bmi !== undefined && data.bmi !== null && data.bmi !== '') {
        payload.bmi = Number(data.bmi);
      }

      const res = await axiosInstance.put(`/api/body-records/${id}`, payload);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Failed to update body record'
      );
    }
  }
);

// Delete body record
export const deleteBodyRecord = createAsyncThunk(
  'bodyRecords/deleteBodyRecord',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/body-records/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting body record:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to delete body record'
      );
    }
  }
);

// Fetch user body records
export const fetchUserBodyRecords = createAsyncThunk(
  'bodyRecords/fetchUserBodyRecords',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/body-records/user/${userId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user body records:', error);
      return rejectWithValue(
        error.response
          ? error.response.data
          : 'Failed to fetch user body records'
      );
    }
  }
);

// Body records slice
const bodyRecordsSlice = createSlice({
  name: 'bodyRecords',
  initialState: {
    bodyRecords: [],
    currentBodyRecord: null,
    userBodyRecords: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false,
    deleteError: null
  },
  reducers: {
    setBodyRecords: (state, action) => {
      state.bodyRecords = action.payload;
    },
    clearBodyRecords: state => {
      state.bodyRecords = [];
      state.currentBodyRecord = null;
      state.userBodyRecords = [];
    },
    clearError: state => {
      state.error = null;
    },
    clearCreateError: state => {
      state.createError = null;
    },
    clearUpdateError: state => {
      state.updateError = null;
    },
    clearDeleteError: state => {
      state.deleteError = null;
    },
    clearAllErrors: state => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    }
  },
  extraReducers: builder => {
    builder
      // Fetch all body records
      .addCase(fetchBodyRecords.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBodyRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.bodyRecords = action.payload;
      })
      .addCase(fetchBodyRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch body records';
        console.error('Error fetching body records:', action.payload);
      })

      // Fetch body record by ID
      .addCase(fetchBodyRecordById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBodyRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBodyRecord = action.payload;
      })
      .addCase(fetchBodyRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch body record';
      })

      // Create body record
      .addCase(createBodyRecord.pending, state => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createBodyRecord.fulfilled, (state, action) => {
        state.createLoading = false;
        if (action.payload) {
          state.bodyRecords.unshift(action.payload);
          // Update user body records if they exist
          if (state.userBodyRecords.length >= 0) {
            state.userBodyRecords.unshift(action.payload);
          }
        }
      })
      .addCase(createBodyRecord.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create body record';
        console.error('Create body record error:', action.payload);
      })

      // Update body record
      .addCase(updateBodyRecord.pending, state => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateBodyRecord.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (action.payload) {
          const index = state.bodyRecords.findIndex(
            record => record._id === action.payload._id
          );
          if (index !== -1) {
            state.bodyRecords[index] = action.payload;
          }

          const userIndex = state.userBodyRecords.findIndex(
            record => record._id === action.payload._id
          );
          if (userIndex !== -1) {
            state.userBodyRecords[userIndex] = action.payload;
          }

          if (state.currentBodyRecord?._id === action.payload._id) {
            state.currentBodyRecord = action.payload;
          }
        }
      })
      .addCase(updateBodyRecord.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Failed to update body record';
      })

      // Delete body record
      .addCase(deleteBodyRecord.pending, state => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteBodyRecord.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.bodyRecords = state.bodyRecords.filter(
          record => record._id !== action.payload
        );
        state.userBodyRecords = state.userBodyRecords.filter(
          record => record._id !== action.payload
        );

        if (state.currentBodyRecord?._id === action.payload) {
          state.currentBodyRecord = null;
        }
      })
      .addCase(deleteBodyRecord.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'Failed to delete body record';
      })

      // Fetch user body records
      .addCase(fetchUserBodyRecords.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBodyRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.userBodyRecords = action.payload || [];
      })
      .addCase(fetchUserBodyRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user body records';
      });
  }
});

export const {
  setBodyRecords,
  clearBodyRecords,
  clearError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearAllErrors
} = bodyRecordsSlice.actions;

// Selectors
export const selectBodyRecords = state => state.bodyRecords.bodyRecords;
export const selectCurrentBodyRecord = state =>
  state.bodyRecords.currentBodyRecord;
export const selectUserBodyRecords = state => state.bodyRecords.userBodyRecords;
export const selectBodyRecordsLoading = state => state.bodyRecords.loading;
export const selectBodyRecordsError = state => state.bodyRecords.error;
export const selectCreateLoading = state => state.bodyRecords.createLoading;
export const selectCreateError = state => state.bodyRecords.createError;
export const selectUpdateLoading = state => state.bodyRecords.updateLoading;
export const selectUpdateError = state => state.bodyRecords.updateError;
export const selectDeleteLoading = state => state.bodyRecords.deleteLoading;
export const selectDeleteError = state => state.bodyRecords.deleteError;

export default bodyRecordsSlice.reducer;
