import { CustomDialog } from '../../component/custom-dialog';
import { BankAccountDrawer } from '../../features/bank-account/bank-account-drawer';

export const Component = () => {
  return (
    <CustomDialog open={true}>
      <BankAccountDrawer mode="create" />
    </CustomDialog>
  );
};
