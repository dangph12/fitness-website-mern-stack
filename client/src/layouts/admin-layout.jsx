import React from 'react';
import { useLocation } from 'react-router';
import { Outlet } from 'react-router';

import { AdminSidebar } from '../components/admin/admin-sidebar.jsx';
// import { SearchInput } from '../components/admin/search.jsx';
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

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    // Generate breadcrumb items based on path
    const breadcrumbMap = {
      admin: 'Dashboard',
      'manage-users': 'Users Management',
      'add-user': 'Add User',
      'edit-user': 'Edit User',
      'manage-workouts': 'Workouts Management',
      'manage-exercises': 'Exercises Management',
      'manage-nutrition': 'Nutrition Management',
      analytics: 'Analytics',
      settings: 'Settings'
    };

    const items = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const title =
        breadcrumbMap[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);

      if (index === 0) {
        // First item (admin) is always a link to dashboard
        items.push({
          title: title,
          href: currentPath,
          isLast: false
        });
      } else if (index === segments.length - 1) {
        // Last item is current page
        items.push({
          title: title,
          href: currentPath,
          isLast: true
        });
      } else {
        // Middle items are links
        items.push({
          title: title,
          href: currentPath,
          isLast: false
        });
      }
    });

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

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
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.href}>
                    {index > 0 && (
                      <BreadcrumbSeparator className='hidden md:block' />
                    )}
                    <BreadcrumbItem
                      className={index === 0 ? 'hidden md:block' : ''}
                    >
                      {item.isLast ? (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>
                          {item.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className='flex items-center gap-4 ml-auto px-4'>
            <div className='hidden md:block'>{/* <SearchInput /> */}</div>
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
