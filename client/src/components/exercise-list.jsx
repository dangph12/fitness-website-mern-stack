import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
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
import { formatInstructions } from '~/lib/utils';
import { fetchExercises } from '~/store/features/exercise-slice';

import ExerciseFilterModal from './exercise-filter-modal';

const itemsPerPage = 12;

export default function ExerciseList() {
  const dispatch = useDispatch();
  const {
    exercises = [],
    loading,
    error,
    totalExercises = 0,
    totalPages = 1
  } = useSelector(state => state.exercises);

  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    muscle: 'All',
    difficulty: 'All',
    equipment: 'All',
    type: 'All'
  });

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

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

  const filteredExercises = useMemo(
    () =>
      Array.isArray(exercises)
        ? exercises.filter(ex =>
            ex.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [],
    [exercises, searchTerm]
  );

  if (loading && !exercises.length) {
    return (
      <div className='mx-auto max-w-7xl p-6'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='overflow-hidden rounded-2xl border border-slate-200 bg-white'
            >
              <div className='aspect-[4/3] w-full bg-slate-200' />
              <div className='p-4 space-y-2'>
                <div className='h-4 w-2/3 rounded bg-slate-200' />
                <div className='h-4 w-1/2 rounded bg-slate-200' />
                <div className='h-3 w-full rounded bg-slate-200' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-600'>{error}</div>;
  }

  const toJpgPreview = (url = '') =>
    url.includes('/upload/')
      ? url.replace('/upload/', '/upload/f_jpg/so_0/')
      : url;

  const diffBadge = d => {
    const val = (d || '').toLowerCase();
    if (val.includes('beginner'))
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (val.includes('intermediate'))
      return 'bg-amber-50 text-amber-700 border-amber-200';
    if (val.includes('advanced'))
      return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const sliceAndMore = (arr = [], limit = 2) => {
    const names = arr.map(x => x?.title).filter(Boolean);
    if (names.length <= limit) return { list: names, more: 0 };
    return { list: names.slice(0, limit), more: names.length - limit };
  };

  return (
    <div className='container mx-auto p-6 text-black'>
      <div className='mb-6'>
        <h1 className='text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
          F-Fitness Exercises
        </h1>
        <p className='mt-2 text-slate-600'>
          Filter and refine your search to find the perfect exercise for your
          fitness goals.
        </p>
      </div>

      <div className='mb-8 flex max-w-2xl items-center gap-3'>
        <Input
          type='text'
          placeholder='Search exercises'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='flex-1 border border-slate-300 text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-300'
        />
        <button
          className='flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-50'
          onClick={() => setIsFilterOpen(true)}
        >
          <FiFilter className='text-lg' />
          <span className='font-semibold'>Filters</span>
        </button>
      </div>

      <div className='mb-4 text-sm text-slate-600'>
        <strong className='text-slate-900'>{totalExercises}</strong> exercises
        found
      </div>

      {filteredExercises.length ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredExercises.map(exercise => {
            const isGif = (exercise.tutorial || '')
              .toLowerCase()
              .endsWith('.gif');
            const preview = isGif
              ? toJpgPreview(exercise.tutorial)
              : exercise.tutorial;

            const { list: muscleList, more: muscleMore } = sliceAndMore(
              exercise.muscles || [],
              2
            );
            const { list: equipList, more: equipMore } = sliceAndMore(
              exercise.equipments || [],
              2
            );

            return (
              <div
                key={exercise._id}
                className='group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md'
              >
                <Link to={`/exercise/${exercise._id}`} className='block'>
                  <div className='relative'>
                    <img
                      src={preview}
                      alt={exercise.title}
                      className='block aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]'
                      onMouseEnter={e => {
                        if (isGif) e.currentTarget.src = exercise.tutorial;
                      }}
                      onMouseLeave={e => {
                        if (isGif) e.currentTarget.src = preview;
                      }}
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-xs font-semibold ${diffBadge(
                        exercise.difficulty
                      )}`}
                    >
                      {exercise.difficulty || '—'}
                    </span>
                  </div>

                  <div className='p-4'>
                    <h3 className='mb-1 line-clamp-2 text-lg font-semibold text-slate-900'>
                      {exercise.title}
                    </h3>

                    <div className='mb-1 flex flex-wrap items-center gap-1.5'>
                      {muscleList.map(m => (
                        <span
                          key={m}
                          className='rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700'
                        >
                          {m}
                        </span>
                      ))}
                      {muscleMore > 0 && (
                        <span className='rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700'>
                          +{muscleMore} more
                        </span>
                      )}
                    </div>

                    <div className='mb-2 flex flex-wrap items-center gap-1.5'>
                      {equipList.map(e => (
                        <span
                          key={e}
                          className='rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700'
                        >
                          {e}
                        </span>
                      ))}
                      {equipMore > 0 && (
                        <span className='rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700'>
                          +{equipMore} more
                        </span>
                      )}
                    </div>

                    <p className='line-clamp-2 text-sm text-slate-600'>
                      {formatInstructions(exercise.instructions)
                        ? exercise.instructions.length > 200
                          ? `${formatInstructions(exercise.instructions).slice(0, 200)}…`
                          : formatInstructions(exercise.instructions)
                        : 'No description available.'}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='mt-10'>
          <div className='mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center'>
            <p className='text-base text-slate-700'>
              No exercises found. Try adjusting your search or filters.
            </p>
            <div className='mt-4 flex justify-center gap-2'>
              <button
                className='rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </button>
              <button
                className='rounded-lg bg-[#3067B6] px-3 py-2 text-sm font-semibold text-white hover:bg-[#275397]'
                onClick={() => setIsFilterOpen(true)}
              >
                Open filters
              </button>
            </div>
          </div>
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
}
