import { CustomDialog } from '../../component/custom-dialog';
import { GrnDrawer } from '../../features/pharmacy/grn-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <GrnDrawer mode="create" />
    </CustomDialog>
  );
};
