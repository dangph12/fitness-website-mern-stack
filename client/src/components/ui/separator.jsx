import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as React from 'react';

import { cn } from '../../lib/utils';

const Separator = React.forwardRef(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border transition-all duration-200',
        orientation === 'horizontal'
          ? 'h-[1px] w-full'
          : 'h-full w-[1px] min-h-4',
        // Responsive classes for collapsed sidebar
        'group-data-[collapsible=icon]:opacity-50',
        orientation === 'vertical' && 'group-data-[collapsible=icon]:w-0',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';

export { Separator };
