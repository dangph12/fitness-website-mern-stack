import { FoodsActionDialog } from './foods-action-dialog';
import { FoodsDeleteDialog } from './foods-delete-dialog';
import { FoodsDetailsDialog } from './foods-details-dialog';

export function FoodsDialogs() {
  return (
    <>
      <FoodsDetailsDialog />
      <FoodsActionDialog />
      <FoodsDeleteDialog />
    </>
  );
}
