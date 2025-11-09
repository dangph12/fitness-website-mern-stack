import { Eye } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';

import { useMemberships } from './memberships-provider';

const MembershipsRowActions = ({ row }) => {
  const { handleViewDetails } = useMemberships();
  const payment = row.original;

  return (
    <Button
      variant='ghost'
      className='h-8 w-8 p-0'
      onClick={() => handleViewDetails(payment)}
      aria-label='View details'
    >
      <span className='sr-only'>View details</span>
      <Eye className='h-4 w-4' />
    </Button>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant='ghost' className='h-8 w-8 p-0'>
    //       <span className='sr-only'>Open menu</span>
    //       <Eye className='h-4 w-4' />
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align='end'>
    //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //     <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
    //       <Eye className='mr-2 h-4 w-4' />
    //       View Details
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};

export default MembershipsRowActions;
