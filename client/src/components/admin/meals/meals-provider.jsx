import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMeals } from '~/store/features/meal-slice';

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
  const { meals, loading } = useSelector(state => state.meals);

  const [selectedMeals, setSelectedMeals] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    mealType: '',
    search: ''
  });

  const totalPages = Math.ceil((meals?.length || 0) / filters.limit);
  const totalMeals = meals?.length || 0;

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = () => {
    const filterParams = {};

    if (filters.search) {
      filterParams.title = filters.search;
    }

    if (filters.mealType && filters.mealType !== 'all') {
      filterParams.mealType = filters.mealType;
    }

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
    loadMeals();
    setSelectedMeals([]);
  };

  const updateFilters = newFilters => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };

      setTimeout(() => {
        const filterParams = {};

        if (updated.search) {
          filterParams.title = updated.search;
        }

        if (updated.mealType && updated.mealType !== 'all') {
          filterParams.mealType = updated.mealType;
        }

        dispatch(
          fetchMeals({
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
