import { CreateAssessmentRequest } from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class AssessmentService {
  upsert(visitId: string, assessment: CreateAssessmentRequest) {
    const { patientId: uhid, ...rest } = assessment;
    const user = useAuthUser();
    return dbClient.assessment.upsert({
      where: {
        visitId,
      },
      create: {
        ...rest,
        uhid,
        diagnosis: assessment.diagnosis || undefined,
        doctorId: user.id,
        visitId,
      },
      update: {
        ...rest,
        diagnosis: assessment.diagnosis || undefined,
        doctorId: user.id,
        uhid,
      },
    });
  }
}

export const assessmentService = new AssessmentService();
