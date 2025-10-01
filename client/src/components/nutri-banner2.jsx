import React from 'react';
import { FaBarcode, FaBook, FaRunning } from 'react-icons/fa';

import NutriBanner from './nutri-banner';

const NutriBanner2 = () => {
  return (
    <div className='bg-white py-16 px-6 flex flex-col items-center justify-center text-center'>
      <h2 className='text-6xl font-bold mb-4 text-gray-900'>
        The tools for your goals
      </h2>
      <p className='text-lg text-gray-600 mb-12'>
        Are you trying to lose weight, tone up, lower your BMI, or improve your
        overall health? We give you the right features to make it happen.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        <div className='flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg'>
          <FaBook size={50} className='text-blue-500 mb-4' />
          <h3 className='text-xl font-semibold mb-2'>
            Learn. Follow. Progress.
          </h3>
          <p className='text-center text-gray-600'>
            Keeping a food journal allows you to better understand your habits
            and increases your chances of achieving your goals.
          </p>
        </div>

        <div className='flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg'>
          <FaBarcode size={50} className='text-blue-500 mb-4' />
          <h3 className='text-xl font-semibold mb-2'>Record more easily.</h3>
          <p className='text-center text-gray-600'>
            Scan barcodes, save meals and recipes, and use Quick Tools for quick
            and easy food tracking.
          </p>
        </div>

        <div className='flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg'>
          <FaRunning size={50} className='text-blue-500 mb-4' />
          <h3 className='text-xl font-semibold mb-2'>Stay motivated.</h3>
          <p className='text-center text-gray-600'>
            Join the world's largest fitness community for tips, tricks, and
            24/7 support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutriBanner2;
