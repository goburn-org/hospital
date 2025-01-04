import { CustomDialog } from '../../component/custom-dialog';
import { CounterSaleDrawer } from '../../features/pharmacy/counter-sale-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <CounterSaleDrawer mode="create" />
    </CustomDialog>
  );
};
