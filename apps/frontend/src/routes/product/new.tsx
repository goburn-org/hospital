import { CustomDialog } from '../../component/custom-dialog';
import { ProductDrawer } from '../../features/product/product-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <ProductDrawer mode="create" />
    </CustomDialog>
  );
};
