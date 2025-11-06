import { motion } from 'framer-motion';
import React, { useLayoutEffect } from 'react';
import { FaCrown } from 'react-icons/fa';
import { FiBarChart2, FiCpu, FiHeadphones, FiZap } from 'react-icons/fi';

import PayButton from '~/components/pay-button';

export default function PremiumPlan() {
  const features = [
    {
      icon: <FiZap className='text-amber-500 text-xl' />,
      text: 'AI Meal Creation (60 tokens/day)'
    },
    {
      icon: <FiBarChart2 className='text-amber-500 text-xl' />,
      text: 'Deep Performance Reports + Export'
    },
    {
      icon: <FiHeadphones className='text-amber-500 text-xl' />,
      text: '24/7 Dedicated Support'
    },
    {
      icon: <FiCpu className='text-amber-500 text-xl' />,
      text: 'Automation & API Integrations'
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
        <div className='absolute w-72 h-72 bg-amber-300 opacity-30 blur-[140px] top-12 left-0 rounded-full'></div>
        <div className='absolute w-72 h-72 bg-orange-500 opacity-30 blur-[140px] bottom-12 right-0 rounded-full'></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='inline-flex items-center gap-2 text-amber-800 bg-amber-100 px-3 py-1 rounded-full text-sm font-medium border border-amber-200 shadow-sm'
      >
        <FaCrown className='text-amber-500' /> Premium Tier
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-600 mt-4 drop-shadow-sm'
      >
        Premium Plan
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className='mt-4 text-slate-600 text-lg leading-relaxed max-w-2xl'
      >
        Maximum features, full automation, and the highest daily AI meal
        generation.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className='mt-12 p-[2px] rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg'
      >
        <div className='rounded-2xl bg-white/90 backdrop-blur-md p-8 shadow-xl'>
          <h2 className='text-xl font-semibold text-amber-800 mb-5'>
            Premium Benefits
          </h2>

          <ul className='space-y-4'>
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + i * 0.1, duration: 0.4 }}
                className='flex items-center gap-3 text-amber-700 hover:text-amber-900 transition-colors'
              >
                {f.icon}
                <span className='text-[15px] sm:text-base'>{f.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.25 }}
        className='mt-12'
      >
        <PayButton
          level='premium'
          amount={60000}
          className='bg-gradient-to-r from-amber-700 to-orange-600 hover:from-orange-600 hover:to-amber-700 shadow-lg hover:shadow-[0_0_24px_rgba(255,185,50,0.6)] transition-all duration-300'
        />
      </motion.div>
    </motion.div>
  );
}
