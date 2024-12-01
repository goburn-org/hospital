import {
  AllPatientVisitBillingResponse,
  AvailableOrder,
  CreatePatientBillingRequest,
  HttpError,
  PaginatedResponse,
  PaginateParamsWithSort,
  VisitBillingAggregationByPatientId,
} from '@hospital/shared';
import { dbClient } from '../../prisma';
import { useAuthUser } from '../../provider/async-context';

class PatientBillingService {
  async upsert(visitId: string, data: CreatePatientBillingRequest) {
    const user = useAuthUser();
    return dbClient.visitBilling.upsert({
      where: {
        visitId,
      },
      create: {
        visitId,
        hospitalId: user.hospitalId,
        ...data,
      },
      update: {
        ...data,
      },
    });
  }

  async getBillingAndReceipt(visitIds: string[]) {
    const billingPromise = dbClient.bill.findMany({
      where: {
        visitId: {
          in: visitIds.map((v) => v),
        },
      },
    });
    const receiptPromise = dbClient.receipt.findMany({
      where: {
        visitId: {
          in: visitIds.map((v) => v),
        },
      },
    });
    const [billing, receipt] = await Promise.all([
      billingPromise,
      receiptPromise,
    ]);
    const byVisit = visitIds.map((v) => ({
      visitId: v,
      billing: billing
        .filter((b) => b.visitId === v)
        .map((b) => ({
          billId: b.visitId,
          total: b.totalAmount,
        })),
      receipt: receipt
        .filter((r) => r.visitId === v)
        .map((r) => ({
          receiptId: r.id,
          billId: r.billId,
          paid: r.paid,
          reason: r.reason,
          mode: r.paymentMode,
        })),
    }));
    return byVisit;
  }

  async getByPatientId(
    patientId: string,
  ): Promise<VisitBillingAggregationByPatientId[]> {
    const visits = await dbClient.patientVisit.findMany({
      where: {
        uhid: patientId,
      },
    });

    return this.getBillingAndReceipt(visits.map((v) => v.id));
  }

  async getAll(
    param: PaginateParamsWithSort,
  ): Promise<PaginatedResponse<AllPatientVisitBillingResponse>> {
    const last24Hours = new Date();
    const { paginate, sort } = param || {};
    const authUser = useAuthUser();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const visits = await dbClient.patientVisit.findMany({
      where: {
        checkInTime: {
          gte: last24Hours,
        },
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
      orderBy: sort
        ? {
            [sort.field]: sort.order,
          }
        : undefined,
      take: paginate ? paginate.limit : undefined,
      include: {
        Patient: true,
      },
      skip: paginate ? paginate.limit * (paginate.page - 1) : undefined,
    });
    const total = await dbClient.patient.count({
      where: {
        hospitalId: authUser.hospitalId,
        isDeleted: false,
      },
    });
    const byVisit = await this.getBillingAndReceipt(visits.map((v) => v.id));
    return {
      data: visits.map((v) => ({
        patient: {
          city: v.Patient.city,
          lastVisit: v.checkInTime,
          mobile: v.Patient.mobile,
          name: v.Patient.name,
          uhid: v.Patient.uhid,
        },
        lastVisit: {
          visitId: v.id,
          billing: byVisit.find((b) => b.visitId === v.id)?.billing ?? [],
          receipt: byVisit.find((b) => b.visitId === v.id)?.receipt ?? [],
        },
      })),
      meta: {
        total,
        page: paginate?.page ?? 1,
        limit: paginate?.limit ?? total,
      },
    };
  }

  async createOutpatientBilling(
    visitId: string,
    isConsultation: boolean,
    order: AvailableOrder,
  ) {
    const authUser = useAuthUser();
    const taxCode = await dbClient.taxCode.findFirst({
      where: {
        id: order.taxCodeId,
      },
    });
    if (!taxCode) {
      throw new HttpError('Invalid tax code', 400);
    }
    const totalAmount = order.baseAmount * taxCode.taxRate + order.baseAmount;
    if (isConsultation) {
      const consultation =
        await dbClient.billingConsultationOrderLineItem.create({
          data: {
            discount: 0,
            quantity: 1,
            orderId: order.id,
            rate: order.baseAmount,
            tax: taxCode?.taxRate ?? 0,
            visitId,
            hospitalId: authUser.hospitalId,
            updatedBy: authUser.id,
            totalAmount,
          },
        });
      await dbClient.bill.upsert({
        where: {
          id: `out-${visitId}`,
        },
        create: {
          id: `out-${visitId}`,
          hospitalId: authUser.hospitalId,
          updatedBy: authUser.id,
          BillingConsultationOrderLineItem: {
            connect: {
              id: consultation.id,
            },
          },
          totalAmount,
          visitId: visitId,
          items: {},
        },
        update: {
          totalAmount: {
            increment: totalAmount,
          },
          BillingConsultationOrderLineItem: {
            set: {
              id: consultation.id,
            },
          },
        },
      });
    } else {
      const billing = await dbClient.billingPatientOrderLineItem.create({
        data: {
          discount: 0,
          quantity: 1,
          orderId: order.id,
          rate: order.baseAmount,
          tax: taxCode?.taxRate ?? 0,
          visitId,
          hospitalId: authUser.hospitalId,
          updatedBy: authUser.id,
          totalAmount,
        },
      });
      await dbClient.bill.upsert({
        where: {
          id: `out-${visitId}`,
        },
        create: {
          id: `out-${visitId}`,
          hospitalId: authUser.hospitalId,
          updatedBy: authUser.id,
          BillingPatientOrderLineItem: {
            connect: {
              id: billing.id,
            },
          },
          totalAmount,
          visitId: visitId,
          items: {},
        },
        update: {
          totalAmount: {
            increment: totalAmount,
          },
          BillingConsultationOrderLineItem: {
            set: {
              id: billing.id,
            },
          },
        },
      });
    }
  }
}

export const patientBillingService = new PatientBillingService();
