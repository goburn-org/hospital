import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { PatientDrawer } from '../../features/patient/patient-drawer';
import { usePatientByIdQuery } from '../../features/patient/use-patient-query';

export const Component = () => {
  const { id } = useParams();
  ensure(id, 'id is required');
  const { data, isLoading } = usePatientByIdQuery(id);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Patient not found</div>;
  }
  return (
    <CustomDialog open={true}>
      <PatientDrawer mode="edit" defaultValues={data} departmentId={id} />
    </CustomDialog>
  );
};
