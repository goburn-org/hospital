import {
  CreatePatientBillingRequest,
  Receipt,
  ReceiptReport,
  VisitBillingAggregationByPatientId,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientReceiptService {
  async create(
    visitId: string,
    data: CreatePatientBillingRequest,
  ): Promise<VisitBillingAggregationByPatientId['receipt']> {
    const user = useAuthUser();
    const res: Receipt[] = [];
    if (data.cashAmount) {
      res.push(
        await dbClient.receipt.create({
          data: {
            visitId,
            paid: data.cashAmount,
            reason: 'Cash Payment',
            hospitalId: user.hospitalId,
            paymentMode: 'CASH',
            billId: data.billId,
            items: data.items,
            updatedBy: user.id,
          },
        }),
      );
    }
    if (data.cardAmount.length) {
      res.push(
        ...(await dbClient.receipt.createManyAndReturn({
          data: data.cardAmount.map((c, idx) => ({
            visitId,
            paid: c.amount,
            reason: `Card ${idx + 1} / ${data.cardAmount.length} Payment`,
            accountId: c.bankAccountId,
            hospitalId: user.hospitalId,
            paymentMode: 'CARD',
            billId: data.billId,
            items: data.items,
            updatedBy: user.id,
          })),
        })),
      );
    }
    return res.map((d) => ({
      receiptId: d.id,
      billId: d.billId,
      paid: d.paid,
      reason: d.reason,
    }));
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
    const result: ReceiptReport = {
      accountDetails: [],
      details: [],
      byEmp: [],
    };
    for (const item of data) {
      const date = item.updatedAt.toISOString().split('T')[0];
      const createdAt = item.updatedAt;
      const cash = item.paymentMode === 'CASH' ? item.paid : 0;
      const card = item.paymentMode === 'CARD' ? item.paid : 0;
      const cardDetails: ReceiptReport['accountDetails'][number] | null =
        item.accountId
          ? {
              bankAccountId: item.accountId,
              amount: item.paid,
              date,
              createdAt,
              receiptId: item.id,
            }
          : null;
      const empDetails: ReceiptReport['byEmp'][number] | null = cash
        ? {
            empId: item.updatedBy,
            cashAmount: item.paid,
            date,
            createdAt,
            receiptId: item.id,
          }
        : null;
      if (empDetails) {
        result.byEmp.push(empDetails);
      }
      if (cardDetails) {
        result.accountDetails.push(cardDetails);
      }
      const index = result.details.findIndex((r) => r.date === date);
      if (index === -1) {
        result.details.push({ date, cash, card });
      } else {
        result.details[index].cash += cash;
        result.details[index].card += card;
      }
    }
    return result;
  }
}

export const patientReceiptService = new PatientReceiptService();
