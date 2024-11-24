import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { useEmployeeByIdQuery } from '../../features/employee/use-employee-query';
import { EmployeeDrawer } from '../../features/employee/employee-drawer';

export const Component = () => {
  const { id } = useParams();
  ensure(id, 'id is required');
  const { data, isLoading } = useEmployeeByIdQuery(id);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Employee not found</div>;
  }
  return (
    <CustomDialog open={true}>
      <EmployeeDrawer
        mode="view"
        defaultValues={{ ...data, roles: data.UserRole.map((r) => r.roleId) }}
        departmentId={id}
      />
    </CustomDialog>
  );
};
