import { motion } from 'framer-motion';
import React from 'react';
import { FaBarcode, FaBook, FaRunning } from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

const NutriBanner2 = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      className='bg-white py-16 px-6 flex flex-col items-center justify-center text-center'
    >
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className='text-6xl font-bold mb-4 text-gray-900'
      >
        The tools for your goals
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className='text-lg text-gray-600 mb-12'
      >
        Are you trying to lose weight, tone up, lower your BMI, or improve your
        overall health? We give you the right features to make it happen.
      </motion.p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {[
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
        ].map((card, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0px 8px 20px rgba(0,0,0,0.15)'
            }}
            className='flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg'
          >
            {card.icon}
            <h3 className='text-xl font-semibold mb-2'>{card.title}</h3>
            <p className='text-center text-gray-600'>{card.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NutriBanner2;
