import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';

import { DataTableColumnHeader } from '../data-table-column-header';
import { WorkoutsRowActions } from './workouts-row-actions';

export const useWorkoutsColumns = () => {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const image = row.getValue('image');
        const title = row.getValue('title');
        return (
          <div className='w-20 h-20 rounded-md overflow-hidden bg-muted'>
            {image ? (
              <img
                src={image}
                alt={title}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-muted-foreground text-xs'>
                No image
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{row.getValue('title')}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'exercises',
      header: 'Exercises',
      cell: ({ row }) => {
        const exercises = row.getValue('exercises') || [];
        const exerciseCount = exercises.length;

        // Get first 2 exercise titles
        const firstTwo = exercises.slice(0, 2);
        const remaining = exerciseCount - 2;

        return (
          <div className='flex flex-col gap-1 max-w-xs'>
            {firstTwo.map((ex, idx) => (
              <Badge
                variant='secondary'
                key={idx}
                className='text-sm truncate w-fit'
              >
                {ex?.exercise?.title || 'Unknown Exercise'}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant='secondary' className='w-fit'>
                +{remaining} more
              </Badge>
            )}
            {exerciseCount === 0 && (
              <span className='text-sm text-muted-foreground'>
                No exercises
              </span>
            )}
          </div>
        );
      },
      enableSorting: false
    },
    {
      accessorKey: 'user',
      header: 'Creator',
      cell: ({ row }) => {
        const user = row.getValue('user');
        return (
          <div className='flex items-center'>
            <span className='text-sm'>
              {user?.name || user?.email || 'Unknown'}
            </span>
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
          <div className='flex items-center'>
            {isPublic ? (
              <Badge className='bg-green-100 text-green-800'>Public</Badge>
            ) : (
              <Badge variant='outline'>Private</Badge>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === '') return true;
        return row.getValue(id) === (value === 'true');
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className='flex items-center'>
            <span className='text-sm text-muted-foreground'>
              {date.toLocaleDateString()}
            </span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => <WorkoutsRowActions row={row} />,
      enableSorting: false,
      enableHiding: false
    }
  ];
};
