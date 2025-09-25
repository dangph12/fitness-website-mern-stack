import { motion } from 'framer-motion';
import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';

import logo from '../assets/logo.png';

function Header() {
  return (
    <header className='bg-[#F5F2EC] text-[#3067B6] px-6 py-3 flex items-center justify-between rounded-2xl'>
      {/* Logo */}
      <motion.div
        className='flex items-center space-x-0.5'
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to='/' className='flex items-center space-x-0.5'>
          <img src={logo} alt='Logo' className='w-28 h-28' />
          <span className='font-bold text-3xl mb-2'>F-Fitness</span>
        </Link>
      </motion.div>

      {/* Navigation Menu */}
      <motion.nav
        className='flex space-x-10 font-bold relative'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Workout Dropdown */}
        <div className='relative group'>
          <motion.button
            className='hover:text-gray-300 focus:outline-none text-lg'
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Workout
          </motion.button>
          <div className='absolute left-0 mt-2 hidden group-hover:block group-focus-within:block bg-white text-black rounded-md shadow-lg w-40'>
            <a href='#abs' className='block px-4 py-2 hover:bg-gray-100'>
              Abs Training
            </a>
            <a href='#legs' className='block px-4 py-2 hover:bg-gray-100'>
              Legs Training
            </a>
            <a href='#arms' className='block px-4 py-2 hover:bg-gray-100'>
              Arms Training
            </a>
          </div>
        </div>

        {/* Courses Dropdown */}
        <div className='relative group'>
          <motion.button
            className='hover:text-gray-300 focus:outline-none text-lg'
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Courses
          </motion.button>
          <div className='absolute left-0 mt-2 hidden group-hover:block group-focus-within:block bg-white text-black rounded-md shadow-lg w-40'>
            <a href='#beginner' className='block px-4 py-2 hover:bg-gray-100'>
              Beginner
            </a>
            <a
              href='#intermediate'
              className='block px-4 py-2 hover:bg-gray-100'
            >
              Intermediate
            </a>
            <a href='#advanced' className='block px-4 py-2 hover:bg-gray-100'>
              Advanced
            </a>
          </div>
        </div>

        {/* Healthy Living Dropdown */}
        <div className='relative group'>
          <motion.button
            className='hover:text-gray-300 focus:outline-none text-lg'
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Healthy Living
          </motion.button>
          <div className='absolute left-0 mt-2 hidden group-hover:block group-focus-within:block bg-white text-black rounded-md shadow-lg w-48'>
            <a href='#nutrition' className='block px-4 py-2 hover:bg-gray-100'>
              Nutrition
            </a>
            <a href='#lifestyle' className='block px-4 py-2 hover:bg-gray-100'>
              Lifestyle
            </a>
            <a href='#mental' className='block px-4 py-2 hover:bg-gray-100'>
              Mental Health
            </a>
          </div>
        </div>

        {/* Other Menu Items */}
        <motion.div
          className='hover:text-gray-300 text-lg'
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Community
        </motion.div>
        <motion.div
          className='hover:text-gray-300 text-lg'
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Challenging
        </motion.div>
        <motion.div
          className='hover:text-gray-300 text-lg'
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          About
        </motion.div>
      </motion.nav>

      {/* Buttons */}
      <div className='flex space-x-5'>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Button className='bg-yellow-400 text-black px-5 py-2 rounded-full font-medium hover:bg-yellow-500 transition'>
            <Link to='/auth/login'>Login</Link>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Button className='bg-[#3067B6] text-[#F5F2EC] px-5 py-2 rounded-full font-medium transition'>
            <Link to='/auth/sign-up'>Sign Up</Link>
          </Button>
        </motion.div>

        <Link to='/profile' className='text-[#3067B6] hover:text-gray-500'>
          <FaUser size={30} />
        </Link>
      </div>
    </header>
  );
}

export default Header;
