import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch paginated exercises
export const fetchExercises = createAsyncThunk(
  'exercises/fetchExercises',
  async ({ page = 1, limit = 10, sortBy, sortOrder, filterParams }) => {
    try {
      const response = await axiosInstance.get('/api/exercises', {
        params: { page, limit, sortBy, sortOrder, ...filterParams }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  }
);

// Fetch reference lists (muscles & equipments)
export const fetchReferenceLists = createAsyncThunk(
  'exercises/fetchReferenceLists',
  async () => {
    try {
      const [mResp, eResp] = await Promise.all([
        axiosInstance.get('/api/muscles').then(r => r.data?.data || []),
        axiosInstance.get('/api/equipments').then(r => r.data?.data || [])
      ]);

      const mMap = {};
      (Array.isArray(mResp) ? mResp : []).forEach(item => {
        const id = item._id || item.id;
        if (id) mMap[id] = item.name || item.title || item.label || id;
      });

      const eMap = {};
      (Array.isArray(eResp) ? eResp : []).forEach(item => {
        const id = item._id || item.id;
        if (id) eMap[id] = item.name || item.title || item.label || id;
      });

      return { musclesMap: mMap, equipmentsMap: eMap };
    } catch (err) {
      console.warn('Failed to load muscles/equipments lists', err);
      return { musclesMap: {}, equipmentsMap: {} };
    }
  }
);

// Fetch all (no pagination)
export const fetchAllExercises = createAsyncThunk(
  'exercises/fetchAllExercises',
  async () => {
    const response = await axiosInstance.get('/api/exercises/all');
    return response.data.data;
  }
);

// Fetch by ID
export const fetchExerciseById = createAsyncThunk(
  'exercises/fetchExerciseById',
  async id => {
    const response = await axiosInstance.get(`/api/exercises/${id}`);
    return response.data.data;
  }
);

// Create
export const createExercise = createAsyncThunk(
  'exercises/createExercise',
  async exerciseData => {
    const response = await axiosInstance.post('/api/exercises', exerciseData);
    return response.data.data;
  }
);

// Update
export const updateExercise = createAsyncThunk(
  'exercises/updateExercise',
  async ({ id, updateData }) => {
    const response = await axiosInstance.put(
      `/api/exercises/${id}`,
      updateData
    );
    return response.data.data;
  }
);

// Delete
export const deleteExercise = createAsyncThunk(
  'exercises/deleteExercise',
  async id => {
    await axiosInstance.delete(`/api/exercises/${id}`);
    return id;
  }
);

export const exerciseSlice = createSlice({
  name: 'exercises',
  initialState: {
    exercises: [],
    currentExercise: null,
    totalExercises: 0,
    totalPages: 1,
    loading: false,
    error: null,
    musclesMap: {},
    equipmentsMap: {},
    referencesLoading: false
  },
  reducers: {
    setExercises: (state, action) => {
      state.exercises = action.payload;
    },
    clearExercises: state => {
      state.exercises = [];
      state.currentExercise = null;
    }
  },
  extraReducers: builder => {
    builder
      // FETCH PAGINATED
      .addCase(fetchExercises.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.exercises = Array.isArray(data?.exercises) ? data.exercises : [];
        state.totalExercises = data?.totalExercises || 0;
        state.totalPages = data?.totalPages || 1;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exercises';
      })

      // FETCH REFERENCE LISTS
      .addCase(fetchReferenceLists.pending, state => {
        state.referencesLoading = true;
      })
      .addCase(fetchReferenceLists.fulfilled, (state, action) => {
        state.referencesLoading = false;
        state.musclesMap = action.payload.musclesMap;
        state.equipmentsMap = action.payload.equipmentsMap;
      })
      .addCase(fetchReferenceLists.rejected, (state, action) => {
        state.referencesLoading = false;
        state.musclesMap = {};
        state.equipmentsMap = {};
      })

      // FETCH ALL
      .addCase(fetchAllExercises.fulfilled, (state, action) => {
        state.exercises = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.currentExercise = action.payload;
      })

      // CREATE
      .addCase(createExercise.pending, state => {
        state.loading = true;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises.unshift(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create exercise';
      })

      // UPDATE
      .addCase(updateExercise.fulfilled, (state, action) => {
        const index = state.exercises.findIndex(
          ex => ex._id === action.payload._id
        );
        if (index !== -1) state.exercises[index] = action.payload;
        if (state.currentExercise?._id === action.payload._id)
          state.currentExercise = action.payload;
      })

      // DELETE
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.exercises = state.exercises.filter(
          ex => ex._id !== action.payload
        );
      });
  }
});

export const { setExercises, clearExercises } = exerciseSlice.actions;
export default exerciseSlice.reducer;
