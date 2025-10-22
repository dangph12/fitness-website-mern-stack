'use client';

import { Baby, Calendar, Mail, Ruler, Shield, User, Users } from 'lucide-react';
import { useSelector } from 'react-redux';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Spinner } from '~/components/ui/spinner';
import { formatDate, formatDateTime } from '~/lib/utils';

import { useUsers } from './users-provider';

export function UsersDetailsDialog({ open, onOpenChange, user }) {
  const { selectedUser, userDetailsLoading, userDetailsError } = useSelector(
    state => state.users
  );
  const { closeDialog } = useUsers();

  const userToShow = selectedUser || user;

  // Helper functions
  const getUserDisplayName = user => {
    if (!user) return 'Unknown User';
    return user.name || user.fullName || user.username || 'Unknown User';
  };

  const getUserInitials = user => {
    if (!user) return 'U';
    const name = getUserDisplayName(user);
    if (name === 'Unknown User') return 'U';

    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      closeDialog('details');
    }
  };

  const getStatusBadge = user => {
    const isActive = user?.isActive !== false;
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getRoleBadge = role => {
    const variants = {
      admin:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      instructor:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };

    return (
      <Badge
        className={
          variants[role] ||
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }
      >
        {role || 'user'}
      </Badge>
    );
  };

  const getGenderBadge = gender => {
    if (!gender)
      return <span className='text-muted-foreground'>Not specified</span>;

    const variants = {
      male: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      female: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };

    return (
      <Badge
        className={
          variants[gender] ||
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }
      >
        {gender}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            User Details
          </DialogTitle>
        </DialogHeader>

        {userDetailsLoading && (
          <div className='flex items-center justify-center py-8'>
            <Spinner className='h-8 w-8' />
            <span className='ml-2'>Loading user details...</span>
          </div>
        )}

        {userDetailsError && (
          <div className='text-center py-8 text-red-600'>
            Error loading user details: {userDetailsError}
          </div>
        )}

        {userToShow && !userDetailsLoading && (
          <div className='space-y-6'>
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-start space-x-4'>
                  <Avatar className='h-16 w-16'>
                    <AvatarImage src={userToShow.avatar} />
                    <AvatarFallback className='text-lg'>
                      {getUserInitials(userToShow)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-2'>
                    <div>
                      <h3 className='text-lg font-semibold'>
                        {getUserDisplayName(userToShow)}
                      </h3>
                      {userToShow.username && (
                        <p className='text-sm text-muted-foreground'>
                          @{userToShow.username}
                        </p>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>{userToShow.email}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      {getStatusBadge(userToShow)}
                      {getRoleBadge(userToShow.role)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm'>Personal Details</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      User ID:
                    </span>
                    <span className='text-sm font-mono'>{userToShow._id}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>
                      Gender:
                    </span>
                    {getGenderBadge(userToShow.gender)}
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Height:</span>
                    <span className="text-sm">
                      {userToShow.height ? `${userToShow.height}cm` : 'Not provided'}
                    </span>
                  </div> */}
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Date of Birth:
                    </span>
                    <span className='text-sm'>
                      {userToShow.dob
                        ? formatDate(userToShow.dob)
                        : 'Not provided'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-sm'>Timeline</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Joined:
                    </span>
                    <span className='text-sm'>
                      {userToShow.createdAt
                        ? formatDateTime(userToShow.createdAt)
                        : 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Updated:
                    </span>
                    <span className='text-sm'>
                      {userToShow.updatedAt
                        ? formatDateTime(userToShow.updatedAt)
                        : 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Version:
                    </span>
                    <span className='text-sm'>{userToShow.__v || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bio/Description if available */}
            {userToShow.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm'>Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm'>{userToShow.bio}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
