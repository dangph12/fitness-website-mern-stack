import React from 'react';
import { useLocation } from 'react-router';
import { Outlet } from 'react-router';

import { AdminSidebar } from '../components/admin/admin-sidebar.jsx';
import { SearchInput } from '../components/admin/search.jsx';
import { ProfileDropdown } from '../components/profile-dropdown';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../components/ui/breadcrumb';
import { ModeToggle } from '../components/ui/darkmode';
import { Separator } from '../components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '../components/ui/sidebar';

const AdminLayout = () => {
  const location = useLocation();

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/manage-users') return 'Users Management';
    return 'Admin Panel';
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset className='min-h-screen'>
        <header className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='/admin'>Admin Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className='flex items-center gap-4 ml-auto px-4'>
            <div className='hidden md:block'>
              <SearchInput />
            </div>
            <ModeToggle />
            <ProfileDropdown />
          </div>
        </header>
        <div className='flex flex-1 flex-col p-6 overflow-auto'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
