import React, { createContext, useContext, useState } from 'react';

const FoodsContext = createContext();

export const useFoodsContext = () => {
  const context = useContext(FoodsContext);
  if (!context) {
    throw new Error('useFoodsContext must be used within FoodsProvider');
  }
  return context;
};

export const FoodsProvider = ({ children }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false);

  return (
    <FoodsContext.Provider
      value={{
        selectedFood,
        setSelectedFood,
        selectedFoods,
        setSelectedFoods,
        isViewDialogOpen,
        setIsViewDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isMultiDeleteDialogOpen,
        setIsMultiDeleteDialogOpen
      }}
    >
      {children}
    </FoodsContext.Provider>
  );
};
