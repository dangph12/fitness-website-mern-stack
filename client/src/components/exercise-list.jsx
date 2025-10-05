import React, { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { Input } from '~/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination';
import { fetchExercises } from '~/store/features/exercise-slice';

import ExerciseFilterModal from './exercise-filter-modal';

const ExerciseList = () => {
  const dispatch = useDispatch();
  const { exercises, loading, error, totalExercises, totalPages } = useSelector(
    state => state.exercises
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    muscle: 'All',
    difficulty: 'All',
    equipment: 'All',
    type: 'All'
  });

  useEffect(() => {
    const filterParams = {};
    if (filters.muscle !== 'All') filterParams.muscles = filters.muscle;
    if (filters.equipment !== 'All')
      filterParams.equipments = filters.equipment;
    if (filters.difficulty !== 'All')
      filterParams.difficulty = filters.difficulty;
    if (filters.type !== 'All') filterParams.type = filters.type;

    dispatch(
      fetchExercises({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        filterParams
      })
    );
  }, [dispatch, currentPage, filters]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const filteredExercises = Array.isArray(exercises)
    ? exercises.filter(ex =>
        ex.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading && !exercises.length) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-pulse'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='bg-gray-200 h-64 rounded-lg'></div>
        ))}
      </div>
    );
  }
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  console.log('EXERCISES FROM REDUX:', exercises);
  console.log('totalPages:', totalPages, '| totalExercises:', totalExercises);

  return (
    <div className='container mx-auto p-6 text-black'>
      <div className='mb-6'>
        <h1 className='text-5xl font-bold text-black'>F-Fitness Exercises</h1>
        <p className='text-gray-600 mt-2'>
          Filter and refine your search to find the perfect exercise for your
          fitness goals
        </p>
      </div>

      <div className='flex items-center gap-3 mb-8 max-w-2xl'>
        <Input
          type='text'
          placeholder='Search exercises'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='flex-1 border border-gray-300 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-300'
        />
        <button
          className='flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-all'
          onClick={() => setIsFilterOpen(true)}
        >
          <FiFilter className='text-lg' />
          <span className='font-medium'>Filters</span>
        </button>
      </div>

      <div className='mb-4 text-sm text-gray-500'>
        <strong className='text-black'>{totalExercises || 0}</strong> EXERCISES
        FOUND
      </div>

      {filteredExercises.length ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredExercises.map(exercise => (
            <div
              key={exercise._id}
              className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer border border-gray-200'
            >
              <Link to={`/exercise/${exercise._id}`}>
                <img
                  src={
                    exercise.tutorial.endsWith('.gif')
                      ? exercise.tutorial.replace(
                          '/upload/',
                          '/upload/f_jpg/so_0/'
                        )
                      : exercise.tutorial
                  }
                  onMouseEnter={e => (e.currentTarget.src = exercise.tutorial)}
                  onMouseLeave={e =>
                    (e.currentTarget.src = exercise.tutorial.replace(
                      '/upload/',
                      '/upload/f_jpg/so_0/'
                    ))
                  }
                  alt={exercise.title}
                  className='w-full h-60 object-cover rounded-md transition-all duration-200'
                />
              </Link>
              <div className='p-4'>
                <h3 className='text-lg font-semibold mb-1'>{exercise.title}</h3>
                <p className='text-blue-600 text-sm mb-1'>
                  {exercise.muscles?.map(m => m.title).join(', ') || 'General'}
                </p>
                <p className='text-gray-600 text-sm'>
                  {exercise.equipments?.map(e => e.title).join(', ') ||
                    'No equipment'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-gray-500 text-center mt-8'>
          No exercises found. Please adjust your search or filters.
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className='mt-8'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ExerciseFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default ExerciseList;
