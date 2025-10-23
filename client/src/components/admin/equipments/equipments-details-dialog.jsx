'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Separator } from '~/components/ui/separator';
import { formatDateTime } from '~/lib/utils';

export function EquipmentsDetailsDialog({ equipment, open, onOpenChange }) {
  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            Equipment Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Equipment Image */}
          {equipment.image && (
            <div className='flex justify-center'>
              <img
                src={equipment.image}
                alt={equipment.title}
                className='w-full max-w-md max-h-96 object-contain rounded-lg border'
              />
            </div>
          )}

          <Separator />

          {/* Equipment Info */}
          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
                EQUIPMENT NAME
              </h3>
              <p className='text-lg font-semibold'>{equipment.title}</p>
            </div>

            <Separator />

            {/* Metadata */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
                  CREATED AT
                </h3>
                <p className='text-sm'>{formatDateTime(equipment.createdAt)}</p>
              </div>

              <div>
                <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
                  LAST UPDATED
                </h3>
                <p className='text-sm'>{formatDateTime(equipment.updatedAt)}</p>
              </div>
            </div>

            {/* ID (Optional - for debugging) */}
            <div>
              <h3 className='font-semibold text-sm text-muted-foreground mb-2'>
                ID
              </h3>
              <p className='text-xs font-mono text-muted-foreground'>
                {equipment._id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
