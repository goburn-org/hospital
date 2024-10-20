import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { DepartmentDrawer } from '../../features/department/department-drawer';
import { useDepartmentByIdQuery } from '../../features/department/use-department-query';

export const Component = () => {
  const { id } = useParams();
  ensure(id, 'id is required');
  const { data, isLoading } = useDepartmentByIdQuery(id);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Role not found</div>;
  }
  return (
    <CustomDialog open={true}>
      <DepartmentDrawer mode="view" defaultValues={data} departmentId={id} />
    </CustomDialog>
  );
};
