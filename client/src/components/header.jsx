import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
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

  const { user } = useSelector(state => state.auth);
  const { url: avatarUrl } = useSelector(state => state.avatar);

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
        className={`lg:flex space-x-15 font-bold relative ${menuOpen ? 'block' : 'hidden'} lg:block`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Link to='/workouts' className='hover:text-gray-300 text-lg'>
          Workouts
        </Link>
        <MenuItem
          label='Plans'
          isDropdown={true}
          links={[
            { label: 'Rountine Database', href: '/plans/routine-database' },
            { label: 'Rountine Builder', href: '/plans/rountine-builder' }
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
        <Link to='/nutrition' className='hover:text-gray-300 text-lg'>
          Nutrition
        </Link>
        <Link to='/community' className='hover:text-gray-300 text-lg'>
          Community
        </Link>
        <Link to='/exercise' className='hover:text-gray-300 text-lg'>
          Exercise
        </Link>
        <Link to='/about' className='hover:text-gray-300 text-lg'>
          About
        </Link>
      </motion.nav>

      <div className='flex space-x-5'>
        {!user ? (
          <>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Button className='bg-yellow-400 text-black px-5 py-2 rounded-full font-medium hover:bg-yellow-500 transition'>
                <Link to='/auth/login'>Login</Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Button className='bg-[#3067B6] text-[#F5F2EC] px-5 py-2 rounded-full font-medium transition'>
                <Link to='/auth/sign-up'>Sign Up</Link>
              </Button>
            </motion.div>
          </>
        ) : (
          <Link to='/profile' className='flex items-center space-x-2'>
            {avatarUrl ? (
              <Avatar className='w-15 h-15'>
                <AvatarImage
                  src={avatarUrl}
                  alt='User Avatar'
                  className='rounded-full border-2 border-[#3067B6]'
                />
                <AvatarFallback className='text-[#3067B6]'>
                  {user.name ? user.name[0] : 'U'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <FaUser size={30} />
            )}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
