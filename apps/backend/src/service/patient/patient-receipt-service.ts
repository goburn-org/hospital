import {
  CreatePatientVisitReceiptRequest,
  VisitBillingAggregationByPatientId,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientReceiptService {
  async create(
    data: CreatePatientVisitReceiptRequest,
  ): Promise<VisitBillingAggregationByPatientId['receipt'][number]> {
    const user = useAuthUser();
    const { isCash, ...rest } = data;
    const res = await dbClient.receipt.create({
      data: {
        ...rest,
        paymentMode: isCash ? 'CASH' : 'CARD',
        hospitalId: user.hospitalId,
        updatedBy: user.id,
      },
    });
    return {
      receiptId: res.id,
      billId: res.billId,
      paid: res.paid,
      reason: res.reason,
    };
  }

  async getBill(
    visitId: string,
  ): Promise<VisitBillingAggregationByPatientId['receipt']> {
    const data = await dbClient.receipt.findMany({
      where: {
        visitId,
      },
    });
    return data.map((d) => ({
      receiptId: d.id,
      billId: d.billId,
      paid: d.paid,
      reason: d.reason,
    }));
  }
}

export const patientReceiptService = new PatientReceiptService();
