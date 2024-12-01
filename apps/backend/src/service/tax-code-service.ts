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

  async getTaxCodes(ids: number[]): Promise<Record<string, TaxCodeResponse>> {
    const taxCodes = await dbClient.taxCode.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return taxCodes.reduce(
      (acc, taxCode) => {
        acc[taxCode.id] = taxCode;
        return acc;
      },
      {} as Record<string, TaxCodeResponse>,
    );
  }
}

export const taxCodeService = new TaxCodeService();
