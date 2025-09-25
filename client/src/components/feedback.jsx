import { motion } from 'framer-motion';
import { FaUserAlt } from 'react-icons/fa';

export default function Feedback() {
  return (
    <div className='py-20 px-8 bg-gray-50'>
      <motion.div
        className='text-center mb-12'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className='text-3xl font-bold text-teal-500'>
          What People Say About Us
        </h2>
      </motion.div>

      <motion.div
        className='flex justify-center gap-20 flex-wrap'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        {/* Testimonial 1 */}
        <div className='flex items-center bg-white p-6 rounded-xl shadow-lg w-100'>
          <div className='w-24 h-24 rounded-full bg-teal-200 flex items-center justify-center mr-6'>
            <FaUserAlt className='text-4xl text-teal-500' />
          </div>
          <div>
            <h3 className='text-xl font-semibold text-teal-500'>
              Best Yoga Club Ever
            </h3>
            <p className='text-gray-600 text-center mt-2 mb-4'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam
              nonummy.
            </p>
            <p className='text-teal-500'>Chloe Moore</p>
            <p className='text-gray-400'>Business Management</p>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className='flex items-center bg-white p-6 rounded-xl shadow-lg w-100'>
          <div className='w-24 h-24 rounded-full bg-teal-200 flex items-center justify-center mr-6'>
            <FaUserAlt className='text-4xl text-teal-500' />
          </div>
          <div>
            <h3 className='text-xl font-semibold text-teal-500'>
              Amazing Classes
            </h3>
            <p className='text-gray-600 text-center mt-2 mb-4'>
              Sed diam nonummy eirmod tempor incididunt ut labore et dolore
              magna aliquam.
            </p>
            <p className='text-teal-500'>Sofia Jones</p>
            <p className='text-gray-400'>Yoga Trainer</p>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className='flex items-center bg-white p-6 rounded-xl shadow-lg w-100'>
          <div className='w-24 h-24 rounded-full bg-teal-200 flex items-center justify-center mr-6'>
            <FaUserAlt className='text-4xl text-teal-500' />
          </div>
          <div>
            <h3 className='text-xl font-semibold text-teal-500'>
              Excellent Experience
            </h3>
            <p className='text-gray-600 text-center mt-2 mb-4'>
              Ut labore et dolore magna aliqua. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore.
            </p>
            <p className='text-teal-500'>John Doe</p>
            <p className='text-gray-400'>Product Manager</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
