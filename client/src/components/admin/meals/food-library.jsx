import { ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { clearFoods, fetchFoods } from '~/store/features/food-slice';

export function FoodLibrary({ onAddFood, selectedFoodIds = [] }) {
  const dispatch = useDispatch();
  const { foods, loading, error } = useSelector(state => state.foods);

  // Local state for search and pagination
  const [searchText, setSearchText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  // Get foods data
  const foodsList = Array.isArray(foods?.foods) ? foods.foods : [];
  const totalPages = foods?.totalPages || 1;
  const totalFoods = foods?.totalCount || 0;

  // Fetch foods when appliedQuery or page changes
  useEffect(() => {
    dispatch(clearFoods());
    loadFoods();
  }, [appliedQuery, currentPage]);

  const loadFoods = () => {
    console.log('=== Loading Foods ===');
    console.log('appliedQuery:', appliedQuery);
    console.log('currentPage:', currentPage);

    const filterParams = {};
    if (appliedQuery.trim()) {
      filterParams.title = appliedQuery.trim();
    }

    console.log('filterParams:', filterParams);

    dispatch(
      fetchFoods({
        page: currentPage,
        limit,
        sortBy: 'title',
        sortOrder: 'asc',
        filterParams
      })
    );
  };

  const handleSearchChange = e => {
    setSearchText(e.target.value);
  };

  const handleApplyFilter = () => {
    setAppliedQuery(searchText.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setAppliedQuery('');
    setCurrentPage(1);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyFilter();
    }
  };

  const handlePageChange = newPage => {
    const pageNum = typeof newPage === 'string' ? parseInt(newPage) : newPage;
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const isFoodSelected = foodId => {
    return selectedFoodIds.includes(foodId);
  };

  const hasSearchChanges = searchText.trim() !== appliedQuery;

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.max(1, currentPage - 2);
      const rightOffset = Math.min(totalPages, currentPage + 2);

      if (leftOffset > 1) pages.push(1);
      if (leftOffset > 2) pages.push('...');

      for (let i = leftOffset; i <= rightOffset; i++) {
        pages.push(i);
      }

      if (rightOffset < totalPages - 1) pages.push('...');
      if (rightOffset < totalPages) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Card className='max-h-[calc(100vh-8rem)]'>
      <CardHeader>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <CardTitle>Food Library</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Page {currentPage} of {totalPages} • Total {totalFoods}
            </p>
          </div>

          {/* Search Input with Apply Button */}
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Input
                type='text'
                placeholder='Search food name...'
                value={searchText}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className='pr-8'
              />
              {searchText && (
                <button
                  type='button'
                  onClick={handleClearSearch}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
            <Button
              type='button'
              size='sm'
              onClick={handleApplyFilter}
              disabled={!hasSearchChanges || loading}
              className='flex-shrink-0 px-3'
            >
              <Search className='h-4 w-4 mr-1' />
              Apply
            </Button>
          </div>

          {appliedQuery && (
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-xs'>
                Searching: "{appliedQuery}"
              </Badge>
              <button
                type='button'
                onClick={handleClearSearch}
                className='text-xs text-muted-foreground hover:text-foreground transition-colors'
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className='h-auto overflow-y-auto space-y-4'>
        {loading ? (
          <div className='text-center py-8 text-muted-foreground'>
            Loading foods...
          </div>
        ) : error ? (
          <div className='text-center py-8 text-red-500'>
            <p>Error loading foods</p>
            <p className='text-sm mt-2'>{error}</p>
          </div>
        ) : foodsList.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            {appliedQuery ? (
              <>
                <p>No foods found for "{appliedQuery}"</p>
                <Button
                  type='button'
                  variant='link'
                  onClick={handleClearSearch}
                  className='mt-2'
                >
                  Clear search and show all
                </Button>
              </>
            ) : (
              <>
                <p>No foods available</p>
                <p className='text-sm mt-2'>Please create foods first</p>
              </>
            )}
          </div>
        ) : (
          <div className='space-y-3'>
            {foodsList.map(food => {
              const isSelected = isFoodSelected(food._id);

              return (
                <div
                  key={food._id}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-primary/5 border-primary'
                      : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                  onClick={() => !isSelected && onAddFood(food)}
                >
                  {/* Food Image */}
                  <div className='relative h-16 w-16 overflow-hidden rounded-md border flex-shrink-0'>
                    {food.image ? (
                      <img
                        src={food.image}
                        alt={food.title}
                        className='h-full w-full object-cover'
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('bg-muted');
                        }}
                      />
                    ) : (
                      <div className='h-full w-full bg-muted flex items-center justify-center'>
                        <span className='text-xs text-muted-foreground'>
                          No img
                        </span>
                      </div>
                    )}
                    {isSelected && (
                      <div className='absolute inset-0 bg-primary/20 flex items-center justify-center'>
                        <Badge variant='default' className='text-xs'>
                          Added
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Food Info */}
                  <div className='flex-1 min-w-0'>
                    <h4 className='font-semibold text-sm truncate'>
                      {food.title || 'Unnamed Food'}
                    </h4>

                    {/* Nutritional Info */}
                    <div className='flex flex-wrap gap-1 mt-1'>
                      <Badge variant='secondary' className='text-xs'>
                        {food.calories || 0} cal
                      </Badge>
                      <Badge variant='outline' className='text-xs'>
                        P: {food.protein || 0}g
                      </Badge>
                      <Badge variant='outline' className='text-xs'>
                        C: {food.carbs || 0}g
                      </Badge>
                      <Badge variant='outline' className='text-xs'>
                        F: {food.fat || 0}g
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type='button'
                    size='sm'
                    onClick={e => {
                      e.stopPropagation();
                      if (!isSelected) {
                        onAddFood(food);
                      }
                    }}
                    disabled={isSelected}
                    className='flex-shrink-0'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className='flex flex-col gap-3 pt-4 border-t'>
            {/* Page Numbers Row */}
            <div className='flex items-center justify-center gap-1 flex-wrap'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className='h-8 w-8 p-0'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className='px-2 text-muted-foreground'>...</span>
                  ) : (
                    <Button
                      type='button'
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className='h-8 w-8 p-0'
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}

              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className='h-8 w-8 p-0'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
