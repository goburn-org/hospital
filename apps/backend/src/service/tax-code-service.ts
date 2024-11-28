import { TaxCodeRequest, TaxCodeResponse } from '@hospital/shared';
import { dbClient } from '../prisma';
import { useAuthUser } from '../provider/async-context';

class TaxCodeService {
  async create(data: TaxCodeRequest): Promise<TaxCodeResponse> {
    const user = useAuthUser();
    return dbClient.taxCode.create({
      data: {
        ...data,
        hospitalId: user.hospitalId,
        updatedBy: user.id,
      },
    });
  }
}

export const taxCodeService = new TaxCodeService();
