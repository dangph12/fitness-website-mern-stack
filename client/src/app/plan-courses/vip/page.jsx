import { motion } from 'framer-motion';
import React, { useLayoutEffect } from 'react';
import {
  FiBarChart2,
  FiHeadphones,
  FiRefreshCw,
  FiStar,
  FiZap
} from 'react-icons/fi';

import PayButton from '~/components/pay-button';

export default function VipPlan() {
  const features = [
    {
      icon: <FiZap className='text-emerald-500 text-xl' />,
      text: 'AI Meal Creation (30 tokens/day)'
    },
    {
      icon: <FiRefreshCw className='text-emerald-500 text-xl' />,
      text: 'Unlimited Workouts & Plans'
    },
    {
      icon: <FiBarChart2 className='text-emerald-500 text-xl' />,
      text: 'Performance Reports & Analytics'
    },
    {
      icon: <FiHeadphones className='text-emerald-500 text-xl' />,
      text: 'Priority Support'
    }
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
        <div className='absolute w-72 h-72 bg-emerald-300 opacity-25 blur-[140px] top-12 left-0 rounded-full'></div>
        <div className='absolute w-72 h-72 bg-teal-400 opacity-25 blur-[140px] bottom-12 right-0 rounded-full'></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='inline-flex items-center gap-2 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200 shadow-sm'
      >
        <FiStar className='text-emerald-600' /> Most Popular
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-500 mt-4 drop-shadow-sm'
      >
        VIP Plan
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className='mt-4 text-slate-600 text-lg leading-relaxed max-w-2xl'
      >
        Unlock full platform capabilities and let AI assist your meal planning
        every day.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className='mt-12 p-[2px] rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg'
      >
        <div className='rounded-2xl bg-white/90 backdrop-blur-md p-8 shadow-xl'>
          <h2 className='text-xl font-semibold text-emerald-800 mb-5'>
            VIP Benefits:
          </h2>

          <ul className='space-y-4'>
            {features.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + i * 0.1, duration: 0.45 }}
                className='flex items-center gap-3 text-emerald-700 hover:text-emerald-900 transition-colors'
              >
                {item.icon}
                <span className='text-[15px] sm:text-base'>{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.25 }}
        className='mt-12 flex justify-center'
      >
        <PayButton
          level='vip'
          amount={40000}
          className='bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-[0_0_24px_rgba(16,185,129,0.6)] transition-all duration-300 px-7 py-3 rounded-xl'
        />
      </motion.div>
    </motion.div>
  );
}
