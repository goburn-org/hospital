import {
  CreatePatientVitalRequest,
  CreatePatientVitalResponse,
  patientVitalConverter,
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
        temperature: vital.temperature || [],
        spo2: vital.spo2 || [],
        pulse: vital.pulse || [],
        bp: vital.bp || [],
      },
      where: {
        visitId,
      },
      update: {
        ...vital,
        updatedBy: authUser.id,
        temperature: vital.temperature || [],
        spo2: vital.spo2 || [],
        pulse: vital.pulse || [],
        bp: vital.bp || [],
      },
    });
    return patientVitalConverter.from(res);
  }
}

export const patientVitalService = new PatientVitalService();
