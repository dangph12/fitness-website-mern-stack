import {
  Activity,
  BarChart3,
  ChevronRight,
  Dumbbell,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  ShoppingCart,
  User,
  Users,
  Utensils
} from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator
} from '../ui/sidebar';

export function AdminSidebar({ ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Lấy thông tin user từ Redux store
  const { user } = useSelector(state => state.auth);

  // Routes thực tế từ router.jsx
  const navMain = [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: Home
        },
        {
          title: 'Users Management',
          url: '/admin/manage-users',
          icon: Users
        }
      ]
    }
    // Có thể thêm các routes admin khác khi chúng được tạo
  ];

  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
    navigate('/admin/login');
  };

  const handleNavigation = url => {
    navigate(url);
  };

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
        {navMain.map(group => (
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
                <AvatarImage
                  src={user?.avatar || user?.profilePicture}
                  alt={user?.name || 'Admin'}
                />
                <AvatarFallback className='bg-gradient-to-r from-green-400 to-blue-500 text-white transition-all duration-300 ease-in-out'>
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                    : 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden'>
                <span className='truncate font-semibold transition-all duration-300 ease-in-out'>
                  {user?.name || 'Admin User'}
                </span>
                <span className='truncate text-xs text-muted-foreground transition-all duration-300 ease-in-out'>
                  {user?.email || 'admin@fitness.com'}
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
