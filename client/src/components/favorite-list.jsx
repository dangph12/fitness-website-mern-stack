import React, { useEffect } from 'react';
import { FaHeart, FaRegSadTear, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { toast } from 'sonner';

import logo from '~/assets/logo.png';
import {
  fetchFavorites,
  removeFavoriteItems
} from '~/store/features/favourite-slice';

const FavoriteList = () => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.auth.user?.id);
  const { favorite, loading, error } = useSelector(s => s.favourites || {});
  const workouts = favorite?.workouts || [];

  useEffect(() => {
    if (userId) dispatch(fetchFavorites(userId));
  }, [dispatch, userId]);

  const handleRemove = workoutId => {
    if (!userId || !workoutId) return;
    const p = dispatch(removeFavoriteItems({ userId, workouts: [workoutId] }));
    (p.unwrap ? p.unwrap() : p)
      .then(() => toast.success('Removed from Favorites'))
      .catch(() => toast.error('Failed to remove from Favorites'));
  };

  if (loading) {
    return (
      <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <div className='mb-4 flex items-center gap-2'>
          <div className='h-5 w-40 animate-pulse rounded bg-slate-200' />
          <div className='h-5 w-10 animate-pulse rounded bg-slate-200' />
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='rounded-xl border border-slate-200 p-3 shadow-sm'
            >
              <div className='aspect-video w-full animate-pulse rounded-lg bg-slate-200' />
              <div className='mt-3 h-5 w-2/3 animate-pulse rounded bg-slate-200' />
              <div className='mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-100' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700'>
        {String(error)}
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <FaHeart className='text-rose-600' />
          <h2 className='text-lg font-semibold text-slate-900'>My Favorites</h2>
        </div>
        <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200'>
          {workouts.length} item{workouts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {workouts.length === 0 ? (
        <div className='grid place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center'>
          <FaRegSadTear className='mb-2 text-2xl text-slate-500' />
          <p className='text-sm text-slate-600'>
            You don’t have any favorite workouts yet.
          </p>
          <p className='text-xs text-slate-500'>
            Tap the heart icon on a workout to save it here.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {workouts.map(w => {
            const id = typeof w === 'string' ? w : w?._id;
            const title = typeof w === 'object' ? w?.title : 'Workout';
            const image = typeof w === 'object' ? w?.image : logo;

            return (
              <div
                key={id}
                className='group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'
              >
                <Link to={`/workouts/workout-detail/${id}`}>
                  <div className='relative aspect-video w-full overflow-hidden'>
                    <img
                      src={image || logo}
                      alt={title}
                      className='absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]'
                      onError={e => {
                        e.currentTarget.src = logo;
                      }}
                    />
                  </div>
                </Link>

                <div className='flex items-start justify-between gap-2 p-3'>
                  <div className='min-w-0'>
                    <Link
                      to={`/workouts/workout-detail/${id}`}
                      className='block truncate font-medium text-slate-900 hover:underline'
                      title={title}
                    >
                      {title}
                    </Link>
                    <p className='mt-0.5 line-clamp-1 text-xs text-slate-500'>
                      Tap to open details
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemove(id)}
                    className='inline-flex items-center justify-center rounded-full bg-rose-50 p-2 text-rose-600 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-100'
                    title='Remove from Favorites'
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteList;
