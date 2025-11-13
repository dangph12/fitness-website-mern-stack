import React, { useEffect, useMemo, useState } from 'react';
import {
  FaBreadSlice,
  FaDrumstickBite,
  FaFire,
  FaPlus,
  FaTimes,
  FaUtensils
} from 'react-icons/fa';
import { GiButter } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination';
import { ScrollArea } from '~/components/ui/scroll-area';
import { clearFoods, fetchFoods } from '~/store/features/food-slice';

const FoodLibrary = ({ handleAddFood }) => {
  const dispatch = useDispatch();

  const { foods, loading, error } = useSelector(state => state.foods);
  const foodList = Array.isArray(foods?.foods) ? foods.foods : [];
  const totalPages = foods?.totalPages || 1;
  const totalFoods = foods?.totalCount || 0;

  const [page, setPage] = useState(1);
  const limit = 8;
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    // Clear foods before fetching new page
    dispatch(clearFoods());

    dispatch(fetchFoods({ page, limit, filterParams: { title: query } }));
  }, [dispatch, page, query]);

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= totalPages) {
      // Clear foods before changing page

      setPage(newPage);
    }
  };

  const filtered = useMemo(() => {
    if (!query) return foodList;
    return foodList.filter(f =>
      f.title?.toLowerCase().includes(query.toLowerCase())
    );
  }, [foodList, query]);

  return (
    <div className='h-[80vh] flex flex-col border rounded-2xl bg-gradient-to-b from-white shadow-md overflow-hidden'>
      <div className='flex items-center justify-between p-4 border-b bg-emerald-100/80'>
        <h3 className='flex items-center gap-2 text-lg font-semibold text-emerald-800'>
          <FaUtensils className='text-emerald-700 text-xl' />
          Food Library
        </h3>
        <span className='text-sm text-emerald-700'>
          Page {page} / {totalPages} • {totalFoods} items
        </span>
      </div>

      <div className='p-4 border-b flex items-center gap-3 bg-white/70'>
        <input
          type='text'
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder='Search food name...'
          className='flex-1 px-3 py-2 border border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-300 focus:outline-none transition'
        />
        {searchText && (
          <button
            onClick={() => {
              setSearchText('');
              setQuery('');
            }}
            className='p-2 text-red-500 hover:bg-red-100 rounded-md transition'
            title='Clear search'
          >
            <FaTimes />
          </button>
        )}
      </div>

      <div className='flex-1 overflow-hidden'>
        <ScrollArea className='h-full px-4'>
          <div className='space-y-3 py-3 pr-2'>
            {loading && (
              <p className='text-center text-emerald-600 animate-pulse'>
                Loading...
              </p>
            )}
            {error && (
              <p className='text-red-500 text-center font-medium'>{error}</p>
            )}
            {!loading && filtered.length === 0 && (
              <p className='text-center text-slate-500 py-8'>No foods found</p>
            )}
            {!loading &&
              filtered.map(food => (
                <div
                  key={food._id}
                  className='flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src={food.image}
                      className='w-16 h-16 rounded-lg border border-emerald-200 object-cover shadow-sm'
                      alt={food.title}
                      onError={e => {
                        e.target.src = '/placeholder-food.png';
                      }}
                    />
                    <div>
                      <p className='font-medium text-emerald-800'>
                        {food.title}
                      </p>
                      <div className='flex flex-wrap items-center gap-2 text-xs mt-1 font-medium'>
                        <div className='flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full'>
                          <FaFire className='text-[13px]' /> {food.calories}
                          kcal
                        </div>
                        <div className='flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
                          <FaDrumstickBite className='text-[13px]' /> P:
                          {food.protein}g
                        </div>
                        <div className='flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full'>
                          <FaBreadSlice className='text-[13px]' /> C:
                          {food.carbohydrate}g
                        </div>
                        <div className='flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-1 rounded-full'>
                          <GiButter className='text-[13px]' /> F: {food.fat}g
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFood(food)}
                    className='p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition active:scale-95 shadow-sm'
                    title='Add to meal'
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>

      {totalPages > 1 && (
        <Pagination className='p-3 border-t'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className={`hover:text-emerald-600 ${
                  page === 1 ? 'pointer-events-none opacity-50' : ''
                }`}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`${
                    page === i + 1
                      ? 'bg-emerald-600 text-white'
                      : 'hover:bg-emerald-100 text-emerald-700'
                  } transition rounded-md`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className={`hover:text-emerald-600 ${
                  page === totalPages ? 'pointer-events-none opacity-50' : ''
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default FoodLibrary;
