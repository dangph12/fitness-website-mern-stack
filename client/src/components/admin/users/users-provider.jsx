'use client';

import { createContext, useContext, useState } from 'react';

const UsersContext = createContext();

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}

export function UsersProvider({ children }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dialogStates, setDialogStates] = useState({
    invite: false,
    delete: false,
    multiDelete: false,
    details: false,
    action: false
  });
  const [activeUser, setActiveUser] = useState(null);
  const [actionType, setActionType] = useState(null);

  const openDialog = (type, user = null, action = null) => {
    setDialogStates(prev => ({ ...prev, [type]: true }));
    if (user) setActiveUser(user);
    if (action) setActionType(action);
  };

  const closeDialog = type => {
    setDialogStates(prev => ({ ...prev, [type]: false }));
    if (type === 'details' || type === 'delete' || type === 'action') {
      setActiveUser(null);
    }
    if (type === 'action') {
      setActionType(null);
    }
  };

  const closeAllDialogs = () => {
    setDialogStates({
      invite: false,
      delete: false,
      multiDelete: false,
      details: false,
      action: false
    });
    setActiveUser(null);
    setActionType(null);
  };

  const value = {
    selectedUsers,
    setSelectedUsers,
    dialogStates,
    activeUser,
    actionType,
    openDialog,
    closeDialog,
    closeAllDialogs
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}
