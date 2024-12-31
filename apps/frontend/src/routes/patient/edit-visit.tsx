import { CreatePatientVisitRequest, ensure, Sure } from '@hospital/shared';
import { useParams } from 'react-router-dom';
import { CustomDialog } from '../../component/custom-dialog';
import { TableLoading } from '../../component/page-loader';
import { PatientVisitDrawer } from '../../features/patient/new-visit-drawer';
import { usePatientBillingAutoGenerateQuery } from '../../features/patient/use-patient-query';
import { usePatientVisitByIdQuery } from '../../features/patient/use-patient-visit';

export const Component = () => {
  const { patientId, visitId } = useParams();
  ensure(patientId, 'id is required');
  ensure(visitId, 'id is required');
  const { data, isLoading } = usePatientVisitByIdQuery({
    patientId,
    visitId,
  });
  const { data: billing, isLoading: isBillLoading } =
    usePatientBillingAutoGenerateQuery({
      patientId,
      visitId,
    });
  const advanceAmount =
    billing?.Receipt.reduce((acc, item) => acc + item.paid, 0) ?? 0;
  const cardAmount =
    billing?.Receipt.filter((acc) => acc.paymentMode === 'CARD').reduce(
      (acc, item) => {
        const oldAcc = acc.find((old) => old.bankAccountId === item.accountId);
        if (oldAcc) {
          oldAcc.amount += item.paid;
          return acc;
        }
        acc.push({
          amount: item.paid,
          bankAccountId: item.accountId!,
        });
        return acc;
      },
      [] as Sure<CreatePatientVisitRequest['billing']['cardAmount']>,
    ) ?? [];
  const cashAmount = billing?.Receipt.filter(
    (acc) => acc.paymentMode === 'CASH',
  ).reduce((acc, item) => acc + item.paid, 0);
  if (isLoading || isBillLoading)
    return (
      <CustomDialog open={true}>
        <TableLoading />
      </CustomDialog>
    );
  return (
    <CustomDialog open={true}>
      <PatientVisitDrawer
        visitId={visitId}
        defaultValues={{
          guardianName: data?.guardianName,
          guardianMobile: data?.guardianMobile,
          billing: {
            advanceAmount,
            cardAmount,
            cashAmount,
          },
          orders:
            data?.PatientOrder.order.map((order) => ({
              orderId: order.id,
              doctorId: data.PatientOrder.orderToDoctor?.[order.id] as
                | string
                | undefined,
            })) ?? [],
        }}
      />
    </CustomDialog>
  );
};
