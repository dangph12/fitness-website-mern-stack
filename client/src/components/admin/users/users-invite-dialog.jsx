'use client';

import { Mail, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert } from '~/components/ui/alert';
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
import { Spinner } from '~/components/ui/spinner';
import { fetchUsers } from '~/store/features/users-slice';

import { useUsers } from './users-provider';

export function UsersInviteDialog({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const { currentPage, limit, filters } = useSelector(state => state.users);
  const { closeDialog } = useUsers();

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      closeDialog('invite');
    }
    // Reset form
    setFormData({
      email: '',
      fullName: '',
      role: 'user'
    });
    setError('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email || !formData.fullName) {
      setError('Email and full name are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual invite API call
      // await dispatch(inviteUser(formData)).unwrap();

      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      // Show success message (you might want to use a toast library)
      console.log('User invited successfully');
    } catch (error) {
      setError(error.message || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <UserPlus className='h-5 w-5' />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            Send an invitation to a new user to join the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                id='email'
                type='email'
                placeholder='user@example.com'
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className='pl-10'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='fullName'>Full Name</Label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                id='fullName'
                type='text'
                placeholder='John Doe'
                value={formData.fullName}
                onChange={e => handleInputChange('fullName', e.target.value)}
                className='pl-10'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>Role</Label>
            <Select
              value={formData.role}
              onValueChange={value => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='user'>User</SelectItem>
                <SelectItem value='instructor'>Instructor</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <Alert variant='destructive'>{error}</Alert>}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Spinner className='mr-2 h-4 w-4' />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
