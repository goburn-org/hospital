import {
  AllOrderTokenResponse,
  AvailableOrder,
  BillingOrderReport,
  CreatePatientOrderRequest,
  getToday,
  getYesterday,
  Maybe,
  OrderTokenResponse,
  PaginateParamsWithSort,
  PatientOrderResponse,
} from '@hospital/shared';
import { logger } from '../../logger/logger-service';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

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
        doctorIds: body.doctorIds,
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
      doctorIds: res.doctorIds as Record<string, string>,
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

  async getTotalOrder(): Promise<AllOrderTokenResponse> {
    const user = useAuthUser();
    const yesterday = getYesterday();
    const today = getToday();
    const orders = await dbClient.patientOrder.findMany({
      where: {
        PatientVisit: {
          hospitalId: user.hospitalId,
        },
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
      include: {
        order: true,
      },
    });
    const paidOrder = await dbClient.billingPatientOrderLineItem.findMany({
      where: {
        hospitalId: user.hospitalId,
        isRemoved: false,
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
      include: {
        order: true,
      },
    });
    const orderIds = orders.map((o) => o.order).flat();
    const paidOrderIds = paidOrder.map((o) => o.order).flat();
    const countByOrderId = orderIds.reduce(
      (acc, o) => ({
        ...acc,
        [o.id]: {
          orderName: o.name,
          total: acc[o.id] ? acc[o.id].total + 1 : 1,
          completed: paidOrderIds.filter((po) => po.id === o.id).length,
        },
      }),
      {} as AllOrderTokenResponse,
    );
    return countByOrderId;
  }

  async getToken(orderId: string): Promise<OrderTokenResponse> {
    const user = useAuthUser();
    const yesterday = getYesterday();
    const today = getToday();
    const orders = await dbClient.patientOrder.findMany({
      where: {
        PatientVisit: {
          hospitalId: user.hospitalId,
        },
        createdAt: {
          gte: yesterday,
          lt: today,
        },
        order: {
          some: {
            id: orderId,
          },
        },
      },
      include: {
        order: true,
      },
    });
    const paidOrder = await dbClient.billingPatientOrderLineItem.findMany({
      where: {
        hospitalId: user.hospitalId,
        isRemoved: false,
        createdAt: {
          gte: yesterday,
          lt: today,
        },
        order: {
          id: orderId,
        },
      },
      include: {
        order: true,
      },
    });
    const countByOrderId = {
      orderName: orders[0]?.order[0]?.name,
      total: orders.length,
      completed: paidOrder.length,
    };
    return countByOrderId;
  }
}

export const patientOrderService = new PatientOrderService();
