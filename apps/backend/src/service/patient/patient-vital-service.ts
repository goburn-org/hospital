import {
  CreatePatientVitalRequest,
  CreatePatientVitalResponse,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientVitalService {
  async upsert(
    visitId: string,
    vital: CreatePatientVitalRequest,
  ): Promise<CreatePatientVitalResponse> {
    const authUser = useAuthUser();
    const res = await dbClient.patientVital.upsert({
      create: {
        visitId,
        ...vital,
        updatedBy: authUser.id,
      },
      where: {
        visitId,
      },
      update: {
        ...vital,
        updatedBy: authUser.id,
      },
    });
    return res;
  }
}

export const patientVitalService = new PatientVitalService();
