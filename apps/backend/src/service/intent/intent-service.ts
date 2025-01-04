import {
  intentConverter,
  IntentResponse,
  IntentStatus,
  type CreateIntentRequest,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class IntentService {
  async create(data: CreateIntentRequest) {
    const user = useAuthUser();
    return await dbClient.intent.create({
      data: {
        createdBy: user.id,
        json: data,
        status: IntentStatus.Started,
        hospitalId: user.hospitalId,
      },
    });
  }

  async getAll(): Promise<IntentResponse[]> {
    const user = useAuthUser();
    const hospitalId = user.hospitalId;
    const res = await dbClient.intent.findMany({
      where: {
        hospitalId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.map(intentConverter);
  }
}

export const intentService = new IntentService();
