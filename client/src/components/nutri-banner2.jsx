import { motion, MotionConfig } from 'framer-motion';
import React, { useMemo } from 'react';
import { FaBarcode, FaBook, FaRunning } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 320,
      damping: 28,
      mass: 0.7
    }
  }
};

const NutriBanner2 = () => {
  const cards = useMemo(
    () => [
      {
        icon: <FaBook size={50} className='text-blue-500 mb-4' />,
        title: 'Learn. Follow. Progress.',
        text: 'Keeping a food journal allows you to better understand your habits and increases your chances of achieving your goals.'
      },
      {
        icon: <FaBarcode size={50} className='text-blue-500 mb-4' />,
        title: 'Record more easily.',
        text: 'Scan barcodes, save meals and recipes, and use Quick Tools for quick and easy food tracking.'
      },
      {
        icon: <FaRunning size={50} className='text-blue-500 mb-4' />,
        title: 'Stay motivated.',
        text: "Join the world's largest fitness community for tips, tricks, and 24/7 support."
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
            hidden: { opacity: 0, y: -18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 300, damping: 24 }
            }
          }}
          className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900'
          style={{ willChange: 'transform, opacity' }}
        >
          The tools for your goals
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 0.08 } }
          }}
          className='text-base sm:text-lg text-gray-600 mb-12 max-w-3xl'
        >
          Are you trying to lose weight, tone up, lower your BMI, or improve
          your overall health? We give you the right features to make it happen.
        </motion.p>

        <motion.div
          variants={containerVariants}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto'
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                boxShadow: '0px 10px 24px rgba(0,0,0,0.12)'
              }}
              whileTap={{ scale: 0.99 }}
              className='flex flex-col items-center bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100'
              style={{ willChange: 'transform, box-shadow' }}
            >
              {card.icon}
              <h3 className='text-lg sm:text-xl font-semibold mb-2 text-gray-900'>
                {card.title}
              </h3>
              <p className='text-center text-gray-600 leading-relaxed'>
                {card.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};

export default NutriBanner2;
