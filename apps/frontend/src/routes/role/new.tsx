import { CustomDialog } from '../../component/custom-dialog';
import { RoleDrawer } from '../../features/role/role-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <RoleDrawer mode="create" />
    </CustomDialog>
  );
};
