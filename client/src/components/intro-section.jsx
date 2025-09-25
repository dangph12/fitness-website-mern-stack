import { motion } from 'framer-motion';

import yoga from '../assets/yoga.png';

export default function IntroSection() {
  return (
    <div className='flex items-center justify-center py-20 px-8 bg-white'>
      <motion.div
        className='flex items-center max-w-screen-xl mx-auto'
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className='w-1/2 p-4'>
          <div className='relative w-full h-[500px] mx-auto rounded-full overflow-hidden bg-teal-200'>
            <img
              src={yoga}
              alt='Yoga Image'
              className='object-cover w-full h-full'
            />
            <div className='absolute inset-0 bg-teal-100 opacity-30'></div>
          </div>
        </div>

        <div className='w-1/2 p-8'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Bring The Healthiest Change in Your Life by Yoga
          </h2>
          <p className='text-lg text-gray-600 mb-6'>
            Aenean auctor wisi et urna. Aliquam erat volutpat. Duis ac turpis.
            Integer rutrum ante eu lacus. Vivamus eget nibh.
          </p>

          <ul className='list-disc pl-5 mb-6 text-gray-600'>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>At vero eos et accusam et justo duo dolores et ea rebum.</li>
            <li>Stet clita kasd gubergren, no sea takimata sanctus est.</li>
          </ul>

          <motion.button
            className='px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300'
            whileHover={{ scale: 1.05 }}
          >
            Discover More
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
