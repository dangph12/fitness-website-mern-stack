import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Server pagination (list)
export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchWorkouts',
  async ({
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    title = '',
    isPublic = ''
  }) => {
    const res = await axiosInstance.get('/api/workouts', {
      params: { page, limit, sortBy, sortOrder, title, isPublic }
    });
    return res.data.data;
  }
);

// Get ALL workouts (no pagination)
export const fetchAllWorkouts = createAsyncThunk(
  'workouts/fetchAllWorkouts',
  async (_args, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/workouts');
      const data = res?.data?.data;
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Get workouts by user
export const fetchWorkoutsByUser = createAsyncThunk(
  'workouts/fetchWorkoutsByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/workouts/user/${userId}`);
      const data = res?.data?.data?.workouts;
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// Get by id
export const fetchWorkoutById = createAsyncThunk(
  'workouts/fetchWorkoutById',
  async id => {
    const res = await axiosInstance.get(`/api/workouts/${id}`);
    return res.data.data;
  }
);

// Create
export const createWorkout = createAsyncThunk(
  'workouts/createWorkout',
  async workoutData => {
    const res = await axiosInstance.post('/api/workouts', workoutData);
    return res.data.data;
  }
);

// Update
export const updateWorkout = createAsyncThunk(
  'workouts/updateWorkout',
  async ({ workoutId, updateData }) => {
    const res = await axiosInstance.put(
      `/api/workouts/${workoutId}`,
      updateData
    );
    return res.data.data;
  }
);

// Delete
export const deleteWorkout = createAsyncThunk(
  'workouts/deleteWorkout',
  async id => {
    await axiosInstance.delete(`/api/workouts/${id}`);
    return id;
  }
);

// Share (public) a workout
export const shareWorkout = createAsyncThunk(
  'workouts/shareWorkout',
  async ({ workoutId, body }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/workouts/${workoutId}/share`,
        body
      );
      return res.data?.data?.workout;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to share workout'
      );
    }
  }
);

export const cloneWorkoutToUser = createAsyncThunk(
  'workouts/cloneWorkoutToUser',
  async ({ workoutId, userId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/workouts/${workoutId}/clone`, {
        userId
      });
      const cloned =
        res?.data?.data?.workout || res?.data?.data || res?.data?.workout;
      if (!cloned?._id) throw new Error('Unexpected clone response');
      return cloned;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || 'Clone failed'
      );
    }
  }
);

const upsertById = (arr, item) => {
  const i = arr.findIndex(x => x._id === item._id);
  if (i === -1) arr.unshift(item);
  else arr[i] = item;
};
const removeById = (arr, id) => arr.filter(x => x._id !== id);

export const workoutSlice = createSlice({
  name: 'workouts',
  initialState: {
    workouts: [],
    totalWorkouts: 0,
    totalPages: 1,

    currentWorkout: null,

    loading: false,
    error: null,

    allWorkouts: [],
    loadingAll: false,
    errorAll: null,

    workoutsByUser: [],
    loadingByUser: false,
    errorByUser: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      /* ---- Paged list ---- */
      .addCase(fetchWorkouts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.workouts = Array.isArray(data?.workouts) ? data.workouts : [];
        state.totalWorkouts = data?.totalWorkouts || 0;
        state.totalPages = data?.totalPages || 1;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch workouts';
      })

      /* ---- Get ALL (no pagination) ---- */
      .addCase(fetchAllWorkouts.pending, state => {
        state.loadingAll = true;
        state.errorAll = null;
      })
      .addCase(fetchAllWorkouts.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.allWorkouts = action.payload;
      })
      .addCase(fetchAllWorkouts.rejected, (state, action) => {
        state.loadingAll = false;
        state.errorAll =
          action.payload ||
          action.error.message ||
          'Failed to fetch all workouts';
      })

      /* ----Get BY USER (no pagination) ---- */
      .addCase(fetchWorkoutsByUser.pending, state => {
        state.loadingByUser = true;
        state.errorByUser = null;
      })
      .addCase(fetchWorkoutsByUser.fulfilled, (state, action) => {
        state.loadingByUser = false;
        state.workoutsByUser = action.payload || [];
      })
      .addCase(fetchWorkoutsByUser.rejected, (state, action) => {
        state.loadingByUser = false;
        state.errorByUser =
          action.payload ||
          action.error.message ||
          'Failed to fetch workouts by user';
      })

      /* ---- Get by id ---- */
      .addCase(fetchWorkoutById.fulfilled, (state, action) => {
        const workout = action.payload;

        // update paged list
        const idx = state.workouts.findIndex(w => w._id === workout._id);
        if (idx === -1) state.workouts.unshift(workout);
        else state.workouts[idx] = workout;

        // update all lists
        upsertById(state.allWorkouts, workout);
        upsertById(state.workoutsByUser, workout);

        state.currentWorkout = workout;
      })

      /* ---- Create ---- */
      .addCase(createWorkout.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.loading = false;
        const w = action.payload;
        state.workouts.unshift(w);
        upsertById(state.allWorkouts, w);
        upsertById(state.workoutsByUser, w);
      })
      .addCase(createWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create workout';
      })

      /* ---- Update ---- */
      .addCase(updateWorkout.fulfilled, (state, action) => {
        const w = action.payload;

        const i = state.workouts.findIndex(x => x._id === w._id);
        if (i !== -1) state.workouts[i] = w;

        if (state.currentWorkout?._id === w._id) state.currentWorkout = w;

        upsertById(state.allWorkouts, w);
        upsertById(state.workoutsByUser, w);
      })

      /* ---- Delete ---- */
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        const id = action.payload;
        state.workouts = removeById(state.workouts, id);
        state.allWorkouts = removeById(state.allWorkouts, id);
        state.workoutsByUser = removeById(state.workoutsByUser, id);

        if (state.currentWorkout?._id === id) state.currentWorkout = null;
      })

      /* ---- Share ---- */
      .addCase(shareWorkout.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareWorkout.fulfilled, (state, action) => {
        state.loading = false;
        const w = action.payload;
        upsertById(state.workouts, w);

        upsertById(state.allWorkouts, w);
        upsertById(state.workoutsByUser, w);

        if (state.currentWorkout?._id === w._id) state.currentWorkout = w;
      })
      .addCase(shareWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Failed to share workout';
      })

      /** Clone fulfilled: nhét vào các list */
      .addCase(cloneWorkoutToUser.fulfilled, (state, action) => {
        const w = action.payload;
        const i = state.workouts.findIndex(x => x._id === w._id);
        if (i === -1) state.workouts.unshift(w);
        else state.workouts[i] = w;

        const upsert = (arr, item) => {
          const idx = arr.findIndex(x => x._id === item._id);
          if (idx === -1) arr.unshift(item);
          else arr[idx] = item;
        };
        upsert(state.allWorkouts, w);
        upsert(state.workoutsByUser, w);
      })
      .addCase(cloneWorkoutToUser.rejected, (state, action) => {
        state.error = action.payload || 'Clone failed';
      });
  }
});

export default workoutSlice.reducer;
