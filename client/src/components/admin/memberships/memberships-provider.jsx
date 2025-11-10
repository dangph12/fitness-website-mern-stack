import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMembershipPayments } from '~/store/features/payment-slice';

const MembershipsContext = createContext(null);

export const useMemberships = () => {
  const context = useContext(MembershipsContext);
  if (!context) {
    throw new Error('useMemberships must be used within MembershipsProvider');
  }
  return context;
};

export const MembershipsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector(state => state.payments);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    targetMembership: '',
    search: ''
  });

  useEffect(() => {
    dispatch(fetchMembershipPayments());
  }, [dispatch]);

  const handleViewDetails = payment => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedPayment(null);
    setIsDetailsOpen(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredPayments = payments.filter(payment => {
    if (filters.status && payment.status !== filters.status) {
      return false;
    }
    if (
      filters.targetMembership &&
      payment.targetMembership !== filters.targetMembership
    ) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const userName = payment.user?.name?.toLowerCase() || '';
      const userEmail = payment.user?.email?.toLowerCase() || '';
      const orderCode = payment.orderCode.toString();

      return (
        userName.includes(searchLower) ||
        userEmail.includes(searchLower) ||
        orderCode.includes(searchLower)
      );
    }
    return true;
  });

  const value = {
    payments: filteredPayments,
    loading,
    error,
    selectedPayment,
    isDetailsOpen,
    filters,
    handleViewDetails,
    handleCloseDetails,
    handleFilterChange
  };

  return (
    <MembershipsContext.Provider value={value}>
      {children}
    </MembershipsContext.Provider>
  );
};
