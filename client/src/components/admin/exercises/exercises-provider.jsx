import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchExercises,
  fetchReferenceLists
} from '~/store/features/exercise-slice';

const ExercisesContext = createContext();

export const useExercises = () => {
  const context = useContext(ExercisesContext);
  if (!context) {
    throw new Error('useExercises must be used within ExercisesProvider');
  }
  return context;
};

export const ExercisesProvider = ({ children }) => {
  const dispatch = useDispatch();
  const {
    exercises,
    loading,
    totalPages: sliceTotalPages,
    totalExercises: sliceTotalExercises,
    musclesMap,
    equipmentsMap,
    referencesLoading
  } = useSelector(state => state.exercises);

  // UI state
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: '',
    type: '',
    search: ''
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // helper - resolve label for populated object or id using provided map
  const resolveRefLabel = useCallback((item, map = {}) => {
    if (!item) return null;
    if (typeof item === 'string') {
      return map[item] || (item.length > 10 ? `${item.slice(0, 8)}...` : item);
    }
    if (typeof item === 'object') {
      return (
        item.name ||
        item.title ||
        item.label ||
        (item._id ? map[item._id] || item._id : JSON.stringify(item))
      );
    }
    return String(item);
  }, []);

  // central fetch function (uses current provider state)
  const fetchData = useCallback(
    async (opts = {}) => {
      const page = typeof opts.page === 'number' ? opts.page : currentPage;
      const limit = typeof opts.limit === 'number' ? opts.limit : pageSize;
      const sortBy = opts.sortBy || sorting.sortBy;
      const sortOrder = opts.sortOrder || sorting.sortOrder;
      const filterParams = opts.filterParams || { ...filters };

      dispatch(
        fetchExercises({
          page,
          limit,
          sortBy,
          sortOrder,
          filterParams
        })
      );
    },
    [currentPage, pageSize, sorting, filters, dispatch]
  );

  // public method: fetch a specific page immediately (called by table on pagination change)
  const fetchPage = useCallback(
    (page, limit) => {
      setCurrentPage(page);
      if (typeof limit === 'number' && limit !== pageSize) {
        setPageSize(limit);
      }
      // dispatch immediately for quick response
      dispatch(
        fetchExercises({
          page,
          limit: typeof limit === 'number' ? limit : pageSize,
          sortBy: sorting.sortBy,
          sortOrder: sorting.sortOrder,
          filterParams: { ...filters }
        })
      );
    },
    [dispatch, pageSize, sorting, filters]
  );

  // effect: fetch data when filters/sorting/currentPage/pageSize change (fallback)
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sorting, filters, fetchData]);

  // effect: fetch reference lists once
  useEffect(() => {
    dispatch(fetchReferenceLists());
  }, [dispatch]);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = size => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSortingChange = (sortBy, sortOrder) => {
    setSorting({ sortBy, sortOrder });
    setCurrentPage(1);
  };

  const handleFiltersChange = newFilters => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ difficulty: '', type: '', search: '' });
    setCurrentPage(1);
  };

  const value = {
    exercises,
    loading,
    pagination: {
      currentPage,
      pageSize,
      totalPages: sliceTotalPages,
      totalExercises: sliceTotalExercises
    },
    selectedExercises,
    setSelectedExercises,
    filters,
    sorting,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    handleSortingChange,
    handleFiltersChange,
    clearFilters,
    fetchPage,
    refreshData: fetchData,
    musclesMap,
    equipmentsMap,
    referencesLoading,
    resolveRefLabel
  };

  return (
    <ExercisesContext.Provider value={value}>
      {children}
    </ExercisesContext.Provider>
  );
};
