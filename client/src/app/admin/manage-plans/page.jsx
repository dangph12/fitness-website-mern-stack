import { PlansProvider } from '~/components/admin/plans/plans-provider';
import { PlansTable } from '~/components/admin/plans/plans-table';

export default function ManagePlansPage() {
  return (
    <PlansProvider>
      <div className='space-y-6'>
        <PlansTable />
      </div>
    </PlansProvider>
  );
}
