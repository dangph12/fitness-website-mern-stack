import {
  Activity,
  BicepsFlexed,
  CalendarCheck2,
  Dumbbell,
  Ham,
  HeartPulse,
  Home,
  LogOut,
  Users,
  UserStar,
  Utensils
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import { fetchUserProfile, logout } from '~/store/features/auth-slice';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '../ui/sidebar';

export function AdminSidebar({ ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Routes thực tế từ router.jsx
  const navSections = [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: Home
        }
      ]
    },
    {
      title: 'User Management',
      items: [
        {
          title: 'Users',
          url: '/admin/manage-users',
          icon: Users
        },
        {
          title: 'Memberships',
          url: '/admin/memberships',
          icon: UserStar
        }
      ]
    },
    {
      title: 'Activity & Fitness',
      items: [
        {
          title: 'Exercises',
          url: '/admin/manage-exercises',
          icon: Activity
        },
        {
          title: 'Muscles',
          url: '/admin/manage-muscles',
          icon: BicepsFlexed
        },
        {
          title: 'Equipments',
          url: '/admin/manage-equipments',
          icon: Dumbbell
        },
        {
          title: 'Workouts',
          url: '/admin/manage-workouts',
          icon: HeartPulse
        },
        {
          title: 'Plans',
          url: '/admin/manage-plans',
          icon: CalendarCheck2
        }
      ]
    },
    {
      title: 'Meal Management',
      items: [
        {
          title: 'Foods',
          url: '/admin/manage-foods',
          icon: Ham
        },
        {
          title: 'Meals',
          url: '/admin/manage-meals',
          icon: Utensils
        }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/admin/login');
    }
  };

  const handleNavigation = url => {
    navigate(url);
  };

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

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='transition-all duration-300 ease-in-out'>
        <div className='flex items-center gap-2 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0'>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-300 ease-in-out'>
            <span className='text-lg'>🏋️</span>
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden'>
            <span className='truncate font-semibold transition-all duration-300 ease-in-out'>
              F-Fitness
            </span>
            <span className='truncate text-xs transition-all duration-300 ease-in-out'>
              Admin Panel
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='transition-all duration-300 ease-in-out'>
        {navSections.map(group => (
          <SidebarGroup
            key={group.title}
            className='transition-all duration-300 ease-in-out'
          >
            <SidebarGroupLabel className='transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0'>
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem
                    key={item.title}
                    className='transition-all duration-300 ease-in-out'
                  >
                    <SidebarMenuButton
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                      onClick={() => handleNavigation(item.url)}
                      className='transition-all duration-300 ease-in-out'
                    >
                      <item.icon className='transition-all duration-300 ease-in-out' />
                      <span className='transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden'>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className='transition-all duration-300 ease-in-out'>
        <SidebarMenu>
          <SidebarMenuItem className='transition-all duration-300 ease-in-out'>
            <div className='flex items-center gap-2 px-2 py-1.5 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:gap-0'>
              <Avatar className='h-8 w-8 transition-all duration-300 ease-in-out'>
                {profileLoading ? (
                  <div className='flex h-full w-full items-center justify-center bg-gradient-to-r from-green-400 to-blue-500'>
                    <span className='text-xs text-white'>...</span>
                  </div>
                ) : (
                  <>
                    <AvatarImage src={displayAvatar} alt={displayName} />
                    <AvatarFallback className='bg-gradient-to-r from-green-400 to-blue-500 text-white transition-all duration-300 ease-in-out'>
                      {getUserInitials()}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden'>
                <span className='truncate font-semibold transition-all duration-300 ease-in-out'>
                  {profileLoading ? 'Đang tải...' : displayName}
                </span>
                <span className='truncate text-xs text-muted-foreground transition-all duration-300 ease-in-out'>
                  {profileLoading ? '...' : displayEmail}
                </span>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden'
                onClick={handleLogout}
                title='Logout'
              >
                <LogOut className='h-4 w-4 transition-all duration-300 ease-in-out' />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
