import { MealsProvider } from '~/components/admin/meals/meals-provider';
import { MealsTable } from '~/components/admin/meals/meals-table';

export default function ManageMealsPage() {
  return (
    <MealsProvider>
      <div className='space-y-6'>
        <MealsTable />
      </div>
    </MealsProvider>
  );
}
