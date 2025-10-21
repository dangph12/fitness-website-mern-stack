import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMuscles } from '~/store/features/muscles-slice';

const MusclesContext = createContext();

export const useMuscles = () => {
  const context = useContext(MusclesContext);
  if (!context) {
    throw new Error('useMuscles must be used within MusclesProvider');
  }
  return context;
};

export const MusclesProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { muscles: rawMuscles, loading } = useSelector(state => state.muscles);

  // Dialog states
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [actionMode, setActionMode] = useState('edit');

  // UI state
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [filters, setFilters] = useState({
    search: ''
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Initial fetch
  useEffect(() => {
    dispatch(fetchMuscles());
  }, [dispatch]);

  // Computed muscles with client-side filtering and sorting
  const muscles = React.useMemo(() => {
    if (!rawMuscles) return [];

    let filtered = Array.isArray(rawMuscles) ? [...rawMuscles] : [];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter(muscle =>
        muscle.title?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sorting.sortBy];
      const bValue = b[sorting.sortBy];

      if (sorting.sortBy === 'createdAt' || sorting.sortBy === 'updatedAt') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sorting.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }

      // String comparison for title
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.sortOrder === 'desc'
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      return 0;
    });

    return filtered;
  }, [rawMuscles, filters, sorting]);

  // Dialog handlers
  const openDeleteDialog = muscle => {
    setSelectedMuscle(muscle);
    setIsDeleteDialogOpen(true);
  };

  const openDetailsDialog = muscle => {
    setSelectedMuscle(muscle);
    setIsDetailsDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setIsActionDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsDetailsDialogOpen(false);
    setSelectedMuscle(null);
  };

  // Handlers
  const handleSortingChange = (sortBy, sortOrder) => {
    setSorting({ sortBy, sortOrder });
  };

  const handleFiltersChange = useCallback(newFilters => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '' });
  }, []);

  const refreshData = useCallback(() => {
    dispatch(fetchMuscles());
  }, [dispatch]);

  const value = {
    muscles,
    loading,
    // Dialog states
    isActionDialogOpen,
    isDeleteDialogOpen,
    isDetailsDialogOpen,
    selectedMuscle,
    actionMode,
    // Selection
    selectedMuscles,
    setSelectedMuscles,
    // Filters & Sorting
    filters,
    sorting,
    // Handlers
    handleSortingChange,
    handleFiltersChange,
    clearFilters,
    // Dialog handlers
    openDeleteDialog,
    openDetailsDialog,
    closeAllDialogs,
    setIsActionDialogOpen,
    setIsDeleteDialogOpen,
    setIsDetailsDialogOpen,
    // Data fetching
    refreshData
  };

  return (
    <MusclesContext.Provider value={value}>{children}</MusclesContext.Provider>
  );
};
