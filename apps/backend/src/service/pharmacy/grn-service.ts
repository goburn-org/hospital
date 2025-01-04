import { CreateGrnRequest, GRN } from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class GrnService {
  async create(data: CreateGrnRequest) {
    const user = useAuthUser();
    return await dbClient.gRN.create({
      data: {
        createdBy: user.id,
        json: data,
        hospitalId: user.hospitalId,
      },
    });
  }

  async getAll(): Promise<GRN[]> {
    const user = useAuthUser();
    const hospitalId = user.hospitalId;
    return dbClient.gRN.findMany({
      where: {
        hospitalId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getById(id: string): Promise<GRN | null> {
    const user = useAuthUser();
    const hospitalId = user.hospitalId;
    return dbClient.gRN.findUnique({
      where: {
        hospitalId,
        id,
      },
    });
  }
}

export const grnService = new GrnService();
