import {
  CreditCard,
  Keyboard,
  LogOut,
  Settings,
  User,
  Users
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { fetchUserProfile, logout } from '~/store/features/auth-slice';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

export function ProfileDropdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy thông tin user từ Redux store
  const {
    user: authUser,
    userProfile,
    loading: authLoading,
    profileLoading
  } = useSelector(state => state.auth);

  // Fetch full user data khi component mount
  useEffect(() => {
    if (authUser?.id && !authLoading && !userProfile) {
      dispatch(fetchUserProfile(authUser.id));
    }
  }, [authUser?.id, authLoading, userProfile, dispatch]);

  // Lấy initials từ tên user
  const getUserInitials = () => {
    const displayName = userProfile?.name || authUser?.name;
    if (!displayName) return 'AD';
    return displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get display values
  const displayName = userProfile?.name || authUser?.name || 'Admin User';
  const displayEmail =
    userProfile?.email || authUser?.email || 'admin@fitness.com';
  const displayAvatar =
    userProfile?.avatar || userProfile?.profilePicture || authUser?.avatar;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/admin/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            {profileLoading ? (
              <div className='flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600'>
                <span className='text-xs text-white'>...</span>
              </div>
            ) : (
              <>
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
                  {getUserInitials()}
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {profileLoading ? 'Đang tải...' : displayName}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {profileLoading ? '...' : displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
            <User className='mr-2 h-4 w-4' />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/billing')}>
            <CreditCard className='mr-2 h-4 w-4' />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
            <Settings className='mr-2 h-4 w-4' />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/team/new')}>
            <Users className='mr-2 h-4 w-4' />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Sign out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
