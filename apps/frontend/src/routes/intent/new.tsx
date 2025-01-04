import { CustomDialog } from '../../component/custom-dialog';
import { IntentDrawer } from '../../features/pharmacy/intent-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <IntentDrawer mode="create" />
    </CustomDialog>
  );
};
