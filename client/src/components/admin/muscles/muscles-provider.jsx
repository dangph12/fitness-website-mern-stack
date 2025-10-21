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
  const {
    muscles: rawMuscles,
    loading,
    totalPages: sliceTotalPages,
    totalMuscles: sliceTotalMuscles
  } = useSelector(state => state.muscles);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Central fetch function (uses current provider state)
  const fetchData = useCallback(
    async (opts = {}) => {
      const page = typeof opts.page === 'number' ? opts.page : currentPage;
      const limit = typeof opts.limit === 'number' ? opts.limit : pageSize;
      const sortBy = opts.sortBy || sorting.sortBy;
      const sortOrder = opts.sortOrder || sorting.sortOrder;
      const filterParams = opts.filterParams || { ...filters };

      dispatch(
        fetchMuscles({
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

  // Public method: fetch a specific page immediately
  const fetchPage = useCallback(
    (page, limit) => {
      setCurrentPage(page);
      if (typeof limit === 'number' && limit !== pageSize) {
        setPageSize(limit);
      }
      // Dispatch immediately for quick response
      dispatch(
        fetchMuscles({
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

  // Effect: fetch data when filters/sorting/currentPage/pageSize change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Computed muscles with client-side filtering and sorting
  const muscles = React.useMemo(() => {
    if (!rawMuscles) return [];

    let filtered = Array.isArray(rawMuscles) ? [...rawMuscles] : [];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(muscle =>
        muscle.title?.toLowerCase().includes(filters.search.toLowerCase())
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
    setFilters({ search: '' });
    setCurrentPage(1);
  };

  const refreshData = () => {
    fetchData();
  };

  const value = {
    muscles,
    loading,
    pagination: {
      currentPage,
      pageSize,
      totalPages: sliceTotalPages || Math.ceil(muscles.length / pageSize),
      totalMuscles: sliceTotalMuscles || muscles.length
    },
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
    currentPage,
    pageSize,
    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSortingChange,
    handleFiltersChange,
    clearFilters,

    openDeleteDialog,
    openDetailsDialog,
    closeAllDialogs,
    setIsActionDialogOpen,
    setIsDeleteDialogOpen,
    setIsDetailsDialogOpen,
    // Data fetching
    fetchPage,
    refreshData
  };

  return (
    <MusclesContext.Provider value={value}>{children}</MusclesContext.Provider>
  );
};
