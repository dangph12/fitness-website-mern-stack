import { useTheme } from 'next-themes';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';
import { logout } from '~/store/features/auth-slice';
import { clearAvatar } from '~/store/features/avatar-slice';

const Page = () => {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearAvatar());
  };

  return (
    <>
      <div>HomePage with {theme} theme</div>
      <div className='flex flex-col space-y-4'>
        <Link to='/profile'>Profile</Link>
        <Link to='/auth/login'>Login</Link>
        <Link to='/auth/sign-up'>Sign Up</Link>
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={toggleTheme}>Toggle Theme</Button>
      </div>
    </>
  );
};

export default Page;
