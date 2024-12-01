import { CustomDialog } from '../../component/custom-dialog';
import { PatientVisitDrawer } from '../../features/patient/new-visit-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <PatientVisitDrawer />
    </CustomDialog>
  );
};
