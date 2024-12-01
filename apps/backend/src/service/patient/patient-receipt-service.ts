import { CreatePatientVisitReceiptRequest } from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientReceiptService {
  create(data: CreatePatientVisitReceiptRequest) {
    const user = useAuthUser();
    const { isCash, ...rest } = data;
    return dbClient.receipt.create({
      data: {
        ...rest,
        paymentMode: isCash ? 'CASH' : 'CARD',
        hospitalId: user.hospitalId,
        updatedBy: user.id,
      },
    });
  }
}

export const patientReceiptService = new PatientReceiptService();
