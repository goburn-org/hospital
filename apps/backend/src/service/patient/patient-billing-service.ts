import { CreatePatientBillingRequest } from '@hospital/shared';
import { dbClient } from '../../prisma';

class PatientBillingService {
  async upsert(visitId: string, data: CreatePatientBillingRequest) {
    return dbClient.visitBilling.upsert({
      where: {
        visitId,
      },
      create: {
        visitId,
        ...data,
      },
      update: {
        ...data,
      },
    });
  }
}

export const patientBillingService = new PatientBillingService();
