import { Diagnosis, PaginatedResponse, PaginateParams } from '@hospital/shared';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class DiagnosisService {
  async get(
    search: string,
    paginate: PaginateParams,
  ): Promise<PaginatedResponse<Diagnosis>> {
    const user = useAuthUser();
    const data = await dbClient.diagnosis.findMany({
      where: {
        hospitalId: user.hospitalId,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: paginate ? paginate.limit : undefined,
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
    });
    const total = await dbClient.product.count({
      where: {
        hospitalId: user.hospitalId,
      },
    });
    return {
      data,
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }
}

export const diagnosisService = new DiagnosisService();
