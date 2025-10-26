import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchWorkoutById,
  fetchWorkouts
} from '~/store/features/workout-slice';

const WorkoutsContext = createContext();

export const useWorkouts = () => {
  const context = useContext(WorkoutsContext);
  if (!context) {
    throw new Error('useWorkouts must be used within WorkoutsProvider');
  }
  return context;
};

export const WorkoutsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const workoutsState = useSelector(state => state.workouts);

  // Extract data from state
  const workouts = workoutsState?.workouts || [];
  const loading = workoutsState?.loading || false;
  const totalPages = workoutsState?.totalPages || 1;
  const totalWorkouts = workoutsState?.totalWorkouts || 0;

  // UI state
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  // Separate pending and applied filters
  const [pendingFilters, setPendingFilters] = useState({
    title: '',
    isPublic: '',
    userName: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({
    title: '',
    isPublic: '',
    userName: ''
  });

  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialogs state
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [deleteMode, setDeleteMode] = useState({
    isBulk: false,
    workoutIds: [],
    workoutTitle: ''
  });

  // Fetch function - only use backend filters (title, isPublic)
  const fetchPage = useCallback(
    async (page = currentPage, limit = pageSize) => {
      try {
        await dispatch(
          fetchWorkouts({
            page,
            limit,
            sortBy: sorting.sortBy,
            sortOrder: sorting.sortOrder,
            title: appliedFilters.title,
            isPublic: appliedFilters.isPublic
          })
        ).unwrap();
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      }
    },
    [
      dispatch,
      currentPage,
      pageSize,
      sorting,
      appliedFilters.title,
      appliedFilters.isPublic
    ]
  );

  // Auto-fetch when dependencies change
  useEffect(() => {
    fetchPage(currentPage, pageSize);
  }, [
    currentPage,
    pageSize,
    sorting.sortBy,
    sorting.sortOrder,
    appliedFilters.title,
    appliedFilters.isPublic
  ]);

  // Frontend filter by userName
  const filteredWorkouts = useMemo(() => {
    if (!appliedFilters.userName) {
      return workouts;
    }

    return workouts.filter(workout => {
      const userName = workout?.user?.name || '';
      return userName
        .toLowerCase()
        .includes(appliedFilters.userName.toLowerCase());
    });
  }, [workouts, appliedFilters.userName]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  const handleSortingChange = (sortBy, sortOrder) => {
    setSorting({ sortBy, sortOrder });
    setCurrentPage(1);
  };

  // Update pending filters only
  const handlePendingFiltersChange = newFilters => {
    setPendingFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Apply filters - triggers fetch
  const applyFilters = () => {
    setAppliedFilters(pendingFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const emptyFilters = { title: '', isPublic: '', userName: '' };
    setPendingFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
  };

  // Dialog handlers

  const openEditDialog = workout => {
    setCurrentWorkout(workout);
    setDialogMode('edit');
    setActionDialogOpen(true);
  };

  const openDeleteDialog = workout => {
    setDeleteMode({
      isBulk: false,
      workoutIds: [workout._id],
      workoutTitle: workout.title
    });
    setDeleteDialogOpen(true);
  };

  const openBulkDeleteDialog = workoutIds => {
    setDeleteMode({
      isBulk: true,
      workoutIds: workoutIds,
      workoutTitle: ''
    });
    setDeleteDialogOpen(true);
  };

  const openDetailsDialog = async workout => {
    setCurrentWorkout(workout);
    if (workout._id) {
      try {
        const result = await dispatch(fetchWorkoutById(workout._id)).unwrap();
        setCurrentWorkout(result);
      } catch (error) {
        console.error('Failed to fetch workout details:', error);
      }
    }
    setDetailsDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setActionDialogOpen(false);
    setDeleteDialogOpen(false);
    setDetailsDialogOpen(false);
    setCurrentWorkout(null);
    setDeleteMode({ isBulk: false, workoutIds: [], workoutTitle: '' });
  };

  const refreshData = () => {
    fetchPage(currentPage, pageSize);
    setSelectedWorkouts([]);
  };

  const value = {
    workouts: filteredWorkouts, // Use filtered workouts
    loading,
    pagination: {
      currentPage,
      pageSize,
      totalPages,
      totalWorkouts: filteredWorkouts.length // Update count
    },
    selectedWorkouts,
    setSelectedWorkouts,
    fetchPage: handlePageChange,
    handleSortingChange,
    pendingFilters,
    appliedFilters,
    onPendingFiltersChange: handlePendingFiltersChange,
    applyFilters,
    clearFilters,
    // Dialogs
    actionDialogOpen,
    deleteDialogOpen,
    detailsDialogOpen,
    currentWorkout,
    dialogMode,
    deleteMode,
    openEditDialog,
    openDeleteDialog,
    openBulkDeleteDialog,
    openDetailsDialog,
    closeAllDialogs,
    refreshData
  };

  return (
    <WorkoutsContext.Provider value={value}>
      {children}
    </WorkoutsContext.Provider>
  );
};
