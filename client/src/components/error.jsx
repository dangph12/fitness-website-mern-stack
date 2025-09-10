import React from 'react';

import { cn } from '~/lib/utils';
const ErrorComponent = ({ message, className }) => {
  return (
    <div className={cn('text-red-500 text-center', className)}>
      <h1 className='text-2xl font-bold'>Error</h1>
      <p>{message || 'An unexpected error occurred.'}</p>
    </div>
  );
};
export default ErrorComponent;
