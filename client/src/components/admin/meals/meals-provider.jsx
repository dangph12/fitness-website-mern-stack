import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMeals } from '~/store/features/admin-meal-slice';

const MealsContext = createContext(undefined);

export const useMeals = () => {
  const context = useContext(MealsContext);
  if (!context) {
    throw new Error('useMeals must be used within MealsProvider');
  }
  return context;
};

export const MealsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { meals, loading, totalPages, totalMeals } = useSelector(
    state => state.adminMealReducer
  );

  const [selectedMeals, setSelectedMeals] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    mealType: '',
    search: ''
  });

  // Load meals whenever filters change
  useEffect(() => {
    loadMealsWithCurrentFilters();
  }, [
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder,
    filters.mealType,
    filters.search
  ]);

  const loadMealsWithCurrentFilters = () => {
    const filterParams = {};

    if (filters.search) {
      filterParams.title = filters.search;
    }

    if (filters.mealType && filters.mealType !== 'all') {
      filterParams.mealType = filters.mealType;
    }

    console.log('Loading meals with filters:', {
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      filterParams
    });

    dispatch(
      fetchMeals({
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        filterParams
      })
    );
  };

  const refreshData = () => {
    loadMealsWithCurrentFilters();
    setSelectedMeals([]);
  };

  const updateFilters = newFilters => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      console.log('Filters updated:', updated);
      return updated;
    });
  };

  return (
    <MealsContext.Provider
      value={{
        meals,
        loading,
        totalPages,
        totalMeals,
        selectedMeals,
        setSelectedMeals,
        filters,
        updateFilters,
        refreshData
      }}
    >
      {children}
    </MealsContext.Provider>
  );
};
