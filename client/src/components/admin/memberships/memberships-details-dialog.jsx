import React from 'react';

import { Badge } from '~/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Separator } from '~/components/ui/separator';
import { formatDate } from '~/lib/utils';

import { useMemberships } from './memberships-provider';

const MembershipsDetailsDialog = () => {
  const { selectedPayment, isDetailsOpen, handleCloseDetails } =
    useMemberships();

  if (!selectedPayment) return null;

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

  return (
    <Dialog open={isDetailsOpen} onOpenChange={handleCloseDetails}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Order Information */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-lg'>Order Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Order Code</p>
                <p className='font-medium'>#{selectedPayment.orderCode}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Status</p>
                <div className='mt-1'>
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Amount</p>
                <p className='font-medium text-lg'>
                  ${selectedPayment.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Payment Link ID</p>
                <p className='font-mono text-xs'>
                  {selectedPayment.paymentLinkId || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-lg'>User Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Name</p>
                <p className='font-medium'>
                  {selectedPayment.user?.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p className='font-medium'>
                  {selectedPayment.user?.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Current Membership
                </p>
                <Badge className='mt-1 capitalize'>
                  {selectedPayment.user?.membershipLevel || 'normal'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Membership Upgrade */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-lg'>Membership Upgrade</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Previous Membership
                </p>
                <Badge variant='secondary' className='mt-1 capitalize'>
                  {selectedPayment.previousMembership || 'normal'}
                </Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Target Membership
                </p>
                <Badge className='mt-1 uppercase'>
                  {selectedPayment.targetMembership}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-lg'>Timeline</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Created At</p>
                <p className='font-medium'>
                  {formatDate(selectedPayment.createdAt)}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Updated At</p>
                <p className='font-medium'>
                  {formatDate(selectedPayment.updatedAt)}
                </p>
              </div>
              {selectedPayment.completedAt && (
                <div>
                  <p className='text-sm text-muted-foreground'>Completed At</p>
                  <p className='font-medium'>
                    {formatDate(selectedPayment.completedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedPayment.cancellationReason && (
            <>
              <Separator />
              <div className='space-y-3'>
                <h3 className='font-semibold text-lg'>Cancellation Details</h3>
                <div className='rounded-lg bg-destructive/10 p-4 border border-destructive/20'>
                  <p className='text-sm font-medium text-destructive mb-1'>
                    Reason for Cancellation:
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {selectedPayment.cancellationReason}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipsDetailsDialog;
