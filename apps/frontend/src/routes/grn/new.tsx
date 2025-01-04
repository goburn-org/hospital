import { CustomDialog } from '../../component/custom-dialog';
import { PatientDrawer } from '../../features/patient/patient-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <PatientDrawer mode="create" />
    </CustomDialog>
  );
};
