import {
  Calendar,
  Eye,
  Mail,
  Search,
  Shield,
  Trash2,
  User,
  Users,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Spinner } from '~/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';
import {
  clearErrors,
  clearFilters,
  clearSelectedUser,
  deleteUser,
  fetchUserDetails,
  fetchUsers,
  setCurrentPage,
  setFilters,
  setLimit
} from '~/store/features/users-slice';

const Page = () => {
  const dispatch = useDispatch();
  const {
    users,
    selectedUser,
    loading,
    error,
    totalPages,
    totalUsers,
    currentPage,
    limit,
    filters,
    deleteLoading,
    deleteError,
    userDetailsLoading,
    userDetailsError
  } = useSelector(state => state.users);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchInput, setSearchInput] = useState(filters.name || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || '');
  const [genderFilter, setGenderFilter] = useState(filters.gender || '');

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit,
        name: filters.name,
        role: filters.role,
        gender: filters.gender
      })
    );
  }, [dispatch, currentPage, limit, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (userDetailsError) {
      toast.error(userDetailsError);
      dispatch(clearErrors());
    }
  }, [error, deleteError, userDetailsError, dispatch]);

  const handleSearch = () => {
    dispatch(
      setFilters({
        name: searchInput,
        role: roleFilter,
        gender: genderFilter
      })
    );
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewUser = userId => {
    dispatch(fetchUserDetails(userId));
    setShowUserModal(true);
  };

  const handleDeleteUser = user => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete._id)).unwrap();
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        // Error handled by useEffect
      }
    }
  };

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const handleLimitChange = newLimit => {
    dispatch(setLimit(parseInt(newLimit)));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setRoleFilter('');
    setGenderFilter('');
    dispatch(clearFilters());
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeStyle = role => {
    return role === 'admin'
      ? 'bg-red-100 text-red-800 border border-red-200'
      : 'bg-blue-100 text-blue-800 border border-blue-200';
  };

  const getStatusBadgeStyle = isActive => {
    return isActive
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            User Management
          </h1>
          <p className='text-gray-600'>Manage and monitor user accounts</p>
        </div>

        <Card className='p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            <div className='md:col-span-2 xl:col-span-2'>
              <label className='block text-sm font-medium mb-2'>
                Search by name
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Enter name...'
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className='pl-10'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Role</label>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className='w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-background'
              >
                <option value=''>All Roles</option>
                <option value='admin'>Admin</option>
                <option value='user'>User</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Gender</label>
              <select
                value={genderFilter}
                onChange={e => setGenderFilter(e.target.value)}
                className='w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-background'
              >
                <option value=''>All Genders</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
              </select>
            </div>

            <div className='flex flex-col justify-end'>
              <div className='flex gap-2'>
                <Button onClick={handleSearch} className='flex-1'>
                  Search
                </Button>
                <Button
                  variant='outline'
                  onClick={handleClearFilters}
                  className='flex-1'
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className='mb-4 flex justify-between items-center'>
          <p className='text-sm text-gray-600'>
            Showing {users.length} of {totalUsers} users
          </p>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Show:</span>
            <select
              value={limit}
              onChange={e => handleLimitChange(e.target.value)}
              className='border border-gray-300 rounded-md px-2 py-1 text-sm'
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className='text-sm text-gray-600'>per page</span>
          </div>
        </div>

        <Card className='overflow-hidden'>
          {loading ? (
            <div className='flex justify-center items-center p-8'>
              <Spinner className='h-8 w-8' />
              <span className='ml-2'>Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className='text-center p-8'>
              <Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-500'>No users found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-8 w-8'>
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className='h-8 w-8 rounded-full'
                              />
                            ) : (
                              <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center'>
                                <User className='h-4 w-4 text-gray-400' />
                              </div>
                            )}
                          </Avatar>
                          <span className='font-medium'>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className='text-gray-600'>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className='capitalize'>
                        {user.gender || 'Not specified'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(user.isActive)}`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className='text-gray-600'>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleViewUser(user._id)}
                            className='h-8 w-8 p-0'
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteUser(user)}
                            className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {totalPages > 1 && (
          <div className='mt-6 flex justify-center'>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handlePageChange(pageNum)}
                    className='min-w-[40px]'
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {showUserModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-bold'>User Details</h2>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setShowUserModal(false);
                    dispatch(clearSelectedUser());
                  }}
                  className='h-8 w-8 p-0'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>

              {userDetailsLoading ? (
                <div className='flex justify-center items-center p-8'>
                  <Spinner className='h-6 w-6' />
                  <span className='ml-2'>Loading...</span>
                </div>
              ) : selectedUser ? (
                <div className='space-y-4'>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-16 w-16'>
                      {selectedUser.avatar ? (
                        <img
                          src={selectedUser.avatar}
                          alt={selectedUser.name}
                          className='h-16 w-16 rounded-full'
                        />
                      ) : (
                        <div className='h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center'>
                          <User className='h-8 w-8 text-gray-400' />
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <h3 className='font-semibold text-lg'>
                        {selectedUser.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(selectedUser.role)}`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-gray-400' />
                      <span className='text-sm'>{selectedUser.email}</span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4 text-gray-400' />
                      <span className='text-sm capitalize'>
                        {selectedUser.gender || 'Not specified'}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Shield className='h-4 w-4 text-gray-400' />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(selectedUser.isActive)}`}
                      >
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-gray-400' />
                      <span className='text-sm'>
                        Joined {formatDate(selectedUser.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className='text-center text-gray-500'>
                  Failed to load user details
                </p>
              )}
            </div>
          </div>
        )}

        {showDeleteModal && userToDelete && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-sm'>
              <h2 className='text-xl font-bold mb-4'>Confirm Delete</h2>
              <p className='text-gray-600 mb-6'>
                Are you sure you want to delete user "{userToDelete.name}"? This
                action cannot be undone.
              </p>
              <div className='flex gap-3 justify-end'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <Spinner className='h-4 w-4 mr-2' />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
