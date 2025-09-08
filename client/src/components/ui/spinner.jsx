import * as React from 'react';

import { cn } from '~/lib/utils';

const Spinner = React.forwardRef(
  ({ className, size = 'default', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8'
    };

    return (
      <svg
        ref={ref}
        className={cn(
          'animate-spin text-muted-foreground',
          sizeClasses[size],
          className
        )}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        {...props}
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    );
  }
);
Spinner.displayName = 'Spinner';

export { Spinner };
