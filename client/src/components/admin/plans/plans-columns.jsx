import { format } from 'date-fns';

import { DataTableColumnHeader } from '~/components/admin/data-table-column-header';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';

import { PlansRowActions } from './plans-row-actions';

export const plansColumns = [
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
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image');
      return imageUrl ? (
        <img
          src={imageUrl}
          alt={row.getValue('title')}
          className='h-30 w-30 rounded object-cover'
        />
      ) : (
        <div className='h-10 w-10 rounded bg-muted flex items-center justify-center'>
          <span className='text-xs text-muted-foreground'>No img</span>
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('title')}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description');
      return (
        <div className='max-w-[300px] truncate'>
          {description || 'No description'}
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'workouts',
    header: 'Workouts',
    cell: ({ row }) => {
      const workouts = row.getValue('workouts') || [];
      const displayWorkouts = workouts.slice(0, 2);
      const remaining = workouts.length - 2;

      return (
        <div className='flex flex-col gap-1 max-w-[200px]'>
          {displayWorkouts.map((workout, index) => (
            <Badge
              variant='secondary'
              key={workout._id || index}
              className='text-xs w-fit'
            >
              • {workout.title}
            </Badge>
          ))}
          {remaining > 0 && (
            <Badge variant='outline' className='w-fit text-xs'>
              +{remaining} more
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'isPublic',
    header: 'Status',
    cell: ({ row }) => {
      const isPublic = row.getValue('isPublic');
      return (
        <Badge variant={isPublic ? 'default' : 'secondary'}>
          {isPublic ? 'Public' : 'Private'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'user',
    header: 'Created By',
    cell: ({ row }) => {
      const user = row.getValue('user');
      return (
        <div className='flex items-center gap-2'>{user?.name || 'Unknown'}</div>
      );
    },
    enableSorting: false
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt');
      return date ? format(new Date(date), 'PPp') : 'N/A';
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <PlansRowActions row={row} />
  }
];
