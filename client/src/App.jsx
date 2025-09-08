import { ThemeProvider } from 'next-themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router';

import { Spinner } from '~/components/ui/spinner';
import router from '~/routes/router';
import { initializeAuth } from '~/store/features/auth-slice';

const App = () => {
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      storageKey='theme'
      enableSystem={true}
      disableTransitionOnChange
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
