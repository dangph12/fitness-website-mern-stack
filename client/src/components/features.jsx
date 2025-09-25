import { motion } from 'framer-motion';
import { FaDumbbell, FaHeart, FaLemon, FaVideo } from 'react-icons/fa'; // Import icons từ React Icons

export default function Features() {
  return (
    <div className='flex justify-center gap-22'>
      <motion.div
        className='flex flex-col items-center p-6 bg-teal-500 text-white rounded-xl shadow-lg w-85'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#38b2ac'
        }}
      >
        <div className='text-4xl mb-4'>
          <FaHeart />
        </div>
        <h3 className='text-xl font-semibold'>Support & Motivation</h3>
        <p className='text-center text-sm mt-2'>
          We feel greatly happy with what learners can do to be healthy and
          peaceful in mind.
        </p>
      </motion.div>

      <motion.div
        className='flex flex-col items-center p-6 bg-white text-gray-800 rounded-xl shadow-lg w-85'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#f7fafc'
        }}
      >
        <div className='text-4xl mb-4'>
          <FaDumbbell />
        </div>
        <h3 className='text-xl font-semibold'>Experience Trainers</h3>
        <p className='text-center text-sm mt-2'>
          We feel greatly happy with what learners can do to be healthy and
          peaceful in mind.
        </p>
      </motion.div>

      <motion.div
        className='flex flex-col items-center p-6 bg-blue-500 text-white rounded-xl shadow-lg w-85'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#3182ce'
        }}
      >
        <div className='text-4xl mb-4'>
          <FaLemon />
        </div>
        <h3 className='text-xl font-semibold'>Right Nutrition</h3>
        <p className='text-center text-sm mt-2'>
          We feel greatly happy with what learners can do to be healthy and
          peaceful in mind.
        </p>
      </motion.div>

      <motion.div
        className='flex flex-col items-center p-6 bg-purple-500 text-white rounded-xl shadow-lg w-85'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
          scale: 1.05,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#9f7aea'
        }}
      >
        <div className='text-4xl mb-4'>
          <FaVideo />
        </div>
        <h3 className='text-xl font-semibold'>Online Courses</h3>
        <p className='text-center text-sm mt-2'>
          We feel greatly happy with what learners can do to be healthy and
          peaceful in mind.
        </p>
      </motion.div>
    </div>
  );
}
