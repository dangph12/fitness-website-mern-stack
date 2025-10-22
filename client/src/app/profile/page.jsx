import React from 'react';

import FavoriteList from '~/components/favorite-list';
import ProfileUser from '~/components/profile-user';

function Page() {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6 space-y-6'>
      <ProfileUser />
      <FavoriteList />
    </div>
  );
}

export default Page;
