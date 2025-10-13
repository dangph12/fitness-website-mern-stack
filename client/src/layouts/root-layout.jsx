import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router';

import Footer from '~/components/footer';
import Header from '~/components/header';
import { Toaster } from '~/components/ui/sonner';
import { fetchAvatar } from '~/store/features/avatar-slice';

const RootLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const { url: avatarUrl } = useSelector(state => state.avatar);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchAvatar(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (!user) {
      if (location.pathname === '/onboarding') {
        navigate('/login', { replace: true });
        return;
      }
      if (
        location.pathname !== '/login' &&
        location.pathname !== '/register' &&
        location.pathname !== '/'
      ) {
        navigate('/', { replace: true });
      }
      return;
    }

    if (user.profileCompleted === false) {
      if (location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <div>
      <div>
        <div>
          <Header />
        </div>
      </div>
      <Outlet />
      <div>
        <Footer />
      </div>
      <Toaster position='top-right' theme={theme} />
    </div>
  );
};

export default RootLayout;
