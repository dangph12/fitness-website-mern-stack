import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router';

import Footer from '~/components/footer';
import Header from '~/components/header';
import OnboardingComponent from '~/components/onboarding';
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

  // Check if we should show onboarding
  const shouldShowOnboarding =
    user && user.profileCompleted === false && location.pathname !== '/';

  return (
    <div>
      <div>
        <div>
          <Header />
        </div>
      </div>
      {shouldShowOnboarding ? <OnboardingComponent /> : <Outlet />}
      <div>
        <Footer />
      </div>
      <Toaster position='top-right' theme={theme} />
    </div>
  );
};

export default RootLayout;
