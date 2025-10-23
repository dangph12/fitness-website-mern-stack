'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchEquipments } from '~/store/features/equipment-slice';

const EquipmentsContext = createContext();

export function EquipmentsProvider({ children }) {
  const dispatch = useDispatch();
  const { equipments, loading } = useSelector(state => state.equipments);

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [actionMode, setActionMode] = useState('create');

  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    dispatch(fetchEquipments());
  }, [dispatch]);

  const refreshData = () => {
    dispatch(fetchEquipments());
  };

  const openCreateDialog = () => {
    setSelectedEquipment(null);
    setActionMode('create');
    setIsActionDialogOpen(true);
  };

  const openEditDialog = equipment => {
    setSelectedEquipment(equipment);
    setActionMode('edit');
    setIsActionDialogOpen(true);
  };

  const openDeleteDialog = equipment => {
    setSelectedEquipment(equipment);
    setIsDeleteDialogOpen(true);
  };

  const openDetailsDialog = equipment => {
    setSelectedEquipment(equipment);
    setIsDetailsDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setIsActionDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsDetailsDialogOpen(false);
    setSelectedEquipment(null);
  };

  return (
    <EquipmentsContext.Provider
      value={{
        equipments,
        loading,
        selectedEquipment,
        selectedEquipments,
        setSelectedEquipments,
        isActionDialogOpen,
        isDeleteDialogOpen,
        isDetailsDialogOpen,
        actionMode,
        openCreateDialog,
        openEditDialog,
        openDeleteDialog,
        openDetailsDialog,
        closeAllDialogs,
        refreshData
      }}
    >
      {children}
    </EquipmentsContext.Provider>
  );
}

export const useEquipments = () => {
  const context = useContext(EquipmentsContext);
  if (!context) {
    throw new Error('useEquipments must be used within EquipmentsProvider');
  }
  return context;
};
