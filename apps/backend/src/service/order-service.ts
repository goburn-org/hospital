import { AvailableOrder, CONSULTATION_ORDER_TAG } from '@hospital/shared';
import { dbClient } from '../prisma';

class OrderService {
  async getAll(hospitalId: number): Promise<AvailableOrder[]> {
    const res = await dbClient.order.findMany({
      where: {
        hospitalId,
      },
      include: {
        department: true,
      },
    });
    return res.map((r) => ({
      description: r.description,
      id: r.id,
      name: r.name,
      departmentId: r.department?.id,
      departmentName: r.department?.name,
      baseAmount: r.baseAmount,
      consultationRequired: r.consultationRequired,
      maxDiscount: r.maxDiscount,
      taxCodeId: r.taxCodeId,
      tags: r.tags,
    }));
  }

  async getConsultationOrder(hospitalId: number): Promise<AvailableOrder> {
    const order = await dbClient.order.findFirst({
      where: {
        hospitalId,
        tags: {
          has: CONSULTATION_ORDER_TAG,
        },
      },
      include: {
        department: true,
      },
    });
    if (!order) {
      throw new Error('Consultation order not found');
    }
    return {
      description: order.description,
      id: order.id,
      name: order.name,
      departmentId: order.department?.id,
      departmentName: order.department?.name,
      baseAmount: order.baseAmount,
      consultationRequired: order.consultationRequired,
      maxDiscount: order.maxDiscount,
      taxCodeId: order.taxCodeId,
      tags: order.tags,
    };
  }
}

export const orderService = new OrderService();
