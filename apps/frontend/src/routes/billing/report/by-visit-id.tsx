import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../../component/custom-dialog';
import { VisitList } from '../../../features/billing/out-patient/op-visit-history';

export const Component = () => {
  const { patientId } = useParams();
  ensure(patientId, 'Patient ID is required');
  return (
    <CustomDialog open={true}>
      <VisitList patientId={patientId} />
    </CustomDialog>
  );
};
