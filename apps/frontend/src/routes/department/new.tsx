import { CustomDialog } from '../../component/custom-dialog';
import { DepartmentDrawer } from '../../features/department/department-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <DepartmentDrawer mode="create" />
    </CustomDialog>
  );
};
