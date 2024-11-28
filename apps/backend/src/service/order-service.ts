import { AvailableOrder } from '@hospital/shared';
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
    }));
  }
}

export const orderService = new OrderService();
