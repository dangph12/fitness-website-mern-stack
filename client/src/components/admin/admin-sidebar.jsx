import {
  BarChart3,
  Calendar,
  ChevronRight,
  HelpCircle,
  Home,
  Inbox,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  User,
  Users
} from 'lucide-react';
import React from 'react';
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

const data = {
  user: {
    name: 'Fitness Admin',
    email: 'admin@fitness.com',
    avatar: '/avatar.jpg'
  },
  navMain: [
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
        },
        {
          title: 'Analytics',
          url: '/admin/analytics',
          icon: BarChart3
        },
        {
          title: 'Orders',
          url: '/admin/orders',
          icon: ShoppingCart
        },
        {
          title: 'Messages',
          url: '/admin/messages',
          icon: MessageSquare,
          badge: '3'
        }
      ]
    },
    {
      title: 'Security',
      items: [
        {
          title: 'Authentication',
          url: '/admin/auth',
          icon: Shield,
          items: [
            {
              title: 'Login Settings',
              url: '/admin/auth/login-settings'
            },
            {
              title: 'User Permissions',
              url: '/admin/auth/permissions'
            }
          ]
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Help Center',
          url: '/admin/help',
          icon: HelpCircle
        },
        {
          title: 'Settings',
          url: '/admin/settings',
          icon: Settings
        }
      ]
    }
  ]
};

export function AdminSidebar({ ...props }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
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
              Fitness Admin
            </span>
            <span className='truncate text-xs transition-all duration-300 ease-in-out'>
              FFitness
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='transition-all duration-300 ease-in-out'>
        {data.navMain.map(group => (
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
                      {item.badge && (
                        <span className='ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden'>
                          {item.badge}
                        </span>
                      )}
                      {item.items && (
                        <ChevronRight className='ml-auto transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden' />
                      )}
                    </SidebarMenuButton>
                    {item.items && (
                      <SidebarMenuSub className='transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden'>
                        {item.items.map(subItem => (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className='transition-all duration-300 ease-in-out'
                          >
                            <SidebarMenuSubButton
                              isActive={location.pathname === subItem.url}
                              onClick={() => handleNavigation(subItem.url)}
                              className='transition-all duration-300 ease-in-out'
                            >
                              <span className='transition-all duration-300 ease-in-out'>
                                {subItem.title}
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
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
                <AvatarImage src={data.user.avatar} alt={data.user.name} />
                <AvatarFallback className='bg-gradient-to-r from-green-400 to-blue-500 text-white transition-all duration-300 ease-in-out'>
                  {data.user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden'>
                <span className='truncate font-semibold transition-all duration-300 ease-in-out'>
                  {data.user.name}
                </span>
                <span className='truncate text-xs text-muted-foreground transition-all duration-300 ease-in-out'>
                  {data.user.email}
                </span>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 overflow-hidden'
                onClick={handleLogout}
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
