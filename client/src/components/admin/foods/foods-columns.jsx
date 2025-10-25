import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { DataTableColumnHeader } from '../data-table-column-header';
import { FoodRowActions } from './foods-row-actions';

export const FoodsColumns = [
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
      const food = row.original;
      return (
        <Avatar className='h-20 w-20'>
          <AvatarImage src={food.image} alt={food.title} />
          <AvatarFallback>{food.title?.charAt(0)}</AvatarFallback>
        </Avatar>
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
      const title = row.getValue('title');
      return <div className='font-medium'>{title}</div>;
    }
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => {
      const category = row.getValue('category');
      return (
        <Badge variant='outline' className='capitalize'>
          {category}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'calories',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Calories' />
    ),
    cell: ({ row }) => {
      const calories = row.getValue('calories');
      return <div>{calories}</div>;
    }
  },
  {
    accessorKey: 'protein',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Protein (g)' />
    ),
    cell: ({ row }) => {
      const protein = row.getValue('protein');
      return <div>{protein}</div>;
    }
  },
  {
    accessorKey: 'fat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fat (g)' />
    ),
    cell: ({ row }) => {
      const fat = row.getValue('fat');
      return <div>{fat}</div>;
    }
  },
  {
    accessorKey: 'carbohydrate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Carbs (g)' />
    ),
    cell: ({ row }) => {
      const carbohydrate = row.getValue('carbohydrate');
      return <div>{carbohydrate}</div>;
    }
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
    cell: ({ row }) => {
      const unit = row.getValue('unit');
      return <Badge variant='secondary'>{unit}g</Badge>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <FoodRowActions row={row} />
  }
];
