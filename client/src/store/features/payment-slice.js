import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Create payment link
export const createPaymentLink = createAsyncThunk(
  'payments/createPaymentLink',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        '/api/payments/create-payment-link',
        payload
      );
      return res?.data?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to create payment link'
      );
    }
  }
);

// Get membership payment by order code
export const getMembershipPaymentByOrderCode = createAsyncThunk(
  'payments/getMembershipPaymentByOrderCode',
  async (orderCode, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/payments/membership/order/${orderCode}`
      );
      return res?.data?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to get payment by order code'
      );
    }
  }
);

// Update membership payment status
export const updateMembershipPaymentStatus = createAsyncThunk(
  'payments/updateMembershipPaymentStatus',
  async (
    { orderCode, status = 'completed', cancellationReason },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.patch(
        `/api/payments/membership/order/${orderCode}/status`,
        cancellationReason ? { status, cancellationReason } : { status }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || 'Update payment status failed'
      );
    }
  }
);

// List payments by user
export const listPaymentsByUser = createAsyncThunk(
  'payments/listPaymentsByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/payments/user/${userId}`);
      return Array.isArray(res?.data?.data) ? res.data.data : [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch user payments'
      );
    }
  }
);

// List membership payments (optional status filter)
export const listMembershipPayments = createAsyncThunk(
  'payments/listMembershipPayments',
  async (status, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/api/payments/membership', {
        params: status ? { status } : undefined
      });
      return Array.isArray(res?.data?.data) ? res.data.data : [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch membership payments'
      );
    }
  }
);

const upsertByOrderCode = (arr, item) => {
  if (!item) return;
  const i = arr.findIndex(x => x?.orderCode === item?.orderCode);
  if (i === -1) arr.unshift(item);
  else arr[i] = item;
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    creating: false,
    checkoutUrl: null,
    orderCode: null,
    paymentLinkId: null,
    paymentId: null,
    targetMembership: null,
    linkStatus: null, // pending | completed | cancelled | external
    lastCreatePayload: null,

    paymentsByUser: [],
    membershipPayments: [],

    currentPayment: null,

    loading: false,
    error: null
  },
  reducers: {
    clearPaymentLink(state) {
      state.creating = false;
      state.checkoutUrl = null;
      state.orderCode = null;
      state.paymentLinkId = null;
      state.paymentId = null;
      state.targetMembership = null;
      state.linkStatus = null;
      state.lastCreatePayload = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      /* ---- Create link ---- */
      .addCase(createPaymentLink.pending, state => {
        state.creating = true;
        state.error = null;
        state.checkoutUrl = null;
        state.orderCode = null;
        state.paymentLinkId = null;
        state.paymentId = null;
        state.targetMembership = null;
        state.linkStatus = null;
        state.lastCreatePayload = null;
      })
      .addCase(createPaymentLink.fulfilled, (state, action) => {
        state.creating = false;
        const d = action.payload || {};
        state.checkoutUrl = d.checkoutUrl || null;
        state.orderCode = d.orderCode || null;
        state.paymentLinkId = d.paymentLinkId || null;
        state.paymentId = d.paymentId || null;
        state.targetMembership = d.targetMembership || null;
        state.linkStatus = d.status || null;
        state.lastCreatePayload = d;
      })
      .addCase(createPaymentLink.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action.payload || action.error.message || 'Create link failed';
      })

      /* ---- Get by order code ---- */
      .addCase(getMembershipPaymentByOrderCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembershipPaymentByOrderCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload || null;
      })
      .addCase(getMembershipPaymentByOrderCode.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Fetch payment failed';
      })

      /* ---- Update status ---- */
      .addCase(updateMembershipPaymentStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMembershipPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const p = action.payload || null;
        state.currentPayment = p;

        // Sync create-link status if same order
        if (p?.orderCode && state.orderCode === p.orderCode) {
          state.linkStatus = p.status || state.linkStatus;
        }

        // Upsert into membership list
        upsertByOrderCode(state.membershipPayments, p);

        // If this payment belongs to current user list, try update there too
        upsertByOrderCode(state.paymentsByUser, p);
      })
      .addCase(updateMembershipPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Update status failed';
      })

      /* ---- List by user ---- */
      .addCase(listPaymentsByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPaymentsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentsByUser = action.payload || [];
      })
      .addCase(listPaymentsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error.message ||
          'Fetch user payments failed';
      })

      /* ---- List membership ---- */
      .addCase(listMembershipPayments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listMembershipPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipPayments = action.payload || [];
      })
      .addCase(listMembershipPayments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error.message ||
          'Fetch membership payments failed';
      });
  }
});

export const { clearPaymentLink } = paymentSlice.actions;
export default paymentSlice.reducer;
