import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Dumbbell,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';

import banner from '../assets/banner-1.png';

const DEFAULT_IMAGE = banner;

const PlanBanner = ({ imageUrl = DEFAULT_IMAGE }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = React.useState(imageUrl);
  const [loaded, setLoaded] = React.useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-6 py-12 shadow-lg sm:px-12 lg:flex lg:items-center lg:justify-between mt-10'
    >
      <div className='z-10 max-w-2xl space-y-8'>
        <div className='inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200'>
          <Sparkles size={14} />
          <span>AI-Powered Fitness Planning</span>
        </div>

        <h1 className='text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'>
          Build Your <span className='text-indigo-600'>Perfect Plan</span>
          <br />
          <span className='text-pink-600'>Transform Your Life</span>
        </h1>

        <p className='text-base text-slate-600 sm:text-lg'>
          Craft personalized <strong>workout</strong> and <strong>meal</strong>{' '}
          plans using AI tools. Whether you want to <b>lose weight</b>,{' '}
          <b>gain muscle</b>, or
          <b> stay fit</b> — we’ll help you every step of the way.
        </p>

        <ul className='mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-700'>
          <li className='flex items-center gap-2'>
            <Flame size={18} className='text-orange-500' /> Burn Calories
            Smartly
          </li>
          <li className='flex items-center gap-2'>
            <Dumbbell size={18} className='text-indigo-600' /> Tailored Workouts
          </li>
          <li className='flex items-center gap-2'>
            <CalendarDays size={18} className='text-emerald-600' /> Weekly
            Tracking
          </li>
          <li className='flex items-center gap-2'>
            <Trophy size={18} className='text-yellow-500' /> Earn Achievements
          </li>
          <li className='flex items-center gap-2'>
            <Target size={18} className='text-rose-500' /> Set Clear Goals
          </li>
          <li className='flex items-center gap-2'>
            <ShieldCheck size={18} className='text-sky-600' /> Track Your
            Progress
          </li>
        </ul>

        <div className='flex flex-wrap gap-4 pt-6'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/plans/routine-builder')}
            className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          >
            <Dumbbell size={18} />
            Start Building
            <ArrowRight size={16} className='ml-1' />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/plans')}
            className='inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300'
          >
            <Clock size={16} />
            View All Plans
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className='relative mt-10 hidden w-full max-w-md lg:mt-0 lg:block'
      >
        <div className='relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-slate-200'>
          {!loaded && (
            <div className='absolute inset-0 animate-pulse bg-slate-100' />
          )}
          <img
            src={imgSrc}
            alt='Workout Banner'
            loading='lazy'
            onLoad={() => setLoaded(true)}
            onError={() => setImgSrc(DEFAULT_IMAGE)}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
        </div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-10 left-10 rounded-full bg-white/90 p-3 shadow-xl ring-1 ring-slate-200'
        >
          <Flame size={22} className='text-orange-500' />
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute bottom-12 right-14 rounded-full bg-white/90 p-3 shadow-xl ring-1 ring-slate-200'
        >
          <Trophy size={22} className='text-yellow-500' />
        </motion.div>

        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-xl ring-1 ring-slate-200'
        >
          <Zap size={22} className='text-indigo-600' />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default PlanBanner;
