import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Create payment link
export const createPaymentLink = createAsyncThunk(
  'payments/createPaymentLink',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/api/payments/create-payment-link',
        { ...paymentData, redirect: false }
      );
      return response?.data?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to create payment link'
      );
    }
  }
);

// Fetch all membership payments
export const fetchMembershipPayments = createAsyncThunk(
  'payments/fetchMembershipPayments',
  async (status, { rejectWithValue }) => {
    try {
      const params = status ? { status } : {};
      const response = await axiosInstance.get('/api/payments/membership', {
        params
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch membership payments'
      );
    }
  }
);

// Fetch payments by user ID
export const fetchPaymentsByUser = createAsyncThunk(
  'payments/fetchPaymentsByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/payments/user/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch user payments'
      );
    }
  }
);

// Fetch payment by order code
export const fetchPaymentByOrderCode = createAsyncThunk(
  'payments/fetchPaymentByOrderCode',
  async (orderCode, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/payments/membership/order/${orderCode}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch payment by order code'
      );
    }
  }
);

// Get membership payment by order code (alias)
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

// Update payment status (generic)
export const updatePaymentStatus = createAsyncThunk(
  'payments/updatePaymentStatus',
  async ({ orderCode, status, cancellationReason }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/api/payments/membership/order/${orderCode}/status`,
        { status, cancellationReason }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update payment status'
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

// Fetch revenue statistics for dashboard
export const fetchRevenueStats = createAsyncThunk(
  'payments/fetchRevenueStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/payments/membership');
      const payments = response.data.data || [];

      // Calculate statistics
      const stats = {
        totalRevenue: 0,
        completedPayments: 0,
        pendingPayments: 0,
        cancelledPayments: 0,
        vipUpgrades: 0,
        premiumUpgrades: 0,
        monthlyRevenue: {}
      };

      payments.forEach(payment => {
        if (payment.status === 'completed') {
          stats.totalRevenue += Number(payment.amount || 0);
          stats.completedPayments += 1;

          const date =
            payment.completedAt || payment.updatedAt || payment.createdAt;
          if (date) {
            const monthYear = new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            });
            stats.monthlyRevenue[monthYear] =
              (stats.monthlyRevenue[monthYear] || 0) +
              Number(payment.amount || 0);
          }

          if (payment.targetMembership === 'vip') {
            stats.vipUpgrades += 1;
          } else if (payment.targetMembership === 'premium') {
            stats.premiumUpgrades += 1;
          }
        } else if (payment.status === 'pending') {
          stats.pendingPayments += 1;
        } else if (payment.status === 'cancelled') {
          stats.cancelledPayments += 1;
        }
      });

      return { payments, stats };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch revenue stats'
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

    payments: [],
    currentPayment: null,

    revenueStats: {
      totalRevenue: 0,
      completedPayments: 0,
      pendingPayments: 0,
      cancelledPayments: 0,
      vipUpgrades: 0,
      premiumUpgrades: 0,
      monthlyRevenue: {}
    },

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
    },
    clearPayments: state => {
      state.payments = [];
      state.currentPayment = null;
      state.paymentsByUser = [];
      state.membershipPayments = [];
    },
    clearError: state => {
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
        // also store as currentPayment if provided
        state.currentPayment = d || state.currentPayment;
      })
      .addCase(createPaymentLink.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action.payload || action.error?.message || 'Create link failed';
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
          action.payload || action.error?.message || 'Fetch payment failed';
      })

      /* ---- Update membership status ---- */
      .addCase(updateMembershipPaymentStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMembershipPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const p = action.payload || null;
        state.currentPayment = p;

        if (p?.orderCode && state.orderCode === p.orderCode) {
          state.linkStatus = p.status || state.linkStatus;
        }

        upsertByOrderCode(state.membershipPayments, p);
        upsertByOrderCode(state.paymentsByUser, p);

        // also update payments list if exists
        upsertByOrderCode(state.payments, p);
      })
      .addCase(updateMembershipPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || 'Update status failed';
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
          action.error?.message ||
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
          action.error?.message ||
          'Fetch membership payments failed';
      })

      /* ---- Fetch membership payments (all) ---- */
      .addCase(fetchMembershipPayments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload || [];
      })
      .addCase(fetchMembershipPayments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Failed to fetch membership payments';
      })

      /* ---- Fetch payments by user ---- */
      .addCase(fetchPaymentsByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentsByUser = action.payload || [];
        state.payments = action.payload || state.payments;
      })
      .addCase(fetchPaymentsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Failed to fetch user payments';
      })

      /* ---- Fetch payment by order code ---- */
      .addCase(fetchPaymentByOrderCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentByOrderCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload || null;
      })
      .addCase(fetchPaymentByOrderCode.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || 'Failed to fetch payment';
      })

      /* ---- Update payment status (generic) ---- */
      .addCase(updatePaymentStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (!updated) return;
        const index = state.payments.findIndex(
          payment => payment.orderCode === updated.orderCode
        );
        if (index !== -1) {
          state.payments[index] = updated;
        } else {
          upsertByOrderCode(state.payments, updated);
        }
        if (state.currentPayment?.orderCode === updated.orderCode) {
          state.currentPayment = updated;
        }
        upsertByOrderCode(state.membershipPayments, updated);
        upsertByOrderCode(state.paymentsByUser, updated);
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Failed to update payment status';
      })

      /* ---- Fetch revenue stats ---- */
      .addCase(fetchRevenueStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueStats.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload?.payments || [];
        state.revenueStats = action.payload?.stats || state.revenueStats;
      })
      .addCase(fetchRevenueStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          'Failed to fetch revenue stats';
      });
  }
});

export const { clearPaymentLink, clearPayments, clearError } =
  paymentSlice.actions;

export default paymentSlice.reducer;
