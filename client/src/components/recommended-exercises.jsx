import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaDumbbell, FaFireAlt, FaRunning } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { fetchAllExercises } from '~/store/features/exercise-slice';

export default function RecommendedExercises() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exercises, currentExercise, loading } = useSelector(
    state => state.exercises
  );

  const [recommended, setRecommended] = useState([]);
  const scrollRef = useRef(null);

  const toJpgPreview = (url = '') =>
    url.includes('/upload/')
      ? url.replace('/upload/', '/upload/f_jpg/so_0/')
      : url;

  useEffect(() => {
    if (!exercises.length) dispatch(fetchAllExercises());
  }, [dispatch, exercises.length]);

  useEffect(() => {
    if (!currentExercise || !exercises.length) return;

    const mainMuscles = currentExercise.muscles?.map(m => m._id || m) || [];
    const mainEquipments =
      currentExercise.equipments?.map(e => e._id || e) || [];

    const filtered = exercises
      .filter(ex => {
        if (ex._id === currentExercise._id) return false;

        const exMuscles = ex.muscles?.map(m => m._id || m) || [];
        const exEquipments = ex.equipments?.map(e => e._id || e) || [];

        const sameMuscle = exMuscles.some(m => mainMuscles.includes(m));
        const sameEquip = exEquipments.some(e => mainEquipments.includes(e));

        return sameMuscle || sameEquip;
      })
      .slice(0, 10);

    setRecommended(filtered);
  }, [currentExercise, exercises]);

  const handleDragScroll = e => {
    const container = scrollRef.current;
    if (!container) return;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const onMouseMove = eMove => {
      const x = eMove.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.2;
      container.scrollLeft = scrollLeft - walk;
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (loading)
    return (
      <p className='text-center py-10 text-slate-500'>Loading exercises...</p>
    );
  if (!currentExercise || !recommended.length) return null;

  return (
    <section className='mt-8 max-w-7xl mx-auto px-6 mb-16'>
      <h2 className='text-2xl font-bold text-slate-900 mb-5 flex items-center gap-2'>
        <FaDumbbell className='text-indigo-500' />
        Recommended Exercises
      </h2>

      <div
        ref={scrollRef}
        className='flex gap-6 overflow-x-auto overflow-y-hidden pb-4 px-2 cursor-grab active:cursor-grabbing select-none snap-x snap-mandatory scrollbar-none'
        onMouseDown={handleDragScroll}
      >
        {recommended.map(ex => {
          const isGif = (ex.tutorial || '').toLowerCase().endsWith('.gif');
          const preview = isGif ? toJpgPreview(ex.tutorial) : ex.tutorial;

          return (
            <motion.div
              key={ex._id}
              onClick={() => navigate(`/exercise/${ex._id}`)}
              className='snap-start flex-none w-[240px] rounded-2xl border border-slate-200 bg-white shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className='relative h-40 overflow-hidden'>
                <img
                  src={preview || '/placeholder-fitness.jpg'}
                  alt={ex.title}
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                  onMouseEnter={e => {
                    if (isGif) e.currentTarget.src = ex.tutorial;
                  }}
                  onMouseLeave={e => {
                    if (isGif) e.currentTarget.src = preview;
                  }}
                />
              </div>

              <div className='p-3'>
                <h3 className='font-semibold text-slate-900 text-sm truncate'>
                  {ex.title}
                </h3>

                <div className='flex flex-wrap gap-1.5 mt-2'>
                  <span className='flex items-center gap-1 text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100'>
                    <FaFireAlt className='text-[10px]' /> {ex.difficulty}
                  </span>
                  <span className='flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100'>
                    <FaRunning className='text-[10px]' /> {ex.type}
                  </span>
                </div>

                {ex.muscles?.length > 0 && (
                  <p className='text-xs text-slate-600 mt-2 line-clamp-1'>
                    <span className='font-medium text-slate-800'>Target:</span>{' '}
                    {ex.muscles.map(m => m.title).join(', ')}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
