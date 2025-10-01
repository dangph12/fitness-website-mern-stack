import React from 'react';
import { Link } from 'react-router';

import nutri from '../assets/nutri.webp';

const NutriBanner = () => {
  return (
    <div className='bg-white text-black flex justify-center items-center min-h-max: p-20'>
      <div className='flex flex-col lg:flex-row items-center space-x-10 max-w-6xl'>
        <div className='text-center lg:text-left space-y-6'>
          <h1 className='text-7xl font-bold leading-tight'>
            Good health starts with good nutrition.
          </h1>
          <p className='text-lg'>
            Want to be more mindful of what you eat? Track your meals, learn
            more about your habits, and achieve your goals with MyFitnessPal.
          </p>
          <Link
            to={`/nutrition/create-meal`}
            className='inline-block bg-blue-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition'
          >
            + Bắt đầu tạo bữa ăn
          </Link>
        </div>

        <div className='mt-8 lg:mt-0'>
          <img
            src={nutri}
            alt='Healthy Meal'
            className='w-max h-max object-cover rounded-xl shadow-lg'
          />
        </div>
      </div>
    </div>
  );
};

export default NutriBanner;
