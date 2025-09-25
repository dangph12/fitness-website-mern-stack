import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';

import logo from '../assets/logo.png';

function Header() {
  return (
    <header className='bg-[#F5F2EC] text-[#3067B6] px-6 py-3 flex items-center justify-between rounded-2xl'>
      <Link to='/' className='flex items-center space-x-0.5'>
        <img src={logo} alt='Logo' className='w-28 h-28' />
        <span className='font-bold text-3xl mb-2'>F-Fitness</span>{' '}
      </Link>

      <nav className='flex space-x-10 font-bold text-lg relative'>
        {' '}
        <div className='relative group'>
          <button className='hover:text-gray-300 focus:outline-none text-lg'>
            Workout
          </button>
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
        <div className='relative group'>
          <button className='hover:text-gray-300 focus:outline-none text-lg'>
            Courses
          </button>
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
        <div className='relative group'>
          <button className='hover:text-gray-300 focus:outline-none text-lg'>
            Healthy Living
          </button>
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
        <div className='hover:text-gray-300 text-lg'>Community</div>{' '}
        <div className='hover:text-gray-300 text-lg'>Challenging</div>{' '}
        <div className='hover:text-gray-300 text-lg'>About</div>{' '}
      </nav>

      <div className='flex space-x-5'>
        <Button className='bg-yellow-400 text-black px-5 py-2 rounded-full font-medium hover:bg-yellow-500 transition'>
          <Link to='/auth/login'>Login</Link>
        </Button>

        <Button className='bg-[#3067B6] text-[#F5F2EC] px-5 py-2 rounded-full font-medium transition'>
          <Link to='/auth/sign-up'>Sign Up</Link>
        </Button>

        <Link to='/profile' className='text-[#3067B6] hover:text-gray-500'>
          <FaUser size={30} />
        </Link>
      </div>
    </header>
  );
}

export default Header;
