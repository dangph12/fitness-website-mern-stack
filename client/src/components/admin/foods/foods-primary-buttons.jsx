import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../../ui/button';

export function FoodsPrimaryButtons() {
  const navigate = useNavigate();

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => navigate('/admin/manage-foods/create')}>
        <Plus className='mr-2 h-4 w-4' />
        Create Food
      </Button>
    </div>
  );
}
