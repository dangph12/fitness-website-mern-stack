import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Spinner } from '~/components/ui/spinner';
import axiosInstance from '~/lib/axios-instance';
import { avatarSchema } from '~/lib/validations/avatar';
import { logout } from '~/store/features/auth-slice';
import { setAvatar, updateAvatar } from '~/store/features/avatar-slice';

const Page = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector(state => state.auth);
  const { url: avatarUrl, uploading } = useSelector(state => state.avatar);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(avatarSchema)
  });

  const watchedAvatar = watch('avatar');

  useEffect(() => {
    if (!loading && user?.id) {
      const fetchUserData = async () => {
        setFetchingData(true);
        try {
          const response = await axiosInstance.get(`/api/users/${user.id}`);
          setUserData(response.data.data);
          dispatch(setAvatar(response.data.data.avatar));
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setFetchingData(false);
        }
      };

      fetchUserData();
    }
  }, [user?.id, loading, dispatch]);

  useEffect(() => {
    if (watchedAvatar && watchedAvatar[0]) {
      handleSubmit(onSubmit)();
    }
  }, [watchedAvatar, handleSubmit]);

  const onSubmit = async data => {
    if (!data.avatar || !data.avatar[0]) return;
    dispatch(updateAvatar({ userId: user.id, file: data.avatar[0] }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const { ref, ...registerProps } = register('avatar');

  // Trigger hidden file input when avatar is clicked
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (loading || fetchingData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto p-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <div
            className={`w-32 h-32 cursor-pointer transition-all duration-200 relative ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-60'
            }`}
            onClick={!uploading ? handleAvatarClick : undefined}
          >
            <Avatar className='w-full h-full'>
              <AvatarImage
                src={
                  watchedAvatar && watchedAvatar[0]
                    ? URL.createObjectURL(watchedAvatar[0])
                    : avatarUrl
                }
                alt={userData?.name}
                className='pointer-events-none'
              />
              <AvatarFallback className='pointer-events-none'>
                CN
              </AvatarFallback>
            </Avatar>

            {/* Uploading overlay with spinner */}
            {uploading && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full'>
                <div className='flex flex-col items-center gap-2'>
                  <Spinner size='lg' className='text-white' />
                </div>
              </div>
            )}
          </div>

          <Input
            {...registerProps}
            ref={e => {
              ref(e);
              fileInputRef.current = e;
            }}
            id='avatar'
            type='file'
            accept='image/*'
            className='hidden'
            disabled={uploading}
          />

          {errors.avatar && (
            <p className='text-red-500 text-sm mt-1'>{errors.avatar.message}</p>
          )}
        </div>
      </form>

      <div className='mt-8 space-y-2'>
        <h1 className='text-2xl font-bold'>Profile Page</h1>
        <p>
          <strong>Name:</strong> {userData?.name}
        </p>
        <p>
          <strong>Email:</strong> {userData?.email}
        </p>
        <Button onClick={() => handleLogout()}>Logout</Button>
      </div>
    </div>
  );
};

export default Page;
