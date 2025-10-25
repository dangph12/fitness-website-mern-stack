'use client';

import { Filter, Loader2, RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover';
import { clearFilters, setFilters } from '~/store/features/users-slice';

export function UsersFilters() {
  const dispatch = useDispatch();
  const { filters, loading } = useSelector(state => state.users);

  // Pending filters state (before applying)
  const [pendingFilters, setPendingFilters] = useState({
    search: filters.search || '',
    role: filters.role || [],
    gender: filters.gender || []
  });

  // Track if there are unsaved changes
  const hasUnsavedChanges =
    pendingFilters.search !== filters.search ||
    JSON.stringify(pendingFilters.role) !== JSON.stringify(filters.role) ||
    JSON.stringify(pendingFilters.gender) !== JSON.stringify(filters.gender);

  // Sync pending filters with Redux when filters are cleared externally
  useEffect(() => {
    if (!filters.search && !filters.role?.length && !filters.gender?.length) {
      setPendingFilters({
        search: '',
        role: [],
        gender: []
      });
    }
  }, [filters.search, filters.role, filters.gender]);

  const handleSearchChange = value => {
    setPendingFilters(prev => ({
      ...prev,
      search: value
    }));
  };

  const handleRoleChange = (role, checked) => {
    setPendingFilters(prev => {
      const currentRoles = Array.isArray(prev.role) ? prev.role : [];
      const newRoles = checked
        ? [...currentRoles, role]
        : currentRoles.filter(r => r !== role);
      return { ...prev, role: newRoles };
    });
  };

  const handleGenderChange = (gender, checked) => {
    setPendingFilters(prev => {
      const currentGenders = Array.isArray(prev.gender) ? prev.gender : [];
      const newGenders = checked
        ? [...currentGenders, gender]
        : currentGenders.filter(g => g !== gender);
      return { ...prev, gender: newGenders };
    });
  };

  const handleApplyFilters = () => {
    console.log('🔍 Applying filters:', pendingFilters);

    // Dispatch to Redux
    dispatch(
      setFilters({
        search: pendingFilters.search,
        role: pendingFilters.role,
        gender: pendingFilters.gender
      })
    );
  };

  const handleResetFilters = () => {
    console.log('🔄 Resetting filters');

    setPendingFilters({
      search: '',
      role: [],
      gender: []
    });

    dispatch(clearFilters());
  };

  const handleClearSearch = () => {
    setPendingFilters(prev => ({
      ...prev,
      search: ''
    }));
  };

  const handleRemoveRoleFilter = role => {
    handleRoleChange(role, false);

    // Auto-apply if removing active filter
    if (filters.role?.includes(role)) {
      setTimeout(() => {
        dispatch(
          setFilters({
            ...filters,
            role: filters.role.filter(r => r !== role)
          })
        );
      }, 0);
    }
  };

  const handleRemoveGenderFilter = gender => {
    handleGenderChange(gender, false);

    // Auto-apply if removing active filter
    if (filters.gender?.includes(gender)) {
      setTimeout(() => {
        dispatch(
          setFilters({
            ...filters,
            gender: filters.gender.filter(g => g !== gender)
          })
        );
      }, 0);
    }
  };

  const hasActiveFilters =
    filters.search ||
    (Array.isArray(filters.role) && filters.role.length > 0) ||
    (Array.isArray(filters.gender) && filters.gender.length > 0);

  const roleCount = Array.isArray(pendingFilters.role)
    ? pendingFilters.role.length
    : 0;
  const genderCount = Array.isArray(pendingFilters.gender)
    ? pendingFilters.gender.length
    : 0;

  return (
    <div className='space-y-4 mb-6'>
      <div className='flex items-center gap-4'>
        {/* Search Input */}
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          {pendingFilters.search && (
            <X
              className='absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground'
              onClick={handleClearSearch}
            />
          )}
          <Input
            placeholder='Search users by name or email...'
            value={pendingFilters.search}
            onChange={e => handleSearchChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleApplyFilters();
              }
            }}
            className='pl-10 pr-10'
          />
        </div>

        {/* Role Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='border-dashed'>
              <Filter className='mr-2 h-4 w-4' />
              Role
              {roleCount > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {roleCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-48' align='start'>
            <div className='space-y-2'>
              <h4 className='font-medium leading-none'>Filter by Role</h4>
              <div className='space-y-2'>
                {['admin', 'user'].map(role => (
                  <div key={role} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`role-${role}`}
                      checked={
                        Array.isArray(pendingFilters.role) &&
                        pendingFilters.role.includes(role)
                      }
                      onCheckedChange={checked =>
                        handleRoleChange(role, checked)
                      }
                    />
                    <label
                      htmlFor={`role-${role}`}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer'
                    >
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Gender Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='border-dashed'>
              <Filter className='mr-2 h-4 w-4' />
              Gender
              {genderCount > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {genderCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-48' align='start'>
            <div className='space-y-2'>
              <h4 className='font-medium leading-none'>Filter by Gender</h4>
              <div className='space-y-2'>
                {['male', 'female'].map(gender => (
                  <div key={gender} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`gender-${gender}`}
                      checked={
                        Array.isArray(pendingFilters.gender) &&
                        pendingFilters.gender.includes(gender)
                      }
                      onCheckedChange={checked =>
                        handleGenderChange(gender, checked)
                      }
                    />
                    <label
                      htmlFor={`gender-${gender}`}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer'
                    >
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Apply Button */}
        <Button
          onClick={handleApplyFilters}
          disabled={loading || !hasUnsavedChanges}
          className='relative'
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Applying...
            </>
          ) : (
            <>
              <Search className='mr-2 h-4 w-4' />
              Apply
              {hasUnsavedChanges && (
                <span className='absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full' />
              )}
            </>
          )}
        </Button>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant='ghost'
            onClick={handleResetFilters}
            disabled={loading}
          >
            <RotateCcw className='mr-2 h-4 w-4' />
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2'>
          {filters.search && (
            <Badge variant='secondary' className='flex items-center gap-1'>
              Search: "{filters.search}"
              <X
                className='h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded'
                onClick={() => {
                  setPendingFilters(prev => ({ ...prev, search: '' }));
                  dispatch(setFilters({ ...filters, search: '' }));
                }}
              />
            </Badge>
          )}
          {Array.isArray(filters.role) &&
            filters.role.map(role => (
              <Badge
                key={role}
                variant='secondary'
                className='flex items-center gap-1'
              >
                Role: {role}
                <X
                  className='h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded'
                  onClick={() => handleRemoveRoleFilter(role)}
                />
              </Badge>
            ))}
          {Array.isArray(filters.gender) &&
            filters.gender.map(gender => (
              <Badge
                key={gender}
                variant='secondary'
                className='flex items-center gap-1'
              >
                Gender: {gender}
                <X
                  className='h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded'
                  onClick={() => handleRemoveGenderFilter(gender)}
                />
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
