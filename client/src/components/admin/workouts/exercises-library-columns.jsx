import { ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { getImageUrls } from '~/lib/utils';
import { fetchExercises } from '~/store/features/exercise-slice';

// Animated Image Component for Exercise Library
const ExerciseImage = ({ src, alt, isSelected }) => {
  const { previewUrl, animatedUrl } = getImageUrls(src);
  const [currentSrc, setCurrentSrc] = useState(previewUrl);

  const handleMouseEnter = e => {
    e.currentTarget.src = animatedUrl;
    setCurrentSrc(animatedUrl);
  };

  const handleMouseLeave = e => {
    e.currentTarget.src = previewUrl;
    setCurrentSrc(previewUrl);
  };

  return (
    <div className='relative h-16 w-16 overflow-hidden rounded-md border flex-shrink-0'>
      {src ? (
        <>
          <img
            src={currentSrc}
            alt={alt}
            className='h-full w-full object-cover'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {isSelected && (
            <div className='absolute inset-0 bg-primary/20 flex items-center justify-center'>
              <Badge variant='default' className='text-xs'>
                Added
              </Badge>
            </div>
          )}
        </>
      ) : (
        <div className='h-full w-full bg-muted flex items-center justify-center'>
          <span className='text-xs text-muted-foreground'>No img</span>
        </div>
      )}
    </div>
  );
};

export function ExerciseLibrary({ onAddExercise, selectedExerciseIds = [] }) {
  const dispatch = useDispatch();

  const {
    exercises: allExercises,
    loading: loadingExercises,
    totalPages,
    totalExercises
  } = useSelector(state => state.exercises);

  const [searchText, setSearchText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    loadExercises();
  }, [appliedQuery, currentPage]);

  const loadExercises = () => {
    dispatch(
      fetchExercises({
        page: currentPage,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        filterParams: { title: appliedQuery || undefined }
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

  const isExerciseSelected = exerciseId => {
    return selectedExerciseIds.includes(exerciseId);
  };

  const hasSearchChanges = searchText.trim() !== appliedQuery;

  const getDifficultyColor = difficulty => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'advanced':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

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
            <CardTitle>Exercise Library</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Page {currentPage} of {totalPages} • Total {totalExercises}
            </p>
          </div>

          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Input
                type='text'
                placeholder='Search exercise name...'
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
              disabled={!hasSearchChanges || loadingExercises}
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
        {loadingExercises ? (
          <div className='text-center py-8 text-muted-foreground'>
            Loading exercises...
          </div>
        ) : allExercises.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            {appliedQuery ? (
              <>
                <p>No exercises found for "{appliedQuery}"</p>
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
              <p>No exercises found</p>
            )}
          </div>
        ) : (
          <div className='space-y-3'>
            {allExercises.map(exercise => {
              const isSelected = isExerciseSelected(exercise._id);

              return (
                <div
                  key={exercise._id}
                  className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-primary/5 border-primary'
                      : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                  onClick={() => !isSelected && onAddExercise(exercise)}
                >
                  <ExerciseImage
                    src={exercise.tutorial}
                    alt={exercise.title}
                    isSelected={isSelected}
                  />

                  <div className='flex-1 min-w-0'>
                    <h4 className='font-semibold text-sm truncate'>
                      {exercise.title}
                    </h4>

                    <div className='flex items-center gap-1.5 mt-1.5 flex-wrap'>
                      <Badge
                        variant='secondary'
                        className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}
                      >
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant='outline' className='text-xs'>
                        {exercise.type}
                      </Badge>
                    </div>

                    <div className='flex items-center gap-1.5 mt-1.5 flex-wrap'>
                      {exercise.muscles && exercise.muscles.length > 0 && (
                        <>
                          {exercise.muscles.slice(0, 2).map(muscle => (
                            <Badge
                              key={muscle._id}
                              variant='secondary'
                              className='text-xs bg-blue-50 text-blue-700'
                            >
                              {muscle.name}
                            </Badge>
                          ))}
                          {exercise.muscles.length > 2 && (
                            <Badge
                              variant='secondary'
                              className='text-xs bg-blue-50 text-blue-700'
                            >
                              +{exercise.muscles.length - 2}
                            </Badge>
                          )}
                        </>
                      )}
                      {exercise.equipments &&
                        exercise.equipments.length > 0 && (
                          <>
                            {exercise.equipments.slice(0, 1).map(equipment => (
                              <Badge
                                key={equipment._id}
                                variant='secondary'
                                className='text-xs bg-purple-50 text-purple-700'
                              >
                                {equipment.name}
                              </Badge>
                            ))}
                            {exercise.equipments.length > 1 && (
                              <Badge
                                variant='secondary'
                                className='text-xs bg-purple-50 text-purple-700'
                              >
                                +{exercise.equipments.length - 1}
                              </Badge>
                            )}
                          </>
                        )}
                    </div>
                  </div>

                  <Button
                    type='button'
                    size='sm'
                    onClick={e => {
                      e.stopPropagation();
                      if (!isSelected) {
                        onAddExercise(exercise);
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

        {totalPages > 1 && (
          <div className='flex flex-col gap-3 pt-4 border-t'>
            <div className='flex items-center justify-center gap-1 flex-wrap'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loadingExercises}
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
                      disabled={loadingExercises}
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
                disabled={currentPage === totalPages || loadingExercises}
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
