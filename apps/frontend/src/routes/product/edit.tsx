import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { ProductDrawer } from '../../features/product/product-drawer';
import { useProductByIdQuery } from '../../features/product/use-product-query';

export const Component = () => {
  const { id } = useParams();
  ensure(id, 'id is required');
  const { data, isLoading } = useProductByIdQuery(id);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Employee not found</div>;
  }
  return (
    <CustomDialog open={true}>
      <ProductDrawer
        mode="edit"
        defaultValues={{
          ...data,
          departmentIds: data.Department.map((d) => d.id),
        }}
        departmentId={id}
      />
    </CustomDialog>
  );
};
