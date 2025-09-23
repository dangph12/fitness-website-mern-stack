import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
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
import { loginSchema } from '~/lib/validations/auth';
import { loadUser } from '~/store/features/auth-slice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      isRemember: false
    }
  });

  const onSubmit = async data => {
    try {
      const { isRemember, ...loginData } = data;
      const response = await axiosInstance.post(
        '/api/auth/admin/login',
        loginData
      );
      const { accessToken } = response.data.data;
      dispatch(loadUser({ accessToken, isRemember }));
      navigate('/admin');
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please login to continue</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                name='isRemember'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 pt-2'>
                    <FormControl>
                      <Checkbox
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-2 leading-none'>
                      <FormLabel>Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
