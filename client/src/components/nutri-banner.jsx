import { motion } from 'framer-motion';
import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import nutri from '../assets/nutri.webp';

const NutriBanner = () => {
  const userId = useSelector(state => state.auth.user?.id);
  const navigate = useNavigate();

  const handleClick = e => {
    if (!userId) {
      e.preventDefault();
      toast.error('You are not logged in, please log in to continue!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    }
  };

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='bg-white text-black flex justify-center items-center min-h-max pt-20 pb-5'
    >
      <div className='flex flex-col lg:flex-row items-center space-x-10 max-w-6xl'>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className='space-y-5 text-center lg:text-left'
        >
          <h1 className='text-balance text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'>
            Good health starts with{' '}
            <span className='bg-gradient-to-r from-[#3067B6] to-teal-500 bg-clip-text text-transparent'>
              good nutrition.
            </span>
          </h1>

          <p className='mx-auto max-w-2xl text-base text-slate-700 sm:text-lg lg:mx-0'>
            Want to be more mindful of what you eat? Track your meals, learn
            more about your habits, and achieve your goals with MyFitnessPal.
          </p>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to='/nutrition/create-meal'
              onClick={handleClick}
              className='inline-flex items-center justify-center rounded-xl bg-[#3067B6] px-6 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-[#275397]'
            >
              Start creating meals
            </Link>
          </motion.div>

          <p className='text-xs text-slate-500'>
            No credit card required • Cancel anytime
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className='mt-8 lg:mt-0'
        >
          <motion.img
            src={nutri}
            alt='Healthy Meal'
            className='w-max h-max object-cover rounded-xl shadow-lg'
            whileHover={{ scale: 1.08, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NutriBanner;
