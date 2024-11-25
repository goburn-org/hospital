import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { RoleDrawer } from '../../features/role/role-drawer';
import { useRoleByIdQuery } from '../../features/role/use-role-query';

export const Component = () => {
  const { id } = useParams();
  ensure(id, 'id is required');
  const { data, isLoading } = useRoleByIdQuery(id);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Role not found</div>;
  }
  return (
    <CustomDialog open={true}>
      <RoleDrawer mode="edit" defaultValues={data} roleId={id} />
    </CustomDialog>
  );
};
