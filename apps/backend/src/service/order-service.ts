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
      baseAmount: r.baseAmount,
      consultationRequired: r.consultationRequired,
      maxDiscount: r.maxDiscount,
      taxCodeId: r.taxCodeId,
      tags: r.tags,
    }));
  }
}

export const orderService = new OrderService();
