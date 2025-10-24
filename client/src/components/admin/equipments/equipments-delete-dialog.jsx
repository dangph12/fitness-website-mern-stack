'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { deleteEquipment } from '~/store/features/equipment-slice';

import { useEquipments } from './equipments-provider';

export function EquipmentsDeleteDialog({
  open,
  onOpenChange,
  equipmentIds = [],
  equipmentTitle = '',
  isBulkDelete = false
}) {
  const dispatch = useDispatch();
  const { refreshData, setSelectedEquipments } = useEquipments();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      if (isBulkDelete) {
        // Delete multiple equipments
        await Promise.all(
          equipmentIds.map(id => dispatch(deleteEquipment(id)).unwrap())
        );
        toast.success(`${equipmentIds.length} equipments deleted successfully`);
        // Clear selection after bulk delete
        setSelectedEquipments([]);
      } else {
        // Delete single equipment
        await dispatch(deleteEquipment(equipmentIds[0])).unwrap();
        toast.success('Equipment deleted successfully');
      }

      refreshData();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete equipment(s)');
    } finally {
      setLoading(false);
    }
  };

  const getDialogContent = () => {
    if (isBulkDelete) {
      return {
        title: `Delete ${equipmentIds.length} Equipments`,
        description: `Are you sure you want to delete ${equipmentIds.length} selected equipments? This action cannot be undone.`
      };
    } else {
      return {
        title: 'Delete Equipment',
        description: `Are you sure you want to delete "${equipmentTitle}"? This action cannot be undone.`
      };
    }
  };

  const { title, description } = getDialogContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
