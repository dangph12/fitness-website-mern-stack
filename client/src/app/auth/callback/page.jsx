import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useSearchParams } from 'react-router';

import { loadUser } from '~/store/features/auth-slice';

const AuthCallbackPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const params = useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    dispatch(loadUser({ accessToken, isRemember: true }));
  }, []);

  return <Navigate to='/' />;
};

export default AuthCallbackPage;
