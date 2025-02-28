import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { PatientDrawer } from '../../features/patient/patient-drawer';
import { usePatientByIdQuery } from '../../features/patient/use-patient-query';

export const Component = () => {
  const { patientId } = useParams();
  ensure(patientId, 'id is required');
  const { data, isLoading } = usePatientByIdQuery(patientId);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Patient not found</div>;
  }
  return (
    <CustomDialog open={true}>
      <PatientDrawer mode="edit" defaultValues={data} patientId={patientId} />
    </CustomDialog>
  );
};
