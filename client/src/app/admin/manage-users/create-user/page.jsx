'use client';

import { ArrowLeft, Loader2, Plus, Upload, User } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { Alert, AlertDescription } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import axiosInstance from '~/lib/axios-instance';
import { createBodyRecord } from '~/store/features/body-records';
import { fetchUsers } from '~/store/features/users-slice';

export default function AddUserPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    gender: 'unspecified',
    dob: '',
    isActive: true
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }

      setAvatar(file);

      const reader = new FileReader();
      reader.onload = e => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();

      submitData.append('name', formData.name.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('password', formData.password);
      submitData.append('role', formData.role);
      submitData.append('isActive', formData.isActive);

      if (formData.gender && formData.gender !== 'unspecified') {
        submitData.append('gender', formData.gender);
      }

      if (formData.dob) {
        submitData.append('dob', formData.dob);
      }

      if (avatar) {
        submitData.append('avatar', avatar);
      }

      console.log('Creating user with data:', Object.fromEntries(submitData));

      // Create user
      const userResponse = await axiosInstance.post('/api/users', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('User created successfully:', userResponse.data);

      setSuccess('User created successfully!');

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        gender: 'unspecified',
        dob: '',
        isActive: true
      });
      setAvatar(null);
      setAvatarPreview(null);

      // Refresh users list
      dispatch(
        fetchUsers({
          page: 1,
          limit: 10,
          search: '',
          role: [],
          gender: []
        })
      );
    } catch (error) {
      console.error('Failed to create user:', error);
      console.error('User creation error response:', error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        'Failed to create user. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-users');
  };

  return (
    <div className='container mx-auto py-6 max-w-2xl'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleGoBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Users
        </Button>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Alert Messages */}
            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className='border-green-200 bg-green-50 text-green-800'>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Avatar Upload */}
            <div className='space-y-2'>
              <Label>Profile Picture (Optional)</Label>
              <div className='flex items-center gap-4'>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt='Avatar preview'
                    className='w-16 h-16 rounded-full object-cover border'
                  />
                ) : (
                  <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center border'>
                    <User className='w-8 h-8 text-muted-foreground' />
                  </div>
                )}
                <div>
                  <Input
                    id='avatar'
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                  />
                  <Label
                    htmlFor='avatar'
                    className='cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80'
                  >
                    <Upload className='w-4 h-4' />
                    Choose Image
                  </Label>
                  <p className='text-xs text-muted-foreground mt-1'>
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name *</Label>
                <Input
                  id='name'
                  type='text'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Enter full name'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address *</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder='Enter email address'
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password *</Label>
                <Input
                  id='password'
                  type='password'
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  placeholder='Enter password'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm Password *</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  value={formData.confirmPassword}
                  onChange={e =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  placeholder='Confirm password'
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Role and Status */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='role'>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={value => handleInputChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='user'>User</SelectItem>
                    {/* <SelectItem value='instructor'>Instructor</SelectItem> */}
                    <SelectItem value='admin'>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='gender'>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={value => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='unspecified'>Not specified</SelectItem>
                    <SelectItem value='male'>Male</SelectItem>
                    <SelectItem value='female'>Female</SelectItem>
                    {/* <SelectItem value='other'>Other</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='dob'>Date of Birth</Label>
                <Input
                  id='dob'
                  type='date'
                  value={formData.dob}
                  onChange={e => handleInputChange('dob', e.target.value)}
                />
              </div>
            </div>

            {/* Active Status */}
            <div className='flex items-center justify-between p-4 border rounded-lg'>
              <div>
                <Label htmlFor='isActive' className='text-base font-medium'>
                  Active Status
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Enable or disable this user account
                </p>
              </div>
              <Switch
                id='isActive'
                checked={formData.isActive}
                onCheckedChange={checked =>
                  handleInputChange('isActive', checked)
                }
              />
            </div>

            {/* Form Actions */}
            <div className='flex items-center gap-4 pt-4'>
              <Button
                type='submit'
                disabled={loading}
                className='flex items-center gap-2'
              >
                {loading && <Loader2 className='h-4 w-4 animate-spin' />}
                <Plus className='h-4 h-4' />
                Create User
              </Button>

              <Button
                type='button'
                variant='outline'
                onClick={handleGoBack}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
