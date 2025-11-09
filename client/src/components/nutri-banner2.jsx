import { motion, MotionConfig } from 'framer-motion';
import React, { useMemo } from 'react';
import { FiBookOpen, FiCamera, FiTarget } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.08, staggerChildren: 0.12 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 26, mass: 0.7 }
  }
};

const NutriBanner2 = () => {
  const cards = useMemo(
    () => [
      {
        icon: <FiBookOpen size={46} className='text-emerald-600 mb-4' />,
        title: 'Learn. Follow. Progress.',
        text: 'A simple food journal reveals your habits and boosts the odds you hit your goals.'
      },
      {
        icon: <FiCamera size={46} className='text-teal-600 mb-4' />,
        title: 'Record in seconds.',
        text: 'Scan items, reuse saved meals & recipes, and log faster with Quick Tools.'
      },
      {
        icon: <FiTarget size={46} className='text-sky-600 mb-4' />,
        title: 'Stay motivated.',
        text: 'Get tips and support from a vibrant fitness community—anytime.'
      }
    ],
    []
  );

  return (
    <MotionConfig reducedMotion='user'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='bg-white py-16 px-6 flex flex-col items-center justify-center text-center'
        style={{ willChange: 'opacity, transform' }}
      >
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: -14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 300, damping: 22 }
            }
          }}
          className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900'
          style={{ willChange: 'transform, opacity' }}
        >
          <span className='bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent'>
            The tools for your goals
          </span>
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 0.06 } }
          }}
          className='mt-4 text-base sm:text-lg text-slate-600 max-w-3xl'
        >
          Want to lose weight, tone up, lower your BMI, or simply feel better?
          We’ve got the features to make it happen.
        </motion.p>

        <motion.div
          variants={containerVariants}
          className='mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8'
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className='flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg'
              style={{ willChange: 'transform' }}
            >
              {card.icon}
              <h3 className='text-lg sm:text-xl font-semibold text-slate-900 mb-2'>
                {card.title}
              </h3>
              <p className='text-slate-600 leading-relaxed'>{card.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};

export default NutriBanner2;
