'use client';

import { EquipmentsProvider } from '~/components/admin/equipments/equipments-provider';
import { EquipmentsTable } from '~/components/admin/equipments/equipments-table';

export default function ManageEquipmentsPage() {
  return (
    <EquipmentsProvider>
      <div className='space-y-6'>
        <EquipmentsTable />
      </div>
    </EquipmentsProvider>
  );
}
