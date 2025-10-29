import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

import { DataTableColumnHeader } from '~/components/admin/data-table-column-header';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { getImageUrls, isImageUrl } from '~/lib/utils';

import { useExercises } from './exercises-provider';
import { ExercisesRowActions } from './exercises-row-actions';

const AnimatedTutorialImage = ({ src, alt }) => {
  const { previewUrl, animatedUrl } = getImageUrls(src);
  const [currentSrc, setCurrentSrc] = useState(previewUrl);

  const handleMouseEnter = e => {
    e.currentTarget.src = animatedUrl;
    setCurrentSrc(animatedUrl);
  };

  const handleMouseLeave = e => {
    e.currentTarget.src = previewUrl;
    setCurrentSrc(previewUrl);
  };

  return (
    <div className='relative group'>
      <img
        src={currentSrc}
        alt={alt}
        className='h-20 w-auto rounded-md object-cover cursor-pointer hover:opacity-90 transition-opacity'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() =>
          typeof window !== 'undefined' &&
          window.open(animatedUrl, '_blank', 'noopener,noreferrer')
        }
      />
      <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-md pointer-events-none' />
      <ExternalLink className='absolute top-1 right-1 h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg' />
    </div>
  );
};

export const useExercisesColumns = () => {
  const {
    musclesMap = {},
    equipmentsMap = {},
    resolveRefLabel
  } = useExercises();

  const labelOf = (item, map) => {
    if (!item) return null;
    if (typeof item === 'string') {
      return map[item] || (item.length > 10 ? `${item.slice(0, 8)}...` : item);
    }
    if (typeof item === 'object') {
      return (
        item.name ||
        item.title ||
        item.label ||
        (item._id ? map[item._id] || item._id : JSON.stringify(item))
      );
    }
    return String(item);
  };

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
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Exercise Name' />
      ),
      cell: ({ row }) => {
        const exercise = row.original;
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{exercise.title}</span>
            {exercise.type && (
              <span className='text-sm text-muted-foreground'>
                {exercise.type}
              </span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'difficulty',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Difficulty' />
      ),
      cell: ({ row }) => {
        const difficulty = row.getValue('difficulty');
        const difficultyColors = {
          Beginner: 'bg-green-100 text-green-800',
          Intermediate: 'bg-yellow-100 text-yellow-800',
          Advanced: 'bg-red-100 text-red-800'
        };

        return (
          <Badge
            className={
              difficultyColors[difficulty] || 'bg-gray-100 text-gray-800'
            }
          >
            {difficulty}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Type' />
      ),
      cell: ({ row }) => {
        const type = row.getValue('type');
        return <Badge variant='outline'>{type}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: 'tutorial',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tutorial' />
      ),
      cell: ({ row }) => {
        const url = row.getValue('tutorial');
        if (!url) return '—';

        if (isImageUrl(url)) {
          return <AnimatedTutorialImage src={url} alt='Exercise tutorial' />;
        }

        return (
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              typeof window !== 'undefined' &&
              window.open(url, '_blank', 'noopener,noreferrer')
            }
          >
            <ExternalLink className='mr-2 h-4 w-4' />
            View
          </Button>
        );
      },
      enableSorting: false
    },
    // ... rest of columns remain the same
    {
      accessorKey: 'muscles',
      header: 'Muscles',
      cell: ({ row }) => {
        const muscles = row.getValue('muscles');
        if (!muscles || !Array.isArray(muscles) || muscles.length === 0)
          return '—';

        const normalizeId = item => {
          if (!item) return null;
          if (typeof item === 'string') return item;
          if (typeof item === 'object') {
            if (item._id) return String(item._id);
            if (item.$oid) return String(item.$oid);
            return null;
          }
          return String(item);
        };

        const fallbackLabel = item => {
          if (!item) return '—';
          if (typeof item === 'string')
            return item.length > 12 ? `${item.slice(0, 10)}...` : item;
          if (typeof item === 'object')
            return (
              item.name ||
              item.title ||
              item.label ||
              (item._id ? String(item._id) : JSON.stringify(item))
            );
          return String(item);
        };

        const items = muscles.filter(Boolean).slice(0, 4);
        return (
          <div className='flex flex-wrap gap-1'>
            {items.map((muscle, index) => {
              if (
                muscle &&
                typeof muscle === 'object' &&
                (muscle.name || muscle.title || muscle.label)
              ) {
                return (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {muscle.name || muscle.title || muscle.label}
                  </Badge>
                );
              }

              const id = normalizeId(muscle);
              const label =
                (typeof resolveRefLabel === 'function' &&
                  resolveRefLabel(muscle, musclesMap)) ||
                (id ? musclesMap && musclesMap[id] : null) ||
                fallbackLabel(muscle);

              return (
                <Badge key={index} variant='secondary' className='text-xs'>
                  {label}
                </Badge>
              );
            })}
            {muscles.length > 3 && (
              <Badge variant='secondary' className='text-xs'>
                +{muscles.length - 3}
              </Badge>
            )}
          </div>
        );
      },
      enableSorting: false
    },
    {
      accessorKey: 'equipments',
      header: 'Equipment',
      cell: ({ row }) => {
        const equipments = row.getValue('equipments');
        if (
          !equipments ||
          !Array.isArray(equipments) ||
          equipments.length === 0
        )
          return 'None';

        const normalizeId = item => {
          if (!item) return null;
          if (typeof item === 'string') return item;
          if (typeof item === 'object') {
            if (item._id) return String(item._id);
            if (item.$oid) return String(item.$oid);
            return null;
          }
          return String(item);
        };

        const fallbackLabel = item => {
          if (!item) return '—';
          if (typeof item === 'string')
            return item.length > 12 ? `${item.slice(0, 10)}...` : item;
          if (typeof item === 'object')
            return (
              item.name ||
              item.title ||
              item.label ||
              (item._id ? String(item._id) : JSON.stringify(item))
            );
          return String(item);
        };

        const items = equipments.filter(Boolean).slice(0, 2);
        return (
          <div className='flex flex-wrap gap-1'>
            {items.map((equipment, index) => {
              if (
                equipment &&
                typeof equipment === 'object' &&
                (equipment.name || equipment.title || equipment.label)
              ) {
                return (
                  <Badge key={index} variant='outline' className='text-xs'>
                    {equipment.name || equipment.title || equipment.label}
                  </Badge>
                );
              }

              const id = normalizeId(equipment);
              const label =
                (typeof resolveRefLabel === 'function' &&
                  resolveRefLabel(equipment, equipmentsMap)) ||
                (id ? equipmentsMap && equipmentsMap[id] : null) ||
                fallbackLabel(equipment);

              return (
                <Badge key={index} variant='outline' className='text-xs'>
                  {label}
                </Badge>
              );
            })}
            {equipments.length > 2 && (
              <Badge variant='outline' className='text-xs'>
                +{equipments.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
      enableSorting: false
    },
    {
      id: 'actions',
      cell: ({ row }) => <ExercisesRowActions exercise={row.original} />,
      enableSorting: false,
      enableHiding: false
    }
  ];
};
