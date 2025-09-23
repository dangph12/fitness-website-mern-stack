import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import Footer from '~/components/footer';
import Header from '~/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Toaster } from '~/components/ui/sonner';
import { fetchAvatar } from '~/store/features/avatar-slice';

const RootLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { url: avatarUrl } = useSelector(state => state.avatar);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchAvatar(user?.id));
  }, [dispatch, user?.id]);

  return (
    <div>
      <div>
        <div>
          <Header />
        </div>
        {/* <Avatar>
          <AvatarImage src={avatarUrl} alt='User Avatar' />
          <AvatarFallback>U</AvatarFallback>
        </Avatar> */}
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
