import React from 'react';
import {
  FaDumbbell,
  FaFemale,
  FaFireAlt,
  FaHome,
  FaMale,
  FaRunning
} from 'react-icons/fa';

const WorkoutCategory = () => {
  const categories = [
    { name: 'Beginner', icon: <FaDumbbell />, color: 'bg-green-200' },
    { name: 'Home', icon: <FaHome />, color: 'bg-blue-200' },
    { name: 'Gym', icon: <FaDumbbell />, color: 'bg-red-200' },
    { name: 'Men', icon: <FaMale />, color: 'bg-purple-200' },
    { name: 'Women', icon: <FaFemale />, color: 'bg-pink-200' },
    { name: 'Muscle Building', icon: <FaDumbbell />, color: 'bg-yellow-200' },
    { name: 'Fat Burning', icon: <FaFireAlt />, color: 'bg-orange-200' },
    { name: 'Leg', icon: <FaRunning />, color: 'bg-teal-200' }
  ];

  const handleCategoryClick = category => {
    console.log(`Category selected: ${category}`);
  };

  return (
    <div className='p-6'>
      <div className='mb-10'>
        <h1 className='text-6xl font-extrabold text-black'>
          F-Fitness Workout Routine
        </h1>
        <h1 className='text-6xl font-extrabold text-black'>Database </h1>
        <p className='text-xl text-black mt-2'>
          Explore our extensive collection of workout plans and routines
          tailored to your fitness goals. Find the perfect routine to elevate
          your workout experience.
        </p>
      </div>
      <h2 className='text-2xl font-semibold mb-6'>Popular Categories</h2>

      <div className='grid grid-cols-4 gap-4'>
        {categories.map(category => (
          <div
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`relative flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${category.color}`}
          >
            <div className='text-4xl text-white mb-4 font-bold'>
              {' '}
              {category.icon}
            </div>
            <span className='font-semibold'>{category.name}</span>{' '}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutCategory;
