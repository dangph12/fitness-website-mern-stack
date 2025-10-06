import { ArrowRight, Search, X } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';
import { Input } from '../ui/input';

// Global search component cho header
export const SearchInput = () => {
  const [open, setOpen] = useState(false);

  const searchCategories = [
    {
      group: 'Pages',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Members', href: '/admin/members' },
        { name: 'Trainers', href: '/admin/trainers' },
        { name: 'Classes', href: '/admin/classes' }
      ]
    },
    {
      group: 'Components',
      items: [
        { name: 'Workout Plans', href: '/admin/workout-plans' },
        { name: 'Equipment', href: '/admin/equipment' },
        { name: 'Nutrition', href: '/admin/nutrition' },
        { name: 'Reports', href: '/admin/reports' }
      ]
    },
    {
      group: 'Settings',
      items: [
        { name: 'General Settings', href: '/admin/settings' },
        { name: 'User Management', href: '/admin/users' },
        { name: 'Billing', href: '/admin/billing' },
        { name: 'Integration', href: '/admin/integration' }
      ]
    }
  ];

  React.useEffect(() => {
    const down = e => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = href => {
    setOpen(false);
    window.location.href = href;
  };

  return (
    <>
      <Button
        variant='outline'
        className='relative w-64 justify-start text-sm text-muted-foreground'
        onClick={() => setOpen(true)}
      >
        <Search className='mr-2 h-4 w-4' />
        Search documentation...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search documentation...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {searchCategories.map(category => (
            <CommandGroup key={category.group} heading={category.group}>
              {category.items.map(item => (
                <CommandItem
                  key={item.name}
                  onSelect={() => handleSelect(item.href)}
                  className='flex items-center justify-between'
                >
                  <span>{item.name}</span>
                  <ArrowRight className='h-4 w-4 opacity-50' />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          <CommandGroup heading='Quick Actions'>
            <CommandItem onSelect={() => setOpen(false)}>
              <span>Go to Page</span>
              <ArrowRight className='ml-auto h-4 w-4 opacity-50' />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

// Data table search input component
export const DataTableSearchInput = React.forwardRef(
  (
    {
      className,
      placeholder = 'Filter...',
      value,
      onChange,
      onClear,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative', className)}>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className='pl-8 pr-8'
          {...props}
        />
        {value && (
          <Button
            variant='ghost'
            size='sm'
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={onClear}
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Clear</span>
          </Button>
        )}
      </div>
    );
  }
);

DataTableSearchInput.displayName = 'DataTableSearchInput';
