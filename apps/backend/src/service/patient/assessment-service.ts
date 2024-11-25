import { CreateAssessmentRequest } from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class AssessmentService {
  upsert(visitId: string, assessment: CreateAssessmentRequest) {
    const { patientId, ...rest } = assessment;
    const user = useAuthUser();
    return dbClient.assessment.upsert({
      where: {
        visitId,
      },
      create: {
        ...rest,
        diagnosis: assessment.diagnosis || undefined,
        visitId,
        updatedBy: user.id,
      },
      update: {
        ...rest,
        diagnosis: assessment.diagnosis || undefined,
        updatedBy: user.id,
      },
    });
  }
}

export const assessmentService = new AssessmentService();
