import { CustomDialog } from '../../component/custom-dialog';
import { CheckoutDrawer } from '../../features/patient/checkout-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <CheckoutDrawer mode="create" />
    </CustomDialog>
  );
};
