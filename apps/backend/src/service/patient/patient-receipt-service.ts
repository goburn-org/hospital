import {
  CreatePatientVisitReceiptRequest,
  ReceiptReport,
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

  async getReport() {
    const user = useAuthUser();
    const data = await dbClient.receipt.findMany({
      where: {
        hospitalId: user.hospitalId,
      },
    });
    const result: ReceiptReport[] = [];
    for (const item of data) {
      const date = item.updatedAt.toISOString().split('T')[0];
      const cash = item.paymentMode === 'CASH' ? item.paid : 0;
      const card = item.paymentMode === 'CARD' ? item.paid : 0;
      const index = result.findIndex((r) => r.date === date);
      if (index === -1) {
        result.push({ date, cash, card });
      } else {
        result[index].cash += cash;
        result[index].card += card;
      }
    }
    return result;
  }
}

export const patientReceiptService = new PatientReceiptService();
