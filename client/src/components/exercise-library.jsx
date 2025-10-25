import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination';
import { fetchExercises } from '~/store/features/exercise-slice';

import { ScrollArea } from './ui/scroll-area';

const ExerciseLibrary = ({ handleAddExercise }) => {
  const dispatch = useDispatch();
  const {
    exercises = [],
    loading,
    error,
    totalPages = 1,
    totalExercises = 0
  } = useSelector(state => state.exercises);

  const [page, setPage] = useState(1);
  const limit = 12;

  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchExercises({ page, limit, q: query || undefined }));
  }, [dispatch, page, query]);

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  const renderPaginationNumbers = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    if (start > 1)
      items.push(
        <PaginationItem key='s-ell'>
          <PaginationEllipsis />
        </PaginationItem>
      );
    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={page === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (end < totalPages)
      items.push(
        <PaginationItem key='e-ell'>
          <PaginationEllipsis />
        </PaginationItem>
      );
    return items;
  };

  const filtered = useMemo(() => {
    if (!query) return exercises;
    const q = query.toLowerCase();
    return exercises.filter(ex => {
      const t = (ex.title || '').toLowerCase();
      const d = (ex.difficulty || '').toLowerCase();
      const ty = (ex.type || '').toLowerCase();
      return t.includes(q) || d.includes(q) || ty.includes(q);
    });
  }, [exercises, query]);

  const highlight = text => {
    if (!query) return text;
    const idx = text?.toLowerCase().indexOf(query);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return (
      <>
        {before}
        <mark className='bg-yellow-200'>{match}</mark>
        {after}
      </>
    );
  };

  if (loading) {
    return (
      <div className='grid place-items-center h-[200px] text-slate-500'>
        Loading exercises...
      </div>
    );
  }
  if (error)
    return <div className='text-center text-red-500'>{String(error)}</div>;

  return (
    <div className='flex h-[78vh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white'>
      <div className='flex items-center justify-between p-4 shrink-0'>
        <h3 className='text-xl font-semibold'>Exercise Library</h3>
        <span className='text-sm text-slate-500'>
          Page {page} of {totalPages} • Total {totalExercises}
        </span>
      </div>

      <div className='flex flex-col gap-3 px-4 pb-3 sm:flex-row sm:items-center sm:justify-between shrink-0'>
        <div className='flex items-center gap-2'>
          <button className='text-gray-700 px-3 py-2 border rounded-md'>
            Any Muscle
          </button>
          <button className='text-gray-700 px-3 py-2 border rounded-md'>
            All Equipment
          </button>
        </div>

        <div className='relative w-full sm:max-w-sm'>
          <input
            type='text'
            placeholder='Search exercise name, difficulty, type…'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') setQuery(searchText.trim());
            }}
            className='w-full rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-9 text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
          />
          {searchText && (
            <button
              onClick={() => {
                setSearchText('');
                setQuery('');
              }}
              className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
              title='Clear'
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className='flex-1 min-h-0 px-4 pb-2'>
        <ScrollArea className='h-full'>
          <div className='space-y-3 pr-1'>
            {filtered.map(exercise => (
              <div
                key={exercise._id}
                className='flex items-center justify-between rounded-lg bg-slate-100 p-4 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-200'
              >
                <div className='flex items-center gap-4'>
                  <div className='relative size-20 overflow-hidden rounded-md ring-1 ring-slate-200'>
                    <img
                      src={
                        exercise.tutorial?.endsWith('.gif')
                          ? exercise.tutorial.replace(
                              '/upload/',
                              '/upload/f_jpg/so_0/'
                            )
                          : exercise.tutorial
                      }
                      onMouseEnter={e => {
                        if (exercise.tutorial?.endsWith('.gif'))
                          e.currentTarget.src = exercise.tutorial;
                      }}
                      onMouseLeave={e => {
                        if (exercise.tutorial?.endsWith('.gif'))
                          e.currentTarget.src = exercise.tutorial.replace(
                            '/upload/',
                            '/upload/f_jpg/so_0/'
                          );
                      }}
                      alt={exercise.title}
                      className='absolute inset-0 h-full w-full object-cover'
                    />
                  </div>

                  <div className='text-left'>
                    <h4 className='font-medium text-slate-800'>
                      {highlight(exercise.title || '')}
                    </h4>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      <span className='rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700'>
                        {highlight(exercise.difficulty || '')}
                      </span>
                      <span className='rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700'>
                        {highlight(exercise.type || '')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddExercise(exercise)}
                  className='inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700'
                  title='Add exercise'
                >
                  <FaPlus />
                </button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className='py-8 text-center text-slate-500'>
                No exercises found.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {totalPages > 1 && (
        <div className='px-2 pb-3 pt-1 shrink-0'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                />
              </PaginationItem>
              {renderPaginationNumbers()}
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(page + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
