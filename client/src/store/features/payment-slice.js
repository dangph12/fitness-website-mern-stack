import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/axios-instance';

// Fetch all membership payments
export const fetchMembershipPayments = createAsyncThunk(
  'payments/fetchMembershipPayments',
  async status => {
    try {
      const params = status ? { status } : {};
      const response = await axiosInstance.get('/api/payments/membership', {
        params
      });
      // Backend trả về data.data (array)
      return response.data.data;
    } catch (error) {
      console.error('Error fetching membership payments:', error);
      throw error;
    }
  }
);

// Fetch payments by user ID
export const fetchPaymentsByUser = createAsyncThunk(
  'payments/fetchPaymentsByUser',
  async userId => {
    try {
      const response = await axiosInstance.get(`/api/payments/user/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  }
);

// Fetch payment by order code
export const fetchPaymentByOrderCode = createAsyncThunk(
  'payments/fetchPaymentByOrderCode',
  async orderCode => {
    try {
      const response = await axiosInstance.get(
        `/api/payments/membership/order/${orderCode}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payment by order code:', error);
      throw error;
    }
  }
);

// Create payment link
export const createPaymentLink = createAsyncThunk(
  'payments/createPaymentLink',
  async paymentData => {
    try {
      const response = await axiosInstance.post(
        '/api/payments/create-payment-link',
        { ...paymentData, redirect: false }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
  'payments/updatePaymentStatus',
  async ({ orderCode, status, cancellationReason }) => {
    try {
      const response = await axiosInstance.patch(
        `/api/payments/membership/order/${orderCode}/status`,
        { status, cancellationReason }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
);

// Fetch revenue statistics for dashboard
export const fetchRevenueStats = createAsyncThunk(
  'payments/fetchRevenueStats',
  async () => {
    try {
      const response = await axiosInstance.get('/api/payments/membership');
      const payments = response.data.data; // Array of payments

      console.log('Fetched payments:', payments); // Debug log

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
        console.log('Processing payment:', payment); // Debug log

        if (payment.status === 'completed') {
          // Tính tổng revenue từ amount
          stats.totalRevenue += payment.amount;
          stats.completedPayments += 1;

          // Group by month for chart - sử dụng completedAt hoặc updatedAt
          const date =
            payment.completedAt || payment.updatedAt || payment.createdAt;
          if (date) {
            const monthYear = new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            });
            stats.monthlyRevenue[monthYear] =
              (stats.monthlyRevenue[monthYear] || 0) + payment.amount;
          }

          // Count membership upgrades
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

      console.log('Calculated stats:', stats); // Debug log

      return { payments, stats };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      throw error;
    }
  }
);

// Payment slice
export const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
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
    clearPayments: state => {
      state.payments = [];
      state.currentPayment = null;
    },
    clearError: state => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      // Fetch membership payments
      .addCase(fetchMembershipPayments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchMembershipPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch payments by user
      .addCase(fetchPaymentsByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPaymentsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch payment by order code
      .addCase(fetchPaymentByOrderCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentByOrderCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentByOrderCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create payment link
      .addCase(createPaymentLink.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentLink.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(createPaymentLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create payment link';
      })

      // Update payment status
      .addCase(updatePaymentStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(
          payment => payment.orderCode === action.payload.orderCode
        );
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.currentPayment?.orderCode === action.payload.orderCode) {
          state.currentPayment = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch revenue stats
      .addCase(fetchRevenueStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueStats.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.revenueStats = action.payload.stats;
      })
      .addCase(fetchRevenueStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearPayments, clearError } = paymentSlice.actions;

export default paymentSlice.reducer;
