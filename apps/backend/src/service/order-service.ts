import { AvailableOrder } from '@hospital/shared';
import { dbClient } from '../prisma';

class OrderService {
  async getAll(hospitalId: number): Promise<AvailableOrder[]> {
    const res = await dbClient.order.findMany({
      where: {
        hospitalId,
      },
      include: {
        orderDept: true,
      },
    });
    return res.map((r) => ({
      description: r.description,
      id: r.id,
      name: r.name,
      orderDeptId: r.orderDept.id,
      orderDeptName: r.orderDept.nane,
    }));
  }
}

export const orderService = new OrderService();
