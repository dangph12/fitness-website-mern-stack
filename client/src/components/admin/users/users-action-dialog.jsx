'use client';

import { Edit, ExternalLink, Loader2, Upload, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { Alert, AlertDescription } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';
import { fetchUsers, updateUser } from '~/store/features/users-slice';

import { useUsers } from './users-provider';

export function UsersActionDialog({ open, onOpenChange, user, actionType }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    selectedUser,
    currentPage,
    limit,
    filters,
    updateLoading,
    updateError
  } = useSelector(state => state.users);
  const { closeDialog } = useUsers();

  const userToEdit = selectedUser || user;

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

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || userToEdit.fullName || '',
        email: userToEdit.email || '',
        role: userToEdit.role || 'user',
        gender: userToEdit.gender || 'unspecified',
        height: userToEdit.height || '',
        dob: userToEdit.dob ? userToEdit.dob.split('T')[0] : '',
        isActive: userToEdit.isActive !== false
      });

      // Set avatar preview if user has avatar
      if (userToEdit.avatar) {
        setAvatarPreview(userToEdit.avatar);
      }
    }
  }, [userToEdit]);

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      closeDialog('action');
    }
    setLocalError('');
    setAvatar(null);
    setAvatarPreview(userToEdit?.avatar || null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (localError) setLocalError('');
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Image file size must be less than 5MB');
        return;
      }

      setAvatar(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavigateToUpdate = () => {
    if (userToEdit && userToEdit._id) {
      handleClose();
      navigate(`/admin/manage-users/update/${userToEdit._id}`);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email || !formData.name) {
      setLocalError('Email and name are required');
      return;
    }

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

      await dispatch(
        updateUser({
          id: userToEdit._id,
          data: updateData
        })
      ).unwrap();

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

      handleClose();
    } catch (error) {
      setLocalError(error || 'Failed to update user');
    }
  };

  if (!userToEdit) {
    return null;
  }

  const displayError = localError || updateError;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Edit className='h-5 w-5' />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Quick edit user information or open full edit page.
          </DialogDescription>
        </DialogHeader>

        {/* Quick navigation to full edit page */}
        <div className='mb-4 p-3 bg-muted/50 rounded-lg'>
          <p className='text-sm text-muted-foreground mb-2'>
            For comprehensive editing with all features:
          </p>
          <Button
            variant='outline'
            size='sm'
            onClick={handleNavigateToUpdate}
            className='flex items-center gap-2'
          >
            <ExternalLink className='h-3 w-3' />
            Open Full Edit Page
          </Button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
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
                  className='cursor-pointer inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 text-sm'
                >
                  <Upload className='w-3 h-3' />
                  Change
                </Label>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>Full Name</Label>
            <Input
              id='name'
              type='text'
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              required
            />
          </div>

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

          <div className='space-y-2'>
            <Label htmlFor='dob'>Date of Birth</Label>
            <Input
              id='dob'
              type='date'
              value={formData.dob}
              onChange={e => handleInputChange('dob', e.target.value)}
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='isActive'>Active Status</Label>
            <Switch
              id='isActive'
              checked={formData.isActive}
              onCheckedChange={checked =>
                handleInputChange('isActive', checked)
              }
            />
          </div>

          {displayError && (
            <Alert variant='destructive'>
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={updateLoading}>
              {updateLoading && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Quick Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
