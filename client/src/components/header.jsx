import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';

import logo from '../assets/logo.png';

const MenuItem = ({ label, links, isDropdown }) => (
  <div
    className={`relative group ${isDropdown ? 'lg:inline-block' : 'lg:inline-block'}`}
  >
    <motion.button
      className='hover:text-gray-300 focus:outline-none text-lg'
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      {label}
    </motion.button>
    {isDropdown && (
      <div className='absolute left-0 mt-2 hidden group-hover:block group-focus-within:block bg-white text-black rounded-md shadow-lg w-40 z-10'>
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className='block px-4 py-2 hover:bg-gray-100'
          >
            {link.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className='bg-[#F5F2EC] text-[#3067B6] px-6 py-3 flex items-center justify-between rounded-2xl'>
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

      <div className='lg:hidden flex items-center'>
        <button onClick={toggleMenu} className='text-3xl'>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <motion.nav
        className={`lg:flex space-x-10 font-bold relative ${menuOpen ? 'block' : 'hidden'} lg:block`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <MenuItem
          label='Workout'
          isDropdown={true}
          links={[
            { label: 'Abs Training', href: '#abs' },
            { label: 'Legs Training', href: '#legs' },
            { label: 'Arms Training', href: '#arms' }
          ]}
        />
        <MenuItem
          label='Courses'
          isDropdown={true}
          links={[
            { label: 'Beginner', href: '#beginner' },
            { label: 'Intermediate', href: '#intermediate' },
            { label: 'Advanced', href: '#advanced' }
          ]}
        />
        <motion.div
          className='hover:text-gray-300 text-lg'
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Nutrition
        </motion.div>
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
