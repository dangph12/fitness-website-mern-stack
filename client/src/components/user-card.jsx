import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className='flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all'>
      <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300'>
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className='w-full h-full object-cover'
        />
      </div>

      <div className='ml-4'>
        <p className='text-sm text-gray-500'>Meal Creator</p>
        <p className='text-lg font-semibold text-gray-800'>{user.name}</p>
        <p className='text-sm text-gray-600'>{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
