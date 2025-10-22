// ...existing code...
import { ExternalLink } from 'lucide-react';
import React from 'react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Separator } from '~/components/ui/separator';
import { formatDate, formatInstructions } from '~/lib/utils';

import { useExercises } from './exercises-provider';

export const ExercisesDetailsDialog = ({ exercise, open, onOpenChange }) => {
  const {
    musclesMap = {},
    equipmentsMap = {},
    resolveRefLabel
  } = useExercises();
  if (!exercise) return null;

  const getDifficultyColor = difficulty => {
    const colors = {
      Beginner: 'bg-green-100 text-green-800',
      Intermediate: 'bg-yellow-100 text-yellow-800',
      Advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const renderListBadges = (
    items,
    map = {},
    variant = 'secondary',
    max = 6
  ) => {
    if (!items || !Array.isArray(items)) return null;
    const filtered = items.filter(Boolean);
    if (filtered.length === 0) return null;

    const fallbackLabel = item => {
      if (!item) return '—';
      if (typeof item === 'string')
        return item.length > 18 ? `${item.slice(0, 16)}...` : item;
      if (typeof item === 'object')
        return (
          item.name ||
          item.title ||
          item.label ||
          (item._id ? String(item._id) : JSON.stringify(item))
        );
      return String(item);
    };

    return (
      <div className='flex flex-wrap gap-2'>
        {filtered.slice(0, max).map((it, i) => {
          // if populated object with name/title -> use it
          if (
            it &&
            typeof it === 'object' &&
            (it.name || it.title || it.label)
          ) {
            return (
              <Badge key={i} variant={variant}>
                {it.name || it.title || it.label}
              </Badge>
            );
          }

          // if string id -> try maps, then resolveRefLabel, then fallback
          const id = typeof it === 'string' ? it : it && (it._id || it.$oid);
          const label =
            (typeof resolveRefLabel === 'function' &&
              resolveRefLabel(it, map)) ||
            (id ? map && map[id] : null) ||
            fallbackLabel(it);

          return (
            <Badge key={i} variant={variant}>
              {label}
            </Badge>
          );
        })}

        {filtered.length > max && (
          <Badge variant={variant}>+{filtered.length - max}</Badge>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {exercise.title}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Basic Info */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
                DIFFICULTY
              </h3>
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty || '—'}
              </Badge>
            </div>
            <div>
              <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
                TYPE
              </h3>
              <Badge variant='outline'>{exercise.type || '—'}</Badge>
            </div>
          </div>

          <Separator />
          {/* Tutorial Link */}
          {exercise.tutorial ? (
            <div>
              <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
                TUTORIAL
              </h3>
              {/\.(gif|jpe?g|png|webp)$/i.test(exercise.tutorial) ? (
                <div className='relative group'>
                  <img
                    src={exercise.tutorial}
                    alt='Exercise tutorial'
                    className='w-full max-w-md max-h-96 object-contain rounded-md cursor-pointer hover:opacity-80 transition-opacity'
                    onClick={() =>
                      typeof window !== 'undefined' &&
                      window.open(
                        exercise.tutorial,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  />
                  <ExternalLink className='absolute top-2 right-2 h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg' />
                </div>
              ) : (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    try {
                      const url = exercise.tutorial;
                      if (typeof window !== 'undefined')
                        window.open(url, '_blank', 'noopener,noreferrer');
                    } catch (e) {
                      /* ignore */
                    }
                  }}
                  className='w-fit'
                >
                  <ExternalLink className='mr-2 h-4 w-4' />
                  View Tutorial
                </Button>
              )}
            </div>
          ) : null}

          {/* Instructions */}
          {exercise.instructions && (
            <div>
              <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
                INSTRUCTIONS
              </h3>
              <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                {formatInstructions(exercise.instructions)}
              </p>
            </div>
          )}

          {/* Target Muscles */}
          <div>
            <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
              MUSCLES
            </h3>
            {renderListBadges(exercise.muscles, musclesMap, 'secondary', 8) || (
              <div className='text-sm text-muted-foreground'>None</div>
            )}
          </div>

          {/* Equipment */}
          <div>
            <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
              EQUIPMENT NEEDED
            </h3>
            {renderListBadges(
              exercise.equipments,
              equipmentsMap,
              'outline',
              8
            ) || <div className='text-sm text-muted-foreground'>None</div>}
          </div>

          <Separator />

          <div className='grid grid-cols-2 gap-4 text-sm text-muted-foreground'>
            <div>
              <span className='font-medium'>Created:</span>{' '}
              {formatDate(exercise.createdAt)}
            </div>
            {exercise.updatedAt &&
              exercise.updatedAt !== exercise.createdAt && (
                <div>
                  <span className='font-medium'>Updated:</span>{' '}
                  {formatDate(exercise.updatedAt)}
                </div>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
// ...existing code...
