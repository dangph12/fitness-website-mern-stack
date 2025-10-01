import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className='flex items-center justify-between p-2 border-2 border-gray-300 rounded-lg'>
      <div className='flex items-center space-x-4'>
        <div className='w-16 h-16 rounded-full'>
          <img src={user.avatar} className='w-16 h-16 rounded-full border-2' />
        </div>
        <div>
          <p className='text-sm text-gray-700'>Người tạo bữa ăn:</p>
          <p className='font-semibold text-pink-600'>{user.name}</p>
          <p className='text-sm text-gray-500'>{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
