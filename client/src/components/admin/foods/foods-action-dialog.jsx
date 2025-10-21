'use client';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useFoodsContext } from './foods-provider';

export function FoodsActionDialog() {
  const navigate = useNavigate();
  const { selectedFood, setSelectedFood } = useFoodsContext();

  useEffect(() => {
    if (!selectedFood) return;

    // Navigate straight to update page with id
    navigate(`/admin/manage-foods/update/${selectedFood._id}`);

    // clear selected to avoid repeated navigations / close any UI state
    if (setSelectedFood) setSelectedFood(null);
  }, [selectedFood]);

  // This component no longer renders UI; it only redirects when a food is selected.
  return null;
}
