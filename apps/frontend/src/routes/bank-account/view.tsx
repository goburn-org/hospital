import { ensure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { BankAccountDrawer } from '../../features/bank-account/bank-account-drawer';
import { useBankAccounts } from '../../provider/use-bank-account';

export const Component = () => {
  const { id } = useParams();
  ensure(id, 'id is required');
  const { data, isLoading } = useBankAccounts();
  const value = data?.find((d) => d.id === Number(id));
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!data) {
    return <div>Employee not found</div>;
  }
  return (
    <CustomDialog open={true}>
      <BankAccountDrawer mode="view" defaultValues={value} accountId={id} />
    </CustomDialog>
  );
};
