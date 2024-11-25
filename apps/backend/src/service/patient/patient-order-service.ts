import {
  CreatePatientOrderRequest,
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
      },
      include: {
        order: true,
        PatientVisit: true,
      },
    });
    return {
      ...res,
      order: res.order.map((o) => ({ id: o.id })),
      patientId: res.PatientVisit.uhid,
      visitId: res.visitId,
    };
  }
}

export const patientOrderService = new PatientOrderService();
