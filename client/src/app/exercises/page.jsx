import React from 'react';

import EquipmentList from '~/components/equipment-list';
import MuscleList from '~/components/muscle-list';

function page() {
  return (
    <div>
      <MuscleList />
      <EquipmentList />
    </div>
  );
}

export default page;
