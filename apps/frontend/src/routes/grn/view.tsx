import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { GrnDrawer } from '../../features/pharmacy/grn-drawer';
import { useGrnByIdQuery } from '../../features/pharmacy/use-pharmacy-query';

export const Component = () => {
  const { id } = useParams();
  ensure(id, 'id is required');
  const { data, isLoading } = useGrnByIdQuery(id);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Patient not found</div>;
  }
  return (
    <CustomDialog open={true}>
      <GrnDrawer mode="edit" defaultValues={data.json.grnLineItem} />
    </CustomDialog>
  );
};
