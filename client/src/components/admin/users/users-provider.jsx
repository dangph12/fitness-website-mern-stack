import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUsers } from '~/store/features/users-slice';

const UsersContext = createContext();

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within UsersProvider');
  }
  return context;
};

export const UsersProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.users);

  // Dialog states - Remove isActionDialogOpen
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteMode, setDeleteMode] = useState('single'); // 'single' or 'bulk'

  // UI state
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    role: [],
    gender: []
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Generic dialog opener - simplified
  const openDialog = useCallback((dialogType, user = null) => {
    setSelectedUser(user);

    switch (dialogType) {
      case 'details':
        setIsDetailsDialogOpen(true);
        break;
      case 'delete':
        setDeleteMode('single');
        setIsDeleteDialogOpen(true);
        break;
      case 'multiDelete':
        setDeleteMode('bulk');
        setIsDeleteDialogOpen(true);
        break;
      default:
        console.warn('Unknown dialog type:', dialogType);
    }
  }, []);

  const closeDialog = useCallback(dialogType => {
    switch (dialogType) {
      case 'details':
        setIsDetailsDialogOpen(false);
        break;
      case 'delete':
        setIsDeleteDialogOpen(false);
        break;
      default:
        // Close all dialogs
        setIsDetailsDialogOpen(false);
        setIsDeleteDialogOpen(false);
    }
    setSelectedUser(null);
  }, []);

  const closeAllDialogs = () => {
    setIsDeleteDialogOpen(false);
    setIsDetailsDialogOpen(false);
    setSelectedUser(null);
  };

  // Handlers
  const handleSortingChange = (sortBy, sortOrder) => {
    setSorting({ sortBy, sortOrder });
  };

  const handleFiltersChange = useCallback(newFilters => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', role: [], gender: [] });
  }, []);

  const refreshData = useCallback(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit,
        search: filters.search,
        role: filters.role,
        gender: filters.gender,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder
      })
    );
  }, [dispatch, currentPage, limit, filters, sorting]);

  const value = {
    users,
    loading,
    // Dialog states - Removed isActionDialogOpen
    isDeleteDialogOpen,
    isDetailsDialogOpen,
    selectedUser,
    deleteMode,
    // Selection
    selectedUsers,
    setSelectedUsers,
    // Filters & Sorting
    filters,
    sorting,
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
    // Handlers
    handleSortingChange,
    handleFiltersChange,
    clearFilters,
    // Dialog handlers
    openDialog,
    closeDialog,
    closeAllDialogs,
    setIsDeleteDialogOpen,
    setIsDetailsDialogOpen,
    // Data fetching
    refreshData
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};
