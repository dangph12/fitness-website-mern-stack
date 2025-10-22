'use client';

import { ArrowLeft, Loader2, Save, Upload, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

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
import {
  fetchUserDetails,
  fetchUsers,
  updateUser
} from '~/store/features/users-slice';

export default function UpdateUserPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    selectedUser,
    userDetailsLoading,
    userDetailsError,
    updateLoading,
    updateError,
    currentPage,
    limit,
    filters
  } = useSelector(state => state.users);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    gender: 'unspecified',
    height: '',
    dob: '',
    isActive: true
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user details when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetails(id));
    }
  }, [id, dispatch]);

  // Update form data when user details are loaded
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || selectedUser.fullName || '',
        email: selectedUser.email || '',
        role: selectedUser.role || 'user',
        gender: selectedUser.gender || 'unspecified',
        height: selectedUser.height || '',
        dob: selectedUser.dob ? selectedUser.dob.split('T')[0] : '',
        isActive: selectedUser.isActive !== false
      });

      // Set avatar preview if user has avatar
      if (selectedUser.avatar) {
        setAvatarPreview(selectedUser.avatar);
      }
    }
  }, [selectedUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (localError) setLocalError('');
    if (success) setSuccess('');
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Image file size must be less than 5MB');
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
      setLocalError('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    // Validate height if provided
    if (
      formData.height &&
      (isNaN(formData.height) || formData.height < 1 || formData.height > 300)
    ) {
      setLocalError('Height must be between 1 and 300 cm');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLocalError('');
    setSuccess('');

    try {
      // Prepare form data for multipart upload
      const updateData = new FormData();

      updateData.append('name', formData.name.trim());
      updateData.append('email', formData.email.trim());
      updateData.append('role', formData.role);
      updateData.append('isActive', formData.isActive);

      // Only append gender if it's not unspecified
      if (formData.gender && formData.gender !== 'unspecified') {
        updateData.append('gender', formData.gender);
      }

      if (formData.height) {
        updateData.append('height', formData.height);
      }

      if (formData.dob) {
        updateData.append('dob', formData.dob);
      }

      // Add avatar if changed
      if (avatar) {
        updateData.append('avatar', avatar);
      }

      console.log('Updating user with data:', Object.fromEntries(updateData));

      await dispatch(
        updateUser({
          id: selectedUser._id,
          data: updateData
        })
      ).unwrap();

      setSuccess('User updated successfully!');

      // Refresh users list
      dispatch(
        fetchUsers({
          page: currentPage,
          limit,
          search: filters.search,
          role: filters.role,
          gender: filters.gender
        })
      );

      // Navigate back after success
      setTimeout(() => {
        navigate('/admin/manage-users');
      }, 2000);
    } catch (error) {
      console.error('Failed to update user:', error);
      setLocalError(error || 'Failed to update user. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/admin/manage-users');
  };

  // Loading state
  if (userDetailsLoading) {
    return (
      <div className='container mx-auto py-6 max-w-2xl'>
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
          <CardContent className='flex items-center justify-center py-8'>
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              Loading user details...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (userDetailsError) {
    return (
      <div className='container mx-auto py-6 max-w-2xl'>
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
            <Alert variant='destructive'>
              <AlertDescription>{userDetailsError}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No user found
  if (!selectedUser) {
    return (
      <div className='container mx-auto py-6 max-w-2xl'>
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
            <Alert>
              <AlertDescription>User not found</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayError = localError || updateError;

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
        <CardHeader>
          <CardTitle>Update User</CardTitle>
          <CardDescription>
            Update user information and settings for{' '}
            {selectedUser.name || selectedUser.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Alert Messages */}
            {displayError && (
              <Alert variant='destructive'>
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className='border-green-200 bg-green-50 text-green-800'>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Avatar Upload */}
            <div className='space-y-2'>
              <Label>Profile Picture</Label>
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
                    Change Image
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
                    <SelectItem value='instructor'>Instructor</SelectItem>
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
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Body Measurements */}
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
                disabled={updateLoading}
                className='flex items-center gap-2'
              >
                {updateLoading && <Loader2 className='h-4 w-4 animate-spin' />}
                <Save className='h-4 h-4' />
                Update User
              </Button>

              <Button
                type='button'
                variant='outline'
                onClick={handleGoBack}
                disabled={updateLoading}
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
