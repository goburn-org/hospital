import { CreatePatientVisitReceiptRequest } from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientReceiptService {
  create(data: CreatePatientVisitReceiptRequest) {
    const user = useAuthUser();
    return dbClient.receipt.create({
      data: {
        ...data,
        updatedBy: user.id,
      },
    });
  }
}

export const patientReceiptService = new PatientReceiptService();
