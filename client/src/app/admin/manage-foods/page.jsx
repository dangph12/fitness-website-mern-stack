import { FoodsDialogs } from '../../../components/admin/foods/foods-dialogs';
import { FoodsProvider } from '../../../components/admin/foods/foods-provider';
import { FoodsTable } from '../../../components/admin/foods/foods-table';

export default function ManageFoodsPage() {
  return (
    <FoodsProvider>
      <div className='space-y-4'>
        <FoodsTable />
        <FoodsDialogs />
      </div>
    </FoodsProvider>
  );
}
