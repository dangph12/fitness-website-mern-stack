import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import axiosInstance from '~/lib/axios-instance';
import { signUpSchema } from '~/lib/validations/auth';
import { loadUser } from '~/store/features/auth-slice';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      avatar: undefined
    }
  });

  const watchedAvatar = form.watch('avatar');

  const onSubmit = async data => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('name', data.name);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);

      if (data.avatar && data.avatar[0]) {
        formData.append('avatar', data.avatar[0]);
      }

      const response = await axiosInstance.post('/api/auth/sign-up', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { accessToken } = response.data.data;

      dispatch(loadUser({ accessToken }));

      navigate('/');
      toast.success('Account created successfully!');
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Sign up failed. Please try again.');
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
            }}
          >
            <FaGoogle className='mr-2' />
            Continue with Google
          </Button>

          <Button
            variant='outline'
            className='w-full'
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/facebook`;
            }}
          >
            <FaFacebook className='mr-2' />
            Continue with Facebook
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Avatar Upload Section */}
              <FormField
                control={form.control}
                name='avatar'
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Picture (Optional)</FormLabel>
                    <FormControl>
                      <div className='flex flex-col items-center space-y-2'>
                        <div
                          className='w-20 h-20 cursor-pointer transition-all duration-200 hover:opacity-60'
                          onClick={handleAvatarClick}
                        >
                          <Avatar className='w-full h-full border-2 border-gray-300'>
                            <AvatarImage
                              src={
                                watchedAvatar && watchedAvatar[0]
                                  ? URL.createObjectURL(watchedAvatar[0])
                                  : undefined
                              }
                              alt='Profile preview'
                            />
                            <AvatarFallback className='text-xs'>
                              {watchedAvatar && watchedAvatar[0]
                                ? 'IMG'
                                : 'Add Avatar'}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <Input
                          {...field}
                          ref={fileInputRef}
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={e => {
                            onChange(e.target.files);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter your password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Confirm your password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Creating account...'
                  : 'Create account'}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='pt-6'>
          <p className='text-sm text-muted-foreground text-center w-full'>
            Already have an account?{' '}
            <Link
              to='/auth/login'
              className='text-primary underline hover:text-primary/80'
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
