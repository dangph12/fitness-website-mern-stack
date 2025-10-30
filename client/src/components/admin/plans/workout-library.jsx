import { ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { fetchWorkouts } from '~/store/features/workout-slice';

export function WorkoutLibrary({ onAddWorkout, selectedWorkoutIds = [] }) {
  const dispatch = useDispatch();

  const {
    workouts: allWorkouts,
    loading: loadingWorkouts,
    totalPages,
    totalWorkouts
  } = useSelector(state => state.workouts);

  // Local state for search and pagination
  const [searchText, setSearchText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  // Fetch workouts when appliedQuery or page changes
  useEffect(() => {
    loadWorkouts();
  }, [appliedQuery, currentPage]);

  const loadWorkouts = () => {
    console.log('=== Loading Workouts ===');
    console.log('appliedQuery:', appliedQuery);
    console.log('currentPage:', currentPage);

    dispatch(
      fetchWorkouts({
        page: currentPage,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        title: appliedQuery || '',
        isPublic: ''
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

  const isWorkoutSelected = workoutId => {
    return selectedWorkoutIds.includes(workoutId);
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
            <CardTitle>Workout Library</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Page {currentPage} of {totalPages} • Total {totalWorkouts}
            </p>
          </div>

          {/* Search Input with Apply Button */}
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Input
                type='text'
                placeholder='Search workout name...'
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
              disabled={!hasSearchChanges || loadingWorkouts}
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

      <CardContent className='h-[calc(100vh-24rem)] overflow-y-auto space-y-4'>
        {loadingWorkouts ? (
          <div className='text-center py-8 text-muted-foreground'>
            Loading workouts...
          </div>
        ) : allWorkouts.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            {appliedQuery ? (
              <>
                <p>No workouts found for "{appliedQuery}"</p>
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
              <p>No workouts found</p>
            )}
          </div>
        ) : (
          <div className='space-y-3'>
            {allWorkouts.map(workout => {
              const isSelected = isWorkoutSelected(workout._id);

              return (
                <div
                  key={workout._id}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-primary/5 border-primary'
                      : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                  onClick={() => !isSelected && onAddWorkout(workout)}
                >
                  <div className='relative h-16 w-16 overflow-hidden rounded-md border flex-shrink-0'>
                    {workout.image ? (
                      <img
                        src={workout.image}
                        alt={workout.title}
                        className='h-full w-full object-cover'
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

                  <div className='flex-1 min-w-0'>
                    <h4 className='font-semibold text-sm truncate'>
                      {workout.title}
                    </h4>
                    <div className='flex items-center gap-2 mt-1'>
                      <Badge variant='secondary' className='text-xs'>
                        {workout.exercises?.length || 0} exercises
                      </Badge>
                      <Badge
                        variant={workout.isPublic ? 'default' : 'outline'}
                        className='text-xs'
                      >
                        {workout.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type='button'
                    size='sm'
                    onClick={e => {
                      e.stopPropagation();
                      if (!isSelected) {
                        onAddWorkout(workout);
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
                disabled={currentPage === 1 || loadingWorkouts}
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
                      disabled={loadingWorkouts}
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
                disabled={currentPage === totalPages || loadingWorkouts}
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
