import { format } from 'date-fns';

import { DataTableColumnHeader } from '~/components/admin/data-table-column-header';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';

import { MealsRowActions } from './meals-row-actions';

export const mealsColumns = [
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
    accessorKey: 'mealType',
    header: 'Meal Type',
    cell: ({ row }) => {
      const mealType = row.getValue('mealType');
      const colorMap = {
        Breakfast: 'bg-yellow-100 text-yellow-800',
        Lunch: 'bg-green-100 text-green-800',
        Dinner: 'bg-blue-100 text-blue-800',
        Snack: 'bg-purple-100 text-purple-800'
      };
      return (
        <Badge variant='secondary' className={colorMap[mealType]}>
          {mealType}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'foods',
    header: 'Foods',
    cell: ({ row }) => {
      const foods = row.getValue('foods') || [];
      const displayFoods = foods.slice(0, 2);
      const remaining = foods.length - 2;

      return (
        <div className='flex flex-col gap-1 max-w-[200px]'>
          {displayFoods.map((foodItem, index) => {
            // Extract food data from nested structure
            const food = foodItem.food || foodItem;
            const foodTitle = food?.title || 'Unknown';

            return (
              <Badge
                variant='outline'
                key={food?._id || index}
                className='text-xs w-fit'
              >
                • {foodTitle}
              </Badge>
            );
          })}
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
    cell: ({ row }) => <MealsRowActions row={row} />
  }
];
