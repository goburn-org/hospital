import {
  CounterSaleResponse,
  getToday,
  getYesterday,
  PaginatedResponse,
  PaginateParamsWithSort,
} from '@hospital/shared';
import { dbClient } from '../../prisma';

class PharmacyService {
  async getAll({
    hospitalId,
    options,
  }: {
    hospitalId: number;
    options: PaginateParamsWithSort;
  }): Promise<PaginatedResponse<CounterSaleResponse>> {
    const { paginate, sort } = options || {};
    const yesterday = getYesterday();
    const today = getToday();
    const res = await dbClient.counterSale.findMany({
      where: {
        AND: [
          {
            updatedAt: {
              gte: yesterday,
              lte: today,
            },
          },
        ],
      },
      include: {
        CounterSaleBill: true,
        CounterItem: {
          include: {
            sku: true,
          },
        },
      },
      take: paginate ? paginate.limit : undefined,
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
      orderBy: {
        createdAt: sort?.order ?? 'desc',
      },
    });
    const total = await dbClient.patientPrescription.count({
      where: {
        updatedAt: {
          gte: yesterday,
          lte: today,
        },
        Visit: {
          Patient: {
            hospitalId,
          },
        },
      },
    });
    return {
      data: res,
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }
}

export const pharmacyService = new PharmacyService();
