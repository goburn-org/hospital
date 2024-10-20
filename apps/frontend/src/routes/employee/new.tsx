import { CustomDialog } from '../../component/custom-dialog';
import { EmployeeDrawer } from '../../features/employee/employee-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <EmployeeDrawer mode="create" />
    </CustomDialog>
  );
};
