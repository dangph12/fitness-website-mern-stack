import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { toggleTheme } from '~/store/features/theme-slice';

const Page = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.value);

  return (
    <>
      <main>
        <Button
          variant='outline'
          onClick={() => {
            dispatch(toggleTheme());
            toast(`Theme changed to ${theme === 'dark' ? 'light' : 'dark'}`, {
              description: 'Theme has been toggled successfully.'
            });
          }}
        >
          Toggle theme
        </Button>
      </main>
    </>
  );
};

export default Page;
