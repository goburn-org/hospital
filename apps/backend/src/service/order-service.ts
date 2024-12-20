import {
  AvailableOrder,
  CONSULTATION_ORDER_TAG,
  orderConverter,
} from '@hospital/shared';
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
    return res.map((r) => orderConverter.to(r));
  }

  async getOrdersByIds(ids: string[]): Promise<AvailableOrder[]> {
    const res = await dbClient.order.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        department: true,
      },
    });
    return res.map((r) => orderConverter.to(r));
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
    return orderConverter.to(order);
  }
}

export const orderService = new OrderService();
