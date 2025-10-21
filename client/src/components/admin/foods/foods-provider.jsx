import { createContext, useContext, useState } from 'react';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const value = {
    selectedFood,
    setSelectedFood,
    selectedFoods,
    setSelectedFoods,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  };

  return (
    <FoodsContext.Provider value={value}>{children}</FoodsContext.Provider>
  );
};
