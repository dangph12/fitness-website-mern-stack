import { motion } from 'framer-motion';
import React, { useLayoutEffect } from 'react';
import { FiCheckCircle, FiHome } from 'react-icons/fi';
import { Link } from 'react-router';

export default function NormalPlan() {
  const features = [
    'Access workouts library',
    'Create personal workout routines',
    'Create custom training plans',
    'Manual meal creation (No AI)'
  ];

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='relative max-w-3xl mx-auto py-24 px-6'
    >
      <div className='absolute inset-0 -z-10 pointer-events-none'>
        <div className='absolute w-64 h-64 bg-cyan-300 opacity-20 blur-[120px] top-10 left-0 rounded-full'></div>
        <div className='absolute w-64 h-64 bg-indigo-400 opacity-20 blur-[120px] bottom-10 right-0 rounded-full'></div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className='text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 drop-shadow-sm'
      >
        Normal Plan
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className='mt-4 text-slate-600 text-lg leading-relaxed max-w-2xl'
      >
        A simple yet complete foundation to build your fitness plans manually.
        <br /> Ideal for beginners who enjoy full control without AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className='mt-12 p-[2px] rounded-2xl bg-gradient-to-r from-indigo-400 to-cyan-400'
      >
        <div className='rounded-2xl bg-gradient-to-r from-white to-teal-50/90 p-8 shadow-md'>
          <h2 className='text-xl font-semibold text-slate-800 mb-5'>
            What's Included
          </h2>

          <ul className='space-y-4'>
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                className='flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors'
              >
                <FiCheckCircle className='text-emerald-500 text-xl flex-shrink-0' />
                <span className='text-[15px] sm:text-base'>{f}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15 }}
        className='mt-12'
      >
        <Link to='/'>
          <button className='inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold tracking-wide shadow hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:from-cyan-600 hover:to-indigo-600 transition-all duration-300'>
            <FiHome className='text-xl' />
            Back to Home
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
