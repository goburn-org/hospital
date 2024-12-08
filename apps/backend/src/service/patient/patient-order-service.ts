import {
  AvailableOrder,
  BillingOrderReport,
  CreatePatientOrderRequest,
  Maybe,
  PaginateParamsWithSort,
  PatientOrderResponse,
} from '@hospital/shared';
import { logger } from '../../logger/logger-service';
import { dbClient } from '../../prisma';

class PatientOrderService {
  async upsert(
    visitId: string,
    body: CreatePatientOrderRequest,
  ): Promise<PatientOrderResponse> {
    try {
      await dbClient.patientOrder.delete({
        where: {
          visitId,
        },
      });
    } catch (e) {
      logger.log('patient order failed to delete', e);
    }
    const res = await dbClient.patientOrder.create({
      data: {
        visitId,
        orderDate: new Date(),
        order: {
          connect: body.order?.map((o) => ({ id: o.id })),
        },
        remark: body.order?.reduce(
          (acc, o) => ({
            ...acc,
            [o.id]: o.remark,
          }),
          {},
        ),
      },
      include: {
        order: true,
        PatientVisit: true,
      },
    });
    const remarks = (res.remark as Record<string, Maybe<string>>) || {};
    return {
      ...res,
      order: res.order.map((o) => ({ id: o.id, remark: remarks[o.id] })),
      patientId: res.PatientVisit.uhid,
      visitId: res.visitId,
    };
  }

  async getByVisitId(visitId: string): Promise<AvailableOrder[]> {
    const res = await dbClient.patientOrder.findFirst({
      where: {
        visitId,
      },
      include: {
        order: true,
        PatientVisit: true,
      },
    });
    if (!res) {
      return [];
    }
    return res.order;
  }

  async getVisitByOrderHistory(
    hospitalId: number,
    options?: PaginateParamsWithSort,
  ): Promise<BillingOrderReport> {
    const { paginate } = options || {};
    const res = await dbClient.billingPatientOrderLineItem.findMany({
      where: {
        hospitalId,
        isRemoved: false,
        order: {
          name: {
            contains: options?.search ?? '',
            mode: 'insensitive',
          },
        },
      },
      include: {
        order: true,
        Visit: {
          include: {
            Patient: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await dbClient.billingPatientOrderLineItem.count({
      where: {
        hospitalId,
        isRemoved: false,
        order: {
          name: {
            contains: options?.search ?? '',
            mode: 'insensitive',
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

export const patientOrderService = new PatientOrderService();
