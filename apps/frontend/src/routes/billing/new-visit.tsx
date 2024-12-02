import { useNavigate } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { OutsideClick } from '../../component/outside-click';
import { BillingReport } from '../../features/patient/billing-report';

export const Component = () => {
  const navigate = useNavigate();
  return (
    <OutsideClick
      onOutsideClick={() => {
        navigate('..', {
          replace: true,
        });
      }}
    >
      <CustomDialog open={true}>
        <BillingReport />
      </CustomDialog>
    </OutsideClick>
  );
};
