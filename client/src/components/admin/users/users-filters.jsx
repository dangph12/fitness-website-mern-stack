'use client';

import {
  Bug,
  Filter,
  Loader2,
  Mail,
  Search,
  TestTube,
  User,
  X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
import {
  clearFilters,
  fetchUsersExact,
  setFilters
} from '~/store/features/users-slice';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function UsersFilters() {
  const dispatch = useDispatch();
  const { filters, loading, users, totalUsers } = useSelector(
    state => state.users
  );

  // Local state for search input
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced search value
  const debouncedSearch = useDebounce(searchInput, 500);

  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilters({ search: debouncedSearch }));
    }
  }, [debouncedSearch, filters.search, dispatch]);

  // Sync local search state with Redux when filters are cleared
  useEffect(() => {
    if (filters.search !== searchInput) {
      setSearchInput(filters.search);
    }
  }, [filters.search]);

  const handleSearchChange = value => {
    setSearchInput(value);
  };

  const handleRoleChange = (role, checked) => {
    const currentRoles = Array.isArray(filters.role) ? filters.role : [];
    const newRoles = checked
      ? [...currentRoles, role]
      : currentRoles.filter(r => r !== role);
    dispatch(setFilters({ role: newRoles }));
  };

  const handleGenderChange = (gender, checked) => {
    const currentGenders = Array.isArray(filters.gender) ? filters.gender : [];
    const newGenders = checked
      ? [...currentGenders, gender]
      : currentGenders.filter(g => g !== gender);
    dispatch(setFilters({ gender: newGenders }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    dispatch(clearFilters());
  };

  // Test function giống như Postman request
  const handleTestPostmanStyle = () => {
    console.log('🧪 Testing Postman style request...');

    // Test với exact parameters như trong Postman
    dispatch(
      fetchUsersExact({
        name: 'Nguyễn Đình Anh Đức',
        email: '',
        role: 'user',
        gender: ''
      })
    );
  };

  // Test search by NAME only
  const handleTestSearchByName = () => {
    if (!searchInput.trim()) {
      console.log('⚠️ No search term entered');
      return;
    }

    console.log('🧪 Testing search by NAME only:', searchInput);

    dispatch(
      fetchUsersExact({
        name: searchInput.trim(),
        email: '', // Empty email
        role: '',
        gender: ''
      })
    );
  };

  // Test search by EMAIL only
  const handleTestSearchByEmail = () => {
    if (!searchInput.trim()) {
      console.log('⚠️ No search term entered');
      return;
    }

    console.log('🧪 Testing search by EMAIL only:', searchInput);

    dispatch(
      fetchUsersExact({
        name: '', // Empty name
        email: searchInput.trim(),
        role: '',
        gender: ''
      })
    );
  };

  // Test với no filters để get all users
  const handleTestGetAll = () => {
    console.log('🧪 Testing get all users...');

    dispatch(
      fetchUsersExact({
        name: '',
        email: '',
        role: '',
        gender: ''
      })
    );
  };

  const hasActiveFilters =
    filters.search ||
    (Array.isArray(filters.role) && filters.role.length > 0) ||
    (Array.isArray(filters.gender) && filters.gender.length > 0);

  const roleCount = Array.isArray(filters.role) ? filters.role.length : 0;
  const genderCount = Array.isArray(filters.gender) ? filters.gender.length : 0;

  return (
    <div className='space-y-4 mb-6'>
      {/* Debug Panel */}
      {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="font-medium">Debug:</span>
          <span>Found: {users.length}/{totalUsers} users</span>
          <span>Search: "{filters.search}"</span>
          
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleTestPostmanStyle} 
              disabled={loading}
            >
              <TestTube className="h-3 w-3 mr-1" />
              Postman Style
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleTestGetAll} 
              disabled={loading}
            >
              <Loader2 className="h-3 w-3 mr-1" />
              Get All
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleTestSearchByName} 
              disabled={loading || !searchInput.trim()}
            >
              <User className="h-3 w-3 mr-1" />
              By Name
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleTestSearchByEmail} 
              disabled={loading || !searchInput.trim()}
            >
              <Mail className="h-3 w-3 mr-1" />
              By Email
            </Button>
          </div>
        </div>
      </div> */}

      <div className='flex items-center space-x-4'>
        {/* Search Input */}
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          {loading && searchInput && (
            <Loader2 className='absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground' />
          )}
          <Input
            placeholder='Search users by name...'
            value={searchInput}
            onChange={e => handleSearchChange(e.target.value)}
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
                        Array.isArray(filters.role) &&
                        filters.role.includes(role)
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
                        Array.isArray(filters.gender) &&
                        filters.gender.includes(gender)
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

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant='ghost' onClick={handleClearFilters}>
            <X className='mr-2 h-4 w-4' />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2'>
          {filters.search && (
            <Badge variant='secondary' className='flex items-center gap-1'>
              Search: {filters.search}
              <X
                className='h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded'
                onClick={() => handleSearchChange('')}
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
                  onClick={() => handleRoleChange(role, false)}
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
                  onClick={() => handleGenderChange(gender, false)}
                />
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
