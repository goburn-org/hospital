import { CreatePatientPrescriptionRequest } from '@hospital/shared';
import { dbClient } from '../../prisma';

class PatientPrescriptionService {
  upsert(visitId: string, data: CreatePatientPrescriptionRequest) {
    return dbClient.patientPrescription.upsert({
      where: {
        visitId,
      },
      create: {
        list: data,
        visitId: visitId,
      },
      update: {
        list: data,
      },
    });
  }
}

export const patientPrescriptionService = new PatientPrescriptionService();
