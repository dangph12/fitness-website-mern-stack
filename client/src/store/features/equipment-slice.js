import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch all equipments
export const fetchEquipments = createAsyncThunk(
  'equipments/fetchEquipments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/equipments');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching equipments:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Error fetching equipments'
      );
    }
  }
);

// Fetch equipment by ID
export const fetchEquipmentById = createAsyncThunk(
  'equipments/fetchEquipmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/equipments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching equipment by ID:', error);
      return rejectWithValue(
        error.response
          ? error.response.data
          : 'An unknown error occurred while fetching equipment'
      );
    }
  }
);

// Create equipment
export const createEquipment = createAsyncThunk(
  'equipments/createEquipment',
  async (equipmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/api/equipments',
        equipmentData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating equipment:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to create equipment'
      );
    }
  }
);

// Update equipment
export const updateEquipment = createAsyncThunk(
  'equipments/updateEquipment',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/equipments/${id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating equipment:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to update equipment'
      );
    }
  }
);

// Delete equipment
export const deleteEquipment = createAsyncThunk(
  'equipments/deleteEquipment',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/equipments/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting equipment:', error);
      return rejectWithValue(
        error.response ? error.response.data : 'Failed to delete equipment'
      );
    }
  }
);

// Equipment slice
const equipmentSlice = createSlice({
  name: 'equipments',
  initialState: {
    equipments: [],
    currentEquipment: null,
    loading: false,
    error: null
  },
  reducers: {
    setEquipments: (state, action) => {
      state.equipments = action.payload;
    },
    clearEquipments: state => {
      state.equipments = [];
      state.currentEquipment = null;
    }
  },
  extraReducers: builder => {
    builder
      // Fetch all equipments
      .addCase(fetchEquipments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments = action.payload;
      })
      .addCase(fetchEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch equipments';
        console.error('Error fetching equipments:', action.payload);
      })
      // Fetch equipment by ID
      .addCase(fetchEquipmentById.fulfilled, (state, action) => {
        state.currentEquipment = action.payload;
      })
      // Create equipment
      .addCase(createEquipment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments.unshift(action.payload);
      })
      .addCase(createEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create equipment';
      })
      // Update equipment
      .addCase(updateEquipment.fulfilled, (state, action) => {
        const index = state.equipments.findIndex(
          equipment => equipment._id === action.payload._id
        );
        if (index !== -1) {
          state.equipments[index] = action.payload;
        }
        if (state.currentEquipment?._id === action.payload._id) {
          state.currentEquipment = action.payload;
        }
      })
      // Delete equipment
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.equipments = state.equipments.filter(
          equipment => equipment._id !== action.payload
        );
      });
  }
});

export const { setEquipments, clearEquipments } = equipmentSlice.actions;

export default equipmentSlice.reducer;
