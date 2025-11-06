import { DataTableColumnHeader } from '~/components/admin/data-table-column-header';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { formatDate } from '~/lib/utils';

import MembershipsRowActions from './memberships-row-actions';
const getStatusBadge = status => {
  // Gentle style for cancelled
  if (status === 'cancelled') {
    return (
      <Badge
        variant='outline'
        className='text-red-700 bg-red-50 border-red-200'
      >
        Cancelled
      </Badge>
    );
  }

  const variants = {
    completed: 'default',
    pending: 'secondary'
  };

  const labels = {
    completed: 'Completed',
    pending: 'Pending'
  };

  return (
    <Badge variant={variants[status] || 'secondary'}>
      {labels[status] || status}
    </Badge>
  );
};

const getMembershipBadge = membership => {
  const variants = {
    vip: 'default',
    premium: 'secondary'
  };

  const labels = {
    vip: 'VIP',
    premium: 'Premium'
  };

  return (
    <Badge variant={variants[membership] || 'secondary'}>
      {labels[membership] || membership}
    </Badge>
  );
};

export const membershipsColumns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'orderCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Order Code' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>#{row.getValue('orderCode')}</div>
    )
  },
  {
    accessorKey: 'user.name',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{user?.name || 'N/A'}</span>
          <span className='text-xs text-muted-foreground'>
            {user?.email || ''}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'targetMembership',
    header: 'Target Membership',
    cell: ({ row }) => getMembershipBadge(row.getValue('targetMembership'))
  },
  {
    accessorKey: 'previousMembership',
    header: 'Previous',
    cell: ({ row }) => {
      const prev = row.getValue('previousMembership');
      return (
        <span className='text-sm text-muted-foreground capitalize'>
          {prev || 'N/A'}
        </span>
      );
    }
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('amount');
      return <div className='font-medium'>${amount.toLocaleString()}</div>;
    }
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.getValue('status'))
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => (
      <div className='text-sm'>{formatDate(row.getValue('createdAt'))}</div>
    )
  },
  {
    accessorKey: 'completedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Completed At' />
    ),
    cell: ({ row }) => {
      const completedAt = row.getValue('completedAt');
      return (
        <div className='text-sm'>
          {completedAt ? formatDate(completedAt) : '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'cancellationReason',
    header: 'Cancellation Reason',
    cell: ({ row }) => {
      const reason = row.getValue('cancellationReason');
      const status = row.original.status;

      if (status !== 'cancelled' || !reason) {
        return <span className='text-sm text-muted-foreground'>-</span>;
      }

      return (
        <div className='max-w-[200px]'>
          <p className='text-sm truncate' title={reason}>
            {reason}
          </p>
        </div>
      );
    },
    enableSorting: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <MembershipsRowActions row={row} />
  }
];
