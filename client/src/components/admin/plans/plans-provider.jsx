import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPlans } from '~/store/features/plan-slice';

const PlansContext = createContext(undefined);

export const usePlans = () => {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error('usePlans must be used within PlansProvider');
  }
  return context;
};

export const PlansProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { plans, loading, totalPages, totalPlans } = useSelector(
    state => state.plans
  );

  const [selectedPlans, setSelectedPlans] = useState([]);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isPublic: '',
    search: ''
  });

  // Only load on mount
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    const filterParams = {};

    // Backend expects 'title' for search, not 'search'
    if (filters.search) {
      filterParams.title = filters.search;
    }

    // Backend expects isPublic as string 'true' or 'false'
    // Empty string or 'all' means no filter
    if (filters.isPublic && filters.isPublic !== 'all') {
      filterParams.isPublic = filters.isPublic;
    }

    dispatch(
      fetchPlans({
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        filterParams
      })
    );
  };

  const refreshData = () => {
    loadPlans();
    setSelectedPlans([]);
  };

  const updateFilters = newFilters => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };

      // Load data after state update
      setTimeout(() => {
        const filterParams = {};

        if (updated.search) {
          filterParams.title = updated.search;
        }

        if (updated.isPublic && updated.isPublic !== 'all') {
          filterParams.isPublic = updated.isPublic;
        }

        dispatch(
          fetchPlans({
            page: updated.page,
            limit: updated.limit,
            sortBy: updated.sortBy,
            sortOrder: updated.sortOrder,
            filterParams
          })
        );
      }, 0);

      return updated;
    });
  };

  return (
    <PlansContext.Provider
      value={{
        plans,
        loading,
        totalPages,
        totalPlans,
        selectedPlans,
        setSelectedPlans,
        filters,
        updateFilters,
        refreshData
      }}
    >
      {children}
    </PlansContext.Provider>
  );
};
