'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';

import { EquipmentsDeleteDialog } from './equipments-delete-dialog';
import { useEquipments } from './equipments-provider';
export function EquipmentsPrimaryButtons() {
  const { selectedEquipments = [] } = useEquipments();
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const handleBulkDelete = () => {
    setShowBulkDeleteDialog(true);
  };
  const handleCreateEquipment = () => {
    navigate('/admin/manage-equipments/create');
  };

  return (
    <>
      <div className='flex items-center space-x-2'>
        {selectedEquipments.length > 0 && (
          <Button
            onClick={handleBulkDelete}
            size='sm'
            variant='destructive'
            className='h-8'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete ({selectedEquipments.length})
          </Button>
        )}

        <Button onClick={handleCreateEquipment} size='sm' className='h-8'>
          <Plus className='mr-2 h-4 w-4' />
          Create Equipment
        </Button>
      </div>

      <EquipmentsDeleteDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        equipmentIds={selectedEquipments}
        isBulkDelete={true}
      />
    </>
  );
}
