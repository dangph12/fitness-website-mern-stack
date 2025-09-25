import { motion } from 'framer-motion';
import React from 'react';

import { Button } from '~/components/ui/button';

import banner from '../assets/banner-1.png';

function Banner() {
  return (
    <div className='relative text-center p-8 lg:p-16'>
      <motion.img
        src={banner}
        alt='Healthy Lifestyle'
        className='w-full h-auto'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className='absolute bottom-30 right-50 py-4 px-6 text-[#3067B6] rounded-2xl cursor-pointer text-xl font-bold'
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Button className='w-full lg:w-auto'>Join Now</Button>
      </motion.div>
    </div>
  );
}

export default Banner;
