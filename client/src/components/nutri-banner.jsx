import { motion } from 'framer-motion';
import React from 'react';
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
      toast.error('Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='bg-white text-black flex justify-center items-center min-h-max p-20'
    >
      <div className='flex flex-col lg:flex-row items-center space-x-10 max-w-6xl'>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className='text-center lg:text-left space-y-6'
        >
          <h1 className='text-7xl font-bold leading-tight'>
            Good health starts with good nutrition.
          </h1>
          <p className='text-lg'>
            Want to be more mindful of what you eat? Track your meals, learn
            more about your habits, and achieve your goals with MyFitnessPal.
          </p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to='/nutrition/create-meal'
              onClick={handleClick}
              className='inline-block bg-blue-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition'
            >
              Bắt đầu tạo bữa ăn
            </Link>
          </motion.div>
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
