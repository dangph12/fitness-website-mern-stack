import { useTheme } from 'next-themes';
import React from 'react';
import { Outlet } from 'react-router';

import { Toaster } from '~/components/ui/sonner';

const AdminLayout = () => {
  const { theme } = useTheme();
  return (
    <div>
      <Outlet />
      <Toaster position='top-right' theme={theme} />
    </div>
  );
};

export default AdminLayout;
